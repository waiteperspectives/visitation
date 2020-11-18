odoo.define('visitation.visitationAppResultsForm', function(require) {
  'use strict';

  const { StepForm } = require('visitation.visitationAppBase');
  const { useState } = owl;
  const { xml } = owl.tags;

  class ResultsForm extends StepForm {
    static template = xml`
      <div class="ResultsForm container mt-3">
        <div class="row justify-content-center">
          <form t-on-submit.prevent="" class="VisitationApp-form">
            <div class="alert alert-success" role="alert">
              <p>
              Your visit has been scheduled for:
              <strong><span t-esc="state.availabilitySlotLabel" /></strong>
              </p>
              <p>
                <t t-esc="state.visitConfirmationMessage" />
              </p>
            </div>
          </form>
        </div>
      </div>
    `;

    _getVisitRequestSlotLabel = () => {
      return this.props.availabilities.find(slot => slot.id == this.props.init.visitRequest.availabilitySlot).name;
    }

    state = useState({
      availabilitySlotLabel: this._getVisitRequestSlotLabel(), 
      visitConfirmationMessage: this.props.init.visitRequest.visitConfirmationMessage,
    });

  }

  return { ResultsForm };
});
