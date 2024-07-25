/**
 *
 */
var dm = {};

/*dm.hostName = 'http://'+location.hostname;
dm.port = ':'+location.port;
if( location.hostname != '192.168.0.85'	// 외부 개발
	&& location.hostname != '192.168.0.86'	// 내부 개발
	&& location.hostname != '10.47.55.116'	// 내부 개발
	&& location.hostname != '27.101.213.51' // 외부운영
	&& location.hostname != '10.175.101.248'	// 내부 운영
//	&& location.hostname != 'localhost'
	){
	if(location.hostname.indexOf('192.168.0.86') >= 0) {
		dm.hostName = 'http://192.168.0.86';
		dm.port = ':8080';
	}else if(location.hostname.indexOf('192.168.0.') >= 0){
		dm.hostName = 'http://192.168.0.85';
		dm.port = ':8080';
	}else if(location.hostname.indexOf('10.47.55.') >= 0){
		dm.hostName = 'http://10.47.55.116';
		dm.port = ':8080';
	}else if(location.hostname.indexOf('10.175.101.') >= 0){
		dm.hostName = 'http://10.175.101.248';
		dm.port = ':80';
	}else if(location.hostname.indexOf('27.101.213.') >= 0 || location.hostname.indexOf('www.data.go.kr') >= 0){
		dm.hostName = 'http://27.101.213.51';
		dm.port = ':80';
	}else{
		dm.hostName = 'http://192.168.0.85';
		dm.port = ':8080';
	}
}
dm.baseUrl = dm.hostName + dm.port;	// 서버 주소
*/
dm.baseUrl = "https://datamap.data.go.kr";

dm.DEBUG_MODE = false;
dm.openYn = 'Y|N';	// 보유, 개방 여부 (N=개방 제외, Y|N=전체)
dm.flagSys = 'O';   // 외부서비스, 내부서비스 구분 (O=외부, I=내부)
/**
 * @since 2018.10.05
 * @author LSY
 * @param type
 * @param url
 * @param data
 * @param scb
 * @param ecb
 * @param mcb
 * BaseUrl을 추가한 Ajax 통신. 기관에서 서버로 요청 보낼때 사용하도록 한다.

function ajaxFunc(type, url, data, scb, ecb, mcb){
	ajaxFuncRaw(type, dm.baseUrl + url, data, scb, ecb, mcb)
}
 */
/**
 * @since 2018.10.05
 * @author LSY
 * @param type Get / Post
 * @param url
 * @param data
 * @param scb Success Call Back
 * @param ecb Error Call Back
 * @param mcb 사용자 Call Back
 * 기본 Url 사용. 입력한 Url을 그대로 사용하므로, localhost에서 처리할 내용(기관 서버 내 처리)에서 사용 또는 ajaxFunc에서 호출 하도록 함.

function ajaxFuncRaw(type, url, data, scb, ecb, mcb){
	loader(true);
//	if(type == 'POST'){ data = JSON.stringify(data); }
	$.ajax({
		type: type,
		url: url,
		dataType: 'json',
//		contentType: "application/json;charset=UTF-8",
		timeout:30000,
		data: data,
		success: function (data, textStatus, jqXHR ){
			console.log(url + ' success');
//			console.log(data); console.log(textStatus); console.log(jqXHR);
			if(scb){ scb(data); }
			if(mcb){ mcb(data); }
		},
		error: function (jqXHR, textStatus, errorThrown){
			console.log(url + ' error');
//			console.log(jqXHR); console.log(textStatus); console.log(errorThrown);
			if(ecb){ ecb(); }
			if(mcb){ mcb(); }
		},
		complete: function(jqXHR, textStatus ){ loader(false); }
	});
}
 */
/*$('#modal-loading').on('shown.bs.modal', function () {
	if(window.loading === false) {
		$('#modal-loading').modal('hide');
	}
});*/

function post(url, params, cb, loadAble){
	//window.loading = true;
	//loadingStart("contents");
	if(loadAble != 'N'){ loader(true); }

	var userId = document.cookie.match('(^|;) ?' + 'PCID' + '=([^;]*)(;|$)');
	userId = userId ? userId[2] : null;
	params['u'] = userId;

    return $.ajax({
		//url: dm.baseUrl + url, // real
    	url: url,	// local
		method: 'POST',
		data: params,
		xhrFields: {
			withCredentials: false
		}
	}).done(function(resData) {
    	if(cb && cb.scb){ cb.scb(resData); }
    }).fail(function(e, stat) {
    	//요청 취소시에는 작동 안함
    	if(stat === 'abort') {
    		return;
    	}
    	if(cb && cb.fcb){ cb.fcb(e); }
        alert('데이터 조회에 실패하였습니다');
    }).always(function() {
    	if(loadAble != 'N'){ loader(false); }
    	//window.loading = false;
    	//loadingStop("contents");
    });
}

/**
 * @author LSY
 * @since 2018.11.07
 * @param f 날짜 포멧
 * @returns 날짜 포멧 데이터
 * 입력한 날짜 포멧에 맞게 데이터를 가공한다.
 * new Date().format('yyyy-MM-dd HH:mm:ss:mss') 식으로 사용 가능
 */
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|mss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "mss": return d.getMilliseconds().zf(3);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

/**
 * @author LSY
 * @since 2018.11.19
 * @param f true = loader 생성, false = loader 삭제
 * 진행 여부를 표시하는 Progress Bar(loading bar)를 생성 / 삭제 한다.
 */
function loader(f){

	if(f){
		var layer = d3.select("body").append("div").attr("class", "layer");

		layer.append("div").attr("class", "loader");
		layer.append("div").attr("class", "blank");
	}else{
		d3.selectAll(".layer").remove();
	}
}

function getUid() {
	var uid_match = document.cookie.match(/uuid=(\d+)/);
	if (uid_match && uid_match.length >= 2) {
		return uid_match[1];
	}

	return null;
}

var PathLog = (function() {
    var _pathLog = [];
    var _keyword = '';

    function start(keyword) {
    	_pathLog = [];
    	_keyword = keyword;
    }

    function add(item) {
        _pathLog.push(item);
    }

    function search(key, value) {
        return _pathLog.filter(function(o) {
            return o[key] === value;
        });
    }

    function getList() {
    	//TODO: get string for request
    	var str = _pathLog.join('|')
        return str;
    }

    function send(useSe) {
    	post('/data/pathLog.do', {
    		uid: getUid(),
    		keyword: _keyword,
    		schPath: getList(),
    		useSe: useSe
    	});
    }

    return {
    	start: start,
        add: add,
        getList: getList,
        send: send
    };
}());
