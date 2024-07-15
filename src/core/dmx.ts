import { setValue } from "./entities";
import { settings } from "./settings";

type Transition = {
  [entityId: string]: {
    currentValue: number
    gap         : number
    step        : number
    dmxAddress  : number
  }
}

const transition: Transition = {};
let intervals:NodeJS.Timeout | undefined;


export function updateDmxWithTransition(entityId:string, dmxAddress: number, currentValue: number, newValue: number): void {
  if (transition[entityId]) currentValue = Math.round( transition[entityId].currentValue );
  transition[entityId] = {
    currentValue: currentValue,
    dmxAddress  : dmxAddress,
    gap         : (newValue - currentValue) / (settings.DMXsteps),
    step        : settings.DMXsteps
  }
  if (!intervals) intervals = setInterval(updateDmxTransition, settings.DMXtransitionDurationInMs/1000);
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