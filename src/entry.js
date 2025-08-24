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
    action: {},
    favorites: {
      storageKey: 'favorites',
      list: [],
      practiceIndex: 0,
      load() {
        try {
          const raw = localStorage.getItem(this.storageKey)
          this.list = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : []
        } catch (e) {
          this.list = []
        }
      },
      save() {
        try { localStorage.setItem(this.storageKey, JSON.stringify(this.list)) } catch (e) {}
      },
      getModelByCode(code = '') {
        if (!code || typeof code !== 'string') return null
        const dictList = Shuang.resource.dict
        if (!dictList || !dictList.list) return null
        for (const s of dictList.list) {
          if (code.startsWith(s)) {
            const y = code.slice(s.length)
            if (dictList[s] && dictList[s][y]) {
              return new Shuang.core.model(s, y)
            }
          }
        }
        return null
      },
      validate(code = '') { return !!this.getModelByCode(code) },
      has(code = '') { return this.list.includes(code) },
      add(code = '') {
        if (!code) return
        if (!this.has(code)) {
          this.list.push(code)
          this.save()
        }
      },
      merge(codes = []) {
        if (!Array.isArray(codes)) return
        const exists = new Set(this.list)
        for (let c of codes) {
          if (!c || typeof c !== 'string') continue
          c = c.toLowerCase()
          if (this.validate(c) && !exists.has(c)) {
            exists.add(c)
            this.list.push(c)
          }
        }
        this.save()
      },
      replace(codes = []) {
        if (!Array.isArray(codes)) return
        const next = []
        const seen = new Set()
        for (let c of codes) {
          if (!c || typeof c !== 'string') continue
          c = c.toLowerCase()
          if (this.validate(c) && !seen.has(c)) {
            seen.add(c)
            next.push(c)
          }
        }
        this.list = next
        this.save()
      },
      resetPractice() { this.practiceIndex = 0 },
      exportJson() { return JSON.stringify(this.list) },
      importFromJson(json = '[]') {
        try {
          const data = JSON.parse(json)
          if (Array.isArray(data)) this.merge(data)
        } catch (e) {}
      },
      importFromText(text = '') {
        if (!text) return
        const arr = text.toLowerCase().split(/[^a-z]+/).filter(Boolean)
        this.merge(arr)
      },
      remove(code = '') {
        if (!code) return
        const i = this.list.indexOf(code)
        if (i >= 0) {
          this.list.splice(i, 1)
          this.save()
          if (this.practiceIndex >= this.list.length) this.practiceIndex = 0
        }
      },
      toggle(code = '') { this.has(code) ? this.remove(code) : this.add(code) },
      clear() { this.list = []; this.practiceIndex = 0; this.save() },
    }
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
