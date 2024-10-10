// import { ArtnetDMX, SendStatus } from "artnet-dmx";
// import { ArtNetHost }            from "@settings/settings";

// const artnetDmx = new ArtnetDMX({ host: ArtNetHost, });
// const data      = new Uint8Array(512);

export function setDmx(dmxChanel:number, value:number) {
  console.log(dmxChanel, value);
  // data[dmxChanel] = value;
  // artnetDmx.send({
  //   callback: (status, message) => {
  //     console.log(status, message);
  //     if (status === SendStatus.error) {
  //       throw new Error(message);
  //     }
  //   },
  //   data
  // });
}