/* eslint-disable camelcase */
import      { getEntity, wsEntityList }                             from "./entities";
// import      { updateDmxWithTransition, updateDmxWithoutTransition } from "./dmx";
import type { HaEventNewState }                                     from "./HaTypes";

/**
 * This function handles events based on the provided HaEventNewState object.
 *
 * @param {HaEventNewState} attributes - The attributes of the event
 *
 * @return {void} This function does not return anything
 */
export default function handleEvent( { attributes, entity_id, state }:HaEventNewState): void {
  if (wsEntityList.includes(entity_id)){
    const entity = getEntity(entity_id);
    console.log(attributes, entity_id, state, entity);
    if (entity_id.startsWith("light")) {
      // entity.dmxAddress && updateDmxWithTransition(entity_id, entity.dmxAddress, entity.value, getValueNewValueLight(state, attributes.brightness,entity.max));
    }
    if (entity_id.startsWith("switch")) {
      // entity.dmxAddress && updateDmxWithoutTransition(entity_id, entity.dmxAddress, onOffToValue(state));
    }
  };
}

/**
 * Calculates the new value of a light based on its state and brightness.
 *
 * @param {("on"|"off")}  state      - The state of the light.
 * @param {(number|null)} brightness - The brightness of the light.
 * @param {number}        [max]      - The maximum brightness value.
 *
 * @return {number} The new value of the light.
 */
// function getValueNewValueLight(state:"on"|"off", brightness:number|null, max?:number): number {
//   if (state === "off")     return 0;
//   if (brightness === null) brightness = 255;
//   if (max)                 brightness = Math.round((max * brightness) / 255);
//   return brightness;
// }

/**
 * Converts a boolean value to a numeric representation.
 *
 * @param {("on"|"off")} state - The state to convert.
 *
 * @return {number} The numeric representation of the state.
 */
// function onOffToValue(state:"on"|"off"): number {
//   return state === "off" ? 0 : 255;
// }