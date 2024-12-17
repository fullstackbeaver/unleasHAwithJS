/**
 * Generates a template based on the provided parameters.
 *
 * @param {Object} deviceId - The device ID for the template.
 * @param {Object} id       - The ID for the template.
 * @param {Object} name     - The name for the template.
 * @param {Object} uuid     - The unique ID for the template.
 *
 * @return {string} The generated template.
 */
export function lightWsTemplate({ deviceId, id, name, uuid }:{[key:string]:string}) {
  // /!\ BE AWARE of need tabulations in the template to respect yaml specifications
  return `
    ${deviceId}:
      friendly_name: "${name}"
      unique_id: "${uuid}"
      turn_on:
        service: switch.turn_on
        data:
          entity_id: switch.${id}_switch
      turn_off:
        service: switch.turn_off
        data:
          entity_id: switch.${id}_switch
      set_level:
        service: light.turn_on
        data_template:
          entity_id: light.${id}
          brightness: "{{ brightness }}"
`;
}

export const lightTemplateBegin = `- platform: template
  lights:
`;