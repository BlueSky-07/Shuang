const { pick, defaults } = require('lodash')
const { compileTag } = require('./utils')

function Rect(
  width = 100, height = 100, x = 0, y = 0,
  attributes = {
    // rx: 0, ry: 0,
    // fill: '', stroke: '', strokeWidth: 0
  }
) {
  // return compileTag(
  //   'rect',
  //   { width, height, x, y, ...pick(attributes, ['rx', 'ry', 'fill', 'stroke', 'strokeWidth']) },
  // )

  /** source: https://github.com/HarryStevens/shape2path/blob/master/src/rect2path.js */
  let d = ''
  if (attributes.rx || attributes.ry) {
    let rx = attributes.rx || 0
    let ry = attributes.ry || 0
    if (rx * 2 > width) rx = rx - (rx * 2 - width) / 2
    if (ry * 2 > height) ry = ry - (ry * 2 - height) / 2

    d = `M${x + rx},${y} h${width - rx * 2} s${rx},0 ${rx},${ry} v${height - ry * 2} s0,${ry} ${-rx},${ry} h${-width + rx * 2} s${-rx},0 ${-rx},${-ry} v${-height + ry * 2} s0,${-ry} ${rx},${-ry}`
  } else {
    d = `M${x},${y} h${width} v${height} H${x} Z`
  }

  return compileTag(
    'path',
    { d, ...pick(attributes, ['fill', 'stroke', 'strokeWidth']) },
  )
}

function Line(
  x1 = 0, y1 = 0, x2 = 0, y2 = 0,
  attributes = {
    // stroke: '', strokeWidth: 0, strokeDasharray: ''
  }
) {
  // return compileTag(
  //   'line',
  //   { x1, y1, x2, y2, ...pick(attributes, ['stroke', 'strokeWidth', 'strokeDasharray']) },
  // )

  /** source: https://github.com/HarryStevens/shape2path/blob/master/src/line2path.js */
  const d = `M${x1},${y1} L${x2},${y2}`
  return compileTag(
    'path',
    { d, ...pick(attributes, ['stroke', 'strokeWidth']) },
  )
}

function Svg(
  width = 100, height = 100,
  elements = [],
  options = {
    // dataName: '键位图',
    // minX: 0, minY: 0,
    // style: {}
  }
) {
  const {
    dataName, minX, minY, style,
  } = defaults(options, {
    dataName: '键位图', minX: 0, minY: 0, style: {}
  })
  return compileTag(
    'svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      '!xmlns:xlink': 'http://www.w3.org/1999/xlink',
      dataName,
      '!viewBox': `${minX} ${minY} ${width} ${height}`,
      // shapeRendering: 'crispEdges', // 在缩放场景下会有边不可见
    },
    style,
    elements.map(element => '  ' + element).join('\n')
  )
}

function Border(startX = 0, startY = 0, length = 0, strokeWidth = 0, stroke = '', direction = 'horizontal') {
  if (direction === 'horizontal') {
    return Rect(
      length, strokeWidth,
      startX, startY, {
        fill: stroke
      }
    )
    // stroke-width 有子像素问题
    // return Line(
    //   startX, startY,
    //   startX + length, startY,
    //   {
    //     stroke: stroke,
    //     strokeWidth: strokeWidth,
    //   }
    // )
  } else if (direction === 'vertical') {
    return Rect(
      strokeWidth, length,
      startX, startY, {
        fill: stroke
      }
    )
    // stroke-width 有子像素问题
    // return Line(
    //   startX, startY,
    //   startX, startY + length,
    //   {
    //     stroke: stroke,
    //     strokeWidth: strokeWidth,
    //   }
    // )
  }
}

function BorderH(startX = 0, startY = 0, length = 0, strokeWidth = 0, stroke = '') {
  return Border(startX, startY, length, strokeWidth, stroke, 'horizontal')
}

function BorderV(startX = 0, startY = 0, length = 0, strokeWidth = 0, stroke = '') {
  return Border(startX, startY, length, strokeWidth, stroke, 'vertical')
}

module.exports = {
  Rect,
  Line,
  Svg,
  Border,
  BorderH,
  BorderV,
}