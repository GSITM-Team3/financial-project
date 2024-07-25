
/**
 * 문자열의 앞뒤 공백 제거 함수
 * @param str
 * @returns
 */
function trim(strTrim) {
	return strTrim.replace(/^\s*|\s*$/g,"");
}

/**
 * 정규식 체크 함수
 * @param strCheck 검사할 입력 값
 * @returns {String} 상태에 따른 결과값
 */
function regularCheck(strCheck) {
	var check = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\-|\(|\)|\ ]$/;	// 한글, 영어, 숫자, 특수문자 -, ,(,) 만 사용 가능
	if(strCheck == '') {	// 빈 값인 경우 제거
		return 'empty';
	}
	for(var i=0;i<strCheck.length;i++) {	//정규식 체크
		if(check.test(strCheck.charAt(i))) {
			//정상적 패턴
		} else {
			return 'notRegular';
		}
	}
	return 'regular';
}

//숫자에 컴마 
function numberCommaFormat(num) {
	var str = String(num);
    var pattern = /(-?[0-9]+)([0-9]{3})/;
    while(pattern.test(str)) {
    	str = str.replace(pattern,"$1,$2");
    }
    return str;
}

/**
 * SG : 경제성분석 공통사용
 * /Sportal/WebContent/sysadm/resources/js/sg/sgUtils.js
 */


/************************************************************************************
 * divId : 페이징 태그가 그려질 div
 * pageIndx : 현재 페이지 위치가 저장될 input 태그 id
 * recordCount : 페이지당 레코드 수
 * totalCount : 전체 조회 건수 
 * eventName : 페이징 하단의 숫자 등의 버튼이 클릭되었을 때 호출될 함수 이름
*************************************************************************************/
var gfv_pageIndex = null;
var gfv_eventName = null;
function gfn_renderPaging(params){
	var divId = params.divId; //페이징이 그려질 div id
	gfv_pageIndex = params.pageIndex; //현재 위치가 저장될 input 태그
	var totalCount = params.totalCount; //전체 조회 건수
	var currentIndex = $("#"+params.pageIndex).val(); //현재 위치
	if($("#"+params.pageIndex).length == 0 || gfn_isNull(currentIndex) == true){
		currentIndex = 1;
	}
	
	var recordCount = params.recordCount; //페이지당 레코드 수
	if(gfn_isNull(recordCount) == true){
		recordCount = 20;
	}
	var totalIndexCount = Math.ceil(totalCount / recordCount); // 전체 인덱스 수
	gfv_eventName = params.eventName;
	
	var preStr = "";
	var postStr = "";
	var str = "";
	var pageSize = 10;
	
	var first = (parseInt((currentIndex-1) / pageSize) * pageSize) + 1;
	var last = (parseInt(totalIndexCount/pageSize) == parseInt((currentIndex - 1)/pageSize)) ? totalIndexCount%pageSize : pageSize;
	var prev = (parseInt((currentIndex-1)/pageSize)*pageSize) - 9 > 0 ? (parseInt((currentIndex-1)/pageSize)*pageSize) - 9 : 1; 
	var next = (parseInt((currentIndex-1)/pageSize)+1) * pageSize + 1 < totalIndexCount ? (parseInt((currentIndex-1)/pageSize)+1) * pageSize + 1 : totalIndexCount;
	
	if(totalIndexCount > pageSize){ //전체 인덱스가 pageSize이 넘을 경우, 맨앞, 앞 태그 작성
		preStr += '<a class="dir" href="#link" onclick="_movePage(1);"><img src="./img/paginate_first.png" alt="처음 페이지으로"></a>' +
				'<a class="dir first" href="#link" onclick="_movePage('+prev+');"><img src="./img/paginate_prev.png" alt="이전 페이지로"></a>';
	}
	else if(totalIndexCount <=pageSize && totalIndexCount > 1){ //전체 인덱스가 pageSize보다 작을경우, 맨앞 태그 작성
		preStr += '<a class="dir" href="#link" onclick="_movePage(1);"><img src="./img/paginate_first.png" alt="처음 페이지으로"></a>';
	}
	
	if(totalIndexCount > pageSize){ //전체 인덱스가 pageSize이 넘을 경우, 맨뒤, 뒤 태그 작성
		postStr += '<a class="dir last" href="#link" onclick="_movePage('+next+');"><img src="./img/paginate_next.png" alt="다음 페이지로"></a>' +
		'<a class="dir" href="#link" onclick="_movePage('+totalIndexCount+');"><img src="./img/paginate_last.png" alt="끝 페이지로"></a> ';
	}
	else if(totalIndexCount <=pageSize && totalIndexCount > 1){ //전체 인덱스가 pageSize보다 작을경우, 맨뒤 태그 작성
		postStr += '<a class="dir" href="#link" onclick="_movePage('+totalIndexCount+');"><img src="./img/paginate_last.png" alt="끝 페이지로"></a> ';
	}
	
	for(var i=first; i<(first+last); i++){
		if(i != currentIndex){
			str += "<a href='#this' onclick='_movePage("+i+")'>"+i+"</a>";
		}
		else{
			str += "<strong>"+i+"</strong>";
		}
	}
	$("#"+divId).empty().append(preStr + str + postStr);
	currentIndex = ((totalCount==0)? 0 : currentIndex);
	var total_counter = '<span>전체게시물 : <em>' + totalCount +
					   	'</em>개</span> <span>' + currentIndex +
					  	'/<em>' + totalIndexCount +
					  	'</em> 페이지</span>';
			
	$("p.total_counter").empty().append(total_counter);
}

