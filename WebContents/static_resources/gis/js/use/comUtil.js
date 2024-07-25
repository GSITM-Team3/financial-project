/**
 * GIS활용하기 공통소스
 */
$( document ).ready(function() {
	// 4년전 ~ 오늘 날짜
	var now = new Date();
	
	for(var i=47;i>=0;i--){
  		var date=new Date(now.setMonth(now.getMonth() - i));
  		var year=date.getFullYear();
  		var month=date.getMonth()+1;
  		if(month<10){
  			month='0'+month;
  		}
  		RANGEVALUE.push(year+'-'+month);
  		now = new Date();
  	}
	
	//메뉴 초기화
	$(".menu").click(function(){
		initMenuData(this.id);
		removeEvent();
	});
	

	//검색메뉴 탭 클릭시 초기화
	$(".search_menu_tab").click(function(){
		initMenuData(this.id.split('_')[0]);
		
		//클릭한 탭이 연안사고 검색일경우
		if(this.id.split('_')[1]=='tab2'){
			getSearchPoliceOfficeList();
		}
		
	});

	//분석메뉴 탭 클릭시 초기화
	$(".analysis_menu_tab").click(function(){
		initMenuData();
		removeEvent();
		
		//클릭한 탭이 연안사고일경우
		if(this.id.split('_')[1]=='tab1'){
			mouseCoastAccidentEvent();
		}
		
		//클릭한 탭이 조직정원일경우
		if(this.id.split('_')[1]=='tab2'){
			getOrganization();
		}
		
		$('.'+this.id.split('_')[0]+'_div').addClass('hide');
		$('#'+this.id.split('_')[1]+'_div').removeClass('hide');

	});
	
});

//조회날짜 슬라이더 값(4년전~오늘날짜)
var RANGEVALUE= [];

/*
 * 팝업 닫기
 * */
