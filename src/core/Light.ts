import      { DMXsteps, DMXtransitionDurationInMs } from "@settings/settings";
import type { HaLight,  SwitchState }               from "./HaTypes";
import      { Device }                              from "./Device";
import type { DeviceArguments }                     from "./Device";
import      { sendUpdateMessage }                   from "@infra/websocket";
import      { setDmx }                              from "@infra/artnet";

interface LightArguments extends DeviceArguments {
  dmxAddress?: number
  max       ?: number
}

export const LIGHT = "light";

export class Light extends Device {
  private context   : object | undefined;
  private dmxAddress: number | undefined;
  private gap = 0;
  private max: number | undefined;
  private step = 0;
  private transtion: NodeJS.Timer | undefined;

  constructor({ name, max, dmxAddress }: LightArguments) {
    super({ name });
    if (max)        this.max = max;
    if (dmxAddress) this.dmxAddress = dmxAddress;
  }

  /**
   * Updates the light with new data from Home Assistant.
   * This method will call {updateValueWithTransition} with the new value.
   * @param {HaLight} newData - The new data from Home Assistant.
   *
   * @return {void}
   */
  public update(newData: HaLight, isEvent: boolean = false) {
    const brightness = this.getValueNewValue({
      brightness: newData.attributes?.brightness,
      state     : newData.state
    });
    if (isEvent){
      this.context = newData.context;
      this.updateValueWithTransition(brightness);
    }
    else {
      this.setValue(brightness);
    }
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

    if (this.step === DMXsteps) {
      this.setValue(Math.round(this.value));
      clearInterval(this.transtion);
    }

    this.dmxAddress && setDmx(this.dmxAddress, Math.round(this.value));
    sendUpdateMessage({
      context       : this.context,
      domain        : LIGHT,
      service       : (this.value && this.value > 0) ? "turn_on" : "turn_off",
      "service_data": {
        brightness : this.value,
        "entity_id": LIGHT + "." + this.name
      }
    });
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
}