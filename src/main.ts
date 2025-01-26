import { importEntities } from "@core/entities";

importEntities(process.argv.includes("generate-ha-files"));
