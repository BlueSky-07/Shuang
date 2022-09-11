/** last changed: 2022.3.6 */

Shuang.app.action = {
  init() {
    /** Init WPA ServiceWorker**/
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('/sw.js').then(function (reg) {
    //     // registration worked
    //     console.log('Registration succeeded. Scope is ' + reg.scope);
    //   }).catch(function (error) {
    //     // registration failed
    //     console.log('Registration failed with ' + error);
    //   });
    // }

    /** Update Resources **/
    if (navigator && navigator.userAgent && /windows|linux/i.test(navigator.userAgent)) {
      Shuang.resource.emoji = { right: '✔️', wrong: '❌', unknown: '❔' }
    }
    $('#btn').innerText = Shuang.resource.emoji.unknown
    this.setUnderLine("first")
    $('#pic').style = "--svg-keyborad-width: " + $('#pic').offsetWidth + "px"

    /** Rendering **/
    function renderSelect(target, options, callback) {
      options.forEach(option => {
        const opt = document.createElement('option')
        if (option.disabled) opt.setAttribute('disabled', 'disabled')
        opt.innerText = option.text || option
        target.appendChild(opt)
      })
      target.onchange = e => {
        callback(e.target.value)
      }
    }

    const schemeList = Object.values(Shuang.resource.schemeList)
    const schemes = {
      common: schemeList.filter(scheme => !scheme.endsWith('*')),
      uncommon: schemeList
        .filter(scheme => scheme.endsWith('*') && !scheme.endsWith('**'))
        .map(scheme => scheme.slice(0, -1))
      ,
      rare: schemeList
        .filter(scheme => scheme.endsWith('**'))
        .map(scheme => scheme.slice(0, -2))
    }
    const schemeOptions = [
      { disabled: true, text: '常见' },
      ...schemes.common,
      { disabled: true, text: '小众' },
      ...schemes.uncommon,
      { disabled: true, text: '爱好者' },
      ...schemes.rare,
    ]

    renderSelect($('#scheme-select'), schemeOptions, value => {
      Shuang.app.setting.setScheme(value)
    })
    renderSelect($('#mode-select'), Object.values(Shuang.app.modeList).map(mode => mode.name), value => {
      Shuang.app.setting.setMode(value)
      this.next()
    })

    /** Setting First Question **/
    Shuang.core.current = new Shuang.core.model('sh', 'uang')
    $('#q').innerText = Shuang.core.current.view.sheng + Shuang.core.current.view.yun
    $('#dict').innerText = Shuang.core.current.dict

    /** Reset Configs **/
    Shuang.app.setting.reload()

    /** Listen Events **/
    document.addEventListener('keydown', e => {
      if (['Backspace', 'Tab', 'Enter', ' '].includes(e.key)) {
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          event.returnValue = false
        }
      }
    })
    document.addEventListener('keydown', e => {
      this.keyDown(e)
    })
    document.addEventListener('keyup', e => {
      this.keyPressed(e)
    })
    window.addEventListener('resize', () => {
      $('#pic').style = "--svg-keyborad-width: " + $('#pic').offsetWidth + "px"
    })
    $('#pic-switcher').addEventListener('change', e => {
      Shuang.app.setting.setPicVisible(e.target.checked)
    })
    $('#pinyin-switcher').addEventListener('change', e => {
      Shuang.app.setting.setPinyinVisible(e.target.checked)
    })
    $('#dark-mode-switcher').addEventListener('change', e => {
      Shuang.app.setting.setDarkMode(e.target.checked)
    })
    $('#auto-next-switcher').addEventListener('change', e => {
      Shuang.app.setting.setAutoNext(e.target.checked)
    })
    $('#auto-clear-switcher').addEventListener('change', e => {
      Shuang.app.setting.setAutoClear(e.target.checked)
    })
    $('#show-keys').addEventListener('change', e => {
      Shuang.app.setting.setShowKeys(e.target.checked)
    })
    $('#show-pressed-key').addEventListener('change', e => {
      Shuang.app.setting.setShowPressedKey(e.target.checked)
    })
    $('#disable-mobile-keyboard').addEventListener('change', e => {
      Shuang.app.setting.setDisableMobileKeyboard(e.target.checked)
    })
    $('#dict').addEventListener('click', () => {
      this.setUnderLine("both")
      Shuang.core.current.beforeJudge()
      $('#a').value = Shuang.core.current.scheme.values().next().value
      this.judge()
    })
    window.addEventListener('resize', Shuang.app.setting.updateKeysHintLayoutRatio)
    window.resizeTo(window.outerWidth, window.outerHeight)
    $('#full-screen-button').addEventListener('click', () => {
      if (this.isFullscreen()) {
        this.exitFull()
      } else {
        this.requestFullScreen($('main'))
      }
    })

    /** Simulate Keyboard */
    const keys = $$('.key')
    const qwerty = 'qwertyuiopasdfghjkl;zxcvbnm'
    for (let i = 0; i < keys.length; i++) {
      keys[i].addEventListener('click', () => {
        const event = new KeyboardEvent('keyup', { key: qwerty[i].toUpperCase() })
        event.simulated = true
        document.dispatchEvent(event)
      })
    }

    /** All Done **/
    this.redo()
  },
  keyDown(e) {
    if (e.key.replace(/[^a-zA-Z;]/g, '') == "") {
      $('#a').blur()
    } else {
      $('#a').focus()
    }
  },
  keyPressed(e) {
    const btn = $('#btn')
    switch (e.key) {
      case 'Backspace':
        this.redo()
        break
      case 'Tab':
        this.setUnderLine("both")
        Shuang.core.current.beforeJudge()
        $('#a').value = Shuang.core.current.scheme.values().next().value
        this.judge()
        break
      case 'Enter':
      case ' ':
        if (this.judge()) {
          this.next()
        } else {
          this.redo()
        }
        btn.innerText = Shuang.resource.emoji.unknown
        break
      default:
        if (e.simulated) {
          $('#a').value += e.key.toLowerCase()
        }
        $('#a').value = $('#a').value
          .slice(0, 2)
          .replace(/[^a-zA-Z;]/g, '')
          .split('')
          .map((c, i) => i === 0 ? c.toUpperCase() : c.toLowerCase())
          .join('')
        Shuang.app.setting.updatePressedKeyHint(e.key)
        const canAuto = $('#a').value.length === 2
        const isEmpty = $('#a').value.length === 0
        if (canAuto) {
          const isRight = this.judge()
          if (isRight && Shuang.app.setting.config.autoNext === 'true') {
            this.next(e.simulated)
          } else if (!isRight && Shuang.app.setting.config.autoClear === 'true') {
            this.redo(e.simulated)
          } else {
            this.setUnderLine("both")
          }
        } else if (!isEmpty) {
          btn.innerText = Shuang.resource.emoji.unknown
          this.setUnderLine("second")
        } else {
          this.setUnderLine("first")
        }
    }
  },
  judge() {
    const input = $('#a')
    const btn = $('#btn')
    const [sheng, yun] = input.value
    if (yun && Shuang.core.current.judge(sheng, yun)) {
      btn.onclick = () => {
        this.next(true)
        btn.innerText = Shuang.resource.emoji.unknown
      }
      btn.innerText = Shuang.resource.emoji.right
      return true
    } else {
      btn.onclick = () => {
        this.redo(true)
        btn.innerText = Shuang.resource.emoji.unknown
      }
      btn.innerText = Shuang.resource.emoji.wrong
      return false
    }
  },
  redo(noFocus) {
    $('#a').value = ''
    if (!noFocus) $('#a').focus()
    $('#btn').onclick = () => this.redo(noFocus)
    this.setUnderLine("first")
  },
  next(noFocus) {
    this.redo(noFocus)
    switch (Shuang.app.setting.config.mode) {
      case 'all-random':
        Shuang.core.current = Shuang.core.model.getRandom()
        break
      case 'all-order':
        Shuang.core.current = Shuang.core.model.getByOrder()
        break
      case 'hard-random':
        Shuang.core.current = Shuang.core.model.getHardRandom()
        break
      case 'hard-random-without-pinyin':
        do {
          Shuang.core.current = Shuang.core.model.getHardRandom()
        } while (Array.isArray(Shuang.core.current.dict))
        break
    }
    if (Shuang.core.history.includes(Shuang.core.current.sheng + Shuang.core.current.yun)) this.next()
    else Shuang.core.history = [...Shuang.core.history, Shuang.core.current.sheng + Shuang.core.current.yun].slice(-100)
    $('#q').innerText = Shuang.core.current.view.sheng + Shuang.core.current.view.yun
    $('#dict').innerText = Shuang.core.current.dict

    // Update Keys Hint
    Shuang.core.current.beforeJudge()
    Shuang.app.setting.updateKeysHint()
  },
  setUnderLine(key) {
    $('#under-line').setAttribute("key", key)
  },
  requestFullScreen(element) {
    // 判断各种浏览器，找到正确的方法
    var requestMethod = element.requestFullScreen || //W3C
      element.webkitRequestFullScreen || //Chrome等
      element.mozRequestFullScreen || //FireFox
      element.msRequestFullScreen; //IE11
    if (requestMethod) {
      requestMethod.call(element);
    }
    else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  },
  exitFull() {
    // 判断各种浏览器，找到正确的方法
    var exitMethod = document.exitFullscreen || //W3C
      document.mozCancelFullScreen || //Chrome等
      document.webkitExitFullscreen || //FireFox
      document.webkitExitFullscreen; //IE11
    if (exitMethod) {
      exitMethod.call(document);
    }
    else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  },
  isFullscreen() {
    return document.fullscreenElement ||
      document.msFullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement || false;
  }
}
