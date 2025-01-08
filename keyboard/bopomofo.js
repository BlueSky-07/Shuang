/**
 * https://www.ifreesite.com/phonetic/phonetic.htm
 */

const Mapping = {
  sheng: {
    b: 'ㄅ',
    p: 'ㄆ',
    m: 'ㄇ',
    f: 'ㄈ',
    d: 'ㄉ',
    t: 'ㄊ',
    n: 'ㄋ',
    l: 'ㄌ',
    g: 'ㄍ',
    k: 'ㄎ',
    h: 'ㄏ',
    j: 'ㄐ',
    q: 'ㄑ',
    x: 'ㄒ',
    zh: 'ㄓ',
    ch: 'ㄔ',
    sh: 'ㄕ',
    z: 'ㄗ',
    c: 'ㄘ',
    r: 'ㄖ',
    s: 'ㄙ',
    y: '一',
    w: 'ㄨ',
  },
  yun: {
    a: 'ㄚ',
    o: 'ㄛ',
    e: 'ㄜ',
    ê: 'ㄝ',
    ai: 'ㄞ',
    ei: 'ㄟ',
    ao: 'ㄠ',
    ou: 'ㄡ',
    an: 'ㄢ',
    en: 'ㄣ',
    ang: 'ㄤ',
    eng: 'ㄥ',
    er: 'ㄦ',

    i: 'ㄧ',
    u: 'ㄨ',
    v: 'ㄩ',

    ia: 'ㄧㄚ',
    io: 'ㄧㄛ',
    ie: 'ㄧㄝ',
    iai: 'ㄧㄞ',
    iao: 'ㄧㄠ',
    iu: 'ㄧㄡ',
    ian: 'ㄧㄢ',
    in: 'ㄧㄣ',
    iang: 'ㄧㄤ',
    ing: 'ㄧㄥ',
    ua: 'ㄨㄚ',
    uo: 'ㄨㄛ',
    uai: 'ㄨㄞ',
    ui: 'ㄨㄟ',
    uan: 'ㄨㄢ',
    un: 'ㄨㄣ',
    uang: 'ㄨㄤ',
    ong: 'ㄨㄥ',
    ve: 'ㄩㄝ',
    ue: 'ㄩㄝ',
    van: 'ㄩㄢ',
    vn: 'ㄩㄣ',
    iong: 'ㄩㄥ',
  }
}

function scanKeys(scheme = {
  row1: [], row2: [], row3: [],
}) {
  const yunCountMapping = {}
  for (const key of [...scheme.row1, ...scheme.row2, ...scheme.row3]) {
    for (const yun of [key.yun1, key.yun2]) {
      if (yun) {
        for (const y of yun.split(',')) {
          yunCountMapping[y] = yunCountMapping[y] ? yunCountMapping[y] + 1 : 1
        }
      }
    }
  }
  return yunCountMapping
}

function fixKeyYun(key = {
  yun1: '', yun2: ''
}, yunCountMapping = {}) {
  const convertedKey = { ...key }

  if (yunCountMapping['uan'] && !yunCountMapping['van']) {
    // 为 uan 追加 van
    if (convertedKey.yun1 === 'uan' && convertedKey.yun2 !== 'van') {
      if (!convertedKey.yun2) convertedKey.yun2 = 'van'
      else convertedKey.yun1 = 'uan,van'
    }
    if (convertedKey.yun2 === 'uan') {
      if (convertedKey.yun1 !== 'van') convertedKey.yun2 = 'uan,van'
    }
  }

  if (yunCountMapping['un'] && !yunCountMapping['vn']) {
    // 为 un 追加 vn
    if (convertedKey.yun1 === 'un' && convertedKey.yun2 !== 'vn') {
      if (!convertedKey.yun2) convertedKey.yun2 = 'vn'
      else convertedKey.yun1 = 'un,vn'
    }
    if (convertedKey.yun2 === 'un') {
      if (convertedKey.yun1 !== 'vn') convertedKey.yun2 = 'un,vn'
    }
  }

  if (yunCountMapping['ue'] && yunCountMapping['ve']) {
    // 去掉在同一键上重复的 ue 和 ve
    if ((convertedKey.yun1 === 'ue' && convertedKey.yun2 === 've') || (convertedKey.yun1 === 've' && convertedKey.yun2 === 'ue')) {
      convertedKey.yun1 = 'ue'
      delete convertedKey.yun2
    }
  }
  return convertedKey
}

function convertRow(
  row = [], yunCountMapping = {}
) {
  const converted = []
  for (const key of row) {
    const convertedKey = fixKeyYun(key, yunCountMapping)
    if (convertedKey.sheng) {
      convertedKey.sheng = Mapping.sheng[convertedKey.sheng] || convertedKey.sheng
    } else {
      const alphabet = convertedKey.alphabet.toLowerCase()
      const sheng = Mapping.sheng[alphabet]
      if (sheng) convertedKey.sheng = sheng
    }
    if (convertedKey.yun1) {
      convertedKey.yun1 = convertedKey.yun1.split(',').map(yun => Mapping.yun[yun] || yun).join(',')
    }
    if (convertedKey.yun2) {
      convertedKey.yun2 = convertedKey.yun2.split(',').map(yun => Mapping.yun[yun] || yun).join(',')
    }
    converted.push(convertedKey)
  }
  return converted
}

function convertTableRow(
  tableRow = [],
) {
  const converted = []
  for (const cell of tableRow) {
    const convertedCell = { ...cell }
    if (cell.yun) {
      convertedCell.yun = Mapping.yun[cell.yun] || cell.yun
    }
    if (cell.pinyin) {
      if (['zh', 'ch', 'sh'].some(sheng => convertedCell.pinyin.startsWith(sheng))) {
        const yun = convertedCell.pinyin.slice(2)
        convertedCell.pinyin = Mapping.sheng[sheng] + (Mapping.yun[yun] || '?')
      } else {
        const sheng = convertedCell.pinyin[0]
        const yun = convertedCell.pinyin.slice(1)
        convertedCell.pinyin = (Mapping.sheng[sheng] || '?') + (Mapping.yun[yun] || '?')
      }
    }
    converted.push(convertedCell)
  }
  return converted
}

function convertScheme(scheme = {
  row1: [], row2: [], row3: [],
}) {
  const yunCountMapping = scanKeys(scheme)
  return {
    ...scheme,
    name: scheme.name + '.bopomofo',
    row1: convertRow(scheme.row1, yunCountMapping),
    row2: convertRow(scheme.row2, yunCountMapping),
    row3: convertRow(scheme.row3, yunCountMapping),
    table1: convertTableRow(scheme.table1),
    table2: convertTableRow(scheme.table2),
    table3: convertTableRow(scheme.table3),
    const: {
      ...scheme.const,
      shengFontName: 'ZH',
      yun1FontName: 'ZH',
      yun2FontName: 'ZH',
      tableCellYunFontName: 'ZH',
      tableCellPinyinFontName: 'ZH',
    },
    ...scheme.hant,
  }
}

module.exports = {
  Mapping,
  convertScheme,
}