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
            <input class="form-control" name="visitorName" t-model="state.visitorName" t-on-change="update" />
          </div>
          <div class="form-group">
            <label for="visitorEmail">Email</label>
            <input class="form-control" name="visitorEmail" t-model="state.visitorEmail" t-on-change="update" />
          </div>
          <div class="form-group">
            <label for="visitorTestDate">Test Date</label>
            <input type="date" class="form-control" name="visitorTestDate" t-model="state.visitorTestDate" t-on-change="update" />
          </div>
          <div class="form-group">
            <label for="visitorStreet">Street</label>
            <input class="form-control" name="visitorStreet" t-model="state.visitorStreet" t-on-change="update" />
          </div>
          <div class="form-group">
            <label for="visitorCity">City</label>
            <input class="form-control" name="visitorCity" t-model="state.visitorCity" t-on-change="update" />
          </div>
          <div class="form-group">
            <label for="visitorState">State</label>
            <select name="visitorState" class="form-control" t-on-change="onVisitorStateChanged">
              <option value="" selected="1" disabled="1" hidden="1">Choose State</option>
              <t t-foreach="props.states" t-as="state" t-key="state.id">
                <option t-att-value="state.id"><t t-esc="state.name" /></option>
              </t>
            </select>
          </div>
          <div class="form-group">
            <label for="visitorZip">Zip</label>
            <input class="form-control" name="visitorZip" t-model="state.visitorZip" t-on-change="update" />
          </div>
        </div>
      </div>
    `;

    state = useState({
      visitorName: this.props.visitor.name,
      visitorEmail: this.props.visitor.email,
      visitorStreet: this.props.visitor.street,
      visitorCity: this.props.visitor.city,
      visitorState: this.props.visitor.state,
      visitorZip: this.props.visitor.zip,
      visitorTestDate: this.props.visitor.testDate,
      visitorPrimary: this.props.visitor.primary,
    });

    update = () => {
      const state = this.props.states.find(s => s.id === parseInt(this.state.visitorState));
      const stateName = state ? state.name : "";
      const visitor = new Visitor({
        name: this.state.visitorName,
        email: this.state.visitorEmail,
        street: this.state.visitorStreet,
        city: this.state.visitorCity,
        stateId: this.state.visitorState,
        stateName: stateName, 
        zip: this.state.visitorZip,
        testDate: new Date(this.state.visitorTestDate),
        primary: this.state.visitorPrimary,
      });
      visitor.id = this.props.visitor.id;
      this.props.update(visitor);
    }

    onVisitorStateChanged = (e) => {
      this.state.visitorState = e.target.value;
      this.update();
    }

  }

  class VisitorForm extends StepForm {
    static template = xml`
      <div class="VisitorForm container mt-3">
        <div class="row justify-content-center">
          <form t-on-submit.prevent="nextStep" class="col-md-6">
            <h3>Who will be visiting?</h3>
            <t t-foreach="state.visitors" t-as="visitor" t-key="visitor.id">
              <VisitorCard visitor="visitor" update="updateVisitor" states="props.dataValues.states" />
            </t>
            <div t-if="state.visitors.length &lt; 2" class="d-flex justify-content-start">
              <button class="btn" type="button" t-on-click="addVisitor">
                <i class="fa fa-plus" />
                Add Visitor
              </button>
            </div>
           <div class="d-flex justify-content-between">
              <button type="button" t-on-click="previousStep" class="btn btn-outline-secondary">
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

    generateDefaultVisitors = () => {
      return [Visitor.generatePrimaryVisitor()];
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
      visitors: this.props.init.visitors.length ? this.props.init.visitors: this.generateDefaultVisitors(),
    });

    validForm = () => {
      if ( this.state.visitors.map(v => {
        return v.isValid();
      }).includes(false) ) { return false; }
      return true;
    }

    static components = { VisitorCard };

  }

  return { VisitorForm }
});
