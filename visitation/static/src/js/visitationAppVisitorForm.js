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
            <input type="date" class="form-control" name="visitorTestDate" t-model="state.visitorTestDate" t-on-change="update" t-att-value="state.visitorTestDate" />
          </div>
          <div class="form-group">
            <label for="questionSuspectedPositive">
            Have you or anyone in your household been tested positive or suspected positive in the past 14 days?. A NEGATIVE TEST RESULT IS REQUIRED.
              <span class="text-danger">*</span>
            </label>
            <select name="questionSuspectedPositive" class="form-control" t-on-change="onQuestionSuspectedPositiveChanged">
                <option value="" disabled="1" hidden="1" selected="1"/>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="questionAnyContact">
              Have you had any contact with anyone who is COVID positive or suspected positive in the past 14 days?
              <span class="text-danger">*</span>
            </label>
            <select name="questionAnyContact" class="form-control" t-on-change="onQuestionAnyContactChanged">
                <option value="" disabled="1" hidden="1" selected="1"/>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="questionAnySymptoms">
              Do you have now or have you had in the past 10 days any symptoms of COVID 19, including fever or chills, cough, shortness of breath or difficulty breathing, fatigue, muscle or body aches, headache, new loss of taste or smell, sore throat, congestion or runny nose, nausea, vomiting, diarrhea?
              <span class="text-danger">*</span>
            </label>
            <select name="questionAnySymptoms" class="form-control" t-on-change="onQuestionAnySymptomsChanged">
                <option value="" disabled="1" hidden="1" selected="1"/>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="questionAnyTravel">
              Have you travelled internationally or to any state identified by NYS as requiring 2 tests to get out of quarantine?
              <span class="text-danger">*</span>
            </label>
            <select name="questionAnyTravel" class="form-control" t-on-change="onQuestionAnyTravelChanged">
                <option value="" disabled="1" hidden="1" selected="1"/>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="questionLargeGroups">
              Have you participated in any large group gathering in the past 14 days where facemasks were NOT used by you or others?
              <span class="text-danger">*</span>
            </label>
            <select name="questionLargeGroups" class="form-control" t-on-change="onQuestionLargeGroupsChanged">
                <option value="" disabled="1" hidden="1" selected="1"/>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="questionSocialDistancing">
              Have you participated in any large group gathering in the past 14 days where facemasks were NOT used by you or others?
              <span class="text-danger">*</span>
            </label>
            <select name="questionSocialDistancing" class="form-control" t-on-change="onQuestionSocialDistancingChanged">
                <option value="" disabled="1" hidden="1" selected="1"/>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
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
    isValidPhone2 = (phone) => {
      if ( this.visitorPhone2FirstPass.flag ) {
        return true;
      }
      if (/^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/.test(phone)) {
         return '';
      } else {
       return 'is-invalid';
      }
    }
    isValidPhone = (phone) => {
      if ( this.visitorPhoneFirstPass.flag ) {
        return true;
      }
      if (/^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/.test(phone)) {
         return '';
      } else {
       return 'is-invalid';
      }
    }

    visitorEmailFirstPass = useState({flag: true});
    firstPassCompleteEmail = () => {
      this.visitorEmailFirstPass.flag = false;
    }
    visitorPhoneFirstPass = useState({flag: true});
    firstPassCompletePhone = () => {
      this.visitorPhoneFirstPass.flag = false;
    }
    visitorPhone2FirstPass = useState({flag: true});
    firstPassCompletePhone2 = () => {
      this.visitorPhone2FirstPass.flag = false;
    }

    state = useState({
      visitorFirstName: this.props.visitor.firstname,
      visitorLastName: this.props.visitor.lastname,
      visitorEmail: this.props.visitor.email,
      visitorPhone: this.props.visitor.phone,
      visitorPhone2: this.props.visitor.phone2,
      visitorStreet: this.props.visitor.street,
      visitorCity: this.props.visitor.city,
      visitorState: this.props.visitor.stateId || this.props.states.find(x => x.name == 'New York').id,
      visitorZip: this.props.visitor.zip,
      visitorTestDate: this.props.visitor.testDate,
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
      const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
      if ( e.target.name === 'visitorPhone' ) {
        this.state.visitorPhone = e.target.value;
      }
      if ( e.target.name === 'visitorPhone2' ) {
        this.state.visitorPhone2 = e.target.value;
      }
    }

    update = () => {
      const state = this.props.states.find(s => s.id === parseInt(this.state.visitorState));
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
    }

    onVisitorStateChanged = (e) => {
      this.state.visitorState = e.target.value;
      this.update();
    }

    onQuestionSuspectedPositiveChanged = (e) => {
      this.state.questionSuspectedPositive = e.target.value;
      this.update();
    }

    onQuestionAnyContactChanged = (e) => {
      this.state.questionAnyContact = e.target.value;
      this.update();
    }

    onQuestionAnySymptomsChanged = (e) => {
      this.state.questionAnySymptoms = e.target.value;
      this.update();
    }

    onQuestionAnyTravelChanged = (e) => {
      this.state.questionAnyTravel = e.target.value;
      this.update();
    }

    onQuestionLargeGroupsChanged = (e) => {
      this.state.questionLargeGroups = e.target.value;
      this.update();
    }

    onQuestionSocialDistancingChanged = (e) => {
      this.state.questionSocialDistancing = e.target.value;
      this.update();
    }


  //zzz

  }

  class VisitorForm extends StepForm {
    static template = xml`
      <div class="VisitorForm container mt-3">
        <div class="row justify-content-center">
          <form t-on-submit.prevent="nextStep" class="VisitationApp-form">
            <h3><t t-esc="props.heading" /></h3>
            <t t-foreach="state.visitors" t-as="visitor" t-key="visitor.id">
              <VisitorCard visitor="visitor" update="updateVisitor" states="props.dataValues.states" />
            </t>
            <p class="text-muted font-italic">
            New York State permits 2 visitors for this upcoming visit. One must be 18 or older.
            </p>
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
