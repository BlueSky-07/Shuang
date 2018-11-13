/** last changed: 2018.11.10 */

Shuang.core.model = class {
  constructor(sheng = '', yun = '') {
    this.sheng = sheng.toLowerCase()
    this.yun = yun.toLowerCase()
    this.dict = Shuang.resource.dict[this.sheng][this.yun]
    this.scheme = new Set()
    this.view = {
      sheng: this.sheng ? this.sheng[0].toUpperCase() + this.sheng.slice(1) : '',
      yun: this.yun
    }
  }
  
  beforeJudge() {
    this.scheme.clear()
    const schemeName = Shuang.app.setting.config.scheme
    const schemeDetail = Shuang.resource.scheme[schemeName].detail
    if (schemeDetail.other[this.sheng + this.yun]) {
      if (Array.isArray(schemeDetail.other[this.sheng + this.yun])) {
        for (const other of schemeDetail.other[this.sheng + this.yun]) {
          this.scheme.add(other)
        }
      } else {
        this.scheme.add(schemeDetail.other[this.sheng + this.yun])
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
  
  judge(_sheng = '', _yun = '') {
    this.beforeJudge()
    _sheng = _sheng.toLowerCase()
    _yun = _yun.toLowerCase()
    return this.scheme.has(_sheng + _yun)
  }
  
  static getRandom() {
    const sheng = Shuang.resource.dict.list[Math.floor(Math.random() * Shuang.resource.dict.list.length)]
    const yun = Shuang.resource.dict[sheng].list[Math.floor(Math.random() * Shuang.resource.dict[sheng].list.length)]
    const model = new Shuang.core.model(sheng, yun)
    return Shuang.core.model.isSame(model, Shuang.core.current) ? Shuang.core.model.getRandom() : model
  }
  
  static getHardRandom() {
    let model = Shuang.core.model.getRandom()
    while (model.sheng === '' || model.yun.length === 1) {
      model = Shuang.core.model.getRandom()
    }
    // babel compile bug
    return model
  }
  
  static getByOrder() {
    while (true) {
      const sheng = Shuang.resource.dict.list[Shuang.core.order.shengIndex]
      if (sheng !== undefined) {
        const yun = Shuang.resource.dict[sheng].list[Shuang.core.order.yunIndex]
        if (yun) {
          Shuang.core.order.yunIndex++
          return new Shuang.core.model(sheng, yun)
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
