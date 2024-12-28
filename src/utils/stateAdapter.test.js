import { convertFromPercent, convertToPercent, forceArray, onOffToValue } from "./stateAdapter";
import { expect, test }                                                   from 'bun:test';
import { payload }                                                        from '@core/constants';

test("onOffToValue", () => {
  expect(onOffToValue(payload.ON)).toBe(255);
  expect(onOffToValue(payload.OFF)).toBe(0);
});

test("forceArray", () => {
  expect(forceArray(42)).toEqual([42]);
  expect(forceArray([42])).toEqual([42]);
});

test("convertToPercent", () => {
  expect(convertToPercent(255)).toBe(100);
  expect(convertToPercent(0)).toBe(0);
});

test("convertFromPercent", () => {
  expect(convertFromPercent(100)).toBe(255);
  expect(convertFromPercent(0)).toBe(0);
});