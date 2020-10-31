odoo.define('visitation.visitationApp', function(require) {
  'use strict';

  const { VisitationApp } = require('visitation.visitationAppComponents');

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
      app.mount(anchor);

      // remove the app when you are using the website editor, else it will be copied
      $(document).on("edit_mode", () => {
        app.unmount();
      });
    }
  });
});
