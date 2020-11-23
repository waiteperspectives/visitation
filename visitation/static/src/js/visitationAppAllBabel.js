"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _templateObject8() {
  var data = _taggedTemplateLiteral([
    '\n          <div class="VisitationApp container pt-2">\n             <div t-if="state.notification" class="alert alert-danger">\n               <p t-esc="state.notification" />\n             </div>\n             <Stepper steps="state.steps" />\n             <ResidentForm init="state.visitRequest" dataValues="state.dataValues" nextStep="residentFormSubmit" t-if="getCurrentIndex() === 0" heading="state.steps[0].heading" />\n             <VisitorForm init="state.visitRequest" dataValues="state.dataValues" addVisitor="addVisitor" previousStep="stepBackward" nextStep="visitorFormSubmit" t-if="getCurrentIndex() === 1" heading="state.steps[1].heading" />\n             <SchedulingForm init="{visitRequest: state.visitRequest}" dataValues="state.dataValues" availabilities="state.dataValues.availabilities" nextStep="schedulingFormSubmit" previousStep="stepBackward" t-if="getCurrentIndex() === 2" heading="state.steps[2].heading" />\n             <ResultsForm init="{visitRequest: state.visitRequest}" dataValues="state.dataValues" availabilities="state.dataValues.availabilities" previousStep="stepBackward" t-if="getCurrentIndex() === 3" heading="state.steps[3].heading" />\n             <p class="text-muted">\n               <span>Visit Request #</span>\n               <span t-esc="state.visitRequest.visitRequestId"/>\n               <span class="pr-1" />\n               <span t-esc="state.visitRequestDate.toLocaleDateString()"/>\n             </p>\n          </div>\n      '
  ]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral([
    '\n      <div class="ResultsForm container mt-3">\n        <div class="row justify-content-center">\n          <form t-on-submit.prevent="" class="VisitationApp-form">\n            <div class="alert alert-success" role="alert">\n              <p>\n              Your visit has been scheduled for:\n              <strong><span t-esc="state.availabilitySlotLabel" /></strong>\n              </p>\n              <p>\n                <t t-esc="state.visitConfirmationMessage" />\n              </p>\n            </div>\n          </form>\n        </div>\n      </div>\n    '
  ]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral([
    '\n      <div class="SchedulingForm container mt-3">\n        <div class="row justify-content-center">\n          <form t-on-submit.prevent="nextStep" class="VisitationApp-form">\n            <h3 t-if="props.availabilities.length"><t t-esc="props.heading" /></h3>\n            <div t-if="props.availabilities.length" class="form-group">\n              <label for="availabilitySlot">\n                Time Slot\n                <span class="text-danger">*</span>\n              </label>\n              <select id="availabilitySlot" class="form-control" t-on-change="availabilitySlotChanged">\n                <option t-if="!state.availabilitySlot" value="" selected="1" disabled="1">Choose Time Slot</option>\n                <t t-foreach="props.availabilities" t-as="availability">\n                  <t t-if="availability.id == state.availabilitySlot">\n                    <option t-att-value="availability.id" selected="1">\n                      <t t-esc="availability.name" />\n                    </option>\n                  </t>\n                  <t t-else="">\n                    <option t-att-value="availability.id">\n                      <t t-esc="availability.name" />\n                    </option>\n                  </t>\n                </t>\n              </select>\n            </div>\n            <div t-if="!props.availabilities.length" class="alert alert-info" role="alert">\n              <p><t t-esc="props.dataValues.messages.noAvailability" /></p>\n            </div>\n            <div class="d-flex justify-content-between">\n              <button type="button" t-on-click="previousStep" class="btn btn-outline-secondary">\n                <i class="fa fa-arrow-left" />\n                Back\n              </button>\n              <button t-if="validForm()" type="submit" class="btn btn-primary">\n                Forward\n                <i class="fa fa-arrow-right" />\n              </button>\n            </div>\n          </form>\n        </div>\n      </div>\n    '
  ]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    '\n      <div class="VisitorForm container mt-3">\n        <div class="row justify-content-center">\n          <form t-on-submit.prevent="nextStep" class="VisitationApp-form">\n            <h3><t t-esc="props.heading" /></h3>\n            <t t-foreach="state.visitors" t-as="visitor" t-key="visitor.id">\n              <VisitorCard visitor="visitor" update="updateVisitor" states="props.dataValues.states" />\n            </t>\n            <p class="text-muted font-italic">\n            New York State permits 2 visitors for this upcoming visit. One must be 18 or older.\n            </p>\n            <div t-if="state.visitors.length &lt; 2" class="d-flex justify-content-start mb-2">\n              <button class="btn btn-link" type="button" t-on-click="addVisitor">\n                <i class="fa fa-plus" />\n                Add Visitor\n              </button>\n            </div>\n            <div t-if="state.visitors.length == 2" class="d-flex justify-content-start">\n              <button class="btn btn-link" type="button" t-on-click="removeLastVisitor">\n                <i class="fa fa-plus" />\n                Remove Visitor\n              </button>\n            </div>\n           <div class="d-flex justify-content-between">\n              <button type="button" t-on-click="previousStep" class="btn btn-outline-secondary">\n                <i class="fa fa-arrow-left" />\n                Back\n              </button>\n             <button t-if="validForm()" type="submit" class="btn btn-primary">\n               Forward\n               <i class="fa fa-arrow-right" />\n             </button>\n           </div>\n          </form>\n        </div>\n      </div>\n    '
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n      <div class="VisitorCard card mb-3">\n        <div class="card-body">\n          <div class="form-group">\n            <label for="visitorFirstName">\n              First Name\n              <span class="text-danger">*</span>\n            </label>\n            <input class="form-control" name="visitorFirstName" t-model="state.visitorFirstName" t-on-change="update" />\n          </div>\n          <div class="form-group">\n            <label for="visitorLastName">\n              Last Name\n              <span class="text-danger">*</span>\n            </label>\n            <input class="form-control" name="visitorLastName" t-model="state.visitorLastName" t-on-change="update" />\n          </div>\n          <div class="form-group">\n            <label for="visitorEmail">\n              Email\n              <span class="text-danger">*</span>\n            </label>\n            <input class="form-control" t-att-class="isValidEmail(state.visitorEmail)" name="visitorEmail" t-model="state.visitorEmail" t-on-change="update" t-on-blur="firstPassCompleteEmail" />\n          </div>\n          <div class="form-group">\n            <label for="visitorPhone">\n              Day Phone\n              <span class="text-danger">*</span>\n            </label>\n            <input type="tel" class="form-control" t-att-class="isValidPhone(state.visitorPhone)" name="visitorPhone" t-on-change="update" t-on-blur="firstPassCompletePhone" t-on-input="phoneMask" t-att-value="state.visitorPhone" />\n          </div>\n          <div class="form-group">\n            <label for="visitorPhone2">\n              Evening Phone\n              <span class="text-danger">*</span>\n            </label>\n            <input type="tel" class="form-control" t-att-class="isValidPhone2(state.visitorPhone2)" name="visitorPhone2" t-on-change="update" t-on-blur="firstPassCompletePhone2" t-on-input="phoneMask" t-att-value="state.visitorPhone2" />\n          </div>\n          <div class="form-group">\n            <label for="visitorStreet">\n              Street\n              <span class="text-danger">*</span>\n            </label>\n            <input class="form-control" name="visitorStreet" t-model="state.visitorStreet" t-on-change="update" />\n          </div>\n          <div class="form-group">\n            <label for="visitorCity">\n              City\n              <span class="text-danger">*</span>\n            </label>\n            <input class="form-control" name="visitorCity" t-model="state.visitorCity" t-on-change="update" />\n          </div>\n          <div class="form-group">\n            <label for="visitorState">\n              State\n              <span class="text-danger">*</span>\n            </label>\n            <select name="visitorState" class="form-control" t-on-change="onVisitorStateChanged">\n              <t t-foreach="props.states" t-as="stateRecord" t-key="stateRecord.id">\n                <t t-if="!state.visitorState">\n                  <option t-att-selected="stateRecord.name == \'New York\'" t-att-value="stateRecord.id"><t t-esc="stateRecord.name" /></option>\n                </t>\n                <t t-else="">\n                  <option t-att-selected="stateRecord.id == state.visitorState" t-att-value="stateRecord.id"><t t-esc="stateRecord.name" /></option>\n                </t>\n              </t>\n            </select>\n          </div>\n          <div class="form-group">\n            <label for="visitorZip">\n              Zip\n              <span class="text-danger">*</span>\n            </label>\n            <input class="form-control" name="visitorZip" t-model="state.visitorZip" t-on-change="update" />\n          </div>\n          <div class="form-group">\n            <label for="visitorTestDate">\n              What is the date you have an appointment to be tested?\n              <span class="text-danger">*</span>\n            </label>\n            <input type="date" class="form-control" name="visitorTestDate" t-model="state.visitorTestDate" t-on-change="update" t-att-value="state.visitorTestDate" placeholder="Must be MM/DD/YYYY"/>\n          </div>\n          <div class="form-group">\n            <label for="questionSuspectedPositive">\n            Have you or anyone in your household been tested positive or suspected positive in the past 14 days?. A NEGATIVE TEST RESULT IS REQUIRED.\n              <span class="text-danger">*</span>\n            </label>\n            <select name="questionSuspectedPositive" class="form-control" t-on-change="onQuestionSuspectedPositiveChanged">\n                <option value="" disabled="1" hidden="1" selected="1"/>\n                <option value="yes">Yes</option>\n                <option value="no">No</option>\n            </select>\n          </div>\n          <div class="form-group">\n            <label for="questionAnyContact">\n              Have you had any contact with anyone who is COVID positive or suspected positive in the past 14 days?\n              <span class="text-danger">*</span>\n            </label>\n            <select name="questionAnyContact" class="form-control" t-on-change="onQuestionAnyContactChanged">\n                <option value="" disabled="1" hidden="1" selected="1"/>\n                <option value="yes">Yes</option>\n                <option value="no">No</option>\n            </select>\n          </div>\n          <div class="form-group">\n            <label for="questionAnySymptoms">\n              Do you have now or have you had in the past 10 days any symptoms of COVID 19, including fever or chills, cough, shortness of breath or difficulty breathing, fatigue, muscle or body aches, headache, new loss of taste or smell, sore throat, congestion or runny nose, nausea, vomiting, diarrhea?\n              <span class="text-danger">*</span>\n            </label>\n            <select name="questionAnySymptoms" class="form-control" t-on-change="onQuestionAnySymptomsChanged">\n                <option value="" disabled="1" hidden="1" selected="1"/>\n                <option value="yes">Yes</option>\n                <option value="no">No</option>\n            </select>\n          </div>\n          <div class="form-group">\n            <label for="questionAnyTravel">\n              Have you travelled internationally or to any state identified by NYS as requiring 2 tests to get out of quarantine?\n              <span class="text-danger">*</span>\n            </label>\n            <select name="questionAnyTravel" class="form-control" t-on-change="onQuestionAnyTravelChanged">\n                <option value="" disabled="1" hidden="1" selected="1"/>\n                <option value="yes">Yes</option>\n                <option value="no">No</option>\n            </select>\n          </div>\n          <div class="form-group">\n            <label for="questionLargeGroups">\n              Have you participated in any large group gathering in the past 14 days where facemasks were NOT used by you or others?\n              <span class="text-danger">*</span>\n            </label>\n            <select name="questionLargeGroups" class="form-control" t-on-change="onQuestionLargeGroupsChanged">\n                <option value="" disabled="1" hidden="1" selected="1"/>\n                <option value="yes">Yes</option>\n                <option value="no">No</option>\n            </select>\n          </div>\n          <div class="form-group">\n            <label for="questionSocialDistancing">\n              Have you participated in any large group gathering in the past 14 days where facemasks were NOT used by you or others?\n              <span class="text-danger">*</span>\n            </label>\n            <select name="questionSocialDistancing" class="form-control" t-on-change="onQuestionSocialDistancingChanged">\n                <option value="" disabled="1" hidden="1" selected="1"/>\n                <option value="yes">Yes</option>\n                <option value="no">No</option>\n            </select>\n          </div>\n        </div>\n      </div>\n    '
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n      <div class="ResidentForm container mt-3">\n        <div t-if="props.dataValues.beds.length" class="row justify-content-center">\n          <form t-on-submit.prevent="nextStep" class="VisitationApp-form">\n            <h3><t t-esc="props.heading" /></h3>\n            <div class="form-group">\n              <label for="residentUnit">\n                Unit\n                <span class="text-danger">*</span>\n              </label>\n              <select id="residentUnit" class="form-control" t-on-change="residentUnitChanged">\n                  <option value="" selected="1" disabled="1" hidden="1">Choose Unit</option>\n                <t t-foreach="filters.units" t-as="unit" t-key="unit.id">\n                  <t t-if="unit.id == state.residentUnit">\n                    <option t-att-value="unit.id" selected="1"><t t-esc="unit.name" /></option>\n                  </t>\n                  <t t-else="">\n                    <option t-att-value="unit.id"><t t-esc="unit.name" /></option>\n                  </t>\n                </t>\n              </select>\n            </div>\n            <div class="form-group">\n              <label for="residentRoom">\n                Room\n                <span class="text-danger">*</span>\n              </label>\n              <select id="residentRoom" class="form-control" t-on-change="residentRoomChanged">\n                  <option value="" selected="1" disabled="1" hidden="1">Choose Room</option>\n                <t t-foreach="filters.rooms" t-as="room" t-key="room.id">\n                  <t t-if="room.id == state.residentRoom">\n                    <option t-att-value="room.id" selected="1"><t t-esc="room.name" /></option>\n                  </t>\n                  <t t-else="">\n                    <option t-att-value="room.id"><t t-esc="room.name" /></option>\n                  </t>\n                </t>\n              </select>\n            </div>\n            <div class="form-group">\n              <label for="residentBed">\n                Bed\n                <span class="text-danger">*</span>\n              </label>\n              <select id="residentBed" class="form-control" t-on-change="residentBedChanged">\n                  <option t-if="!state.residentBed" value="" selected="1" disabled="1" hidden="1">Choose Bed</option>\n                <t t-foreach="filters.beds" t-as="bed" t-key="bed.id">\n                  <t t-if="bed.id == state.residentBed">\n                    <option t-att-value="bed.id" selected="1"><t t-esc="bed.name" /></option>\n                  </t>\n                  <t t-else="">\n                    <option t-att-value="bed.id"><t t-esc="bed.name" /></option>\n                  </t>\n                </t>\n              </select>\n            </div>\n           <div class="d-flex justify-content-end">\n             <button t-if="validForm()" type="submit" class="btn btn-primary">\n               Forward\n               <i class="fa fa-arrow-right" />\n             </button>\n           </div>\n          </form>\n        </div>\n        <div t-if="!props.dataValues.beds.length" class="row justify-content-center">\n          <div class="row">\n            <div class="alert alert-info" role="alert">\n              <h1><t t-esc="props.dataValues.messages.visitationNotOpen" /></h1>\n            </div>\n          </div>\n        </div>\n      </div>\n    '
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError(
    "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n    <div class="Stepper">\n      <t t-foreach="props.steps" t-as="step" t-key="step.key">\n        <t t-set="statusClass" t-value="step.complete ? \'complete\' : \'incomplete\'" />\n          <t t-if="!step.first">\n            <div class="Stepper-Step-Bar" t-attf-class="{{ step.first ? \'invisible\': statusClass }}" />\n          </t>\n          <div class="Stepper-Step-Circle" t-att-class="statusClass">\n            <span class="Stepper-Step-Label"><t t-esc="step.key" /></span>\n          </div>\n      </t>\n    </div>\n    '
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <div class="container">\n        <div class="row justify-content-center">\n          <div class="col-md-6 text-center">\n            <h1>TODO</h1>\n            <button class="btn" t-on-click="previousStep">\n              <i class="fa fa-arrow-left" />\n              Back\n            </button>\n          </div>\n        </div>\n      </div>\n    '
  ]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(
    Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })
  );
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== "undefined" &&
    right[Symbol.hasInstance]
  ) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

