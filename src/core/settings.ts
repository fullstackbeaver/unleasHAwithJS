import { readJsonFile } from "../ports/files"

type Settings = {
  DMXrs485                 : string
  DMXsteps                 : number
  DMXtransitionDurationInMs: number
  homeAssistantAddress     : string
  token                    : string
}

export const settings = {} as Settings;

(async () => {
  const data = await readJsonFile("settings/settings.json") as Settings;
  Object.assign(settings, data);
})();