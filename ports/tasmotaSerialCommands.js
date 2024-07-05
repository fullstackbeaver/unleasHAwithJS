const { ReadlineParser, SerialPort }    = require('serialport');
const { tasmotaSerial } = require("../settings.json");

// const ports = tasmotaSerial.map(serial => new SerialPort({
//   autoOpen: false,
//   baudRate: 115200,
//   path    : serial
// }));

// function writeToTasmotaSerialCommand(id, command, serial) {
//   console.log("writeToTasmotaSerialCommand", "POWER" + id + " " + command+"\n"); //TODO remove
//   console.log("Backlog Status 1; Power2 on; Delay 20; Power2 off; Status 4"); //TODO remove
//   // ports[serial].write("POWER" + id + " " + command+"\n");
//   ports[serial].write("Power2 on\r\n", (err) => {
//     if (err) {
//       return console.log('Erreur d\'écriture: ', err.message);
//     });
// }

function writeToTasmotaSerialCommand(id, command, serial) {
  // console.log("writeToTasmotaSerialCommand", "POWER" + id + " " + command+"\n"); //TODO remove
  // envoyerCommande("Power" + id + " " + command);
}

const port = new SerialPort({
    autoOpen: false,
    baudRate: 115200,
    path    : tasmotaSerial
});

const parser = new ReadlineParser({ delimiter: '\r\n' });
port.pipe(parser);

// Ouvrir le port série
port.on('open', () => {
  console.log('Port série ouvert');
});

// Lire les données venant du module Tasmota
parser.on('data', data => {
  console.log(`Données reçues: ${data}`);
});

// Gérer les erreurs
port.on('error', err => {
  console.error('Erreur: ', err.message);
});

// Envoyer une commande au module Tasmota
function envoyerCommande(command) {
  port.write(`${command}\r\n`, err => {
    if (err) {
      return console.log('Erreur d\'écriture: ', err.message);
    }
    console.log(`Commande envoyée: ${command}`);
  });
  console.log(command); //TODO remove
}

module.exports = {
  writeToTasmotaSerialCommand
}