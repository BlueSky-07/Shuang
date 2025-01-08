const { pickBy, kebabCase } = require('lodash')

function compileStyle(object = {}) {
  const styles = []
  for (const [key, value] of Object.entries(pickBy(object, x => x !== ''))) {
    styles.push(`${formatKey(key)}:${value}`)
  }
  return styles.join(';')
}

function compileAttributes(object = {}) {
  const attributes = []
  for (const [key, value] of Object.entries(pickBy(object, x => x !== ''))) {
    attributes.push(`${formatKey(key)}="${value.toString().replace(/"/g, '\"')}"`)
  }
  return attributes.join(' ')
}

function compileTag(tagName = '', attributes = {}, styles = {}, children = '') {
  if (!tagName) return ''
  const styleStrings = compileStyle(styles)
  const attributeText= compileAttributes({
    ...attributes, style: styleStrings
  })
  if (!children) return `<${tagName}${padSpace(attributeText)} />`
  return `<${tagName}${padSpace(attributeText)}>\n${children}\n</${tagName}>`
}

function formatKey(key = '') {
  if (key.startsWith('!')) return key.slice(1)
  return kebabCase(key).replace(/-([\d])/g, (_, $1) => $1)
}

function padSpace(text = '') {
  return text ? ' ' + text : text
}

module.exports = {
  compileStyle,
  compileAttributes,
  compileTag,
  padSpace,
  formatKey
}