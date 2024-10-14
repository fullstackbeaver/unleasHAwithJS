/**
 * Converts a boolean value to a numeric representation.
 *
 * @param {("on"|"off")} state - The state to convert.
 *
 * @return {number} The numeric representation of the state.
 */
export function onOffToValue(state:"on"|"off"): number {
  return state === "off" ? 0 : 255;
}

export function forceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function convertToPercent(value: number): number {
  return Math.round(value * 100 / 255);
}

export function convertFromPercent(value: number): number {
  return Math.round(value * 255 / 100);
}