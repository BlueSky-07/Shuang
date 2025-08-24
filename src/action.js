/** last changed: 2025.1.9 */

Shuang.app.action = {
  init() {
    /** Update Resources **/
    if (navigator && navigator.userAgent && /windows|linux/i.test(navigator.userAgent)) {
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
    const keyboardLayoutOptions = Object.values(Shuang.resource.keyboardLayoutList)
    renderSelect($('#keyboard-layout-select'), keyboardLayoutOptions, (value) => {
      Shuang.app.setting.setKeyboardLayout(value)
    })

    /** Favorites **/
    Shuang.app.favorites.load()

    /** Setting First Question **/
    Shuang.core.current = new Shuang.core.model('sh', 'uang')

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
    document.addEventListener('keyup', e => {
      this.keyPressed(e)
    })
    // Favorite toggle: Ctrl/Cmd + D
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault()
        const code = Shuang.core.current.sheng + Shuang.core.current.yun
        Shuang.app.favorites.toggle(code)
        this.updateFavoriteIndicator()
      }
    })
    $('#pic-switcher').addEventListener('change', e => {
      Shuang.app.setting.setPicVisible(e.target.checked)
    })
    $('#show-keys').addEventListener('change', e => {
      Shuang.app.setting.setShowKeys(e.target.checked)
    })
    $('#dark-mode-switcher').addEventListener('change', e => {
      Shuang.app.setting.setDarkMode(e.target.checked)
    })
    $('#show-pinyin').addEventListener('change', e => {
      Shuang.app.setting.setShowPinyin(e.target.checked)
    })
    $('#more-settings-switcher').addEventListener('click', e => {
      Shuang.app.action.toggleMoreSettingsVisible()
    })
    $('#auto-next-switcher').addEventListener('change', e => {
      Shuang.app.setting.setAutoNext(e.target.checked)
    })
    $('#auto-clear-switcher').addEventListener('change', e => {
      Shuang.app.setting.setAutoClear(e.target.checked)
    })
    $('#show-pressed-key').addEventListener('change', e => {
      Shuang.app.setting.setShowPressedKey(e.target.checked)
    })
    $('#disable-mobile-keyboard').addEventListener('change', e => {
      Shuang.app.setting.setDisableMobileKeyboard(e.target.checked)
    })
    $('#bopomofo-switcher').addEventListener('change', e => {
      Shuang.app.setting.setBopomofo(e.target.checked)
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
      this.judge(false)
    })
    const favOpenBtn = $('#favorite-open')
    if (favOpenBtn) favOpenBtn.addEventListener('click', () => this.toggleFavoritePanel())
    window.addEventListener('resize', Shuang.app.setting.updateKeysHintLayoutRatio)
    window.resizeTo(window.outerWidth, window.outerHeight)

    /** Simulate Keyboard */
    const keys = $$('.key')
    for (let i = 0; i < keys.length; i++) {
      // IE 不支持实例化 KeyboardEvent
      if (navigator && navigator.userAgent && /msie|trident/i.test(navigator.userAgent))
        break
      keys[i].addEventListener('click', (e) => {
        const key = e.target.getAttribute('key')
        if (!key) return
        const event = new KeyboardEvent('keyup', { key: key.toLowerCase() })
        event.simulated = true
        document.dispatchEvent(event)
      })
    }

    /** All Done **/
    Shuang.app.setting.updateQAndDict()
    this.redo()
    this.ensureFavoriteUI()
    this.updateFavoriteIndicator()
    this.ensureFavoritePanel()
  },
  keyPressed(e) {
    switch (e.key) {
      case 'Backspace':
        this.redo()
        break
      case 'Tab':
        Shuang.core.current.beforeJudge()
        $('#a').value = Shuang.core.current.scheme.values().next().value
        this.judge(false)
        break
      case 'Enter':
      case ' ':
        if (this.judge(true)) {
          this.next()
        } else {
          this.redo()
        }
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
        const isRight = this.judge(false)
        if (canAuto) {
          if (isRight && Shuang.app.setting.config.autoNext === 'true') {
            this.next(e.simulated)
          } else if (!isRight && Shuang.app.setting.config.autoClear === 'true') {
            this.redo(e.simulated)
          }
        }
    }
  },
  judge(onSubmit = false) {
    const input = $('#a')
    const btn = $('#btn')
    const [sheng, yun] = input.value
    if (yun && Shuang.core.current.judge(sheng, yun)) {
      btn.onclick = () => this.next(true)
      btn.innerText = Shuang.resource.emoji.right
      return true
    } else {
      btn.onclick = () => this.redo(true)
      btn.innerText = Shuang.resource.emoji.wrong
      // 不再自动加入收藏，仅手动（Ctrl/Cmd + D 或点击 ☆）
      return false
    }
  },
  redo(noFocus) {
    $('#a').value = ''
    if (!noFocus) $('#a').focus()
    $('#btn').onclick = () => this.redo(noFocus)
    $('#btn').innerText = Shuang.resource.emoji.wrong
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
      case 'favorites': {
        const list = Shuang.app.favorites.list
        if (!list.length) {
          const fallback = Shuang.app.setting.config.lastNormalMode || 'all-random'
          Shuang.app.setting.setMode(Shuang.app.modeList[fallback].name)
          Shuang.core.current = Shuang.core.model.getRandom()
          break
        }
        const idx = Shuang.app.favorites.practiceIndex || 0
        const code = list[Math.min(idx, list.length - 1)]
        if (idx >= list.length - 1) {
          alert('收藏练习已完成，将从头开始。')
          Shuang.app.favorites.practiceIndex = 0
        } else {
          Shuang.app.favorites.practiceIndex = idx + 1
        }
        const picked = Shuang.app.favorites.getModelByCode(code)
        Shuang.core.current = picked || Shuang.core.model.getRandom()
        break
      }
    }
    // 收藏练习不参与历史去重
    if (Shuang.app.setting.config.mode !== 'favorites') {
      if (Shuang.core.history.includes(Shuang.core.current.sheng + Shuang.core.current.yun)) this.next()
      else Shuang.core.history = [...Shuang.core.history, Shuang.core.current.sheng + Shuang.core.current.yun].slice(-100)
    }

    // Update Keys Hint
    Shuang.app.setting.updateQAndDict()
    Shuang.core.current.beforeJudge()
    Shuang.app.setting.updateKeysHint()
    this.updateFavoriteIndicator()
  },
  ensureFavoriteUI() {
    if ($('#favorite-toggle')) return
    const row = document.createElement('div')
    row.classList.add('row')
    const btn = document.createElement('span')
    btn.setAttribute('id', 'favorite-toggle')
    btn.classList.add('btn')
    btn.title = '收藏/取消收藏（Ctrl/Cmd + D）'
    btn.innerText = '☆'
    btn.onclick = () => {
      const code = Shuang.core.current.sheng + Shuang.core.current.yun
      Shuang.app.favorites.toggle(code)
      this.updateFavoriteIndicator()
    }
    const counter = document.createElement('span')
    counter.setAttribute('id', 'favorite-counter')
    counter.style.marginLeft = '6px'
    counter.style.fontSize = '14px'
    counter.style.color = '#777'
    row.appendChild(btn)
    row.appendChild(counter)
    // 插入到输入框那一列下面
    const cols = $$('.workspace .col')
    if (cols && cols.length > 1) {
      cols[1].appendChild(row)
    }
  },
  updateFavoriteIndicator() {
    const btn = $('#favorite-toggle')
    const counter = $('#favorite-counter')
    if (!btn || !counter) return
    const code = Shuang.core.current.sheng + Shuang.core.current.yun
    const isFav = Shuang.app.favorites.has(code)
    btn.innerText = isFav ? '★' : '☆'
    counter.innerText = `已收藏 ${Shuang.app.favorites.list.length}`
  },
  qrShow(targetId) {
    $('#' + targetId).style.display = 'block'
  },
  qrHide(target) {
    target.style.display = 'none'
  },
  toggleMoreSettingsVisible() {
    $('#more-settings').style.display = $('#more-settings').style.display === 'block' ? 'none' : 'block'
    $('#more-settings-switcher') .innerText = $('#more-settings').style.display === 'block' ? '收起更多' : '展开更多'
  }
  ,
  ensureFavoritePanel() {
    if ($('#favorite-panel')) return
    const panel = document.createElement('div')
    panel.setAttribute('id', 'favorite-panel')
    panel.classList.add('header')
    panel.style.display = 'none'
    panel.innerHTML = `
      <div class="menu"><span class="title">收藏：</span></div>
      <div class="menu"><button id="favorite-practice">开始收藏练习</button></div>
      <div class="menu"><button id="favorite-clear">清空</button></div>
      <div class="menu"><button id="favorite-export">导出</button></div>
      <div class="menu"><label for="favorite-import" class="title">导入：</label><input id="favorite-import" type="file" accept=".json,.txt"></div>
      <div class="menu"><span id="favorite-list"></span></div>
    `
    document.body.insertBefore(panel, document.querySelector('.workspace'))
    // 事件
    $('#favorite-practice').onclick = () => {
      Shuang.app.favorites.resetPractice()
      Shuang.app.setting.setMode(Shuang.app.modeList['favorites'].name)
      this.next()
      this.toggleFavoritePanel(false)
    }
    $('#favorite-clear').onclick = () => {
      if (confirm('确定清空收藏？')) {
        Shuang.app.favorites.clear()
        this.updateFavoriteIndicator()
        this.renderFavoriteList()
      }
    }
    $('#favorite-export').onclick = () => {
      const content = Shuang.app.favorites.exportJson()
      const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'favorites.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    $('#favorite-import').addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = (ev.target && ev.target.result) || ''
        if (file.name && file.name.toLowerCase().endsWith('.json')) {
          Shuang.app.favorites.importFromJson(String(text))
        } else {
          Shuang.app.favorites.importFromText(String(text))
        }
        this.updateFavoriteIndicator()
        this.renderFavoriteList()
      }
      reader.readAsText(file)
      // 重置 input 以便连续导入同名文件
      e.target.value = ''
    })
    // 键：Ctrl/Cmd + Shift + D 打开/关闭
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault()
        this.toggleFavoritePanel()
      }
    })
  }
  ,
  toggleFavoritePanel(force) {
    const panel = $('#favorite-panel')
    if (!panel) return
    if (typeof force === 'boolean') {
      panel.style.display = force ? 'block' : 'none'
    } else {
      panel.style.display = panel.style.display === 'block' ? 'none' : 'block'
    }
    if (panel.style.display === 'block') this.renderFavoriteList()
  }
  ,
  renderFavoriteList() {
    const list = Shuang.app.favorites.list
    const holder = $('#favorite-list')
    if (!holder) return
    holder.innerHTML = ''
    if (!list.length) {
      holder.innerText = '（空）'
      return
    }
    const frag = document.createDocumentFragment()
    for (const code of list) {
      const item = document.createElement('span')
      item.classList.add('fav-item')
      item.innerText = code
      item.title = '点击从收藏移除'
      item.onclick = () => {
        Shuang.app.favorites.remove(code)
        this.renderFavoriteList()
        this.updateFavoriteIndicator()
      }
      frag.appendChild(item)
    }
    holder.appendChild(frag)
  }
}
