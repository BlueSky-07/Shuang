const font = require('./font')
const svg = require('./svg')

function drawKeysBorders(const_mapping = {}, scheme = {
  row1: [], row2: [], row3: [],
}) {
  const borders = [
    svg.BorderH(
      const_mapping.startX,
      const_mapping.startY,
      const_mapping.keyBorderWidth * scheme.row1.length,
      const_mapping.keyBorderStrokeWidth,
      const_mapping.keyBorderStroke,
    ),
    svg.BorderH(
      const_mapping.startX,
      const_mapping.startY + const_mapping.keyBorderHeight,
      const_mapping.keyBorderWidth * Math.max(scheme.row1.length, scheme.row2.length) + const_mapping.keyBorderWidth / 2,
      const_mapping.keyBorderStrokeWidth,
      const_mapping.keyBorderStroke,
    ),
    svg.BorderH(
      const_mapping.startX + const_mapping.keyBorderWidth / 2,
      const_mapping.startY + const_mapping.keyBorderHeight * 2,
      const_mapping.keyBorderWidth * Math.max(scheme.row2.length, scheme.row3.length),
      const_mapping.keyBorderStrokeWidth,
      const_mapping.keyBorderStroke,
    ),
    svg.BorderH(
      const_mapping.startX + const_mapping.keyBorderWidth,
      const_mapping.startY + const_mapping.keyBorderHeight * 3,
      const_mapping.keyBorderWidth * scheme.row3.length,
      const_mapping.keyBorderStrokeWidth,
      const_mapping.keyBorderStroke,
    ),
  ]
  for (let i = 0; i <= scheme.row1.length; i ++) {
    borders.push(
      svg.BorderV(
        const_mapping.startX + const_mapping.keyBorderWidth * i - const_mapping.keyBorderStrokeWidth,
        const_mapping.startY,
        const_mapping.keyBorderHeight + (i === 0 ? const_mapping.keyBorderStrokeWidth : 0),
        const_mapping.keyBorderStrokeWidth,
        const_mapping.keyBorderStroke,
      )
    )
  }
  for (let i = 0; i <= scheme.row2.length; i ++) {
    borders.push(
      svg.BorderV(
        const_mapping.startX + const_mapping.keyBorderWidth * i + const_mapping.keyBorderWidth / 2 - const_mapping.keyBorderStrokeWidth,
        const_mapping.startY + const_mapping.keyBorderHeight,
        const_mapping.keyBorderHeight + (i === 0 ? const_mapping.keyBorderStrokeWidth : 0),
        const_mapping.keyBorderStrokeWidth,
        const_mapping.keyBorderStroke,
      )
    )
  }
  for (let i = 0; i <= scheme.row3.length; i ++) {
    borders.push(
      svg.BorderV(
        const_mapping.startX + const_mapping.keyBorderWidth * (i + 1) - const_mapping.keyBorderStrokeWidth,
        const_mapping.startY + const_mapping.keyBorderHeight * 2,
        const_mapping.keyBorderHeight + (i === 0 ? const_mapping.keyBorderStrokeWidth : 0),
        const_mapping.keyBorderStrokeWidth,
        const_mapping.keyBorderStroke,
      )
    )
  }
  return borders
}

function drawKeys(const_mapping = {}, scheme = {
  row1: [], row2: [], row3: []
}) {
  return [
    ...scheme.row1.map((key, i) => drawKey(const_mapping, 0, i, key.alphabet, key)).flat(1),
    ...scheme.row2.map((key, i) => drawKey(const_mapping, 1, i, key.alphabet, key)).flat(1),
    ...scheme.row3.map((key, i) => drawKey(const_mapping, 2, i, key.alphabet, key)).flat(1),
  ]
}

