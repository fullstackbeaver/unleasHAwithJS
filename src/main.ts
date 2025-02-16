import { importEntities, registerEntity } from "@core/entities";
import { lightWsArtNet }                  from "@core/light/light-Ws-ArtNet";
import { lightWsTemplate }                from "@core/light/lightHaConfigTemplate";
import { switchWsArtNet }                 from "@core/switch/Switch-Ws-ArNet";
import { switchWsTemplate }               from "@core/switch/switchHaConfigTemplate";

registerEntity("LIGHT_WS_ARTNET", lightWsArtNet, lightWsTemplate);
registerEntity("SWITCH_WS_ARNET", switchWsArtNet, switchWsTemplate);

importEntities(process.argv.includes("generate-ha-files"));
