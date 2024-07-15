import { settings } from "../core/settings"
import WebSocket    from "ws"

const type = {
  event : "event",
  result: "result"
}

let ws: WebSocket;

export async function initSocket(resultCB:(data:HaResultData[])=>void, eventCB:(data:HaEventNewState)=>void) {
  ws = new WebSocket("ws://" + settings.homeAssistantAddress + "/api/websocket");
  ws.on('open', function open() {
    console.log('Connected to Home Assistant WebSocket');
  });

  ws.on('message', function incoming(data) {
    const parsedData = JSON.parse(data.toString('utf8'));
    switch (parsedData.type) {
      case 'auth_ok':
        console.log('Authentication successful');
        sendMessage({
          type: 'get_states',
          id: 1
        });
        sendMessage({
          id: 2,
          type: 'subscribe_events',
          event_type: 'state_changed'
        });
        break;
      case 'auth_invalid':
        console.error('Authentication failed');
        break;
      case 'auth_required':
        console.log('Authentication required');
        sendMessage({
          type: 'auth',
          access_token: settings.token,
        });
        break;
      case type.result:
        resultCB(parsedData.result as HaResultData[]);
        console.log('get initials states successful');
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

  // Gérer la fermeture de la connexion
  ws.on('close', function close() {
    console.log('Disconnected from Home Assistant WebSocket');
  });
}


export function sendMessage(message:unknown) {
  ws.send(JSON.stringify(message));
}