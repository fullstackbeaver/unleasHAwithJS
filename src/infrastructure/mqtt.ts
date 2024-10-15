import { MQTTaddress, MQTTclientId, MQTTpassword, MQTTuser } from "@settings/settings";
import { connect }                                           from "mqtt";

const topics = {} as {[topic:string]:Function};

export function subscribe(topic:string, cb:Function) {
  console.log("Subscribing to topic", topic);
  topics[topic] = cb;
  client.subscribe(topic);
}

export function unsubscribe(topic:string) {
  console.log("Unsubscribing to topic", topic);
  client.unsubscribe(topic);
}

export function publish(topic:string, value:unknown, retain:boolean = false) {
  console.log("Publishing to topic", topic, value);
  client.publish(topic, JSON.stringify(value), { retain });
}

const client = connect(MQTTaddress, {
  clean          : true,
  clientId       : MQTTclientId,
  connectTimeout : 4000,
  password       : MQTTpassword,
  reconnectPeriod: 1000,
  username       : MQTTuser,
});

client.on("reconnect", () => {
  for (const topic of Object.keys(topics)) {
    client.subscribe(topic);
    console.log("Subscribed to topic", topic);
  }
});

client.on("connect", () => {
  console.log("Connected to MQTT broker");
});

client.on("message", (topic, message) => {
  topics[topic] && topics[topic](message.toString("utf8"));
});

client.on("error", (error) => {
  console.error(error);
});