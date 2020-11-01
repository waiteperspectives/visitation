odoo.define('visitation.visitationAppComponents', function() {
  'use strict';

  const { Component, useState } = owl;
  const { xml } = owl.tags;

  class Visitor {
    constructor(kwargs) {
      this.id = Math.floor(Math.random() * 10000);
      this.name = kwargs.name || "";
      this.email = kwargs.email || "";
      this.testDate = kwargs.testDate || undefined;
      this.primary = kwargs.primary || false;
    }

    isValid = () => {
      if ( !this.name ) { return false; }
      if ( !this.testDate instanceof Date || isNaN(this.testDate) ) { return false; }
      if ( this.primary && !this.email ) { return false; }
      return true
    }

    toJson = () => {
      return {
        name: this.name,
        email: this.email,
        testDate: this.testDate.toISOString(),
        primary: this.primary,
      }
    }

    static fromJson = (json) => {
      kwargs = {
        name: json.name,
        email: json.email,
        testDate: new Date(json.testDate),
        primary: json.primary,
      };
      return new Visitor(kwargs);
    }
  }

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
          <div class="col-md-6 text-center">
            <h1>TODO</h1>
            <button class="btn" t-on-click="previousStep">
              <i class="fa fa-arrow-left" />
              Back
            </button>
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

  class VisitorCard extends Component {
    static template = xml`
      <div class="VisitorCard card mb-3">
        <div class="card-body">
          <div class="form-group">
            <label for="visitorName">Name</label>
            <input class="form-control" name="visitorName" t-model="state.visitorName" t-on-blur="update" />
          </div>
          <div t-if="state.visitorPrimary" class="form-group">
            <label for="visitorEmail">Email</label>
            <input class="form-control" name="visitorEmail" t-model="state.visitorEmail" t-on-blur="update" />
          </div>
          <div class="form-group">
            <label for="visitorTestDate">Test Date</label>
            <input type="date" class="form-control" name="visitorTestDate" t-model="state.visitorTestDate" t-on-blur="update" />
          </div>
        </div>
      </div>
    `;

    state = useState({
      visitorName: this.props.visitor.name,
      visitorEmail: this.props.visitor.email,
      visitorTestDate: this.props.visitor.testDate,
      visitorPrimary: this.props.visitor.primary,
    });

    update = () => {
      const visitor = new Visitor({
        name: this.state.visitorName,
        email: this.state.visitorEmail,
        testDate: new Date(this.state.visitorTestDate),
        primary: this.state.visitorPrimary,
      });
      visitor.id = this.props.visitor.id;
      this.props.update(visitor);
    }
  }

  class ScreeningForm extends StepForm {
    static template = xml`
      <div class="ScreeningForm container">
        <div class="row justify-content-center">
          <form t-on-submit.prevent="nextStep" class="col-md-6">
            <div class="form-group">
              <label for="residentRoom">What unit, room, bed position</label>
              <select id="residentRoom" class="form-control" placeholder="Pick a room" t-model="state.residentRoom">
                <t t-foreach="props.dataValues.rooms" t-as="room" t-key="room">
                  <option value="room"><t t-esc="room" /></option>
                </t>
              </select>
            </div>
            <t t-foreach="state.visitors" t-as="visitor" t-key="visitor.id">
              <VisitorCard visitor="visitor" update="updateVisitor" />
            </t>
            <div class="d-flex justify-content-start">
              <button class="btn" type="button" t-on-click="addVisitor">
                <i class="fa fa-plus" />
                Add Visitor
              </button>
            </div>
           <div class="d-flex justify-content-end">
             <button t-if="validForm()" type="submit" class="btn btn-primary">
               Forward
               <i class="fa fa-arrow-right" />
             </button>
           </div>
          </form>
        </div>
      </div>
    `;

    generateDefaultVisitors = () => {
      return [new Visitor({
        name: "",
        email: "",
        testDate: undefined,
        primary: true,
      })];
    }

    addVisitor = () => {
      this.state.visitors.push(new Visitor({}));
    }

    updateVisitor = (visitor) => {
      const newVisitors = [...this.state.visitors];
      const ndx = newVisitors.findIndex(v => v.id === visitor.id);
      newVisitors.splice(ndx, 1, visitor);
      this.state.visitors = newVisitors;
    }

    deleteVisitor = (visitor) => {
      this.state.visitors = this.state.visitors.filter(v => v.id !== visitor.id);
    }

    state = useState({
      residentRoom: this.props.init.residentRoom,
      visitors: this.props.init.visitors.length ? this.props.init.visitors: this.generateDefaultVisitors(),
    });

    validForm = () => {
      if ( !this.state.residentRoom ) { return false; }
      if ( this.state.visitors.map(v => {
        return v.isValid();
      }).includes(false) ) { return false; }
      return true;
    }

    static components = { VisitorCard };

  }

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


  class VisitationApp extends Component {
      static template = xml`
          <div class="VisitationApp container">
             <Stepper steps="state.steps" />
             <ScreeningForm init="state.visitRequest" dataValues="state.dataValues" addVisitor="addVisitor" nextStep="screeningFormSubmit" t-if="getCurrentIndex() === 0" />
             <SchedulingForm init="{visitRequest: state.visitRequest, availabilities: state.dataValues.availabilities}" nextStep="schedulingFormSubmit" previousStep="stepBackward" t-if="getCurrentIndex() === 1" />
             <ResultsForm init="{visitRequest: state.visitRequest, availabilities: state.dataValues.availabilities}" previousStep="stepBackward" t-if="getCurrentIndex() === 2" />
             <p class="text-muted">
               <span>Visit Request #</span>
               <span t-esc="state.visitRequest.visitRequestId"/>
               <span class="pr-1" />
               <span t-esc="state.visitRequest.visitRequestDate.toLocaleDateString()"/>
             </p>
          </div>
      `;

      static components = { Stepper, ScreeningForm, SchedulingForm, ResultsForm };

      state = useState({
        steps: [
          {key: 1, complete: true, last: false, first: true},
          {key: 2, complete: false, last: false, first: false},
          {key: 3, complete: false, last: true, first: false},
        ],
        dataValues: {
          rooms: ['123', '456', '780'],
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
          visitRequestSlot: 0,
          visitors: [],
      }
    });

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
