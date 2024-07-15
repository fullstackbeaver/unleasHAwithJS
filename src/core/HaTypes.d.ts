type HaEventNewState = {
  entity_id: string
  attributes: {
    brightness: number | null
  }
  state : "on"|"off"
}

type HaResultData = {
  entity_id  : string
  attributes?: {
    brightness?: number
  }
}