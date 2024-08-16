import      { MQTTaddress, MQTTclientId, MQTTpassword, MQTTuser } from "../../settings/settings"
import      { getAllEntities, getEntity }                         from "../core/entities";
import type { Entity }                                            from "../core/entities";
import type { MqttClient }                                        from "mqtt";
import      { connect }                                           from "mqtt";

let client:MqttClient;
const devicesList = [] as string[]
const topics      = {} as {[topic:string]:number}

export function initMQTT(cb:(topic:string, message:string, entity:Entity)=>void) {

  // register topics
  for (const [entity_id, {mqttTopics}] of Object.entries(getAllEntities())) {
    if (!mqttTopics) continue;
    devicesList.push(entity_id);
    const id = devicesList.length - 1;
    mqttTopics.forEach(topic => topics[topic] = id);
  }

  //connection
  client = connect(MQTTaddress, {
    clientId       : MQTTclientId,
    clean          : true,
    connectTimeout : 4000,
    username       : MQTTuser,
    password       : MQTTpassword,
    reconnectPeriod: 1000,
  });

  //events
  client.on('reconnect', () => {
    console.log('Reconnected to MQTT broker');
  });

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    for (const topic of Object.keys(topics)) {
      client.subscribe(topic);
      console.log('Subscribed to topic', topic);
    }
  });

  client.on('message', (topic, message) => {
    cb(topic, message.toString(), getEntity(devicesList[topics[topic]]));
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