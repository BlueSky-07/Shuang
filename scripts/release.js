const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const archiver = require('archiver')

const VERSION = require(path.resolve(__dirname, '../package.json')).version.split('.').slice(0, 2).join('.')
const DIST_DIR = path.resolve(__dirname, `../dist`)
const DIST_FILE = path.resolve(DIST_DIR, `Shuang_${VERSION}.zip`)

const FILE_LIST = [
  'img',
  'build',
  'README.md',
  'LICENSE',
  'index.html',
]

console.log(`creating release dist for ${VERSION}`)

fse.mkdirpSync(DIST_DIR)
try {
  fse.rmSync(DIST_FILE)
} catch (e) {}

const output = fs.createWriteStream(DIST_FILE)
const zip = archiver('zip')

output.on('close', function () {
  console.log(`=> ${DIST_FILE} (${Math.ceil(zip.pointer() / 1024)} kb)`)
})

zip.on('error', function (err) {
  throw err
})

zip.pipe(output)

for (const filename of FILE_LIST) {
  const filepath = path.resolve(__dirname, `../${filename}`)
  if (!fs.existsSync(filepath)) {
    console.error(`? ${filename}`)
  }
  try {
    if (fs.lstatSync(filepath).isDirectory()) {
      zip.directory(filepath,filename)
      console.log(`+ ${filename}/*`)
    } else {
      zip.file(filepath, { name: filename })
      console.log(`+ ${filename}`)
    }
  } catch (e) {
    throw e
  }
}

zip.finalize()
