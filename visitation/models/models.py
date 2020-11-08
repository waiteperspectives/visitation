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

    remaining_capacity = fields.Integer(
        compute="_compute_remaining_capacity", store=True
    )
    scheduled_visit_ids = fields.One2many(
        comodel_name="scheduled.visit",
        inverse_name="visit_availability_slot_id",
        readonly=True,
    )

    def _compute_name(self):
        for record in self:
            record.name = "%s - %s" % (
                datetime.datetime.strftime(
                    record.availability_start_time, "%b %d (%-I:%M %p"
                ),
                datetime.datetime.strftime(record.availability_end_time, "%-I:%M %p)"),
            )
        return True

    @api.depends(
        "capacity", "scheduled_visit_ids", "scheduled_visit_ids.visitor_screening_ids"
    )
    def _compute_remaining_capacity(self):
        for record in self:
            record.remaining_capacity = record.capacity - len(
                record.scheduled_visit_ids.visitor_screening_ids
            )
        return True


class VisitorScreening(models.Model):
    _name = "visitor.screening"
    _description = "Visitor screening"

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
    test_date = fields.Date(required=True)

    visit_request_ids = fields.Many2many(
        comodel_name="visit.request",
        relation="visit_screening_request_rel",
        column1="visitor_screening_id",
        column2="visit_request_id",
    )


class ScheduledVisit(models.Model):
    _name = "scheduled.visit"
    _description = "Scheduled visit"
    _inherit = ["mail.thread", "mail.activity.mixin"]

    name = fields.Char(compute="_compute_name")
    visit_availability_slot_id = fields.Many2one(
        comodel_name="availability.slot", required=True, string="Time Slot"
    )
    visitor_screening_ids = fields.Many2many(
        comodel_name="visitor.screening", required=True, string="Visitors"
    )
    resident_bed_id = fields.Many2one(comodel_name="resident.bed")
    visit_request_id = fields.Many2one(comodel_name="visit.request")
    partner_ids = fields.Many2many(comodel_name="res.partner")

    def _compute_name(self):
        for record in self:
            if len(record.visitor_screening_ids) == 1:
                suffix = " visitor"
            else:
                suffix = " visitors"
            visitor_count_message = str(len(record.visitor_screening_ids)) + suffix
            record.name = "%s: %s" % (
                visitor_count_message,
                record.visit_availability_slot_id.name,
            )


# usecase
class VisitRequest(models.Model):
    _name = "visit.request"
    _description = "Visit Request"

    name = fields.Char(compute="_compute_name")
    resident_bed_id = fields.Many2one(comodel_name="resident.bed")

    # front end writes screenings, auto-action builds visitors
    screening_ids = fields.Many2many(
        comodel_name="visitor.screening",
        string="Visitors",
        relation="visit_screening_request_rel",
        column1="visit_request_id",
        column2="visitor_screening_id",
    )

    # derived on bed and screenings submitted
    availability_ids = fields.Many2many(
        comodel_name="availability.slot",
        compute="_compute_availability_ids",
    )
    requested_availability_id = fields.Many2one(
        comodel_name="availability.slot", string="Requested Slot"
    )
    scheduled_visit_id = fields.Many2one(comodel_name="scheduled.visit", readonly="1")

    # for email
    assigned_to_user_id = fields.Many2one(comodel_name="res.users")

    def _compute_name(self):
        for record in self:
            if record.id:
                record.name = "Visit Request #%s" % record.id
            else:
                record.name = "New Visit Request"

    def _get_availability_ids(self):
        return self.env["availability.slot"].search(
            [
                ("remaining_capacity", ">=", len(self.screening_ids)),
            ]
        )

    def _compute_availability_ids(self):
        # add better logic
        for record in self:
            record.availability_ids = record._get_availability_ids()
        return True
