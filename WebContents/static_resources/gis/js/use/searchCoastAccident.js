/**
 * 검색 - 연안사고
 */


$( document ).ready(function() {
	
	//연안사고 조회조건 기간 슬라이더 생성
	$("#searchCoastAccident_rangeSlider").ionRangeSlider({
		type: "double",
        skin: "round",
        grid:false,
        values: RANGEVALUE,
        from: 36,
        to: 47
    });

	//연안사고 조회조건 기간 슬라이더 디자인
	$('.irs--round .irs-bar').css('background-color','#89D4FF');
	$("#searchCoastAccident_rangeSlider").change(function(){
		
	   if($("#searchCoastAccident_rangeSlider").val().split(';')[0]==RANGEVALUE[0]){
		   
		   $('.irs-from').addClass('m1_irs_to_first');
	   }else{
		   $('.irs-from').removeClass('m1_irs_to_first');
	   }
	   
	   if($("#searchCoastAccident_rangeSlider").val().split(';')[1]==RANGEVALUE[RANGEVALUE.length-1]){
		   
		   $('.irs-to').addClass('m1_irs_to_last');
	   }else{
		   $('.irs-to').removeClass('m1_irs_to_last');
	   }
	   
	});
	
	//관할구역 경찰서 select box 변경시
	$("#search_select_office").change(function(){
		//파출소 리스트 가져오기
		var params={
			office_name:$(this).val()
		};
		temp_cf_ajax( "/use/gisAnal/getSearchPoliceBoxList.do", params, _getSearchPoliceBoxList);
	});
});

/*
 * 경찰서 리스트 가져오기
 * */
function getSearchPoliceOfficeList(){
	
	//경찰서 리스트 가져오기
	var params={};
	temp_cf_ajax( "/use/gisAnal/getSearchPoliceOfficeList.do", params, _getSearchPoliceOfficeList);
}

/*
 * 셀렉트박스에 옵션으로 경찰서 리스트 표시
 * */
function _getSearchPoliceOfficeList(_data){
	var thisdata=_data.data.data;
	$('#search_select_office').empty();
	var htmlStr="";
		//htmlStr+="<option value='' >선택해주세요.</option>";
		htmlStr+="<option value='all' >전역</option>";
	for(var i=0;i<thisdata.length;i++){
		htmlStr+="<option value='"+thisdata[i].office_name+"' > "+thisdata[i].office_name+"</option>";
	}
	$('#search_select_office').append(htmlStr);
	//로딩바 숨기기
	temp_cf_loadingbarHide();
	
}

/*
 * 파출소 리스트 가져오기
 * */
function getSearchPoliceBoxList(){
	//파출소 리스트 가져오기
	var params={
		office_name:$('#search_select_office option:selected').val()
	};
	temp_cf_ajax( "/use/gisAnal/getSearchPoliceBoxList.do", params, _getSearchPoliceBoxList);
}

/*
 * 셀렉트박스에 옵션으로 파출소 리스트 표시
 * */
