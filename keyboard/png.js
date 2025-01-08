const { Resvg } = require('@resvg/resvg-js')

function convertSvgToPng(
  svg,
  opts = {
    background: '#ffffff'
  }
) {
  const resvg = new Resvg(svg, opts)
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()
  return pngBuffer
}

module.exports = {
  convertSvgToPng,
}