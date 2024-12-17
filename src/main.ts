import { importEntities, importEntitiesAndCreateHaConfig } from "@core/entities";

process.argv.includes("generate-ha-files")
  ? importEntitiesAndCreateHaConfig()
  : importEntities();
