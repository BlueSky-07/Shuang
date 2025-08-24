const fs = require('fs')
const path = require('path')

const BUILD_DIR = path.resolve(__dirname, '../build')

try {
  // Node 14+ 推荐使用 rmSync；force 避免 ENOENT
  if (fs.rmSync) {
    fs.rmSync(BUILD_DIR, { recursive: true, force: true })
  } else {
    // 兼容旧 Node：rmdirSync 若不存在会抛错，包一层 try/catch
    try { fs.rmdirSync(BUILD_DIR, { recursive: true }) } catch (e) {}
  }
  console.log(`removed ${BUILD_DIR}`)
} catch (e) {
  console.warn(`skip removing ${BUILD_DIR}: ${e && e.message}`)
}
