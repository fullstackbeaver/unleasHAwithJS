// import { DMXsteps, DMXtransitionDurationInMs } from "../../settings/settings";
// import { getAllEntities, setValue }            from "./entities";
// import { openDMXconnection, writeToDMX }       from "../ports/dmxRs485Output";
// import { DMXrs485 }                            from "../../settings/settings";

// type Transition = {
//   [entityId: string]: {
//     currentValue: number
//     gap         : number
//     step        : number
//     dmxAddress  : number
//   }
// }

// const dmxData    = new Array(defineMaxChannels()).fill(0);
// const transition = {} as Transition;

// let intervals:NodeJS.Timeout | undefined;

// /**
//  * Updates the DMX value with a transition.
//  *
//  * @param  {number|undefined} currentValue - The current DMX value, or undefined if not known.
//  * @param  {number}           dmxAddress   - The DMX address to update.
//  * @param  {string}           entityId     - The ID of the entity to update.
//  * @param  {number}           newValue     - The new DMX value.
//  * @return {void}
//  */
// export function updateDmxWithTransition(entityId:string, dmxAddress: number, currentValue: number|undefined, newValue: number): void {
//   currentValue = currentValue ?? 0;
//   if (transition[entityId]) currentValue = Math.round( transition[entityId].currentValue );
//   transition[entityId] = {
//     currentValue,
//     dmxAddress,
//     gap : (newValue - currentValue) / (DMXsteps),
//     step: DMXsteps
//   };
//   if (!intervals) intervals = setInterval(updateDmxTransition, DMXtransitionDurationInMs/1000);
// }

// /**
//  * Updates the DMX value without a transition.
//  *
//  * @param  {string} entityId   - The ID of the entity to update.
//  * @param  {number} dmxAddress - The DMX address to update.
//  * @param  {number} newValue   - The new DMX value.
//  * @return {void}
//  */
// export function updateDmxWithoutTransition(entityId:string, dmxAddress: number, newValue: number): void {
//   setChannel(entityId, dmxAddress, newValue);
//   writeToDMX(dmxData);
// }

// /**
//  * Updates the DMX output if there is a least one active transition by iterating over the transition object,
//  * updating the current value of each entry, and removing entries when their step reaches 0.
//  * It also writes the updated DMX data and clears the interval when the transition is complete.
//  *
//  * @return {void}
//  */
// function updateDmxTransition(){
//   for (const [key, value] of Object.entries(transition)) {
//     value.currentValue += value.gap;
//     setChannel(key, value.dmxAddress, value.currentValue);
//     value.step--;
//     value.step === 0 && delete transition[key];
//   }
//   writeToDMX(dmxData);
//   if (Object.keys(transition).length === 0) {
//     clearInterval(intervals);
//     intervals = undefined;
//   }
// }

// /**
//  * Returns the maximum channel number used by any entity
//  *
//  * @return {number} The maximum channel number used by any entity.
//  */
// function defineMaxChannels() {
//   const channels = [0]; // 0 avoid error for max calculation
//   for (const entity of Object.values(getAllEntities())) {
//     entity.dmxActive    && channels.push(entity.dmxActive);
//     entity.dmxAddress   && channels.push(entity.dmxAddress);
//     entity.dmxDirection && channels.push(entity.dmxDirection);
//   }
//   return Math.max(...channels) + 1;
// }

// /**
//  * Sets the value of a specific DMX channel and updates the entity.
//  *
//  * @param  {number} channel  - The DMX channel to update.
//  * @param  {string} entityId - The ID of the entity to update.
//  * @param  {number} value    - The new value of the DMX channel.
//  * @return {void}
//  */
// function setChannel(entityId: string, channel: number, value: number) {
//   setValue(entityId, value);
//   dmxData[channel] = Math.round(value);
// }

// openDMXconnection(DMXrs485);