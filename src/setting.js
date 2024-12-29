/** last changed: 2024.12.30 */

Shuang.app.setting = {
  config: {},
  reload() {
    /** Reading Storage or Using Default **/
    this.config = {
      scheme: readStorage('scheme') || 'ziranma',
      mode: readStorage('mode') || 'all-random',
      keyboardLayout: readStorage('keyboardLayout') || 'qwerty',
      showPic: readStorage('showPic') || 'true',
      darkMode: readStorage('darkMode') || detectDarkMode().toString(),
      autoNext: readStorage('autoNext') || 'true',
      autoClear: readStorage('autoClear') || 'true',
      showKeys: readStorage("showKeys") || "true",
      showPressedKey: readStorage("showPressedKey") || "true",
      disableMobileKeyboard: readStorage("disableMobileKeyboard") || "false",
    }
    /** Applying Settings :: Changing UI **/
    const { scheme, mode, keyboardLayout, showPic, darkMode, autoNext, autoClear, showKeys, showPressedKey, disableMobileKeyboard } = this.config
    Array.prototype.find.call($('#scheme-select').children,
      schemeOption => Shuang.resource.schemeList[scheme].startsWith(schemeOption.innerText)
    ).selected = true
    $('#mode-select')[Object.keys(Shuang.app.modeList).indexOf(mode)].selected = true
    $('#keyboard-layout-select')[Object.keys(Shuang.resource.keyboardLayoutList).indexOf(keyboardLayout)].selected = true
    $('#pic-switcher').checked = showPic === 'true'
    $('#dark-mode-switcher').checked = darkMode === 'true'
    $('#auto-next-switcher').checked = autoNext === 'true'
    $('#auto-clear-switcher').checked = autoClear === 'true'
    $('#show-keys').checked = showKeys === 'true'
    $('#show-pressed-key').checked = showPressedKey === 'true'
    $('#disable-mobile-keyboard').checked = disableMobileKeyboard === 'true'
    /** Applying Settings :: Invoking Actions  **/
    this.setKeyboardLayout(Shuang.resource.keyboardLayoutList[keyboardLayout])
    this.setScheme(Shuang.resource.schemeList[scheme], false)
    this.setMode(Shuang.app.modeList[mode].name)
    this.setPicVisible(showPic)
    this.setDarkMode(darkMode)
    this.setAutoNext(autoNext)
    this.setAutoClear(autoClear)
    this.setShowKeys(showKeys)
    this.setShowPressedKey(showPressedKey)
    this.setDisableMobileKeyboard(disableMobileKeyboard)
  },
  setScheme(schemeName, next = true) {
    this.config.scheme = Object.keys(Shuang.resource.schemeList)[
      Object.values(Shuang.resource.schemeList)
        .findIndex(scheme => scheme.startsWith(schemeName))
    ]
    importJS('scheme/' + this.config.scheme, () => {
      if (next) Shuang.app.action.next()
      Shuang.core.current.beforeJudge()
      this.updateKeyboardLayout()
      this.updateKeysHint()
      this.updateTips()
    })
    writeStorage('scheme', this.config.scheme)
  },
  setMode(modeName) {
    Shuang.core.history = []
    for (const [mode, { name }] of Object.entries(Shuang.app.modeList)) {
      if (name === modeName) {
        this.config.mode = mode
        $('#mode-desc').innerText = Shuang.app.modeList[mode].desc
        if (mode === 'hard-random-without-pinyin') {
          $('#q').style.display = 'none'
        } else {
          $('#q').style.display = 'block'
        }
        break
      }
    }
    writeStorage('mode', this.config.mode)
  },
  setPicVisible(bool) {
    this.config.showPic = bool.toString()
    if (this.config.showPic === 'false') {
      $('#keyboard').style.display = 'none'
    } else if (this.config.showPic === 'true') {
      $('#keyboard').style.display = 'block'
    }
    writeStorage('showPic', this.config.showPic)
    this.updateKeysHintLayoutRatio()
  },
  setDarkMode(bool) {
    this.config.darkMode = bool.toString()
    if (this.config.darkMode === 'true') {
      $('body').setAttribute('class', 'dark-mode')
    } else if (this.config.darkMode === 'false') {
      $('body').setAttribute('class', '')
    }
    writeStorage('darkMode', this.config.darkMode)
  },
  setAutoNext(bool) {
    this.config.autoNext = bool.toString()
    writeStorage('autoNext', this.config.autoNext)
  },
  setAutoClear(bool) {
    this.config.autoClear = bool.toString()
    writeStorage('autoClear', this.config.autoClear)
  },
  setShowKeys(bool) {
    this.config.showKeys = bool.toString()
    writeStorage('showKeys', this.config.showKeys)
    this.updateKeysHint()
  },
  setShowPressedKey(bool) {
    this.config.showPressedKey = bool.toString()
    writeStorage('showPressedKey', this.config.showPressedKey)
  },
  setDisableMobileKeyboard(bool) {
    this.config.disableMobileKeyboard = bool.toString()
    if (this.config.disableMobileKeyboard === 'true') {
      $('#a').setAttribute('inputmode', 'none')
    } else if (this.config.disableMobileKeyboard === 'false') {
      $('#a').setAttribute('inputmode', 'text')
    }
    writeStorage('disableMobileKeyboard', this.config.disableMobileKeyboard)
  },
  updateKeysHint() {
    if (!Shuang.resource.keyboardLayout[this.config.keyboardLayout]) return
    this.updateSimulateKeyboard()
    const keys = $$('.key')
    for (const key of keys) {
      key.classList.remove('answer')
    }
    if (this.config.showKeys === 'false') return
    const answerKeys = new Set()
    for (const [sheng, yun] of Shuang.core.current.scheme) {
      answerKeys.add(sheng)
      answerKeys.add(yun)
    }
    for (const key of keys) {
      if (answerKeys.has(key.getAttribute('key').toLowerCase())) {
        key.classList.add('answer')
      }
    }
    this.updateKeysHintLayoutRatio()
  },
  updateKeysHintLayoutRatio() {
    if ($('body').scrollWidth < 700) {
      const width = $('body').scrollWidth === 310 ? 310 : $('#pic').scrollWidth
      const ratio = 1874 / 1928 * width / 680
      if (ratio < 1) {
        $('#keys').style.zoom = ratio
        return
      }
    }
    $('#keys').style.zoom = 'unset'
  },
  updatePressedKeyHint(k) {
    if (this.config.showPressedKey === 'false' || !k) return
    const keys = $$('.key')
    for (const key of keys) {
      key.classList.remove('pressed')
      if (key.getAttribute('key').toLowerCase() === k) {
        key.classList.add('pressed')
        setTimeout(() => {
          key.classList.remove('pressed')
        }, 250)
      }
    }
  },
  updateTips() {
    const tips = $('#tips')
    tips.innerHTML = ''
    const currentScheme = Shuang.resource.scheme[this.config.scheme]
    if (currentScheme.tips) {
      const tipsToView = Array.isArray(currentScheme.tips) ? currentScheme.tips : [currentScheme.tips]
      for (const tip of tipsToView) {
        const newLine = document.createElement('div')
        newLine.classList.add('line')
        newLine.innerHTML = tip
        tips.appendChild(newLine)
      }
    }
  },
  setKeyboardLayout(keyboardLayoutName) {
    this.config.keyboardLayout = Object.keys(Shuang.resource.keyboardLayoutList)[
      Object.values(Shuang.resource.keyboardLayoutList)
        .findIndex(name => keyboardLayoutName === name)
    ]
    importJS('keyboard-layout/' + this.config.keyboardLayout, () => {
      this.updateKeyboardLayout()
    })
    writeStorage('keyboardLayout', this.config.keyboardLayout)
  },
  updateKeyboardLayout() {
    if (this.config.keyboardLayout === 'qwerty') {
      $('#pic').setAttribute('src', `img/${this.config.scheme}.svg`)
      $('#keys').classList.remove('fix-left')
      this.updateSimulateKeyboard()
      this.updateKeysHint()
      return
    }
    if (!Shuang.resource.keyboardLayout[this.config.keyboardLayout]) return
    Shuang.core.keyboardLayout.init(
      `img/${this.config.scheme}.png`, // svg 在 IE 浏览器下有 Security Error
      Shuang.resource.keyboardLayout[this.config.keyboardLayout],
      (url) => {
        const imgSrc = $('#pic').getAttribute('src')
        if (imgSrc && imgSrc.startsWith('blob:')) {
          URL.revokeObjectURL(imgSrc)
        }
        if (Shuang.core.keyboardLayout.instance.keyboardStyle.fixKeyStart) {
          $('#keys').classList.add('fix-left')
        } else {
          $('#keys').classList.remove('fix-left')
        }
        $('#pic').setAttribute('src', url)
        this.updateSimulateKeyboard()
        this.updateKeysHint()
      }
    )
    // Shuang.core.keyboardLayout.show()
  },
  updateSimulateKeyboard() {
    if (!Shuang.resource.keyboardLayout[this.config.keyboardLayout]) return
    const row1keys = $$('#keys .row-1 .key')
    for (let i = 0; i < row1keys.length; i++) {
      const key = Shuang.resource.keyboardLayout[this.config.keyboardLayout].row1[i]
      row1keys[i].setAttribute('key', key ? key.toUpperCase() : '')
    }
    const row2keys = $$('#keys .row-2 .key')
    for (let i = 0; i < row2keys.length; i++) {
      const key = Shuang.resource.keyboardLayout[this.config.keyboardLayout].row2[i]
      row2keys[i].setAttribute('key', key ? key.toUpperCase() : '')
    }
    const row3keys = $$('#keys .row-3 .key')
    for (let i = 0; i < row3keys.length; i++) {
      const key = Shuang.resource.keyboardLayout[this.config.keyboardLayout].row3[i]
      row3keys[i].setAttribute('key', key ? key.toUpperCase() : '')
    }
  }
}

function detectDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true
  }
  if (new Date().getHours() < 6 || new Date().getHours() > 22) {
    return true
  }
  return false
}

function readStorage(key = '') { return localStorage.getItem(key) }
function writeStorage(key = '', value = '') { localStorage.setItem(key, value) }
