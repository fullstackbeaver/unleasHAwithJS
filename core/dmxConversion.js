const { DMXentities, DMXsteps, DMXtransitionDuration } = require("../settings.json");
const { writeToDMX }                                   = require("../ports/dmxOutput");

const intervales  = DMXtransitionDuration / DMXsteps;
const list        = Object.keys(DMXentities);
const dmxValues   = Array(Object.keys(DMXentities).length).fill(0);  // Initialiser tous les canaux à 0
const transitions = {};

let modified = false;

function dmxHandleResult(response) {
  if (Array.isArray(response.result)) {
    for (const entity of response.result) {
      const index = list.indexOf(entity.entity_id);
      if (index === -1) continue;
      dmxValues[index] = limitValue(entity.entity_id, entity.attributes.brightness ?? 0);
    }
    writeToDMX(dmxValues);
  }
}

function dmxHandleEvent(event) {
  list.includes(event.data.entity_id) && updateDMX(event.data.entity_id, event.data.new_state.attributes.brightness);
}

function updateDMX(entityId, value) {
  const fixedValue = limitValue(entityId, value ?? 0);
  const index      = list.indexOf(entityId);

  if (dmxValues[index] === fixedValue) return;

  modified = true;
  !DMXentities[entityId].useTransition
    ? dmxValues[index] = fixedValue
    : setTransition(index.toString(), fixedValue);
}

/**
 * Sets a transition for a given index to a new value.
 *
 * @param {string} index - The index of the transition.
 * @param {number} newValue - The new value to transition to.
 * @return {void}
 */
function setTransition(index, newValue) {
  addTransition(
    index,
    newValue,
    transitions[index]?.step < DMXsteps/2
      ? DMXsteps - transitions[index].step
      : DMXsteps
  );
}

function transitionNexStep(index) {
  transitions[index].step--;
  if (transitions[index].step === 0) delete transitions[index];
  else {
    transitions[index].currentValue += transitions[index].gap;
    dmxValues  [index]               = Math.round(transitions[index].currentValue);
    modified                         = true;
  }
}

/**
 * Calculates the gap and updates the transitions object with the new values.
 *
 * @param {string} index - The index of the transition.
 * @param {number} newValue - The new value to transition to.
 * @param {number} [transitionSteps] - The number of steps for the transition.
 * @return {void}
 */
function addTransition(index, newValue, transitionSteps = DMXsteps){
  const currentValue = dmxValues[parseInt(index)];
  const gap = (newValue - currentValue) / transitionSteps;
  transitions[index] = {
    currentValue : currentValue + gap,
    gap          : gap,
    step         : DMXsteps
  }
}

function limitValue(entityId, value) {
  return !DMXentities[entityId].max
    ? value
    : Math.round(DMXentities[entityId].max*value/255);
}

const loop = setInterval(() => {
  for (const index in transitions) {
    transitionNexStep(index);
  }
  if (!modified) return;
  writeToDMX(dmxValues);
  modified = false;
}, intervales);

module.exports = {
  dmxHandleResult,
  dmxHandleEvent
}