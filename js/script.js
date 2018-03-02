"use strict";

/** last changed: 2018.3.2 */

// core
var nowModel = model();
var step1 = -1;
var step2 = 0;
var modes = {
  list: [
    "全部随机"
    , "全部顺序"
    , "困难随机"
    , "无拼音"
  ],
  details: [
    "全部拼音组合"
    , "全部拼音组合"
    , "韵母需转换"
    , "无拼音提示"
  ],
  getIdByName: {
    "QRBUSVJI": 0
    , "QRBUUPXU": 1
    , "KPNJSVJI": 2
    , "WUPNYN": 3
  }
};

// init
window.onload = function () {
  /** menu init */
  var schemesMenu = $('#schemesMenu');
  for (var schemeId in schemes.list) {
    var schemeOption = document.createElement('option');
    schemeOption.innerHTML = schemes.list[schemeId];
    schemesMenu.appendChild(schemeOption);
  }
  var modesMenu = $('#modesMenu');
  for (var modeId in modes.list) {
    var modeOption = document.createElement('option');
    modeOption.innerHTML = modes.list[modeId];
    modesMenu.appendChild(modeOption);
  }
  /** update statistic */
  update_statistic();
  /** reload settings */
  settings.reload();
};

var init = function () {
  /** init model */
  nowModel.getReady();
  nowModel.ugmu = 'sh';
  nowModel.ypmu = 'uang';
  nowModel.beReady(settings.schemeId);
  /** view */
  if (settings.modeId === modes.getIdByName.WUPNYN) {
    $('#q').innerHTML = '&nbsp';
  } else {
    $('#q').innerHTML = nowModel.getUgmu() + nowModel.getYpmu();
  }
  $('#example').innerHTML = nowModel.getExample();
  isInit = false;
};

// check
var check = function () {
  var input = $('#a');
  var inputUgmu = input.value[0];
  var inputYpmu = input.value[1];
  if (inputYpmu !== undefined) {
    nowModel.setInputUgmu(inputUgmu);
    nowModel.setInputYpmu(inputYpmu);
    if (nowModel.check()) {
      $('#btn_next').style.display = 'block';
      $('#btn_redo').style.display = 'none';
      return true;
    }
  }
  $('#btn_next').style.display = 'none';
  $('#btn_redo').style.display = 'block';
  return false;
};

// redo
var redo = function () {
  var input = $('#a');
  input.value = '';
  input.focus();
  $('#btn_next').style.display = 'none';
  $('#btn_redo').style.display = 'block';
};

// next
var next = function () {
  redo();
  var newModel = model();
  newModel.getReady();
  switch (settings.modeId) {
    case modes.getIdByName.QRBUSVJI:
      newModel.initRandom();
      break;
    case modes.getIdByName.QRBUUPXU:
      while (newModel.initByIds(step1, step2) === false) {
        newModel.getReady();
        if (step2 === 0) {
          step1 = 0;
          step2 = 0;
        } else {
          step1++;
          step2 = 0;
        }
      }
      step2++;
      break;
    case modes.getIdByName.KPNJSVJI:
      newModel.initHardRandom();
      break;
    case modes.getIdByName.WUPNYN:
      do {
        newModel.getReady();
        newModel.initRandom();
        newModel.initExample();
      } while (Array.isArray(newModel.getExample()));
      break;
  }
  if (model().isSame(nowModel, newModel)) {
    next();
  } else {
    newModel.beReady(settings.schemeId);
    nowModel = newModel;
    if (settings.modeId === modes.getIdByName.WUPNYN) {
      $('#q').innerHTML = '&nbsp';
    } else {
      $('#q').innerHTML = nowModel.getUgmu() + nowModel.getYpmu();
    }
    $('#example').innerHTML = nowModel.getExample();
  }
};

// settings
var changeScheme = function (x) {
  settings.setSchemeId(x);
  // 因为使用了 addjs 所以将方法放在callback里调用
  // next();
};

var changeMode = function (x) {
  settings.setModeId(x);
  next();
};

var switchTips = function (x) {
  settings.setTipsFlag(x);
};

// actions
var keyAction = function (event) {
  switch (event.keyCode) {
    case 13: // Enter
    case 32: // Space
      if (check()) {
        next();
      } else {
        redo();
      }
      break;
  }
};

var doAction = function (x) {
  x.value = x.value.substr(0, 2);
  x.value = x.value.replace(/[^a-zA-Z;]/g, '');
  x.value = x.value.substr(0, 1).toUpperCase().concat(x.value.substr(1, x.value.length).toLowerCase());
  check();
};

function qrShow(target_id) {
  $('#' + target_id).hidden = false;
}

function qrHide(target) {
  target.hidden = true;
}