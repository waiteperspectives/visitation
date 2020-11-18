odoo.define('visitation.visitationAppSchedulingForm', function(require) {
  'use strict';

  const { StepForm } = require('visitation.visitationAppBase');
  const { useState } = owl;
  const { xml } = owl.tags;

  class SchedulingForm extends StepForm {
    static template = xml`
      <div class="SchedulingForm container mt-3">
        <div class="row justify-content-center">
          <form t-on-submit.prevent="nextStep" class="VisitationApp-form">
            <h3 t-if="props.availabilities.length"><t t-esc="props.heading" /></h3>
            <div t-if="props.availabilities.length" class="form-group">
              <label for="availabilitySlot">
                Time Slot
                <span class="text-danger">*</span>
              </label>
              <select id="availabilitySlot" class="form-control" t-on-change="availabilitySlotChanged">
                <option t-if="!state.availabilitySlot" value="" selected="1" disabled="1">Choose Time Slot</option>
                <t t-foreach="props.availabilities" t-as="availability">
                  <t t-if="availability.id == state.availabilitySlot">
                    <option t-att-value="availability.id" selected="1">
                      <t t-esc="availability.name" />
                    </option>
                  </t>
                  <t t-else="">
                    <option t-att-value="availability.id">
                      <t t-esc="availability.name" />
                    </option>
                  </t>
                </t>
              </select>
            </div>
            <div t-if="!props.availabilities.length" class="alert alert-info" role="alert">
              <p><t t-esc="props.dataValues.messages.noAvailability" /></p>
            </div>
            <div class="d-flex justify-content-between">
              <button type="button" t-on-click="previousStep" class="btn btn-outline-secondary">
                <i class="fa fa-arrow-left" />
                Back
              </button>
              <button t-if="validForm()" type="submit" class="btn btn-primary">
                Forward
                <i class="fa fa-arrow-right" />
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    state = useState({
      availabilitySlot: this.props.init.visitRequest.availabilitySlot,
    });

    validForm() {
      if ( !this.state.availabilitySlot ) { return false; }
      return true;
    }

    availabilitySlotChanged = (e) => {
      this.state.availabilitySlot = parseInt(e.target.value);
    }

  }

  return { SchedulingForm };
});
