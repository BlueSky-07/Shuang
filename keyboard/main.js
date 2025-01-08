const fs = require('fs')
const path = require('path')
const { defaults } = require('lodash')
const default_const_mapping = require('./const')
const bopomofo = require('./bopomofo')
const render = require('./render')
const png = require('./png')
const scheme_list = require('./scheme')

const outputDir = path.resolve(__dirname, '../img')
// const outputDir = path.resolve(__dirname, 'dist')

function main() {
  const schemes = scheme_list
  for (const scheme of [...schemes]) {
    schemes.push(bopomofo.convertScheme(scheme))
  }
  for (const scheme of schemes) {
    const const_mapping = defaults(scheme.const, default_const_mapping)
    const svg = render.renderToSvg(const_mapping, scheme)
    const svgFilepath = path.resolve(outputDir, scheme.name + '.svg')
    fs.writeFileSync(svgFilepath, svg)
    console.log("keyboard svg =>", svgFilepath)

    const pngBuffer = png.convertSvgToPng(svg)
    const pngFilepath = path.resolve(outputDir, scheme.name + '.png')
    fs.writeFileSync(pngFilepath, pngBuffer)
    console.log("keyboard png =>", svgFilepath)
  }
}
main()