import type { UpdateFromSocketArgs } from "@infra/websocket/websocket.type";

export type DeviceArguments = {
  name : string
}

export abstract class Device {
  private readonly protectedName: string;
  private          protectedValue = 0;
  private          protectedContext:object | undefined;  //usefull for answer on HA's websocket

  /**
   * Construct a new Device object.
   * @param {{name: string}} args - The arguments for the new Device object.
   * @param {string} args.name - The name of the device.
   */
  constructor({ name }: DeviceArguments) {
    this.protectedName = name;
  }

  /**
   * Sets the value of the device.
   * @param {number} value - The new value of the device.
   */
  setValue(value:number) {
    this.protectedValue = value;
  }

  /**
   * Sets the context of the device.
   * This is the context that will be sent to Home Assistant when the device is updated.
   * @param {object | undefined} context - The context to set.
   */
  setContext(context:object | undefined) {
    this.protectedContext = context;
  }

  /**
   * The context of the device.
   * This is the context that was last sent to Home Assistant when the device was updated.
   *
   * @type {object | undefined}
   */
  get context() {
    return this.protectedContext;
  }

  /**
   * The name of the device.
   *
   * @type {string}
   */
  get name() {
    return this.protectedName;
  }

  /**
   * The current value of the device.
   *
   * @type {number}
   */
  get value() {
    return this.protectedValue;
  }

  /**
   * Updates the device with new data from Home Assistant.
   * This method should be overridden by sub-classes.
   *
   * @param {UpdateFromSocketArgs} newData - The new data from Home Assistant.
   *
   * @return {object} The object to send to Home Assistant as a result of this update.
   */
  updateFromSocket(newData: UpdateFromSocketArgs) { //eslint-disable-line no-unused-vars
    return {};
  }
}