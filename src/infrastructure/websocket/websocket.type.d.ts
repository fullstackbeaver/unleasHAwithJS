import type { HaNewStateFromSocket } from "./HaTypes";
import type { WsMessageType }        from "./websocket.constants";

export type WsReceivedMsg = {
  type : "auth_ok" | "auth_invalid" | "auth_required" | WsMessageType.EVENT | WsMessageType.RESULT
  event : {
    data : {
      entity_id : string
      new_state: any
      [key: string]: any
    }
  }
  result: {
    entity_id : string
    [key: string]: any
  }
}

export type UpdateFromSocketArgs = {
  isEvent?: boolean
  newData : HaNewStateFromSocket
}