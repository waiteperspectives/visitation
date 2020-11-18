odoo.define('visitation.visitationAppBase', function () {
  'use strict';

  const { Component } = owl;
  const { xml } = owl.tags;

  class Visitor {
    constructor(kwargs) {
      this.id = Math.floor(Math.random() * 10000);
      this.firstname = kwargs.firstname || "";
      this.lastname = kwargs.lastname || "";
      this.email = kwargs.email || "";
      this.phone = kwargs.phone || "";
      this.phone2 = kwargs.phone2 || "";
      this.street = kwargs.street || "";
      this.city = kwargs.city || "";
      this.stateId = kwargs.stateId || "";
      this.stateName = kwargs.stateName || "";
      this.zip = kwargs.zip || "";
      this.testDate = kwargs.testDate || undefined;
      this.primary = kwargs.primary || false;
      // questions
      this.questionSuspectedPositive = kwargs.questionSuspectedPositive || undefined;
      this.questionAnyContact = kwargs.questionAnyContact || undefined;
      this.questionAnySymptoms = kwargs.questionAnySymptoms || undefined;
      this.questionAnyTravel = kwargs.questionAnyTravel || undefined;
      this.questionLargeGroups = kwargs.questionLargeGroups || undefined;
      this.questionSocialDistancing = kwargs.questionSocialDistancing || undefined;
    }

    isValid = () => {
      if ( !this.firstname ) { return false; }
      if ( !this.lastname ) { return false; }
      if ( !this.email ) { return false; }
      if ( !this.phone ) { return false; }
      if ( !this.phone2 ) { return false; }
      if ( !this.street ) { return false; }
      if ( !this.city ) { return false; }
      if ( !this.stateId ) { return false; }
      if ( !this.zip ) { return false; }
      if ( !this.testDate instanceof Date || isNaN(this.testDate) ) { return false; }
      if ( !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email) ) { return false; }
      if ( !/^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/.test(this.phone) ) { return false; }
      if ( !/^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/.test(this.phone2) ) { return false; }
      // questions
      if ( this.questionSuspectedPositive === undefined ) { return false; }
      if ( this.questionAnyContact === undefined ) { return false; }
      if ( this.questionAnySymptoms === undefined ) { return false; }
      if ( this.questionAnyTravel === undefined ) { return false; }
      if ( this.questionLargeGroups === undefined ) { return false; }
      if ( this.questionSocialDistancing === undefined ) { return false; }
      return true
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
