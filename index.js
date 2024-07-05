const { addActionOnWebsocket, type }              = require("./ports/websocket");
const { dmxHandleResult, dmxHandleEvent }         = require("./core/dmxConversion");
const { tasmotaHandleEvent, tasmotaHandleResult } = require("./core/tasmotaConversion");

// addActionOnWebsocket(type.event,  dmxHandleEvent);
addActionOnWebsocket(type.event,  tasmotaHandleEvent);

// addActionOnWebsocket(type.result, dmxHandleResult);
addActionOnWebsocket(type.result, tasmotaHandleResult);