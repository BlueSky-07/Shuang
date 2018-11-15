/** last changed: 2018.11.11 */

const Shuang = {
  resource: {
    dict: {},
    schemeList: {},
    scheme: {},
    emoji: {
      right: '✅', wrong: '❎'
    }
  },
  core: {
    model: {},
    current: {},
    order: {
      shengIndex: 0,
      yunIndex: 0
    },
    history: []
  },
  app: {
    setting: {
      config: {},
      reload: new Function()
    },
    staticJS: 0,
    _init: new Function(),
    modeList: [],
    action: {}
  }
}

const $ = document.querySelector.bind(document)

function importJS(src = '', onload = new Function()) {
  src = src + '?time=' + Date.now()
  const newScript = document.createElement('script')
  Object.assign(newScript, {src, onload})
  document.body.appendChild(newScript)
}

importJS('build/dict.min.js', () => {Shuang.app.staticJS++})
importJS('build/schemeList.min.js', () => {Shuang.app.staticJS++})
importJS('build/modeList.min.js', () => {Shuang.app.staticJS++})
importJS('build/core.min.js', () => {Shuang.app.staticJS++})
importJS('build/setting.min.js', () => {Shuang.app.staticJS++})
importJS('build/action.min.js', () => {
  Shuang.app.staticJS++
  function init() {
    if (Shuang.app.staticJS === 6) {
      Shuang.app.action.init()
      clearInterval(Shuang.app._init)
    }
  }
  Shuang.app._init = setInterval(init, 10)
})
