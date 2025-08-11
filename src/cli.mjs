#!/usr/bin/env node
import "dotenv/config";
import { scanProject, readSelectedFile } from "./scanner.mjs";
import { analyzeContent, analyzeProject } from "./analyzer.mjs";

async function main() {
  const args = process.argv.slice(2);
  let readFiles = false;
  let filePath = null;
  let model = "gpt-4o-mini";
  let customPrompt = null;

  // Minimal CLI argument parsing.
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--read":
        readFiles = true;
        break;
      case "--file":
        filePath = args[i + 1];
        i++;
        break;
      case "--model":
        model = args[i + 1];
        i++;
        break;
      case "--prompt":
        customPrompt = args[i + 1];
        i++;
        break;
      default:
        break;
    }
  }

  if (filePath) {
    console.log(`Reading file: ${filePath}\n`);
    const content = readSelectedFile(filePath);
    console.log(content);

    console.log("\n🔍 Analyzing File Content:\n");
    const result = await analyzeContent(content, model, customPrompt);
    console.log(result);
  } else {
    const structure = scanProject(".", readFiles);
    console.log("\n🔍 Project Structure:\n");
    console.log(JSON.stringify(structure, null, 2));

    console.log("\n🔍 Analyzing Project Structure:\n");
    const result = await analyzeProject(structure, model, customPrompt);
    console.log(result);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
