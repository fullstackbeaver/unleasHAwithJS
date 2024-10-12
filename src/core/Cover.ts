import      { Device }          from "./Device";
import type { DeviceArguments } from "./Device";
import type { HaNewState }      from "./HaTypes";
// import      { sendUpdateMessage }                          from "@infra/websocket";
// import      { setDmx }                                     from "@infra/artnet";

interface CoverArguments extends DeviceArguments {
}

export const COVER = "cover";

export class Cover extends Device{

  constructor({ name }: CoverArguments) {
    super({ name });
  }

  public update(newData: HaNewState, isEvent:boolean = false) {
    !newData && console.log("newData is null", isEvent  ); //TODO remove
    // this.dmxAddress && setDmx(this.dmxAddress, Math.round(this.value));
    // sendUpdateMessage({
    //   domain        : SWITCH,
    //   service       : (this.value && this.value > 0) ? "turn_on" : "turn_off",
    //   "service_data": {
    //     //TODO add rigtht value
    //     "entity_id": SWITCH + "." + this.name
    //   }
    // });
  }
}

// import type { Entity }    from "./entities";
// // import      { setEntity } from "./entities";

// type IntervalCover = {
//   currentPosition: number
//   interval       : NodeJS.Timeout
//   startPosition  : number
//   startTime      : number
// }

// const mmoovingCovers = {} as { [key: string]: IntervalCover };

// export function handleCoverMqtt(topic:string, message:string, { id, value }:Entity){
//   if (!id) throw new Error("Cover id not defined"); //TODO change to error manager
//   if (value === undefined) value = 0;
//   switch (message) {
//     case "close":
//       if (value === 0) return;
//       opening(id, 0);
//       break;
//     case "open":
//       if (value === 100) return;
//       closing(id, 100);
//       break;
//     case "stop":
//       mmoovingCovers[id] && stop(id);
//       break;
//     default: //number
//       const position = parseInt(message);
//       if (position === value) return;
//       value > position ? opening(id, position) : closing(id, position);
//       break;
//   }
// }

// function closing(id: string, value: number) {
//   if (mmoovingCovers[id]) stop(id);
//   console.log(value);
// }

// function opening(id: string, value: number) {
//   if (mmoovingCovers[id]) stop(id);
//   console.log(value);
// }

// function stop(id: string) {
//   console.log(id);
// }

// // function sendOverMqtt(topic: string, value: number) {
// //   console.log(topic, value);
// // }

// // function loopCover() {
// // }

// // function calculatePosition() {
// // }