function _getSearchPoliceBoxList(_data){
	var thisdata=_data.data.data;
	$('#search_select_area').empty();
	var htmlStr="";
	if(thisdata.length==0){
	
		htmlStr+="<option value='' >선택해주세요.</option>";
	
	}else{
		for(var i=0;i<thisdata.length;i++){
			htmlStr+="<option value='"+thisdata[i].name+"' > "+thisdata[i].name+"</option>";
		}
	}
	
	$('#search_select_area').append(htmlStr);
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 연안사고 데이터 가져오기
 * */
function getSearchCoastAccident(current){
	
	if($('#layer-DF_ANA_AGENCY_STANDARD_AREA').hasClass('active')){
		// 경찰청 레이어 있으면 삭제
		if(falseLayerList.nameAtLayer("kcg:DF_ANA_AGENCY_STANDARD_AREA") != null){		
			falseLayerList.delLayerAtName("kcg:DF_ANA_AGENCY_STANDARD_AREA");
		}

	}else{
		// 경찰청 레이어 뜨게
		$('#layer-DF_ANA_AGENCY_STANDARD_AREA').addClass('active');
		
	}
	
	//경찰청 WMS 레이어 표출
	createWMSLayer("kcg:DF_ANA_AGENCY_STANDARD_AREA");
	
	$('#search_coast_accident_result').removeClass('hide');
	
	//사고 정보 팝업 안보이게
	$('#coast_accident_info_pop').addClass('hide');
	
	//페이징 관련변수
	var totalRecordCount=0;	//건에 대한 총갯수 
	var pageIndex = current;
    var cnt = 0;
	var etp =  pageIndex*10;
	var stp =  etp - (10-1) ;
	
	//월 마지막날짜 구하기
	var lastDate = new Date($('#searchCoastAccident_rangeSlider').val().split(';')[1].split('-')[0], $('#searchCoastAccident_rangeSlider').val().split(';')[1].split('-')[1], 0);
	
	var params = {
		start_date:$('#searchCoastAccident_rangeSlider').val().split(';')[0]+'-01',
		end_date:$('#searchCoastAccident_rangeSlider').val().split(';')[1]+'-'+lastDate.getDate(),
		police_box:$('#search_select_area option:selected').val(),
		coast_accident:'Y',
		n_st : stp,
		n_ed : etp
	};

	if(current==1){
		//경찰청별 연안사고 건수 가져오기
		temp_cf_ajax( "/use/gisAnal/getSearchAccidentCntOfAgency.do", params, _getSearchCoastAccidentCntOfAgency);

		//연안사고 데이터 가져오기 - 아이콘
		temp_cf_ajax( "/use/gisAnal/getSearchAccidentData.do", params, _getSearchAccidentData);
	}
	
	//연안사고 데이터 가져오기 -페이징
	temp_cf_ajax( "/use/gisAnal/getSearchAccidentDataListPaging.do", params , function(_data){

    	$('#search_coast_accident_dl').empty();
    	$('#accidentDataDate').empty();
		if(_data.total.data[0].count == 0) {	//검색결과 없는 경우 로직 패스
			$('#search_coast_accident_dl').append("검색결과가 없습니다.");
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
    			timeString  =  time.getFullYear()+"년"+(time.getMonth()+1)+"월"+ time.getDate()+"일"+" "+time.getHours()+"시"+time.getMinutes()+"분";
    			}
    			
    			htmlStr+="<div style='margin:3px;' onclick='moveCoastAccident("+val.lo+","+val.la+"); getCoastAccident("+acdntMngNoObj+");'>";
    			htmlStr+="<dt><span>"+index+"</span>발생 일시 : "+timeString+"</dt>";
    			htmlStr+="<dd><span class='title'>사고관리번호 </span><span class='data'>"+val.acdnt_mng_no+"</span></dd></div>";										
    		
    			$('#search_coast_accident_dl').append(htmlStr);
    			cnt++;
    		});
    		var timedata =  new Date();
    		var dataDateStr =  "* "+timedata.getFullYear()+"년 "+(timedata.getMonth()+1)+"월 "+ timedata.getDate()+"일자"+" 통합상황관리 시스템의 정보입니다."
    		$('#accidentDataDate').append(dataDateStr);
		}    			
		makePaging(pageIndex, totalRecordCount, "getSearchCoastAccident", 'search_coast_accident_paging', 10);
		temp_cf_loadingbarHide();
	});
	
}

/*
 * 경찰청별 선박사고 건수 가져오기
 * */
