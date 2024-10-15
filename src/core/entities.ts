
import { COVER, Cover }   from "./Cover";
import { LIGHT, Light }   from "./Light";
import { SWITCH, Switch } from "./Switch";;
import { entities }       from "@settings/entities";

const entitiesList = {
  [COVER] : {} as { [key: string]: Cover },
  [LIGHT] : {} as { [key: string]: Light },
  [SWITCH]: {} as { [key: string]: Switch }
};

export function importEntities() {
  for (const [key, value] of Object.entries(entities)) {
    const { entityType, name } = extractEntity(key);
    switch (entityType) {
      case LIGHT:
        entitiesList[LIGHT][name] = new Light( name, value );
        break;
      case SWITCH:
        entitiesList[SWITCH][name] = new Switch( name, value );
        break;
      case COVER:
        entitiesList[COVER][name] = new Cover(name, value);
        break;
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  }
}

/**
 * Extracts the entity type and name from a full entity ID.
 *
 * @param  {string} id -The full entity ID.
 *
 * @return {Object} An object with two properties: entityType and name.
 */
export function extractEntity(id: string){
  const [entityType, name] = id.split(".");
  return { entityType: entityType as keyof typeof entitiesList, name };
}

/**
 * Returns the appropriate service name to call on Home Assistant for the given value.
 * If the value is truthy and greater than 0, returns "turn_on", otherwise returns "turn_off".
 *
 * @param {number} [value] - The value to check.
 *
 * @return {string} The service name to call.
 */
export function getService(value?: number) { //TODO move to Device or socket
  return (value && value > 0)
    ? "turn_on"
    : "turn_off";
}