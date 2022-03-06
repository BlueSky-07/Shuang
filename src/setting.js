/** last changed: 2022.3.6 */

Shuang.app.setting = {
  config: {},
  reload() {
    /** Reading Storage or Using Default **/
    this.config = {
      scheme: readStorage('scheme') || 'ziranma',
      mode: readStorage('mode') || 'all-random',
      showPic: readStorage('showPic') || 'true',
      darkMode: readStorage('darkMode') || detectDarkMode().toString(),
      autoNext: readStorage('autoNext') || 'true',
      autoClear: readStorage('autoClear') || 'true',
      showKeys: readStorage("showKeys") || "true",
      showPressedKey: readStorage("showPressedKey") || "true",
      disableMobileKeyboard: readStorage("disableMobileKeyboard") || "false",
    }
    /** Applying Settings :: Changing UI **/
    const { scheme, mode, showPic, darkMode, autoNext, autoClear, showKeys, showPressedKey, disableMobileKeyboard } = this.config
    Array.prototype.find.call($('#scheme-select').children,
      schemeOption => Shuang.resource.schemeList[scheme].startsWith(schemeOption.innerText)
    ).selected = true
    $('#mode-select')[Object.keys(Shuang.app.modeList).indexOf(mode)].selected = true
    $('#pic-switcher').checked = showPic === 'true'
    $('#dark-mode-switcher').checked = darkMode === 'true'
    $('#auto-next-switcher').checked = autoNext === 'true'
    $('#auto-clear-switcher').checked = autoClear === 'true'
    $('#show-keys').checked = showKeys === 'true'
    $('#show-pressed-key').checked = showPressedKey === 'true'
    $('#disable-mobile-keyboard').checked = disableMobileKeyboard === 'true'
    /** Applying Settings :: Invoking Actions  **/
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
      $('#pic-placeholder').style.display = 'none'
    } else if (this.config.showPic === 'true') {
      $('#keyboard').style.display = 'block'
      $('#pic-placeholder').style.display = 'block'
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
    const keys = $$('.key')
    for (const key of keys) {
      key.classList.remove('answer')
    }
    if (this.config.showKeys === 'false') return
    const qwerty = 'qwertyuiopasdfghjkl;zxcvbnm'
    for (const [sheng, yun] of Shuang.core.current.scheme) {
      keys[qwerty.indexOf(sheng)].classList.add('answer')
      keys[qwerty.indexOf(yun)].classList.add('answer')
    }
    this.updateKeysHintLayoutRatio()
  },
  updateKeysHintLayoutRatio() {
    if ($('body').scrollWidth < 700) {
      const width = $('body').scrollWidth === 310 ? 310 : $('#pic').scrollWidth
      const ratio = 1874 / 1928 * width / 680
      if (navigator && navigator.userAgent && /firefox/i.test(navigator.userAgent)) {
        // Firefox 不支持 zoom
        $('#keys').style.transform = `scale(${ratio})`
        $('#keys').style.transformOrigin = `left top`
        $('#keys').style.margin = `${ratio * 10}px`
        $('#pic-placeholder').style.height = `${width / 680 * 300}px`
      } else {
        $('#keys').style.marginLeft = '10px'
        $('#keys').style.zoom = ratio
        $('#pic-placeholder').style.zoom = ratio
      }
    } else {
      if (navigator && navigator.userAgent && /firefox/i.test(navigator.userAgent)) {
        // Firefox 不支持 zoom
        $('#keys').style.transform = 'unset'
        $('#keys').style.transformOrigin = 'unset'
        $('#pic-placeholder').style.height = '300px'
        $('#keys').style.margin = `10px auto`
      } else {
        $('#keys').style.marginLeft = 'auto'
        $('#keys').style.zoom = 'unset'
        $('#pic-placeholder').style.zoom = 'unset'
      }
    }
  },
  updatePressedKeyHint(k) {
    if (this.config.showPressedKey === 'false' || !k) return
    const keys = $$('.key')
    for (const key of keys) {
      key.classList.remove('pressed')
    }
    const qwerty = 'qwertyuiopasdfghjkl;zxcvbnm'
    const index = qwerty.indexOf(k.toLowerCase())
    if (index === -1) return
    keys[index].classList.add('pressed')
    setTimeout(() => {
      keys[index].classList.remove('pressed')
    }, 250)
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
    // $('#pic').setAttribute('src', `img/${this.config.scheme}.png`)
    $('#pic').setAttribute('src', `img/${this.config.scheme}.svg`)
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
