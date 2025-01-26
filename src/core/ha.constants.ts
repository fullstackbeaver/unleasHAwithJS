/* eslint-disable no-unused-vars */
export enum payload {
  CLOSE   = "close",
  CLOSED  = "closed",
  CLOSING = "closing",
  OFF     = "off",
  ON      = "on",
  OPEN    = "open",
  OPENING = "opening",
  STOP    = "stop",
  STOPPED = "stopped"
}

export enum haEntities {
  COVER        = "cover",
  INPUT_SELECT = "input_select",
  LIGHT        = "light",
  SENSOR       = "sensor",
  SWITCH       = "switch"
}

export enum haServices {
  TURN_OFF      = "turn_off",
  TURN_ON       = "turn_on",
  UPDATE_ENTITY = "update_entity"
}