/**
 * Generates a template based on the provided parameters.
 *
 * @param {object} args          - The parameters for generating the switch template.
 * @param {string} args.deviceId - The device ID for the template.
 * @param {string} args.iconOFF  - The icon to display when the switch is off.
 * @param {string} args.iconON   - The icon to display when the switch is on.
 * @param {string} args.id       - The ID for the switch template.
 * @param {string} args.name     - The name for the switch template.
 * @param {string} args.uuid     - The unique ID for the switch template.
 *
 * @return {string} The generated template.
 */
export function switchWsTemplate({ deviceId, iconOFF, iconON, id, name, uuid }:{[key:string]:string}) {
  // /!\ BE AWARE of need tabulations in the template to respect yaml specifications
  return `
    ${deviceId}:
      friendly_name: "${name}"
      unique_id: "${uuid}"
      turn_on:
        service: switch.toggle
        target:
          entity_id: ${id}
      turn_off:
        service: switch.toggle
        target:
          entity_id: ${id}
      icon_template: >-
        {% if states('${id}', 'on') %}
          mdi:${iconON}
        {% else %}
          mdi:${iconOFF}
        {% endif %}
`;
}