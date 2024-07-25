/**
 * 검색 - 선박사고
 */


$( document ).ready(function() {

	//선박사고 조회조건 기간 슬라이더 생성
	$("#searchShipAccident_rangeSlider").ionRangeSlider({
		type: "double",
        skin: "round",
        grid:false,
        values: RANGEVALUE,
        from: 36,
        to: 47
    });
	
	//선박사고 조회조건 기간 슬라이더 디자인
	$('.irs--round .irs-bar').css('background-color','#89D4FF');
	$("#searchShipAccident_rangeSlider").change(function(){
		
	   if($("#searchShipAccident_rangeSlider").val().split(';')[0]==RANGEVALUE[0]){
		   
		   $('.irs-from').addClass('m1_irs_to_first');
	   }else{
		   $('.irs-from').removeClass('m1_irs_to_first');
	   }
	   
	   if($("#searchShipAccident_rangeSlider").val().split(';')[1]==RANGEVALUE[RANGEVALUE.length-1]){
		   
		   $('.irs-to').addClass('m1_irs_to_last');
	   }else{
		   $('.irs-to').removeClass('m1_irs_to_last');
	   }
	   
	});
	
});

/*
 * 선박사고 데이터 가져오기
 * */
function getSearchShipAccident(current){
	
	if($('#layer-DF_ANA_AGENCY_STANDARD_AREA').hasClass('active')){
	
		// 레이어 있으면 삭제
		if(falseLayerList.nameAtLayer("kcg:DF_ANA_AGENCY_STANDARD_AREA") != null){		
			falseLayerList.delLayerAtName("kcg:DF_ANA_AGENCY_STANDARD_AREA");
		}

	}else{

		//경찰청 레이어 뜨게
		$('#layer-DF_ANA_AGENCY_STANDARD_AREA').addClass('active');
		
	}

	//경찰청 WMS 레이어 표출
	createWMSLayer("kcg:DF_ANA_AGENCY_STANDARD_AREA");
	
	$('#search_ship_accident_result').removeClass('hide');
	
	//사고 정보 팝업 안보이게
	$('#ship_accident_info_pop').addClass('hide');

	//페이징 관련변수
	var totalRecordCount=0;	//건에 대한 총갯수 
	var pageIndex = current;
    var cnt = 0;
	var etp =  pageIndex*10;
	var stp =  etp - (10-1) ;
	
	//월 마지막날짜 구하기
	var lastDate = new Date($('#searchShipAccident_rangeSlider').val().split(';')[1].split('-')[0], $('#searchShipAccident_rangeSlider').val().split(';')[1].split('-')[1], 0);
	
	var params= {
		start_date:$('#searchShipAccident_rangeSlider').val().split(';')[0]+'-01',
		end_date:$('#searchShipAccident_rangeSlider').val().split(';')[1]+'-'+lastDate.getDate(),
		police_box:$('#search_select_area option:selected').val(),
		acdnt_mng_no : $('#accident_no_input').val(),
		ship_keyword : $('#ship_keyword_input').val(),
		ship_accident:'Y',
		n_st : stp,
		n_ed : etp
	};

	if(current==1){
		//경찰청별 선박사고 건수 가져오기
		temp_cf_ajax( "/use/gisAnal/getSearchAccidentCntOfAgency.do", params, _getSearchShipAccidentCntOfAgency);

		//선박사고 데이터 가져오기 - 아이콘
		temp_cf_ajax( "/use/gisAnal/getSearchAccidentData.do", params, _getSearchShipAccidentData);
		
	}
	
	//선박사고 데이터 가져오기 -페이징
	temp_cf_ajax( "/use/gisAnal/getSearchAccidentDataListPaging.do", params , function(_data){
    	$('#search_ship_accident_dl').empty();
    	$('#shipDataDate').empty();
		if(_data.total.data[0].count == 0) {	//검색결과 없는 경우 로직 패스
			$('#search_ship_accident_dl').append("검색결과가 없습니다.");
		} else {	//검색결과 있는 경우 로직 수행
			
			totalRecordCount = _data.total.data[0].count;
    		$(_data.data.data).each(function(key,val) {
    			
    			var acdntMngNoObj= JSON.stringify({
    				acdntMngNo : val.acdnt_mng_no
    			});	
    			
    			var index=(Number(current-1)*10)+Number(cnt+1);
    			var htmlStr="";
    			
    			var timeString = stringNullCheck(val.rcept_dt);
    			
    			if(timeString!="정보없음"){
    			var time =  new Date(timeString);
    			timeString  =   time.getFullYear()+"년"+(time.getMonth()+1)+"월"+ time.getDate()+"일"+" "+time.getHours()+"시"+time.getMinutes()+"분";
    			}
    			
    			
    			htmlStr+="<div style='margin:3px;' onclick='moveShipAccident("+val.lo+","+val.la+"); getShipAccident("+acdntMngNoObj+");'>";
    			htmlStr+="<dt><span>"+index+"</span>발생 일시 : "+timeString+"</dt>";
    			//htmlStr+="<dd><span class='title'>선박ID  </span><span class='data'>"+stringNullCheck(val.ship_id)+"</span>";
    			htmlStr+="<dd><span class='title'>선박명  </span><span class='data'>"+stringNullCheck(val.ship_nm)+"</span>";
    			htmlStr+="<span class='title'>RFID  </span><span class='data'>"+stringNullCheck(val.vpass_id)+"</span>";
    			htmlStr+="<span class='title'>MMSI  </span><span class='data'>"+stringNullCheck(val.mmsi_no)+"</span></dd></div>";
    			//htmlStr+="<span class='title'>발생 위치 </span><span class='data'>"+Number.parseFloat(val.lo).toFixed(6)+" "+Number.parseFloat(val.la).toFixed(6)+" </span></dd></div>";			
    		
    			$('#search_ship_accident_dl').append(htmlStr);
    			cnt++;
    		});
    		var timedata =  new Date();
    		var dataDateStr = "* "+timedata.getFullYear()+"년 "+(timedata.getMonth()+1)+"월 "+ timedata.getDate()+"일자"+" 통합상황관리 시스템의 정보입니다."
    		$('#shipDataDate').append(dataDateStr);
		}
		makePaging(pageIndex, totalRecordCount, "getSearchShipAccident", 'search_ship_accident_paging', 10);
		temp_cf_loadingbarHide();
	});
	
}

