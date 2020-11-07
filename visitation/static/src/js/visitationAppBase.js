odoo.define('visitation.visitationAppBase', function () {
  'use strict';

  const { Component } = owl;
  const { xml } = owl.tags;

  class Visitor {
    constructor(kwargs) {
      this.id = Math.floor(Math.random() * 10000);
      this.name = kwargs.name || "";
      this.email = kwargs.email || "";
      this.street = kwargs.street || "";
      this.city = kwargs.city || "";
      this.stateId = kwargs.stateId || "";
      this.stateName = kwargs.stateName || "";
      this.zip = kwargs.zip || "";
      this.testDate = kwargs.testDate || undefined;
      this.primary = kwargs.primary || false;
    }

    isValid = () => {
      if ( !this.name ) { return false; }
      if ( !this.email ) { return false; }
      if ( !this.street ) { return false; }
      if ( !this.city ) { return false; }
      if ( !this.stateId ) { return false; }
      if ( !this.zip ) { return false; }
      if ( !this.testDate instanceof Date || isNaN(this.testDate) ) { return false; }
      if ( !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email) ) { return false; }
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

    static generatePrimaryVisitor = () => {
      const visitor = new Visitor({});
      visitor.primary = true;
      return visitor;
    }
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


  return {
    Visitor,
    StepForm,
  };

});
