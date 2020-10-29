import datetime
from odoo import models, fields, api, _

# entities
class PatientRoom(models.Model):
    _name = "patient.room"
    _description = "Patient Room"
    _record_name = "room_number"

    room_number = fields.Char(string="Room Number")


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
