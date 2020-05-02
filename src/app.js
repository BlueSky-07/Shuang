
/************************ entry.js ************************/
/** last changed: 2020.5.3 */

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
      reload() { }
    },
    staticJS: 0,
    modeList: [],
    action: {}
  }
}

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function importJS(src = '', onload = () => { Shuang.app.staticJS++ }) {
  src = `build/${src}.min.js`
  const newScript = document.createElement('script')
  Object.assign(newScript, { src, onload })
  document.body.appendChild(newScript)
}
/******************** EOF entry.js ************************/
/************************ dict.js ************************/
/** last changed: 2018.11.10 */

/**
 *
 * dict 包含所有声母，list 为其列表数组
 *
 * dict.{声母} 包含所有韵母，list 为其列表数组
 *
 * dict.{声母}.{韵母} 包含其汉字样例
 *                   [{生僻字 / 多音字}] 将不会在无拼音模式中出现
 *
 */

Shuang.resource.dict = {
  '': {
    a: '啊', ai: '爱', an: '安', ang: '昂', ao: '奥',
    e: '鹅', ei: ['诶'], en: '嗯',
    // eng:['鞥'],
    er: '耳',
    o: '哦', ou: '欧'
  },
  b: {
    a: '爸', ai: '白', an: '班', ang: '帮', ao: '包',
    ei: '被', en: '本', eng: '崩',
    i: '必', ian: '变', iao: '表', ie: '别', in: '宾', ing: '冰',
    o: '播',
    u: '不'
  },
  c: {
    a: '擦', ai: '彩', an: '餐', ang: '苍', ao: '草',
    e: '测', en: ['岑'], eng: '层',
    i: '词',
    ong: '从', ou: '凑',
    u: '粗', uan: '窜', ui: '催', un: '村', uo: '错'
  },
  d: {
    a: '大', ai: '代', an: '但', ang: '当', ao: '到',
    e: '德', ei: ['得'],
    // en: ['扽'],
    eng: '等',
    i: '帝', ia: ['嗲'], ian: '点', iao: '钓', ie: '叠', ing: '顶', iu: '丢',
    ong: '东', ou: '斗',
    u: '读', uan: '短', ui: '对', un: '顿', uo: '多'
  },
  f: {
    a: '法', an: '翻', ang: '方',
    ei: '飞', en: '分', eng: '风',
    o: '佛', ou: ['否'],
    u: '服'
  },
  g: {
    a: ['旮'], ai: '该', an: '干', ang: '刚', ao: '高',
    e: '个', ei: ['给'], en: '跟', eng: '更',
    ong: '公', ou: '狗',
    u: '谷', ua: '瓜', uai: '怪', uan: '关', uang: '光', ui: '鬼', un: '滚', uo: '国'
  },
  h: {
    a: '哈', ai: '海', an: '汉', ang: '杭', ao: '好',
    e: '和', ei: '黑', en: '很', eng: '横',
    ong: '红', ou: '猴',
    u: '胡', ua: '华', uai: '坏', uan: '欢', uang: '黄', ui: '灰', un: '昏', uo: '火'
  },
  j: {
    i: '机', ia: '家', ian: '间', iang: '江', iao: '交', ie: '杰', in: '金', ing: '京', iong: '窘', iu: '旧',
    u: '居', uan: '卷', ue: '绝', un: '军'
  },
  k: {
    a: ['卡'], ai: '开', an: '看', ang: '康', ao: '靠',
    e: '科',
    // ei: ['尅'],
    en: '肯', eng: '坑',
    ong: '空', ou: '口',
    u: '哭', ua: '夸', uai: '快', uan: '宽', uang: '框', ui: '亏', un: '困', uo: '阔'
  },
  l: {
    a: '拉', ai: '来', an: '蓝', ang: '狼', ao: '老',
    e: ['乐'], ei: '累', eng: '冷',
    i: '里', ia: ['俩'], ian: '连', iang: '凉', iao: '聊', ie: '列', in: '林', ing: '领', iu: '刘',
    o: '咯', ong: '龙', ou: '楼',
    u: '路', uan: '乱', un: '轮', uo: '罗',
    v: '绿', ve: '略'
  },
  m: {
    a: '马', ai: '买', an: '满', ang: '忙', ao: '猫',
    e: '么', ei: '没', en: '门', eng: '梦',
    i: '米', ian: '面', iao: '秒', ie: '灭', in: '民', ing: '明', iu: '谬',
    o: '魔', ou: '某',
    u: '木'
  },
  n: {
    a: '拿', ai: '乃', an: '南', ang: '囊', ao: '脑',
    e: ['呢'], ei: '内', en: '嫩', eng: '能',
    i: '你', ian: '年', iang: '娘', iao: '鸟', ie: '聂', in: '您', ing: '宁', iu: '牛',
    ong: '农',
    // ou: ['耨']
    u: '努', uan: '暖', uo: '挪',
    v: '女', ve: '虐'
  },
  p: {
    a: '爬', ai: '牌', an: '潘', ang: '胖', ao: '炮',
    ei: '配', en: '喷', eng: '鹏',
    i: '皮', ian: '片', iao: '飘', ie: '撇', in: '拼', ing: '凭',
    o: '破', ou: '剖',
    u: '普'
  },
  q: {
    i: '齐', ia: '洽', ian: '前', iang: '墙', iao: '桥', ie: '且', in: '琴', ing: '轻', iong: '穷', iu: '秋',
    u: '去', uan: '全', ue: '确', un: '群'
  },
  r: {
    an: '然', ang: '让', ao: '绕',
    e: '热', en: '仁', eng: '仍',
    i: '日',
    ong: '容', ou: '肉',
    u: '如',
    // ua: ['挼']
    uan: '软', ui: '睿', un: '润', uo: '若'
  },
  s: {
    a: '萨', ai: '赛', an: '伞', ang: '桑', ao: '扫',
    e: '色', en: '森', eng: '僧',
    i: '司',
    ong: '松', ou: '搜',
    u: '苏', uan: '酸', ui: '岁', un: '孙', uo: '锁'
  },
  t: {
    a: '它', ai: '台', an: '谈', ang: '汤', ao: '涛',
    e: '特', eng: '疼',
    i: '体', ian: '天', iao: '条', ie: '贴', ing: '听',
    ong: '通', ou: '头',
    u: '图', uan: '团', ui: '推', un: '吞', uo: '拖'
  },
  w: {
    a: '哇', ai: '外', an: '万', ang: '王',
    ei: '为', en: '文', eng: '翁',
    o: '我',
    u: '无'
  },
  x: {
    i: '喜', ia: '夏', ian: '现', iang: '向', iao: '小', ie: '谢', in: '心', ing: '星', iong: '兄', iu: '秀',
    u: '徐', uan: '选', ue: '学', un: '寻'
  },
  y: {
    a: '压', an: '燕', ang: '羊', ao: '药',
    e: '页',
    i: '以', in: '音', ing: '赢',
    o: '哟', ong: '用', ou: '有',
    u: '与', uan: '元', ue: '月', un: '云'
  },
  z: {
    a: '咋', ai: '在', an: '赞', ang: '脏', ao: '造',
    e: '则', ei: '贼', en: '怎', eng: '增',
    i: '子',
    ong: '宗', ou: '走',
    u: '组', uan: '钻', ui: '最', un: '遵', uo: '做'
  },
  ch: {
    a: '茶', ai: '拆', an: '产', ang: '场', ao: '超',
    e: '车', en: '陈', eng: '成',
    i: '吃',
    ong: '充', ou: '丑',
    u: '出', ua: ['欻'], uai: '踹', uan: '穿', uang: '床', ui: '吹', un: '纯', uo: '戳'
  },
  sh: {
    a: '沙', ai: '晒', an: '山', ang: '上', ao: '少',
    e: '设', en: '深', eng: '生',
    i: '是',
    ou: '收',
    u: '书', ua: '刷', uai: '帅', uan: '栓', uang: '双', ui: '水', un: '顺', uo: '说'
  },
  zh: {
    a: '炸', ai: '摘', an: '占', ang: '张', ao: '赵',
    e: '者',
    // ei: ['这']
    en: '真', eng: '正',
    i: '之',
    ong: '中', ou: '周',
    u: '主', ua: '爪', uai: '拽', uan: '专', uang: '装', ui: '追', un: '准', uo: '捉'
  }
}
Object.entries(Shuang.resource.dict).forEach(([sheng, yunList]) => Shuang.resource.dict[sheng].list = Object.keys(yunList))
Shuang.resource.dict.list = Object.keys(Shuang.resource.dict)
/******************** EOF dict.js ************************/
/************************ scheme-list.js ************************/
/** last changed: 2019.11.26 */
/*
  常见方案
  小众方案*
  爱好者方案**
 */

