odoo.define('visitation.visitationAppSchedulingForm', function(require) {
  'use strict';

  const { StepForm } = require('visitation.visitationAppBase');
  const { useState } = owl;
  const { xml } = owl.tags;

  class SchedulingForm extends StepForm {
    static template = xml`
      <div class="SchedulingForm container">
        <div class="row justify-content-center">
          <form t-on-submit.prevent="nextStep" class="col-md-6">
            <div class="form-group">
              <label for="visitRequestSlot">Name</label>
              <select id="visitRequestSlot" class="form-control" t-model="state.visitRequestSlot">
                <t t-foreach="props.init.availabilities" t-as="availability">
                  <t t-if="availability.id === state.visitRequestSlot">
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
            <div class="d-flex justify-content-between">
              <button type="button" t-on-click="previousStep" class="btn">
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
      visitRequestSlot: this.props.init.visitRequest.visitRequestSlot,
    });

    validForm() {
      if ( !this.state.visitRequestSlot ) { return false; }
      return true;
    }

  }

  return { SchedulingForm };
});
