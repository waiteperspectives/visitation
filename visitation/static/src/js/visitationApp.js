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
      const app = new apps[anchorId]();
      app.env.rpc_config = RPC_CONFIG;
      app.mount(anchor);

      // remove the app when you are using the website editor, else it will be copied
      $(document).on("edit_mode", () => {
        app.unmount();
      });
    }
  });
});
