'use strict';

function getDictByPair(dictId, pairs) {
    if (!checkPairs(pairs)) {
        return ''
    } else {
        if (pairs[0] === '') {
            return getDictByTeuu(dictId, pairs[1]);
        } else {
            return [getDictByUgmu(dictId, pairs[0]), getDictByYpmu(dictId, pairs[1])];
        }
    }
}

function getDictByUgmu(dictId, key) {
    var val = dicts[getDictsById[dictId]]['ugmu'][key];
    return val === undefined ? '' : val;
}

function getDictByYpmu(dictId, key) {
    var val = dicts[getDictsById[dictId]]['ypmu'][key];
    return val === undefined ? '' : val;
}

function getDictByTeuu(dictId, key) {
    var val = dicts[getDictsById[dictId]]['teuu'][key];
    return val === undefined ? '' : val.split('');
}

function getRandomPair() {
    var ugmu = allowUgmus[Math.floor(Math.random() * allowUgmus.length)];
    var ypmu = allowPairs[ugmu][Math.floor(Math.random() * allowPairs[ugmu].length)];
    return [ugmu, ypmu]
}

function getRandomPairWithUgmu(ugmu) {
    if (!checkUgmu(ugmu)) {
        return '';
    }
    var ypmu = allowPairs[ugmu][Math.floor(Math.random() * allowPairs[ugmu].length)];
    return [ugmu, ypmu];
}

function getRandomPairWithUgmuId(ugmuId) {
    if (!checkUgmuId(ugmuId)) {
        return '';
    }
    var ugmu = allowUgmus[ugmuId];
    var ypmu = allowPairs[ugmu][Math.floor(Math.random() * allowPairs[ugmu].length)];
    return [ugmu, ypmu];
}

function getPairByYumuIdWithUgmu(ugmu, ypmuId) {
    if (!checkUgmu(ugmu) || allowPairs[ugmu][ypmuId] === undefined) {
        return '';
    }
    return [ugmu, allowPairs[ugmu][ypmuId]];
}

function getPairByIds(ugmuId, ypmuId) {
    if (!checkUgmuId(ugmuId) || allowPairs[allowUgmus[ugmuId]][ypmuId] === undefined) {
        return '';
    }
    return [allowUgmus[ugmuId], allowPairs[allowUgmus[ugmuId]][ypmuId]];
}

function checkUgmu(ugmu) {
    return allowPairs[ugmu] !== undefined;
}

function checkUgmuId(ugmuId) {
    return allowUgmus[ugmuId] !== undefined;
}

function checkPairs(pairs) {
    return pairs !== undefined && pairs.length === 2;
}

function debug_showAllowPairs() {
    var x = 0, y = 0;
    while (true) {
        if (getPairByIds(x, y) === '') {
            if (y === 0) {
                break;
            } else {
                x++;
                y = 0;
            }
        } else {
            console.log(getPairByIds(x, y));
            y++;
        }
    }
}

function debug_showDictOfAllowPairsByDictId(dictId) {
    var x = 0, y = 0;
    while (true) {
        if (getPairByIds(x, y) === '') {
            if (y === 0) {
                break;
            } else {
                x++;
                y = 0;
            }
        } else {
            var pairs = getPairByIds(x, y);
            console.log(pairs.concat(getDictByPair(dictId, pairs)));
            y++;
        }
    }
}
