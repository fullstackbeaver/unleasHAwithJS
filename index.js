const { addActionOnWebsocket, type }      = require("./src/ports/websocket");
const { dmxHandleResult, dmxHandleEvent } = require("./src/core/dmxConversion");
const { writeToDMX }                      = require("./src/ports/dmxOutput");

// addActionOnWebsocket(type.event,  dmxHandleEvent);
// addActionOnWebsocket(type.event,  tasmotaHandleEvent);

// addActionOnWebsocket(type.result, dmxHandleResult);
// addActionOnWebsocket(type.result, tasmotaHandleResult);



let toggle = false;
setInterval(() => {
  toggle = !toggle;
  writeToDMX(`1c${toggle ? 255 : 0}w`);
}, 2000)