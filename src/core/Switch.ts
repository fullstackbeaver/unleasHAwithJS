import      { Device }          from "./Device";
import type { DeviceArguments } from "./Device";
import type { HaNewState }      from "./HaTypes";
// import      { sendUpdateMessage }                          from "@infra/websocket";
// import      { setDmx }                                     from "@infra/artnet";

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

  public update(newData: HaNewState, isEvent:boolean = false) {
    !newData && console.log("newData is null", isEvent); //TODO remove
    // this.dmxAddress && setDmx(this.dmxAddress, Math.round(this.value));
    // sendUpdateMessage({
    //   domain        : SWITCH,
    //   service       : (this.value && this.value > 0) ? "turn_on" : "turn_off",
    //   "service_data": {
    //     //TODO add rigtht value
    //     "entity_id": SWITCH + "." + this.name
    //   }
    // });
  }
}