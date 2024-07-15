import { updateDmxWithoutTransition, updateDmxWithTransition } from "./dmx";
import { entitiesList, getEntity } from "./entities";

export default function handleEvent( newState:HaEventNewState): void {

  if (entitiesList().includes(newState.entity_id)){
    const {attributes, entity_id, state} = newState;
    const entity = getEntity(entity_id);
    if (entity_id.startsWith("cover")) {
    }
    if (entity_id.startsWith("light")) {

      updateDmxWithTransition(entity_id, entity.DMX_address, entity.value, getValueNewValueLight(state, attributes.brightness,entity.max));
    }
    if (entity_id.startsWith("switch")) {
      updateDmxWithoutTransition(entity_id, entity.DMX_address, onOffToValue(state));
    }
  };
}

function getValueNewValueLight(state:"on"|"off", brightness:number|null, max?:number): number {
  if (state === "off")     return 0;
  if (brightness === null) brightness = 255;
  if (max)                 brightness = Math.round((max * brightness) / 255);
  return brightness;
}

function onOffToValue(state:"on"|"off"): number {
  return state === "off" ? 0 : 255;
}