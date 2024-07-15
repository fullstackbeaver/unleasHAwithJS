import { readdirSync, readFileSync } from "fs";
import { join }                      from "path";

/**
 * Reads all files in the specified folder.
 *
 * @param {string} folderPath - The path of the folder to read.
 * @return {Promise<string[]>} An array of file names in the folder.
 */
export function getFilesInFolder(folderPath: string): string[] {
  try {
    const files = readdirSync(folderPath);
    return files;
  } catch (error) {
    console.error(`Error reading files in folder: ${folderPath}`, error);
    return [];
  }
}

/**
 * Reads and parses a JSON file from the given path.
 *
 * @param   {string} fileNameWithRelativePath - The path to the JSON file.
 *
 * @returns {Promise<T>} - A promise that resolves to the parsed JSON content.
 */
export async function readJsonFile<T>(fileNameWithRelativePath: string): Promise<T> {
  return await JSON.parse(readFileSync(join(process.cwd(), fileNameWithRelativePath), "utf8"));
}