// 페이지 이동
function _movePage(value){
	$("#"+gfv_pageIndex).val(value);
	if(typeof(gfv_eventName) == "function"){
		gfv_eventName(value);
	}
	else {
		eval(gfv_eventName + "(value);");
	}
}

// null 체크
function gfn_isNull(str) {
	if (str == null) return true;
	if (str == "NaN") return true;
	if (new String(str).valueOf() == "undefined") return true;
	var chkStr = new String(str);
	if( chkStr.valueOf() == "undefined" ) return true;
	if (chkStr == null) return true;
	if (chkStr.toString().length == 0 ) return true;
	return false; 
}

// null 체크 null인 경우 '' 아닌 경우 parameter str
function gfn_isNullToBlank(str) {
	if (str == null) return '';
	if (str == "NaN") return '';
	if (new String(str).valueOf() == "undefined") return '';
	var chkStr = new String(str);
	if( chkStr.valueOf() == "undefined" ) return '';
	if (chkStr == null) return '';
	if (chkStr.toString().length == 0 ) return '';
	return str;
}

// null 체크 null인 경우 '-' 아닌 경우 parameter str
function gfn_isNullToHyphen(str) {
	if (str == null) return '-';
	if (str == "NaN") return '-';
	if (new String(str).valueOf() == "undefined") return '-';
	var chkStr = new String(str);
	if( chkStr.valueOf() == "undefined" ) return '-';
	if (chkStr == null) return '-';
	if (chkStr.toString().length == 0 ) return '-';
	return str;
}

// 숫자 콤마찍기
function gfn_numberWithCommas(x) {
	var retVal = '', val = x.toString().split('.');
	if(val[1]==null) {
		retVal =  x==null?'' : x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	} else {
		retVal = x==null?'' : x.toString().replace(/\B(?=(\d{3})+(?!\d)\.)/g, ",");
	}
	return retVal;
}

// 숫자만 입력
function gfn_number(obj) {
	$(obj).val($(obj).val().replace(/[^0-9\.]/g, ''));	
}

/*//배열 합산
function sumArray( _ar1, _ar2 )
{
	var i;
	var rst = [];
	for(i = 0; i < _ar1.length ; i++) {
		rst[i] = _ar1[i] + _ar2[i];
	}
	return rst;
}

// 배열 평균
function divArray( _ar1, _div) 
{
	var i;
	var rst = [];
	for(i = 0; i < _ar1.length ; i++) {
		rst[i] = Math.round(_ar1[i] / _div * 100) / 100;
	}
	return rst;
}

// 배열 총합
function sumArrayVal( _ar1, _stIdx )
{
	var rst = 0;
	for(var i=_stIdx;i<_ar1.length;i++) rst += _ar1[i];
	return rst;
}*/
