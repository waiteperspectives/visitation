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
