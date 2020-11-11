odoo.define('visitation.visitationAppIO', function(require) {
  'use strict';

  class OdooSession {
    constructor(host, port, db, username, password) {
      this.host = host;
      this.port = port;
      this.db = db;
      this.username = username;
      this.password = password;
      this.url = '/jsonrpc';
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
      kwargs['fields'] = _fields;
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
      return session.searchRead('res.country.state', [['country_id', '=', 233]], ["id", "name"]);
    }

    static fetchBeds = async (session) => {
      const bedResult = await session.searchRead('resident.bed', [], ["id", "unit_id", "room_id", "bed_position"])
      bedResult.data.result.forEach(bed => {
        bed.bed_id = [bed.id, bed.bed_position];
      });
      return new Promise(resolve => resolve(bedResult));
    }

    static fetchContent = async (session) => {
      return session.searchRead('visitation.content', [], ["key", "value"]);
    }

    static fetchAvailabilities = async (session, id) => {
      const visitRequestRaw = await session.searchRead('visit.request', [['id', '=', id]], ['availability_ids']);
      const visitRequestAvailabilityIds = visitRequestRaw.data.result[0].availability_ids;
      return session.searchRead('availability.slot', [['id', 'in', visitRequestAvailabilityIds]], ['id', 'name']);
    }

    static createVisitRequest = async (session) => {
      return session.create('visit.request', {});
    }

    static updateVisitRequest = async (session, id, vals) => {
      return session.write('visit.request', id, vals);
    };

    static updateRequestedAvailabilityId = async (session, id, availabilitySlotId) => {
      return this.updateVisitRequest(session, id, {'requested_availability_id': availabilitySlotId});
    }

    static updateVisitorScreenings = async (session, id, visitors) => {
      const newScreenings = visitors.map(visitor => {
            return [0, 0, {
              name: visitor.name,
              email: visitor.email,
              street: visitor.street,
              city: visitor.city,
              state_id: visitor.stateId,
              test_date: visitor.testDate,
            }]
          })
      newScreenings.unshift([6, 0, []]);
      return this.updateVisitRequest(session, id, {'screening_ids': newScreenings});
    }

    static updateResident = async (session, id, residentBed) => {
      return this.updateVisitRequest(session, id, {'resident_bed_id': residentBed});
    }

  }

  const _get = (rs, key) => {
    const found = rs.find(rec => rec.key === key);
    if ( found ) {
      return found.value
    } else {
      return undefined;
    }
  };

  return { IO, OdooSession, _get };
});

