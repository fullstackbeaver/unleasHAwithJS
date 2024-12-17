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
    payload_open: "open"
    payload_close: "close"
    payload_stop: "stop"
    state_opening: "open"
    state_closing: "close"
    state_stopped: "stop"
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