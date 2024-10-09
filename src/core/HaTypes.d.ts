export type HaEventNewState = {
  entity_id: string
  attributes: {
    brightness: number | null
  }
  state : "on"|"off"
}

export type HaResultData = {
  entity_id  : string
  attributes?: {
    brightness?: number
  }
}