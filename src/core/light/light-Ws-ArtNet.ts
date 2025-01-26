import      { dmxTransitionInterval, getSteps }         from "@utils/transitions";
import      { haEntities, haServices }                  from "../ha.constants";
import      { listenWebSocket, sendMessageToWebSocket } from "@infra/websocket/websocket";
import type { LightArguments }                          from "./light.types";
import type { SwitchState }                             from "../ha.types";
import type { UpdateFromSocketArgs }                    from "@infra/websocket/websocket.type";
import      { payload }                                 from "@core/ha.constants";
import      { setDmx }                                  from "@infra/artnet/artnet";

export function lightWsArtNet(args: LightArguments) {
  let context:any; //TODO change type
  const deviceId        = args.deviceId;
  const dmxAddress      = args.dmx;
  const max             = args.max ? Math.round((255 * args.max) / 100) : undefined;
  let   transitionSteps = [] as number[];
  let   transtion: NodeJS.Timer | undefined;
  let   value:number;

  listenWebSocket(haEntities.LIGHT + "." + deviceId, updateFromSocket); //remettre bind(this) ?

  function updateFromSocket({ newData, isEvent }: UpdateFromSocketArgs) {
    const target = getValueNewValue({
      brightness: newData.attributes.brightness,
      state     : newData.state
    });
    context = newData.context;
    if (isEvent) {
      updateValueWithTransition(target);
      return {};
    }
    value = target;
    return updateValueAndMakeMessage();
  }

  function updateValueWithTransition(newValue: number) {
    if (newValue !== value) {
      clearInterval(transtion);
      transitionSteps = getSteps(value, newValue);
      transtion       = setInterval(useTransition, dmxTransitionInterval); //remettre .bind(this)
    }
  }

  function useTransition() {
    if (transitionSteps.length === 0) {
      clearInterval(transtion);
      return;
    }
    value = Math.round( transitionSteps.shift()  as number);
    sendMessageToWebSocket(updateValueAndMakeMessage());
  };

  function getValueNewValue({ state, brightness }: { state?: SwitchState, brightness?: number | null }): number {
    if (state === payload.OFF) return 0;
    if (brightness === null)   brightness = 255;
    if (!brightness)           brightness = 0;
    if (max)                   brightness = Math.round((max * brightness) / 255);
    return brightness;
  }

  function updateValueAndMakeMessage() {
    dmxAddress && setDmx(dmxAddress, Math.round(value));
    return {
      context,
      domain        : haEntities.LIGHT,
      service       : haServices.UPDATE_ENTITY,
      "service_data": {
        brightness : value,
        "entity_id": haEntities.LIGHT + "." + deviceId
      }
    };
  }

  return {
    get currentValue(){ return value; },
    updateFromAgent: (newValue: number) => { updateValueWithTransition(newValue); }
  };
}