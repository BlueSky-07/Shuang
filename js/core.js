"use strict";

/** last changed: 2018.3.25 */

var getNewModel = function () {
  return {
    ugmu: ''
    , ypmu: ''
    , isTeuu: false
    , scheme_ugmu: []
    , scheme_ypmu: []
    , scheme_teuu: []
    , example: ''
    , input_ugmu: ''
    , input_ypmu: ''
    , getReady: function () {
      this.ugmu = '';
      this.ypmu = '';
      this.isTeuu = false;
      this.scheme_ugmu = [];
      this.scheme_ypmu = [];
      this.scheme_teuu = [];
      this.example = '';
      this.input_ugmu = '';
      this.input_ypmu = '';
    }
    , initRandom: function () {
      this.ugmu = dict.list[Math.floor(Math.random() * dict.list.length)];
      this.ypmu = dict[this.ugmu].list[Math.floor(Math.random() * dict[this.ugmu].list.length)];
    }
    , initHardRandom: function () {
      while (this.ugmu === '' || this.ypmu.length === 1) {
        this.initRandom();
      }
    }
    , initByIds: function (ugmuId, ypmuId) {
      if (ugmuId >= 0 && ugmuId < dict.list.length) {
        if (ypmuId >= 0 && ypmuId < dict[dict.list[ugmuId]].list.length) {
          this.ugmu = dict.list[ugmuId];
          this.ypmu = dict[this.ugmu].list[ypmuId];
          return true;
        }
      }
      return false;
    }
    , initScheme: function () {
      if (this.ugmu === '') {
        this.isTeuu = true;
      }
      if (this.isTeuu) {
        this.scheme_teuu = scheme.detail.teuu[this.ypmu];
      } else {
        this.scheme_ugmu = scheme.detail.ugmu[this.ugmu];
        this.scheme_ypmu = scheme.detail.ypmu[this.ypmu];
      }
    }
    , initExample: function () {
      this.example = dict[this.ugmu][this.ypmu];
    }
    , beReady: function () {
      this.initScheme();
      this.initExample();
    }
    , beforeCheck: function () {
      if (this.isTeuu) {
        return;
      }
      // special check
      if (this.scheme_ypmu === 'u') {
        if ('jqxy'.indexOf(this.ugmu) !== -1) {
          this.isTeuu = true;
          this.scheme_teuu = [this.scheme_ugmu + this.scheme_ypmu, this.scheme_ugmu + scheme.detail.ypmu.v];
        }
      }
      // danqudpn, jmdkudpn3, jmdkudpn6
      if (scheme.detail.fzjm !== undefined && scheme.detail.fzjm[this.ugmu + this.ypmu] !== undefined) {
        this.isTeuu = true;
        this.scheme_teuu = scheme.detail.fzjm[this.ugmu + this.ypmu];
      }
    }
    , check: function () {
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
    }
    , getUgmu: function () {
      return this.ugmu.substr(0, 1).toUpperCase().concat(this.ugmu.substr(1, this.ugmu.length).toLowerCase());
    }
    , getYpmu: function () {
      return this.ypmu;
    }
    , getExample: function () {
      return this.example;
    }
    , setInputUgmu: function (input_ugmu) {
      this.input_ugmu = input_ugmu === '' ? '' : input_ugmu.toLowerCase();
    }
    , setInputYpmu: function (input_ypmu) {
      this.input_ypmu = input_ypmu === '' ? '' : input_ypmu.toLowerCase();
    }
    , isSame: function (a, b) {
      return a.ugmu === b.ugmu && a.ypmu === b.ypmu;
    }
  };
};

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