/*
 * 경찰청별 선박사고 건수 가져오기
 * */
function _getSearchShipAccidentCntOfAgency(_data){
	
	var thisdata=_data.data.data;
	
	// 말풍선 팝업 레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("SHIP_ACCIDENT_POP", 5, 2000000.0, 200000.0);
	
	var tempArr = [];
	var tempIdx = 0;
	for(var i=0;i<thisdata.length;i++){
		
		// 말풍선 팝업에 들어갈 내용
		var tempStr = "<div class='float_win' id='float_win_"+i+"'><h1>"+thisdata[i].agency_name+"</h1>"
		tempStr += "<dl><dt>"+thisdata[i].count+"</dt>";
		tempStr += "<dd>선박 사고건수</dd></dl></div>";
		
		// 말풍선 팝업에 내용 붙이기
		$("#float_win_area").append(tempStr);
		$('#float_win_area').removeClass('hide');
		
		var wd = $('#float_win_'+i).width()+20; //팝업창 사이즈 구하기
		var hi = $('#float_win_'+i).height()+85;
		
		//var geom = JSON.parse(thisdata[i].the_center_geom);

		//var lon = geom.coordinates[0];
		//var lat = geom.coordinates[1];
		
		var lon =0;
		var lat =0;
	
		
	}
}


/*
 * 사고 말풍선 그리기
 * */
function drawShipAccidentPopup(_i,_lon,_lat){
	var wd = $('#float_win_'+_i).width()+20; //팝업창 사이즈 구하기
	var hi = $('#float_win_'+_i).height()+85;
	
	// 말풍선 그리기
	html2canvas(document.getElementById('float_win_'+_i), {
		//width : wd,
		//height : hi,
		backgroundColor: null
	}).then(function(canvas) {
		
		var imgData = canvas.getContext('2d').getImageData(0, 0, wd, hi); 
		
		Module.getAddObject().Add3DPoint( "SHIP_ACCIDENT_POP", 'areaOne'+_i, parseFloat(_lon), parseFloat(_lat), parseFloat(2000)+20, imgData.data, imgData.width, imgData.height, '' );//신규 말풍선 생성

	});
	$('#float_win_area').addClass('hide');
	$("#float_win_area").empty();
}

/*
 * 연안사고 데이터리스트 표출하기
 * */
