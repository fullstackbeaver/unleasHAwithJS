/* eslint-disable camelcase, no-unused-vars */
import      { haToken, homeAssistantAddress }                 from "@settings/settings";
import      { updateEntityFromEvent, updateEntityFromResult } from "@core/entities";
import type { HaNewState }                                    from "@core/HaTypes";
import      WebSocket                                         from "ws";
import      { forceArray }                                    from "@adapters/state";

export const useWebSocket = "websocket connected to " + getAddress();

enum WSMessageType {
  Auth            = "auth",
  CallService     = "call_service",
  GetStates       = "get_states",
  SubscribeEvents = "subscribe_events",
  Event           = "event",
  Result          = "result"
}

let lastSentId = 0; //id sent by this client
const pendingRequests = new Map<number, (data: any) => void>();

const ws = new WebSocket(getAddress());

ws.on("open", function open() {
  console.log("Connected to Home Assistant WebSocket");
});

ws.on("message", function incoming(data) {
  const parsedData = JSON.parse(data.toString("utf8"));
  // console.log("Received message:", parsedData);
  (parsedData.id && pendingRequests.has(parsedData.id))
    ? pendingRequests.delete(parsedData.id)
    : handleUnsolicited(parsedData);
});

function handleUnsolicited(parsedData: any) {
  switch (parsedData.type) {
    case "auth_ok":
      sendMessage( WSMessageType.GetStates );
      sendMessage( WSMessageType.SubscribeEvents, { event_type: "state_changed" } );
      break;
    case "auth_invalid":
      throw new Error("Authentication failed");
    case "auth_required":
      ws.send(JSON.stringify({ access_token: haToken, type: WSMessageType.Auth }));
      break;
    case WSMessageType.Event:
      console.log("event is", parsedData.id);
      updateEntityFromEvent(parsedData.event.data.new_state as HaNewState);
      break;
    case WSMessageType.Result:
      console.log("result id", parsedData.id);
      parsedData.result && updateEntityFromResult(forceArray(parsedData.result) as HaNewState[]);
      break;
    // Handle other cases as necessary
    default:
      console.warn("Unhandled message type:", parsedData.type);
      break;
  }
}

function sendMessage(type: WSMessageType, data={} ): void {
  const message = {
    id: ++lastSentId,
    type,
    ...data
  } ;
  // console.log("Sending message:", message);
  ws.send(JSON.stringify(message));
}

ws.on("error", function error(err) {
  console.error("WebSocket error:", err);
});

ws.on("close", function close() {
  console.warn("Disconnected from Home Assistant WebSocket");
});

export function sendUpdateMessage(entity: object) {
  sendMessage( WSMessageType.CallService, entity );
}

function getAddress() {
  return "ws://" + homeAssistantAddress + "/api/websocket";
}