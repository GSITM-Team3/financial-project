/*********************************************************
 * 엔진 파일을 로드합니다.
 * 파일은 asm.js파일, html.mem파일, js 파일 순으로 로드하며,
 * 로드 시 버전 명(engineVersion)을 적용합니다.
 *********************************************************/
var ENGINE_PATH = "/static_resources/gis/Engine/"
var engineVersion = "v0.0.0.1";

;(function(){

	  var tm = (new Date()).getTime();	// 캐싱 방지
	   
	// 1. XDWorldEM.asm.js 파일 로드
	var file = ENGINE_PATH+"XDWorldEM.asm.js?tm="+engineVersion;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', file, true);
	xhr.onload = function() {

		var script = document.createElement('script');
		script.innerHTML = xhr.responseText;
		document.body.appendChild(script);

		// 2. XDWorldEM.html.mem 파일 로드
		setTimeout(function() {
			(function() {
				  
				var memoryInitializer = ENGINE_PATH+"XDWorldEM.html.mem?tm="+engineVersion;
				var xhr = Module['memoryInitializerRequest'] = new XMLHttpRequest();
				xhr.open('GET', memoryInitializer, true);
				xhr.responseType = 'arraybuffer';

				xhr.onload =  function(){

					// 3. XDWorldEM.js 파일 로드
					var url = ENGINE_PATH+"XDWorldEM.js?tm="+engineVersion;
					var xhr = new XMLHttpRequest();
					xhr.open('GET',url , true);
					xhr.onload = function(){
						var script = document.createElement('script');
						script.innerHTML = xhr.responseText;
						document.body.appendChild(script);
					};
					xhr.send(null);
				}
				xhr.send(null);
			})();
		}, 1);
	};
	xhr.send(null);

})();


/*********************************************************
 *	엔진파일 로드 후 Module 객체가 생성되며,
 *  Module 객체를 통해 API 클래스에 접근 할 수 있습니다. 
 *	 - Module.postRun : 엔진파일 로드 후 실행할 함수를 연결합니다.
 *	 - Module.canvas : 지도를 표시할 canvas 엘리먼트를 연결합니다.
 *********************************************************/
 
/**
* 	화면 크기 구하기 W
**/
function returnWidths(){/*
	var leftwidth = $(".sidemenu").width();*/
	return $(window).width()/*-leftwidth*/;	
}

/**
* 	화면 크기 구하기 H
**/
function returnHeights(){
	return $(window).height();	
}

var Module = {
	TOTAL_MEMORY: 256*1024*1024,
	postRun: [init],
	canvas: (function() {
		var canvas = document.getElementById('canvas');
		// Canvas 스타일 설정
		canvas.style.position = "fixed";
		canvas.style.top = "0px";
		canvas.style.left = "0px";

		canvas.addEventListener("contextmenu", function(e){
			e.preventDefault();
		});
		
		// 화면 저장을 위해 버퍼 설정이 필요합니다.
		var context = canvas.getContext("experimental-webgl", {
			preserveDrawingBuffer : true

		});
		
		return canvas;
	})()
};

var trueLayerList, falseLayerList;


/* 엔진 로드 후 실행할 초기화 함수(Module.postRun) */
function init() {

		var VWORLD_API_KEY="42F6D36E-1A78-34B7-959F-37611794397B"
		Module.SetAPIKey(VWORLD_API_KEY);
		Module.SetResourceServerAddr("/static_resources/gis/img/");
		Module.XDESetSatUrlLayerName(XDServerURL, "tile"); //지도 설정
		Module.XDESetDemUrlLayerName(XDServerURL, "dem"); //지도 설정
		
		// 엔진 초기화 API 호출(필수)
		Module.Start(returnWidths(), returnHeights());
		
		// 지도 데이터 로드
	    Module.XDEMapCreateLayer("facility_build", XDServerURL, XDServerPORT, true, true, false, Module.ELT_MULTILPE, 0, 15);
	    Module.XDEMapCreateLayer("facility_kcg", KCG_BUILD_URL, 0, true, true, false, Module.ELT_MULTILPE, 0, 15);		    
	    Module.XDEMapCreateLayer("facility_bridge",XDServerURL,XDServerPORT,true,true,false,9,0,15);
		Module.XDEMapCreateLayer("poi_base",  XDServerURL, XDServerPORT, true, true, false, Module.ELT_3DPOINT, 0, 15);        //기본 명칭
		Module.XDEMapCreateLayer("poi_bound",  XDServerURL, XDServerPORT, true, true, false, Module.ELT_3DPOINT, 0, 15);        //행정구역 명칭
		Module.XDEMapCreateLayer("poi_road",  XDServerURL, XDServerPORT, true, true, false, Module.ELT_3DPOINT, 0, 15);        //교통시설 명칭
		Module.XDEMapCreateLayer("facility_dokdo",XDServerURL,XDServerPORT,true,true,false,9,0,15); //독도
		//Module.setVisibleRange("facility_build", 10, 40000); //가시범위 확장
		//Module.getMap().setTileObjectRenewLevel(10);

	// 레이어 리스트 초기화
	trueLayerList = new Module.JSLayerList(true);
	falseLayerList = new Module.JSLayerList(false);
	Module.getNavigation().setPadding(70, 120);

	Module.SetProxy(proxy);
	
	initEvent(Module.canvas);
	//지도 간섭 막기
	div_mouse();
	//검색 POI
	initSearchPoi();
	initWeatherPoi();//기상 poi 호출
	//네비게이션 안보이게
	Module.getNavigation().setNaviVisible(Module.JS_VISIBLE_AUTO);
	
	Module.getViewCamera().setLocation(new Module.JSVector3D(127.46220135664603, 31.56039216088327, 1348461.04383406));
	Module.getViewCamera().setPermitUnderGround(false);
	Module.getViewCamera().setLimitTilt(-88.0);
	Module.getViewCamera().setLimitAltitude(-1000.0);
	Module.getViewCamera().setTilt(67);
}


