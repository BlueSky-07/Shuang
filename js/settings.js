"use strict";

/** last changed: 2018.4.22 */

var isInit = true;

var settings = {
  scheme: 'gobcudpn',
  mode: 'qrbusvji',
  showPic: 'true',
  reload: function () {
    this.scheme = getCookie('scheme') === '' ? this.scheme : getCookie('scheme');
    this.mode = getCookie('mode') === '' ? this.mode : getCookie('mode');
    this.showPic = getCookie('showPic') === '' ? 'true' : getCookie('showPic');
    $('#schemesMenu')[Object.keys(schemes).indexOf(this.scheme)].selected = true;
    $('#modesMenu')[Object.keys(modes).indexOf(this.mode)].selected = true;
    $('#picSwitcher').checked = this.showPic === 'true';
    this.setScheme(schemes[this.scheme]);
    this.setMode(modes[this.mode]);
    this.setPicVisable(this.showPic);
  },
  setScheme: function (schemeName) {
    this.scheme = Object.keys(schemes)[Object.values(schemes).indexOf(schemeName)];
    setCookie('scheme', this.scheme);
    var callback = isInit ? function () {
      init();
      updateTips();
    } : function () {
      next();
      updateTips();
    };
    addJS('scheme_data', 'js/schemes/' + this.scheme + '.js?v=4.1', callback);
  },
  setMode: function (modeName) {
    for (var m in modes) {
      if (modes[m].name === modeName) {
        this.mode = m;
      }
    }
    setCookie('mode', this.mode);
    $('#mode_desc').innerHTML = modes[this.mode].desc;
    if (settings.mode === "wupnyn") {
      $('#q').hidden = 'hidden';
    } else {
      $('#q').hidden = '';
    }
  },
  setPicVisable: function (bool) {
    this.showPic = bool.toString();
    setCookie('showPic', this.showPic);
    if (this.showPic === 'false') {
      $('#keyboard').hidden = 'hidden';
    } else if (this.showPic === 'true') {
      $('#keyboard').hidden = '';
    }
  }
};

function updateTips() {
  $('#tips').innerHTML = '';
  if (scheme.tips !== undefined) {
    if (Array.isArray(scheme.tips)) {
      for (var tip in scheme.tips) {
        var newLine = document.createElement('div');
        newLine.className = 'line';
        newLine.innerHTML = scheme.tips[tip];
        $('#tips').appendChild(newLine);
      }
    } else {
      var newLine = document.createElement('div');
      newLine.className = 'line';
      newLine.innerHTML = scheme.tips;
      $('#tips').appendChild(newLine);
    }
  }
  $('#pic').src = 'img/' + scheme.id + '.png';
}