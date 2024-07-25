import { importEntities } from "./core/entities"
import handleResult       from "./core/result"
import handleEvent        from "./core/event"
import { initMQTT }       from "./ports/mqtt";
import { initSocket }     from "./ports/websocket"

importEntities();
initMQTT();
initSocket(handleResult, handleEvent);