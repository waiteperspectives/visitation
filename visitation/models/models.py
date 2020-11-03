import datetime
from odoo import models, fields, api, _

# entities
class VisitationContent(models.Model):
    _name = "visitation.content"
    _description = "CMS - Visitation Content"
    _rec_name = "key"

    key = fields.Char(required=True)
    value = fields.Text(required=True)


class ResidentUnit(models.Model):
    _name = "resident.unit"
    _description = "Resident Unit"

    name = fields.Char(required=True, string="Unit Name")
    active = fields.Boolean(default=True)


class ResidentRoom(models.Model):
    _name = "resident.room"
    _description = "Resident Room"

    name = fields.Char(string="Room Number")
    active = fields.Boolean(default=True)


class ResidentBed(models.Model):
    _name = "resident.bed"
    _description = "Resident Bed Position"

    name = fields.Char(compute="_compute_name")
    active = fields.Boolean(default=True)
    bed_position = fields.Selection(
        [
            ("left", "Left"),
            ("right", "Right"),
        ],
        required=True,
    )

    unit_id = fields.Many2one(comodel_name="resident.unit", required=True)
    room_id = fields.Many2one(comodel_name="resident.room", required=True)

    def _compute_name(self):
        for record in self:
            record.name = "%s - %s - %s" % (
                record.unit_id.name,
                record.room_id.name,
                dict(record._fields["bed_position"].selection).get(record.bed_position),
            )


class AvailabilitySlot(models.Model):
    _name = "availability.slot"
    _description = "Availability slot"

    name = fields.Char(compute="_compute_name")
    availability_start_time = fields.Datetime(required=True)
    availability_end_time = fields.Datetime(required=True)
    capacity = fields.Integer(default=0)

    def _compute_name(self):
        for record in self:
            record.name = "%s - %s" % (
                datetime.datetime.strftime(
                    record.availability_start_time, "%Y-%m-%d %H:%M"
                ),
                datetime.datetime.strftime(
                    record.availability_end_time, "%Y-%m-%d %H:%M"
                ),
            )
        return True


class Visitor(models.Model):
    _name = "visitor.visitor"
    _description = "visitor"

    name = fields.Char(required=True)
    email = fields.Char(required=True)
    street = fields.Char()
    street2 = fields.Char()
    zip = fields.Char()
    city = fields.Char()
    state_id = fields.Many2one(
        comodel_name="res.country.state",
        string="State",
        ondelete="restrict",
        domain="[('country_id', '=?', country_id)]",
    )
    country_id = fields.Many2one(
        comodel_name="res.country",
        string="Country",
        ondelete="restrict",
    )
    phone = fields.Char()


class VisitorScreening(models.Model):
    _name = "visitor.screening"
    _description = "Test result history"

    visitor_id = fields.Many2one(comodel_name="visitor.visitor", required=True)
    visitor_test_date = fields.Date(required=True)


class ScheduledVisit(models.Model):
    _name = "scheduled.visit"
    _description = "Scheduled visit"

    visit_availability_slot_id = fields.Many2one(
        comodel_name="availability.slot", required=True
    )
    visitor_id = fields.Many2one(comodel_name="visitor.visitor", required=True)


# usecase
class VisitRequest(models.Model):
    _name = "visit.request"
    _description = "Visit Request"

    visitor_name = fields.Char(required=True)
    visitor_email = fields.Char(required=True)
    visitor_test_date = fields.Date(required=True)
    visit_room_id = fields.Many2one(comodel_name="patient.room", required=True)

    visitor_id = fields.Many2one(comodel_name="visitor.visitor")
    screening_id = fields.Many2one(comodel_name="visitor.screening")

    availability_ids = fields.Many2many(
        comodel_name="availability.slot",
        compute="_compute_availability_ids",
    )

    scheduled_visit_id = fields.Many2one(comodel_name="scheduled.visit")

    def _compute_availability_ids(self):
        # add better logic
        all_availabilities = self.env["availability.slot"].search([])
        for record in self:
            record.availability_ids = all_availabilities
        return True