var WDEVT_FLAG=false;
function initEvent(_canvas) {
	/* 브라우저 이벤트 등록 */
	window.onresize = function(e) {
		Module.Resize(returnWidths(), returnHeights());
		Module.XDRenderData();
	};
	canvas.addEventListener("Fire_EventSelectedObject", function(e) {
		if(e.objKey.indexOf('theLayer_') != -1){
			var gid = e.objKey.split('_');
			
		 getLayerDetail(parseInt(gid[1]),e.layerName);
		}
		if(e.objKey.indexOf('wpoi') != -1){ //날씨 아이콘 클릭 이벤트
			weatherIcoEvtHd(e);
			WDEVT_FLAG = true;
		}
		if(e.objKey.indexOf('coastguard_') != -1){
			var val = e.objKey.split('_');
				val=Number(val[1]);
				
			var params= {
				office_name :ANALYSIS.OfficeNameArr[val]
			};
			
			//클릭한 경찰서 정보 가져오기
			temp_cf_ajax( "/use/gisAnal/getDfResultCoastguard.do", params, _getSelectedDfAnaCoastguardAllPoi);
			
		}
		if(e.objKey.indexOf('office_') != -1){
			var val = e.objKey.split('_');
				val=Number(val[1]);
		
			var params= {
				box_name :ANALYSIS.BoxNameArr[val]
			};
			
			//클릭한 파출소 정보 가져오기
			temp_cf_ajax( "/use/gisAnal/getDfResultPolice.do", params, _getSelectedDfAnaPoliceAllPoi);

		}
		if(e.objKey.indexOf('anaylsis_accident_') != -1){
			var val = e.objKey.split('_');
			
			var selectMonth=$("#rangeSlider").val().split('월')[0];
			
			if($("#rangeSlider").val().split('월')[0].length==1){
				selectMonth='0'+selectMonth;
			}
			
			var params= {
				"search_month":'-'+selectMonth,
				"police_box":$('#analysis_select_area option:selected').val(),
				safeacdnt_sn : val[2]
			};
		
			//경찰서 poi 클릭한 정보 조회
			temp_cf_ajax( "/use/gisAnal/getPoliceAccidentDataPoi.do", params, _getSelectedPoliceAccidentDataPoi);
		}
		if(e.objKey.indexOf('search_ship_accident_') != -1){
			var val = e.objKey.split('_');
			
			var params = {
				acdnt_mng_no : val[3]
			};
	
			//사고 poi 클릭한 정보 조회
			temp_cf_ajax( "/use/gisAnal/getAccident.do", params, _getShipAccident);	
		}
		if(e.objKey.indexOf('search_coast_accident_') != -1){
			var val = e.objKey.split('_');
			
			var params = {
				acdnt_mng_no : val[3]
			};
	
			//사고 poi 클릭한 정보 조회
			temp_cf_ajax( "/use/gisAnal/getAccident.do", params, _getCoastAccident);
			
		}
		if(e.objKey.indexOf('field_photo_') != -1){
			var val = e.objKey.split('_');
			
			var params = {
				idx : val[2]
			};
	
			//현장사진 상세정보 가져오기
			temp_cf_ajax( "/use/gisAnal/getFileListDetail.do", params, _getFileListDetail);
		}
	});	
}

//지도 이벤트 간섭 막기
function div_mouse(){

	var divListId = ["topmenu"];
	
	$.each(divListId, function(key, value){
		var eDiv = document.getElementById(value);
		eDiv.onmouseover = function(e) {
			Module.XDIsMouseOverDiv(true);
		};
		eDiv.onmouseout = function(e) {
			Module.XDIsMouseOverDiv(false);
		};	
	});
	
	var divListClass = ["map_tools",,"map_section","analysis_service","ship_accident","allMenu","tab-btn left_nav","contents_ui","roundbox","wrap_search"
		,"search_result","only_list","wrap_seaway","ship_result","seaway_result","accident_result","pop_section_info"
		,"statistics_list","data_result", "analysis_result_pop", "analysis_result_list","view_mode", "num_result","fieldPhoto_div","slider_div","analysis_list"];
	
	
	$.each(divListClass, function(key, value){
		
		var eDiv = document.getElementsByClassName(value);
		for(i=0;i<eDiv.length;i++){
		eDiv[i].onmouseover = function(e) {
			Module.XDIsMouseOverDiv(true);
		};
		eDiv[i].onmouseout = function(e) {
			Module.XDIsMouseOverDiv(false);
		};	
		}
	});
	
	//맵툴바 액티브영역
	var eDiv = $(".sub li");
	$.each(eDiv, function(key, value){
		eDiv[key].onmouseover = function(e) {
			Module.XDIsMouseOverDiv(true);
		};
		eDiv[key].onmouseout = function(e) {
			Module.XDIsMouseOverDiv(false);
		};	
		});
}

$( document ).ready(function() {
//검색시 엔터가능
$("#search_word").keypress(function(e) { 
	if (e.keyCode == 13){
		search_vworld(1);
	}    
});
});
