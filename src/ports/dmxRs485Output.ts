import { SerialPort, ReadlineParser } from 'serialport';

let port : SerialPort | undefined;

export function openDMXconnection(rs485Port: string) {
  console.log(rs485Port)
  port = new SerialPort({
    autoOpen: false, //true,
    baudRate: 250000,
    path    : rs485Port,
  }, (err) => {
    if (!err) return;
    console.error('Error on DMX port creation: ', err)
    process.exit();
  });
  
  port.open();
  // Open errors will be emitted as an error event
  port.on('error', (err) => {

    console.error('Error on DMX port: ', err)
    // console.error('Error on DMX port: ', err.message)
    process.exit();
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
}

export function writeToDMX(data:number[]) {
  console.log("writeToDMX", data); //TODO remove
  // const dmxBuffer = Buffer.alloc(data.length+1); // 1 octet de démarrage + octets de données
  // dmxBuffer[0]    = 0;                           // Octet de démarrage (marque de début)
  // data.forEach((value, index) => {
  //   dmxBuffer[index + 1] = value;
  // });
  // port.write(dmxBuffer);
  port && port.write(Buffer.from(data));
}