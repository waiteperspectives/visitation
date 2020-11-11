import datetime
from odoo import models, fields, api, _

# entities
class VisitationContent(models.Model):
    _name = "x_visitation_content"
    _description = "CMS - Visitation Content"
    _rec_name = "x_key"

    x_key = fields.Char(required=True)
    x_value = fields.Text(required=True)


class ResidentUnit(models.Model):
    _name = "x_resident_unit"
    _description = "Resident Unit"

    x_name = fields.Char(required=True, string="Unit Name")
    x_active = fields.Boolean(default=True)


class ResidentRoom(models.Model):
    _name = "x_resident_room"
    _description = "Resident Room"

    x_name = fields.Char(string="Room Number")
    x_active = fields.Boolean(default=True)


class ResidentBed(models.Model):
    _name = "x_resident_bed"
    _description = "Resident Bed Position"

    x_name = fields.Char(compute="_compute_name")
    x_active = fields.Boolean(default=True)
    x_bed_position = fields.Selection(
        [
            ("left", "Left"),
            ("right", "Right"),
        ],
        required=True,
    )

    x_unit_id = fields.Many2one(comodel_name="x_resident_unit", required=True)
    x_room_id = fields.Many2one(comodel_name="x_resident_room", required=True)

    def _compute_name(self):
        for record in self:
            record.x_name = "%s - %s - %s" % (
                record.x_unit_id.x_name,
                record.x_room_id.x_name,
                dict(record._fields["x_bed_position"].selection).get(
                    record.x_bed_position
                ),
            )


class AvailabilitySlot(models.Model):
    _name = "x_availability_slot"
    _description = "Availability slot"

    x_name = fields.Char(compute="_compute_name")
    x_availability_start_time = fields.Datetime(required=True)
    x_availability_end_time = fields.Datetime(required=True)
    x_capacity = fields.Integer(default=0)

    x_remaining_capacity = fields.Integer(
        compute="_compute_remaining_capacity", store=True
    )
    x_scheduled_visit_ids = fields.One2many(
        comodel_name="x_scheduled_visit",
        inverse_name="x_visit_availability_slot_id",
        readonly=True,
    )

    def _compute_name(self):
        for record in self:
            record.x_name = "%s - %s" % (
                datetime.datetime.strftime(
                    record.x_availability_start_time, "%b %d (%-I:%M %p"
                ),
                datetime.datetime.strftime(
                    record.x_availability_end_time, "%-I:%M %p)"
                ),
            )
        return True

    @api.depends(
        "x_capacity",
        "x_scheduled_visit_ids",
        "x_scheduled_visit_ids.x_visitor_screening_ids",
    )
    def _compute_remaining_capacity(self):
        for record in self:
            record.x_remaining_capacity = record.x_capacity - len(
                record.x_scheduled_visit_ids.x_visitor_screening_ids
            )
        return True


class VisitorScreening(models.Model):
    _name = "x_visitor_screening"
    _description = "Visitor screening"

    x_name = fields.Char(required=True)
    x_email = fields.Char(required=True)
    x_street = fields.Char()
    x_street2 = fields.Char()
    x_zip = fields.Char()
    x_city = fields.Char()
    x_state_id = fields.Many2one(
        comodel_name="res.country.state",
        string="State",
        ondelete="restrict",
        domain="[('country_id', '=', x_country_id)]",
    )
    x_country_id = fields.Many2one(
        comodel_name="res.country",
        string="Country",
        ondelete="restrict",
    )
    x_phone = fields.Char()
    x_test_date = fields.Date(required=True)

    x_visit_request_ids = fields.Many2many(
        comodel_name="x_visit_request",
        relation="visit_screening_request_rel",
        column1="visitor_screening_id",
        column2="visit_request_id",
    )


class ResPartner(models.Model):
    _inherit = "res.partner"

    x_scheduled_visit_id = fields.Many2one(
        comodel_name="x_scheduled_visit",
        ondelete="cascade",
    )


class ScheduledVisit(models.Model):
    _name = "x_scheduled_visit"
    _description = "Scheduled visit"
    _inherit = ["mail.thread", "mail.activity.mixin"]

    x_name = fields.Char(compute="_compute_name")
    x_visit_availability_slot_id = fields.Many2one(
        comodel_name="x_availability_slot", required=True, string="Time Slot"
    )
    x_visitor_screening_ids = fields.Many2many(
        comodel_name="x_visitor_screening", required=True, string="Visitors"
    )
    x_resident_bed_id = fields.Many2one(comodel_name="x_resident_bed")
    x_visit_request_id = fields.Many2one(comodel_name="x_visit_request")
    x_partner_ids = fields.One2many(
        comodel_name="res.partner",
        inverse_name="x_scheduled_visit_id",
    )

    def _compute_name(self):
        for record in self:
            if len(record.x_visitor_screening_ids) == 1:
                suffix = " visitor"
            else:
                suffix = " visitors"
            visitor_count_message = str(len(record.x_visitor_screening_ids)) + suffix
            record.x_name = "%s: %s" % (
                visitor_count_message,
                record.x_visit_availability_slot_id.x_name,
            )


# usecase
class VisitRequest(models.Model):
    _name = "x_visit_request"
    _description = "Visit Request"

    x_name = fields.Char(compute="_compute_name")
    x_resident_bed_id = fields.Many2one(comodel_name="x_resident_bed")

    # front end writes screenings, auto-action builds visitors
    x_screening_ids = fields.Many2many(
        comodel_name="x_visitor_screening",
        string="Visitors",
        relation="visit_screening_request_rel",
        column1="visit_request_id",
        column2="visitor_screening_id",
    )

    # derived on bed and screenings submitted
    x_availability_ids = fields.Many2many(
        comodel_name="x_availability_slot",
        compute="_compute_availability_ids",
    )
    x_requested_availability_id = fields.Many2one(
        comodel_name="x_availability_slot", string="Requested Slot"
    )
    x_scheduled_visit_id = fields.Many2one(
        comodel_name="x_scheduled_visit", readonly="1"
    )

    def _compute_name(self):
        for record in self:
            if record.id:
                record.x_name = "Visit Request #%s" % record.id
            else:
                record.name = "New Visit Request"

    def _get_availability_ids(self):
        return self.env["x_availability_slot"].search(
            [
                ("x_remaining_capacity", ">=", len(self.x_screening_ids)),
            ]
        )

    def _compute_availability_ids(self):
        # add better logic
        for record in self:
            record.x_availability_ids = record._get_availability_ids()
        return True
