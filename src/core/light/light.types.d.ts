import type { BaseImportedDevice } from "../device/device.type.d";

export interface LightFromCSV extends BaseImportedDevice {
  max       : string;
  dmx       : string;
}

export interface LightArguments extends BaseImportedDevice {
  dmx  : number
  max ?: number
}