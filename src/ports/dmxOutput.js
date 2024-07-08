const { DMXrs485 }   = require("../../settings.json");
const { SerialPort, ReadlineParser } = require('serialport');

const port = new SerialPort({
  autoOpen: true,
  baudRate: 115200,
  path    : DMXrs485,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

// port.open();
// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message)
})

// port.on('readable', function () {
//   console.log('readable Data:', port.read())
// })

// Switches the port into "flowing mode"
// port.on('data', function (data) {
//   console.log('Data:', data)
// })

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', console.log)

function writeToDMX(data) {
  console.log("writeToDMX", data); //TODO remove
  // const dmxBuffer = Buffer.alloc(data.length+1); // 1 octet de démarrage + octets de données
  // dmxBuffer[0]    = 0;                           // Octet de démarrage (marque de début)
  // data.forEach((value, index) => {
  //   dmxBuffer[index + 1] = value;
  // });
  // port.write(dmxBuffer);
  port.write(Buffer.from(data));
}

module.exports = {
  writeToDMX
}