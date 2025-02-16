import type { BaseImportedDevice, DevicesFromCSV } from "./device/device.type";
import      { csvToJson, writeConfig }             from "@infra/files/files";
import type { HaEntities }                         from "./ha.types";
import type { LightFromCSV }                       from "./light/light.types";
import      { convertToSnakeCase }                 from "src/utils/stringAdapter";
import      { haEntities }                         from "./ha.constants";
import      { readdir }                            from "node:fs/promises";
import type { SwitchFromCSV } from "./switch/switch.type";
// import type { SwitchFromCSV }                      from "./switch/switch.type";
// import      { lightWsArtNet }                      from "./light/light-Ws-ArtNet";
// import      { parse }                              from "node:path";
// import      { switchWsArtNet }                     from "./switch/Switch-Ws-ArNet";
// import      { switchWsTemplate }                   from "./switch/switchHaConfigTemplate";
// import      { lightWsTemplate }                    from "./light/lightHaConfigTemplate";
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

type RegisteredEntity = {
  [key: string]: {
    create      : Function
    useTemplate : Function
  }
}

const csvPath      = process.cwd() + process.env.CSV_FOLDER;
const entitiesList = {
  [haEntities.COVER] : {} as { [key: string]: Function },
  [haEntities.LIGHT] : {} as { [key: string]: Function },
  [haEntities.SWITCH]: {} as { [key: string]: Function }
};

const entities = {} as RegisteredEntity;

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

  function addToWrite(haType:haEntities, value: BaseImportedDevice) { //TODO mettre LES bons types au lieu de BaseImportedDevice
    console.log("addToWrite", haType, value);
    if (!createConfig) return;
    console.log("addToWrite", haType, "1");

    if (!filesToWrite[haType]) filesToWrite[haType] = [];

    const templateFn = entities[value.entity]?.useTemplate;
    if (templateFn === undefined) throw new Error(`no template for ${value.entity}`);
    console.log("addToWrite", haType, "2");

    filesToWrite[haType].push(templateFn({
      ...value,
      uuid: getUniqueId(value as BaseImportedDevice)
    }));
  }

  function addEntity(haType:HaEntities, key:string, value:any) {
    console.log("addEntity", haType, key, value);
    // if (!haType in entitiesList) return;
    entitiesList[haType][key] = newEntity(value);
    addToWrite(haType, value);
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
          if ((value as LightFromCSV).deviceId === "") break;
          // entitiesList[haEntities.LIGHT][key] = newEntity(reformated);
          // addToWrite(haEntities.LIGHT, lightWsTemplate, reformated );
          addEntity(haEntities.LIGHT, key, {
            ...value as LightFromCSV,
            dmx: parseInt((value as LightFromCSV).dmx)
          });
          break;

        case haEntities.SWITCH:
          console.log("Switch", (value as SwitchFromCSV).deviceId);

          // entitiesList[haEntities.SWITCH][key] = newEntity(value as SwitchArguments);
          // addToWrite(haEntities.SWITCH, switchWsTemplate, value as SwitchFromCSV);
          addEntity(haEntities.SWITCH, key, value);
          break;

        default:
          throw new Error(`string entity type: ${haType}`);
      }
    }

    // console.clear();
    // console.log(entitiesList);
    if (createConfig) {
      console.log("creating configuration files...", filesToWrite);
      for (const [haType, value] of Object.entries(filesToWrite)) {
        console.log(haType, value.length);
        if (value.length === 0) continue;
        await writeConfig(haType as haEntities, value, haType !== haEntities.COVER);
      }
      console.log("configuration files created !");
      process.exit(0);
    }
  }
}

function newEntity(args:any) {
  console.log("newEntity", args);
  const entityType = args.entity;
  if (!entityType) throw new Error("entity type is required");
  const entity = entities[entityType];
  if ( entity === undefined) throw new Error(`entity type ${entityType} doe's not exist`);
  return entity.create(args);
}

export function registerEntity(name:string, create:Function, useTemplate:Function) {
  entities[name] = { create, useTemplate };
}