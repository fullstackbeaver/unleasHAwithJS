import type { BaseImportedDevice } from "@core/entities";

/**
 * Generates a Home Assistant template for a light device.
 *
 * @param {BaseImportedDevice} data          - The data of the light device.
 * @param {string}             data.deviceId - The device ID of the light device.
 * @param {string}             data.name     - The name of the light device.
 * @param {string}             data.uuid     - The unique identifier of the light device.
 *
 * @return {string} The generated Home Assistant template.
 */
export function lightWsTemplate({ deviceId, name, uuid }:BaseImportedDevice) {
  // /!\ BE AWARE of need tabulations in the template to respect yaml specifications
  return `
    ${deviceId}:
      friendly_name: "${name}"
      unique_id: "${uuid}"
      turn_on:
        action: switch.turn_on
        data:
          entity_id: switch.${uuid}_switch
      turn_off:
        action: switch.turn_off
        data:
          entity_id: switch.${uuid}_switch
      set_level:
        action: light.turn_on
        data_template:
          entity_id: light.${uuid}
          brightness: "{{ brightness }}"
`;
}

export const lightTemplateBegin = `- platform: template
  lights:
`;