/*
 * 검색 - 영역검색 팝업
 * 
 */
$( document ).ready(function() {
	
	 //연안사고 클릭시 통계 가져오기
	 $("#accident_div").click(function(){
		 searchAreaYear('SPOT');
	 });
	 
	 //선박사고 클릭시 통계 가져오기
	 $("#ship_accident_div").click(function(){
		 searchAreaYear('SHIP');
	 });
	 
	 //주제도 클릭시 통계 가져오기
	 $(".thematic_div").click(function(){
			mcxDialog.alert('사고통계 차트는\n연안사고, 선박사고 항목에서 표출됩니다.');

	 });
	 
	 //연안사고 항목 클릭시 상세정보 가져오기
	 $(".accident_info_li").click(function(){
		 event.cancelBubble = true;
		 $('.pop_li').removeClass('active');
		 $(this).addClass('active');
		 var param={
				 acdnt_mng_no:this.id
		 };
		//영역에 대한 사고 정보 가져오기
		temp_cf_ajax( "/use/gisAnal/getSearchAreaAccidentInfo.do", param, _getAccidentInfo);
	 });
	 
	 //선박사고 항목 클릭시 상세정보 가져오기
	 $(".ship_accident_info_li").click(function(){
		 event.cancelBubble = true;
		 $('.pop_li').removeClass('active');
		 $(this).addClass('active');
		 var param={
			acdnt_mng_no:this.id
		 };
		//영역에 대한 사고 정보 가져오기
		temp_cf_ajax( "/use/gisAnal/getAccident.do", param, _getShipAccidentInfo);
	 });
	 
	 
});

/*
 * 검색결과 초기화
 * */
function searchAreaPopInit(){
	$('.pop_li').removeClass('active');
	$('#accident_cnt_span').empty();
	$('#accident_ul').empty();
	$('#ship_accident_cnt_span').empty();
	$('#ship_accident_ul').empty();
}

var dtar ;

//영역검색 왼쪽 항목 모두 0건인지 확인하는 플래그
var dataNullFlag=0;

/*
 * 검색결과 표출하기
 * */
function searchAreaPop(_data,_thematicArr){
	dtar=_data;
	
	//연안사고 0건이면 항목 출력 X
	if(_data.ACCIDENT_CNT==0){
		$('#accident_div').addClass('hide');
		dataNullFlag++;
	}else{
		$('#accident_cnt_span').text(_data.ACCIDENT_CNT+"건");
		var accident_arr_htmlStr="";
		for(var i=0;i<_data.ACCIDENT_ARR.length;i++){
			accident_arr_htmlStr+="<li class='pop_li accident_info_li' id='"+_data.ACCIDENT_ARR[i]+"'>"+_data.ACCIDENT_ARR[i]+"</li>";
		}
		$('#accident_ul').append(accident_arr_htmlStr);
	}
	
	//선박사고 0건이면 항목 출력 X
	if(_data.SHIP_ACCIDENT_CNT==0){
		$('#ship_accident_div').addClass('hide');
		dataNullFlag++;
	}else{
		$('#ship_accident_cnt_span').text(_data.SHIP_ACCIDENT_CNT+"건");
		var ship_accident_arr_htmlStr="";
		for(var i=0;i<_data.SHIP_ACCIDENT_ARR.length;i++){
			ship_accident_arr_htmlStr+="<li class='pop_li ship_accident_info_li' id='"+_data.SHIP_ACCIDENT_ARR[i]+"'>"+_data.SHIP_ACCIDENT_ARR[i]+"</li>";
		}
		$('#ship_accident_ul').append(ship_accident_arr_htmlStr);
	}
	
	
	for(var i=0;i<_thematicArr.length;i++){
		
		//주제도 항목 0건이면 항목 출력 X
		if(eval('_data.'+_thematicArr[i]+'_CNT')==0){
			$('#'+_thematicArr[i]+'_div').addClass('hide');
			dataNullFlag++;
		}else{
			$('#'+_thematicArr[i]+'_cnt_span').text(eval('_data.'+_thematicArr[i]+'_CNT')+"건");
			
			var thematic_htmlStr="";
			for(var j=0;j<eval('_data.'+_thematicArr[i]+'_ARR').length;j++){
				
				thematic_htmlStr+="<li class='pop_li thematic_info_li' id='thematic-"+_thematicArr[i]+"-"+eval('_data.'+_thematicArr[i]+'_GID_ARR')[j]+"' onclick=' event.cancelBubble = true;getThematicInfo(this.id,\""+_thematicArr[i]+"\")'>"+eval('_data.'+_thematicArr[i]+'_ARR')[j]+"</li>";

			}
			$('#'+_thematicArr[i]+'_ul').append(thematic_htmlStr);
		}
		
	}
	
	//영역검색 왼쪽 항목 모두 0건일때 표출
	if(dataNullFlag==30){
		$('.left_list').append('<p>영역검색결과가 없습니다.</p>');
	}
	
}

