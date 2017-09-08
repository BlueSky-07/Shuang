'use strict';

/** var */
var actionFlag = true;
var nowSchemeId = 0;
var nowModeId = getModeIdByName.KPNJSVJI;
var nowUgmu = 'sh';
var nowYpmu = 'uang';
var nowPair = [nowUgmu, nowYpmu];
var nowSchemeUgmu = 'U';
var nowSchemeYpmu = 'd';
var nowScheme = [nowSchemeUgmu, nowSchemeYpmu];
var nowUgmuId = -1;
var nowYpmuId = 0;
var nowExample = '双';
var nowTipsFlag = 'true';
var special = [];

/** init */
window.onload = function () {
	/** menu init*/
	var schemeSelect = document.getElementById('schemeSelect');
	for (var schemeId in schemesList) {
		var schemeOption = document.createElement('option');
		schemeOption.innerHTML = schemesList[schemeId];
		schemeSelect.appendChild(schemeOption);
	}
	var modeSelect = document.getElementById('modeSelect');
	for (var modeId in modes) {
		var modeOption = document.createElement('option');
		modeOption.innerHTML = modes[modeId];
		modeSelect.appendChild(modeOption);
	}
	/** reload settings */
	if (getCookie('modeId') !== '') {
		nowModeId = Number(getCookie('modeId'));
		document.getElementById('modeSelect')[nowModeId].selected = true;
	}
	if (getCookie('schemeId') !== '') {
		nowSchemeId = getCookie('schemeId');
		document.getElementById('schemeSelect')[nowSchemeId].selected = true;
	}
	if (getCookie('tipsFlag') !== '') {
		nowTipsFlag = getCookie('tipsFlag');
		if (nowTipsFlag === 'false') {
			document.getElementById('tips').style.display = 'none';
		} else {
			document.getElementById('tipsSwitcher').checked = true;
		}
	} else {
		document.getElementById('tipsSwitcher').checked = true;
	}
	/** update q&a */
	nowScheme = getSchemeByPair(nowSchemeId, nowPair);
	nowSchemeUgmu = getCapitalUpperCase(nowScheme[0]);
	nowSchemeYpmu = nowScheme[1];
	/** view */
	document.getElementById('description').innerHTML = descriptions[nowModeId];
	document.getElementById('a1').focus();
	updateTips();
	/** other things */
	statistics();
};

/** listen keyboard */
document.onkeydown = function (event) {
	switch (event.keyCode) {
		case 37:
			document.getElementById('a1').focus();
			break;
		case 39:
			document.getElementById('a2').focus();
			break;
		case 8:
			if (document.getElementById('a2').value === '') {
				redo();
			}
			break;
		case 13:
		case 32:
			if (check()) {
				next();
			} else {
				redo();
			}
			break;
	}
};

/** input event */
function doAction(x) {
	x.value = x.value.replace(/[^a-zA-Z;]/g, '');
	if (x.value.length === 1) {
		if (x.id === 'a1') {
			x.value = x.value.toUpperCase();
			if (actionFlag) {
				document.getElementById('a2').focus();
				actionFlag = false;
			}
		} else if (x.id === 'a2') {
			x.value = x.value.toLowerCase();
		}
	}
	check();
}

/** check isRight */
function check() {
	if (isRight(document.getElementById('a1').value, nowSchemeUgmu) && isRight(document.getElementById('a2').value, nowSchemeYpmu)) {
		document.getElementById('btn_next').style.display = 'block';
		document.getElementById('btn_redo').style.display = 'none';
		return true;
	}
	document.getElementById('btn_next').style.display = 'none';
	document.getElementById('btn_redo').style.display = 'block';
	if (document.getElementById('a1').value.length === 0) {
		actionFlag = true;
	}
	return false;
}

function isRight(x, xScheme) {
	if (x.length === 1) {
		if (Array.isArray(xScheme)) {
			for (var i in xScheme) {
				if (x === xScheme[i]) {
					return true;
				}
			}
		} else {
			return x === xScheme;
		}
	}
	return false;
}

