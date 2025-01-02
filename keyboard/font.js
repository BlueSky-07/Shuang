const opentype = require('opentype.js')
const path = require('path')

const Fonts = {
  Inter_Regular: {
    path: path.resolve(__dirname, 'fonts/Inter/Inter-Regular.ttf'),
    font: undefined
  },
  Inter_Italic: {
    path: path.resolve(__dirname, 'fonts/Inter/Inter-Italic.ttf'),
    font: undefined
  },
  Inter_Bold: {
    path: path.resolve(__dirname, 'fonts/Inter/Inter-Bold.ttf'),
    font: undefined
  },
  FangZhengFangSong: {
    path: path.resolve(__dirname, 'fonts/FangZhengFangSong-GBK.ttf'),
    font: undefined
  },
}

function loadFont () {
  for (const [key, font] of Object.entries(Fonts)) {
    font.font = opentype.loadSync(font.path)
  }
}

function getPaths(font, text = '', x = 0, y = 0, fontSize = 72, options = {
  colorFormat: 'hexa', fill: 'black',
}) {
  const textPaths = font.font.getPaths(text, x, y, fontSize, options)
  if (!options.fill) return textPaths
  for (const textPath of textPaths) {
    textPath.fill = options.fill // 修复 options 传值不生效
  }
  return textPaths
}

function stringToGlyphs(font, text = '') {
  return font.font.stringToGlyphs(text)
}

function getAdvanceWidth(font, text = '', fontSize = 72, options = {
  colorFormat: 'hexa', fill: 'black',
}) {
  return font.font.getAdvanceWidth(text, fontSize, options)
}

loadFont()

module.exports = {
  EN: Fonts.Inter_Regular,
  EN_BOLD: Fonts.Inter_Bold,
  EN_ITALIC: Fonts.Inter_Italic,
  ZH: Fonts.FangZhengFangSong,
  getPaths,
  stringToGlyphs,
  getAdvanceWidth,
}