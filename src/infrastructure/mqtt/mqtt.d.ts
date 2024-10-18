export type MqttParameters = {
  clientId: string
  host    : string
  password: string
  username: string
};

export type MqttConnectionOutput = {
  client        ?: object
  publish        : Function
  receiveMessage?: Function
  subscribe      : Function
  topics        ?: object
  unsubscribe    : Function
};