odoo.define('visitation.visitationAppMain', function(require) {
  'use strict';

  const { IO } = require('visitation.visitationAppIO');
  const { ResidentForm } = require('visitation.visitationAppResidentForm');
  const { VisitorForm } = require('visitation.visitationAppVisitorForm');
  const { SchedulingForm } = require('visitation.visitationAppSchedulingForm');
  const { ResultsForm } = require('visitation.visitationAppResultsForm');
  const { Stepper } = require('visitation.visitationAppStepper');
  const { Component, useState } = owl;
  const { xml } = owl.tags;


  class VisitationApp extends Component {
      static template = xml`
          <div class="VisitationApp container">
             <Stepper steps="state.steps" />
             <ResidentForm init="state.visitRequest" dataValues="state.dataValues" nextStep="screeningFormSubmit" t-if="getCurrentIndex() === 0" heading="state.steps[0].heading" />
             <VisitorForm init="state.visitRequest" dataValues="state.dataValues" addVisitor="addVisitor" previousStep="stepBackward" nextStep="screeningFormSubmit" t-if="getCurrentIndex() === 1" heading="state.steps[1].heading" />
             <SchedulingForm init="{visitRequest: state.visitRequest, availabilities: state.dataValues.availabilities}" nextStep="schedulingFormSubmit" previousStep="stepBackward" t-if="getCurrentIndex() === 2" heading="state.steps[2].heading" />
             <ResultsForm init="{visitRequest: state.visitRequest, availabilities: state.dataValues.availabilities}" previousStep="stepBackward" t-if="getCurrentIndex() === 3" heading="state.steps[3].heading" />
             <p class="text-muted">
               <span>Visit Request #</span>
               <span t-esc="state.visitRequest.visitRequestId"/>
               <span class="pr-1" />
               <span t-esc="state.visitRequest.visitRequestDate.toLocaleDateString()"/>
             </p>
          </div>
      `;

      static components = { Stepper, ResidentForm, VisitorForm, SchedulingForm, ResultsForm };

      state = useState({
        steps: [
          {key: 1, heading: "Where will you be visiting?", complete: true, last: false, first: true},
          {key: 2, heading: "Who will be visiting?", complete: false, last: false, first: false},
          {key: 3, heading: "When would you like to visit?", complete: false, last: false, first: false},
          {key: 4, heading: "", complete: false, last: true, first: false},
        ],
        dataValues: {
          beds: [],
          states: [],
          availabilities: [
            {
              id: 1,
              name: "Sat. 10/31: 8 - 9 AM",
            },
            {
              id: 2,
              name: "Sat. 10/31: 9 - 10 AM",
            }
          ],
        },
        visitRequest: {
          visitRequestId: "1234",
          visitRequestDate: new Date(),
          visitConfirmationMessage: "A confirmation email has been sent to your email. Please call us if you unable to make your visit",
          residentRoom: "",
          residentUnit: "",
          residentBed: "",
          visitRequestSlot: 0,
          visitors: [],
      }
    });

    willStart = async () => {
      IO.mockFetchInitialLoad().then(rs => {
        this.state.steps[0].heading = rs.visitRequest.heading1;
        this.state.steps[1].heading = rs.visitRequest.heading2;
        this.state.steps[2].heading = rs.visitRequest.heading3;
        this.state.dataValues.beds = rs.visitRequest.beds;
        this.state.dataValues.states = rs.visitRequest.states;
      });
    }

    addVisitor = (visitor) => {
      this.state.visitRequest.visitors.push(visitor);
    }

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

    schedulingFormSubmit = (vals) => {
      Object.assign(this.state.visitRequest, vals);
      this.stepForward();
      //this.rpc({
      //  model: "res.partner",
      //  method: "search",
      //  args: [[]],
      //}).then(rs => {
      //  console.log(rs);
      //});
    }

  }

  return { VisitationApp };

});
