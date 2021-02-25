const fse = require('fs-extra')
const path = require('path')

const [srcArgPath, destArgPath] = process.argv.slice(2)

const srcPath = path.resolve(__dirname, '../', srcArgPath)
const destPath = path.resolve(__dirname, '../', destArgPath)

fse.copy(srcPath, destPath)
console.log(`copy ${srcPath} => ${destPath}`)

