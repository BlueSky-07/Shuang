const font = require('./font')
const svg = require('./svg')
const const_mapping = require('./const')
const render = require('./render')

function drawBorders() {
  const borders = [
    render.BorderH(
      const_mapping.startX,
      const_mapping.startY,
      const_mapping.keyBorderWidth * 10,
    ),
    render.BorderH(
      const_mapping.startX,
      const_mapping.startY + const_mapping.keyBorderHeight,
      const_mapping.keyBorderWidth * 10 + const_mapping.keyBorderWidth / 2,
    ),
    render.BorderH(
      const_mapping.startX + const_mapping.keyBorderWidth / 2,
      const_mapping.startY + const_mapping.keyBorderHeight * 2,
      const_mapping.keyBorderWidth * 10 + const_mapping.keyBorderStrokeWidth,
    ),
    render.BorderH(
      const_mapping.startX + const_mapping.keyBorderWidth,
      const_mapping.startY + const_mapping.keyBorderHeight * 3,
      const_mapping.keyBorderWidth * 7 + const_mapping.keyBorderStrokeWidth,
    ),
  ]
  for (let i = 0; i < 11; i ++) {
    borders.push(
      render.BorderV(
        const_mapping.startX + const_mapping.keyBorderWidth * i,
        const_mapping.startY,
        const_mapping.keyBorderHeight,
      )
    )
  }
  for (let i = 0; i < 11; i ++) {
    borders.push(
      render.BorderV(
        const_mapping.startX + const_mapping.keyBorderWidth * i + const_mapping.keyBorderWidth / 2,
        const_mapping.startY + const_mapping.keyBorderHeight,
        const_mapping.keyBorderHeight,
      )
    )
  }
  for (let i = 0; i < 8; i ++) {
    borders.push(
      render.BorderV(
        const_mapping.startX + const_mapping.keyBorderWidth * (i + 1),
        const_mapping.startY + const_mapping.keyBorderHeight * 2,
        const_mapping.keyBorderHeight,
      )
    )
  }
  return borders
}

function drawTableBorders() {

}

function drawKey(
  row = 0, col = 0, alphabet = '',
  content = {
    sheng: '', yun1: '', yun2: ''
  }
) {
  const fontPaths = []
  const keyStartX = const_mapping.startX + const_mapping.keySize * col + const_mapping.keySize / 2 * row
  const keyStartY = const_mapping.startY + const_mapping.keySize * row

  const alphabetStartX = keyStartX + const_mapping.alphabetStartX
  const alphabetStartY = keyStartY + const_mapping.alphabetStartY
  fontPaths.push(
    ...font.getPaths(
      font.EN_BOLD,
      alphabet,
      alphabetStartX, alphabetStartY, const_mapping.alphabetFontSize, {
        fill: const_mapping.alphabetColor
      }
    )
  )

  if (content.sheng) {
    const width = font.getAdvanceWidth(
      font.EN_BOLD,
      content.sheng,
      const_mapping.shengFontSize,
    )
    const shengStartX = keyStartX + const_mapping.keySize - const_mapping.shengEndX - width
    const shengStartY = keyStartY + const_mapping.shengStartY
    fontPaths.push(
      ...font.getPaths(
        font.EN_BOLD,
        content.sheng,
        shengStartX, shengStartY, const_mapping.shengFontSize, {
          colorFormat: 'hex',
          fill: const_mapping.shengColor
        }
      )
    )
  }

  if (content.yun1) {
    const width = font.getAdvanceWidth(
      font.EN,
      content.yun1,
      const_mapping.yunFontSize,
    )
    const yun1StartX = keyStartX + const_mapping.keySize - const_mapping.yun1EndX - width
    const yun1StartY = keyStartY + const_mapping.yun1StartY
    fontPaths.push(
      ...font.getPaths(
        font.EN,
        content.yun1,
        yun1StartX, yun1StartY, const_mapping.yunFontSize, {
          colorFormat: 'hex',
          fill: const_mapping.yunColor
        }
      )
    )
  }

  if (content.yun2) {
    const width = font.getAdvanceWidth(
      font.EN,
      content.yun2,
      const_mapping.yunFontSize,
    )
    const yun2StartX = keyStartX + const_mapping.keySize - const_mapping.yun2EndX - width
    const yun2StartY = keyStartY + const_mapping.yun2StartY
    fontPaths.push(
      ...font.getPaths(
        font.EN,
        content.yun2,
        yun2StartX, yun2StartY, const_mapping.yunFontSize, {
          colorFormat: 'hex',
          fill: const_mapping.yunColor
        }
      )
    )
  }

  return fontPaths.map(fontPath => fontPath.toSVG())
}

function main() {
  const ziranma = require('./scheme/ziranma')

  const output = svg.Svg(
    const_mapping.width, const_mapping.height,
    [
      ...drawBorders(),
      ...ziranma.row1.map((key, i) => drawKey(0, i, key.alphabet, key)).flat(1),
      ...ziranma.row2.map((key, i) => drawKey(1, i, key.alphabet, key)).flat(1),
      ...ziranma.row3.map((key, i) => drawKey(2, i, key.alphabet, key)).flat(1),
    ], {
      style: { width: const_mapping.width, height: const_mapping.height }
    }
  )
  console.log(output)
}
main()