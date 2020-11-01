odoo.define('visitation.visitationAppVisitorForm', function(require) {
  'use strict';

  const { Component, useState } = owl;
  const { xml } = owl.tags;
  const { StepForm, Visitor } = require('visitation.visitationAppBase');

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

  return {
    ScreeningForm
  }

});
