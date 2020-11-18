from datetime import datetime, timezone, timedelta
from odoo import models, fields, api, _

# entities
class VisitationContent(models.Model):
    _name = "x_visitation_content"
    _description = "CMS - Visitation Content"

    x_name = fields.Char(related="x_key", string="Name")
    x_key = fields.Char(required=True, string="Key")
    x_value = fields.Text(required=True, string="Value")


class ResidentUnit(models.Model):
    _name = "x_resident_unit"
    _description = "Resident Unit"

    x_name = fields.Char(required=True, string="Unit Name")
    x_active = fields.Boolean(default=True, string="Active")


class ResidentRoom(models.Model):
    _name = "x_resident_room"
    _description = "Resident Room"

    x_name = fields.Char(string="Room Number")
    x_active = fields.Boolean(default=True, string="Active")


class ResidentBed(models.Model):
    _name = "x_resident_bed"
    _description = "Resident Bed Position"

    x_name = fields.Char(compute="_compute_name", store=True, string="Name")
    x_active = fields.Boolean(default=True, string="Active")
    x_bed_position = fields.Selection(
        [
            ("left", "Left"),
            ("right", "Right"),
            ("private", "Private"),
        ],
        required=True,
        string="Bed Position",
    )

    x_unit_id = fields.Many2one(
        comodel_name="x_resident_unit", required=True, string="Resident Unit"
    )
    x_room_id = fields.Many2one(
        comodel_name="x_resident_room", required=True, string="Resident Room"
    )

    @api.depends("x_unit_id.x_name", "x_room_id.x_name", "x_bed_position")
    def _compute_name(self):
        for record in self:
            record["x_name"] = "%s - %s - %s" % (
                record.x_unit_id.x_name,
                record.x_room_id.x_name,
                dict(record._fields["x_bed_position"].selection).get(
                    record.x_bed_position
                ),
            )


class AvailabilitySlot(models.Model):
    _name = "x_availability_slot"
    _description = "Availability slot"

    x_name = fields.Char(compute="_compute_name", store=True, string="Name")
    x_active = fields.Boolean(default=True, string="Active")
    x_availability_start_time = fields.Datetime(required=True, string="Starting Time")
    x_availability_end_time = fields.Datetime(required=True, string="Ending Time")
    x_eligible_unit_ids = fields.Many2many(
        comodel_name="x_resident_unit",
        string="Eligible Units",
    )
    x_capacity = fields.Integer(string="Capacity")
    x_remaining_capacity = fields.Integer(
        compute="_compute_remaining_capacity",
        store=True,
        string="Remaining Capacity",
    )
    x_scheduled_visit_ids = fields.One2many(
        comodel_name="x_scheduled_visit",
        inverse_name="x_visit_availability_slot_id",
        readonly=True,
        string="Scheduled Visits",
    )

    @api.depends("x_availability_start_time", "x_availability_end_time")
    def _compute_name(self):
        def ny(naive_dt):
            # NOTE: during summer this will be -4
            offset = -5
            ny_tz = timezone(timedelta(hours=offset), "NY")
            return naive_dt.replace(tzinfo=timezone.utc).astimezone(ny_tz)

        for record in self:
            record["x_name"] = "%s - %s" % (
                datetime.strftime(
                    ny(record.x_availability_start_time), "%b %d (%-I:%M %p"
                ),
                datetime.strftime(ny(record.x_availability_end_time), "%-I:%M %p)"),
            )
        return True

    @api.depends(
        "x_capacity",
        "x_scheduled_visit_ids",
        "x_scheduled_visit_ids.x_visitor_screening_ids",
    )
    def _compute_remaining_capacity(self):
        for record in self:
            record["x_remaining_capacity"] = record.x_capacity - len(
                record.x_scheduled_visit_ids.x_visitor_screening_ids
            )
        return True