Shuang.resource.schemeList = {
  ziranma: '自然码',
  sougou: '搜狗双拼',
  weiruan: '微软双拼',
  xiaohe: '小鹤双拼',
  zhinengabc: '智能ABC',
  pinyinjiajia: '拼音加加',
  ziguang: '紫光双拼',
  guobiao: '国标双拼*',
  xiaolang: '小浪双拼*',
  daniu: '大牛双拼*',
  jiandao3: '键道双拼3**',
  jiandao6: '键道双拼6**',
  xiaoguan: '开源小鹳**',
  xiaoyue: '小月双拼**',
  yunbiaokuaipin: '韵标块拼**'
}
/******************** EOF scheme-list.js ************************/
/************************ mode-list.js ************************/
/** last changed: 2018.11.10 */

Shuang.app.modeList = {
  'all-random': {
    name: '全部随机', desc: '全部拼音组合'
  },
  'all-order': {
    name: '全部顺序', desc: '全部拼音组合'
  },
  'hard-random': {
    name: '困难随机', desc: '韵母需转换'
  },
  'hard-random-without-pinyin': {
    name: '无拼音', desc: '无拼音提示'
  }
}
/******************** EOF mode-list.js ************************/
/************************ core.js ************************/
/** last changed: 2019.8.23 */

