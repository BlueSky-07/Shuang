"use strict";

/** last changed: 2018.3.25 */

// core
var nowModel = getNewModel();
var step1 = -1;
var step2 = 0;

// init
window.onload = function () {
  /** menu init */
  var schemesMenu = $('#schemesMenu');
  for (var s in schemes) {
    var schemeOption = document.createElement('option');
    schemeOption.innerHTML = schemes[s];
    schemesMenu.appendChild(schemeOption);
  }
  var modesMenu = $('#modesMenu');
  for (var m in modes) {
    var modeOption = document.createElement('option');
    modeOption.innerHTML = modes[m].name;
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
  nowModel.beReady();
  /** view */
  $('#q').innerHTML = nowModel.getUgmu() + nowModel.getYpmu();
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
      $('#btn').onclick = next;
      $('#btn').innerText = '>';
      $('#btn').style.backgroundColor = '#49c64f';
      return true;
    }
  }
  $('#btn').onclick = redo;
  $('#btn').innerText = 'X';
  $('#btn').style.backgroundColor = '#459df5';
  return false;
};

// redo
var redo = function () {
  var input = $('#a');
  input.value = '';
  input.focus();
  $('#btn').onclick = redo;
  $('#btn').innerText = 'X';
  $('#btn').style.backgroundColor = '#459df5';
};

// next
var next = function () {
  redo();
  var newModel = getNewModel();
  newModel.getReady();
  switch (settings.mode) {
    case "qrbusvji":
      newModel.initRandom();
      break;
    case "qrbuupxu":
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
    case "kpnjsvji":
      newModel.initHardRandom();
      break;
    case "wupnyn":
      do {
        newModel.getReady();
        newModel.initRandom();
        newModel.initExample();
      } while (Array.isArray(newModel.getExample()));
      break;
  }
  if (nowModel.isSame(nowModel, newModel)) {
    next();
  } else {
    newModel.beReady();
    nowModel = newModel;
    $('#q').innerHTML = nowModel.getUgmu() + nowModel.getYpmu();
    $('#example').innerHTML = nowModel.getExample();
  }
};

// settings
var changeScheme = function (schemeName) {
  settings.setScheme(schemeName);
};

var changeMode = function (modeName) {
  settings.setMode(modeName);
  next();
};

var setPicVisable = function (bool) {
  settings.setPicVisable(bool);
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

var inputAction = function (input) {
  input.value = input.value.substr(0, 2).replace(/[^a-zA-Z;]/g, '');
  check();
};

function qrShow(target_id) {
  $('#' + target_id).hidden = '';
}

function qrHide(target) {
  target.hidden = 'hidden';
}