const { ReadlineParser, SerialPort }    = require('serialport');
const { tasmotaSerial } = require("../settings.json");
const end = "\r\n"
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
  envoyerCommande("Power" + id + " " + command);
}

console.log(tasmotaSerial[0])

const port = new SerialPort({
    autoOpen: false,
    baudRate: 115200,
    path    : tasmotaSerial[0]
});
'\n'
const parser = new ReadlineParser({ delimiter: end });
port.pipe(parser);

// Ouvrir le port série
// port.on('open', () => {
//   console.log('Port série ouvert');
// });

// // Lire les données venant du module Tasmota
// parser.on('data', data => {
//   console.log(`Données reçues: ${data}`);
// });

// // Gérer les erreurs
// port.on('error', err => {
//   console.error('Erreur: ', err.message);
// });

// Envoyer une commande au module Tasmota
function envoyerCommande(command) {
  try {
    
  port.write(command, err => {
    if (err) {
      return console.log('Erreur d\'écriture: ', err.message);
    }
    console.log(`Commande envoyée: ${command}`);
  });
  console.log(command,"envoyée"); //TODO remove
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  writeToTasmotaSerialCommand
}

const variantes = [ 
  "power2 1\n", 
  "power2 1\r\n", 
  "power2 1\r",
  Buffer.from("power2 1\n"),
  Buffer.from("power2 1\r\n"),
  Buffer.from("power2 1\r"),
]

const timeout = setInterval(() => {
  envoyerCommande(variantes.shift());
  console.log("reste",variantes.length);
  if (!variantes.length) {
    clearInterval(timeout);
    process.exit();
  }
}, 1000);