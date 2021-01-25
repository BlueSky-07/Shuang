/** last changed: 2021.1.25 */

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
    }
    /** Applying Settings :: Changing UI **/
    const { scheme, mode, showPic, darkMode, autoNext, autoClear, showKeys } = this.config
    Array.prototype.find.call($('#scheme-select').children,
      schemeOption => Shuang.resource.schemeList[scheme].startsWith(schemeOption.innerText)
    ).selected = true
    $('#mode-select')[Object.keys(Shuang.app.modeList).indexOf(mode)].selected = true
    $('#pic-switcher').checked = showPic === 'true'
    $('#dark-mode-switcher').checked = darkMode === 'true'
    $('#auto-next-switcher').checked = autoNext === 'true'
    $('#auto-clear-switcher').checked = autoClear === 'true'
    $('#show-keys').checked = showKeys === 'true'
    /** Applying Settings :: Invoking Actions  **/
    this.setScheme(Shuang.resource.schemeList[scheme], false)
    this.setMode(Shuang.app.modeList[mode].name)
    this.setPicVisible(showPic)
    this.setDarkMode(darkMode)
    this.setAutoNext(autoNext)
    this.setAutoClear(autoClear)
    this.setShowKeys(showKeys)
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
    } else if (this.config.showPic === 'true') {
      $('#keyboard').style.display = 'block'
    }
    writeStorage('showPic', this.config.showPic)
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
  updateKeysHint() {
    const keys = $$('.key')
    for (const key of keys) {
      key.style.visibility = 'hidden'
    }
    if (this.config.showKeys === 'false') return
    const qwerty = 'qwertyuiopasdfghjkl;zxcvbnm'
    for (const [sheng, yun] of Shuang.core.current.scheme) {
      keys[qwerty.indexOf(sheng)].style.visibility = 'visible'
      keys[qwerty.indexOf(yun)].style.visibility = 'visible'
    }
    this.updateKeysHintLayoutRatio()
  },
  updateKeysHintLayoutRatio() {
    // TODO: 修改样式而不是计算
    const MIN_WIDTH = 310
    const MAX_WIDTH = 750
    const OFFSET_WIDTH = 300
    const OFFSET = 30
    let left = 0
    let keysHintRatio = window.outerWidth / MAX_WIDTH
    if (window.outerWidth > MAX_WIDTH) {
      keysHintRatio = 1
    } else if (window.outerWidth < MIN_WIDTH) {
      keysHintRatio = MIN_WIDTH / MAX_WIDTH
      if (window.outerWidth > OFFSET_WIDTH) {
        left = (MIN_WIDTH - window.outerWidth) / (MIN_WIDTH - OFFSET_WIDTH) * OFFSET
      } else {
        left = OFFSET
      }
    }
    $('.keys').style.zoom = keysHintRatio
    $('.keys').style.left = left + 'px'
  },
  updateTips() {
    const tips = $('#tips')
    tips.innerHTML = ''
    const currentScheme = Shuang.resource.scheme[this.config.scheme]
    if (currentScheme.tips) {
      const tipsToView = Array.isArray(currentScheme.tips) ? currentScheme.tips : [currentScheme.tips]
      for (const tip of tipsToView) {
        const newLine = document.createElement('div')
        newLine.className = 'line'
        newLine.innerHTML = tip
        tips.appendChild(newLine)
      }
    }
    $('#pic').setAttribute('src', `img/${this.config.scheme}.png`)
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
