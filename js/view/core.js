"use strict";

/** last changed: 2017.09.12 */

// core
var nowModel = model();
var step1 = -1;
var step2 = 0;
var switchInputFlag = true;

// init
window.onload = function () {
	/** menu init*/
	var schemesMenu = document.getElementById('schemesMenu');
	for (var schemeId in schemes.list) {
		var schemeOption = document.createElement('option');
		schemeOption.innerHTML = schemes.list[schemeId];
		schemesMenu.appendChild(schemeOption);
	}
	var modesMenu = document.getElementById('modesMenu');
	for (var modeId in modes.list) {
		var modeOption = document.createElement('option');
		modeOption.innerHTML = modes.list[modeId];
		modesMenu.appendChild(modeOption);
	}
	/** reload settings */
	setting.reload();
	/** init model */
	nowModel.getReady();
	nowModel.ugmu = 'sh';
	nowModel.ypmu = 'uang';
	nowModel.beReady(setting.schemeId);
	/** view */
	document.getElementById('a1').click();
	if (setting.modeId === modes.getIdByName.WUPNYN) {
		document.getElementById('q1').innerHTML = '';
		document.getElementById('q2').innerHTML = '';
	} else {
		document.getElementById('q1').innerHTML = nowModel.getUgmu();
		document.getElementById('q2').innerHTML = nowModel.getYpmu();
	}
	document.getElementById('example').innerHTML = nowModel.getExample();
	/** other things */
	statistics();
};

// check
var check = function () {
	var a1 = document.getElementById('a1').value;
	var a2 = document.getElementById('a2').value;
	nowModel.setInputUgmu(a1);
	nowModel.setInputYpmu(a2);
	if (nowModel.check()) {
		document.getElementById('btn_next').style.display = 'block';
		document.getElementById('btn_redo').style.display = 'none';
		return true;
	} else {
		document.getElementById('btn_next').style.display = 'none';
		document.getElementById('btn_redo').style.display = 'block';
		if (document.getElementById('a1').value.length === 0) {
			switchInputFlag = true;
		}
		return false;
	}
};

// redo
var redo = function () {
	switchInputFlag = true;
	document.getElementById('a1').value = '';
	document.getElementById('a2').value = '';
	document.getElementById('a1').click();
	document.getElementById('btn_next').style.display = 'none';
	document.getElementById('btn_redo').style.display = 'block';
};

// next
var next = function () {
	redo();
	var newModel = model();
	newModel.getReady();
	switch (setting.modeId) {
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
		newModel.beReady(setting.schemeId);
		nowModel = newModel;
		if (setting.modeId === modes.getIdByName.WUPNYN) {
			document.getElementById('q1').innerHTML = '';
			document.getElementById('q2').innerHTML = '';
		} else {
			document.getElementById('q1').innerHTML = nowModel.getUgmu();
			document.getElementById('q2').innerHTML = nowModel.getYpmu();
		}
		document.getElementById('example').innerHTML = nowModel.getExample();
	}
};

// settings
var changeScheme = function (x) {
	setting.setSchemeId(x);
	next();
};

var changeMode = function (x) {
	setting.setModeId(x);
	next();
};

var switchTips = function (x) {
	setting.setTipsFlag(x);
};

// actions
var keyAction = function (event) {
	switch (event.keyCode) {
		case 37: // <- Left
			document.getElementById('a1').click();
			break;
		case 39: // -> Right
			document.getElementById('a2').click();
			break;
		case 8: // Backspace
			if (document.getElementById('a2').value === '') {
				redo();
			}
			break;
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
	x.value = x.value.replace(/[^a-zA-Z;]/g, '');
	if (x.value.length === 1) {
		if (x.id === 'a1') {
			x.value = x.value.toUpperCase();
			if (switchInputFlag) {
				document.getElementById('a2').click();
				switchInputFlag = false;
			}
		} else if (x.id === 'a2') {
			x.value = x.value.toLowerCase();
		}
	}
	check();
};

function qrShow() {
	document.getElementById('wx_qr').hidden = false;
}

function qrHide() {
	document.getElementById('wx_qr').hidden = true;
}