function drawKey(
  const_mapping = {},
  row = 0, col = 0, alphabet = '',
  content = {
    sheng: '', yun1: '', yun2: '', bihua: ''
  }
) {
  const underscores = []
  const fontPaths = []
  const keyStartX = const_mapping.startX + const_mapping.keySize * col + const_mapping.keySize / 2 * row
  const keyStartY = const_mapping.startY + const_mapping.keySize * row

  const alphabetStartX = keyStartX + const_mapping.alphabetStartX
  const alphabetStartY = keyStartY + const_mapping.alphabetStartY
  fontPaths.push(
    ...font.getPaths(
      font.getFont(const_mapping.alphabetFontName),
      alphabet,
      alphabetStartX, alphabetStartY, const_mapping.alphabetFontSize, {
        fill: const_mapping.alphabetColor,
      }
    )
  )

  if (row === 1 && [3, 6].includes(col)) {
    const alphabetWidth = font.getAdvanceWidth(
      font.getFont(const_mapping.alphabetFontName),
      alphabet,
      const_mapping.alphabetFontSize,
    )
    underscores.push(
      svg.BorderH(
        alphabetStartX,
        alphabetStartY + const_mapping.alphabetUnderscoreStartY,
        alphabetWidth,
        const_mapping.alphabetUnderscoreStrokeWidth,
        const_mapping.alphabetUnderscoreStroke,
      )
    )
  }

  if (content.sheng) {
    const width = font.getAdvanceWidth(
      font.getFont(const_mapping.shengFontName),
      content.sheng,
      const_mapping.shengFontSize,
    )
    const shengStartX = keyStartX + const_mapping.keySize - const_mapping.shengEndX - width
    const shengStartY = keyStartY + const_mapping.shengStartY
    fontPaths.push(
      ...font.getPaths(
        font.getFont(const_mapping.shengFontName),
        content.sheng,
        shengStartX, shengStartY, const_mapping.shengFontSize, {
          fill: const_mapping.shengColor,
        }
      )
    )
  }

  if (content.yun1) {
    const width = font.getAdvanceWidth(
      font.getFont(const_mapping.yun1FontName),
      content.yun1,
      const_mapping.yunFontSize,
    )
    const yun1StartX = keyStartX + const_mapping.keySize - const_mapping.yun1EndX - width
    const yun1StartY = keyStartY + const_mapping.yun1StartY
    fontPaths.push(
      ...font.getPaths(
        font.getFont(const_mapping.yun1FontName),
        content.yun1,
        yun1StartX, yun1StartY, const_mapping.yunFontSize, {
          fill: const_mapping.yunColor,
        }
      )
    )
  }

  if (content.yun2) {
    const width = font.getAdvanceWidth(
      font.getFont(const_mapping.yun2FontName),
      content.yun2,
      const_mapping.yunFontSize,
    )
    const yun2StartX = keyStartX + const_mapping.keySize - const_mapping.yun2EndX - width
    const yun2StartY = keyStartY + const_mapping.yun2StartY
    fontPaths.push(
      ...font.getPaths(
        font.getFont(const_mapping.yun2FontName),
        content.yun2,
        yun2StartX, yun2StartY, const_mapping.yunFontSize, {
          fill: const_mapping.yunColor
        }
      )
    )
  }

  if (content.bihua) {
    const width = font.getAdvanceWidth(
      font.getFont(const_mapping.bihuaFontName),
      content.bihua,
      const_mapping.bihuaFontSize,
    )
    const bihuaStartX = keyStartX + const_mapping.keySize - const_mapping.bihuaEndX - width
    const bihuaStartY = keyStartY + const_mapping.bihuaStartY
    fontPaths.push(
      ...font.getPaths(
        font.getFont(const_mapping.bihuaFontName),
        content.bihua,
        bihuaStartX, bihuaStartY, const_mapping.bihuaFontSize, {
          fill: const_mapping.bihuaColor,
          strokeWidth: const_mapping.bihuaStrokeWidth, // 模拟 Bold
          stroke: const_mapping.bihuaStroke, // 模拟 Bold
        }
      )
    )
  }

  return [
    ...fontPaths.map(fontPath => fontPath.toSVG()),
    ...underscores,
  ]
}

