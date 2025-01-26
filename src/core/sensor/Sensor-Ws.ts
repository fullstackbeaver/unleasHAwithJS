import type { BaseImportedDevice }   from "@core/device/device.type";
import      { Device }               from "@core/device/Device";
import type { UpdateFromSocketArgs } from "@infra/websocket/websocket.type";
import      { haEntities }           from "@core/ha.constants";
import      { listenWebSocket }      from "@infra/websocket/websocket";

interface SensorArgs extends BaseImportedDevice {
  extractValue: Function;
}

export class SensorWs extends Device {

  #extractValue: Function;
  actions = [] as Function[];
  agents  = {} as { [ key:string ]: Function };

  constructor( args:SensorArgs) {
    super(args.deviceId);
    this.#extractValue = args.extractValue;
    listenWebSocket(haEntities.SENSOR + "." + this.deviceId, this.updateFromSocket.bind(this));
  }

  public updateFromSocket({ isEvent, newData }:UpdateFromSocketArgs) {
    const value = this.#extractValue(newData);
    this.setContext(newData.context);
    // if (isEvent) {
    //   this.updateValueWithTransition(target);
    //   return {};
    // }
    this.setValue(value);
    for (const action of this.actions) {
      action();
    }
    // return this.updateValueAndMakeMessage();
    return {};
  }

  public updateAgent(agentName:string, fn:Function){
    this.agents[agentName] = fn;
  }

  public addAction(action:Function){
    this.actions.push(action);
  }
}