'use strict';

/** last changed: 2017.09.12 */

function ajax(obj) {
	var ajaxData = {
		type: obj.type || "GET",
		url: obj.url || "",
		async: obj.async || "true",
		data: obj.data || null,
		dataType: obj.dataType || "text",
		contentType: obj.contentType || "application/x-www-form-urlencoded",
		success: obj.success || function () {
		},
		error: obj.error || function () {
		}
	};
	var xhr = createxmlHttpRequest();
	if (ajaxData.type === "GET") {
		xhr.open(ajaxData.type, ajaxData.url + '?' + convertData(ajaxData.data), ajaxData.async);
	} else {
		xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
	}
	xhr.responseType = ajaxData.dataType;
	xhr.setRequestHeader("Content-Type", ajaxData.contentType);
	if (ajaxData.type === "GET") {
		xhr.send(convertData(null));
	} else {
		xhr.send(convertData(ajaxData.data));
	}
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				ajaxData.success(xhr.response)
			} else {
				ajaxData.error()
			}
		}
	}
}

function createxmlHttpRequest() {
	if (window.ActiveXObject) {
		return new ActiveXObject("Microsoft.XMLHTTP");
	} else if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	}
}

function convertData(data) {
	if (typeof data === 'object') {
		var convertResult = "";
		for (var c in data) {
			convertResult += c + "=" + data[c] + "&";
		}
		convertResult = convertResult.substring(0, convertResult.length - 1);
		return convertResult;
	} else {
		return data;
	}
}

function statistics() {
	ajax({
		type: "GET",
		url: "https://api.ihint.me/statistics.php",
		data: {
			site: 'shuang'
		},
		success: function (response) {
			if (response === '-1') {
				console.log('update statistics not ok');
			} else if (response === '1') {
				console.log('update statistics ok');
			}
		},
		error: function () {
			console.log('cannot get statistics data');
		}
	});
}