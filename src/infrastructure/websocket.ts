/* eslint-disable camelcase, no-unused-vars */
import      { haToken, homeAssistantAddress } from "@settings/settings";
// import type { HaNewStateFromSocket }          from "@core/HaTypes";
import      WebSocket                         from "ws";
import      { forceArray }                    from "src/utils/stateAdapter";

type Listener = {
  event:  (data: any) => void
  result: (data: any) => void
}

export enum WSMessageType {
  AUTH            = "auth",
  CALLSERVICE     = "call_service",
  GETSTATES       = "get_states",
  SUBSCRIBEEVENTS = "subscribe_events",
  EVENT           = "event",
  RESULT          = "result"
}

let lastSentId = 0; //id sent by this client

const listeners       = {} as {[entity:string] : (data: any) => object};
const pendingRequests = new Map<number, (data: any) => void>();
const ws              = new WebSocket("ws://" + homeAssistantAddress + "/api/websocket");

ws.on("open", function open() {
  console.log("Connected to Home Assistant WebSocket");
});

ws.on("message", function incoming(data) {
  const parsedData = JSON.parse(data.toString("utf8"));
  (parsedData.id && pendingRequests.size > 0 && pendingRequests.has(parsedData.id))
    ? pendingRequests.delete(parsedData.id)
    : handleUnsolicited(parsedData);
});

function handleUnsolicited(parsedData: any) { //TODO change any
  switch (parsedData.type) {
    case "auth_ok":
      sendMessageToWebSocket( {
        type: WSMessageType.GETSTATES
      });
      sendMessageToWebSocket({
        event_type: "state_changed",
        type      : WSMessageType.SUBSCRIBEEVENTS
      });
      break;
    case "auth_invalid":
      throw new Error("Authentication failed");
    case "auth_required":
      ws.send(
        JSON.stringify({
          access_token: haToken,
          type        : WSMessageType.AUTH
        })
      );
      break;
    case WSMessageType.EVENT:{
      const { entity_id, new_state } = parsedData.event.data;
      useMessage(entity_id, new_state);
      break;
    }
    case WSMessageType.RESULT:
      if (parsedData.result) {
        for (const data of forceArray(parsedData.result) ){
          useMessage(data.entity_id, data);
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
function useMessage(entityId: string, messageFromSocket: any): void {//TODO change any
  if (listeners[entityId]) {
    const result = listeners[entityId](messageFromSocket);
    result && sendMessageToWebSocket( result );
  }
}

export function sendMessageToWebSocket(data = {} as {[key: string]: any}): void {
  if (!data.type) data.type = WSMessageType.CALLSERVICE;
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