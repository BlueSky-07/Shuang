"use strict";

/** last changed: 2018.3.1 */

/**
 *
 * list: 方案名称汉字表达
 *
 * getIdByName: 通过 {字母表达} 获取索引
 *
 * getNameById: 通过 {索引} 获取字母表达
 *
 * data: 方案内容，通过 {字母表达}.{声母/韵母/零声母}.{要查询的字符} 获取该字符的双拼码
 *
 * tips: 方案特殊说明，通过 {字母表达} 获取
 *
 */

var xcvsTip = "<i>小众方案 - 常用输入法可能不内置</i>";

var schemes = {
  list: [
    '自然码'
    , '微软双拼'
    , '搜狗双拼'
    , '小鹤双拼'
    , '智能ABC'
    , '拼音加加'
    , '紫光双拼'
    , '大牛双拼'
    , '键道3'
    , '开源小鹳'
    , '小浪双拼'
    , '键道6'
  ],
  getIdByName: {
    zirjma: 0
    , wzrrudpn: 1
    , sbgbudpn: 2
    , xcheudpn: 3
    , vingabc: 4
    , pnynjwjw: 5
    , zigdudpn: 6
    , danqudpn: 7
    , jmdk3: 8
    , klyrxcgr: 9
    , xclhudpn: 10
    , jmdk6: 11
  },
  getNameById: [
    'zirjma'
    , 'wzrrudpn'
    , 'sbgbudpn'
    , 'xcheudpn'
    , 'vingabc'
    , 'pnynjwjw'
    , 'zigdudpn'
    , 'danqudpn'
    , 'jmdk3'
    , 'klyrxcgr'
    , 'xclhudpn'
    , 'jmdk6'
  ],
  data: {},
  tips: {
    sbgbudpn: [
      'iOS 11 自带方案'
    ]
    , danqudpn: [
      xcvsTip
    ]
    , jmdk3: [
      'jqxy 遇 u 以 v 替代'
      , xcvsTip
    ]
    , klyrxcgr: [
      xcvsTip
    ]
    , xclhudpn: [
      xcvsTip
    ]
    , jmdk6: [
      'jqxy 遇 u 以 v 替代'
      , xcvsTip
    ]
  }
};