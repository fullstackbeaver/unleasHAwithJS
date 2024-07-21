import { importEntities } from "./core/entities"
import handleResult       from "./core/result"
import handleEvent        from "./core/event"
import { initMQTT }       from "./ports/mqtt";
import { initSocket }     from "./ports/websocket"

// import { writeToDMX }                      from "./ports/dmxOutput"

// addActionOnWebsocket(type.event,  dmxHandleEvent);
// addActionOnWebsocket(type.event,  tasmotaHandleEvent);

// addActionOnWebsocket(type.result, dmxHandleResult);
// addActionOnWebsocket(type.result, tasmotaHandleResult);

// let toggle = false;
// setInterval(() => {
//   toggle = !toggle;
//   writeToDMX(`1c${toggle ? 255 : 0}w`);
// }, 2000)


(async () => {
  await importEntities(); //TODO rewrite this function by removing await and import js file directly
  initMQTT();
  initSocket(handleResult, handleEvent);
})();
