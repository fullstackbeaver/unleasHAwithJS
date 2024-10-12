export type HaNewStateFromSocket = HaLightFromSocket

export interface HaLightFromSocket extends CommonData {
  attributes: {
    brightness: number | null
  }
  state    : SwitchState
}

// export interface HaResultData extends CommonData {
//   attributes?: {
//     brightness?: number
//   }
//   state    ?: SwitchState
// }

export type SwitchState = "on"|"off"

type CommonData = {
  entity_id: string
  context   : object
  attributes: object
}