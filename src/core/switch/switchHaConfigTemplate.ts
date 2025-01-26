import type { BaseImportedDevice } from "@core/entities";

/**
 * Generates a Home Assistant template for a switch device.
 *
 * @param {BaseImportedDevice} data          - The data of the switch device.
 * @param {string}             data.deviceId - The device ID of the switch device.
 * @param {string}             data.name     - The name of the switch device.
 * @param {string}             data.uuid     - The unique identifier of the switch device.
 *
 * @return {string} The generated Home Assistant template.
 */
export function switchWsTemplate({ deviceId, name, uuid }:BaseImportedDevice) {
  // /!\ BE AWARE of need tabulations in the template to respect yaml specifications
  return `
    ${deviceId}:
      friendly_name: "${name}"
      unique_id: "${uuid}"
      turn_on:
        action: switch.toggle
        target:
          entity_id: switch.${deviceId}
      turn_off:
        action: switch.toggle
        target:
          entity_id: switch.${deviceId}
      icon_template: >-
        {% if states('switch.${deviceId}', 'on') %}
          mdi:toggle-switch-variant
        {% else %}
          mdi:toggle-switch-variant_off
        {% endif %}
`;
}