"use strict";

/** last changed: 2017.09.11 */

var model = function () {
	return {
		ugmu: '',
		ypmu: '',
		isTeuu: false,
		ugmuId: -1,
		ypmuId: -1,
		scheme_ugmu: [],
		scheme_ypmu: [],
		scheme_teuu: [],
		example: '',
		input_ugmu: '',
		input_ypmu: '',
		schemeId: -1,
		getReady: function () {
			this.ugmu = '';
			this.ypmu = '';
			this.isTeuu = false;
			this.ugmuId = -1;
			this.ypmuId = -1;
			this.scheme_ugmu = [];
			this.scheme_ypmu = [];
			this.scheme_teuu = [];
			this.example = '';
			this.input_ugmu = '';
			this.input_ypmu = '';
			this.schemeId = -1;
		},
		initRandom: function () {
			this.ugmuId = Math.floor(Math.random() * allowUgmus.length);
			this.ugmu = allowUgmus[this.ugmuId];
			this.ypmuId = Math.floor(Math.random() * allowPairs[this.ugmu].length);
			this.ypmu = allowPairs[this.ugmu][this.ypmuId];
		},
		initHardRandom: function () {
			while (this.ugmu === '' || this.ypmu.length === 1) {
				this.initRandom();
			}
		},
		initByIds: function (ugmuId, ypmuId) {
			this.ugmuId = ugmuId;
			this.ypmuId = ypmuId;
			if (!checkUgmuId(ugmuId) || !checkYpmuId(ugmuId, ypmuId)) {
				return false;
			} else {
				this.ugmu = allowUgmus[ugmuId];
				this.ypmu = allowPairs[this.ugmu][ypmuId];
				return true;
			}
		},
		initScheme: function () {
			if (this.ugmu === '') {
				this.isTeuu = true;
			}
			if (this.isTeuu) {
				this.scheme_teuu = getSchemeByTeuu(this.schemeId, this.ypmu);
			}
			else {
				this.scheme_ugmu = getSchemeByUgmu(this.schemeId, this.ugmu);
				this.scheme_ypmu = getSchemeByYpmu(this.schemeId, this.ypmu);
			}
		},
		initExample: function () {
			this.example = getExampleByPair(this.ugmu, this.ypmu);
		},
		beReady: function (schemeId) {
			this.schemeId = schemeId;
			this.initScheme(schemeId);
			this.initExample();
		},
		check: function () {
			if (this.isTeuu) {
				if (Array.isArray(this.scheme_teuu)) {
					for (var item in this.scheme_teuu) {
						if (this.input_ugmu === this.scheme_teuu[item][0] && this.input_ypmu === this.scheme_teuu[item][1]) {
							return true;
						}
					}
				}
				else {
					return this.input_ugmu === this.scheme_teuu[0] && this.input_ypmu === this.scheme_teuu[1];
				}
			}
			else {
				return isRight(this.input_ugmu, this.scheme_ugmu) && isRight(this.input_ypmu, this.scheme_ypmu);
			}
			return false;
		},
		getUgmu: function () {
			return this.ugmu.substr(0, 1).toUpperCase().concat(this.ugmu.substr(1, this.ugmu.length).toLowerCase());
		},
		getYpmu: function () {
			return this.ypmu;
		},
		getExample: function () {
			return this.example;
		},
		setInputUgmu: function (input_ugmu) {
			this.input_ugmu = input_ugmu === '' ? '' : input_ugmu.toLowerCase();
		},
		setInputYpmu: function (input_ypmu) {
			this.input_ypmu = input_ypmu === '' ? '' : input_ypmu.toLowerCase();
		},
		isSame: function (a, b) {
			return a.ugmu === b.ugmu && a.ypmu === b.ypmu;
		}
	};
};

function checkUgmuId(ugmuId) {
	return allowUgmus[ugmuId] !== undefined;
}

function checkYpmuId(ugmuId, ypmuId) {
	return allowPairs[allowUgmus[ugmuId]][ypmuId] !== undefined;
}

function getSchemeByUgmu(schemeId, ugmu) {
	var val = schemesData[getSchemesById[schemeId]]['ugmu'][ugmu];
	return val === undefined ? '' : val;
}

function getSchemeByYpmu(schemeId, ypmu) {
	var val = schemesData[getSchemesById[schemeId]]['ypmu'][ypmu];
	return val === undefined ? '' : val;
}

function getSchemeByTeuu(schemeId, ypmu) {
	var val = schemesData[getSchemesById[schemeId]]['teuu'][ypmu];
	if (val === undefined) {
		return '';
	} else if (Array.isArray(val)) {
		var result = [];
		for (var item in val) {
			result.push(val[item].split(''));
		}
		return result;
	} else {
		return val;
	}
}

function getExampleByPair(ugmu, ypmu) {
	return examples[ugmu + ypmu];
}

function isRight(x, xScheme) {
	if (x.length === 1) {
		if (Array.isArray(xScheme)) {
			for (var i in xScheme) {
				if (x === xScheme[i]) {
					return true;
				}
			}
		}
		else {
			return x === xScheme;
		}
	}
	return false;
}
