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
  for (const config of Object.values(Fonts)) {
    config.font = opentype.loadSync(config.path)
  }
}

function getFont(fontName = '') {
  const mapping = {
    EN: Fonts.Inter_Regular.font,
    EN_BOLD: Fonts.Inter_Bold.font,
    EN_ITALIC: Fonts.Inter_Italic.font,
    ZH: Fonts.FangZhengFangSong.font,
  }
  for (const [fontName, config] of Object.entries((k, v) => ([k, v.font]))) {
    mapping[fontName] = config.font
  }
  return mapping[fontName] || Fonts.Inter_Regular
}

function getPaths(font, text = '', x = 0, y = 0, fontSize = 72, options = {
  fill: 'black', stroke: '', strokeWidth: 1
}) {
  const textPaths = font.getPaths(text, x, y, fontSize, options)
  if (!options.fill) return textPaths
  for (const textPath of textPaths) {
    if (options.fill) textPath.fill = options.fill
    if (options.stroke) textPath.stroke = options.stroke
    if (options.strokeWidth) textPath.strokeWidth = options.strokeWidth
  }
  return textPaths
}

function stringToGlyphs(font, text = '') {
  return font.stringToGlyphs(text)
}

function getAdvanceWidth(font, text = '', fontSize = 72, options = {
  fill: 'black', stroke: '', strokeWidth: 1
}) {
  return font.getAdvanceWidth(text, fontSize, options)
}

loadFont()

module.exports = {
  getFont,
  getPaths,
  stringToGlyphs,
  getAdvanceWidth,
}