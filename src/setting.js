/** last changed: 2022.9.12 */

Shuang.app.setting = {
  config: {},
  reload() {
    /** Reading Storage or Using Default **/
    this.config = {
      scheme: readStorage('scheme') || 'ziranma',
      mode: readStorage('mode') || 'all-random',
      showPic: readStorage('showPic') || 'true',
      showPinyin: readStorage('showPinyin') || 'true',
      darkMode: readStorage('darkMode') || detectDarkMode().toString(),
      autoNext: readStorage('autoNext') || 'true',
      autoClear: readStorage('autoClear') || 'true',
      showKeys: readStorage("showKeys") || "true",
      showPressedKey: readStorage("showPressedKey") || "true",
      disableMobileKeyboard: readStorage("disableMobileKeyboard") || "false",
    }
    /** Applying Settings :: Changing UI **/
    const { scheme, mode, showPic, showPinyin, darkMode, autoNext, autoClear, showKeys, showPressedKey, disableMobileKeyboard } = this.config
    Array.prototype.find.call($('#scheme-select').children,
      schemeOption => Shuang.resource.schemeList[scheme].startsWith(schemeOption.innerText)
    ).selected = true
    $('#mode-select')[Object.keys(Shuang.app.modeList).indexOf(mode)].selected = true
    $('#pic-switcher').checked = showPic === 'true'
    $('#pinyin-switcher').checked = showPinyin === 'true'
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
    // this.setPinyinVisible(showPinyin)
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
  setPinyinVisible(bool) {
    this.config.showPinyin = bool.toString()
    this.updateKeyboard()
    writeStorage('showPinyin', this.config.showPinyin)
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
    // $('img.pic').setAttribute('src', `img/${this.config.scheme}.png`)
    // $('img.pic').setAttribute('src', `img/${this.config.scheme}.svg`)
    this.updateKeyboard();
  },
  updateKeyboard() {
    // init
    const keyboardSheng = "#keyboard-svg>#sheng-mu.col-2"
    const keyboardShengList = $(keyboardSheng).children
    const keyboardYun = "#keyboard-svg>#yun-mu"
    const keyboardYunList = $(keyboardYun).children
    const keyboardLingShengMu = "#keyboard-svg>#ling-sheng-mu"
    const keyboardLingShengMuList = $(keyboardLingShengMu).children
    const keyboardLingShengMuOther = "#keyboard-svg>#ling-sheng-mu-other"
    // clear
    for (var i = 0; i < keyboardShengList.length; i++) {
      keyboardShengList[i].innerHTML = ""
    }
    for (var i = 0; i < keyboardYunList.length; i++) {
      keyboardYunList[i].innerHTML = ""
    }
    for (var i = 0; i < keyboardLingShengMuList.length; i++) {
      keyboardLingShengMuList[i].innerHTML = ""
    }
    // write
    if (this.config.showPinyin === "true") {
      const schemeName = this.config.scheme;
      const schemeDetail = Shuang.resource.scheme[schemeName].detail;
      const schemeOther = Shuang.resource.scheme[schemeName].show;
      // name
      $("#other>text.scheme").innerHTML = Shuang.resource.scheme[schemeName].name
      // sheng
      for (var sheng of ['zh', 'ch', 'sh']) {
        if (typeof schemeDetail.sheng[sheng] === "string") {
          $(keyboardSheng + '>.' + schemeDetail.sheng[sheng]).innerHTML = sheng
          // $(keyboard_sheng + schemeDetail.sheng[shengKey]).firstChild.nodeValue = shengKey
        } else if (typeof schemeDetail.sheng[sheng] === "object") {
          for (i of schemeDetail.sheng[sheng]) {
            $(keyboardSheng + '>.' + i).innerHTML = sheng
            // $(keyboard_sheng + i).firstChild.nodeValue = shengKey
          }
        }
      }
      // yun
      for (var yun of Object.keys(schemeDetail.yun)) {
        if (typeof schemeDetail.yun[yun] === "string") {
          var yunKey = document.querySelectorAll(keyboardYun + '>.' + (schemeDetail.yun[yun] == ";" ? "semicolon" : schemeDetail.yun[yun]))
          if (yunKey[0].innerHTML == "") {
            yunKey[0].innerHTML = yun
          }
          else if (yunKey[1].innerHTML == "") {
            yunKey[1].innerHTML = yun
          }
        } else if (typeof schemeDetail.yun[yun] === "object") {
          for (i of schemeDetail.yun[yun]) {
            var yunKey = document.querySelectorAll(keyboardYun + '>.' + (i == ";" ? "semicolon" : schemeDetail.yun[yun]))
            if (yunKey[0].innerHTML == "") {
              yunKey[0].innerHTML = yun
            }
            else if (yunKey[1].innerHTML == "") {
              yunKey[1].innerHTML = yun
            }
          }
        }
      }
      // ling-sheng-mu
      $('#kuang-other').innerHTML = ""
      $(keyboardLingShengMuOther).innerHTML = ""
      if ("mode" in schemeOther.lingShengMu) {
        $('#kuang-ling-sheng-mu').style = "display: none;"
        $('#kuang-other').style = "display: inline;"
        $('#other').children[0].innerHTML = schemeOther.lingShengMu.mode
        for (var kuang of schemeOther.lingShengMu.kuang) {
          var line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
          line.setAttribute("points", kuang)
          $('#kuang-other').appendChild(line)
        }
        for (var outputText of schemeOther.lingShengMu.output) {
          var text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
          var xy = outputText.split(",")
          text.setAttribute("x", xy[0])
          text.setAttribute("y", xy[1])
          text.classList.add("output")
          $('#ling-sheng-mu-other').appendChild(text)
        }
        for (var inputText of schemeOther.lingShengMu.input) {
          var text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
          var xy = inputText.split(",")
          text.setAttribute("x", xy[0])
          text.setAttribute("y", xy[1])
          text.classList.add("input")
          $('#ling-sheng-mu-other').appendChild(text)
        }
        for (var i = 0; i < Object.keys(schemeOther.lingShengMu.text).length; i++) {
          var lingShengMuOutput = document.querySelectorAll(keyboardLingShengMuOther + ">.output")
          var lingShengMuInput = document.querySelectorAll(keyboardLingShengMuOther + ">.input")
          lingShengMuOutput[i].innerHTML = Object.keys(schemeOther.lingShengMu.text)[i]
          lingShengMuInput[i].innerHTML = schemeOther.lingShengMu.text[Object.keys(schemeOther.lingShengMu.text)[i]]
        }
      } else {
        $('#kuang-ling-sheng-mu').style = ""
        $('#kuang-other').style = ""
        $('#other').children[0].innerHTML = "零声母"
        for (var i = 0; i < Object.keys(schemeOther.lingShengMu).length; i++) {
          var lingShengMuOutput = document.querySelectorAll(keyboardLingShengMu + ">.output")
          var lingShengMuInput = document.querySelectorAll(keyboardLingShengMu + ">.input")
          lingShengMuOutput[i].innerHTML = Object.keys(schemeOther.lingShengMu)[i]
          lingShengMuInput[i].innerHTML = schemeOther.lingShengMu[Object.keys(schemeOther.lingShengMu)[i]]
        }
      }
      // other
      if (Object.keys(schemeOther.other).length > 0) {
        for (var i = 0; i < Object.keys(schemeOther.other).length; i++) {
          if (/_.*$/.test(Object.keys(schemeOther.other)[i])) {
            var otherKey = Object.keys(schemeOther.other)[i].split("_")
            var otherValue = schemeOther.other[Object.keys(schemeOther.other)[i]]
            var yunKey = document.querySelectorAll(keyboardYun + '>.' + otherKey[0])
            switch (otherKey[1]) {
              case "0":
                $(keyboardSheng + '>.' + otherKey[0]).innerHTML = otherValue
                break
              case "1":
                yunKey[0].innerHTML = otherValue
                break;
              case "2":
                yunKey[1].innerHTML = otherValue
                break
              case "push":
                yunKey[1].innerHTML = yunKey[0].innerHTML
                yunKey[0].innerHTML = otherValue
                break
              case "array":
                yunKey[0].innerHTML = otherValue[0]
                yunKey[1].innerHTML = otherValue[1]
                if (otherValue.length == 3) {
                  $(keyboardSheng + '>.' + otherKey[0]).innerHTML = otherValue[2]
                }
                break
              default:
                throw "Parameter error"
            }
          } else {
            var otherKey = Object.keys(schemeOther.other)[i]
            var otherValue = schemeOther.other[otherKey]
            var yunKey = document.querySelectorAll(keyboardYun + '>.' + otherKey)
            if (yunKey[0].innerHTML == "") {
              yunKey[0].innerHTML = otherValue
            }
            else if (yunKey[1].innerHTML == "") {
              yunKey[1].innerHTML = otherValue
            } else {
              throw "Already full"
            }
          }
        }
      }
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
