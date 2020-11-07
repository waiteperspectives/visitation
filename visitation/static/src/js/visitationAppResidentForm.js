odoo.define('visitation.visitationAppResidentForm', function(require) {
  'use strict';

  const { useState } = owl;
  const { xml } = owl.tags;
  const { StepForm } = require('visitation.visitationAppBase');

  class ResidentForm extends StepForm {
    static template = xml`
      <div class="ResidentForm container mt-3">
        <div t-if="props.dataValues.beds.length" class="row justify-content-center">
          <form t-on-submit.prevent="nextStep" class="col-md-6">
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
      console.log(this.state);
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
