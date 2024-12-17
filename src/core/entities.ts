import { csvToJson, writeConfig } from "@infra/files/files";
import { CoverMqttArtNet }        from "./cover/Cover-Mqtt-ArtNet";
import { LightWsArtNet }          from "./light/Light-Ws-ArtNet";
import { SwitchWsArtNet }         from "./switch/Switch-Ws-ArNet";
import { convertToSnakeCase }     from "src/utils/stringAdapter";
import { coverMqttTemplate }      from "./cover/coverHaConfigTemplate.";
import { lightWsTemplate }        from "./light/lightHaConfigTemplate";
import { readdir }                from "node:fs/promises";
import { switchWsTemplate }       from "./switch/switchHaConfigTemplate";
// import { entities }                   from "@settings/entities";

export enum HaEntities {
  COVER  = "cover",       // eslint-disable-line no-unused-vars
  LIGHT  = "light",       // eslint-disable-line no-unused-vars
  SWITCH = "switch"       // eslint-disable-line no-unused-vars
}

enum Protocols {
  ARTNET = "ArtNet",      // eslint-disable-line no-unused-vars
  MQTT   = "MQTT",        // eslint-disable-line no-unused-vars
  WS     = "WS"           // eslint-disable-line no-unused-vars
}

type RawJsonFromFile = {
  [key in HaEntities]: BaseImportedDevive[]  // eslint-disable-line no-unused-vars
}

type BaseImportedDevive = {
    [key:string]  : string|number
    area          : string
    haProtocol    : string
    name          : string
    outputProtocol: string
    room          : string
    type          : string
}

const entitiesList = {
  [HaEntities.COVER] : {} as { [key: string]: CoverMqttArtNet },
  [HaEntities.LIGHT] : {} as { [key: string]: LightWsArtNet },
  [HaEntities.SWITCH]: {} as { [key: string]: SwitchWsArtNet }
};

const csvPath = process.cwd() + process.env.CSV_FOLDER;

async function getFilesAsJSON() { //TODO use bun FS instead
  const files:any = {};
  const dir       = await readdir(csvPath);
  for (const file of dir.filter(file => file.endsWith(".csv"))) {
    const filename = file
      .split(" - ")[1]
      .split(".")[0]
      .toLowerCase();
    files[filename] = await csvToJson(csvPath + "/" + file);
  }
  return files as RawJsonFromFile;
}

function reformatJson(arr:{[key:string]:string|number}[]) {
  const reformated = {} as {[key:string]:{[key:string]:string|number}};
  for (const entry of arr) {
    const uniqueId                 = convertToUniqueId(entry as BaseImportedDevive);
    reformated[uniqueId]           = entry;
    reformated[uniqueId].protoCode = defineProtocolCode(reformated[uniqueId].haProtocol as Protocols,reformated[uniqueId].outputProtocol as Protocols);

    delete reformated[uniqueId].area;
    delete reformated[uniqueId].haProtocol;
    delete reformated[uniqueId].name;
    delete reformated[uniqueId].outputProtocol;
    delete reformated[uniqueId].room;
    delete reformated[uniqueId].type;
  }
  return reformated;
}

function convertToUniqueId({ area, room, type }:BaseImportedDevive): string {
  return [room, type, area]
    .map(convertToSnakeCase)
    .reduce((a, b) => `${a}${b ? "_"+b: ""}`);
}

export async function importEntities() {
  for (const [haType, value] of Object.entries(await getFilesAsJSON())) {
    const reformated = reformatJson(value);
    switch (haType) {
      case HaEntities.COVER:
        for (const [key, value] of Object.entries(reformated)) {
          if (value.protoCode === 10) entitiesList[haType][key] = new CoverMqttArtNet(key, value);
        }
        break;
      case HaEntities.LIGHT:
        for (const [key, value] of Object.entries(reformated)) {
          if (value.protoCode === 0) entitiesList[haType][key] = new LightWsArtNet(key, value);
        }
        break;
      case HaEntities.SWITCH:
        for (const [key, value] of Object.entries(reformated)) {
          if (value.protoCode === 0) entitiesList[haType][key] = new SwitchWsArtNet(key, value);
        }
        break;
      default:
        throw new Error(`Unknown entity type: ${haType}`);
    }
  }
}

export async function importEntitiesAndCreateHaConfig() {
  const filesToWrite = {
    [HaEntities.COVER] : [] as string[],
    [HaEntities.LIGHT] : [] as string[],
    [HaEntities.SWITCH]: [] as string[]
  };
  for (const [haType, value] of Object.entries(await getFilesAsJSON())) {
    switch (haType) {
      case HaEntities.LIGHT:
        filesToWrite[HaEntities.LIGHT] = value.map((data:BaseImportedDevive) => lightWsTemplate( {
          ...data,
          uuid: convertToUniqueId(data)
        }));
        break;
      case HaEntities.SWITCH:
        filesToWrite[HaEntities.SWITCH] = value.map((data:BaseImportedDevive) => switchWsTemplate( {
          ...data,
          uuid: convertToUniqueId(data)
        }));
        break;
      case HaEntities.COVER:
        filesToWrite[HaEntities.COVER] = value.map((data:BaseImportedDevive) => coverMqttTemplate( data.name, convertToUniqueId(data)));
        break;
      default:
        throw new Error(`Unknown entity type: ${haType}`);
    }
  }
  for (const [haType, value] of Object.entries(filesToWrite)) {
    if (value.length === 0) continue;
    await writeConfig(haType as HaEntities, value, haType !== HaEntities.COVER);
  }
  console.log("configuration files created !");
  process.exit(0);
}

function defineProtocolCode(ha:Protocols, output:Protocols) {
  const haIndex     = [Protocols.WS, Protocols.MQTT];
  const outputIndex = [Protocols.ARTNET];
  return (haIndex.indexOf(ha)*10) + outputIndex.indexOf(output);
}