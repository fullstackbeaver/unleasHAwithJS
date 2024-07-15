import { readJsonFile } from "../ports/files";

type Entity = {
  DMX_address: number
  max        ?: number
  value      : number
}

const entities = {} as {
  [entityId:string] : Entity
}

export async function importEntities(){
  Object.assign(entities, await readJsonFile("settings/dmx.json"));
}

export function entitiesList(): string[] {
  return Object.keys(entities);
}

export function getEntity(entityId: string): Entity {
  return entities[entityId];
}

export function setEntity(entityId: string, entity: Entity): void {
  if (!entity.value) entity.value = 0;
  entities[entityId] = entity;
}

export function setValue(entityId: string, value: number): void {
  entities[entityId].value = value;
}