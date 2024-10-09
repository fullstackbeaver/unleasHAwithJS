import      handleEvent         from "@core/event";
import      handleResult        from "@core/result";
// import      { initMQTT }        from "@infra/mqtt";
import      { initSocket }      from "@infra/websocket";
// import type { Entity }          from "@core/entities";
// import      { handleCoverMqtt } from "@core/cover";

// function useMqtt(topic:string, message:string, entity:Entity) {
//   const type = topic.split("/")[1];
//   if (type === "cover") handleCoverMqtt(topic, message, entity);
// }
// initMQTT(useMqtt);
initSocket(handleResult, handleEvent);
