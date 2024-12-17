import      { Device }               from "../Device";
import type { DeviceArguments }      from "../Device";
import      { HaEntities }           from "../entities";
import type { UpdateFromSocketArgs } from "@infra/websocket/websocket.type";
import      { listenWebSocket }      from "@infra/websocket/websocket";
import      { setDmx }               from "@infra/artnet/artnet";

interface SwitchArguments extends DeviceArguments {
  dmx: string
}

export class SwitchWsArtNet extends Device{
  private readonly dmx: number | undefined;

  constructor( name:string, args:SwitchArguments ) {
    super({ name });
    this.dmx = parseInt(args.dmx);
    listenWebSocket(HaEntities.SWITCH + "." + this.name, this.updateFromSocket.bind(this));
  }

  public updateFromSocket({ newData }: UpdateFromSocketArgs) {
    const value = newData.state === "on" ? 255 : 0;
    this.dmx && setDmx(this.dmx, value);

    return {
      context       : newData.context,
      domain        : HaEntities.SWITCH,
      service       : getService(value),
      "service_data": {
        "entity_id": HaEntities.SWITCH + "." + this.name
      }
    };
  }
}

/**
 * Returns the appropriate service name to call on Home Assistant for the given value.
 * If the value is truthy and greater than 0, returns "turn_on", otherwise returns "turn_off".
 *
 * @param {number} [value] - The value to check.
 *
 * @return {string} The service name to call.
 */
function getService(value?: number) {
  return (value && value > 0)
    ? "turn_on"
    : "turn_off";
}