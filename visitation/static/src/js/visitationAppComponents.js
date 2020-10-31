odoo.define('visitation.visitationAppComponents', function() {
  'use strict';

  const { Component, useState } = owl;
  const { xml } = owl.tags;

  class Stepper extends Component {
    static template = xml`
    <div class="Stepper">
      <t t-foreach="props.steps" t-as="step" t-key="step.key">
        <t t-set="statusClass" t-value="step.complete ? 'complete' : 'incomplete'" />
          <t t-if="!step.first">
            <div class="Stepper-Step-Bar" t-attf-class="{{ step.first ? 'invisible': statusClass }}" />
          </t>
          <div class="Stepper-Step-Circle" t-att-class="statusClass">
            <span class="Stepper-Step-Label"><t t-esc="step.key" /></span>
          </div>
      </t>
    </div>
    `;
  }

  class StepForm extends Component {
    static template = xml`
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-6 text-center">
            <h1>TODO</h1>
            <button t-on-click="previousStep">Back</button>
          </div>
        </div>
      </div>
    `;

    state = {};

    nextStep() {
      this.props.nextStep({...this.state});
    }

    previousStep() {
      this.props.previousStep();
    }
  }

  class ScreeningForm extends StepForm {
    static template = xml`
      <div class="ScreeningForm container">
        <div class="row justify-content-center">
          <form t-on-submit.prevent="nextStep" class="col-6">
            <div class="form-group">
              <label for="visitorName">Name</label>
              <input id="visitorName" class="form-control" t-model="state.visitorName" />
            </div>
            <div class="form-group">
              <label for="visitorEmail">Email</label>
              <input id="visitorEmail" class="form-control" t-model="state.visitorEmail" />
            </div>
            <div class="form-group">
              <label for="testDate">Test Date</label>
              <input type="date" id="testDate" class="form-control" t-model="state.testDate" />
            </div>
            <div class="form-group">
              <label for="residentRoom">Resident Room</label>
              <select id="residentRoom" class="form-control" placeholder="Pick a room" t-model="state.residentRoom">
                <t t-foreach="props.dataValues.rooms" t-as="room">
                  <option value="room"><t t-esc="room" /></option>
                </t>
              </select>
            </div>
           <div t-if="validForm()" class="d-flex justify-content-end">
             <button type="submit">
               Forward
               <i class="fa fa-arrow-right" />
             </button>
           </div>
          </form>
        </div>
      </div>
    `;

    state = useState({
      visitorName: this.props.init.visitorName,
      visitorEmail: this.props.init.visitorEmail,
      testDate: this.props.init.testDate,
      residentRoom: this.props.init.residentRoom,
    });

    validForm() {
      if ( !this.state.visitorName ) { return false; }
      if ( !this.state.visitorEmail ) { return false; }
      if ( !this.state.testDate ) { return false; }
      if ( !this.state.residentRoom ) { return false; }
      return true;
    }

  }


  class VisitationApp extends Component {
      static template = xml`
          <div class="VisitationApp container">
             <Stepper steps="state.steps" />
             <ScreeningForm init="state.visitRequest" dataValues="state.dataValues" nextStep="screeningFormSubmit" t-if="getCurrentIndex() === 0" />
             <StepForm t-if="getCurrentIndex() !== 0" previousStep="stepBackward" />
             <p class="text-muted">
               <span>Visit Request #</span>
               <span t-esc="state.visitRequest.visitRequestId"/>
               <span class="pr-1" />
               <span t-esc="state.visitRequest.visitRequestDate.toLocaleDateString()"/>
             </p>
          </div>
      `;

      static components = { Stepper, ScreeningForm, StepForm };

      state = useState({
        steps: [
          {key: 1, complete: true, last: false, first: true},
          {key: 2, complete: false, last: false, first: false},
          {key: 3, complete: false, last: true, first: false},
        ],
        dataValues: {
          rooms: ['123', '456', '780'],
        },
        visitRequest: {
          visitRequestId: "1234",
          visitRequestDate: new Date(),
          visitorName: "",
          visitorEmail: "",
          testDate: new Date(),
          residentRoom: "",
        }
      });

    getCurrentIndex = () => {
      let current = -1;
      for ( let i = 0; i < this.state.steps.length; i++ ) {
        if ( this.state.steps[i].complete ) {
          current = i;
        } else {
          break;
        }
      }
      return current;
    }

    updateCompletionStatus = (ndx) => {
      for ( let i = 0; i < this.state.steps.length; i++ ) {
        if ( i <= ndx ) {
          this.state.steps[i].complete = true;
        } else {
          this.state.steps[i].complete = false;
        }
      }
    }

    stepForward = () => {
      const current = this.getCurrentIndex();
      let next = this.state.steps.length;
      if ( current >= 0 && current < this.state.steps.length ) {
        next = current + 1;
      } else if ( current === -1) {
        next = 0;
      } else {
        next = current;
      }
      this.updateCompletionStatus(next);
    }

    stepBackward = () => {
      const current = this.getCurrentIndex();
      let prior = 0;
      if ( current > 0 ) {
        prior = current - 1;
      }
      this.updateCompletionStatus(prior);
    }

    screeningFormSubmit = (vals) => {
      Object.assign(this.state.visitRequest, vals);
      this.stepForward();
    }

  }

  return { VisitationApp };

});
