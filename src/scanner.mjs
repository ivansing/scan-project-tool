import fs from 'fs';
import path from 'path';

// Allowed file extensions for reading file contents
const ALLOWED_EXTENSIONS = new Set([".js", ".py", ".tsx", ".json", "pdf", "txt"]);

/**
 * Recursively scans the project folder and returns its structure,
 * excluding "node_modules", ".env", and "package-lock.json".
 */
export function scanProject(directory = ".", readFiles = false) {
  const projectStructure = {};

  function walk(dir) {

    if (path.basename(dir) === "node_modules") return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const relativePath = path.relative(directory, dir);
    const filesInfo = {};

    for (const entry of entries) {

      if (entry.name === ".env" || entry.name === ".git" || entry.name === "package-lock.json") continue;
       

      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name));
      } else {
        const ext = path.extname(entry.name);
        const filePath = path.join(dir, entry.name);

        if (readFiles && ALLOWED_EXTENSIONS.has(ext)) {
          try {
            const content = fs.readFileSync(filePath, "utf8");
            filesInfo[entry.name] = { content };
          } catch (e) {
            filesInfo[entry.name] = { error: `Error reading file: ${e.message}` };
          }
        } else {
          filesInfo[entry.name] = {};
        }
      }
    }

    projectStructure[relativePath] = filesInfo;
  }

  walk(directory);
  return projectStructure;
}
  
  /**
   * Reads and returns the content of a single file if its extension is allowed.
   */
  export function readSelectedFile(filePath) {
    const ext = path.extname(filePath);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return `File extension '${ext}' not allowed.`;
    }
    try {
      return fs.readFileSync(filePath, "utf8");
    } catch (e) {
      return `Error reading file: ${e.message}`;
    }
  }