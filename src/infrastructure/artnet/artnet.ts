const artnetClient = require("artnet")({
  host: process.env.ARTNET_HOST
});

export function setDmx(dmxChanel: number, value: number) {
  console.log("setDmx", dmxChanel, value);
  artnetClient.set(dmxChanel, value, function (err: any) {
    if (err) {
      console.error(err);
      artnetClient.close();
    }
  });
}