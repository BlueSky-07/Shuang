const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.resolve(__dirname, "../build");

try {
  if (fs.existsSync(BUILD_DIR)) {
    // prefer fs.rmSync when available (Node 14.14+/16+), fallback to rmdirSync
    if (typeof fs.rmSync === "function") {
      fs.rmSync(BUILD_DIR, { recursive: true, force: true });
    } else {
      fs.rmdirSync(BUILD_DIR, { recursive: true });
    }
    console.log(`removed ${BUILD_DIR}`);
  } else {
    console.log(`nothing to remove at ${BUILD_DIR}`);
  }
} catch (err) {
  console.error(
    `failed to remove ${BUILD_DIR}:`,
    err && err.message ? err.message : err
  );
  process.exitCode = 1;
}