/** next q&a */
function next() {
	redo();
	switch (nowModeId) {
		case getModeIdByName.QRBUSVJI:
			var tempPair = getRandomPair();
			if (tempPair === nowPair) {
				next();
				return;
			} else {
				nowPair = tempPair;
			}
			nowScheme = getSchemeByPair(nowSchemeId, nowPair);
			nowUgmu = getCapitalUpperCase(nowPair[0]);
			nowYpmu = nowPair[1];
			nowSchemeUgmu = getCapitalUpperCase(nowScheme[0]);
			nowSchemeYpmu = nowScheme[1];
			nowExample = getExampleByPair(nowPair);
			document.getElementById('q1').innerHTML = nowUgmu;
			document.getElementById('q2').innerHTML = nowYpmu;
			document.getElementById('example').innerHTML = nowExample;
			break;
		case getModeIdByName.QRBUUPXU:
			nowPair = getPairByIds(nowUgmuId, nowYpmuId);
			if (nowPair === '') {
				if (nowYpmuId === 0) {
					nowUgmuId = 0;
					nowYpmuId = 0;
				} else {
					nowUgmuId++;
					nowYpmuId = 0;
				}
				next();
				return;
			} else {
				nowYpmuId++;
			}
			nowScheme = getSchemeByPair(nowSchemeId, nowPair);
			nowUgmu = getCapitalUpperCase(nowPair[0]);
			nowYpmu = nowPair[1];
			nowSchemeUgmu = getCapitalUpperCase(nowScheme[0]);
			nowSchemeYpmu = nowScheme[1];
			nowExample = getExampleByPair(nowPair);
			document.getElementById('q1').innerHTML = nowUgmu;
			document.getElementById('q2').innerHTML = nowYpmu;
			document.getElementById('example').innerHTML = nowExample;
			break;
		case getModeIdByName.KPNJSVJI:
			var tempPair = getRandomPair();
			if (tempPair === nowPair) {
				next();
				return;
			} else {
				nowPair = tempPair;
			}
			nowScheme = getSchemeByPair(nowSchemeId, nowPair);
			nowUgmu = getCapitalUpperCase(nowPair[0]);
			nowYpmu = nowPair[1];
			nowSchemeUgmu = getCapitalUpperCase(nowScheme[0]);
			nowSchemeYpmu = nowScheme[1];
			if (nowYpmu === nowSchemeYpmu || nowUgmu === '') {
				next();
				return;
			}
			nowExample = getExampleByPair(nowPair);
			document.getElementById('q1').innerHTML = nowUgmu;
			document.getElementById('q2').innerHTML = nowYpmu;
			document.getElementById('example').innerHTML = nowExample;
			break;
	}
}

/** clear input */
function redo() {
	actionFlag = true;
	document.getElementById('a1').value = '';
	document.getElementById('a2').value = '';
	document.getElementById('a1').focus();
	document.getElementById('btn_next').style.display = 'none';
	document.getElementById('btn_redo').style.display = 'block';
}

/** settings */
function changeScheme(x) {
	var id = schemesList.indexOf(x);
	nowSchemeId = id;
	setCookie('schemeId', nowSchemeId);
	updateTips();
	next();
}

function changeMode(x) {
	var id = modes.indexOf(x);
	nowModeId = id;
	document.getElementById('description').innerHTML = descriptions[id];
	setCookie('modeId', nowModeId);
	next();
}

function switchTips(bool) {
	nowTipsFlag = bool.toString();
	if (nowTipsFlag === 'false') {
		document.getElementById('tips').style.display = 'none';
	} else if (nowTipsFlag === 'true') {
		document.getElementById('tips').style.display = 'block';
	}
	setCookie('tipsFlag', nowTipsFlag);
}

/** view */
function updateTips() {
	var obj = schemes[getSchemesById[nowSchemeId]].teuu;
	special = [];
	document.getElementById('special').innerHTML = '';
	for (var x in obj) {
		var newBox = document.createElement('div');
		newBox.className = 'box';
		var newTitle = document.createElement('div');
		newTitle.className = 'title';
		newTitle.innerHTML = x;
		var newContent = document.createElement('div');
		newContent.className = 'content';
		newContent.innerHTML = obj[x];
		newBox.appendChild(newTitle);
		newBox.appendChild(document.createTextNode(':'));
		newBox.appendChild(newContent);
		document.getElementById('special').appendChild(newBox);
	}
	document.getElementById('pic_url').src = 'img/' + getSchemesById[nowSchemeId] + '.jpg';
}

/** util */
function getCapitalUpperCase(x) {
	if (Array.isArray(x)) {
		var result = [];
		for (var i in x) {
			result.push(x[i].substr(0, 1).toUpperCase().concat(x[i].substr(1, x[i].length).toLowerCase()));
		}
		return result;
	} else {
		return x.substr(0, 1).toUpperCase().concat(x.substr(1, x.length).toLowerCase());
	}
}

/** cookie util */
function getCookie(name) {
	name = name + '=';
	var cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i].trim();
		if (cookie.indexOf(name) === 0)
			return cookie.substring(name.length, cookie.length);
	}
	return '';
}

function setCookie(name, value) {
	var date = new Date();
	date.setDate(date.getTime() + 15 * 24 * 60 * 60 * 1000);
	document.cookie = name + '=' + value + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
}

/** wx_qr */
function qrShow() {
	document.getElementById('wx_qr').hidden = false;
}

function qrHide() {
	document.getElementById('wx_qr').hidden = true;
}