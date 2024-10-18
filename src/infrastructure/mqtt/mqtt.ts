import      { MQTTaddress, MQTTclientId, MQTTpassword, MQTTuser } from "@settings/settings";
import type { MqttConnectionOutput, MqttParameters }              from "./mqtt.d";
import type { ErrorWithReasonCode }                               from "mqtt";
import      { connect }                                           from "mqtt";
import      { isTesting }                                         from "src/utils/test";

/**
 * Establishes a connection to the MQTT broker, and returns a function
 * that subscribe to a topic, unsubscribes from a topic, and publishes
 * to a topic.
 *
 * The returned function also contains the "topics" property, which is
 * an object that maps topics to callbacks.
 *
 * @param {Function}       connect - The function that establishes the connection
 * @param {MqttParameters} options - The options for the connection
 *
 * @returns {MqttConnectionOutput}
 */
export function mqttConnection(connect:Function, { clientId, host, password, username }:MqttParameters):MqttConnectionOutput {
  const topics = {} as {[topic:string]:Function};

  function receiveMessage(topic:string, message:Buffer) {
    topics[topic] && topics[topic](message.toString("utf8"));  //NOSONAR this structure is for faster handling for JS engine
  }

  function publish(topic:string, value:unknown, retain:boolean = false) {
    client.publish(topic, JSON.stringify(value), { retain });
  }

  function subscribe(topic:string, cb:Function) {
    topics[topic] = cb;
    client.subscribe(topic);
  }

  function unsubscribe(topic:string) {
    delete topics[topic];
    client.unsubscribe(topic);
  }

  const client = connect(host, {
    clean          : true,
    clientId,
    connectTimeout : 4000,
    password,
    reconnectPeriod: 1000,
    username,
  } );

  client.on("reconnect", () => {
    for (const topic of Object.keys(topics)) {
      client.subscribe(topic);
      console.log("Subscribed to topic", topic);
    }
  });

  client.on("connect", () => {
    console.log("Connected to MQTT broker");
  });

  client.on("message", receiveMessage);

  client.on("error", (error:Error | ErrorWithReasonCode) => {
    console.error(error);
  });

  return isTesting
    ? { client, publish, receiveMessage, subscribe, topics, unsubscribe }
    : { publish, subscribe, unsubscribe };
}

export const { publish, subscribe, unsubscribe } = mqttConnection(connect, {
  clientId: MQTTclientId,
  host    : MQTTaddress,
  password: MQTTpassword,
  username: MQTTuser
});
