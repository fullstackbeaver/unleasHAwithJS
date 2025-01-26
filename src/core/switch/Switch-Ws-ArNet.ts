import      { haEntities, haServices, payload } from "../ha.constants";
import type { SwitchArguments }                 from "./switch.type";
import type { UpdateFromSocketArgs }            from "@infra/websocket/websocket.type";
import      { listenWebSocket }                 from "@infra/websocket/websocket";
import      { setDmx }                          from "@infra/artnet/artnet";

export function switchWsArtNet(args:SwitchArguments) {
  const { deviceId, dmx } = args;
  let state : boolean;

  listenWebSocket(haEntities.LIGHT + "." + deviceId, updateFromSocket); //remettre bind(this) ?

  function updateFromSocket({ newData }: UpdateFromSocketArgs) {
    return {
      ...update(newData.state === payload.ON),
      context: newData.context
    };
  }

  function update(newValue: boolean) {
    dmx && setDmx(dmx, newValue ? 255 : 0);
    state = newValue;
    return {
      domain        : haEntities.SWITCH,
      service       : newValue ? haServices.TURN_ON : haServices.TURN_OFF,
      "service_data": {
        "entity_id": haEntities.SWITCH + "." + deviceId
      }
    };
  }

  return {
    get isOn() { return state; },
    update,
  };
}