class VisitorScreening(models.Model):
    _name = "x_visitor_screening"
    _description = "Visitor screening"

    x_active = fields.Boolean(default=True, string="Active")
    x_name = fields.Char(compute="_compute_name", store=True, string="Name")
    x_first_name = fields.Char(required=True, string="First Name")
    x_last_name = fields.Char(required=True, string="Last Name")
    x_email = fields.Char(required=True, string="Email")
    x_street = fields.Char(required=True, string="Street")
    x_street2 = fields.Char(string="Street2")
    x_zip = fields.Char(required=True, string="Zip")
    x_city = fields.Char(required=True, string="City")
    x_state_id = fields.Many2one(
        comodel_name="res.country.state",
        string="State",
        ondelete="restrict",
        domain="[('country_id', '=', x_country_id)]",
        required=True,
    )
    x_country_id = fields.Many2one(
        comodel_name="res.country",
        string="Country",
        ondelete="restrict",
        required=True,
    )
    x_phone = fields.Char(required=True, string="Day Phone")
    x_phone2 = fields.Char(required=True, string="Evening Phone")
    x_test_date = fields.Date(required=True, string="Test Date")

    x_visit_request_id = fields.Many2one(
        comodel_name="x_visit_request",
        string="Visit Request",
    )

    # questions
    x_question_suspected_positive = fields.Selection(
        [("yes", "Yes"), ("no", "No")], required=True
    )
    x_question_any_contact = fields.Selection(
        [("yes", "Yes"), ("no", "No")], required=True
    )
    x_question_any_symptoms = fields.Selection(
        [("yes", "Yes"), ("no", "No")], required=True
    )
    x_question_any_travel = fields.Selection(
        [("yes", "Yes"), ("no", "No")], required=True
    )
    x_question_large_groups = fields.Selection(
        [("yes", "Yes"), ("no", "No")], required=True
    )
    x_question_social_distancing = fields.Selection(
        [("yes", "Yes"), ("no", "No")], required=True
    )

    @api.depends("x_first_name", "x_last_name")
    def _compute_name(self):
        for record in self:
            if record.x_first_name and record.x_last_name:
                record["x_name"] = "%s %s" % (record.x_first_name, record.x_last_name)
            else:
                record["x_name"] = ""
        return True


class ResPartner(models.Model):
    _inherit = "res.partner"

    x_scheduled_visit_id = fields.Many2one(
        comodel_name="x_scheduled_visit",
        ondelete="cascade",
        string="Scheduled Visit",
    )
    x_phone2 = fields.Char(string="Evening Phone")


class ScheduledVisit(models.Model):
    _name = "x_scheduled_visit"
    _description = "Scheduled visit"
    _inherit = ["mail.thread", "mail.activity.mixin"]

    x_active = fields.Boolean(default=True, string="Active")
    x_name = fields.Char(compute="_compute_name", store=True, string="Name")
    x_visit_availability_slot_id = fields.Many2one(
        comodel_name="x_availability_slot",
        required=True,
        ondelete="restrict",
        string="Time Slot",
    )
    x_visitor_screening_ids = fields.Many2many(
        comodel_name="x_visitor_screening",
        required=True,
        ondelete="restrict",
        string="Visitors",
    )
    x_resident_bed_id = fields.Many2one(
        comodel_name="x_resident_bed",
        ondelete="restrict",
        string="Resident Bed",
    )
    x_visit_request_id = fields.Many2one(
        comodel_name="x_visit_request",
        ondelete="restrict",
        string="Visit Request",
    )
    x_partner_ids = fields.One2many(
        comodel_name="res.partner",
        inverse_name="x_scheduled_visit_id",
        string="Mail Subscription Contact Record",
    )

    @api.depends(
        "x_visitor_screening_ids",
        "x_visit_availability_slot_id",
        "x_visit_availability_slot_id.x_name",
    )
    def _compute_name(self):
        for record in self:
            if len(record.x_visitor_screening_ids) == 1:
                suffix = " visitor"
            else:
                suffix = " visitors"
            visitor_count_message = str(len(record.x_visitor_screening_ids)) + suffix
            record["x_name"] = "%s: %s" % (
                visitor_count_message,
                record.x_visit_availability_slot_id.x_name,
            )


