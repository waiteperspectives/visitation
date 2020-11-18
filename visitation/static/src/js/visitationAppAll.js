odoo.define("visitation.visitationAppIO", function(require) {
  "use strict";

  class OdooSession {
    constructor(host, port, db, username, password) {
      this.host = host;
      this.port = port;
      this.db = db;
      this.username = username;
      this.password = password;
      this.url = "/jsonrpc";
      this.uid = false;
    }

    login = async () => {
      const params = {
        "service": "common",
        "method": "login",
        "args": [this.db, this.username, this.password]
      };
      const rpcArgs = {
        "jsonrpc": "2.0",
        "method": "call",
        "params": params,
        "id": Math.floor(Math.random() * 100000)
      };
      try {
        return axios.post(this.url, rpcArgs);
      } catch (err) {
        console.error(err);
      }
    }

    ensure_login = async () => {
      if ( !this.uid ) {
        await this.login().then(rs => {
          this.uid = rs.data.result;
        });
      }
    };

    search = async (model, domain, context) => {
      await this.ensure_login();
      const _domain = domain || [[]];
      const _context = context || {};
      const params = {
        "service": "object",
        "method": "execute_kw",
        "args": [this.db, this.uid, this.password, model, "search", _domain, _context]
      };
      const rpcArgs = {
        "jsonrpc": "2.0",
        "method": "call",
        "params": params,
        "id": Math.floor(Math.random() * 100000),
        "withCredentials": true,
      };
      return axios.post(this.url, rpcArgs);
    }

    searchRead = async (model, domain, fields) => {
      await this.ensure_login();
      const args = [];
      const _domain = domain || [];
      args.push(_domain);
      const _fields = fields || [];
      const kwargs = {};
      kwargs["fields"] = _fields;
      const params = {
        "service": "object",
        "method": "execute_kw",
        "args": [this.db, this.uid, this.password, model, "search_read", args, kwargs]
      };
      const rpcArgs = {
        "jsonrpc": "2.0",
        "method": "call",
        "params": params,
        "id": Math.floor(Math.random() * 100000),
        "withCredentials": true,
      };
      return axios.post(this.url, rpcArgs);
    }

    write = async (model, id, vals) => {
      await this.ensure_login();
      const args = [id];
      const _vals = vals || {};
      args.push(_vals);
      const kwargs = {};
      const params = {
        "service": "object",
        "method": "execute_kw",
        "args": [this.db, this.uid, this.password, model, "write", args, kwargs]
      };
      const rpcArgs = {
        "jsonrpc": "2.0",
        "method": "call",
        "params": params,
        "id": Math.floor(Math.random() * 100000),
        "withCredentials": true,
      };
      return axios.post(this.url, rpcArgs);
    }

    create = async (model, vals) => {
      await this.ensure_login();
      const args = [];
      const _vals = vals || {};
      args.push(_vals);
      const kwargs = {};
      const params = {
        "service": "object",
        "method": "execute_kw",
        "args": [this.db, this.uid, this.password, model, "create", args, kwargs]
      };
      const rpcArgs = {
        "jsonrpc": "2.0",
        "method": "call",
        "params": params,
        "id": Math.floor(Math.random() * 100000),
        "withCredentials": true,
      };
      return axios.post(this.url, rpcArgs);
    }
  }

  class IO {
    static fetchStates = async (session) => {
      return session.searchRead("res.country.state", [["country_id", "=", 233]], ["id", "name"]);
    }

    static fetchBeds = async (session) => {
      const bedResult = await session.searchRead("x_resident_bed", [], ["id", "x_unit_id", "x_room_id", "x_bed_position"])
      bedResult.data.result.forEach(bed => {
        bed.unit_id = bed.x_unit_id;
        bed.room_id = bed.x_room_id;
        bed.bed_position = bed.x_bed_position;
        bed.bed_id = [bed.id, bed.x_bed_position];
      });
      return new Promise(resolve => resolve(bedResult));
    }

    static fetchContent = async (session) => {
      const contentResult = await session.searchRead("x_visitation_content", [], ["x_key", "x_value"]);
      contentResult.data.result.forEach(content => {
        content.key = content.x_key;
        content.value = content.x_value;
      });
      return new Promise(resolve => resolve(contentResult));
    }

    static fetchAvailabilities = async (session, id) => {
      const visitRequestRaw = await session.searchRead("x_visit_request", [["id", "=", id]], ["x_availability_ids"]);
      const visitRequestAvailabilityIds = visitRequestRaw.data.result[0].x_availability_ids;
      const availabilityResult = await session.searchRead("x_availability_slot", [["id", "in", visitRequestAvailabilityIds]], ["id", "x_name"]);
      availabilityResult.data.result.forEach(availability => {
        availability.name = availability.x_name;
      });
      return new Promise(resolve => resolve(availabilityResult));
    }

    static createVisitRequest = async (session) => {
      return session.create("x_visit_request", {});
    }

    static updateVisitRequest = async (session, id, vals) => {
      return session.write("x_visit_request", id, vals);
    };

    static updateRequestedAvailabilityId = async (session, id, availabilitySlotId) => {
      return this.updateVisitRequest(session, id, {"x_requested_availability_id": availabilitySlotId});
    }

    static updateVisitorScreenings = async (session, id, visitors) => {
      const newScreenings = visitors.map(visitor => {
            return [0, 0, {
              x_first_name: visitor.firstname,
              x_last_name: visitor.lastname,
              x_email: visitor.email,
              x_street: visitor.street,
              x_street2: visitor.street2,
              x_phone: visitor.phone,
              x_phone2: visitor.phone2,
              x_city: visitor.city,
              x_zip: visitor.zip,
              x_state_id: visitor.stateId,
              x_test_date: visitor.testDate,
              x_question_suspected_positive: visitor.questionSuspectedPositive,
              x_question_any_contact: visitor.questionAnyContact,
              x_question_any_symptoms: visitor.questionAnySymptoms,
              x_question_any_travel: visitor.questionAnyTravel,
              x_question_large_groups: visitor.questionLargeGroups,
              x_question_social_distancing: visitor.questionSocialDistancing,
            }]
          })
      newScreenings.unshift([6, 0, []]);
      return this.updateVisitRequest(session, id, {"x_screening_ids": newScreenings});
    }

    static updateResident = async (session, id, residentBed) => {
      return this.updateVisitRequest(session, id, {"x_resident_bed_id": residentBed});
    }

  }

  const _get = (rs, key) => {
    const found = rs.find(rec => rec.x_key === key);
    if ( found ) {
      return found.x_value
    } else {
      return undefined;
    }
  };

  return { IO, OdooSession, _get };
});

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
odoo.define('visitation.visitationAppStepper', function() {
  'use strict';

  const { Component } = owl;
  const { xml } = owl.tags;

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

  return { Stepper };

});
odoo.define('visitation.visitationAppResidentForm', function(require) {
  'use strict';

  const { useState } = owl;
  const { xml } = owl.tags;
  const { StepForm } = require('visitation.visitationAppBase');

  class ResidentForm extends StepForm {
    static template = xml`
      <div class="ResidentForm container mt-3">
        <div t-if="props.dataValues.beds.length" class="row justify-content-center">
          <form t-on-submit.prevent="nextStep" class="VisitationApp-form">
            <h3><t t-esc="props.heading" /></h3>
            <div class="form-group">
              <label for="residentUnit">
                Unit
                <span class="text-danger">*</span>
              </label>
              <select id="residentUnit" class="form-control" t-on-change="residentUnitChanged">
                <t t-foreach="filters.units" t-as="unit" t-key="unit.id">
                  <option value="" selected="1" disabled="1" hidden="1">Choose Unit</option>
                  <t t-if="unit.id == state.residentUnit">
                    <option t-att-value="unit.id" selected="1"><t t-esc="unit.name" /></option>
                  </t>
                  <t t-else="">
                    <option t-att-value="unit.id"><t t-esc="unit.name" /></option>
                  </t>
                </t>
              </select>
            </div>
            <div class="form-group">
              <label for="residentRoom">
                Room
                <span class="text-danger">*</span>
              </label>
              <select id="residentRoom" class="form-control" t-on-change="residentRoomChanged">
                <t t-foreach="filters.rooms" t-as="room" t-key="room.id">
                  <option value="" selected="1" disabled="1" hidden="1">Choose Room</option>
                  <t t-if="room.id == state.residentRoom">
                    <option t-att-value="room.id" selected="1"><t t-esc="room.name" /></option>
                  </t>
                  <t t-else="">
                    <option t-att-value="room.id"><t t-esc="room.name" /></option>
                  </t>
                </t>
              </select>
            </div>
            <div class="form-group">
              <label for="residentBed">
                Bed
                <span class="text-danger">*</span>
              </label>
              <select id="residentBed" class="form-control" t-on-change="residentBedChanged">
                <t t-foreach="filters.beds" t-as="bed" t-key="bed.id">
                  <option t-if="!state.residentBed" value="" selected="1" disabled="1" hidden="1">Choose Bed</option>
                  <t t-if="bed.id == state.residentBed">
                    <option t-att-value="bed.id" selected="1"><t t-esc="bed.name" /></option>
                  </t>
                  <t t-else="">
                    <option t-att-value="bed.id"><t t-esc="bed.name" /></option>
                  </t>
                </t>
              </select>
            </div>
           <div class="d-flex justify-content-end">
             <button t-if="validForm()" type="submit" class="btn btn-primary">
               Forward
               <i class="fa fa-arrow-right" />
             </button>
           </div>
          </form>
        </div>
        <div t-if="!props.dataValues.beds.length" class="row justify-content-center">
          <div class="row">
            <div class="alert alert-info" role="alert">
              <h1><t t-esc="props.dataValues.messages.visitationNotOpen" /></h1>
            </div>
          </div>
        </div>
      </div>
    `;

    getUnits = () => {
      let rs = [];
      const unit_ids = new Set(this.props.dataValues.beds.map(b => b.unit_id[0]));
      [...unit_ids].forEach(id => {
        const name = this.props.dataValues.beds.find(b => b.unit_id[0] === id).unit_id[1];
        rs.push({id: id, name: name})
      });
      return rs;
    }

    getRooms = (unit) => {
      let rs = [];
      const room_ids = new Set(this.props.dataValues.beds.filter(b => b.unit_id[0] === unit).map(b => b.room_id[0]));
      [...room_ids].forEach(id => {
        const name = this.props.dataValues.beds.find(b => b.room_id[0] === id).room_id[1];
        rs.push({id: id, name: name})
      });
      return rs;
    }

    getBeds = (room) => {
      let rs = [];
      const bed_ids = new Set(this.props.dataValues.beds.filter(b => b.room_id[0] === room).map(b => b.bed_id[0]));
      [...bed_ids].forEach(id => {
        const name = this.props.dataValues.beds.find(b => b.bed_id[0] === id).bed_id[1];
        rs.push({id: id, name: name})
      });
      return rs;
    }

    state = useState({
      residentRoom: this.props.init.residentRoom,
      residentUnit: this.props.init.residentUnit,
      residentBed: this.props.init.residentBed,
    });

    filters = useState({
      units: this.getUnits(),
      rooms: this.getRooms(this.state.residentUnit),
      beds: this.getBeds(this.state.residentRoom),
    });

    validForm = () => {
      if ( !this.state.residentUnit ) { return false; }
      if ( !this.state.residentRoom ) { return false; }
      if ( !this.state.residentBed ) { return false; }
      return true;
    }

    residentUnitChanged = (e) => {
      this.state.residentUnit = parseInt(e.target.value);
      this.filters.rooms = this.getRooms(parseInt(e.target.value));
    }

    residentRoomChanged = (e) => {
      this.state.residentRoom = parseInt(e.target.value);
      this.filters.beds = this.getBeds(parseInt(e.target.value));
    }

    residentBedChanged = (e) => {
      this.state.residentBed = parseInt(e.target.value);
    }

  }

  return {
    ResidentForm
  }

});
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
odoo.define('visitation.visitationAppSchedulingForm', function(require) {
  'use strict';

  const { StepForm } = require('visitation.visitationAppBase');
  const { useState } = owl;
  const { xml } = owl.tags;

  class SchedulingForm extends StepForm {
    static template = xml`
      <div class="SchedulingForm container mt-3">
        <div class="row justify-content-center">
          <form t-on-submit.prevent="nextStep" class="VisitationApp-form">
            <h3 t-if="props.availabilities.length"><t t-esc="props.heading" /></h3>
            <div t-if="props.availabilities.length" class="form-group">
              <label for="availabilitySlot">
                Time Slot
                <span class="text-danger">*</span>
              </label>
              <select id="availabilitySlot" class="form-control" t-on-change="availabilitySlotChanged">
                <option t-if="!state.availabilitySlot" value="" selected="1" disabled="1">Choose Time Slot</option>
                <t t-foreach="props.availabilities" t-as="availability">
                  <t t-if="availability.id == state.availabilitySlot">
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
            <div t-if="!props.availabilities.length" class="alert alert-info" role="alert">
              <p><t t-esc="props.dataValues.messages.noAvailability" /></p>
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

    state = useState({
      availabilitySlot: this.props.init.visitRequest.availabilitySlot,
    });

    validForm() {
      if ( !this.state.availabilitySlot ) { return false; }
      return true;
    }

    availabilitySlotChanged = (e) => {
      this.state.availabilitySlot = parseInt(e.target.value);
    }

  }

  return { SchedulingForm };
});
odoo.define('visitation.visitationAppResultsForm', function(require) {
  'use strict';

  const { StepForm } = require('visitation.visitationAppBase');
  const { useState } = owl;
  const { xml } = owl.tags;

  class ResultsForm extends StepForm {
    static template = xml`
      <div class="ResultsForm container mt-3">
        <div class="row justify-content-center">
          <form t-on-submit.prevent="" class="VisitationApp-form">
            <div class="alert alert-success" role="alert">
              <p>
              Your visit has been scheduled for:
              <strong><span t-esc="state.availabilitySlotLabel" /></strong>
              </p>
              <p>
                <t t-esc="state.visitConfirmationMessage" />
              </p>
            </div>
          </form>
        </div>
      </div>
    `;

    _getVisitRequestSlotLabel = () => {
      return this.props.availabilities.find(slot => slot.id == this.props.init.visitRequest.availabilitySlot).name;
    }

    state = useState({
      availabilitySlotLabel: this._getVisitRequestSlotLabel(), 
      visitConfirmationMessage: this.props.init.visitRequest.visitConfirmationMessage,
    });

  }

  return { ResultsForm };
});
odoo.define('visitation.visitationAppMain', function(require) {
  'use strict';

  const { IO, OdooSession, _get } = require('visitation.visitationAppIO');
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
             <div t-if="state.notification" class="alert alert-danger">
               <p t-esc="state.notification" />
             </div>
             <Stepper steps="state.steps" />
             <ResidentForm init="state.visitRequest" dataValues="state.dataValues" nextStep="residentFormSubmit" t-if="getCurrentIndex() === 0" heading="state.steps[0].heading" />
             <VisitorForm init="state.visitRequest" dataValues="state.dataValues" addVisitor="addVisitor" previousStep="stepBackward" nextStep="visitorFormSubmit" t-if="getCurrentIndex() === 1" heading="state.steps[1].heading" />
             <SchedulingForm init="{visitRequest: state.visitRequest}" dataValues="state.dataValues" availabilities="state.dataValues.availabilities" nextStep="schedulingFormSubmit" previousStep="stepBackward" t-if="getCurrentIndex() === 2" heading="state.steps[2].heading" />
             <ResultsForm init="{visitRequest: state.visitRequest}" dataValues="state.dataValues" availabilities="state.dataValues.availabilities" previousStep="stepBackward" t-if="getCurrentIndex() === 3" heading="state.steps[3].heading" />
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
        notification: undefined,
        steps: [
          {key: 1, heading: "", complete: true, last: false, first: true},
          {key: 2, heading: "", complete: false, last: false, first: false},
          {key: 3, heading: "", complete: false, last: false, first: false},
          {key: 4, heading: "", complete: false, last: true, first: false},
        ],
        dataValues: {
          beds: [],
          states: [],
          availabilities: [],
          messages: {
            visitationNotOpen: "", 
            noAvailability: "", 
          },
        },
        visitRequestDate: new Date(),
        visitRequest: {
          visitRequestId: undefined,
          visitConfirmationMessage: "",
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
      const bedResult = await IO.fetchBeds(this.session);
      this.state.dataValues.beds = bedResult.data.result;

      const contentResult = await IO.fetchContent(this.session);
      const content = contentResult.data.result;
      const get = key => _get(content, key);

      this.state.steps[0].heading = get('heading1') || "Where does the resident reside that you wish to visit?";
      this.state.steps[1].heading = get('heading2') || "Who will be visiting?";
      this.state.steps[2].heading = get('heading3') || "When would you like to visit?";
      this.state.dataValues.messages.noAvailability = get('noAvailability') || "We're sorry, given your request, we don't have any time slots that can accomodate you.";
      this.state.dataValues.messages.visitationNotOpen = get('visitationNotOpen') || "We're sorry. Visitation is currently not open. Check back later.";
      this.state.visitRequest.visitConfirmationMessage = get('visitConfirmationMessage') || "A confirmation email has been sent to your email. You must bring a printed hard copy of your negative test result that includes your name, date tested and negative result. Remember to arrive 15 minutes after your appointment for the screen in procedure. Please call us if you unable to make your visit."

      IO.fetchStates(this.session).then(rs => {
        this.state.dataValues.states = rs.data.result;
      });
    }

    notify = (message) => {
      this.state.notification = message;
      setTimeout(() => {
        this.state.notification = undefined;
      }, 2000);
    }

    notifyOnError = (rs, callback) => {
      if ( rs.data.error ) {
        this.notify(rs.data.error.message);
      } else {
        callback();
      }
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
      const self = this;
      Object.assign(this.state.visitRequest, vals);
      IO.updateResident(
        this.session, 
        this.state.visitRequest.visitRequestId,
        this.state.visitRequest.residentBed
      ).then(rs => {
        self.notifyOnError(rs, () => {
          this.stepForward()
        });
      }).catch(err => {
        this.notify(err);
      });
    }

    visitorFormSubmit = (vals) => {
      const self = this;
      Object.assign(this.state.visitRequest, vals);
      IO.updateVisitorScreenings(
        this.session, 
        this.state.visitRequest.visitRequestId,
        this.state.visitRequest.visitors
      ).then(rs => {
        self.notifyOnError(rs, () => {
          IO.fetchAvailabilities(
            this.session,
            this.state.visitRequest.visitRequestId
          ).then(rs => {
            self.notifyOnError(rs, () => {
              self.state.dataValues.availabilities = rs.data.result;
              this.stepForward();
            });
          }).catch(err => {
            this.notify(err);
          });
        });
      }).catch(err => {
        this.notify(err);
      });
    }

    schedulingFormSubmit = async (vals) => {
      const self = this;
      Object.assign(this.state.visitRequest, vals);
      const rs = await IO.updateRequestedAvailabilityId(
        this.session, 
        this.state.visitRequest.visitRequestId,
        this.state.visitRequest.availabilitySlot
      ).catch(err => {
        this.notify(err);
      });
      self.notifyOnError(rs, () => this.stepForward());
    }

  }

  return { VisitationApp };

});
odoo.define('visitation.visitationApp', function(require) {
  'use strict';

  const { VisitationApp } = require('visitation.visitationAppMain');

  const RPC_CONFIG = {
    host: "localhost",
    port: "8069",
    db: "visit",
    login: 'public_rpc_user',
  };

  // patch navbar to notify when entering edit mode
  const navbar = require('website.navbar');
  navbar.WebsiteNavbar.include({
    _onEditMode: function () {
      this._super.apply(this, arguments);
      const dom_edit_mode = $.Event("edit_mode");
      this.$el.trigger(dom_edit_mode);
    },
  });

  // wireup my apps
  const apps = {
    'visitationAppRoot': VisitationApp,
  };
  Object.keys(apps).forEach(anchorId => {
    const anchor = document.getElementById(anchorId);
    if ( anchor ) {
      const app = new apps[anchorId](null, {rpc_config: RPC_CONFIG});
      app.mount(anchor);

      // remove the app when you are using the website editor, else it will be copied
      $(document).on("edit_mode", () => {
        app.unmount();
      });
    }
  });
});