Shuang.core.model = class Model {
  constructor(sheng = '', yun = '') {
    this.sheng = sheng.toLowerCase()
    this.yun = yun.toLowerCase()
    this.dict = Shuang.resource.dict[this.sheng][this.yun]
    this.scheme = new Set()
    this.view = {
      sheng: this.sheng.toUpperCase().slice(0, 1) + this.sheng.slice(1),
      yun: this.yun
    }
  }
  
  beforeJudge() {
    this.scheme.clear()
    const schemeName = Shuang.app.setting.config.scheme
    const schemeDetail = Shuang.resource.scheme[schemeName].detail
    const pinyin = this.sheng + this.yun
    if (schemeDetail.other[pinyin]) {
      if (Array.isArray(schemeDetail.other[pinyin])) {
        schemeDetail.other[pinyin].forEach(other => this.scheme.add(other))
      } else {
        this.scheme.add(schemeDetail.other[pinyin])
      }
    } else {
      for (const s of schemeDetail.sheng[this.sheng]) {
        for (const y of schemeDetail.yun[this.yun]) {
          this.scheme.add(s + y)
        }
      }
      if (this.yun === 'u' && 'jqxy'.includes(this.sheng)) {
        for (const s of schemeDetail.sheng[this.sheng]) {
          for (const y of schemeDetail.yun.v) {
            this.scheme.add(s + y)
          }
        }
      }
    }
  }
  
  judge(sheng = '', yun = '') {
    this.beforeJudge()
    return this.scheme.has(sheng.toLowerCase() + yun.toLowerCase())
  }
  
  static getRandom() {
    const sheng = Shuang.resource.dict.list[Math.floor(Math.random() * Shuang.resource.dict.list.length)]
    const yun = Shuang.resource.dict[sheng].list[Math.floor(Math.random() * Shuang.resource.dict[sheng].list.length)]
    const instance = new Model(sheng, yun)
    return Model.isSame(instance, Shuang.core.current) ? Model.getRandom() : instance
  }
  
  static getHardRandom() {
    let instance = undefined
    do {
      instance = Model.getRandom()
    } while (instance.sheng === '' || instance.yun.length === 1)
    return instance
  }
  
  static getByOrder() {
    while (true) {
      const sheng = Shuang.resource.dict.list[Shuang.core.order.shengIndex]
      if (sheng !== undefined) {
        const yun = Shuang.resource.dict[sheng].list[Shuang.core.order.yunIndex]
        if (yun) {
          Shuang.core.order.yunIndex++
          return new Model(sheng, yun)
        }
      }
      if (Shuang.core.order.yunIndex === 0) {
        Shuang.core.order.shengIndex = 0
      } else {
        Shuang.core.order.shengIndex++
        Shuang.core.order.yunIndex = 0
      }
    }
  }
  
  static isSame(a, b) {
    return a.sheng === b.sheng && a.yun === b.yun
  }
}
/******************** EOF core.js ************************/
/************************ setting.js ************************/
/** last changed: 2020.5.3 */

