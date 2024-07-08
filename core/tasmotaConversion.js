const { tasmotaEntities }             = require("../settings.json");
const { writeToTasmotaSerialCommand } = require("../ports/tasmotaSerialCommands");

function tasmotaHandleResult(response) {
  if (Array.isArray(response.result)) {
    for (const entity of response.result) {
      const currentEntity = tasmotaEntities[entity.entity_id];
      if (!currentEntity) continue;
      writeToTasmotaSerialCommand(currentEntity.relayBoard,  entity.state === "on" ? 1 : 0, currentEntity.serialConfig ?? 0);
    }
  }
}

function tasmotaHandleEvent(event) {
  // const eventData     = event.data.new_state;
  // const currentEntity = tasmotaEntities[eventData.entity_id];
  // currentEntity && writeToTasmotaSerialCommand(currentEntity.relayBoard,  eventData.state.toUpperCase(), currentEntity.serialConfig ?? 0);
}

module.exports = {
  tasmotaHandleResult,
  tasmotaHandleEvent
}