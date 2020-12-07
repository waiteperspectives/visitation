odoo.define("visitation.visitationAppVisitorForm", function (require) {
  "use strict";

  const { Component, useState } = owl;
  const { xml } = owl.tags;
  const {
    StepForm,
    Visitor,
    ToggleButtonGroup,
  } = require("visitation.visitationAppBase");

  class VisitorCard extends Component {
    static template = xml`
      <div class="VisitorCard card mb-3">
        <div class="card-body">
          <div class="row justify-content-between">
            <h5 class="card-title mb-2 text-muted">
              <span>Visitor #</span>
              <span t-esc="props.counter" />
            </h5>
            <t t-if="props.counter === 2">
              <button type="button" class="btn btn-primary" t-on-click="notifyCopyAddress">
                Copy Address from Visitor #1
              </button>
            </t>
          </div>
          <div class="form-group">
            <label for="visitorFirstName">
              First Name
              <span class="text-danger">*</span>
            </label>
            <input class="form-control" name="visitorFirstName" t-model="state.visitorFirstName" t-on-change="update" />
          </div>
          <div class="form-group">
            <label for="visitorLastName">
              Last Name
              <span class="text-danger">*</span>
            </label>
            <input class="form-control" name="visitorLastName" t-model="state.visitorLastName" t-on-change="update" />
          </div>
          <div class="form-group">
            <label for="visitorEmail">
              Email
              <span class="text-danger">*</span>
            </label>
            <input class="form-control" t-att-class="isValidEmail(state.visitorEmail)" name="visitorEmail" t-model="state.visitorEmail" t-on-change="update" t-on-blur="firstPassCompleteEmail" />
          </div>
          <div class="form-group">
            <label for="visitorPhone">
              Day Phone
              <span class="text-danger">*</span>
            </label>
            <input type="tel" class="form-control" t-att-class="isValidPhone(state.visitorPhone)" name="visitorPhone" t-on-change="update" t-on-blur="firstPassCompletePhone" t-on-input="phoneMask" t-att-value="state.visitorPhone" />
          </div>
          <div class="form-group">
            <label for="visitorPhone2">
              Evening Phone
              <span class="text-danger">*</span>
            </label>
            <input type="tel" class="form-control" t-att-class="isValidPhone2(state.visitorPhone2)" name="visitorPhone2" t-on-change="update" t-on-blur="firstPassCompletePhone2" t-on-input="phoneMask" t-att-value="state.visitorPhone2" />
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
          <div class="form-group">
            <label for="visitorTestDate">
              What is the date you have an appointment to be tested?
              <span class="text-danger">*</span>
            </label>
            <input type="date" class="form-control" name="visitorTestDate" t-model="state.visitorTestDate" t-on-change="update" />
          </div>
          <div class="form-group">
            <label for="questionSuspectedPositive">
            Have you or anyone in your household been tested positive or suspected positive in the past 14 days?. A NEGATIVE TEST RESULT IS REQUIRED.
              <span class="text-danger">*</span>
            </label>
            <t t-set="answer" t-value="state.questionSuspectedPositive" />
            <select name="questionSuspectedPositive" class="form-control" t-on-change="onQuestionSuspectedPositiveChanged">
                <option t-if="!answer" value="" disabled="1" hidden="1" selected="1">-- Select --</option>
                <option t-att-selected="answer === 'yes'" value="yes">Yes</option>
                <option t-att-selected="answer === 'no'" value="no">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="questionAnyContact">
              Have you had any contact with anyone who is COVID positive or suspected positive in the past 14 days?
              <span class="text-danger">*</span>
            </label>
            <t t-set="answer" t-value="state.questionAnyContact" />
            <select name="questionAnyContact" class="form-control" t-on-change="onQuestionAnyContactChanged">
                <option t-if="!answer" value="" disabled="1" hidden="1" selected="1">-- Select --</option>
                <option t-att-selected="answer === 'yes'" value="yes">Yes</option>
                <option t-att-selected="answer === 'no'" value="no">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="questionAnySymptoms">
              Do you have now or have you had in the past 10 days any symptoms of COVID 19, including fever or chills, cough, shortness of breath or difficulty breathing, fatigue, muscle or body aches, headache, new loss of taste or smell, sore throat, congestion or runny nose, nausea, vomiting, diarrhea?
              <span class="text-danger">*</span>
            </label>
            <t t-set="answer" t-value="state.questionAnySymptoms" />
            <select name="questionAnySymptoms" class="form-control" t-on-change="onQuestionAnySymptomsChanged">
                <option t-if="!answer" value="" disabled="1" hidden="1" selected="1">-- Select --</option>
                <option t-att-selected="answer === 'yes'" value="yes">Yes</option>
                <option t-att-selected="answer === 'no'" value="no">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="questionAnyTravel">
              Have you travelled internationally or to any state identified by NYS as requiring 2 tests to get out of quarantine?
              <span class="text-danger">*</span>
            </label>
            <t t-set="answer" t-value="state.questionAnyTravel" />
            <select name="questionAnyTravel" class="form-control" t-on-change="onQuestionAnyTravelChanged">
                <option t-if="!answer" value="" disabled="1" hidden="1" selected="1">-- Select --</option>
                <option t-att-selected="answer === 'yes'" value="yes">Yes</option>
                <option t-att-selected="answer === 'no'" value="no">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="questionLargeGroups">
              Have you participated in any large group gathering in the past 14 days where facemasks were NOT used by you or others?
              <span class="text-danger">*</span>
            </label>
            <t t-set="answer" t-value="state.questionLargeGroups" />
            <select name="questionLargeGroups" class="form-control" t-on-change="onQuestionLargeGroupsChanged">
                <option t-if="!answer" value="" disabled="1" hidden="1" selected="1">-- Select --</option>
                <option t-att-selected="answer === 'yes'" value="yes">Yes</option>
                <option t-att-selected="answer === 'no'" value="no">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="questionSocialDistancing">
              Have you consistently practiced social distancing in all public areas and used a face mask when in public?
              <span class="text-danger">*</span>
            </label>
            <t t-set="answer" t-value="state.questionSocialDistancing" />
            <select name="questionSocialDistancing" class="form-control" t-on-change="onQuestionSocialDistancingChanged">
                <option t-if="!answer" value="" disabled="1" hidden="1" selected="1">-- Select --</option>
                <option t-att-selected="answer === 'yes'" value="yes">Yes</option>
                <option t-att-selected="answer === 'no'" value="no">No</option>
            </select>
          </div>
        </div>
      </div>
    `;

    isValidEmail = (email) => {
      if (this.visitorEmailFirstPass.flag) {
        return true;
      }
      if (
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          email
        )
      ) {
        return "";
      } else {
        return "is-invalid";
      }
    };
    isValidPhone2 = (phone) => {
      if (this.visitorPhone2FirstPass.flag) {
        return true;
      }
      if (/^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/.test(phone)) {
        return "";
      } else {
        return "is-invalid";
      }
    };
    isValidPhone = (phone) => {
      if (this.visitorPhoneFirstPass.flag) {
        return true;
      }
      if (/^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/.test(phone)) {
        return "";
      } else {
        return "is-invalid";
      }
    };
    questionLargeGroups;
    visitorEmailFirstPass = useState({ flag: true });
    firstPassCompleteEmail = () => {
      this.visitorEmailFirstPass.flag = false;
    };
    visitorPhoneFirstPass = useState({ flag: true });
    firstPassCompletePhone = () => {
      this.visitorPhoneFirstPass.flag = false;
    };
    visitorPhone2FirstPass = useState({ flag: true });
    firstPassCompletePhone2 = () => {
      this.visitorPhone2FirstPass.flag = false;
    };

    visitorTestDateFormatted = (visitorTestDate) => {
      let fmt = undefined;
      try {
        if (visitorTestDate && visitorTestDate !== null) {
          fmt = visitorTestDate.toJSON().split("T")[0];
        }
      } catch (err) {
        console.log(err);
      } finally {
        return fmt;
      }
    };

    state = useState({
      visitorFirstName: this.props.visitor.firstname,
      visitorLastName: this.props.visitor.lastname,
      visitorEmail: this.props.visitor.email,
      visitorPhone: this.props.visitor.phone,
      visitorPhone2: this.props.visitor.phone2,
      visitorStreet: this.props.visitor.street,
      visitorCity: this.props.visitor.city,
      visitorState:
        this.props.visitor.stateId ||
        this.props.states.find((x) => x.name == "New York").id,
      visitorZip: this.props.visitor.zip,
      visitorTestDate: this.visitorTestDateFormatted(
        this.props.visitor.testDate
      ),
      visitorPrimary: this.props.visitor.primary,
      // questions
      questionSuspectedPositive: this.props.visitor.questionSuspectedPositive,
      questionAnyContact: this.props.visitor.questionAnyContact,
      questionAnySymptoms: this.props.visitor.questionAnySymptoms,
      questionAnyTravel: this.props.visitor.questionAnyTravel,
      questionLargeGroups: this.props.visitor.questionLargeGroups,
      questionSocialDistancing: this.props.visitor.questionSocialDistancing,
    });

    phoneMask = (e) => {
      const x = e.target.value
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      e.target.value = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
      if (e.target.name === "visitorPhone") {
        this.state.visitorPhone = e.target.value;
      }
      if (e.target.name === "visitorPhone2") {
        this.state.visitorPhone2 = e.target.value;
      }
    };

    update = () => {
      const state = this.props.states.find(
        (s) => s.id === parseInt(this.state.visitorState)
      );
      const stateName = state ? state.name : "";
      const visitor = new Visitor({
        firstname: this.state.visitorFirstName,
        lastname: this.state.visitorLastName,
        email: this.state.visitorEmail,
        phone: this.state.visitorPhone,
        phone2: this.state.visitorPhone2,
        street: this.state.visitorStreet,
        city: this.state.visitorCity,
        stateId: this.state.visitorState,
        stateName: stateName,
        zip: this.state.visitorZip,
        testDate: new Date(this.state.visitorTestDate),
        primary: this.state.visitorPrimary,
        // questions
        questionSuspectedPositive: this.state.questionSuspectedPositive,
        questionAnyContact: this.state.questionAnyContact,
        questionAnySymptoms: this.state.questionAnySymptoms,
        questionAnyTravel: this.state.questionAnyTravel,
        questionLargeGroups: this.state.questionLargeGroups,
        questionSocialDistancing: this.state.questionSocialDistancing,
      });
      visitor.id = this.props.visitor.id;
      this.props.update(visitor);
    };

    onVisitorStateChanged = (e) => {
      this.state.visitorState = e.target.value;
      this.update();
    };

    onQuestionSuspectedPositiveChanged = (e) => {
      this.state.questionSuspectedPositive = e.target.value;
      this.update();
    };

    onQuestionAnyContactChanged = (e) => {
      this.state.questionAnyContact = e.target.value;
      this.update();
    };

    onQuestionAnySymptomsChanged = (e) => {
      this.state.questionAnySymptoms = e.target.value;
      this.update();
    };

    onQuestionAnyTravelChanged = (e) => {
      this.state.questionAnyTravel = e.target.value;
      this.update();
    };

    onQuestionLargeGroupsChanged = (e) => {
      this.state.questionLargeGroups = e.target.value;
      this.update();
    };

    onQuestionSocialDistancingChanged = (e) => {
      this.state.questionSocialDistancing = e.target.value;
      this.update();
    };

    notifyCopyAddress = () => {
      this.trigger("copy-visitor-address", { ndx: this.props.counter - 1 });
    };
  }

  class VisitorForm extends StepForm {
    static template = xml`
      <div class="VisitorForm container mt-3">
        <div class="row justify-content-center">
          <div class="VisitationApp-form pb-3">
            <div class="row justify-content-start">
              <div class="col">
                <h3>How many people will be visiting?</h3>
              </div>
              <div class="col d-flex align-items-center">
                <ToggleButtonGroup options="state.options" setOptions="setOptions" />
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <form t-on-submit.prevent="nextStep" class="VisitationApp-form" t-on-copy-visitor-address.prevent="onCopyVisitorAddress">
            <t t-set="visitorCounter" t-value="0" />
            <t t-foreach="state.visitors" t-as="visitor" t-key="visitor.id">
              <t t-set="visitorCounter" t-value="visitorCounter + 1" />
              <VisitorCard visitor="visitor" update="updateVisitor" states="props.dataValues.states" counter="visitorCounter" />
            </t>
            <p class="text-muted font-italic">
            New York State permits 2 visitors for this upcoming visit. One must be 18 or older.
            </p>
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
    };

    addVisitor = () => {
      this.state.visitors.push(new Visitor({}));
    };

    updateVisitor = (visitor) => {
      const newVisitors = [...this.state.visitors];
      const ndx = newVisitors.findIndex((v) => v.id === visitor.id);
      newVisitors.splice(ndx, 1, visitor);
      this.state.visitors = newVisitors;
    };

    onCopyVisitorAddress = (e) => {
      const fieldsToCopy = [
        "phone",
        "phone2",
        "street",
        "city",
        "stateId",
        "stateName",
        "zip",
      ];
      const visitor1 = this.state.visitors[0];
      const visitorN = Visitor.copyVisitor(this.state.visitors[e.detail.ndx]);
      fieldsToCopy.forEach((fld) => {
        visitorN[fld] = visitor1[fld];
      });
      this.updateVisitor(visitorN);
    };

    removeLastVisitor = () => {
      if (this.state.visitors.length > 0) {
        this.state.visitors = this.state.visitors.slice(
          0,
          this.state.visitors.length - 1
        );
      }
    };

    manageVisitorCount = () => {
      const selectedOpt = this.state.options.find(
        (opt) => opt.selected === true
      );
      switch (selectedOpt.key) {
        case 1:
          if (this.state.visitors.length === 2) {
            this.removeLastVisitor();
          }
          break;
        case 2:
          if (this.state.visitors.length === 1) {
            this.addVisitor();
          }
          break;
        default:
          throw new Error("case not handled");
      }
    };

    state = useState({
      visitors: this.props.init.visitors.length
        ? this.props.init.visitors
        : this.generateDefaultVisitors(),
      options: [
        { key: 1, name: "One", selected: true },
        { key: 2, name: "Two", selected: false },
      ],
    });

    setOptions = (opts) => {
      this.state.options = opts;
      this.manageVisitorCount();
    };

    validForm = () => {
      if (
        this.state.visitors
          .map((v) => {
            return v.isValid();
          })
          .includes(false)
      ) {
        return false;
      }
      return true;
    };

    static components = { VisitorCard, ToggleButtonGroup };
  }

  return { VisitorForm };
});
