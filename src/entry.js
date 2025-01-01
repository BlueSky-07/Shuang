/** last changed: 2025.1.1 */

/** States **/
const Shuang = {
  resource: {
    dict: {},
    dictHant: {},
    bopomofo: {},
    schemeList: {},
    scheme: {},
    keyboardLayoutList: {},
    keyboardLayout: {},
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
    history: [],
    keyboardLayout: {}
  },
  app: {
    setting: {
      config: {},
      reload() { }
    },
    importedJS: [],
    modeList: [],
    action: {}
  },
}

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function importJS(src = '', onload = () => {}) {
  if (Shuang.app.importedJS.includes(src)) {
    onload()
    return
  } else {
    Shuang.app.importedJS.push(src)
  }
  src = `build/${src}.min.js`
  const newScript = document.createElement('script')
  Object.assign(newScript, { src, onload })
  document.body.appendChild(newScript)
}
