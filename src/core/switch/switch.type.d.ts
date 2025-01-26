import type { BaseImportedDevice } from "../device/device.type.d";

export interface SwitchFromCSV extends BaseImportedDevice {
  dmx: string;
}

export interface SwitchArguments extends BaseImportedDevice {
  dmx: number
}
