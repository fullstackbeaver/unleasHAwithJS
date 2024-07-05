const { DMXrs485 }   = require("../settings.json");
const { SerialPort } = require('serialport');

const port = new SerialPort({
  autoOpen: false,
  baudRate: 250000,
  path    : DMXrs485,
});

function writeToDMX(data) {
  console.log("writeToDMX", data); //TODO remove
  const dmxBuffer = Buffer.alloc(data.length+1); // 1 octet de démarrage + octets de données
  dmxBuffer[0]    = 0;                           // Octet de démarrage (marque de début)
  data.forEach((value, index) => {
    dmxBuffer[index + 1] = value;
  });
  port.write(dmxBuffer);
}

module.exports = {
  writeToDMX
}