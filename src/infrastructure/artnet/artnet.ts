import { ArtNetHost } from "@settings/settings";
// import artnet from "artnet";

// const artnetClient = artnet({
//   host: ArtNetHost
// });

const artnetClient = require("artnet")({
  host: ArtNetHost
});

export function setDmx(dmxChanel: number, value: number) {
  artnetClient.set(dmxChanel, value, function (err: any, res: any) {
    console.log("artnet set",dmxChanel,value, err, res);
    if (err) {
      console.error(err);
      artnetClient.close();
    }
  });
}