/*
 * 연안사고 상세정보 표출하기
 */
function _getAccidentInfo(_data){
	$('#search_contents_chart').addClass('hide');
	$('#search_contents_info').removeClass('hide');
	
	$('.search_cont_table').empty();
	
	//사고정보
	var accidentInfo=_data.data;
	var accident_info_htmlStr="";
	
	if(accidentInfo.length!=0){
		accident_info_htmlStr+="<tr><td colspan='2'><span>사고 관리번호</span>"+stringNullCheck(accidentInfo[0].acdnt_mng_no)+"</td></tr>";
		accident_info_htmlStr+="<tr><td colspan='2'><span>사고 개요</span>"+stringNullCheck(accidentInfo[0].acdnt_smry)+"</td></tr>";
		accident_info_htmlStr+="<tr><td colspan='2'><span>발생 일시</span>"+stringNullCheck(accidentInfo[0].rcept_dt)+"</td></tr>";			
		accident_info_htmlStr+="<tr><td colspan='2'><span>발생 위치</span>"+Number.parseFloat(accidentInfo[0].lo).toFixed(6)+" "+Number.parseFloat(accidentInfo[0].la).toFixed(6)+"</td></tr>";	
		window.opener.Module.getViewCamera().moveLonLatAlt(parseFloat(accidentInfo[0].lo), parseFloat(accidentInfo[0].la), 4500, true);
		window.opener.Module.getViewCamera().setTilt(90);
		window.opener.Module.getViewCamera().setDirect(0);
		setHighlightIcon("SEARCH_AREA_ACCIDENT_MARKER","search_area_accident_"+accidentInfo[0].acdnt_mng_no);
	}
	
	$('.search_cont_table').append(accident_info_htmlStr);
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
}


/*
 * 선박사고 상세정보 표출하기
 */
