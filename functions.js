'use strict';

function getExampleByPair(pairs) {
    if (!checkPairs(pairs)) {
        return ''
    } else {
        var req = '';
        if (pairs[0] === '') {
            req = pairs[1];
        } else {
            req = pairs[0] + pairs[1];
        }
        return examples[req];
    }
}

function getSchemeByPair(schemeId, pairs) {
    if (!checkPairs(pairs)) {
        return ''
    } else {
        if (pairs[0] === '') {
            return getSchemeByTeuu(schemeId, pairs[1]);
        } else {
            return [getSchemeByUgmu(schemeId, pairs[0]), getSchemeByYpmu(schemeId, pairs[1])];
        }
    }
}

function getSchemeByUgmu(schemeId, key) {
    var val = schemes[getSchemesById[schemeId]]['ugmu'][key];
    return val === undefined ? '' : val;
}

function getSchemeByYpmu(schemeId, key) {
    var val = schemes[getSchemesById[schemeId]]['ypmu'][key];
    return val === undefined ? '' : val;
}

function getSchemeByTeuu(schemeId, key) {
    var val = schemes[getSchemesById[schemeId]]['teuu'][key];
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

function debug_showSchemeOfAllowPairsBySchemeId(schemeId) {
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
            console.log(pairs.concat(getSchemeByPair(schemeId, pairs)));
            y++;
        }
    }
}
