import      { MQTTaddress, MQTTclientId, MQTTpassword, MQTTuser } from "../../settings/settings"
import      { getEntity, getPropertyValueOfEntities }             from "../core/entities";
import type { MqttClient }                                        from "mqtt";
import      { connect }                                           from "mqtt";

let client:MqttClient;

export function initMQTT() {
  client         = connect(MQTTaddress, {
    clientId       : MQTTclientId,
    clean          : true,
    connectTimeout : 4000,
    username       : MQTTuser,
    password       : MQTTpassword,
    reconnectPeriod: 1000,
  })

  client.on('reconnect', () => {
    console.log('Reconnected to MQTT broker');
  })
  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    getPropertyValueOfEntities("mqttTopics")
      .flat()
      .forEach(topic => {
        client.subscribe(topic as string);
      })
    })

  client.on('message', (topic, message) => {
    console.log(topic, message.toString());
  })

  client.on('error', (error) => {
    console.error(error);
  })
};

export function sendMqtt(entityId:string, value:unknown) {
  const {mqttTopics, mqqttRetains} = getEntity(entityId);
  if (!mqttTopics) return; //TODO ajouter gestionnaire d'erreur
  client.publish(mqttTopics[1], JSON.stringify(value), {retain:mqqttRetains});
}