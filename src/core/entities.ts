import      { COVER, Cover }         from "./Cover";
import      { LIGHT, Light }         from "./Light";
import      { SWITCH, Switch }       from "./Switch";
import type { HaNewStateFromSocket } from "./HaTypes";
import      { entities }             from "@settings/entities";

const entitiesList = {
  [COVER] : {} as { [key: string]: Cover },
  [LIGHT] : {} as { [key: string]: Light },
  [SWITCH]: {} as { [key: string]: Switch }
};

const handledEntities = Object.keys(entities);

for (const [key, value] of Object.entries(entities)) {
  const { entityType, name } = extractEntity(key);
  switch (entityType) {
    case LIGHT:
      entitiesList[LIGHT][name] = new Light({ name, ...value });
      break;
    case SWITCH:
      entitiesList[SWITCH][name] = new Switch({ name, ...value });
      break;
    case COVER:
      entitiesList[COVER][name] = new Cover({ name, ...value });
      break;
    default:
      throw new Error(`Unknown entity type: ${entityType}`);
  }
}

/**
 * Extracts the entity type and name from a full entity ID.
 *
 * @param  {string} id -The full entity ID.
 *
 * @return {Object} An object with two properties: entityType and name.
 */
function extractEntity(id: string){
  const [entityType, name] = id.split(".");
  return { entityType: entityType as keyof typeof entitiesList, name };
}

/**
 * Updates an entity with new state information from a Home Assistant event.
 *
 * @param  {HaNewStateFromSocket} event -The Home Assistant event containing the new state information.
 *
 * @return {void}
 */
export function updateEntityFromEvent(event: HaNewStateFromSocket) {
  if ( !handledEntities.includes(event.entity_id) ) return;
  const { entityType, name } = extractEntity(event.entity_id);
  entitiesList[entityType][name].update(event,true);
}

/**
 * Updates all entities with new state information from a Home Assistant result.
 *
 * @param  {HaResultData[]} result -The Home Assistant result containing the new state information.
 *
 * @return {void}
 */
export function updateEntityFromResult(result: HaNewStateFromSocket[]) {
  for (const data of result) {
    if (handledEntities.includes(data.entity_id)) {
      const { entityType, name } = extractEntity(data.entity_id);
      entitiesList[entityType][name].update(data);
    };
  }
}

export function getService(value?: number) {
  return (value && value > 0)
    ? "turn_on"
    : "turn_off";
}