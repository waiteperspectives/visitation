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
  }

  class IO {

    static fetchStates = (session) => {
      return session.searchRead('res.country.state', [['country_id', '=', 233]], ["id", "name"]);
    }

    static fetchBeds = (session) => {
      return session.searchRead('resident.bed', [], ["id", "unit_id", "room_id", "bed_position"]);
    }

    static fetchContent = (session) => {
      return session.searchRead('visitation.content', [], ["key", "value"]);
    }

  }

  return { IO, OdooSession };
});
