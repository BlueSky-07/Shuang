const { pick, defaults } = require('lodash')
const { compileTag } = require('./utils')

function Rect(
  width = 100, height = 100, x = 0, y = 0,
  attributes = {
    // rx: 0, ry: 0,
    // fill: '', stroke: '', strokeWidth: 0
  }
) {
  return compileTag(
    'rect',
    { width, height, x, y, ...pick(attributes, ['rx', 'ry', 'fill', 'stroke', 'strokeWidth']) },
  )
}

function Line(
  x1 = 0, y1 = 0, x2 = 0, y2 = 0,
  attributes = {
    // stroke: '', strokeWidth: 0, strokeDasharray: ''
  }
) {
  return compileTag(
    'line',
    { x1, y1, x2, y2, ...pick(attributes, ['stroke', 'strokeWidth', 'strokeDasharray']) },
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
      shapeRendering: 'crispEdges',
    },
    style,
    elements.map(element => '  ' + element).join('\n')
  )
}

module.exports = {
  Rect,
  Line,
  Svg,
}