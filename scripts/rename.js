const fs = require('fs')
const path = require('path')

const BUILD_DIR = path.resolve(__dirname, '../build')

function js2minjs(dirpath) {
  console.log(`\nscanning ${dirpath}`)

  const files = fs.readdirSync(dirpath)
  for (const filename of files) {
    const filepath = path.resolve(dirpath, filename)
    const stat = fs.lstatSync(filepath)

    if (stat.isFile()) {
      if (filename.endsWith('.js') && !filename.endsWith('.min.js')) {
        let newFilename = filename.slice(0, -'.js'.length) + '.min.js'
        if (newFilename === 'app.bundle.min.js') {
          newFilename = 'app.min.js'
        }

        const newFilepath = path.resolve(dirpath, newFilename)
        fs.renameSync(filepath, newFilepath)
        console.log(`rename ${filename} => ${newFilename}`)
      }
    } else {
      js2minjs(path.resolve(dirpath, filename))
    }
  }
}

js2minjs(BUILD_DIR)