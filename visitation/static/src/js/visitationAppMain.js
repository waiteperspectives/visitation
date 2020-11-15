odoo.define('visitation.visitationAppMain', function(require) {
  'use strict';

  const { IO, OdooSession, _get } = require('visitation.visitationAppIO');
  const { ResidentForm } = require('visitation.visitationAppResidentForm');
  const { VisitorForm } = require('visitation.visitationAppVisitorForm');
  const { SchedulingForm } = require('visitation.visitationAppSchedulingForm');
  const { ResultsForm } = require('visitation.visitationAppResultsForm');
  const { Stepper } = require('visitation.visitationAppStepper');
  const { Component, useState } = owl;
  const { xml } = owl.tags;


  class VisitationApp extends Component {
      constructor(parent, props) {
        super(parent, props);
        this.session = new OdooSession(
          props.rpc_config.host,
          props.rpc_config.port,
          props.rpc_config.db,
          props.rpc_config.login,
          props.rpc_config.login
        );
      }

      static template = xml`
          <div class="VisitationApp container pt-2">
             <div t-if="state.notification" class="alert alert-danger">
               <p t-esc="state.notification" />
             </div>
             <Stepper steps="state.steps" />
             <ResidentForm init="state.visitRequest" dataValues="state.dataValues" nextStep="residentFormSubmit" t-if="getCurrentIndex() === 0" heading="state.steps[0].heading" />
             <VisitorForm init="state.visitRequest" dataValues="state.dataValues" addVisitor="addVisitor" previousStep="stepBackward" nextStep="visitorFormSubmit" t-if="getCurrentIndex() === 1" heading="state.steps[1].heading" />
             <SchedulingForm init="{visitRequest: state.visitRequest}" dataValues="state.dataValues" availabilities="state.dataValues.availabilities" nextStep="schedulingFormSubmit" previousStep="stepBackward" t-if="getCurrentIndex() === 2" heading="state.steps[2].heading" />
             <ResultsForm init="{visitRequest: state.visitRequest}" dataValues="state.dataValues" availabilities="state.dataValues.availabilities" previousStep="stepBackward" t-if="getCurrentIndex() === 3" heading="state.steps[3].heading" />
             <p class="text-muted">
               <span>Visit Request #</span>
               <span t-esc="state.visitRequest.visitRequestId"/>
               <span class="pr-1" />
               <span t-esc="state.visitRequestDate.toLocaleDateString()"/>
             </p>
          </div>
      `;

      static components = { Stepper, ResidentForm, VisitorForm, SchedulingForm, ResultsForm };

      state = useState({
        notification: undefined,
        steps: [
          {key: 1, heading: "", complete: true, last: false, first: true},
          {key: 2, heading: "", complete: false, last: false, first: false},
          {key: 3, heading: "", complete: false, last: false, first: false},
          {key: 4, heading: "", complete: false, last: true, first: false},
        ],
        dataValues: {
          beds: [],
          states: [],
          availabilities: [],
          messages: {
            visitationNotOpen: "", 
            noAvailability: "", 
          },
        },
        visitRequestDate: new Date(),
        visitRequest: {
          visitRequestId: undefined,
          visitConfirmationMessage: "",
          residentRoom: "",
          residentUnit: "",
          residentBed: "",
          availabilitySlot: undefined,
          visitors: [],
      }
    });

    willStart = async () => {
      await this.session.ensure_login();

      await IO.createVisitRequest(this.session, {}).then(rs => {
        this.state.visitRequest.visitRequestId = rs.data.result;
      });

      // must wait for step 1
      const bedResult = await IO.fetchBeds(this.session);
      this.state.dataValues.beds = bedResult.data.result;

      const contentResult = await IO.fetchContent(this.session);
      const content = contentResult.data.result;
      const get = key => _get(content, key);

      this.state.steps[0].heading = get('heading1') || "Where does the resident reside that you wish to visit?";
      this.state.steps[1].heading = get('heading2') || "Who will be visiting?";
      this.state.steps[2].heading = get('heading3') || "When would you like to visit?";
      this.state.dataValues.messages.noAvailability = get('noAvailability') || "We're sorry, given your request, we don't have any time slots that can accomodate you.";
      this.state.dataValues.messages.visitationNotOpen = get('visitationNotOpen') || "We're sorry. Visitation is currently not open. Check back later.";
      this.state.visitRequest.visitConfirmationMessage = get('visitConfirmationMessage') || "A confirmation email has been sent to your email. You must bring a printed hard copy of your negative test result that includes your name, date tested and negative result. Remember to arrive 15 minutes after your appointment for the screen in procedure. Please call us if you unable to make your visit."

      IO.fetchStates(this.session).then(rs => {
        this.state.dataValues.states = rs.data.result;
      });
    }

    notify = (message) => {
      this.state.notification = message;
      setTimeout(() => {
        this.state.notification = undefined;
      }, 2000);
    }

    notifyOnError = (rs, callback) => {
      if ( rs.data.error ) {
        this.notify(rs.data.error.message);
      } else {
        callback();
      }
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

    residentFormSubmit = (vals) => {
      const self = this;
      Object.assign(this.state.visitRequest, vals);
      IO.updateResident(
        this.session, 
        this.state.visitRequest.visitRequestId,
        this.state.visitRequest.residentBed
      ).then(rs => {
        self.notifyOnError(rs, () => {
          this.stepForward()
        });
      }).catch(err => {
        this.notify(err);
      });
    }

    visitorFormSubmit = (vals) => {
      const self = this;
      Object.assign(this.state.visitRequest, vals);
      IO.updateVisitorScreenings(
        this.session, 
        this.state.visitRequest.visitRequestId,
        this.state.visitRequest.visitors
      ).then(rs => {
        self.notifyOnError(rs, () => {
          IO.fetchAvailabilities(
            this.session,
            this.state.visitRequest.visitRequestId
          ).then(rs => {
            self.notifyOnError(rs, () => {
              self.state.dataValues.availabilities = rs.data.result;
              this.stepForward();
            });
          }).catch(err => {
            this.notify(err);
          });
        });
      }).catch(err => {
        this.notify(err);
      });
    }

    schedulingFormSubmit = async (vals) => {
      const self = this;
      Object.assign(this.state.visitRequest, vals);
      const rs = await IO.updateRequestedAvailabilityId(
        this.session, 
        this.state.visitRequest.visitRequestId,
        this.state.visitRequest.availabilitySlot
      ).catch(err => {
        this.notify(err);
      });
      self.notifyOnError(rs, () => this.stepForward());
    }

  }

  return { VisitationApp };

});
