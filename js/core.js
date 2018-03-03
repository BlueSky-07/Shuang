"use strict";

/** last changed: 2018.3.3 */

var model = function () {
  return {
    ugmu: '',
    ypmu: '',
    isTeuu: false,
    scheme_ugmu: [],
    scheme_ypmu: [],
    scheme_teuu: [],
    example: '',
    input_ugmu: '',
    input_ypmu: '',
    schemeId: -1,
    getReady: function () {
      this.ugmu = '';
      this.ypmu = '';
      this.isTeuu = false;
      this.scheme_ugmu = [];
      this.scheme_ypmu = [];
      this.scheme_teuu = [];
      this.example = '';
      this.input_ugmu = '';
      this.input_ypmu = '';
      this.schemeId = -1;
    },
    initRandom: function () {
      this.ugmu = dict.list[Math.floor(Math.random() * dict.list.length)];
      this.ypmu = dict[this.ugmu].list[Math.floor(Math.random() * dict[this.ugmu].list.length)];
    },
    initHardRandom: function () {
      while (this.ugmu === '' || this.ypmu.length === 1) {
        this.initRandom();
      }
    },
    initByIds: function (ugmuId, ypmuId) {
      if (!checkIds(ugmuId, ypmuId)) {
        return false;
      } else {
        this.ugmu = dict.list[ugmuId];
        this.ypmu = dict[this.ugmu].list[ypmuId];
        return true;
      }
    },
    initScheme: function () {
      if (this.ugmu === '') {
        this.isTeuu = true;
      }
      if (this.isTeuu) {
        this.scheme_teuu = getSchemeByTeuu(this.schemeId, this.ypmu);
      }
      else {
        this.scheme_ugmu = getSchemeByUgmu(this.schemeId, this.ugmu);
        this.scheme_ypmu = getSchemeByYpmu(this.schemeId, this.ypmu);
      }
    },
    initExample: function () {
      this.example = getExampleByPnyn(this.ugmu, this.ypmu);
    },
    beReady: function (schemeId) {
      this.schemeId = schemeId;
      this.initScheme(schemeId);
      this.initExample();
    },
    beforeCheck: function () {
      if (this.isTeuu) {
        return;
      }
      // special check
      if (this.scheme_ypmu === 'u') {
        if ('jqxy'.indexOf(this.ugmu) !== -1) {
          this.isTeuu = true;
          this.scheme_teuu = [this.scheme_ugmu + this.scheme_ypmu, this.scheme_ugmu + getSchemeByYpmu(this.schemeId, 'v')];
        }
      }
      // danqudpn, jmdk3, jmdk6
      if (schemes.data.fzjm !== undefined && schemes.data.fzjm[this.ugmu + this.ypmu] !== undefined) {
        this.isTeuu = true;
        this.scheme_teuu = schemes.data.fzjm[this.ugmu + this.ypmu];
      }
    },
    check: function () {
      this.beforeCheck();
      if (this.isTeuu) {
        if (Array.isArray(this.scheme_teuu)) {
          for (var item in this.scheme_teuu) {
            if (this.input_ugmu === this.scheme_teuu[item][0] && this.input_ypmu === this.scheme_teuu[item][1]) {
              return true;
            }
          }
        } else {
          return this.input_ugmu === this.scheme_teuu[0] && this.input_ypmu === this.scheme_teuu[1];
        }
      } else {
        return isRight(this.input_ugmu, this.scheme_ugmu) && isRight(this.input_ypmu, this.scheme_ypmu);
      }
      return false;
    },
    getUgmu: function () {
      return this.ugmu.substr(0, 1).toUpperCase().concat(this.ugmu.substr(1, this.ugmu.length).toLowerCase());
    },
    getYpmu: function () {
      return this.ypmu;
    },
    getExample: function () {
      return this.example;
    },
    setInputUgmu: function (input_ugmu) {
      this.input_ugmu = input_ugmu === '' ? '' : input_ugmu.toLowerCase();
    },
    setInputYpmu: function (input_ypmu) {
      this.input_ypmu = input_ypmu === '' ? '' : input_ypmu.toLowerCase();
    },
    isSame: function (a, b) {
      return a.ugmu === b.ugmu && a.ypmu === b.ypmu;
    }
  };
};

function checkIds(ugmuId, ypmuId) {
  if (ugmuId >= 0 && ugmuId < dict.list.length) {
    if (ypmuId >= 0 && ypmuId < dict[dict.list[ugmuId]].list.length) {
      return true;
    }
  }
  return false;
}

function getSchemeByUgmu(schemeId, ugmu) {
  var val = schemes.data.ugmu[ugmu];
  return val === undefined ? '' : val;
}

function getSchemeByYpmu(schemeId, ypmu) {
  var val = schemes.data.ypmu[ypmu];
  return val === undefined ? '' : val;
}

function getSchemeByTeuu(schemeId, ypmu) {
  var val = schemes.data.teuu[ypmu];
  if (val === undefined) {
    return '';
  } else if (Array.isArray(val)) {
    var result = [];
    for (var item in val) {
      result.push(val[item]);
    }
    return result;
  } else {
    return val;
  }
}

function getExampleByPnyn(ugmu, ypmu) {
  return dict[ugmu][ypmu];
}

function isRight(x, scheme_x) {
  if (x.length === 1) {
    if (Array.isArray(scheme_x)) {
      for (var i in scheme_x) {
        if (x === scheme_x[i]) {
          return true;
        }
      }
    }
    else {
      return x === scheme_x;
    }
  }
  return false;
}