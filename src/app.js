/** last changed: 2019.8.23 */

/** States **/
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
      reload() {}
    },
    staticJS: 0,
    _init() {},
    modeList: [],
    action: {}
  }
}

const $ = document.querySelector.bind(document)

function importJS(src = '', onload = () => { Shuang.app.staticJS++ }) {
  src = `build/${src}.min.js`
  const newScript = document.createElement('script')
  Object.assign(newScript, {src, onload})
  document.body.appendChild(newScript)
}

const JS_FILES_COUNT = 6
/** Resources **/
importJS('dict')
importJS('scheme-list')
importJS('mode-list')

/** Modules **/
importJS('core')
importJS('setting')
importJS('action', () => {
  Shuang.app.staticJS++

  function init() {
    if (Shuang.app.staticJS === JS_FILES_COUNT) {
      Shuang.app.action.init()
      clearInterval(Shuang.app._init)
    }
  }
  Shuang.app._init = setInterval(init, 100)
})
