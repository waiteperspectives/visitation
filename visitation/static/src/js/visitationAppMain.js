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
             <Stepper steps="state.steps" />
             <ResidentForm init="state.visitRequest" dataValues="state.dataValues" nextStep="residentFormSubmit" t-if="getCurrentIndex() === 0" heading="state.steps[0].heading" />
             <VisitorForm init="state.visitRequest" dataValues="state.dataValues" addVisitor="addVisitor" previousStep="stepBackward" nextStep="visitorFormSubmit" t-if="getCurrentIndex() === 1" heading="state.steps[1].heading" />
             <SchedulingForm init="{visitRequest: state.visitRequest}" availabilities="state.dataValues.availabilities" nextStep="schedulingFormSubmit" previousStep="stepBackward" t-if="getCurrentIndex() === 2" heading="state.steps[2].heading" />
             <ResultsForm init="{visitRequest: state.visitRequest}" availabilities="state.dataValues.availabilities" previousStep="stepBackward" t-if="getCurrentIndex() === 3" heading="state.steps[3].heading" />
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
        steps: [
          {key: 1, heading: "Where will you be visiting?", complete: true, last: false, first: true},
          {key: 2, heading: "Who will be visiting?", complete: false, last: false, first: false},
          {key: 3, heading: "When would you like to visit?", complete: false, last: false, first: false},
          {key: 4, heading: "", complete: false, last: true, first: false},
        ],
        dataValues: {
          beds: [],
          states: [],
          availabilities: [],
        },
        visitRequestDate: new Date(),
        visitRequest: {
          visitRequestId: undefined,
          visitConfirmationMessage: "A confirmation email has been sent to your email. Please call us if you unable to make your visit",
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
        if ( rs.length ) {
          const get = (key) => { return rs.find(rec => rec.key === key).value };
          this.state.steps[0].heading = get('heading1');
          this.state.steps[1].heading = get('heading2');
          this.state.steps[2].heading = get('heading3') ;
        }
      });

      IO.fetchStates(this.session).then(rs => {
        this.state.dataValues.states = rs.data.result;
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

    residentFormSubmit = (vals) => {
      Object.assign(this.state.visitRequest, vals);
      IO.updateVisitRequest(
        this.session, 
        this.state.visitRequest.visitRequestId,
        {'resident_bed_id': this.state.visitRequest.residentBed}
      ).then(() => {
        this.stepForward();
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
        });
        this.stepForward();
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
      });
    }

  }

  return { VisitationApp };

});
