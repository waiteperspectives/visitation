odoo.define('visitation.visitationAppIO', function(require) {
  'use strict';

  const rpc = require('web.rpc');

  class IO {

    // from web.ServicesMixin
    static mockFetchInitialLoad = () => {
      return new Promise(resolve => {
        const mockData = {
          visitRequest: {
            heading1: "Where dos the resident that you would like to visit currently reside?",
            heading2: "Who will be visiting?",
            heading3: "When would you like to visit?",
            beds: [
              {id: 1, unit_id: [7, "A Wing"], room_id: [77, "123"], bed_id: [99, "1"]},
              {id: 2, unit_id: [7, "A Wing"], room_id: [77, "123"], bed_id: [98, "2"]},
              {id: 3, unit_id: [7, "A Wing"], room_id: [78, "456"], bed_id: [97, "1"]},
              {id: 4, unit_id: [8, "B Wing"], room_id: [99, "456"], bed_id: [96, "1"]},
            ],
          }
        };
        resolve(mockData);
      });
    }

    static fetchStates = () => {
      return rpc.query({
        model: "res.country.state",
        method: "search_read",
        args: [[['country_id', '=', 233]], ["id", "name"]]
      });
    }

    static fetchBeds = () => {
      return rpc.query({
        model: "resident.bed",
        method: "search_read",
        args: [[], ["id", "unit_id", "room_id", "bed_position"]]
      });
    }

    static fetchContent = () => {
      return rpc.query({
        model: "visitation.content",
        method: "search_read",
        args: [[], ['key', 'value']]
      });
    }

  }


  return { IO };
});
