import { createRequire } from "module";
import { readFileSync } from "fs";

const require = createRequire(import.meta.url);

const criticalModules = ["express", "cors", "helmet"];

const repairCommand = process.platform === "win32"
  ? "rmdir /s /q node_modules && del package-lock.json && npm install"
  : "rm -rf node_modules package-lock.json && npm install";

function checkModule(moduleName) {
  const entryPoint = require.resolve(moduleName);
  readFileSync(entryPoint);
}

try {
  criticalModules.forEach(checkModule);
} catch (error) {
  if (error?.code === "EIO") {
    console.error("\nUnable to read an installed dependency from node_modules.");
    console.error("This usually means the local node_modules folder is corrupted or the drive/filesystem returned an I/O error.");
    console.error(`Repair it by reinstalling dependencies:\n  ${repairCommand}\n`);
    process.exit(1);
  }

  throw error;
}
