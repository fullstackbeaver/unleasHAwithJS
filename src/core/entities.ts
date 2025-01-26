import type { BaseImportedDevice, DevicesFromCSV } from "./device/device.type";
import type { LightArguments, LightFromCSV }       from "./light/light.type";
import      { csvToJson, writeConfig }             from "@infra/files/files";
import      { convertToSnakeCase }                 from "src/utils/stringAdapter";
import      { haEntities }                         from "./ha.constants";
import      { lightWsArtNet }                      from "./light/light-Ws-ArtNet";
import      { lightWsTemplate }                    from "./light/lightHaConfigTemplate";
import      { readdir }                            from "node:fs/promises";
import      { switchWsArtNet }                     from "./switch/Switch-Ws-ArNet";
// import      { CoverMqttArtNet }                    from "./cover/Cover-Mqtt-ArtNet";
// import type { SwitchArguments }              from "./switch/Switch-Ws-ArNet";
// import      { coverMqttTemplate }            from "./cover/coverHaConfigTemplate";
// import      { switchWsTemplate }             from "./switch/switchHaConfigTemplate";
// import { entities }                   from "@settings/entities";

// enum Protocols {
//   ARTNET = "ArtNet",      // eslint-disable-line no-unused-vars
//   MQTT   = "MQTT",        // eslint-disable-line no-unused-vars
//   WS     = "WS"           // eslint-disable-line no-unused-vars
// }

const  entities:{[key:string]:Function } = {
  // COVER_MQTT_ARTNET: CoverMqttArtNet, //TODO fix class
  LIGHT_WS_ARTNET: lightWsArtNet,
  // SENSOR_WS        : "Sensor-Ws",
  SWITCH_WS_ARNET: switchWsArtNet,
};

const entitiesList = {
  [haEntities.COVER] : {} as { [key: string]: Function },
  [haEntities.LIGHT] : {} as { [key: string]: Function },
  [haEntities.SWITCH]: {} as { [key: string]: Function }
};

const csvPath = process.cwd() + process.env.CSV_FOLDER;

async function getFilesAsJSON() { //TODO use bun FS instead
  const files = {} as {[key:string]:unknown};
  const dir       = await readdir(csvPath);
  for (const file of dir.filter(file => file.endsWith(".csv"))) {
    const filename = file
      .split(" - ")[1]
      .split(".")[0]
      .toLowerCase();
    files[filename] = await csvToJson(csvPath + "/" + file);
  }
  return files as DevicesFromCSV;
}

// function reformatJson(arr:BaseImportedDevice[]) {
//   const reformated = {} as {[key:string]:{[key:string]:string|number}};
//   for (const entry of arr) {
//     const deviceId                 = getDeviceId(entry as BaseImportedDevice);
//     reformated[deviceId]           = entry;
//     reformated[deviceId].protoCode = 0; // defineProtocolCode(reformated[deviceId].haProtocol as Protocols,reformated[deviceId].outputProtocol as Protocols);

//     delete reformated[deviceId].area;
//     delete reformated[deviceId].haProtocol;
//     delete reformated[deviceId].name;
//     delete reformated[deviceId].outputProtocol;
//     delete reformated[deviceId].room;
//     delete reformated[deviceId].type;
//   }
//   return reformated;
// }

function formatString(arr:string[]) {
  return arr
    .map(convertToSnakeCase)
    .reduce((a, b) => `${a}${b ? "_"+b: ""}`);
}

function getUniqueId({ area, room, type }:BaseImportedDevice): string {
  return formatString([type, room, area]);
}

export async function importEntities(createConfig: boolean) {
  // console.log(await getFilesAsJSON());

  function addToWrite(haType:haEntities, fn:Function, value:object) {
    if (!filesToWrite[haType]) filesToWrite[haType] = [];
    filesToWrite[haType].push(fn({
      ...value,
      uuid: getUniqueId(value as BaseImportedDevice)
    }));
  }

  const filesToWrite:{[key:string]:string[]} = {};

  for (const [haType, entries] of Object.entries(await getFilesAsJSON())) {

    for (const [key, value] of Object.entries(entries)) {
      switch (haType) {
        case haEntities.COVER:
          // console.log("Cover", key, value);
          // for (const [key, value] of Object.entries(entry)) {
          //   if (value.deviceId === 10) entitiesList[haType][key] = new CoverMqttArtNet(key, value);
          // }
          break;

        case haEntities.LIGHT:
          const reformated:any = value as LightFromCSV;

          if (reformated.max === "") delete reformated.max;
          else reformated.max = parseInt(reformated.max);

          reformated.dmx            = parseInt(reformated.dmx);
          entitiesList[haType][key] = newEntity(reformated as LightArguments);

          createConfig && addToWrite(haType, lightWsTemplate, reformated );
          break;

        case haEntities.SWITCH:
          // for (const [key, value] of Object.entries(entry)) {
          //   if (value.protoCode === 0) entitiesList[haType][key] = new SwitchWsArtNet(key, value satisfies SwitchArguments);
          // }
          break;

        default:
          throw new Error(`string entity type: ${haType}`);
      }
    }

    if (createConfig) {
      for (const [haType, value] of Object.entries(filesToWrite)) {
        if (value.length === 0) continue;
        await writeConfig(haType as haEntities, value, haType !== haEntities.COVER);
      }
      console.log("configuration files created !");
      process.exit(0);
    }
  }
}

function newEntity(args:any) {
  console.log(args);
  const entityType = args.entity as keyof typeof entities;
  if (!entityType) throw new Error("entity type is required");
  const entity = entities[entityType];
  if ( entity === undefined) throw new Error(`entity type ${entityType} doe's not exist`);
  return entity(args);
}