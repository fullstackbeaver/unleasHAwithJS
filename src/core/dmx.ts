import { DMXsteps, DMXtransitionDurationInMs } from "../../settings/settings";
import { setValue }                            from "./entities";

type Transition = {
  [entityId: string]: {
    currentValue: number
    gap         : number
    step        : number
    dmxAddress  : number
  }
}

const transition = {} as Transition;

let intervals:NodeJS.Timeout | undefined;

export function updateDmxWithTransition(entityId:string, dmxAddress: number, currentValue: number|undefined, newValue: number): void {
  currentValue = currentValue ?? 0;
  if (transition[entityId]) currentValue = Math.round( transition[entityId].currentValue );
  transition[entityId] = {
    currentValue,
    dmxAddress,
    gap : (newValue - currentValue) / (DMXsteps),
    step: DMXsteps
  }
  if (!intervals) intervals = setInterval(updateDmxTransition, DMXtransitionDurationInMs/1000);
  // updateDMX(dmxAddress, newValue);
}
export function updateDmxWithoutTransition(entityId:string, dmxAddress: number, newValue: number): void {
  setValue(entityId, newValue);
  console.log("updateDmxWithoutTransition",[dmxAddress, newValue])
  // updateDMX(dmxAddress, newValue);
}

function updateDmxTransition(){
  const dmxUpdate = [];
  for (const [key, value] of Object.entries(transition)) {
    value.currentValue += value.gap;
    setValue(key, value.currentValue);
    dmxUpdate.push([value.dmxAddress,Math.round(value.currentValue)]);
    value.step--;
    value.step === 0 && delete transition[key];
  }
  console.log("dmxUpdate:", dmxUpdate); //TODO replcae by call RS485 send
  if (Object.keys(transition).length === 0) {
    clearInterval(intervals);
    intervals = undefined;
  }
}