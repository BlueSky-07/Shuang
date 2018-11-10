/** last changed: 2018.11.10 */

const Shuang = {
  resource: {
    dict: {},
    schemeList: {},
    scheme: {}
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
    modeList: [],
    action: {}
  }
}

$ = document.querySelector.bind(document)

function importJS(src = '', onload = new Function()) {
  src = src + '?time=' + Date.now()
  const newScript = document.createElement('script')
  Object.assign(newScript, {src, onload})
  document.body.appendChild(newScript)
}

importJS('js/dict.js')
importJS('js/schemeList.js')
importJS('js/modeList.js')
importJS('js/core.js')
importJS('js/setting.js')
importJS('js/action.js', () => {
  Shuang.app.action.init()
})
