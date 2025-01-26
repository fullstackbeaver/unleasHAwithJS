import { payload } from "@core/ha.constants";

/**
 * Generates an MQTT template for a cover device.
 *
 * @param {string} name - The name of the cover device.
 * @param {string} uuid - The unique identifier of the cover device.
 *
 * @return {string} The generated MQTT template.
 */
export function coverMqttTemplate( name:string, uuid:string) {
  return `
  - name: "${name}"
    unique_id: "${uuid}"
    state_topic: "homeassistant/cover/${uuid}/state"
    command_topic: "homeassistant/cover/${uuid}/command"
    position_topic: "homeassistant/cover/${uuid}"
    set_position_topic: "homeassistant/cover/${uuid}/set-position"
    payload_open: "${payload.OPEN}"
    payload_close: "${payload.CLOSE}"
    payload_stop: "${payload.STOP}"
    state_opening: "${payload.OPEN}"
    state_closing: "${payload.CLOSE}"
    state_stopped: "${payload.STOP}"
    optimistic: false
    position_template: >
      {% if not state_attr(entity_id, "current_position") %}
        {{ value }}
      {% elif state_attr(entity_id, "current_position") < (value | int) %}
        {{ (value | int + 1) }}
      {% elif state_attr(entity_id, "current_position") > (value | int) %}
        {{ (value | int - 1) }}
      {% else %}
        {{ value }}
      {% endif %}
`;
}