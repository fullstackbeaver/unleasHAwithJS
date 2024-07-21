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