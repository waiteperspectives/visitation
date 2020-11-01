odoo.define('visitation.visitationAppResultsForm', function(require) {
  'use strict';

  const { StepForm } = require('visitation.visitationAppBase');
  const { useState } = owl;
  const { xml } = owl.tags;

  class ResultsForm extends StepForm {
    static template = xml`
      <div class="ResultsForm container">
        <div class="row justify-content-center">
          <form t-on-submit.prevent="" class="col-md-6">
            <div class="alert alert-success" role="alert">
              <p>
              Your visit has been scheduled for:
              <strong><span t-esc="state.visitRequestSlotLabel" /></strong>
              </p>
              <p>
                <t t-esc="state.visitConfirmationMessage" />
              </p>
            </div>
            <div class="d-flex justify-content-between">
              <button type="button" t-on-click="previousStep" class="btn">
                <i class="fa fa-arrow-left" />
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    _getVisitRequestSlotLabel = () => {
      return this.props.init.availabilities.find(slot => slot.id == this.props.init.visitRequest.visitRequestSlot).name;
    }

    state = useState({
      visitRequestSlotLabel: this._getVisitRequestSlotLabel(), 
      visitConfirmationMessage: this.props.init.visitRequest.visitConfirmationMessage,
    });

  }

  return { ResultsForm };
});
