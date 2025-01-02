const svg = require('./svg')
const const_mapping = require('./const')

function Border(startX = 0, startY = 0, length = 0, direction = 'horizontal') {
  if (direction === 'horizontal') {
    return svg.Rect(
      length, const_mapping.keyBorderStrokeWidth,
      startX, startY, {
        fill: const_mapping.keyBorderStroke
      }
    )
    // Line + Stroke 有子像素问题
    // return svg.Line(
    //   startX, startY,
    //   startX + length, startY,
    //   {
    //     stroke: const_mapping.keyBorderStroke,
    //     strokeWidth: const_mapping.keyBorderStrokeWidth,
    //   }
    // )
  } else if (direction === 'vertical') {
    return svg.Rect(
      const_mapping.keyBorderStrokeWidth, length,
      startX, startY, {
        fill: const_mapping.keyBorderStroke
      }
    )
    // Line + Stroke 有子像素问题
    // return svg.Line(
    //   startX, startY,
    //   startX, startY + length,
    //   {
    //     stroke: const_mapping.keyBorderStroke,
    //     strokeWidth: const_mapping.keyBorderStrokeWidth,
    //   }
    // )
  }
}

function BorderH(startX = 0, startY = 0, length = 0) {
  return Border(startX, startY, length, 'horizontal')
}

function BorderV(startX = 0, startY = 0, length = 0) {
  return Border(startX, startY, length, 'vertical')
}

module.exports = {
  Border, BorderH, BorderV
}