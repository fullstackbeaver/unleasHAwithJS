/* eslint-disable camelcase, no-unused-vars */
import type { UpdateFromSocketArgs, WsReceivedMsg } from "./websocket.type.d";
import      WebSocket                               from "ws";
import      { WsMessageType }                       from "./websocket.constants";
import      { forceArray }                          from "src/utils/stateAdapter";

let lastSentId = 0; //id sent by this client

const listeners       = {} as {[entity:string] : (args:UpdateFromSocketArgs) => object};
const pendingRequests = new Map<number, (data: any) => void>();
const ws              = new WebSocket("ws://" + process.env.HA_ADDRESS + "/api/websocket");

ws.on("open", function open() {
  console.log("Connected to Home Assistant WebSocket");
});

ws.on("message", function incoming(data) {
  const parsedData = JSON.parse(data.toString("utf8"));
  (parsedData.id && pendingRequests.size > 0 && pendingRequests.has(parsedData.id))
    ? pendingRequests.delete(parsedData.id)
    : handleUnsolicited(parsedData);
});

function handleUnsolicited(parsedData: WsReceivedMsg) {
  switch (parsedData.type) {
    case "auth_ok":
      sendMessageToWebSocket( {
        type: WsMessageType.GETSTATES
      });
      sendMessageToWebSocket({
        event_type: "state_changed",
        type      : WsMessageType.SUBSCRIBEEVENTS
      });
      break;
    case "auth_invalid":
      throw new Error("Authentication failed");
    case "auth_required":
      ws.send(
        JSON.stringify({
          access_token: process.env.HA_TOKEN,
          type        : WsMessageType.AUTH
        })
      );
      break;
    case WsMessageType.EVENT:{
      const { entity_id, new_state } = parsedData.event.data;
      useMessage(entity_id, new_state, true);
      break;
    }
    case WsMessageType.RESULT:
      if (parsedData.result) {
        for (const data of forceArray(parsedData.result) ){
          useMessage(data.entity_id, data, false);
        };
      }
      break;
    // Handle other cases as necessary
    default:
      console.warn("Unhandled message type:", parsedData.type);
      break;
  }
}

/**
 * Processes a message from Home Assistant by calling the appropriate listener and
 * sending the result back to Home Assistant.
 *
 * @param {string} entityId          - The id of the entity that sent the message.
 * @param {any}    messageFromSocket - The message from Home Assistant.
 */
function useMessage(entityId: string, messageFromSocket: any, isEvent: boolean): void {
  if (listeners[entityId]) {
    const result = listeners[entityId]({ isEvent, newData: messageFromSocket });
    result && sendMessageToWebSocket( result );
  }
}

export function sendMessageToWebSocket(data = {} as {[key: string]: any}): void {
  if (!data.type) data.type = WsMessageType.CALLSERVICE;
  ws.send(
    JSON.stringify({
      id: ++lastSentId,
      ...data
    })
  );
}

ws.on("error", function error(err) {
  console.error("WebSocket error:", err);
});

ws.on("close", function close() {
  console.warn("Disconnected from Home Assistant WebSocket");
});

export function listenWebSocket( entity:string, handlers: (data:any)=>object ): void {
  listeners[entity] = handlers;
}