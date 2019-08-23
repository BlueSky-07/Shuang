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
