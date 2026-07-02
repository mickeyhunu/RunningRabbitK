import { createRequire } from "module";
import { readFileSync } from "fs";

const require = createRequire(import.meta.url);

const criticalModules = ["express", "cors", "helmet"];

const repairCommand = process.platform === "win32"
  ? "rmdir /s /q node_modules && del package-lock.json && npm install"
  : "rm -rf node_modules package-lock.json && npm install";

function checkModule(moduleName) {
  const entryPoint = require.resolve(moduleName);

  // Confirm the package entry point itself is readable, then load the package so
  // Node traverses its internal files as it will when the app starts. A corrupt
  // install can leave the entry point readable while a nested file still throws
  // EIO during module loading.
  readFileSync(entryPoint);
  require(moduleName);
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
