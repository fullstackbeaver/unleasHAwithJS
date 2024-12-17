import      { listenWebSocket, sendMessageToWebSocket } from "@infra/websocket/websocket";
import      { Device }                                  from "../Device";
import type { DeviceArguments }                         from "../Device";
import      { HaEntities }                              from "../entities";
import type { SwitchState }                             from "../HaTypes";
import type { UpdateFromSocketArgs }                    from "@infra/websocket/websocket.type";
import      { setDmx }                                  from "@infra/artnet/artnet";

interface LightArguments extends DeviceArguments {
  dmx ?: string
  max ?: string
}

if (!process.env.DMX_STEPS)                     throw new Error("DMX_STEPS is not defined");
if (!process.env.DMX_TRANSITION_DURATION_IN_MS) throw new Error("DMX_TRANSITION_DURATION_IN_MS is not defined");

const DMXsteps                  = parseInt(process.env.DMX_STEPS);
const DMXtransitionDurationInMs = parseInt(process.env.DMX_TRANSITION_DURATION_IN_MS);

export class LightWsArtNet extends Device {
  private readonly dmxAddress: number | undefined;
  private readonly max: number | undefined;
  private          transtion: NodeJS.Timer | undefined;
  private          transitionSteps = [] as number[];

  constructor( name:string, args:object) {
    super({ name });

    const { dmx, max }       = args as LightArguments;
    if (max) this.max        = parseInt(max);
    if (dmx) this.dmxAddress = parseInt(dmx);

    listenWebSocket(HaEntities.LIGHT + "." + this.name, this.updateFromSocket.bind(this));
  }

  /**
   * Updates the light with new data from Home Assistant.
   * This method will call {updateValueWithTransition} with the new value.
   * @param {HaLightFromSocket} newData - The new data from Home Assistant.
   * @param {boolean}           isEvent - Whether the update is an event from Home Assistant or not.
   *
   * @return {void}
   */
  public updateFromSocket({ isEvent, newData }:UpdateFromSocketArgs) {
    const target = this.getValueNewValue({
      brightness: newData.attributes.brightness,
      state     : newData.state
    });
    this.setContext(newData.context);
    if (isEvent) {
      this.updateValueWithTransition(target);
      return {};
    }
    this.setValue(target);
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
      const gap            = (newValue - this.value) / DMXsteps;
      this.transitionSteps = [];
      for (let i = 1; i <= DMXsteps; i++) { this.transitionSteps.push(this.value + (i * gap)); }
      this.transtion = setInterval(this.useTransition.bind(this), DMXtransitionDurationInMs/DMXsteps);
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
    if (this.transitionSteps.length === 0) {
      clearInterval(this.transtion);
      return;
    }
    const value = this.transitionSteps.shift();
    this.setValue(Math.round(value as number));
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
    if (brightness === null) brightness = 255;
    if (!brightness)         brightness = 0;
    if (this.max)            brightness = Math.round((this.max * brightness) / 255);
    return brightness;
  }

  private updateValueAndMakeMessage() {
    this.dmxAddress && setDmx(this.dmxAddress, Math.round(this.value));
    return {
      context       : this.context,
      domain        : HaEntities.LIGHT,
      service       : "update_entity",
      "service_data": {
        brightness : this.value,
        "entity_id": HaEntities.LIGHT + "." + this.name
      }
    };
  }
}