function drawTableBorders(const_mapping = {}, scheme = {
  table1: [], table2: [], table3: [],
}) {
  const borders = [
    svg.BorderH(
      const_mapping.tableStartX,
      const_mapping.tableStartY,
      const_mapping.tableCellWidth * scheme.table1.length,
      const_mapping.tableBorderStrokeWidth,
      const_mapping.tableBorderStroke,
    ),
    svg.BorderH(
      const_mapping.tableStartX,
      const_mapping.tableStartY + const_mapping.tableCellHeight,
      const_mapping.tableCellWidth * Math.max(scheme.table1.length, scheme.table2.length),
      const_mapping.tableBorderStrokeWidth,
      const_mapping.tableBorderStroke,
    ),
    svg.BorderH(
      const_mapping.tableStartX,
      const_mapping.tableStartY + const_mapping.tableCellHeight * 2,
      const_mapping.tableCellWidth * Math.max(scheme.table2.length, scheme.table3.length),
      const_mapping.tableBorderStrokeWidth,
      const_mapping.tableBorderStroke,
    ),
    svg.BorderH(
      const_mapping.tableStartX,
      const_mapping.tableStartY + const_mapping.tableCellHeight * 3,
      const_mapping.tableCellWidth * scheme.table3.length,
      const_mapping.tableBorderStrokeWidth,
      const_mapping.tableBorderStroke,
    ),
  ]
  for (let i = 0; i <= scheme.table1.length; i ++) {
    borders.push(
      svg.BorderV(
        const_mapping.tableStartX + const_mapping.tableCellWidth * i - const_mapping.tableBorderStrokeWidth,
        const_mapping.tableStartY,
        const_mapping.tableCellHeight + (i === 0 ? const_mapping.tableBorderStrokeWidth : 0),
        const_mapping.tableBorderStrokeWidth,
        const_mapping.tableBorderStroke,
      )
    )
  }
  for (let i = 0; i <= scheme.table2.length; i ++) {
    borders.push(
      svg.BorderV(
        const_mapping.tableStartX + const_mapping.tableCellWidth * i - const_mapping.tableBorderStrokeWidth,
        const_mapping.tableStartY + const_mapping.tableCellHeight,
        const_mapping.tableCellHeight + (i === 0 ? const_mapping.tableBorderStrokeWidth : 0),
        const_mapping.tableBorderStrokeWidth,
        const_mapping.tableBorderStroke,
      )
    )
  }
  for (let i = 0; i <= scheme.table3.length; i ++) {
    borders.push(
      svg.BorderV(
        const_mapping.tableStartX + const_mapping.tableCellWidth * i - const_mapping.tableBorderStrokeWidth,
        const_mapping.tableStartY + const_mapping.tableCellHeight * 2,
        const_mapping.tableCellHeight + (i === 0 ? const_mapping.tableBorderStrokeWidth : 0),
        const_mapping.tableBorderStrokeWidth,
        const_mapping.tableBorderStroke,
      )
    )
  }
  return borders
}

function drawTableCells(const_mapping = {}, scheme = {
  table1: [], table2: [], table3: [],
}) {
  return [
    ...scheme.table1.map((cell, i) => drawTableCell(const_mapping, 0, i, cell)).flat(1),
    ...scheme.table2.map((cell, i) => drawTableCell(const_mapping, 1, i, cell)).flat(1),
    ...scheme.table3.map((cell, i) => drawTableCell(const_mapping, 2, i, cell)).flat(1),
  ]
}

function drawTableCell(
  const_mapping = {},
  row = 0, col = 0,
  content = {
    yun: '', bianma: '', pinyin: '',
  }
) {
  const fontPaths = []
  const cellStartX = const_mapping.tableStartX + const_mapping.tableCellWidth * col
  const cellStartY = const_mapping.tableStartY + const_mapping.tableCellHeight * row

  if (content.yun) {
    const yunWidth = font.getAdvanceWidth(
      font.getFont(const_mapping.tableCellYunFontName),
      content.yun,
      const_mapping.tableCellYunFontSize,
    )
    const yunStartX = cellStartX + const_mapping.tableCellWidth - const_mapping.tableCellYunEndX - yunWidth
    const yunStartY = cellStartY + const_mapping.tableCellYunStartY
    fontPaths.push(
      ...font.getPaths(
        font.getFont(const_mapping.tableCellYunFontName),
        content.yun,
        yunStartX, yunStartY, const_mapping.tableCellYunFontSize, {
          fill: const_mapping.tableCellYunColor,
        }
      )
    )
  }

  if (content.bianma) {
    const bianmaStartX = cellStartX + const_mapping.tableCellBianmaStartX
    const bianmaStartY = cellStartY + const_mapping.tableCellBianmaStartY
    fontPaths.push(
      ...font.getPaths(
        font.getFont(const_mapping.tableCellBianmaFontName),
        content.bianma,
        bianmaStartX, bianmaStartY, const_mapping.tableCellBianmaFontSize, {
          fill: const_mapping.tableCellBianmaColor,
        }
      )
    )
  }

  if (content.pinyin) {
    const pinyinWidth = font.getAdvanceWidth(
      font.getFont(const_mapping.tableCellPinyinFontName),
      content.pinyin,
      const_mapping.tableCellPinyinFontSize,
    )
    const pinyinStartX = cellStartX + const_mapping.tableCellWidth - const_mapping.tableCellPinyinEndX - pinyinWidth
    const pinyinStartY = cellStartY + const_mapping.tableCellPinyinStartY
    fontPaths.push(
      ...font.getPaths(
        font.getFont(const_mapping.tableCellPinyinFontName),
        content.pinyin,
        pinyinStartX, pinyinStartY, const_mapping.tableCellPinyinFontSize, {
          fill: const_mapping.tableCellPinyinColor,
        }
      )
    )
  }

  return fontPaths.map(fontPath => fontPath.toSVG())
}

