'use strict';
const MODES = {
    "SVJI": 0,
    "UPXU": 1
};
var nowId = 0;
var nowMode = MODES.SVJI;
var actionFlag = true;
var nowUgmu = 'sh';
var nowYpmu = 'uang';
var nowPair = [nowUgmu, nowYpmu];
var nowDictUgmu = 'U'
var nowDictYpmu = 'd';
var nowDict = [nowDictUgmu, nowDictYpmu];
var nowUgmuId = -1;
var nowYpmuId = 0;
window.onload = function () {
    var dictSelect = document.getElementById('dictSelect');
    for (var dictId in dictsList) {
        var dictOption = document.createElement('option');
        dictOption.innerHTML = dictsList[dictId];
        dictSelect.appendChild(dictOption);
    }
    document.getElementById('a1').focus();
};

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
        case 13: case 32:
            if (check()) {
                next();
            } else {
                redo();
            }
            break;
    }
};

window.onresize = function () {
    document.body.style.height = window.innerHeight + 'px';
};

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

function check() {
    if (isRight(document.getElementById('a1').value, nowDictUgmu) && isRight(document.getElementById('a2').value, nowDictYpmu)) {
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

function isRight(x, xDict) {
    if (x.length === 1) {
        if (Array.isArray(xDict)) {
            for (var i in xDict) {
                if (x === xDict[i]) {
                    return true;
                }
            }
        } else {
            return x === xDict;
        }
    }
    return false;
}

function next() {
    redo();
    switch (nowMode) {
        case(MODES.SVJI):
            nowPair = getRandomPair();
            nowDict = getDictByPair(nowId, nowPair);
            nowUgmu = getCapitalUpperCase(nowPair[0]);
            nowYpmu = nowPair[1];
            nowDictUgmu = getCapitalUpperCase(nowDict[0]);
            nowDictYpmu = nowDict[1];
            document.getElementById('q1').innerHTML = nowUgmu;
            document.getElementById('q2').innerHTML = nowYpmu;
            break;
        case (MODES.UPXU):
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
            nowDict = getDictByPair(nowId, nowPair);
            nowUgmu = getCapitalUpperCase(nowPair[0]);
            nowYpmu = nowPair[1];
            nowDictUgmu = getCapitalUpperCase(nowDict[0]);
            nowDictYpmu = nowDict[1];
            document.getElementById('q1').innerHTML = nowUgmu;
            document.getElementById('q2').innerHTML = nowYpmu;
            break;
    }
}

function redo() {
    actionFlag = true;
    document.getElementById('a1').value = '';
    document.getElementById('a2').value = '';
    document.getElementById('a1').focus();
    document.getElementById('btn_next').style.display = 'none';
    document.getElementById('btn_redo').style.display = 'block';
}

function changeDict(x) {
    var id = dictsList.indexOf(x);
    if (id === -1) {
        alert('参数错误');
        document.getElementById('dict').value = dictsList[0];
    } else {
        nowId = id;
    }
    next();
}

function changeMode(x) {
    if (x === '随机') {
        nowMode = MODES.SVJI;
    } else if (x === '顺序') {
        nowMode = MODES.UPXU;
    }
    next();
}

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