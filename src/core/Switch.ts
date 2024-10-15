import      { Device }               from "./Device";
import type { DeviceArguments }      from "./Device";
import type { HaNewStateFromSocket } from "./HaTypes";
import      { getService }           from "./entities";
import      { listenWebSocket }      from "@infra/websocket";
import      { setDmx }               from "@infra/artnet/artnet";

interface SwitchArguments extends DeviceArguments {
  dmxAddress: number
}

export const SWITCH = "switch";

export class Switch extends Device{
  private readonly dmxAddress: number | undefined;

  constructor( name:string, args:object ) {
    super({ name });

    const { dmxAddress } = args as SwitchArguments;
    this.dmxAddress      = dmxAddress;
    listenWebSocket(SWITCH + "." + this.name, this.updateFromSocket.bind(this));
  }

  public updateFromSocket(newData: HaNewStateFromSocket, isEvent:boolean = false) { // eslint-disable-line no-unused-vars
    const value = newData.state === "on" ? 255 : 0;
    this.dmxAddress && setDmx(this.dmxAddress, value);

    return {
      context       : newData.context,
      domain        : SWITCH,
      service       : getService(value),
      "service_data": {
        "entity_id": SWITCH + "." + this.name
      }
    };
  }
}