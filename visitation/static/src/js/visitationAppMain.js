odoo.define('visitation.visitationAppMain', function(require) {
  'use strict';

  const { IO, OdooSession } = require('visitation.visitationAppIO');
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
      await IO.fetchBeds(this.session).then(rs => {
        const self = this;
        rs.data.result.forEach(bed => {
          bed.bed_id = [bed.id, bed.bed_position];
          self.state.dataValues.beds = rs.data.result;
        });
      });

      await IO.fetchContent(this.session).then(x => {
        const rs = x.data.result;
        const get = (key) => {
          const found = rs.find(rec => rec.key === key);
          if ( found ) {
            return found.value
          } else {
            return undefined;
          }
        };
        this.state.steps[0].heading = get('heading1') || "Where will you be visiting?";
        this.state.steps[1].heading = get('heading2') || "Who will be visiting?";
        this.state.steps[2].heading = get('heading3') || "When would you like to visit?";
        this.state.dataValues.messages.noAvailability = get('noAvailability') || "We're sorry, given your request, we don't have any time slots that can accomodate you.";
        this.state.dataValues.messages.visitationNotOpen = get('visitationNotOpen') || "We're sorry. Visitation is currently not open. Check back later.";
        this.state.visitRequest.visitConfirmationMessage = get('visitConfirmationMessage') || "A confirmation email has been sent to your email. Please call us if you unable to make your visit."
      });

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
      Object.assign(this.state.visitRequest, vals);
      IO.updateVisitRequest(
        this.session, 
        this.state.visitRequest.visitRequestId,
        {'resident_bed_id': this.state.visitRequest.residentBed}
      ).then(() => {
        this.stepForward();
      }).catch(err => {
        this.notify(err);
      });
    }

    visitorFormSubmit = (vals) => {
      const self = this;
      Object.assign(this.state.visitRequest, vals);
      const newScreenings = this.state.visitRequest.visitors.map(visitor => {
            return [0, 0, {
              name: visitor.name,
              email: visitor.email,
              street: visitor.street,
              city: visitor.city,
              state_id: visitor.stateId,
              test_date: visitor.testDate,
            }]
          })
      newScreenings.unshift([6, 0, []]);
      IO.updateVisitRequest(
        this.session, 
        this.state.visitRequest.visitRequestId,
        {'screening_ids': newScreenings}
      ).then(() => {
        IO.fetchAvailabilities(
          this.session,
          this.state.visitRequest.visitRequestId
        ).then(rs => {
          self.state.dataValues.availabilities = rs.data.result;
          this.stepForward();
        }).catch(err => {
          this.notify(err);
        });
      }).catch(err => {
        this.notify(err);
      });
    }

    schedulingFormSubmit = (vals) => {
      Object.assign(this.state.visitRequest, vals);
      IO.updateVisitRequest(
        this.session, 
        this.state.visitRequest.visitRequestId,
        {'requested_availability_id': this.state.visitRequest.availabilitySlot}
      ).then(() => {
        this.stepForward();
      }).catch(err => {
        this.notify(err);
      });
    }

  }

  return { VisitationApp };

});
