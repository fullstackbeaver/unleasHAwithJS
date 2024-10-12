import      { Device }               from "./Device";
import type { DeviceArguments }      from "./Device";
import type { HaNewStateFromSocket } from "./HaTypes";
import      { getService }           from "./entities";
import      { sendUpdateMessage }    from "@infra/websocket";
import      { setDmx }               from "@infra/artnet/artnet";

interface SwitchArguments extends DeviceArguments {
  dmxAddress?: number
}

export const SWITCH = "switch";

export class Switch extends Device{
  private dmxAddress: number | undefined;

  constructor({ dmxAddress, name }: SwitchArguments) {
    super({ name });
    if (dmxAddress) this.dmxAddress = dmxAddress;
  }

  public update(newData: HaNewStateFromSocket, isEvent:boolean = false) { // eslint-disable-line no-unused-vars
    const value = newData.state === "on" ? 255 : 0;
    this.dmxAddress && setDmx(this.dmxAddress, value);

    sendUpdateMessage({
      context       : newData.context,
      domain        : SWITCH,
      service       : getService(value),
      "service_data": {
        "entity_id": SWITCH + "." + this.name
      }
    });
  }
}