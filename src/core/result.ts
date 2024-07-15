import { entitiesList, setValue } from "./entities";

export default function handleResult(data:HaResultData[]): void {
  if (Array.isArray(data)) {
    for (const entity of data) {
      entitiesList().includes(entity.entity_id) && setValue(entity.entity_id, entity?.attributes?.brightness ?? 0);
    }
  }
}