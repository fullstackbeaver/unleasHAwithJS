import { expect, mock, test } from 'bun:test';
import { mqttConnection }     from './mqtt';

const mokedMqtt = mock((host, params) => ({
    end        : mock(() => {}),
    on         : mock((event, cb) => {}),
    publish    : mock((topic, message, retains) => {}),
    subscribe  : mock((topic, cb) => {}),
    unsubscribe: mock(() => {})
  }),
);

const { client, publish, receiveMessage, subscribe, topics, unsubscribe } = mqttConnection(mokedMqtt, {});
const topic = "test/topic";

test("publish on Mqtt without retain", () => {
  publish(topic, 42);
  expect(client.publish).toHaveBeenCalledTimes(1);
  expect(client.publish).toHaveBeenCalledWith(topic, JSON.stringify(42), { retain: false });
});

test("publish on Mqtt with retain", () => {
  client.publish.mockClear();
  publish(topic, 42, true);
  expect(client.publish).toHaveBeenCalledTimes(1);
  expect(client.publish).toHaveBeenCalledWith(topic, JSON.stringify(42), { retain: true });
});

test("subscribe on Mqtt", () => {
  expect(topics[topic]).toBeUndefined();
  subscribe(topic, () => {});
  expect(client.subscribe).toHaveBeenCalledTimes(1);
  expect(client.subscribe).toHaveBeenCalledWith(topic);
  expect(topics[topic]).toBeInstanceOf(Function);
});

test("unsubscribe on Mqtt", () => {
  expect(topics[topic]).toBeInstanceOf(Function);
  unsubscribe(topic);
  expect(client.unsubscribe).toHaveBeenCalledTimes(1);
  expect(client.unsubscribe).toHaveBeenCalledWith(topic);
  expect(topics[topic]).toBeUndefined();
});

test("mqtt receives messages", () => {
  subscribe(topic, mock(() => {}));
  receiveMessage(topic, Buffer.from("42"));
  expect(topics[topic]).toHaveBeenCalledTimes(1);
  expect(topics[topic]).toHaveBeenCalledWith("42");
})