# usecase
class VisitRequest(models.Model):
    _name = "x_visit_request"
    _description = "Visit Request"

    x_active = fields.Boolean(default=True, string="Active")
    x_name = fields.Char(compute="_compute_name", store=True, string="Name")
    x_resident_bed_id = fields.Many2one(
        comodel_name="x_resident_bed",
        string="Resident Bed",
    )

    # front end writes screenings, auto-action builds visitors
    x_screening_ids = fields.One2many(
        comodel_name="x_visitor_screening",
        inverse_name="x_visit_request_id",
        copy=False,
        string="Visitors",
    )
    x_availability_ids = fields.Many2many(
        comodel_name="x_availability_slot",
        compute="_compute_availability_ids",
        store=True,
        copy=False,
        string="Available Time Slots",
    )
    x_requested_availability_id = fields.Many2one(
        comodel_name="x_availability_slot",
        copy=False,
        string="Requested Slot",
    )
    x_scheduled_visit_id = fields.Many2one(
        comodel_name="x_scheduled_visit",
        readonly="1",
        copy=False,
        string="Scheduled Visit",
    )

    @api.depends("x_scheduled_visit_id", "x_scheduled_visit_id.x_name")
    def _compute_name(self):
        for record in self:
            if record.x_scheduled_visit_id:
                record["x_name"] = record.x_scheduled_visit_id.x_name
            else:
                record["x_name"] = "New Request"

    @api.depends(
        "x_screening_ids",
        "x_screening_ids.x_test_date",
        "x_screening_ids.x_email",
        "x_scheduled_visit_id",
    )
    def _compute_availability_ids(self):
        # utils
        def slot_week(slot):
            """Representation of a slot for comparison"""
            return slot.x_availability_start_time.isocalendar()[1]

        def has_same_week(candidate_week, comparison_weeks):
            return candidate_week in comparison_weeks

        def same_week_slot_exists(candidate_slot, comparison_slots):
            candiate_week = slot_week(candidate_slot)
            comparison_weeks = [slot_week(x) for x in comparison_slots]
            return has_same_week(candiate_week, comparison_weeks)

        def test_relevant_range(test_date):
            min_date = test_date + timedelta(days=2)
            max_date = test_date + timedelta(days=6)
            return min_date, max_date

        # main
        for record in self:
            # use the database query to filter:
            # only slots where this unit is in slot eligible units OR eligible units is empty
            # AND only slots where capacity remains
            # AND only slots within the test_date + 2d, test_date + 6d window
            # AND all screening questions no

            question_fields = [
                "x_question_suspected_positive",
                "x_question_any_contact",
                "x_question_any_symptoms",
                "x_question_any_travel",
                "x_question_large_groups",
                "x_question_social_distancing",
            ]
            fail_early = False
            for name in question_fields:
                question_answers = record.x_screening_ids.mapped(name)
                if "yes" in question_answers:
                    fail_early = True

            if fail_early:
              record["x_availability_ids"] = self.env["x_availability_slot"]
              break

            test_dates = record.x_screening_ids.mapped("x_test_date")
            min_dates = set([])
            max_dates = set([])
            for test_date in test_dates:
                _min_date, _max_date = test_relevant_range(test_date)
                min_dates.add(_min_date)
                max_dates.add(_max_date)
            if min_dates and max_dates:
                min_date = min(min_dates)
                max_date = max(max_dates)
            else:
                # when there are no tests yet, set wide range
                min_date = datetime(1900, 1, 1)
                max_date = datetime(2099, 1, 1)

            candidate_slots = self.env["x_availability_slot"].search(
                [
                    ("x_remaining_capacity", ">=", len(record.x_screening_ids)),
                    ("x_availability_start_time", ">=", min_date),
                    ("x_availability_start_time", "<=", max_date),
                    "|",
                    ("x_eligible_unit_ids", "=", False),
                    (
                        "x_eligible_unit_ids",
                        "in",
                        [record.x_resident_bed_id.x_unit_id.id],
                    ),
                ]
            )

            if candidate_slots:
                existing_upcoming_visit_for_this_bed = self.env[
                    "x_scheduled_visit"
                ].search(
                    [
                        ("x_resident_bed_id", "=", record.x_resident_bed_id.id),
                        (
                            "x_visit_availability_slot_id.x_availability_start_time",
                            ">=",
                            datetime.now(),
                        ),
                    ]
                )

                existing_visit_slots = existing_upcoming_visit_for_this_bed.mapped(
                    "x_visit_availability_slot_id"
                )

                # filter and set
                record["x_availability_ids"] = candidate_slots.filtered(
                    lambda x: not same_week_slot_exists(x, existing_visit_slots)
                )
            else:
                record["x_availability_ids"] = candidate_slots

            # add scheduled back in if exists
            if record.x_scheduled_visit_id:
                record[
                    "x_availability_ids"
                ] += record.x_scheduled_visit_id.x_visit_availability_slot_id

            # SIDE EFFECT: to empty selection when no longer valid
            if (
                record.x_requested_availability_id
                and record.x_requested_availability_id not in record.x_availability_ids
            ):
                record["x_requested_availability_id"] = False
        return True
