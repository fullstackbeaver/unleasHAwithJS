import handleResult       from "./core/result"
import handleEvent        from "./core/event"
import { initMQTT }       from "./ports/mqtt";
import { initSocket }     from "./ports/websocket"

initMQTT();
initSocket(handleResult, handleEvent);