function _getShipAccidentInfo(_data){
	$('#search_contents_chart').addClass('hide');
	$('#search_contents_info').removeClass('hide');
	
	$('.search_cont_table').empty();
	
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
	
	var ship_accident_info_htmlStr="";
	
	if(accidentInfo.length!=0){
		ship_accident_info_htmlStr+="<tr><td colspan='2'><span>사고 관리번호 </span>"+stringNullCheck(accidentInfo[0].acdnt_mng_no)+"</td></tr>";
		ship_accident_info_htmlStr+="<tr><td colspan='2'><span>사고 개요 </span>"+stringNullCheck(accidentInfo[0].acdnt_smry)+"</td></tr>";
		ship_accident_info_htmlStr+="<tr><td colspan='2'><span>발생 일시 </span>"+stringNullCheck(accidentInfo[0].rcept_dt)+"</td></tr>";			
		setHighlightIcon("SEARCH_AREA_SHIP_ACCIDENT_MARKER","search_area_ship_accident_"+accidentInfo[0].acdnt_mng_no);
	}
	
	if(accidentLocation.length!=0){
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>발생 위치 </span>"+Number.parseFloat(accidentLocation[0].lo).toFixed(6)+" "+Number.parseFloat(accidentLocation[0].la).toFixed(6)+"</td></tr>";	
		window.opener.Module.getViewCamera().moveLonLatAlt(parseFloat(accidentLocation[0].lo), parseFloat(accidentLocation[0].la), 4500, true);
		window.opener.Module.getViewCamera().setTilt(90);
		window.opener.Module.getViewCamera().setDirect(0);
	}

	if(accidentShip.length!=0){
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>선박 ID </span>"+stringNullCheck(accidentShip[0].ship_id)+"</td></tr>";
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>선박명 </span>"+stringNullCheck(accidentShip[0].ship_nm)+"</td></tr>";
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>RFID </span>"+stringNullCheck(accidentShip[0].vpass_id)+"</td></tr>";
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>MMSI </span>"+stringNullCheck(accidentShip[0].mmsi_no)+"</td></tr>";
	}
	
	if(accidentRescueStatus.length!=0){
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>구조 인원 </span>"+stringNullCheck(accidentRescueStatus[0].rescue_nmpr_co)+"</td></tr>";
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>실종 인원 </span>"+stringNullCheck(accidentRescueStatus[0].mss_nmpr_co)+"</td></tr>";
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>부상 인원 </span>"+stringNullCheck(accidentRescueStatus[0].inj_nmpr_co)+"</td></tr>";
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>사망자수 </span>"+stringNullCheck(accidentRescueStatus[0].dprs_co)+"</td></tr>";
	}

	if(accidentInfo.length!=0){
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>풍향,풍속 </span>"+stringNullCheck(accidentInfo[0].wd_ws)+"</td></tr>";
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>파고 </span>"+stringNullCheck(accidentInfo[0].wvhgt)+"</td></tr>";
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>수온 </span>"+stringNullCheck(accidentInfo[0].wtrtmp)+"</td></tr>";
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>수심 </span>"+stringNullCheck(accidentInfo[0].dpwt)+"</td></tr>";
		ship_accident_info_htmlStr+= "<tr><td colspan='2'><span>조류</span>"+stringNullCheck(accidentInfo[0].tdlcrnt)+"</td></tr>";
	}

	$('.search_cont_table').append(ship_accident_info_htmlStr);
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 주제도 레이어 상세정보 표출하기
 */
function getThematicInfo(_id,_layer){
	
	$('.pop_li').removeClass('active');
	$('#'+_id).addClass('active');
	var param={
		layer : _layer,
		gid:Number(_id.split('-')[2])
	};
	//영역에 대한 사고 정보 가져오기
	temp_cf_ajax( "/use/gisAnal/getSelctLayerDetail.do", param, function(_data){
		$('#search_contents_chart').addClass('hide');
		$('#search_contents_info').removeClass('hide');
		
		$('.search_cont_table').empty();
		
		var thisdata=_data.data;
		
		var thematic_info_htmlStr="";
		
		if(thisdata.length!=0){
			
			switch (_layer) {
			
			  case 'TL_YACSGRGY_P':			//연안침식관리구역
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>명칭</span>"+thisdata[0].st_t_tl_10+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>정의</span>"+thisdata[0].st_t_tl_11+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>참조문서</span>"+thisdata[0].st_t_tl_14+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>법률명</span>"+thisdata[0].st_t_tl_12+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>세부조항</span>"+thisdata[0].st_t_tl_13+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>제작년월일</span>"+thisdata[0].st_t_tl__8+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>고시날짜</span>"+thisdata[0].st_t_tl_15+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>개정날짜</span>"+thisdata[0].st_t_tl_16+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>관련부서</span>"+thisdata[0].st_t_tl_17+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>기관코드</span>"+thisdata[0].st_t_tl__6+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>관련부서연락처</span>"+thisdata[0].st_t_tl_18+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>참조사이트</span>"+thisdata[0].st_t_tl_20+"</td></tr>";	
				  break;
			  /*
			  case 'VI_PILBOP_P':			//도선사승하선구역
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>명칭</span>"+thisdata[0].objnum+"</td></tr>";	
				  break;	
				  */
			  /*
			  case 'TL_SMOZON_P':			//흡연구역
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>명칭</span>"+thisdata[0].st_t_tl_sm+"</td></tr>";	
				  break;
				  */
			  case 'TB_YACHT_RPNT':			//갯바위낚시포인트
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>지역명칭</span>"+thisdata[0].st_t_tb__7+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>포인트명</span>"+thisdata[0].st_t_tb__8+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>수심</span>"+thisdata[0].st_t_tb__9+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>저질</span>"+thisdata[0].st_t_tb_10+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>적정물때</span>"+thisdata[0].st_t_tb_11+"</td></tr>";	
				  break;
			  case 'TB_FACI_FSHLC':			//낚시터유어장
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>명칭</span>"+thisdata[0].st_t_tb_16+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>주소</span>"+thisdata[0].st_t_tb_19+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>관련부서</span>"+thisdata[0].st_t_tb__5+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>주요어종</span>"+thisdata[0].st_t_tb_17+"</td></tr>";	
				  break;
			  case 'TB_FACI_SPORT':			//레저스포츠
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>명칭</span>"+thisdata[0].st_t_tb_11+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>주소</span>"+thisdata[0].st_t_tb_13+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>부대시설</span>"+thisdata[0].st_t_tl_12+"</td></tr>";	
				  break;
			  case 'TB_YACHT_MARINA_P':		//마리나정보
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>명칭</span>"+thisdata[0].st_t_tb__3+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>주소</span>"+thisdata[0].st_t_tl__6+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>정보</span>"+thisdata[0].st_t_tl_12+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>설명</span>"+thisdata[0].st_t_tb__8+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>안전시설</span>"+thisdata[0].st_t_tb_26+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>안전시설전화번호</span>"+thisdata[0].st_t_tb_27+"</td></tr>";	
				  break;
			  case 'TL_SFISHERY_P':			//바다낚시터
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>명칭</span>"+thisdata[0].st_t_tl_10+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>주소</span>"+thisdata[0].st_t_tl_21+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>정의</span>"+thisdata[0].st_t_tl_11+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>참조문서</span>"+thisdata[0].st_t_tl_14+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>법률명</span>"+thisdata[0].st_t_tl_12+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>제작년월일</span>"+thisdata[0].st_t_tl__8+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>고시날짜</span>"+thisdata[0].st_t_tl_15+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>개정날짜</span>"+thisdata[0].st_t_tl_16+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>관련부서</span>"+thisdata[0].st_t_tl_17+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>관련부서연락처</span>"+thisdata[0].st_t_tl_18+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>기관코드</span>"+thisdata[0].st_t_tl__6+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>참조사이트</span>"+thisdata[0].st_t_tl_20+"</td></tr>";	
				  break;
			  case 'TB_YACHT_SPOINT':		//선상낚시포인트
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>지역명칭</span>"+thisdata[0].st_t_tb__7+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>포인트명</span>"+thisdata[0].st_t_tb__8+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>수심</span>"+thisdata[0].st_t_tb__9+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>적정물때</span>"+thisdata[0].st_t_tb_11+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>저질</span>"+thisdata[0].st_t_tb_10+"</td></tr>";	
				  break;
			  case 'TB_FACI_SCENIC':		//경관도로
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>이름</span>"+thisdata[0].st_t_tb_10+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>위치</span>"+thisdata[0].st_t_tb_11+"</td></tr>";	
				  break;
			  case 'TB_FACI_FISHINGOLE':	//전망대,조망시설
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>명칭</span>"+thisdata[0].st_t_tb_11+"</td></tr>";
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>주소</span>"+thisdata[0].st_t_tb_13+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>부대시설</span>"+thisdata[0].st_t_tb_12+"</td></tr>";	
				  break;
			  /*
			  case 'TB_FACI_CAMPSITE':		//캠핑장
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>명칭</span>"+thisdata[0].st_t_tb_11+"</td></tr>";
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>주소</span>"+thisdata[0].st_t_tb_13+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>전화번호</span>"+thisdata[0].st_t_tb_14+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>인근지역</span>"+thisdata[0].st_t_tb_12+"</td></tr>";	
				  break;
					*/
			  case 'TB_FACI_BEACH':			//해수욕장
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>명칭</span>"+thisdata[0].st_t_tb_11+"</td></tr>";
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>주소</span>"+thisdata[0].st_t_tb_13+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>부대시설</span>"+thisdata[0].st_t_tb_12+"</td></tr>";	
				  break;
			  /*
			  case 'TL_CCTVVI_P':			//CCTV
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].st_t_tl_10+"</td></tr>";	
				  break;
				  */
			  /*
			  case 'TL_POLTRP_P':			//간이치안출장소
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].st_t_tl__5+"</td></tr>";	
				  break;
				  */
			 /*
			  case 'VI_LNDMRK_P':			//등대
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].objnum+"</td></tr>";	
				  break;
				  */
			  case 'TL_FIRSTA_P':			//소방서
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>명칭</span>"+thisdata[0].name+"</td></tr>";
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>주소</span>"+thisdata[0].rnadres+"</td></tr>";	
				  break;
			 /*
			  case 'TL_LEQMBD_P':			//레저기구탑승장
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].st_t_tb__2+"</td></tr>";	
				  break;
				  */
			/*
			  case 'TL_TKTOFC_P':			//매표소
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].st_t_tl_11+"</td></tr>";	
				  break;
				  */
			/*
			  case 'TL_SHWROM_P':			//샤워장
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].st_t_tb_12+"</td></tr>";	
				  break;
				  */
			/*
			  case 'TL_ACCOMM_P':			//숙박업소
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>명칭</span>"+thisdata[0].name+"</td></tr>";
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>지번주소</span>"+thisdata[0].etcadres+"</td></tr>";	
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>도로명주소</span>"+thisdata[0].rnadres+"</td></tr>";	
				  break;
				  */
				  /*
			  case 'TL_INFCEN_P':			//종합안내소
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].st_t_tl__4+"</td></tr>";
				  break;
			  case 'TL_PRKPLC_P':			//주차장
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].st_t_tl_18+"</td></tr>";
				  break;
			  case 'TL_DREROM_P':			//탈의실
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].st_t_tl_10+"</td></tr>";
				  break;
			  case 'TL_TUBLND_P':			//튜브대여소
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].st_t_tl_10+"</td></tr>";
				  break;
			  case 'TL_MALIRE_P':			//수상인명구조대
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].pictnm+"</td></tr>";
				  break;
			  case 'TL_WCHTWR_P':			//안전요원망루
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].st_t_tl_10+"</td></tr>";
				  break;*/
			  case 'TL_RESCUE_P_PICTURE':			//인명구조장비함
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>일련번호</span>"+thisdata[0].gid+"</td></tr>";
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>행정구역</span>"+stringNullCheck(thisdata[0].sido)+' '+stringNullCheck(thisdata[0].sigungu)+' '+stringNullCheck(thisdata[0].eupmyeondong)+' '+stringNullCheck(thisdata[0].dongri)+"</td></tr>";
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>구역구분</span>"+stringNullCheck(thisdata[0].area)+"</td></tr>";
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>장소</span>"+stringNullCheck(thisdata[0].location)+"</td></tr>";
				  thematic_info_htmlStr+= "<tr><td colspan='2'><span>현장사진</span><img src='/use/gisAnal/rescuePictureDn?p="+stringNullCheck(thisdata[0].image_name)+"' style='width: 310px;'/></td></tr>";
				  break;
			}
			var geom =JSON.parse(thisdata[0].the_geom);
			thematic_info_htmlStr+= "<tr><td colspan='2'><span>위치</span>"+Number.parseFloat(geom.coordinates[0]).toFixed(6)+" "+Number.parseFloat(geom.coordinates[1]).toFixed(6)+"</td></tr>";	
			setHighlightIcon("SEARCH_AREA_"+_layer+"_MARKER","search-area-"+_layer+"-"+_id.split('-')[2]);
			window.opener.Module.getViewCamera().moveLonLatAlt(parseFloat(geom.coordinates[0]), parseFloat(geom.coordinates[1]), 4500, true);
			window.opener.Module.getViewCamera().setTilt(90);
			window.opener.Module.getViewCamera().setDirect(0);
		}
		
		
		$('.search_cont_table').append(thematic_info_htmlStr);

		//로딩바 숨기기
		temp_cf_loadingbarHide();
	});
}

/*
 * 선택된 사고정보 지도에서 하이라이트
 */
function setHighlightIcon(_layer,_id){
	if(window.opener.SEARCHAREADATA.HIHGLIGHTICONARR!=null){
		for(var i=0;i<window.opener.SEARCHAREADATA.HIHGLIGHTICONARR.length;i++){
			window.opener.SEARCHAREADATA.HIHGLIGHTICONARR[i].setBlink(false);
			window.opener.SEARCHAREADATA.HIHGLIGHTICONARR=[];
		}
	}
	var object = window.opener.trueLayerList.nameAtLayer(_layer).keyAtObject(_id);
	object.setBlink(true);
	object.setBlinkSize(1.5);
	object.setBlinkColor(246,187,67);
	window.opener.SEARCHAREADATA.HIHGLIGHTICONARR.push(object);
	
}
