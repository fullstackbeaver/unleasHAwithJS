import      { DMXsteps, DMXtransitionDurationInMs }     from "@settings/settings";
import type { HaLightFromSocket,  SwitchState }         from "./HaTypes";
import      { listenWebSocket, sendMessageToWebSocket } from "@infra/websocket";
import      { Device }                                  from "./Device";
import type { DeviceArguments }                         from "./Device";
import      { setDmx }                                  from "@infra/artnet/artnet";

interface LightArguments extends DeviceArguments {
  dmxAddress?: number
  max       ?: number
}

export const LIGHT = "light";

export class Light extends Device {
  private dmxAddress: number | undefined;
  private gap = 0;
  private max: number | undefined;
  private step = 0;
  private transtion: NodeJS.Timer | undefined;

  constructor( name:string, args:object) {
    super({ name });

    const { dmxAddress, max }       = args as LightArguments;
    if (max)        this.max        = max;
    if (dmxAddress) this.dmxAddress = dmxAddress;
    listenWebSocket(LIGHT + "." + this.name, this.updateFromSocket.bind(this));
  }

  /**
   * Updates the light with new data from Home Assistant.
   * This method will call {updateValueWithTransition} with the new value.
   * @param {HaLightFromSocket} newData - The new data from Home Assistant.
   *
   * @return {void}
   */
  public updateFromSocket(newData: HaLightFromSocket, isEvent: boolean = false) {
    this.setValue(this.getValueNewValue({
      brightness: newData.attributes.brightness,
      state     : newData.state
    }));
    this.setContext(newData.context);
    if (isEvent) {
      this.updateValueWithTransition(this.value);
      return {};
    }
    return this.updateValueAndMakeMessage();
  }

  /**
   * Updates the light with a new value with a DMX transition.
   * This method will clear any currently running transition and start a new one.
   * If the new value is the same as the current value, the timer will be cleared.
   * @param {number} newValue - The new value for the light.
   *
   * @return {void}
   */
  private updateValueWithTransition(newValue: number) {
    if (newValue !== this.value) {
      clearInterval(this.transtion);
      this.gap       = (newValue - this.value) / DMXsteps;
      this.step      = 0;
      this.transtion = setInterval(this.useTransition.bind(this), DMXtransitionDurationInMs);
    }
  }

  /**
   * Updates the DMX value with a transition.
   * This method will be called every {DMXtransitionDurationInMs} ms until the transition is complete.
   * It will update the DMX value and send a Home Assistant update message with the new state.
   *
   * @return {void}
   */
  private useTransition() {
    this.step++;
    this.incrementValue(this.gap);
    this.setValue(Math.round(this.value));
    this.step === DMXsteps && clearInterval(this.transtion);
    sendMessageToWebSocket(this.updateValueAndMakeMessage());
  };

  /**
   * Calculates the new value of a light based on its state and brightness
   *
   * @param {object}        args              - The function arguments.
   * @param {SwitchState}   [args.state]      - The state of the light.
   * @param {(number|null)} [args.brightness] - The brightness of the light.
   *
   * @return {number} The new value of the light.
   */
  private getValueNewValue({ state, brightness }: { state?: SwitchState, brightness?: number | null }): number {
    if (state === "off")     return 0;
    if (!brightness)         brightness = 0;
    if (brightness === null) brightness = 255;
    if (this.max)            brightness = Math.round((this.max * brightness) / 255);
    return brightness;
  }

  private updateValueAndMakeMessage() {
    this.dmxAddress && setDmx(this.dmxAddress, Math.round(this.value));
    return {
      context       : this.context,
      domain        : LIGHT,
      service       : "update_entity", // getService(this.value),
      "service_data": {
        brightness : this.value,
        "entity_id": LIGHT + "." + this.name
      }
    };
  }
}