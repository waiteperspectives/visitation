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

