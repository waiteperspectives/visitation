odoo.define("visitation.visitationAppBase", function () {
  "use strict";

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
      this.questionSuspectedPositive =
        kwargs.questionSuspectedPositive || undefined;
      this.questionAnyContact = kwargs.questionAnyContact || undefined;
      this.questionAnySymptoms = kwargs.questionAnySymptoms || undefined;
      this.questionAnyTravel = kwargs.questionAnyTravel || undefined;
      this.questionLargeGroups = kwargs.questionLargeGroups || undefined;
      this.questionSocialDistancing =
        kwargs.questionSocialDistancing || undefined;
    }

    isValid = () => {
      if (!this.firstname) {
        return false;
      }
      if (!this.lastname) {
        return false;
      }
      if (!this.email) {
        return false;
      }
      if (!this.phone) {
        return false;
      }
      if (!this.phone2) {
        return false;
      }
      if (!this.street) {
        return false;
      }
      if (!this.city) {
        return false;
      }
      if (!this.stateId) {
        return false;
      }
      if (!this.zip) {
        return false;
      }
      if (!this.testDate instanceof Date || isNaN(this.testDate)) {
        return false;
      }
      if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          this.email
        )
      ) {
        return false;
      }
      if (!/^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/.test(this.phone)) {
        return false;
      }
      if (!/^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/.test(this.phone2)) {
        return false;
      }
      // questions
      if (this.questionSuspectedPositive === undefined) {
        return false;
      }
      if (this.questionAnyContact === undefined) {
        return false;
      }
      if (this.questionAnySymptoms === undefined) {
        return false;
      }
      if (this.questionAnyTravel === undefined) {
        return false;
      }
      if (this.questionLargeGroups === undefined) {
        return false;
      }
      if (this.questionSocialDistancing === undefined) {
        return false;
      }
      return true;
    };

    static generatePrimaryVisitor = () => {
      const visitor = new Visitor({});
      visitor.primary = true;
      return visitor;
    };

    static copyVisitor = (visitor) => {
      return new Visitor({
        id: visitor.id,
        firstname: visitor.firstname,
        lastname: visitor.lastname,
        email: visitor.email,
        phone: visitor.phone,
        phone2: visitor.phone2,
        street: visitor.street,
        city: visitor.city,
        stateId: visitor.stateId,
        stateName: visitor.stateName,
        zip: visitor.zip,
        testDate: visitor.testDate,
        primary: visitor.primary,
        // questions
        questionSuspectedPositive: visitor.questionSuspectedPositive,
        questionAnyContact: visitor.questionAnyContact,
        questionAnySymptoms: visitor.questionAnySymptoms,
        questionAnyTravel: visitor.questionAnyTravel,
        questionLargeGroups: visitor.questionLargeGroups,
        questionSocialDistancing: visitor.questionSocialDistancing,
      });
    };
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
      this.props.nextStep({ ...this.state });
    }

    previousStep() {
      this.props.previousStep();
    }
  }

  class ToggleButton extends Component {
    static template = xml`
      <span class="ToggleButton-container">
        <t t-if="props.selected">
          <button class="btn btn-primary ToggleButton ToggleButton-selected">
            <t t-esc="props.string" />
          </button>
        </t>
        <t t-else="">
          <button class="btn btn-secondary ToggleButton" t-on-click="notifyButtonClicked">
            <t t-esc="props.string" />
          </button>
        </t>
      </span>
    `;

    notifyButtonClicked = () => {
      this.trigger("toggle-button-clicked", { key: this.props.key });
    };
  }

  class ToggleButtonGroup extends Component {
    static template = xml`
      <div class="ToggleButtonGroup" t-on-toggle-button-clicked="handleButtonToggled">
        <t t-foreach="props.options" t-as="option" t-key="option.key">
          <ToggleButton
            key="option.key"
            string="option.name"
            selected="option.selected"
          />
        </t>
      </div>
    `;

    static components = { ToggleButton };

    handleButtonToggled = (e) => {
      const key = e.detail.key;
      const newOptions = [...this.props.options];
      newOptions.forEach((x) => {
        if (x.key === key) {
          x.selected = true;
        } else {
          x.selected = false;
        }
      });
      this.props.setOptions(newOptions);
    };
  }

  return {
    Visitor,
    StepForm,
    ToggleButtonGroup,
  };
});
