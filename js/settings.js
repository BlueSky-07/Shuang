"use strict";

/** last changed: 2018.3.3 */

var isInit = true;

var settings = {
  schemeId: 0,
  modeId: 0,
  tipsFlag: 'true',
  reload: function () {
    this.schemeId = Number(getCookie('schemeId')) < 0 ? 0 : Number(getCookie('schemeId'));
    this.modeId = Number(getCookie('modeId')) < 0 ? 0 : Number(getCookie('modeId'));
    this.tipsFlag = getCookie('tipsFlag') === '' ? 'true' : getCookie('tipsFlag');
    $('#schemesMenu')[this.schemeId].selected = true;
    $('#modesMenu')[this.modeId].selected = true;
    $('#tipsSwitcher').checked = this.tipsFlag === 'true';
    this.setSchemeId(schemes.list[this.schemeId]);
    this.setModeId(modes.list[this.modeId]);
    this.setTipsFlag(this.tipsFlag);
  },
  setSchemeId: function (schemeName) {
    this.schemeId = schemes.list.indexOf(schemeName);
    setCookie('schemeId', this.schemeId);
    var callback = isInit ? function () {
      init();
      updateTips();
    } : function () {
      next();
      updateTips();
    };
    addJS('scheme_data', 'js/schemes/' + schemes.getNameById[this.schemeId] + '.js?v=3.8', callback);
  },
  setModeId: function (modeName) {
    this.modeId = modes.list.indexOf(modeName);
    $('#mode_detail').innerHTML = modes.details[this.modeId];
    setCookie('modeId', this.modeId);
    if (this.modeId === modes.getIdByName.WUPNYN) {
      $('#example').className = 'example wupnyn';
    } else {
      $('#example').className = 'example';
    }
  },
  setTipsFlag: function (bool) {
    this.tipsFlag = bool.toString();
    if (this.tipsFlag === 'false') {
      $('#tips').style.display = 'none';
    } else if (this.tipsFlag === 'true') {
      $('#tips').style.display = 'block';
    }
    setCookie('tipsFlag', this.tipsFlag);
  }
};

function updateTips() {
  var obj = schemes.data.teuu;
  $('#tips_special').innerHTML = '';
  for (var x in obj) {
    var newBox = document.createElement('div');
    newBox.className = 'box';
    var newTitle = document.createElement('div');
    newTitle.className = 'title';
    newTitle.innerHTML = x;
    var newContent = document.createElement('div');
    newContent.className = 'content';
    if (Array.isArray(obj[x])) {
      for (var idx in obj[x]) {
        if (idx === '0') {
          newContent.innerHTML += obj[x][idx];
        } else {
          newContent.innerHTML += ' / ' + obj[x][idx];
        }
      }
    } else {
      newContent.innerHTML = obj[x];
    }
    newBox.appendChild(newTitle);
    newBox.appendChild(document.createTextNode(':'));
    newBox.appendChild(newContent);
    $('#tips_special').appendChild(newBox);
  }
  if (schemes.tips[schemes.getNameById[settings.schemeId]] !== undefined) {
    var scheme_tip = schemes.tips[schemes.getNameById[settings.schemeId]];
    if (Array.isArray(scheme_tip)) {
      for (var line in scheme_tip) {
        var newLine = document.createElement('div');
        newLine.className = 'line';
        newLine.innerHTML = scheme_tip[line];
        $('#tips_special').appendChild(newLine);
      }
    } else {
      var newLine = document.createElement('div');
      newLine.className = 'line';
      newLine.innerHTML = scheme_tip;
      $('#tips_special').appendChild(newLine);
    }
  }
  $('#tips_pic').src = 'img/' + schemes.getNameById[settings.schemeId] + '.jpg';
}