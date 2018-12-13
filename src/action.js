/** last changed: 2018.12.13 */

Shuang.app.action = {
  init() {
    // better emoji for windows users
    if (navigator && navigator.userAgent) {
      const ua = navigator.userAgent
      if (/Windows/.test(ua)) {
        // Windows
        Shuang.resource.emoji = {
          right: '✔️', wrong: '❌'
        }
      }
    }
    
    // render
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
        {disabled: true, text: '常见'},
        ...schemes.common,
        {disabled: true, text: '小众'},
        ...schemes.uncommon,
        {disabled: true, text: '爱好者'},
        ...schemes.rare,
    ]
    
    renderSelect($('#scheme-select'), schemeOptions, value => {
      Shuang.app.setting.setScheme(value)
    })
    renderSelect($('#mode-select'), Object.values(Shuang.app.modeList).map(mode => mode.name), value => {
      Shuang.app.setting.setMode(value)
      this.next()
    })
    
    // set first question
    Shuang.core.current = new Shuang.core.model('sh', 'uang')
    $('#q').innerHTML = Shuang.core.current.view.sheng + Shuang.core.current.view.yun
    $('#dict').innerHTML = Shuang.core.current.dict
    
    // reset configs
    Shuang.app.setting.reload()
    
    // register actions
    document.addEventListener('keydown', e => {
      if ([27, 9, 13, 32].includes(e.keyCode)) e.preventDefault()
    })
    document.addEventListener('keyup', e => {
      this.keyPressed(e)
    })
    $('#pic-switcher').addEventListener('change', e => {
      Shuang.app.setting.setPicVisible(e.target.checked)
    })
    $('#dark-mode-switcher').addEventListener('change', e => {
      Shuang.app.setting.setDarkMode(e.target.checked)
    })
    $('.pay-name#alipay').addEventListener('mouseover', () => {
      Shuang.app.action.qrShow('alipay-qr')
    })
    $('#alipay-qr').addEventListener('click', e => {
      Shuang.app.action.qrHide(e.target)
    })
    $('#alipay-qr').addEventListener('mouseout', e => {
      Shuang.app.action.qrHide(e.target)
    })
    $('.pay-name#wxpay').addEventListener('mouseover', () => {
      Shuang.app.action.qrShow('wxpay-qr')
    })
    $('#wxpay-qr').addEventListener('click', e => {
      Shuang.app.action.qrHide(e.target)
    })
    $('#wxpay-qr').addEventListener('mouseout', e => {
      Shuang.app.action.qrHide(e.target)
    })
    $('#wx-name').addEventListener('mouseover', () => {
      Shuang.app.action.qrShow('wx-qr')
    })
    $('#wx-qr').addEventListener('click', e => {
      Shuang.app.action.qrHide(e.target)
    })
    $('#wx-qr').addEventListener('mouseout', e => {
      Shuang.app.action.qrHide(e.target)
    })
    $('#dict').addEventListener('click', () => {
      Shuang.core.current.beforeJudge()
      $('#a').value = Shuang.core.current.scheme.values().next().value
      this.judge()
    })
    
    // focus input
    this.redo()
  },
  keyPressed(e) {
    const a = $('#a')
    switch (e.keyCode) {
      case 27: // ESC
        this.redo()
        break
      case 9: // Tab
        Shuang.core.current.beforeJudge()
        a.value = Shuang.core.current.scheme.values().next().value
        this.judge()
        break
      case 13: // Enter
      case 32: // Space
        if (this.judge()) {
          this.next()
        } else {
          this.redo()
        }
        break
      default:
        a.value = a.value.slice(0, 2).replace(/[^a-zA-Z;]/g, '')
        this.judge()
    }
  },
  judge() {
    const input = $('#a')
    const _sheng = input.value[0]
    const _yun = input.value[1]
    const btn = $('#btn')
    if (_yun) {
      if (Shuang.core.current.judge(_sheng, _yun)) {
        btn.onclick = () => {
          this.next()
        }
        btn.innerText = Shuang.resource.emoji.right
        return true
      }
    }
    btn.onclick = () => {
      this.redo()
    }
    btn.innerText = Shuang.resource.emoji.wrong
    return false
  },
  redo() {
    const input = $('#a')
    const btn = $('#btn')
    input.value = ''
    input.focus()
    btn.onclick = () => {
      this.redo()
    }
    btn.innerText = Shuang.resource.emoji.wrong
  },
  next() {
    this.redo()
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
    else Shuang.core.history = Shuang.core.history.concat([Shuang.core.current.sheng + Shuang.core.current.yun]).slice(-100)
    $('#q').innerHTML = Shuang.core.current.view.sheng + Shuang.core.current.view.yun
    $('#dict').innerHTML = Shuang.core.current.dict
  },
  qrShow(targetId) {
    $('#' + targetId).style.display = 'block'
  },
  qrHide(target) {
    target.style.display = 'none'
  }
}