odoo.define("visitation.visitationAppIO", function (require) {
  "use strict";

  var OdooSession = function OdooSession(host, port, db, username, password) {
    var _this = this;

    _classCallCheck(this, OdooSession);

    _defineProperty(this, "login", async function () {
      var params = {
        service: "common",
        method: "login",
        args: [_this.db, _this.username, _this.password]
      };
      var rpcArgs = {
        jsonrpc: "2.0",
        method: "call",
        params: params,
        id: Math.floor(Math.random() * 100000)
      };

      try {
        return axios.post(_this.url, rpcArgs);
      } catch (err) {
        console.error(err);
      }
    });

    _defineProperty(this, "ensure_login", async function () {
      if (!_this.uid) {
        await _this.login().then(function (rs) {
          _this.uid = rs.data.result;
        });
      }
    });

    _defineProperty(this, "search", async function (model, domain, context) {
      await _this.ensure_login();

      var _domain = domain || [[]];

      var _context = context || {};

      var params = {
        service: "object",
        method: "execute_kw",
        args: [
          _this.db,
          _this.uid,
          _this.password,
          model,
          "search",
          _domain,
          _context
        ]
      };
      var rpcArgs = {
        jsonrpc: "2.0",
        method: "call",
        params: params,
        id: Math.floor(Math.random() * 100000),
        withCredentials: true
      };
      return axios.post(_this.url, rpcArgs);
    });

    _defineProperty(this, "searchRead", async function (model, domain, fields) {
      await _this.ensure_login();
      var args = [];

      var _domain = domain || [];

      args.push(_domain);

      var _fields = fields || [];

      var kwargs = {};
      kwargs["fields"] = _fields;
      var params = {
        service: "object",
        method: "execute_kw",
        args: [
          _this.db,
          _this.uid,
          _this.password,
          model,
          "search_read",
          args,
          kwargs
        ]
      };
      var rpcArgs = {
        jsonrpc: "2.0",
        method: "call",
        params: params,
        id: Math.floor(Math.random() * 100000),
        withCredentials: true
      };
      return axios.post(_this.url, rpcArgs);
    });

    _defineProperty(this, "write", async function (model, id, vals) {
      await _this.ensure_login();
      var args = [id];

      var _vals = vals || {};

      args.push(_vals);
      var kwargs = {};
      var params = {
        service: "object",
        method: "execute_kw",
        args: [
          _this.db,
          _this.uid,
          _this.password,
          model,
          "write",
          args,
          kwargs
        ]
      };
      var rpcArgs = {
        jsonrpc: "2.0",
        method: "call",
        params: params,
        id: Math.floor(Math.random() * 100000),
        withCredentials: true
      };
      return axios.post(_this.url, rpcArgs);
    });

    _defineProperty(this, "create", async function (model, vals) {
      await _this.ensure_login();
      var args = [];

      var _vals = vals || {};

      args.push(_vals);
      var kwargs = {};
      var params = {
        service: "object",
        method: "execute_kw",
        args: [
          _this.db,
          _this.uid,
          _this.password,
          model,
          "create",
          args,
          kwargs
        ]
      };
      var rpcArgs = {
        jsonrpc: "2.0",
        method: "call",
        params: params,
        id: Math.floor(Math.random() * 100000),
        withCredentials: true
      };
      return axios.post(_this.url, rpcArgs);
    });

    this.host = host;
    this.port = port;
    this.db = db;
    this.username = username;
    this.password = password;
    this.url = "/jsonrpc";
    this.uid = false;
  };

  var IO = function IO() {
    _classCallCheck(this, IO);
  };

  _defineProperty(IO, "fetchStates", async function (session) {
    return session.searchRead(
      "res.country.state",
      [["country_id", "=", 233]],
      ["id", "name"]
    );
  });

  _defineProperty(IO, "fetchBeds", async function (session) {
    var bedResult = await session.searchRead(
      "x_resident_bed",
      [],
      ["id", "x_unit_id", "x_room_id", "x_bed_position"]
    );
    bedResult.data.result.forEach(function (bed) {
      bed.unit_id = bed.x_unit_id;
      bed.room_id = bed.x_room_id;
      bed.bed_position = bed.x_bed_position;
      bed.bed_id = [bed.id, bed.x_bed_position];
    });
    return new Promise(function (resolve) {
      return resolve(bedResult);
    });
  });

  _defineProperty(IO, "fetchContent", async function (session) {
    var contentResult = await session.searchRead(
      "x_visitation_content",
      [],
      ["x_key", "x_value"]
    );
    contentResult.data.result.forEach(function (content) {
      content.key = content.x_key;
      content.value = content.x_value;
    });
    return new Promise(function (resolve) {
      return resolve(contentResult);
    });
  });

  _defineProperty(IO, "fetchAvailabilities", async function (session, id) {
    var visitRequestRaw = await session.searchRead(
      "x_visit_request",
      [["id", "=", id]],
      ["x_availability_ids"]
    );
    var visitRequestAvailabilityIds =
      visitRequestRaw.data.result[0].x_availability_ids;
    var availabilityResult = await session.searchRead(
      "x_availability_slot",
      [["id", "in", visitRequestAvailabilityIds]],
      ["id", "x_name"]
    );
    availabilityResult.data.result.forEach(function (availability) {
      availability.name = availability.x_name;
    });
    return new Promise(function (resolve) {
      return resolve(availabilityResult);
    });
  });

  _defineProperty(IO, "createVisitRequest", async function (session) {
    return session.create("x_visit_request", {});
  });

  _defineProperty(IO, "updateVisitRequest", async function (session, id, vals) {
    return session.write("x_visit_request", id, vals);
  });

  _defineProperty(
    IO,
    "updateRequestedAvailabilityId",
    async function (session, id, availabilitySlotId) {
      return IO.updateVisitRequest(session, id, {
        x_requested_availability_id: availabilitySlotId
      });
    }
  );

  _defineProperty(
    IO,
    "updateVisitorScreenings",
    async function (session, id, visitors) {
      var newScreenings = visitors.map(function (visitor) {
        return [
          0,
          0,
          {
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
            x_question_social_distancing: visitor.questionSocialDistancing
          }
        ];
      });
      newScreenings.unshift([6, 0, []]);
      return IO.updateVisitRequest(session, id, {
        x_screening_ids: newScreenings
      });
    }
  );

  _defineProperty(
    IO,
    "updateResident",
    async function (session, id, residentBed) {
      return IO.updateVisitRequest(session, id, {
        x_resident_bed_id: residentBed
      });
    }
  );

  var _get = function _get(rs, key) {
    var found = rs.find(function (rec) {
      return rec.x_key === key;
    });

    if (found) {
      return found.x_value;
    } else {
      return undefined;
    }
  };

  return {
    IO: IO,
    OdooSession: OdooSession,
    _get: _get
  };
});
odoo.define("visitation.visitationAppBase", function () {
  "use strict";

  var _owl = owl,
    Component = _owl.Component;
  var xml = owl.tags.xml;

  var Visitor = function Visitor(kwargs) {
    var _this2 = this;

    _classCallCheck(this, Visitor);

    _defineProperty(this, "isValid", function () {
      if (!_this2.firstname) {
        return false;
      }

      if (!_this2.lastname) {
        return false;
      }

      if (!_this2.email) {
        return false;
      }

      if (!_this2.phone) {
        return false;
      }

      if (!_this2.phone2) {
        return false;
      }

      if (!_this2.street) {
        return false;
      }

      if (!_this2.city) {
        return false;
      }

      if (!_this2.stateId) {
        return false;
      }

      if (!_this2.zip) {
        return false;
      }

      if (_instanceof(!_this2.testDate, Date) || isNaN(_this2.testDate)) {
        return false;
      }

      if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          _this2.email
        )
      ) {
        return false;
      }

      if (!/^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/.test(_this2.phone)) {
        return false;
      }

      if (!/^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/.test(_this2.phone2)) {
        return false;
      } // questions

      if (_this2.questionSuspectedPositive === undefined) {
        return false;
      }

      if (_this2.questionAnyContact === undefined) {
        return false;
      }

      if (_this2.questionAnySymptoms === undefined) {
        return false;
      }

      if (_this2.questionAnyTravel === undefined) {
        return false;
      }

      if (_this2.questionLargeGroups === undefined) {
        return false;
      }

      if (_this2.questionSocialDistancing === undefined) {
        return false;
      }

      return true;
    });

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
    this.primary = kwargs.primary || false; // questions

    this.questionSuspectedPositive =
      kwargs.questionSuspectedPositive || undefined;
    this.questionAnyContact = kwargs.questionAnyContact || undefined;
    this.questionAnySymptoms = kwargs.questionAnySymptoms || undefined;
    this.questionAnyTravel = kwargs.questionAnyTravel || undefined;
    this.questionLargeGroups = kwargs.questionLargeGroups || undefined;
    this.questionSocialDistancing =
      kwargs.questionSocialDistancing || undefined;
  };

  _defineProperty(Visitor, "generatePrimaryVisitor", function () {
    var visitor = new Visitor({});
    visitor.primary = true;
    return visitor;
  });

  var StepForm = /*#__PURE__*/ (function (_Component) {
    _inherits(StepForm, _Component);

    var _super = _createSuper(StepForm);

    function StepForm() {
      var _this3;

      _classCallCheck(this, StepForm);

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      _this3 = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this3), "state", {});

      return _this3;
    }

    _createClass(StepForm, [
      {
        key: "nextStep",
        value: function nextStep() {
          this.props.nextStep(_objectSpread({}, this.state));
        }
      },
      {
        key: "previousStep",
        value: function previousStep() {
          this.props.previousStep();
        }
      }
    ]);

    return StepForm;
  })(Component);

  _defineProperty(StepForm, "template", xml(_templateObject()));

  return {
    Visitor: Visitor,
    StepForm: StepForm
  };
});
odoo.define("visitation.visitationAppStepper", function () {
  "use strict";

  var _owl2 = owl,
    Component = _owl2.Component;
  var xml = owl.tags.xml;

  var Stepper = /*#__PURE__*/ (function (_Component2) {
    _inherits(Stepper, _Component2);

    var _super2 = _createSuper(Stepper);

    function Stepper() {
      _classCallCheck(this, Stepper);

      return _super2.apply(this, arguments);
    }

    return Stepper;
  })(Component);

  _defineProperty(Stepper, "template", xml(_templateObject2()));

  return {
    Stepper: Stepper
  };
});
odoo.define("visitation.visitationAppResidentForm", function (require) {
  "use strict";

  var _owl3 = owl,
    useState = _owl3.useState;
  var xml = owl.tags.xml;

  var _require = require("visitation.visitationAppBase"),
    StepForm = _require.StepForm;

  var ResidentForm = /*#__PURE__*/ (function (_StepForm) {
    _inherits(ResidentForm, _StepForm);

    var _super3 = _createSuper(ResidentForm);

    function ResidentForm() {
      var _this4;

      _classCallCheck(this, ResidentForm);

      for (
        var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
        _key2 < _len2;
        _key2++
      ) {
        args[_key2] = arguments[_key2];
      }

      _this4 = _super3.call.apply(_super3, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this4), "getUnits", function () {
        var rs = [];
        var unit_ids = new Set(
          _this4.props.dataValues.beds.map(function (b) {
            return b.unit_id[0];
          })
        );

        _toConsumableArray(unit_ids).forEach(function (id) {
          var name = _this4.props.dataValues.beds.find(function (b) {
            return b.unit_id[0] === id;
          }).unit_id[1];

          rs.push({
            id: id,
            name: name
          });
        });

        return rs;
      });

      _defineProperty(
        _assertThisInitialized(_this4),
        "getRooms",
        function (unit) {
          var rs = [];
          var room_ids = new Set(
            _this4.props.dataValues.beds
              .filter(function (b) {
                return b.unit_id[0] === unit;
              })
              .map(function (b) {
                return b.room_id[0];
              })
          );

          _toConsumableArray(room_ids).forEach(function (id) {
            var name = _this4.props.dataValues.beds.find(function (b) {
              return b.room_id[0] === id;
            }).room_id[1];

            rs.push({
              id: id,
              name: name
            });
          });

          return rs;
        }
      );

      _defineProperty(
        _assertThisInitialized(_this4),
        "getBeds",
        function (room) {
          var rs = [];
          var bed_ids = new Set(
            _this4.props.dataValues.beds
              .filter(function (b) {
                return b.room_id[0] === room;
              })
              .map(function (b) {
                return b.bed_id[0];
              })
          );

          _toConsumableArray(bed_ids).forEach(function (id) {
            var name = _this4.props.dataValues.beds.find(function (b) {
              return b.bed_id[0] === id;
            }).bed_id[1];

            rs.push({
              id: id,
              name: name
            });
          });

          return rs;
        }
      );

      _defineProperty(
        _assertThisInitialized(_this4),
        "state",
        useState({
          residentRoom: _this4.props.init.residentRoom,
          residentUnit: _this4.props.init.residentUnit,
          residentBed: _this4.props.init.residentBed
        })
      );

      _defineProperty(
        _assertThisInitialized(_this4),
        "filters",
        useState({
          units: _this4.getUnits(),
          rooms: _this4.getRooms(_this4.state.residentUnit),
          beds: _this4.getBeds(_this4.state.residentRoom)
        })
      );

      _defineProperty(_assertThisInitialized(_this4), "validForm", function () {
        if (!_this4.state.residentUnit) {
          return false;
        }

        if (!_this4.state.residentRoom) {
          return false;
        }

        if (!_this4.state.residentBed) {
          return false;
        }

        return true;
      });

      _defineProperty(
        _assertThisInitialized(_this4),
        "residentUnitChanged",
        function (e) {
          _this4.state.residentUnit = parseInt(e.target.value);
          _this4.filters.rooms = _this4.getRooms(parseInt(e.target.value));
        }
      );

      _defineProperty(
        _assertThisInitialized(_this4),
        "residentRoomChanged",
        function (e) {
          _this4.state.residentRoom = parseInt(e.target.value);
          _this4.filters.beds = _this4.getBeds(parseInt(e.target.value));
        }
      );

      _defineProperty(
        _assertThisInitialized(_this4),
        "residentBedChanged",
        function (e) {
          _this4.state.residentBed = parseInt(e.target.value);
        }
      );

      return _this4;
    }

    return ResidentForm;
  })(StepForm);

  _defineProperty(ResidentForm, "template", xml(_templateObject3()));

  return {
    ResidentForm: ResidentForm
  };
});
odoo.define("visitation.visitationAppVisitorForm", function (require) {
  "use strict";

  var _owl4 = owl,
    Component = _owl4.Component,
    useState = _owl4.useState;
  var xml = owl.tags.xml;

  var _require2 = require("visitation.visitationAppBase"),
    StepForm = _require2.StepForm,
    Visitor = _require2.Visitor;

  var VisitorCard = /*#__PURE__*/ (function (_Component3) {
    _inherits(VisitorCard, _Component3);

    var _super4 = _createSuper(VisitorCard);

    function VisitorCard() {
      var _this5;

      _classCallCheck(this, VisitorCard);

      for (
        var _len3 = arguments.length, args = new Array(_len3), _key3 = 0;
        _key3 < _len3;
        _key3++
      ) {
        args[_key3] = arguments[_key3];
      }

      _this5 = _super4.call.apply(_super4, [this].concat(args));

      _defineProperty(
        _assertThisInitialized(_this5),
        "isValidEmail",
        function (email) {
          if (_this5.visitorEmailFirstPass.flag) {
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
        }
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "isValidPhone2",
        function (phone) {
          if (_this5.visitorPhone2FirstPass.flag) {
            return true;
          }

          if (/^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/.test(phone)) {
            return "";
          } else {
            return "is-invalid";
          }
        }
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "isValidPhone",
        function (phone) {
          if (_this5.visitorPhoneFirstPass.flag) {
            return true;
          }

          if (/^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/.test(phone)) {
            return "";
          } else {
            return "is-invalid";
          }
        }
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "visitorEmailFirstPass",
        useState({
          flag: true
        })
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "firstPassCompleteEmail",
        function () {
          _this5.visitorEmailFirstPass.flag = false;
        }
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "visitorPhoneFirstPass",
        useState({
          flag: true
        })
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "firstPassCompletePhone",
        function () {
          _this5.visitorPhoneFirstPass.flag = false;
        }
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "visitorPhone2FirstPass",
        useState({
          flag: true
        })
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "firstPassCompletePhone2",
        function () {
          _this5.visitorPhone2FirstPass.flag = false;
        }
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "state",
        useState({
          visitorFirstName: _this5.props.visitor.firstname,
          visitorLastName: _this5.props.visitor.lastname,
          visitorEmail: _this5.props.visitor.email,
          visitorPhone: _this5.props.visitor.phone,
          visitorPhone2: _this5.props.visitor.phone2,
          visitorStreet: _this5.props.visitor.street,
          visitorCity: _this5.props.visitor.city,
          visitorState:
            _this5.props.visitor.stateId ||
            _this5.props.states.find(function (x) {
              return x.name == "New York";
            }).id,
          visitorZip: _this5.props.visitor.zip,
          visitorTestDate: _this5.props.visitor.testDate,
          visitorPrimary: _this5.props.visitor.primary,
          // questions
          questionSuspectedPositive:
            _this5.props.visitor.questionSuspectedPositive,
          questionAnyContact: _this5.props.visitor.questionAnyContact,
          questionAnySymptoms: _this5.props.visitor.questionAnySymptoms,
          questionAnyTravel: _this5.props.visitor.questionAnyTravel,
          questionLargeGroups: _this5.props.visitor.questionLargeGroups,
          questionSocialDistancing:
            _this5.props.visitor.questionSocialDistancing
        })
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "phoneMask",
        function (e) {
          var x = e.target.value
            .replace(/\D/g, "")
            .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
          e.target.value = !x[2]
            ? x[1]
            : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");

          if (e.target.name === "visitorPhone") {
            _this5.state.visitorPhone = e.target.value;
          }

          if (e.target.name === "visitorPhone2") {
            _this5.state.visitorPhone2 = e.target.value;
          }
        }
      );

      _defineProperty(_assertThisInitialized(_this5), "update", function () {
        var state = _this5.props.states.find(function (s) {
          return s.id === parseInt(_this5.state.visitorState);
        });

        var stateName = state ? state.name : "";
        var visitor = new Visitor({
          firstname: _this5.state.visitorFirstName,
          lastname: _this5.state.visitorLastName,
          email: _this5.state.visitorEmail,
          phone: _this5.state.visitorPhone,
          phone2: _this5.state.visitorPhone2,
          street: _this5.state.visitorStreet,
          city: _this5.state.visitorCity,
          stateId: _this5.state.visitorState,
          stateName: stateName,
          zip: _this5.state.visitorZip,
          testDate: new Date(_this5.state.visitorTestDate),
          primary: _this5.state.visitorPrimary,
          // questions
          questionSuspectedPositive: _this5.state.questionSuspectedPositive,
          questionAnyContact: _this5.state.questionAnyContact,
          questionAnySymptoms: _this5.state.questionAnySymptoms,
          questionAnyTravel: _this5.state.questionAnyTravel,
          questionLargeGroups: _this5.state.questionLargeGroups,
          questionSocialDistancing: _this5.state.questionSocialDistancing
        });
        visitor.id = _this5.props.visitor.id;

        _this5.props.update(visitor);
      });

      _defineProperty(
        _assertThisInitialized(_this5),
        "onVisitorStateChanged",
        function (e) {
          _this5.state.visitorState = e.target.value;

          _this5.update();
        }
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "onQuestionSuspectedPositiveChanged",
        function (e) {
          _this5.state.questionSuspectedPositive = e.target.value;

          _this5.update();
        }
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "onQuestionAnyContactChanged",
        function (e) {
          _this5.state.questionAnyContact = e.target.value;

          _this5.update();
        }
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "onQuestionAnySymptomsChanged",
        function (e) {
          _this5.state.questionAnySymptoms = e.target.value;

          _this5.update();
        }
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "onQuestionAnyTravelChanged",
        function (e) {
          _this5.state.questionAnyTravel = e.target.value;

          _this5.update();
        }
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "onQuestionLargeGroupsChanged",
        function (e) {
          _this5.state.questionLargeGroups = e.target.value;

          _this5.update();
        }
      );

      _defineProperty(
        _assertThisInitialized(_this5),
        "onQuestionSocialDistancingChanged",
        function (e) {
          _this5.state.questionSocialDistancing = e.target.value;

          _this5.update();
        }
      );

      return _this5;
    } //zzz

    return VisitorCard;
  })(Component);

  _defineProperty(VisitorCard, "template", xml(_templateObject4()));

  var VisitorForm = /*#__PURE__*/ (function (_StepForm2) {
    _inherits(VisitorForm, _StepForm2);

    var _super5 = _createSuper(VisitorForm);

    function VisitorForm() {
      var _this6;

      _classCallCheck(this, VisitorForm);

      for (
        var _len4 = arguments.length, args = new Array(_len4), _key4 = 0;
        _key4 < _len4;
        _key4++
      ) {
        args[_key4] = arguments[_key4];
      }

      _this6 = _super5.call.apply(_super5, [this].concat(args));

      _defineProperty(
        _assertThisInitialized(_this6),
        "generateDefaultVisitors",
        function () {
          return [Visitor.generatePrimaryVisitor()];
        }
      );

      _defineProperty(
        _assertThisInitialized(_this6),
        "addVisitor",
        function () {
          _this6.state.visitors.push(new Visitor({}));
        }
      );

      _defineProperty(
        _assertThisInitialized(_this6),
        "updateVisitor",
        function (visitor) {
          var newVisitors = _toConsumableArray(_this6.state.visitors);

          var ndx = newVisitors.findIndex(function (v) {
            return v.id === visitor.id;
          });
          newVisitors.splice(ndx, 1, visitor);
          _this6.state.visitors = newVisitors;
        }
      );

      _defineProperty(
        _assertThisInitialized(_this6),
        "removeLastVisitor",
        function () {
          if (_this6.state.visitors.length > 0) {
            _this6.state.visitors = _this6.state.visitors.slice(
              0,
              _this6.state.visitors.length - 1
            );
          }
        }
      );

      _defineProperty(
        _assertThisInitialized(_this6),
        "state",
        useState({
          visitors: _this6.props.init.visitors.length
            ? _this6.props.init.visitors
            : _this6.generateDefaultVisitors()
        })
      );

      _defineProperty(_assertThisInitialized(_this6), "validForm", function () {
        if (
          _this6.state.visitors
            .map(function (v) {
              return v.isValid();
            })
            .includes(false)
        ) {
          return false;
        }

        return true;
      });

      return _this6;
    }

    return VisitorForm;
  })(StepForm);

  _defineProperty(VisitorForm, "template", xml(_templateObject5()));

  _defineProperty(VisitorForm, "components", {
    VisitorCard: VisitorCard
  });

  return {
    VisitorForm: VisitorForm
  };
});
odoo.define("visitation.visitationAppSchedulingForm", function (require) {
  "use strict";

  var _require3 = require("visitation.visitationAppBase"),
    StepForm = _require3.StepForm;

  var _owl5 = owl,
    useState = _owl5.useState;
  var xml = owl.tags.xml;

  var SchedulingForm = /*#__PURE__*/ (function (_StepForm3) {
    _inherits(SchedulingForm, _StepForm3);

    var _super6 = _createSuper(SchedulingForm);

    function SchedulingForm() {
      var _this7;

      _classCallCheck(this, SchedulingForm);

      for (
        var _len5 = arguments.length, args = new Array(_len5), _key5 = 0;
        _key5 < _len5;
        _key5++
      ) {
        args[_key5] = arguments[_key5];
      }

      _this7 = _super6.call.apply(_super6, [this].concat(args));

      _defineProperty(
        _assertThisInitialized(_this7),
        "state",
        useState({
          availabilitySlot: _this7.props.init.visitRequest.availabilitySlot
        })
      );

      _defineProperty(
        _assertThisInitialized(_this7),
        "availabilitySlotChanged",
        function (e) {
          _this7.state.availabilitySlot = parseInt(e.target.value);
        }
      );

      return _this7;
    }

    _createClass(SchedulingForm, [
      {
        key: "validForm",
        value: function validForm() {
          if (!this.state.availabilitySlot) {
            return false;
          }

          return true;
        }
      }
    ]);

    return SchedulingForm;
  })(StepForm);

  _defineProperty(SchedulingForm, "template", xml(_templateObject6()));

  return {
    SchedulingForm: SchedulingForm
  };
});
odoo.define("visitation.visitationAppResultsForm", function (require) {
  "use strict";

  var _require4 = require("visitation.visitationAppBase"),
    StepForm = _require4.StepForm;

  var _owl6 = owl,
    useState = _owl6.useState;
  var xml = owl.tags.xml;

  var ResultsForm = /*#__PURE__*/ (function (_StepForm4) {
    _inherits(ResultsForm, _StepForm4);

    var _super7 = _createSuper(ResultsForm);

    function ResultsForm() {
      var _this8;

      _classCallCheck(this, ResultsForm);

      for (
        var _len6 = arguments.length, args = new Array(_len6), _key6 = 0;
        _key6 < _len6;
        _key6++
      ) {
        args[_key6] = arguments[_key6];
      }

      _this8 = _super7.call.apply(_super7, [this].concat(args));

      _defineProperty(
        _assertThisInitialized(_this8),
        "_getVisitRequestSlotLabel",
        function () {
          return _this8.props.availabilities.find(function (slot) {
            return slot.id == _this8.props.init.visitRequest.availabilitySlot;
          }).name;
        }
      );

      _defineProperty(
        _assertThisInitialized(_this8),
        "state",
        useState({
          availabilitySlotLabel: _this8._getVisitRequestSlotLabel(),
          visitConfirmationMessage:
            _this8.props.init.visitRequest.visitConfirmationMessage
        })
      );

      return _this8;
    }

    return ResultsForm;
  })(StepForm);

  _defineProperty(ResultsForm, "template", xml(_templateObject7()));

  return {
    ResultsForm: ResultsForm
  };
});
odoo.define("visitation.visitationAppMain", function (require) {
  "use strict";

  var _require5 = require("visitation.visitationAppIO"),
    IO = _require5.IO,
    OdooSession = _require5.OdooSession,
    _get = _require5._get;

  var _require6 = require("visitation.visitationAppResidentForm"),
    ResidentForm = _require6.ResidentForm;

  var _require7 = require("visitation.visitationAppVisitorForm"),
    VisitorForm = _require7.VisitorForm;

  var _require8 = require("visitation.visitationAppSchedulingForm"),
    SchedulingForm = _require8.SchedulingForm;

  var _require9 = require("visitation.visitationAppResultsForm"),
    ResultsForm = _require9.ResultsForm;

  var _require10 = require("visitation.visitationAppStepper"),
    Stepper = _require10.Stepper;

  var _owl7 = owl,
    Component = _owl7.Component,
    useState = _owl7.useState;
  var xml = owl.tags.xml;

  var VisitationApp = /*#__PURE__*/ (function (_Component4) {
    _inherits(VisitationApp, _Component4);

    var _super8 = _createSuper(VisitationApp);

    function VisitationApp(parent, props) {
      var _this9;

      _classCallCheck(this, VisitationApp);

      _this9 = _super8.call(this, parent, props);

      _defineProperty(
        _assertThisInitialized(_this9),
        "state",
        useState({
          notification: undefined,
          steps: [
            {
              key: 1,
              heading: "",
              complete: true,
              last: false,
              first: true
            },
            {
              key: 2,
              heading: "",
              complete: false,
              last: false,
              first: false
            },
            {
              key: 3,
              heading: "",
              complete: false,
              last: false,
              first: false
            },
            {
              key: 4,
              heading: "",
              complete: false,
              last: true,
              first: false
            }
          ],
          dataValues: {
            beds: [],
            states: [],
            availabilities: [],
            messages: {
              visitationNotOpen: "",
              noAvailability: ""
            }
          },
          visitRequestDate: new Date(),
          visitRequest: {
            visitRequestId: undefined,
            visitConfirmationMessage: "",
            residentRoom: "",
            residentUnit: "",
            residentBed: "",
            availabilitySlot: undefined,
            visitors: []
          }
        })
      );

      _defineProperty(
        _assertThisInitialized(_this9),
        "willStart",
        async function () {
          await _this9.session.ensure_login();
          await IO.createVisitRequest(_this9.session, {}).then(function (rs) {
            _this9.state.visitRequest.visitRequestId = rs.data.result;
          }); // must wait for step 1

          var bedResult = await IO.fetchBeds(_this9.session);
          _this9.state.dataValues.beds = bedResult.data.result;
          var contentResult = await IO.fetchContent(_this9.session);
          var content = contentResult.data.result;

          var get = function get(key) {
            return _get(content, key);
          };

          _this9.state.steps[0].heading =
            get("heading1") ||
            "Where does the resident reside that you wish to visit?";
          _this9.state.steps[1].heading =
            get("heading2") || "Who will be visiting?";
          _this9.state.steps[2].heading =
            get("heading3") || "When would you like to visit?";
          _this9.state.dataValues.messages.noAvailability =
            get("noAvailability") ||
            "We're sorry, given your request, we don't have any time slots that can accomodate you.";
          _this9.state.dataValues.messages.visitationNotOpen =
            get("visitationNotOpen") ||
            "We're sorry. Visitation is currently not open. Check back later.";
          _this9.state.visitRequest.visitConfirmationMessage =
            get("visitConfirmationMessage") ||
            "A confirmation email has been sent to your email. You must bring a printed hard copy of your negative test result that includes your name, date tested and negative result. Remember to arrive 15 minutes before your appointment for the screen in procedure. Please call your resident's social worker if you unable to make your visit.";
          IO.fetchStates(_this9.session).then(function (rs) {
            _this9.state.dataValues.states = rs.data.result;
          });
        }
      );

      _defineProperty(
        _assertThisInitialized(_this9),
        "notify",
        function (message) {
          _this9.state.notification = message;
          setTimeout(function () {
            _this9.state.notification = undefined;
          }, 2000);
        }
      );

      _defineProperty(
        _assertThisInitialized(_this9),
        "notifyOnError",
        function (rs, callback) {
          if (rs.data.error) {
            _this9.notify(rs.data.error.message);
          } else {
            callback();
          }
        }
      );

      _defineProperty(
        _assertThisInitialized(_this9),
        "addVisitor",
        function (visitor) {
          _this9.state.visitRequest.visitors.push(visitor);
        }
      );

      _defineProperty(
        _assertThisInitialized(_this9),
        "getCurrentIndex",
        function () {
          var current = -1;

          for (var i = 0; i < _this9.state.steps.length; i++) {
            if (_this9.state.steps[i].complete) {
              current = i;
            } else {
              break;
            }
          }

          return current;
        }
      );

      _defineProperty(
        _assertThisInitialized(_this9),
        "updateCompletionStatus",
        function (ndx) {
          for (var i = 0; i < _this9.state.steps.length; i++) {
            if (i <= ndx) {
              _this9.state.steps[i].complete = true;
            } else {
              _this9.state.steps[i].complete = false;
            }
          }
        }
      );

      _defineProperty(
        _assertThisInitialized(_this9),
        "stepForward",
        function () {
          var current = _this9.getCurrentIndex();

          var next = _this9.state.steps.length;

          if (current >= 0 && current < _this9.state.steps.length) {
            next = current + 1;
          } else if (current === -1) {
            next = 0;
          } else {
            next = current;
          }

          _this9.updateCompletionStatus(next);
        }
      );

      _defineProperty(
        _assertThisInitialized(_this9),
        "stepBackward",
        function () {
          var current = _this9.getCurrentIndex();

          var prior = 0;

          if (current > 0) {
            prior = current - 1;
          }

          _this9.updateCompletionStatus(prior);
        }
      );

      _defineProperty(
        _assertThisInitialized(_this9),
        "residentFormSubmit",
        function (vals) {
          var self = _assertThisInitialized(_this9);

          Object.assign(_this9.state.visitRequest, vals);
          IO.updateResident(
            _this9.session,
            _this9.state.visitRequest.visitRequestId,
            _this9.state.visitRequest.residentBed
          )
            .then(function (rs) {
              console.log(rs);
              self.notifyOnError(rs, function () {
                _this9.stepForward();
              });
            })
            .catch(function (err) {
              _this9.notify(err);
            });
        }
      );

      _defineProperty(
        _assertThisInitialized(_this9),
        "visitorFormSubmit",
        function (vals) {
          var self = _assertThisInitialized(_this9);

          Object.assign(_this9.state.visitRequest, vals);
          IO.updateVisitorScreenings(
            _this9.session,
            _this9.state.visitRequest.visitRequestId,
            _this9.state.visitRequest.visitors
          )
            .then(function (rs) {
              self.notifyOnError(rs, function () {
                IO.fetchAvailabilities(
                  _this9.session,
                  _this9.state.visitRequest.visitRequestId
                )
                  .then(function (rs) {
                    self.notifyOnError(rs, function () {
                      self.state.dataValues.availabilities = rs.data.result;

                      _this9.stepForward();
                    });
                  })
                  .catch(function (err) {
                    _this9.notify(err);
                  });
              });
            })
            .catch(function (err) {
              _this9.notify(err);
            });
        }
      );

      _defineProperty(
        _assertThisInitialized(_this9),
        "schedulingFormSubmit",
        async function (vals) {
          var self = _assertThisInitialized(_this9);

          Object.assign(_this9.state.visitRequest, vals);
          var rs = await IO.updateRequestedAvailabilityId(
            _this9.session,
            _this9.state.visitRequest.visitRequestId,
            _this9.state.visitRequest.availabilitySlot
          ).catch(function (err) {
            _this9.notify(err);
          });
          self.notifyOnError(rs, function () {
            return _this9.stepForward();
          });
        }
      );

      _this9.session = new OdooSession(
        props.rpc_config.host,
        props.rpc_config.port,
        props.rpc_config.db,
        props.rpc_config.login,
        props.rpc_config.login
      );
      return _this9;
    }

    return VisitationApp;
  })(Component);

  _defineProperty(VisitationApp, "template", xml(_templateObject8()));

  _defineProperty(VisitationApp, "components", {
    Stepper: Stepper,
    ResidentForm: ResidentForm,
    VisitorForm: VisitorForm,
    SchedulingForm: SchedulingForm,
    ResultsForm: ResultsForm
  });

  return {
    VisitationApp: VisitationApp
  };
});
odoo.define("visitation.visitationApp", function (require) {
  "use strict";

  var _require11 = require("visitation.visitationAppMain"),
    VisitationApp = _require11.VisitationApp;

  var RPC_CONFIG = {
    host: "https://forthudsonconnects.odoo.com",
    port: "443",
    db: "forthudsonconnects",
    login: "rpc@example.com"
  }; // patch navbar to notify when entering edit mode

  var navbar = require("website.navbar");

  navbar.WebsiteNavbar.include({
    _onEditMode: function _onEditMode() {
      this._super.apply(this, arguments);

      var dom_edit_mode = $.Event("edit_mode");
      this.$el.trigger(dom_edit_mode);
    }
  }); // wireup my apps

  var apps = {
    visitationAppRoot: VisitationApp
  };
  Object.keys(apps).forEach(function (anchorId) {
    var anchor = document.getElementById(anchorId);

    if (anchor) {
      var app = new apps[anchorId](null, {
        rpc_config: RPC_CONFIG
      });
      app.mount(anchor); // remove the app when you are using the website editor, else it will be copied

      $(document).on("edit_mode", function () {
        app.unmount();
      });
    }
  });
});
