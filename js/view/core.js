"use strict";

/** last changed: 2017.10.04 */

// core
var nowModel = model();
var step1 = -1;
var step2 = 0;

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
	document.getElementById('a').click();
	if (setting.modeId === modes.getIdByName.WUPNYN) {
		document.getElementById('q').innerHTML = '&nbsp';
	} else {
		document.getElementById('q').innerHTML = nowModel.getUgmu() + nowModel.getYpmu();
	}
	document.getElementById('example').innerHTML = nowModel.getExample();
	/** other things */
	statistics();
};

// check
var check = function () {
	var inputUgmu = document.getElementById('a').value[0];
	var inputYpmu = document.getElementById('a').value[1];
	if (inputYpmu !== undefined) {
		nowModel.setInputUgmu(inputUgmu);
		nowModel.setInputYpmu(inputYpmu);
		if (nowModel.check()) {
			document.getElementById('btn_next').style.display = 'block';
			document.getElementById('btn_redo').style.display = 'none';
			return true;
		}
	}
	document.getElementById('btn_next').style.display = 'none';
	document.getElementById('btn_redo').style.display = 'block';
	return false;
};

// redo
var redo = function () {
	document.getElementById('a').value = '';
	document.getElementById('a').click();
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
			document.getElementById('q').innerHTML = '&nbsp';
		} else {
			document.getElementById('q').innerHTML = nowModel.getUgmu() + nowModel.getYpmu();
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

function qrShow() {
	document.getElementById('wx_qr').hidden = false;
}

function qrHide() {
	document.getElementById('wx_qr').hidden = true;
}