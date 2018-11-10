/** last changed: 2018.11.10 */

Shuang.app.setting = {
  config: {
    scheme: 'guobiao',
    mode: 'all-random',
    showPic: 'true'
  },
  reload() {
    if (localStorage.getItem('scheme')) this.config.scheme = localStorage.getItem('scheme')
    if (localStorage.getItem('mode')) this.config.mode = localStorage.getItem('mode')
    if (localStorage.getItem('showPic')) this.config.showPic = localStorage.getItem('showPic')
    $('#scheme-select')[Object.keys(Shuang.resource.schemeList).indexOf(this.config.scheme)].selected = true
    $('#mode-select')[Object.keys(Shuang.app.modeList).indexOf(this.config.mode)].selected = true
    $('#pic-switcher').checked = this.config.showPic === 'true'
    this.setScheme(Shuang.resource.schemeList[this.config.scheme], false)
    this.setMode(Shuang.app.modeList[this.config.mode].name)
    this.setPicVisible(this.config.showPic)
  },
  setScheme(schemeName, next = true) {
    this.config.scheme = Object.keys(Shuang.resource.schemeList)[Object.values(Shuang.resource.schemeList).indexOf(schemeName)]
    localStorage.setItem('scheme', this.config.scheme)
    const callback = () => {
      if (next) Shuang.app.action.next()
      this.updateTips()
    }
    importJS('js/scheme/' + this.config.scheme + '.js', callback)
  },
  setMode(modeName) {
    Shuang.core.history = []
    for (const [mode, m] of Object.entries(Shuang.app.modeList)) {
      if (m.name === modeName) {
        this.config.mode = mode
        break
      }
    }
    localStorage.setItem('mode', this.config.mode)
    $('#mode-desc').innerHTML = Shuang.app.modeList[this.config.mode].desc
    if (this.config.mode === 'hard-random-without-pinyin') {
      $('#q').hidden = 'hidden'
    } else {
      $('#q').hidden = ''
    }
  },
  setPicVisible(bool) {
    this.config.showPic = bool.toString()
    localStorage.setItem('showPic', this.config.showPic)
    if (this.config.showPic === 'false') {
      $('#keyboard').hidden = 'hidden'
    } else if (this.config.showPic === 'true') {
      $('#keyboard').hidden = ''
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
        newLine.className = 'line'
        newLine.innerHTML = tip
        tips.appendChild(newLine)
      }
    }
    $('#pic').src = 'img/' + this.config.scheme + '.png'
  }
}
