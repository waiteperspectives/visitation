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
            <label for="visitorName">
              Name
              <span class="text-danger">*</span>
            </label>
            <input class="form-control" name="visitorName" t-model="state.visitorName" t-on-change="update" />
          </div>
          <div class="form-group">
            <label for="visitorEmail">
              Email
              <span class="text-danger">*</span>
            </label>
            <input class="form-control" t-att-class="isValidEmail(state.visitorEmail)" name="visitorEmail" t-model="state.visitorEmail" t-on-change="update" t-on-blur="firstPassComplete" />
          </div>
          <div class="form-group">
            <label for="visitorTestDate">
              Test Date
              <span class="text-danger">*</span>
            </label>
            <input type="date" class="form-control" name="visitorTestDate" t-model="state.visitorTestDate" t-on-change="update" />
          </div>
          <div class="form-group">
            <label for="visitorStreet">
              Street
              <span class="text-danger">*</span>
            </label>
            <input class="form-control" name="visitorStreet" t-model="state.visitorStreet" t-on-change="update" />
          </div>
          <div class="form-group">
            <label for="visitorCity">
              City
              <span class="text-danger">*</span>
            </label>
            <input class="form-control" name="visitorCity" t-model="state.visitorCity" t-on-change="update" />
          </div>
          <div class="form-group">
            <label for="visitorState">
              State
              <span class="text-danger">*</span>
            </label>
            <select name="visitorState" class="form-control" t-on-change="onVisitorStateChanged">
              <t t-foreach="props.states" t-as="stateRecord" t-key="stateRecord.id">
                <t t-if="!state.visitorState">
                  <option t-att-selected="stateRecord.name == 'New York'" t-att-value="stateRecord.id"><t t-esc="stateRecord.name" /></option>
                </t>
                <t t-else="">
                  <option t-att-selected="stateRecord.id == state.visitorState" t-att-value="stateRecord.id"><t t-esc="stateRecord.name" /></option>
                </t>
              </t>
            </select>
          </div>
          <div class="form-group">
            <label for="visitorZip">
              Zip
              <span class="text-danger">*</span>
            </label>
            <input class="form-control" name="visitorZip" t-model="state.visitorZip" t-on-change="update" />
          </div>
        </div>
      </div>
    `;

    isValidEmail = (email) => {
      if ( this.visitorEmailFirstPass.flag ) {
        return true;
      }
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
         return '';
      } else {
       return 'is-invalid';
      }
    }

    visitorEmailFirstPass = useState({flag: true});
    firstPassComplete = () => {
      this.visitorEmailFirstPass.flag = false;
    }

    state = useState({
      visitorName: this.props.visitor.name,
      visitorEmail: this.props.visitor.email,
      visitorStreet: this.props.visitor.street,
      visitorCity: this.props.visitor.city,
      visitorState: this.props.visitor.stateId,
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
            <h3><t t-esc="props.heading" /></h3>
            <t t-foreach="state.visitors" t-as="visitor" t-key="visitor.id">
              <VisitorCard visitor="visitor" update="updateVisitor" states="props.dataValues.states" />
            </t>
            <div t-if="state.visitors.length &lt; 2" class="d-flex justify-content-start mb-2">
              <button class="btn btn-link" type="button" t-on-click="addVisitor">
                <i class="fa fa-plus" />
                Add Visitor
              </button>
            </div>
            <div t-if="state.visitors.length == 2" class="d-flex justify-content-start">
              <button class="btn btn-link" type="button" t-on-click="removeLastVisitor">
                <i class="fa fa-plus" />
                Remove Visitor
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

    removeLastVisitor = () => {
      if ( this.state.visitors.length > 0 ) {
        this.state.visitors = this.state.visitors.slice(0, this.state.visitors.length - 1);
      }
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