function _getSearchCoastAccidentCntOfAgency(_data){

	var thisdata=_data.data.data;
	
	// 말풍선 팝업 레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("COAST_ACCIDENT_POP", 5, 2000000.0, 200000.0);
	
	var tempArr = [];
	var tempIdx = 0;
	for(var i=0;i<thisdata.length;i++){
		
		// 말풍선 팝업에 들어갈 내용
		var tempStr = "<div class='float_win' id='float_win_"+i+"'><h1>"+thisdata[i].agency_name+"</h1>"
		tempStr += "<dl><dt>"+thisdata[i].count+"</dt>";
		tempStr += "<dd>연안 사고건수</dd></dl></div>";
		
		// 말풍선 팝업에 내용 붙이기
		$("#float_win_area").append(tempStr);
		$('#float_win_area').removeClass('hide');
		
		
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
function drawCoastAccidentPopup(_i,_lon,_lat){
	var wd = $('#float_win_'+_i).width()+20; //팝업창 사이즈 구하기
	var hi = $('#float_win_'+_i).height()+85;
	
	// 말풍선 그리기
	html2canvas(document.getElementById('float_win_'+_i), {
		//width : wd,
		//height : hi,
		backgroundColor: null
	}).then(function(canvas) {
		
		var imgData = canvas.getContext('2d').getImageData(0, 0, wd, hi); 
		
		Module.getAddObject().Add3DPoint( "COAST_ACCIDENT_POP", 'areaOne'+_i, parseFloat(_lon), parseFloat(_lat), parseFloat(2000)+20, imgData.data, imgData.width, imgData.height, '' );//신규 말풍선 생성

	});
	$('#float_win_area').addClass('hide');
	$("#float_win_area").empty();
}

/*
 * 연안사고 데이터 표출하기
 * */
function _getSearchAccidentData(_data){
	if($('#search_select_area option:selected').val()==''){
		
		//카메라 위치 이동(lon,lat,alt,tilt,direct)
		setViewCamera(127.5141206067123, 35.939149904645724,1300000, 90, 0);
		
	}else{
		//파출소 리스트 가져오기
		var params={
			name:$('#search_select_area option:selected').val()
		};
	
		temp_cf_ajax( "/use/gisAnal/getSearchPoliceBoxList.do",params , function(_data){
		
			var thisdata= _data.data.data;
		
			for(i=0;i<thisdata.length;i++){
				var geom =JSON.parse(thisdata[i].the_center_geom);
				var lon = geom.coordinates[0];
				var lat = geom.coordinates[1];
				
				//카메라 위치 이동(lon,lat,alt,tilt,direct)
				setViewCamera(parseFloat(lon), parseFloat(lat),80000, 90, 0);
			}
			temp_cf_loadingbarHide();
		});
		
	}
	var thisdata=_data.data.data;
	
	//연안사고 아이콘 레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("SEARCH_COAST_ACCIDENT_MARKER", 5, 700000.0, 1.0);
	
	for(var i=0;i<thisdata.length;i++){
		var paramArr=[
			thisdata[i].lo,
			thisdata[i].la,
			1000,
			'',
			thisdata[i].acdnt_mng_no];
		
		//사고  poi 그리기
		drawSearchMark(paramArr, "/static_resources/gis/img/icon/search_area_acident_icon.png","SEARCH_COAST_ACCIDENT_MARKER","search_coast_accident_");
	}
	//객체 선택모드로 변경
	Module.XDSetMouseState(6);

	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 연안사고 위치로 이동
 * */
function moveCoastAccident(_x, _y){
	
	//카메라 위치 이동(lon,lat,alt,tilt,direct)
	setViewCamera(parseFloat(_x), parseFloat(_y),9000,90,0);
}

/*
 * 연안 사고 정보 가져오기
 * */
function getCoastAccident(_acdntMngNo){

	var params = {
		acdnt_mng_no : _acdntMngNo.acdntMngNo
	};
	
	//클릭한 사고 정보 조회
	temp_cf_ajax( "/use/gisAnal/getAccident.do", params, _getCoastAccident);
}

/*
 * 연안 사고 정보 표출하기
 * */
function _getCoastAccident(_data){
	
	//사고정보
	var accidentInfo=_data.data.accident_info;
	//사고위치
	var accidentLocation=_data.data.accident_location;
	//사고구조현황
	var accidentRescueStatus=_data.data.accident_rescue_status;
	
	//사고 정보 팝업 보이게
	$('#coast_accident_info_pop').removeClass('hide');

	var htmlStr= "<h3><span class='title'>연안사고 정보</span>";
		htmlStr+= "<span class='btn'><button class='close_btn' onclick='closePop()'>닫기</button></span></h3>";
		if(accidentInfo.length!=0){
			
			var timeString = stringNullCheck(accidentInfo[0].rcept_dt);
			
			if(timeString!="정보없음"){
			var time =  new Date(accidentInfo[0].rcept_dt);
			timeString  =   time.getFullYear()+"년"+(time.getMonth()+1)+"월"+ time.getDate()+"일"+" "+time.getHours()+"시"+time.getMinutes()+"분";
			}
			
			htmlStr+= "<dl class='grid_contents'><dt>사고 관리번호</dt><dd>"+stringNullCheck(accidentInfo[0].acdnt_mng_no)+"</dd>";
			htmlStr+= "<dt>사고 개요</dt><dd>"+stringNullCheck(accidentInfo[0].acdnt_smry)+"</dd>";
			htmlStr+= "<dt>발생 일시</dt><dd>"+timeString+"</dd>";			
		}
		
		if(accidentLocation.length!=0){
			htmlStr+= "<dt>발생 위치</dt><dd>"+Number.parseFloat(accidentLocation[0].lo).toFixed(6)+" "+Number.parseFloat(accidentLocation[0].la).toFixed(6)+"</dd>";	
		}

		htmlStr+= "</dl>";
	
	
	$('#coast_accident_info_pop').empty();
	$('#coast_accident_info_pop').append(htmlStr);

	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