function drawTableName(const_mapping = {}, scheme = {
  tableName: '',
}) {
  const fontPaths = []
  if (scheme.tableName) {
    const tableNameStartX = const_mapping.tableStartX + const_mapping.tableNameStartX
    const tableNameStartY = const_mapping.tableStartY + const_mapping.tableNameStartY
    fontPaths.push(
      ...font.getPaths(
        font.getFont(const_mapping.tableNameFontName),
        scheme.tableName,
        tableNameStartX, tableNameStartY, const_mapping.tableNameFontSize, {
          fill: const_mapping.tableNameColor,
          strokeWidth: const_mapping.tableNameStrokeWidth, // 模拟 Bold
          stroke: const_mapping.tableNameStroke, // 模拟 Bold
        }
      )
    )
  }
  return fontPaths.map(fontPath => fontPath.toSVG())
}

function drawName(const_mapping = {}, scheme = {
  name1: '', name2: '', name3: '',
}) {
  const fontPaths = []
  if (scheme.name1) {
    const name1StartX = const_mapping.name1StartX
    const name1StartY = const_mapping.name1StartY
    fontPaths.push(
      ...font.getPaths(
        font.getFont(const_mapping.name1FontName),
        scheme.name1,
        name1StartX, name1StartY, const_mapping.name1FontSize, {
          fill: const_mapping.name1Color,
          strokeWidth: const_mapping.name1StrokeWidth, // 模拟 Bold
          stroke: const_mapping.name1Stroke, // 模拟 Bold
        }
      )
    )
  }
  if (scheme.name2) {
    const name2StartX = const_mapping.name2StartX
    const name2StartY = const_mapping.name2StartY
    fontPaths.push(
      ...font.getPaths(
        font.getFont(const_mapping.name2FontName),
        scheme.name2,
        name2StartX, name2StartY, const_mapping.name2FontSize, {
          fill: const_mapping.name2Color,
          strokeWidth: const_mapping.name2StrokeWidth, // 模拟 Bold
          stroke: const_mapping.name2Stroke, // 模拟 Bold
        }
      )
    )
  }
  if (scheme.name3) {
    const name3StartX = const_mapping.name3StartX
    const name3StartY = const_mapping.name3StartY
    fontPaths.push(
      ...font.getPaths(
        font.getFont(const_mapping.name3FontName),
        scheme.name3,
        name3StartX, name3StartY, const_mapping.name3FontSize, {
          fill: const_mapping.name3Color,
          strokeWidth: const_mapping.name3StrokeWidth, // 模拟 Bold
          stroke: const_mapping.name3Stroke, // 模拟 Bold
        }
      )
    )
  }
  return fontPaths.map(fontPath => fontPath.toSVG())
}

function renderToSvg(
  const_mapping = {}, scheme = {
    name1: '', name2: '',
    tableName: '',
    row1: [], row2: [], row3: [],
    table1: [], table2: [], table3: [],
    const: {},
  },
) {
  return svg.Svg(
    const_mapping.width, const_mapping.height,
    [
      ...drawKeysBorders(const_mapping, scheme),
      ...drawKeys(const_mapping, scheme),
      ...drawTableBorders(const_mapping, scheme),
      ...drawTableCells(const_mapping, scheme),
      ...drawTableName(const_mapping, scheme),
      ...drawName(const_mapping, scheme),
    ], {
      style: {
        // width: const_mapping.width + 'px',
        // height: const_mapping.height + 'px',
        background: const_mapping.background,
      }
    }
  )
}

module.exports = {
  drawKeysBorders,
  drawKeys,
  drawKey,
  drawTableBorders,
  drawTableCells,
  drawTableCell,
  drawTableName,
  drawName,
  renderToSvg,
}