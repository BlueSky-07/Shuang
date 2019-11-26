/** last changed: 2019.8.23 */

Shuang.app.action = {
  init() {
    /** Update Resources **/
    if (navigator && navigator.userAgent && /Windows|Linux/.test(navigator.userAgent)) {
      Shuang.resource.emoji = { right: '✔️', wrong: '❌' }
    }
    
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

    /** Setting First Question **/
    Shuang.core.current = new Shuang.core.model('sh', 'uang')
    $('#q').innerText = Shuang.core.current.view.sheng + Shuang.core.current.view.yun
    $('#dict').innerText = Shuang.core.current.dict

    /** Reset Configs **/
    Shuang.app.setting.reload()

    /** Listen Events **/
    document.addEventListener('keydown', e => {
      if (['Escape', 'Tab', 'Enter', 'Space'].includes(e.code)) e.preventDefault()
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
    $('#auto-next-switcher').addEventListener('change', e => {
      Shuang.app.setting.setAutoNext(e.target.checked)
    })
    $('#auto-clear-switcher').addEventListener('change', e => {
      Shuang.app.setting.setAutoClear(e.target.checked)
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

    /** All Done **/
    this.redo()
  },
  keyPressed(e) {
    switch (e.code) {
      case 'Escape':
        this.redo()
        break
      case 'Tab':
        Shuang.core.current.beforeJudge()
        $('#a').value = Shuang.core.current.scheme.values().next().value
        this.judge()
        break
      case 'Enter':
      case 'Space':
        if (this.judge()) {
          this.next()
        } else {
          this.redo()
        }
        break
      default:
        $('#a').value = $('#a').value.slice(0, 2).replace(/[^a-zA-Z;]/g, '')
        const canAuto = a.value.length === 2
        const isRight = this.judge()
        if (canAuto) {
          if (isRight && Shuang.app.setting.config.autoNext === 'true') {
            this.next()
          } else if (!isRight && Shuang.app.setting.config.autoClear === 'true') {
            this.redo()
          }
        }
    }
  },
  judge() {
    const input = $('#a')
    const btn = $('#btn')
    const [sheng, yun] = input.value
    if (yun && Shuang.core.current.judge(sheng, yun)) {
      btn.onclick = this.next.bind(this)
      btn.innerText = Shuang.resource.emoji.right
      return true
    } else {
      btn.onclick = this.redo.bind(this)
      btn.innerText = Shuang.resource.emoji.wrong
      return false
    }
  },
  redo() {
    $('#a').value = ''
    $('#a').focus()
    $('#btn').onclick = this.redo.bind(this)
    $('#btn').innerText = Shuang.resource.emoji.wrong
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
    else Shuang.core.history = [...Shuang.core.history, Shuang.core.current.sheng + Shuang.core.current.yun].slice(-100)
    $('#q').innerText = Shuang.core.current.view.sheng + Shuang.core.current.view.yun
    $('#dict').innerText = Shuang.core.current.dict
  },
  qrShow(targetId) {
    $('#' + targetId).style.display = 'block'
  },
  qrHide(target) {
    target.style.display = 'none'
  }
}
