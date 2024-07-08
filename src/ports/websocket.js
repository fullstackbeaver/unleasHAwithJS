const { homeAssistantAddress, token } = require("../../settings.json");
const WebSocket                       = require("ws");

const cbsResult = [];
const cbsEvent  = [];
const type      = {
  event : "event",
  result: "result"
}
const ws = new WebSocket("ws://" + homeAssistantAddress + "/api/websocket");

// gestion des évènemenbts du websocket
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
        access_token: token,
      });
      break;
    case type.result:
      for (const cb of cbsResult) {
        cb(parsedData);
      }
      break;
    case type.event:
      for (const cb of cbsEvent) {
        cb(parsedData.event);
      }
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

function addActionOnWebsocket(typeResponse, cb) {
  typeResponse === type.event
    ? cbsEvent.push(cb)
    : cbsResult.push(cb);
}
function sendMessage(message) {
  ws.send(JSON.stringify(message));
}

module.exports = {
  addActionOnWebsocket,
  sendMessage,
  type
}