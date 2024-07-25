/**
 * 선박 사고
 */

/*
 * 팝업 닫기
 * */
function closeShipAccidentInfo(){
	$('#ship_accident_pop').addClass('hide');
}

//선박사고 정보 가져오기
function getShipAccidentList(){
	$('#ship_accident_pop').addClass('hide');
	
	var params = {
		acdnt_mng_no : $('#accident_no_input').val(),
		ship_mng_no : $('#ship_mng_no_input').val(),
		year_month :$('#ship_accident_select_year option:selected').val()+'-'+$('#ship_accident_select_month option:selected').val()
	};	
	
	var page_params= {
		n_st : 1,
		n_ed : 10,
		acdnt_mng_no : $('#accident_no_input').val(),
		ship_mng_no : $('#ship_mng_no_input').val(),
		year_month :$('#ship_accident_select_year option:selected').val()+'-'+$('#ship_accident_select_month option:selected').val()
	};	
	
	temp_cf_ajax( "/temp/gis/getShipAccidentList.do", params, _getShipAccidentList);
	temp_cf_ajax( "/temp/gis/getShipAccidentListPaging.do", page_params, _getShipAccidentListPaging);
}

function _getShipAccidentList(_data){
	
	var thisdata=_data.data.data;
	
	console.log(thisdata);
	// 레이어 리스트 초기화
	ANALYSIS.TrueLayerList = new Module.JSLayerList(true);
	

	// 레이어 있으면 삭제
	if(ANALYSIS.TrueLayerList.nameAtLayer("SHIP_ACCIDENT_MARKER") != null){		
		ANALYSIS.TrueLayerList.nameAtLayer("SHIP_ACCIDENT_MARKER").removeAll();
	}
	
	//레이어 추가
	var layer = ANALYSIS.TrueLayerList.createLayer("SHIP_ACCIDENT_MARKER", 5);
	layer.setMaxDistance(55000.0);
	layer.setMinDistance(1.0);
	ANALYSIS.TrueLayerListArr.push("SHIP_ACCIDENT_MARKER");
	
	for(var i=0;i<thisdata.length;i++){
		var shipNm="";
		
		for(var j=0;j<thisdata[i].ship_nm.length;j++){
			if(j==thisdata[i].ship_nm.length-1){
				shipNm+=stringNullCheck(thisdata[i].ship_nm[j]);
			}else{				
				shipNm+=stringNullCheck(thisdata[i].ship_nm[j])+', ';
			}
		}
		
		var paramArr=[
			thisdata[i].lo,
			thisdata[i].la,
			1000,
			//stringNullCheck(thisdata[i].acdnt_title),
			shipNm,
			thisdata[i].acdnt_mng_no];
		
		//사고 마크 그리기
		drawMark(paramArr, "/static_resources/gis/img/icon/accident_icon.png","SHIP_ACCIDENT_MARKER","shipAccident_");
		
	}
	//객체 선택모드로 변경
	Module.XDSetMouseState(6);
	Module.canvas.addEventListener("Fire_EventSelectedObject", function(evt){
		
		console.log(evt);
		//ANALYSIS.TrueLayerList.nameAtLayer(evt.layerName).keyAtObject(evt.objKey).setColor(new Module.JSColor(255, 0, 0, 0));
		
		if(evt.objKey.indexOf('shipAccident_') != -1){
			var val = evt.objKey.split('_');
			
			var params = {
				acdnt_mng_no : val[1]
			};
	
			//경찰서 poi 클릭한 정보 조회
			temp_cf_ajax( "/temp/gis/getShipAccident.do", params, _getShipAccident);
			
		}
	});
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

function getShipAccident(_acdntMngNo){
	console.log(_acdntMngNo.acdnt_mng_no);
	var params = {
		acdnt_mng_no : _acdntMngNo.acdntMngNo
	};
	console.log(params);

	//경찰서 poi 클릭한 정보 조회
	temp_cf_ajax( "/temp/gis/getShipAccident.do", params, _getShipAccident);
}

function _getShipAccident(_data){
	console.log(_data);
	
	//사고정보
	var accidentInfo=_data.data.accident_info;
	//사고위치
	var accidentLocation=_data.data.accident_location;
	//사고구조현황
	var accidentRescueStatus=_data.data.accident_rescue_status;
	//사고선박
	var accidentShip=_data.data.accident_ship;
	//사고기상정보
	var accidentWeatherInfo=_data.data.accident_weather_info;
	
	//사고 정보 팝업 보이게
	$('#ship_accident_pop').removeClass('hide');
	
	
	
	var htmlStr= "<h3><span class='title'>사고 정보</span>";
		htmlStr+= "<span class='btn'><button class='close_btn' onclick='closeShipAccidentInfo()'>닫기</button></span></h3>";
		if(accidentInfo.length!=0){
			htmlStr+= "<dl class='section_contents'><dt>사고 관리번호</dt><dd>"+stringNullCheck(accidentInfo[0].acdnt_mng_no)+"</dd>";
			/*htmlStr+= "<dt>사고 개요</dt><dd>"+textLengthOverCut(stringNullCheck(accidentInfo[0].acdnt_smry,100))+"</dd>";*/
			htmlStr+= "<dt>발생 일시</dt><dd>"+stringNullCheck(accidentInfo[0].rcept_dt)+"</dd>";			
		}
		
		if(accidentLocation.length!=0){
			htmlStr+= "<dt>발생 위치</dt><dd>"+Number.parseFloat(accidentLocation[0].lo).toFixed(6)+" "+Number.parseFloat(accidentLocation[0].la).toFixed(6)+"</dd>";	
		}

		if(accidentShip.length!=0){
			htmlStr+= "<dt>선박 관리번호</dt><dd>"+stringNullCheck(accidentShip[0].ship_mng_no)+"</dd>";
			htmlStr+= "<dt>선박명</dt><dd>"+stringNullCheck(accidentShip[0].ship_nm)+"</dd>";
		}
		
		if(accidentRescueStatus.length!=0){
			htmlStr+= "<dt>구조 인원</dt><dd>"+stringNullCheck(accidentRescueStatus[0].rescue_nmpr_co)+"</dd>";
			htmlStr+= "<dt>실종 인원</dt><dd>"+stringNullCheck(accidentRescueStatus[0].mss_nmpr_co)+"</dd>";
			htmlStr+= "<dt>부상 인원</dt><dd>"+stringNullCheck(accidentRescueStatus[0].inj_nmpr_co)+"</dd>";
			htmlStr+= "<dt>사망자수</dt><dd>"+stringNullCheck(accidentRescueStatus[0].dprs_co)+"</dd>";
		}

		if(accidentInfo.length!=0){
			htmlStr+= "<dt>풍향,풍속</dt><dd>"+stringNullCheck(accidentInfo[0].wd_ws)+"</dd>";
			htmlStr+= "<dt>파고</dt><dd>"+stringNullCheck(accidentInfo[0].wvhgt)+"</dd>";
			htmlStr+= "<dt>수온</dt><dd>"+stringNullCheck(accidentInfo[0].wtrtmp)+"</dd>";
			htmlStr+= "<dt>수심</dt><dd>"+stringNullCheck(accidentInfo[0].dpwt)+"</dd>";
			htmlStr+= "<dt>조류</dt><dd>"+stringNullCheck(accidentInfo[0].tdlcrnt)+"</dd>";
		}
	
	
		htmlStr+= "<dt>시뮬레이션 설정</dt>";
		htmlStr+= "<dd>";
		htmlStr+= "<button onclick='simulateShipAccident()'>지정경로설정</button>";
		htmlStr+= "<button>재생</button>";
		htmlStr+= "<button>정지</button>";
		htmlStr+= "<button class='active'>1인칭 시점</button>";
		htmlStr+= "<button>3인칭 시점</button>";
		htmlStr+= "</dd>";
		htmlStr+= "</dl>";
		htmlStr+= "<div class='btn' ><button class='type_2'>사고 시뮬레이션(준비중)</button></div>";
		
	
	$('#ship_accident_pop').empty();
	$('#ship_accident_pop').append(htmlStr);

	//로딩바 숨기기
	temp_cf_loadingbarHide();
}


/**
 * 사고이력 페이징 함수
 * @param current	현재 페이지 번호
 * @param total		전체 조회 건수
 */
function shipAccidentListPaging(current, total) {
	
	console.log(current);
	
	console.log(total);
	
	
	$('#ship_accident_List_paging').empty();
	
	var pageUnit	 = 10;	//화면에 표시할 자료 갯수(페이지당 레코드 수)
	var pageCount 	 = 10;	//화면에 표시할 페이지 번호 갯수(블럭당 페이지 수)
	
	var currentPageNo = current;	//현재 선택된 페이지 번호
	var totalRecordCount = total;	//전체 레코드 수
	var totalPage = Math.ceil(totalRecordCount / pageUnit);	//전체 페이지 수
	var totalBlock = Math.ceil(totalPage / pageCount);	//전체 블럭 수
	var nowBlock = Math.ceil(currentPageNo / pageCount);	//현재 페이지 블럭
	var startPage = ((nowBlock - 1) * pageCount) + 1;	//가져올 페이지 시작 번호
	var endPage = ((totalPage-startPage) > pageCount)?(startPage + pageCount - 1):totalPage;	//출력할 마지막 페이지 번호

	var content = "";
	if(nowBlock >= 1) {	//이전
		content +='<li onclick="javascript:_getShipAccidentList_page(\'' + (nowBlock-1)*pageCount + '\');" >뒤로</li>';
	}
	for(var i=startPage;i<=endPage;i++) {
		if(i == currentPageNo) {
			content +='<li class="active">' + i + '</li>';
		}else {
			content +='<li onclick="javascript:_getShipAccidentList_page(\'' + i + '\');">' + i + '</li>';
		}
	}
	if((totalBlock - nowBlock) >= 0) {
		content +='<li onclick="javascript:_getShipAccidentList_page(\'' + (nowBlock*pageCount+1) + '\');">앞으로</li>';
	}
	
	$('#ship_accident_List_paging').append(content);
}

var shipAccidentPageUnit = 10;
//var cx = 0, cy = 0, len = thisData.length;
//var cnt = data.total[0].TOTAL;
//var ned = data.N_ED;
//analysisGridPaging(Number(ned/polePageUnit),cnt);	
/*
 * 사고이력 리스트 가져오기
 * */
function _getShipAccidentList_page(page){

	var etp =  page*shipAccidentPageUnit;
	var stp =  etp - (shipAccidentPageUnit-1) ;
	var params= {
		n_st : stp,
		n_ed : etp,
		acdnt_mng_no : $('#accident_no_input').val(),
		ship_mng_no : $('#ship_mng_no_input').val(),
		year_month :$('#ship_accident_select_year option:selected').val()+'-'+$('#ship_accident_select_month option:selected').val()
	};	
	

	temp_cf_ajax( "/temp/gis/getShipAccidentListPaging.do", params, _getShipAccidentListPaging);
}


/*
 * 사고이력 리스트에 뿌릴 데이터 조회
 * */
function _getShipAccidentListPaging(_data){
	console.log(_data);
	//$('.analysis_list_pop').removeClass('hide');
	var cnt=_data.total.data[0].count;
	var thisdata=_data.data.data;
	var ned = _data.N_ED;
	var htmlStr="";
	$('#ship_accident_result').removeClass('hide');
	$('#ship_accident_list_dl').empty();
	if(cnt != 0 ){
		
		for(var i=0;i<thisdata.length;i++){
			var acdntMngNoObj= JSON.stringify({
				acdntMngNo : thisdata[i].acdnt_mng_no
			});	

			//조회 결과 목록에 뿌릴 html
			htmlStr+="<div style='margin:3px;' onclick='moveAccident("+thisdata[i].lo+","+thisdata[i].la+"); getShipAccident("+acdntMngNoObj+");'>";
			htmlStr+="<dt><span>"+(i+1)+"</span>발생 일시 : "+thisdata[i].rcept_dt+"</dt>";
			htmlStr+="<dd><span class='title'>선박명  </span><span class='data'>"+stringNullCheck(thisdata[i].ship_nm)+"</span>";
			htmlStr+="<span class='title'>발생 위치 </span><span class='data'>"+Number.parseFloat(thisdata[i].lo).toFixed(6)+" "+Number.parseFloat(thisdata[i].la).toFixed(6)+" </span></dd>";			
			htmlStr+="</div>";	
											
		}
		
	}else{
		//조회 결과 목록에 뿌릴 html
		htmlStr+="<div>";
		htmlStr+="<dt>조회 데이터가 없습니다.</dt>";		
		htmlStr+="</div>";	
	}
	
	$('#ship_accident_list_dl').append(htmlStr);
	shipAccidentListPaging(Number(ned/shipAccidentPageUnit),cnt);
	

	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

//사고 위치로 이동
function moveAccident(_x, _y){
	console.log(_x);
	console.log(_y);
	//카메라 위치 이동
	Module.getViewCamera().setLocation(new Module.JSVector3D(parseFloat(_x), parseFloat(_y),9000));
	Module.getViewCamera().setTilt(90);
	Module.getViewCamera().setDirect(0);
}


/*
 * 문자열 넘칠경우 대체문자
 * */
function textLengthOverCut(txt, len, lastTxt) {
    if (len == "" || len == null) { // 기본값
        len = 20;
    }
    if (lastTxt == "" || lastTxt == null) { // 기본값
        lastTxt = "...";
    }
    if (txt.length > len) {
        txt = txt.substr(0, len) + lastTxt;
    }
    return txt;
}

function stringNullCheck(_str){
	var str=_str;
	if(_str=='NULL'||_str==undefined||_str==null){
		str="정보없음";
	}
	return str;
}
