const { addActionOnWebsocket, type }              = require("./ports/websocket");
const { dmxHandleResult, dmxHandleEvent }         = require("./core/dmxConversion");

// addActionOnWebsocket(type.event,  dmxHandleEvent);
// addActionOnWebsocket(type.event,  tasmotaHandleEvent);

// addActionOnWebsocket(type.result, dmxHandleResult);
// addActionOnWebsocket(type.result, tasmotaHandleResult);


const { writeToDMX }                                   = require("./ports/dmxOutput");

let toggle = false;
setInterval(() => {
  toggle = !toggle;
  writeToDMX([toggle ? 255 : 0]);
}, 2000)