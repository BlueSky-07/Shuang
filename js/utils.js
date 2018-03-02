'use strict';

/** last changed: 2018.3.1 */

var $ = document.querySelector.bind(document);

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
        ajaxData.success(xhr.response);
      } else {
        ajaxData.error();
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

function update_statistic() {
  ajax({
    type: "GET",
    url: "https://api.ihint.me/statistics.php",
    data: {
      site: 'shuang'
    },
    success: function (response) {
      if (response === '-1') {
        console.log('update statistic not ok');
      } else if (response === '1') {
        console.log('update statistic ok');
      }
    },
    error: function () {
      console.log('cannot get statistic data');
    }
  });
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

// addJS
function addJS(id, src, callback) {
  if ($('#' + id) !== null) {
    $('#' + id).remove();
  }
  var newScript = document.createElement("script");
  newScript.src = src;
  newScript.id = id;
  newScript.onload = callback;
  document.body.appendChild(newScript);
}