/** last changed: 2024.12.29 */

Shuang.core.keyboardLayout = class KeyboardLayout {
  static instance
  static canvas
  static context
  static IMAGE_WIDTH = 1936
  static IMAGE_HEIGHT = 828
  static CANVAS_ID ='keyboard-layout-canvas'
  static CANVAS_WIDTH = 1936
  static CANVAS_HEIGHT = 828
  static CANVAS_FILL_STYLE = '#ffffff'
  static KEYBOARD_AREA_HEIGHT = 600
  static NAME_AREA_START_X = 1600
  static NAME_AREA_START_Y = 450
  static NAME_AREA_WIDTH = 400
  static NAME_AREA_HEIGHT = 250
  static KEY_SIZE = 178
  static KEY_BODY_START_X = 35
  static KEY_BODY_START_Y = 32
  static KEY_BODY_WIDTH = 172
  static KEY_BODY_HEIGHT = 172
  static KEY_BORDER_START_X = 32
  static KEY_BORDER_START_Y = 29
  static KEY_BORDER_WIDTH = 178
  static KEY_BORDER_HEIGHT = 177
  static KEY_BORDER_STROKE_WIDTH = 3
  static KEY_BORDER_STROKE_STYLE = '#000000'
  static KEY_UNDERSCORE_START_X = 24
  static KEY_UNDERSCORE_START_Y = 52
  static KEY_UNDERSCORE_WIDTH = 36
  static KEY_UNDERSCORE_HEIGHT = 6
  static KEY_UNDERSCORE_FILL_STYLE = '#000000'

  static initCanvas(width = KeyboardLayout.CANVAS_WIDTH, height = KeyboardLayout.CANVAS_HEIGHT) {
    if (!KeyboardLayout.canvas) {
      KeyboardLayout.canvas = document.createElement('canvas')
      KeyboardLayout.canvas.setAttribute('id', KeyboardLayout.CANVAS_ID)
    }
    KeyboardLayout.canvas.setAttribute('width', width)
    KeyboardLayout.canvas.setAttribute('height', height)
    KeyboardLayout.context = KeyboardLayout.canvas.getContext('2d', { alpha: false })
  }

  static show() {
    if (!document.getElementById(KeyboardLayout.CANVAS_ID)) {
      document.body.appendChild(KeyboardLayout.canvas)
    }
  }

  static getUrl(callback = (url = '') => {}) {
    if (KeyboardLayout.canvas.toBlob) {
      KeyboardLayout.canvas.toBlob((blob) => {
        callback(URL.createObjectURL(blob))
      })
    } else {
      callback(KeyboardLayout.canvas.toDataURL())
    }
  }

  static init(imgSrc = '', keyboardLayout = {}, callback = (url = '') => {}) {
    KeyboardLayout.instance = new KeyboardLayout(imgSrc, keyboardLayout, callback)
  }

  constructor(imgSrc = '', keyboardLayout = {}, callback = (url = '') => {}) {
    this.keyboardLayout = keyboardLayout
    this.computeKeyboardStyle()
    KeyboardLayout.initCanvas(KeyboardLayout.CANVAS_WIDTH, KeyboardLayout.CANVAS_HEIGHT)
    KeyboardLayout.context.fillStyle = KeyboardLayout.CANVAS_FILL_STYLE
    KeyboardLayout.context.fillRect(0, 0, KeyboardLayout.CANVAS_WIDTH, KeyboardLayout.CANVAS_HEIGHT)
    this.loadImage(imgSrc, () => {
      this.onImageLoad()
      KeyboardLayout.getUrl(callback)
    })
  }

  computeKeyboardStyle() {
    const fixKeyStart = this.keyboardLayout.row3.length > 8
    const fixUnderscore = this.keyboardLayout.row2[3] !== 'f' || this.keyboardLayout.row2[6] !== 'j'
    const fixName = this.keyboardLayout.row3.length > 7

    this.keyboardStyle = {
      fixKeyStart,
      fixUnderscore,
      fixName,
    }
  }

  loadImage(imgSrc = '', onload = () => {}) {
    this.img = new Image(KeyboardLayout.IMAGE_WIDTH, KeyboardLayout.IMAGE_HEIGHT)
    this.img.setAttribute('crossOrigin', 'Anonymous')
    this.img.setAttribute('src', imgSrc)
    this.img.onload = onload
  }

  onImageLoad() {
    // KeyboardLayout.context.drawImage(this.img, 0, 0)
    this.drawRow(0, this.keyboardLayout.row1)
    this.drawRow(1, this.keyboardLayout.row2)
    this.drawRow(2, this.keyboardLayout.row3)
    this.drawTable()
    this.drawName()
  }

  drawRow(targetRow = 0, keyboardLayoutRow = []) {
    for (let targetCol = 0; targetCol < keyboardLayoutRow.length; targetCol ++) {
      const key = keyboardLayoutRow[targetCol]
      if (!key) continue
      const sourceRow0Col = 'qwertyuiop'.split('').findIndex(c => c === key)
      if (sourceRow0Col !== -1) {
        this.drawKey(key, 0, sourceRow0Col, targetRow, targetCol)
        continue
      }
      const sourceRow1Col = 'asdfghjkl;'.split('').findIndex(c => c === key)
      if (sourceRow1Col !== -1) {
        this.drawKey(key, 1, sourceRow1Col, targetRow, targetCol)
        continue
      }
      const sourceRow2Col = 'zxcvbnm'.split('').findIndex(c => c === key)
      if (sourceRow2Col !== -1) {
        this.drawKey(key, 2, sourceRow2Col, targetRow, targetCol)
        continue
      }
    }
  }

  drawKey(key = '', sourceRow = 0, sourceCol = 0, targetRow = 0, targetCol = 0) {
    const sourceBodyStartX = KeyboardLayout.KEY_BODY_START_X + KeyboardLayout.KEY_SIZE / 2 * sourceRow + KeyboardLayout.KEY_SIZE * sourceCol
    const sourceBodyStartY = KeyboardLayout.KEY_BODY_START_Y + KeyboardLayout.KEY_SIZE * sourceRow
    const targetBodyStartX = KeyboardLayout.KEY_BODY_START_X + KeyboardLayout.KEY_SIZE / 2 * targetRow + KeyboardLayout.KEY_SIZE * targetCol + (this.keyboardStyle.fixKeyStart ? -KeyboardLayout.KEY_SIZE / 2 : 0)
    const targetBodyStartY = KeyboardLayout.KEY_BODY_START_Y + KeyboardLayout.KEY_SIZE * targetRow
    const targetBorderStartX = KeyboardLayout.KEY_BORDER_START_X + KeyboardLayout.KEY_SIZE / 2 * targetRow + KeyboardLayout.KEY_SIZE * targetCol + (this.keyboardStyle.fixKeyStart ? -KeyboardLayout.KEY_SIZE / 2 : 0)
    const targetBorderStartY = KeyboardLayout.KEY_BORDER_START_Y + KeyboardLayout.KEY_SIZE * targetRow

    KeyboardLayout.context.fillStyle = KeyboardLayout.CANVAS_FILL_STYLE
    KeyboardLayout.context.fillRect(targetBodyStartX, targetBodyStartY, KeyboardLayout.KEY_BODY_WIDTH, KeyboardLayout.KEY_BODY_HEIGHT)

    KeyboardLayout.context.drawImage(this.img,
      sourceBodyStartX, sourceBodyStartY, KeyboardLayout.KEY_BODY_WIDTH, KeyboardLayout.KEY_BODY_HEIGHT,
      targetBodyStartX, targetBodyStartY, KeyboardLayout.KEY_BODY_WIDTH, KeyboardLayout.KEY_BODY_HEIGHT
    )

    KeyboardLayout.context.lineWidth = KeyboardLayout.KEY_BORDER_STROKE_WIDTH
    KeyboardLayout.context.strokeStyle = KeyboardLayout.KEY_BORDER_STROKE_STYLE
    KeyboardLayout.context.strokeRect(targetBorderStartX, targetBorderStartY, KeyboardLayout.KEY_BORDER_WIDTH, KeyboardLayout.KEY_BORDER_HEIGHT)
    // debug
    // KeyboardLayout.context.fillStyle = 'rgba(0, 0, 123, 0.3)'
    // KeyboardLayout.context.fillRect(targetBodyStartX, targetBodyStartY, KeyboardLayout.KEY_BODY_WIDTH, KeyboardLayout.KEY_BODY_HEIGHT)


    if (this.keyboardStyle.fixUnderscore) {
      if ('fj'.split('').includes(key)) {
        this.drawUnderscore(targetRow, targetCol, KeyboardLayout.CANVAS_FILL_STYLE)
      }
      if (targetRow === 1 && [3, 6].includes(targetCol)) {
        this.drawUnderscore(targetRow, targetCol, KeyboardLayout.KEY_UNDERSCORE_FILL_STYLE, key === 't' ? -3 : 0)
      }
    }
  }

  drawUnderscore(targetRow = 0, targetCol = 0, fillStyle = '', widthDiff = 0) {
    const underscoreStartX = KeyboardLayout.KEY_BODY_START_X + KeyboardLayout.KEY_SIZE / 2 * targetRow + KeyboardLayout.KEY_SIZE * targetCol + KeyboardLayout.KEY_UNDERSCORE_START_X + (this.keyboardStyle.fixKeyStart ? -KeyboardLayout.KEY_SIZE / 2 : 0)
    const underscoreStartY = KeyboardLayout.KEY_BODY_START_Y + KeyboardLayout.KEY_SIZE * targetRow + KeyboardLayout.KEY_UNDERSCORE_START_Y

    KeyboardLayout.context.fillStyle = fillStyle
    KeyboardLayout.context.fillRect(
      underscoreStartX,
      underscoreStartY,
      KeyboardLayout.KEY_UNDERSCORE_WIDTH + widthDiff,
      KeyboardLayout.KEY_UNDERSCORE_HEIGHT
    )
  }

  drawTable() {
    KeyboardLayout.context.drawImage(this.img,
      0, KeyboardLayout.KEYBOARD_AREA_HEIGHT, KeyboardLayout.IMAGE_WIDTH, KeyboardLayout.IMAGE_HEIGHT - KeyboardLayout.KEYBOARD_AREA_HEIGHT,
      0, KeyboardLayout.KEYBOARD_AREA_HEIGHT, KeyboardLayout.IMAGE_WIDTH, KeyboardLayout.IMAGE_HEIGHT - KeyboardLayout.KEYBOARD_AREA_HEIGHT
    )
  }

  drawName() {
    const targetY = this.keyboardStyle.fixName ? KeyboardLayout.KEYBOARD_AREA_HEIGHT : KeyboardLayout.NAME_AREA_START_Y
    KeyboardLayout.context.drawImage(this.img,
      KeyboardLayout.NAME_AREA_START_X, KeyboardLayout.NAME_AREA_START_Y, KeyboardLayout.NAME_AREA_WIDTH, KeyboardLayout.NAME_AREA_HEIGHT,
      KeyboardLayout.NAME_AREA_START_X, targetY, KeyboardLayout.NAME_AREA_WIDTH, KeyboardLayout.NAME_AREA_HEIGHT
    )
  }
}