Shuang.app.setting = {
  config: {},
  reload() {
    /** Reading Storage or Using Default **/
    this.config = {
      scheme: readStorage('scheme') || 'ziranma',
      mode: readStorage('mode') || 'all-random',
      showPic: readStorage('showPic') || 'true',
      darkMode: readStorage('darkMode') || (new Date().getHours() >= 6 && new Date().getHours() <= 22 ? 'false' : 'true'),
      autoNext: readStorage('autoNext') || 'true',
      autoClear: readStorage('autoClear') || 'true',
      showKeys: readStorage("showKeys") || "true",
    }
    /** Applying Settings :: Changing UI **/
    const { scheme, mode, showPic, darkMode, autoNext, autoClear, showKeys } = this.config
    Array.prototype.find.call($('#scheme-select').children,
      schemeOption => Shuang.resource.schemeList[scheme].startsWith(schemeOption.innerText)
    ).selected = true
    $('#mode-select')[Object.keys(Shuang.app.modeList).indexOf(mode)].selected = true
    $('#pic-switcher').checked = showPic === 'true'
    $('#dark-mode-switcher').checked = darkMode === 'true'
    $('#auto-next-switcher').checked = autoNext === 'true'
    $('#auto-clear-switcher').checked = autoClear === 'true'
    $('#show-keys').checked = showKeys === 'true'
    /** Applying Settings :: Invoking Actions  **/
    this.setScheme(Shuang.resource.schemeList[scheme], false)
    this.setMode(Shuang.app.modeList[mode].name)
    this.setPicVisible(showPic)
    this.setDarkMode(darkMode)
    this.setAutoNext(autoNext)
    this.setAutoClear(autoClear)
    this.setShowKeys(showKeys)
  },
  setScheme(schemeName, next = true) {
    this.config.scheme = Object.keys(Shuang.resource.schemeList)[
      Object.values(Shuang.resource.schemeList)
        .findIndex(scheme => scheme.startsWith(schemeName))
    ]
    importJS('scheme/' + this.config.scheme, () => {
      if (next) Shuang.app.action.next()
      Shuang.core.current.beforeJudge()
      this.updateKeysHint()
      this.updateTips()
    })
    writeStorage('scheme', this.config.scheme)
  },
  setMode(modeName) {
    Shuang.core.history = []
    for (const [mode, { name }] of Object.entries(Shuang.app.modeList)) {
      if (name === modeName) {
        this.config.mode = mode
        $('#mode-desc').innerText = Shuang.app.modeList[mode].desc
        if (mode === 'hard-random-without-pinyin') {
          $('#q').style.display = 'none'
        } else {
          $('#q').style.display = 'block'
        }
        break
      }
    }
    writeStorage('mode', this.config.mode)
  },
  setPicVisible(bool) {
    this.config.showPic = bool.toString()
    if (this.config.showPic === 'false') {
      $('#keyboard').style.display = 'none'
    } else if (this.config.showPic === 'true') {
      $('#keyboard').style.display = 'block'
    }
    writeStorage('showPic', this.config.showPic)
  },
  setDarkMode(bool) {
    this.config.darkMode = bool.toString()
    if (this.config.darkMode === 'true') {
      $('body').setAttribute('class', 'dark-mode')
    } else if (this.config.darkMode === 'false') {
      $('body').setAttribute('class', '')
    }
    writeStorage('darkMode', this.config.darkMode)
  },
  setAutoNext(bool) {
    this.config.autoNext = bool.toString()
    writeStorage('autoNext', this.config.autoNext)
  },
  setAutoClear(bool) {
    this.config.autoClear = bool.toString()
    writeStorage('autoClear', this.config.autoClear)
  },
  setShowKeys(bool) {
    this.config.showKeys = bool.toString()
    writeStorage('showKeys', this.config.showKeys)
    this.updateKeysHint()
  },
  updateKeysHint() {
    const keys = $$('.key')
    keys.forEach((key) => key.style.visibility = 'hidden')
    if (this.config.showKeys === 'false') return
    const qwerty = 'qwertyuiopasdfghjkl;zxcvbnm'
    for (const [sheng, yun] of Shuang.core.current.scheme) {
      keys[qwerty.indexOf(sheng)].style.visibility = 'visible'
      keys[qwerty.indexOf(yun)].style.visibility = 'visible'
    }
    this.updateKeysHintLayoutRatio()
  },
  updateKeysHintLayoutRatio() {
    // TODO: 修改样式而不是计算
    const MIN_WIDTH = 310
    const MAX_WIDTH = 740
    const OFFSET_WIDTH = 300
    const OFFSET = 30
    let left = 0
    let keysHintRatio = window.outerWidth / MAX_WIDTH
    if (window.outerWidth > MAX_WIDTH) {
      keysHintRatio = 1
    } else if (window.outerWidth < MIN_WIDTH) {
      keysHintRatio = MIN_WIDTH / MAX_WIDTH
      if (window.outerWidth > OFFSET_WIDTH) {
        left = (MIN_WIDTH - window.outerWidth) / (MIN_WIDTH - OFFSET_WIDTH) * OFFSET
      } else {
        left = OFFSET
      }
    }
    $('.keys').style.zoom = keysHintRatio
    $('.keys').style.left = left + 'px'
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
    $('#pic').setAttribute('src', `img/${this.config.scheme}.png`)
  }
}

function readStorage(key = '') { return localStorage.getItem(key) }
function writeStorage(key = '', value = '') { localStorage.setItem(key, value) }
/******************** EOF setting.js ************************/
/************************ action.js ************************/
/** last changed: 2020.5.3 */

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
    $('#show-keys').addEventListener('change', e => {
      Shuang.app.setting.setShowKeys(e.target.checked)
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
    window.addEventListener('resize', Shuang.app.setting.updateKeysHintLayoutRatio)
    window.resizeTo(window.outerWidth, window.outerHeight)

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

    // Update Keys Hint
    Shuang.core.current.beforeJudge()
    Shuang.app.setting.updateKeysHint()
  },
  qrShow(targetId) {
    $('#' + targetId).style.display = 'block'
  },
  qrHide(target) {
    target.style.display = 'none'
  }
}
/******************** EOF action.js ************************/
/************************ - *************************/
Shuang.app.action.init()
/******************** EOF - *************************/
