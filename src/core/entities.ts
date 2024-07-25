import { entities } from "../../settings/entities";

type Entity = {
  dmxActive   ?: number
  dmxAddress  ?: number
  dmxDirection?: number
  max         ?: number
  mqttTopics  ?: string[]
  output       : string
  protocol     : string
  value       ?: number // Add the value property here
}

const workingEntities     = entities as { [key: string]: Entity };
export const wsEntityList = entitiesListByProtocol("WS");


export async function importEntities(){
  // generate entities from settings
}

export function entitiesListByProtocol(protocol: string): string[] {
  return Object
    .keys(entities)
    .filter(key => entities[key as keyof typeof entities].protocol === protocol);
}

export function getEntity(entityId: string): Entity {
  return workingEntities[entityId];
}

export function setEntity(entityId: string, entity: Partial<Entity>): void {
  workingEntities[entityId] = {
    ...workingEntities[entityId],
    ...entity
  };
}

export function setValue(entityId: string, value: number): void {
  workingEntities[entityId].value = value;
}

export function getPropertyValueOfEntities(property: keyof Entity): unknown[] {
  return Object.values(workingEntities).map(entity => entity[property]);
}