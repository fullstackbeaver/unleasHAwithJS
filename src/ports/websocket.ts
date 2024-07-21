import {homeAssistantAddress, token} from "../../settings/settings"
import WebSocket                     from "ws"

enum type {
  event  = "event",
  result = "result"
}

enum wsType {
  auth            = "auth",
  callService     = "call_service",
  getStates       = 'get_states',
  subscribeEvents = 'subscribe_events'
}

let ws: WebSocket;
let lastId = 0;

export function initSocket(resultCB: (data: HaResultData[]) => void, eventCB: (data: HaEventNewState) => void) {
  ws = new WebSocket("ws://" + homeAssistantAddress + "/api/websocket");
  ws.on('open', function open() {
    console.log('Connected to Home Assistant WebSocket');
  });

  ws.on('message', function incoming(data) {
    const parsedData = JSON.parse(data.toString('utf8'));
    if (parsedData.id > lastId) lastId = parsedData.id;
    console.log(parsedData);
    switch (parsedData.type) {
      case 'auth_ok':
        sendMessage(wsType.getStates);
        sendMessage(wsType.subscribeEvents, { event_type: 'state_changed' });
        break;
      case 'auth_invalid':
        console.error('Authentication failed');
        break;
      case 'auth_required':
        ws.send(JSON.stringify({type: wsType.auth, access_token: token})); //specific because no id for this message
        break;
      case type.result:
        resultCB(parsedData.result as HaResultData[]);
        break;
      case type.event:
        eventCB(parsedData.event.data.new_state as HaEventNewState);
        break;
    }
  });

  // Gérer les erreurs de connexion
  ws.on('error', function error(error) {
    console.error('WebSocket error:', error);
  });

  // Gérer la fermeture de la connexion"opening"
  ws.on('close', function close() {
    console.warn('Disconnected from Home Assistant WebSocket');
  });
}

type DataType = {
  brightness      ?: number
  current_position?: number
  value           ?: string | number
}
export function sendEntityMessage({ data, entity }: { data: DataType, entity: string }) {

  function defineService() {
    if (domain === "cover")  return "set_cover_position";
    if (domain === "light")  return (data.brightness && data.brightness > 0) ? "turn_on" : "turn_off";
    if (domain === "sensor") return "set_value";
  }

  const domain = entity.split(".")[0];
  sendMessage(wsType.callService, {
    domain,
    service     : defineService(),
    service_data: {
        "entity_id": entity,
        ...data
      }
    });
}

function sendMessage(type: wsType, data?: object) {
  lastId++;
  const message = {
    id: lastId,
    type
  }
  data && Object.assign(message, data);
  console.log("sendMessage", message, JSON.stringify(message));
  ws.send(JSON.stringify(message));
}