function closePop() {
	var popIdList = ["coast_accident_info_pop","ship_accident_info_pop"];
	var popClassList = ["analysis_result_pop","analysis_list_pop","analysis_accident_pop","maritimeTraffic_info_pop","wrap_gallery","fieldPhoto_info_pop"];
	
	$.each(popIdList, function(key, value){
		$('#'+value).addClass('hide');
	});
	$.each(popClassList, function(key, value){
		$('.'+value).addClass('hide');
	});
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


/*
 * null 변환
 * */
function stringNullCheck(_str){
	var str=_str;
	if(_str=='NULL'||_str==undefined||_str==null){
		str="정보없음";
	}
	return str;
}

/*
 * 카메라 위치 설정
 * */
function setViewCamera(_lon,_lat,_alt,_tilt,_direct){

	Module.getViewCamera().setLocation(new Module.JSVector3D(_lon, _lat, _alt));
	Module.getViewCamera().setPermitUnderGround(false);
	Module.getViewCamera().setTilt(_tilt);
	Module.getViewCamera().setDirect(_direct);
}

/*
 * 레이어 생성
 * */
function createTrueLayer(_layerName, _layerType, _maxDistance, _minDistance) {

	removeTrueLayer(_layerName);
	
	//현장사진 아이콘 레이어 추가
	var layer = trueLayerList.createLayer(_layerName, _layerType);
		layer.setMaxDistance(_maxDistance);
		layer.setMinDistance(_minDistance);
	
	return layer;
}


/*
 * 레이어 삭제
 * */
function removeTrueLayer(_layerName) {

	if(trueLayerList.nameAtLayer(_layerName) != null){		
		trueLayerList.nameAtLayer(_layerName).removeAll();
	}
	
		
}

/*
 * wms 레이어 생성
 * */
function createWMSLayer(_layerName){

	//레이어 추가
	var layer =falseLayerList.createWMSLayer(_layerName);
	let slopeoption = {
			url: GeoserverWORKSPACE,
			layer:_layerName,
			minimumlevel: 0,
			maximumlevel: 16,
			tilesize: 256,
			srs: "EPSG:4326",
			parameters: {
				version: "1.1.0"
			}
	};
	if(runEnv=="prod"){
	}else{
		layer.setProxyRequest(true);
	}
	layer.setWMSProvider(slopeoption);
	layer.setBBoxOrder(true);
	layer.clearWMSCache();
	layer.setVisible(true);
	
}

/*
 * poi 그리기
 * */
function drawMark(pArr,img_src,layer_name,mark_name){

	var img = new Image();
	img.src = img_src;
	
	// [icon, poiLayerName, thisData.ID, thisData.X,thisData.Y, infoMsg];
	// 아이콘,레이어명, 아이디, X, Y, 메세지
	img.info = pArr;
	
	img.onload = function(){
		try{
			var canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;

			var ctx = canvas.getContext('2d');
			// 이미지 data로 생성
				ctx.drawImage(img, 0, 0);
			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
				// [X,Y,Z,이름,NUM]
				Module.getAddObject().Add3DPoint(layer_name, mark_name+img.info[4], parseFloat(img.info[0]),parseFloat(img.info[1]),parseFloat(img.info[2]), imageData, img.width, img.height, img.info[3]);
																																																			
			var object = trueLayerList.nameAtLayer(layer_name).keyAtObject(mark_name+img.info[4]);
			object.setText(img.info[3]);
			var setFlag = object.setVisibleRange(true, 1,10000000);
		}catch(e){
			console.log(e.message);
		}
	}
	
	
}

/*
 * 팝업 그리기(말풍선)
 * */
function drawPop(pArr,img_src,layer_name,mark_name){

	var img = new Image();
	img.src = img_src;
	
	// [icon, poiLayerName, thisData.ID, thisData.X,thisData.Y, infoMsg];
	// 아이콘,레이어명, 아이디, X, Y, 메세지
	img.info = pArr;
	
	img.onload = function(){
		try{
			var canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;

			var ctx = canvas.getContext('2d');
			// 이미지 data로 생성
				ctx.drawImage(img, 0, 0);
			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
				// [X,Y,Z,이름,NUM]
				Module.getAddObject().Add3DPoint(layer_name, mark_name+img.info[4], parseFloat(img.info[0]),parseFloat(img.info[1]),parseFloat(img.info[2]), imageData, img.width, img.height, img.info[3]);
																																																			
			var object = trueLayerList.nameAtLayer(layer_name).keyAtObject(mark_name+img.info[4]);
			var setFlag = object.setVisibleRange(true, 1,10000000);
		}catch(e){
			console.log(e.message);
		}
	}
	
	
}

/*
 * canvas 이벤트 종료
 * */
function removeEvent(){
	$('#canvas').off('mousedown mouseup mousemove');
	$('#canvas').off('mousedown mouseup mousemove');
	$('#canvas').off('wheel');
}

/*
 * 메뉴이동시 초기화
 * */
function initMenuData(_menu){
	//위치선택모드 초기화
	Module.XDSetMouseState(1);	
	//툴바 active 버튼 초기화
	$('#layer_search_dt').removeClass('active');
	 $('#contrast_dt').removeClass('active');
	 
	//팝업 닫기
	closePop();
	
	//레이어 초기화
	var trueLayerArr=["COAST_ACCIDENT_POP", "SEARCH_COAST_ACCIDENT_MARKER", "SHIP_ACCIDENT_POP", "SEARCH_SHIP_ACCIDENT_MARKER", 									 //검색메뉴
					  "COASTGUARD_MARKER", "POLICE_MARKER", "DF_ANA_GRID_LAYER", "DF_ANA_GRID_POI", "DF_ANA_GRID_LAYER_2D", "DF_ANA_GRID_POI_2D", "ACCIDENT_MARKER", //분석서비스메뉴
					  "DF_RESULT_COASTGUARD_POLYGON_LAYER", "OFFICE_POP", "DF_RESULT_POLICE_POLYGON_LAYER", "BOX_POP", 												 //분석서비스메뉴
					  "BOUNDARY_POLYGONS", "MARITIME_TRAFFICE_LINE", "MARITIME_TRAFFICE_SELECTED_LINE", 															 //해상교통메뉴
					  "FIELD_PHOTO_MARKER", "LOCATION_ICON_MARKER",																									 //현장사진메뉴
					  "TL_RESCUE_P_PICTURE", "TL_MALIRE_P"];																											     //기타
	
	for(var i=0;i<trueLayerArr.length;i++){
		removeTrueLayer(trueLayerArr[i]);
	}

	
	//체크박스 초기화
	var checkBoxFalseArr=['analysisLayer-COASTGUARD', 'analysisLayer-POLICE', 'analysisLayer-TL_MALIRE_P', 'analysisLayer-TL_RESCUE_P_PICTURE',
					 'analysisTableau-coastAccident', 'analysisTableau-organization', 'analysis_grid_checkbox', 'analysis_area_checkbox', 
					 'analysisOrganizationLayer-COASTGUARD', 'analysisOrganizationLayer-POLICE',
					 'analysisOrganizationResult-POLICE', 'maritimeTraffic-ais'];
	
	for(var i=0;i<checkBoxFalseArr.length;i++){
		$("input:checkbox[id="+checkBoxFalseArr[i]+"]").prop("checked", false);
	}
	
	var checkBoxTrueArr=['analysisOrganizationResult-COASTGUARD', 'maritimeTraffic-vpass'];
	
	for(var i=0;i<checkBoxTrueArr.length;i++){
		$("input:checkbox[id="+checkBoxTrueArr[i]+"]").prop("checked", true);
	}
	
	//태블로 초기화
	$('#tableau').empty();
	
	//범례 초기화
	$(".wrap_legend").addClass('hide');
	$(".wrap_legend2").addClass('hide');
	$('.wrap_legend dl dd').off('click');
	$('.wrap_legend2 dl dd').off('click');
	$('.wrap_legend dl dd').removeClass('legend_disabled');
	$('.wrap_legend dl dt').removeClass('legend_disabled');
	$('.wrap_legend2 dl dd').removeClass('legend_disabled');
	$('.wrap_legend2 dl dt').removeClass('legend_disabled');
	
	
	$('.view_mode').addClass('hide');
	
	$('.analysis_tab').addClass('hide');
	$('.analysis_tab_div').addClass('hide');
	
	//해상교통 wms 초기화
	initVpassLegend();
	initAisLegend();
	$('#maritime_traffic_guide_text').text('※ 영역지정검색이 불가능합니다. 지도를 확대해주세요.');
	$('#maritime_traffic_guide_text').css('color','#555');
	$('.maritimeTraffice_list_div').addClass('hide');
	$('.maritime_traffic_mode').addClass('hide');
	
	//영역검색 초기화
	//searchAreaDataInit();
	
	//검색 - 연안사고, 선박사고 초기화
	$('#search_coast_accident_result').addClass('hide');
	$('#search_ship_accident_result').addClass('hide');

	//현장사진 초기화
	$('.wrap_gallery').addClass('hide');
	$('.fieldPhoto_list_div').addClass('hide');
	$('#fieldPhotoRegisger_div').addClass('hide');
	$('#fieldPhotoList_div').removeClass('hide');
	$('#fieldPhoto_add_btn').removeClass('hide');
	$('#fieldPhoto_h1_text').text('현장사진');
	
	 //경위도측정
	if(trueLayerList.nameAtLayer("pointCoord") != null){		
		 $( '#coorPoint' ).prop("checked", false);
		 measureCoordinate();
		 clearCoord();
	}
	
	//range slider 초기화 
	 $('.irs-single').removeClass('m2_irs_to_first');
	 $('.irs-single').removeClass('m2_irs_to_last');
	 $('.irs-from').removeClass('m1_irs_to_first');
	 $('.irs-to').removeClass('m1_irs_to_last');
	 $('.irs-from').removeClass('m7_irs_to_first');
	 $('.irs-to').removeClass('m7_irs_to_last');
	 //검색
	 if(_menu=='m1'){
		 $('.irs-from').addClass('m1_irs_to_first');
		 $('.irs-to').addClass('m1_irs_to_last');
	 }
	 //분석서비스
	 if(_menu=='m2'){
		 initAnalysisTab();			
		 $('.irs-single').addClass('m2_irs_to_first');
	 }
	 //해상교통
	 if(_menu=='m4'){
		 initMaritimeTraffic();
		 $('.irs-single').addClass('m4_irs_to_last');
	 }
	 //현장사진
	 if(_menu=='m7'){
		 $('.irs-from').addClass('m7_irs_to_first');
		 $('.irs-to').addClass('m7_irs_to_last');
	 }

}

/*
 * 툴바 초기화
 * */
function initToolbar(){
	clearMeasurement();
	searchAreaDataInit();
	
	if(trueLayerList.nameAtLayer("GRID_LAYER") != null){		
		trueLayerList.nameAtLayer("GRID_LAYER").removeAll();
	}
	
}

/*
 * 범례1 설정
 * */
function showLegend(text1, color1, text2, color2, text3, color3, text4, color4, text5, color5, text6, color6){
	$(".wrap_legend").removeClass('hide');
	
	for(var i=1;i<=6;i++){
		$('#legend'+i).removeClass('hide');
		$('#legend'+i+'_text').removeClass('hide');
	}
	
	if(text1!=null){
		$('#legend1').css('background',color1);
		$('#legend1_text').text(text1);
	}
	if(text2!=null){
		$('#legend2').css('background',color2);
		$('#legend2_text').text(text2);
	}else{
		for(var i=2;i<=6;i++){
			$('#legend'+i).addClass('hide');
			$('#legend'+i+'_text').addClass('hide');
		}
	}
	
	if(text3!=null){
		$('#legend3').css('background',color3);
		$('#legend3_text').text(text3);
	}else{
		for(var i=3;i<=6;i++){
			$('#legend'+i).addClass('hide');
			$('#legend'+i+'_text').addClass('hide');
		}
	}
	
	if(text4!=null){
		$('#legend4').css('background',color4);
		$('#legend4_text').text(text4);
	}else{
		for(var i=4;i<=6;i++){
			$('#legend'+i).addClass('hide');
			$('#legend'+i+'_text').addClass('hide');
		}
	}
	
	if(text5!=null){
		$('#legend5').css('background',color5);
		$('#legend5_text').text(text5);
	}else{
		for(var i=5;i<=6;i++){
			$('#legend'+i).addClass('hide');
			$('#legend'+i+'_text').addClass('hide');
		}
	}
	
	if(text6!=null){
		$('#legend6').css('background',color6);
		$('#legend6_text').text(text6);
	}else{
		for(var i=6;i<=6;i++){
			$('#legend'+i).addClass('hide');
			$('#legend'+i+'_text').addClass('hide');
		}
	}
}


/*
 * 범례2 설정
 * */
function showLegend2(text1, color1, text2, color2, text3, color3, text4, color4, text5, color5, text6, color6){
	$(".wrap_legend2").removeClass('hide');
	
	for(var i=1;i<=6;i++){
		$('#legend2_'+i).removeClass('hide');
		$('#legend2_'+i+'_text').removeClass('hide');
	}
	
	if(text1!=null){
		$('#legend2_1').css('background',color1);
		$('#legend2_1_text').text(text1);
	}
	if(text2!=null){
		$('#legend2_2').css('background',color2);
		$('#legend2_2_text').text(text2);
	}else{
		for(var i=2;i<=5;i++){
			$('#legend2_'+i).addClass('hide');
			$('#legend2_'+i+'_text').addClass('hide');
		}
	}
	
	if(text3!=null){
		$('#legend2_3').css('background',color3);
		$('#legend2_3_text').text(text3);
	}else{
		for(var i=3;i<=5;i++){
			$('#legend2_'+i).addClass('hide');
			$('#legend2_'+i+'_text').addClass('hide');
		}
	}
	
	if(text4!=null){
		$('#legend2_4').css('background',color4);
		$('#legend2_4_text').text(text4);
	}else{
		for(var i=4;i<=5;i++){
			$('#legend2_'+i).addClass('hide');
			$('#legend2_'+i+'_text').addClass('hide');
		}
	}
	
	if(text5!=null){
		$('#legend2_5').css('background',color5);
		$('#legend2_5_text').text(text5);
	}else{
		for(var i=5;i<=5;i++){
			$('#legend2_'+i).addClass('hide');
			$('#legend2_'+i+'_text').addClass('hide');
		}
	}
	

	if(text6!=null){
		$('#legend2_6').css('background',color6);
		$('#legend2_6_text').text(text6);
	}else{
		for(var i=6;i<=6;i++){
			$('#legend2_'+i).addClass('hide');
			$('#legend2_'+i+'_text').addClass('hide');
		}
	}
}

function wrapONOFF(){
    if($(".wrapHideButton").hasClass('active')){
         $(".wrapHideButton").removeClass('active');
        $(".wrap_contents").removeClass("hide");
        
    }else{
       $(".wrapHideButton").addClass('active');
        $(".wrap_contents").addClass("hide");
    }
    }
