"use strict";

/** last changed: 2017.09.12 */

var setting = {
	schemeId: 0,
	modeId: 0,
	tipsFlag: 'true',
	reload: function () {
		this.schemeId = Number(getCookie('schemeId')) < 0 ? 0 : Number(getCookie('schemeId'));
		this.modeId = Number(getCookie('modeId')) < 0 ? 0 : Number(getCookie('modeId'));
		this.tipsFlag = getCookie('tipsFlag') === '' ? 'true' : getCookie('tipsFlag');
		document.getElementById('schemesMenu')[this.schemeId].selected = true;
		document.getElementById('modesMenu')[this.modeId].selected = true;
		document.getElementById('tipsSwitcher').checked = this.tipsFlag === 'true';
		this.setSchemeId(schemes.list[this.schemeId]);
		this.setModeId(modes.list[this.modeId]);
		this.setTipsFlag(this.tipsFlag);
	},
	setSchemeId: function (schemeName) {
		this.schemeId = schemes.list.indexOf(schemeName);
		updateTips();
		setCookie('schemeId', this.schemeId);
	},
	setModeId: function (modeName) {
		this.modeId = modes.list.indexOf(modeName);
		document.getElementById('mode_detail').innerHTML = modes.details[this.modeId];
		setCookie('modeId', this.modeId);
		if (this.modeId === modes.getIdByName.WUPNYN) {
			document.getElementById('example').className = 'example wupnyn';
		} else {
			document.getElementById('example').className = 'example';
		}
	},
	setTipsFlag: function (bool) {
		this.tipsFlag = bool.toString();
		if (this.tipsFlag === 'false') {
			document.getElementById('tips').style.display = 'none';
		} else if (this.tipsFlag === 'true') {
			document.getElementById('tips').style.display = 'block';
		}
		setCookie('tipsFlag', this.tipsFlag);
	}
};

// View
function updateTips() {
	var obj = schemes.data[schemes.getNameById[setting.schemeId]].teuu;
	document.getElementById('tips_special').innerHTML = '';
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
		document.getElementById('tips_special').appendChild(newBox);
	}
	if (schemes.tips[schemes.getNameById[setting.schemeId]] !== undefined) {
		var scheme_tip = schemes.tips[schemes.getNameById[setting.schemeId]];
		if (Array.isArray(scheme_tip)) {
			for (var line in scheme_tip) {
				var newLine = document.createElement('div');
				newLine.className = 'line';
				newLine.innerHTML = scheme_tip[line];
				document.getElementById('tips_special').appendChild(newLine);
			}
		} else {
			var newLine = document.createElement('div');
			newLine.className = 'line';
			newLine.innerHTML = scheme_tip;
			document.getElementById('tips_special').appendChild(newLine);
		}
	}
	document.getElementById('tips_pic').src = 'img/' + schemes.getNameById[setting.schemeId] + '.jpg';
}

// Cookie
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