function _getSearchShipAccidentData(_data){
	
	//카메라 위치 이동(lon,lat,alt,tilt,direct)
	setViewCamera(127.5141206067123, 35.939149904645724, 1300000, 90,0);
	
	var thisdata=_data.data.data;

	//선박사고 아이콘 레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("SEARCH_SHIP_ACCIDENT_MARKER", 5, 700000.0, 1.0);
	
	for(var i=0;i<thisdata.length;i++){
		var paramArr=[
			thisdata[i].lo,
			thisdata[i].la,
			1000,
			'',
			thisdata[i].acdnt_mng_no];
		
		//사고  poi 그리기
		drawSearchMark(paramArr, "/static_resources/gis/img/icon/search_area_ship_accident_icon.png","SEARCH_SHIP_ACCIDENT_MARKER","search_ship_accident_");
	}
	//객체 선택모드로 변경
	Module.XDSetMouseState(6);
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 선박사고 위치로 이동
 * */
function moveShipAccident(_x, _y){
	//카메라 위치 이동(lon,lat,alt,tilt,direct)
	setViewCamera(parseFloat(_x), parseFloat(_y),9000,90,0);
}


/*
 * 선박 사고 정보 가져오기
 * */
function getShipAccident(_acdntMngNo){
	
	var params = {
		acdnt_mng_no : _acdntMngNo.acdntMngNo
	};
	
	//경찰서 poi 클릭한 정보 조회
	temp_cf_ajax( "/use/gisAnal/getAccident.do", params, _getShipAccident);
}

/*
 * 선박 사고 정보 표출하기
 * */
function _getShipAccident(_data){
	
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
	$('#ship_accident_info_pop').removeClass('hide');
	

	var htmlStr= "<h3><span class='title'>선박사고 정보</span>";
		htmlStr+= "<span class='btn'><button class='close_btn' onclick='closePop()'>닫기</button></span></h3>";

		htmlStr+='<table class="search_cont_table" cellpadding="0" cellspacing="0">';
		if(accidentInfo.length!=0){
			var timeString = stringNullCheck(accidentInfo[0].rcept_dt);
			
			if(timeString!="정보없음"){
			var time =  new Date(accidentInfo[0].rcept_dt);
			timeString  =  time.getFullYear()+"년"+(time.getMonth()+1)+"월"+ time.getDate()+"일"+" "+time.getHours()+"시"+time.getMinutes()+"분";
			}
			
			htmlStr+="<tr><td colspan='2'><span>사고 관리번호</span>"+stringNullCheck(accidentInfo[0].acdnt_mng_no)+"</td></tr>";
			htmlStr+="<tr><td colspan='2'><span>사고 개요</span>"+stringNullCheck(accidentInfo[0].acdnt_smry)+"</td></tr>";
			htmlStr+="<tr><td colspan='2'><span>발생 일시</span>"+timeString+"</td></tr>";			
		}
		
		if(accidentLocation.length!=0){
			htmlStr+= "<tr><td colspan='2'><span>발생 위치</span>"+Number.parseFloat(accidentLocation[0].lo).toFixed(6)+" / "+Number.parseFloat(accidentLocation[0].la).toFixed(6)+"</td></tr>";	
			
		}

		if(accidentShip.length!=0){
			if(stringNullCheck(accidentInfo[0].ship_id)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>선박 ID</span>"+accidentShip[0].ship_id+"</td></tr>";
			}
			if(stringNullCheck(accidentInfo[0].ship_nm)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>선박명</span>"+stringNullCheck(accidentShip[0].ship_nm)+"</td></tr>";
			}
			if(stringNullCheck(accidentInfo[0].vpass_id)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>RFID</span>"+stringNullCheck(accidentShip[0].vpass_id)+"</td></tr>";
			}
			if(stringNullCheck(accidentInfo[0].mmsi_no)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>MMSI</span>"+stringNullCheck(accidentShip[0].mmsi_no)+"</td></tr>";
			}
		}
		
		if(accidentRescueStatus.length!=0){
			if(stringNullCheck(accidentInfo[0].rescue_nmpr_co)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>구조 인원</span>"+stringNullCheck(accidentRescueStatus[0].rescue_nmpr_co)+"</td></tr>";
			}
			if(stringNullCheck(accidentInfo[0].mss_nmpr_co)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>실종 인원</span>"+stringNullCheck(accidentRescueStatus[0].mss_nmpr_co)+"</td></tr>";
			}
			if(stringNullCheck(accidentInfo[0].inj_nmpr_co)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>부상 인원</span>"+stringNullCheck(accidentRescueStatus[0].inj_nmpr_co)+"</td></tr>";
			}
			if(stringNullCheck(accidentInfo[0].dprs_co)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>사망자수</span>"+stringNullCheck(accidentRescueStatus[0].dprs_co)+"</td></tr>";
			}
		}

		if(accidentInfo.length!=0){
			if(stringNullCheck(accidentInfo[0].wd_ws)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>풍향,풍속</span>"+stringNullCheck(accidentInfo[0].wd_ws)+"</td></tr>";
			}
			if(stringNullCheck(accidentInfo[0].wvhgt)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>파고</span>"+stringNullCheck(accidentInfo[0].wvhgt)+"</td></tr>";
			}
			if(stringNullCheck(accidentInfo[0].wtrtmp)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>수온</span>"+stringNullCheck(accidentInfo[0].wtrtmp)+"</td></tr>";
			}
			if(stringNullCheck(accidentInfo[0].dpwt)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>수심</span>"+stringNullCheck(accidentInfo[0].dpwt)+"</td></tr>";
			}
			if(stringNullCheck(accidentInfo[0].tdlcrnt)!="정보없음"){
				htmlStr+= "<tr><td colspan='2'><span>조류</span>"+stringNullCheck(accidentInfo[0].tdlcrnt)+"</td></tr>";
			}
		}

	
		/*htmlStr+= "<dt>시뮬레이션 설정</dt>";
		htmlStr+= "<dd>";
		htmlStr+= "<button onclick='simulateShipAccident()'>지정경로설정</button>";
		htmlStr+= "<button>재생</button>";
		htmlStr+= "<button>정지</button>";
		htmlStr+= "<button class='active'>1인칭 시점</button>";
		htmlStr+= "<button>3인칭 시점</button>";
		htmlStr+= "</dd>";
		*/
		//htmlStr+= "<div class='btn' style='margin-top:15px;'><button class='type_2'>사고 시뮬레이션(준비중)</button></div>";


		htmlStr+='</table>';
		
	$('#ship_accident_info_pop').empty();
	$('#ship_accident_info_pop').append(htmlStr);

	//로딩바 숨기기
	temp_cf_loadingbarHide();

	/*
	
	var htmlStr= "<h3><span class='title'>선박사고 정보</span>";
		htmlStr+= "<span class='btn'><button class='close_btn' onclick='closePop()'>닫기</button></span></h3>";
		if(accidentInfo.length!=0){
			htmlStr+= "<dl class='section_contents'><dt>사고 관리번호</dt><dd>"+stringNullCheck(accidentInfo[0].acdnt_mng_no)+"</dd>";
			htmlStr+= "<dt>사고 개요</dt><dd>"+textLengthOverCut(stringNullCheck(accidentInfo[0].acdnt_smry,100))+"</dd>";
			htmlStr+= "<dt>발생 일시</dt><dd>"+stringNullCheck(accidentInfo[0].rcept_dt)+"</dd>";			
		}
		
		if(accidentLocation.length!=0){
			htmlStr+= "<dt>발생 위치</dt><dd>"+Number.parseFloat(accidentLocation[0].lo).toFixed(6)+" "+Number.parseFloat(accidentLocation[0].la).toFixed(6)+"</dd>";	
		}

		if(accidentShip.length!=0){
			htmlStr+= "<dt>선박 ID</dt><dd>"+stringNullCheck(accidentShip[0].ship_id)+"</dd>";
			htmlStr+= "<dt>선박명</dt><dd>"+stringNullCheck(accidentShip[0].ship_nm)+"</dd>";
			htmlStr+= "<dt>RFID </dt><dd>"+stringNullCheck(accidentShip[0].vpass_id)+"</dd>";
			htmlStr+= "<dt>MMSI</dt><dd>"+stringNullCheck(accidentShip[0].mmsi_no)+"</dd>";
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
		//htmlStr+= "<div class='btn' style='margin-top:15px;'><button class='type_2'>사고 시뮬레이션(준비중)</button></div>";
		
		
	
	$('#ship_accident_info_pop').empty();
	$('#ship_accident_info_pop').append(htmlStr);

	//로딩바 숨기기
	temp_cf_loadingbarHide();*/
}
