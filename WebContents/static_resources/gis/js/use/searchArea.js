/*
 * 검색 - 영역검색
 * 
 */
$(document).ready(function() {
	
	//영역검색 버튼 클릭시
	$('#layer_search_dt').click(function(){
		
		console.log($(this).hasClass('active'));
		if(!$(this).hasClass('active')){
			Module.XDSetMouseState(6);
			$('#canvas').off('mousedown mouseup mousemove');
			searchAreaDataInit();
			//initMenuData();
		}else{
			//연안사고 격자 있을경우 실행 안되게 막기
			if(trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER")!=null){
				if(trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER").getObjectCount()!=0){
					mcxDialog.alert('연안사고 격자가 표출된 상태에서\n해당 기능을 이용할 수 없습니다.');
					$(this).removeClass('active');
					return;						
				}
			}
			Module.XDSetMouseState(Module.MML_INPUT_RECT);
			searchAreaEvent();
			
		}
	});
	
});

/*
var THEMATICARR=[
	'TL_YACSGRGY_P','VI_PILBOP_P','TL_SMOZON_P','TB_YACHT_RPNT','TB_FACI_FSHLC',
	'TB_FACI_SPORT','TB_YACHT_MARINA_P','TL_SFISHERY_P','TB_YACHT_SPOINT','TB_FACI_SCENIC',
	'TB_FACI_FISHINGOLE','TB_FACI_CAMPSITE','TB_FACI_BEACH','TL_CCTVVI_P','TL_POLTRP_P',
	'VI_LNDMRK_P','TL_FIRSTA_P','TL_LEQMBD_P','TL_TKTOFC_P','TL_SHWROM_P',
	'TL_ACCOMM_P','TL_INFCEN_P','TL_PRKPLC_P','TL_DREROM_P','TL_TUBLND_P',
	'TL_MALIRE_P','TL_WCHTWR_P','TL_RESCUE_P_PICTURE'
];*/

var THEMATICARR=[
	'TL_YACSGRGY_P','TB_YACHT_RPNT','TB_FACI_FSHLC',
	'TB_FACI_SPORT','TB_YACHT_MARINA_P','TL_SFISHERY_P','TB_YACHT_SPOINT','TB_FACI_SCENIC',
	'TB_FACI_FISHINGOLE','TB_FACI_BEACH','TL_FIRSTA_P','TL_RESCUE_P_PICTURE'
];

//검색결과 전역변수
var SEARCHAREADATA = {
	ACCIDENT_ARR: [],		//연안사고 검색결과 데이터
	ACCIDENT_CNT: 0,
	
	SHIP_ACCIDENT_ARR: [],	//선박사고 검색결과 데이터
	SHIP_ACCIDENT_CNT: 0,
	
	TL_YACSGRGY_P_ARR:[],		//주제도 - 연안침식관리구역
	TL_YACSGRGY_P_GID_ARR:[],
	TL_YACSGRGY_P_CNT:0,

	/*
	VI_PILBOP_P_ARR:[],		//주제도 - 도선사승하선구역
	VI_PILBOP_P_GID_ARR:[],
	VI_PILBOP_P_CNT:0,

	TL_SMOZON_P_ARR:[],		//주제도 - 흡연구역
	TL_SMOZON_P_GID_ARR:[],
	TL_SMOZON_P_CNT:0,
	 */
	TB_YACHT_RPNT_ARR:[],		//주제도 - 갯바위 낚시 포인트
	TB_YACHT_RPNT_GID_ARR:[],
	TB_YACHT_RPNT_CNT:0,

	TB_FACI_FSHLC_ARR:[],		//주제도 - 낚시터유어장
	TB_FACI_FSHLC_GID_ARR:[],
	TB_FACI_FSHLC_CNT:0,

	TB_FACI_SPORT_ARR:[],		//주제도 - 레저스포츠
	TB_FACI_SPORT_GID_ARR:[],
	TB_FACI_SPORT_CNT:0,

	TB_YACHT_MARINA_P_ARR:[],		//주제도 - 마리나정보
	TB_YACHT_MARINA_P_GID_ARR:[],
	TB_YACHT_MARINA_P_CNT:0,

	TL_SFISHERY_P_ARR:[],		//주제도 - 바다낚시터
	TL_SFISHERY_P_GID_ARR:[],
	TL_SFISHERY_P_CNT:0,

	TB_YACHT_SPOINT_ARR:[],		//주제도 - 선상낚시포인트
	TB_YACHT_SPOINT_GID_ARR:[],
	TB_YACHT_SPOINT_CNT:0,

	TB_FACI_SCENIC_ARR:[],		//주제도 - 경관도로
	TB_FACI_SCENIC_GID_ARR:[],
	TB_FACI_SCENIC_CNT:0,

	TB_FACI_FISHINGOLE_ARR:[],		//주제도 - 전망대,조망시설
	TB_FACI_FISHINGOLE_GID_ARR:[],
	TB_FACI_FISHINGOLE_CNT:0,

	/*
	TB_FACI_CAMPSITE_ARR:[],		//주제도 - 캠핑장
	TB_FACI_CAMPSITE_GID_ARR:[],
	TB_FACI_CAMPSITE_CNT:0,
	*/
	TB_FACI_BEACH_ARR:[],		//주제도 - 해수욕장
	TB_FACI_BEACH_GID_ARR:[],
	TB_FACI_BEACH_CNT:0,

	/*
	TL_CCTVVI_P_ARR:[],		//주제도 - CCTV
	TL_CCTVVI_P_GID_ARR:[],
	TL_CCTVVI_P_CNT:0,

	TL_POLTRP_P_ARR:[],		//주제도 - 간이치안출장소
	TL_POLTRP_P_GID_ARR:[],
	TL_POLTRP_P_CNT:0,

	VI_LNDMRK_P_ARR:[],		//주제도 - 등대
	VI_LNDMRK_P_GID_ARR:[],
	VI_LNDMRK_P_CNT:0,
	*/

	TL_FIRSTA_P_ARR:[],		//주제도 - 소방서
	TL_FIRSTA_P_GID_ARR:[],
	TL_FIRSTA_P_CNT:0,

	/*
	TL_LEQMBD_P_ARR:[],		//주제도 - 레저기구탑승장
	TL_LEQMBD_P_GID_ARR:[],
	TL_LEQMBD_P_CNT:0,
	
	TL_TKTOFC_P_ARR:[],		//주제도 - 매표소
	TL_TKTOFC_P_GID_ARR:[],
	TL_TKTOFC_P_CNT:0,

	TL_SHWROM_P_ARR:[],		//주제도 - 샤워장
	TL_SHWROM_P_GID_ARR:[],
	TL_SHWROM_P_CNT:0,

	TL_ACCOMM_P_ARR:[],		//주제도 - 숙박업소
	TL_ACCOMM_P_GID_ARR:[],
	TL_ACCOMM_P_CNT:0,

	TL_INFCEN_P_ARR:[],		//주제도 - 종합안내소
	TL_INFCEN_P_GID_ARR:[],
	TL_INFCEN_P_CNT:0,

	TL_PRKPLC_P_ARR:[],		//주제도 - 주차장
	TL_PRKPLC_P_GID_ARR:[],
	TL_PRKPLC_P_CNT:0,

	TL_DREROM_P_ARR:[],		//주제도 - 탈의실
	TL_DREROM_P_GID_ARR:[],
	TL_DREROM_P_CNT:0,

	TL_TUBLND_P_ARR:[],		//주제도 - 튜브대여소
	TL_TUBLND_P_GID_ARR:[],
	TL_TUBLND_P_CNT:0,

	TL_MALIRE_P_ARR:[],		//주제도 - 수상인명구조대
	TL_MALIRE_P_GID_ARR:[],
	TL_MALIRE_P_CNT:0,

	TL_WCHTWR_P_ARR:[],		//주제도 - 안전요원망루
	TL_WCHTWR_P_GID_ARR:[],
	TL_WCHTWR_P_CNT:0,
	*/
	TL_RESCUE_P_PICTURE_ARR:[],		//주제도 - 인명구조장비함
	TL_RESCUE_P_PICTURE_GID_ARR:[],
	TL_RESCUE_P_PICTURE_CNT:0,

	HIHGLIGHTICONARR: [],
	
	LINESTRING:[]			//영역검색차트에 사용
}

/*
 * 상세정보 팝업 닫기
 * */
function closeSearchAreaInfoPop(){
	$('#search_area_info_pop').addClass('hide');
}

/*
 * 영역검색이벤트
 * */
function searchAreaEvent(){
	$('#canvas').on('mouseup', function handler(evt) {
		if(Module.getViewCamera().getAltitude()>70000){
			mcxDialog.alert('범위가 너무 넓습니다.\n지도를 확대하여 선택해주세요.');
			Module.getMap().clearInputPoint();
			return;	
		}
		if(Module.XDGetMouseState()==22){
			getSearchArea();
		}
	});
}

/*
 * 검색결과 초기화
 * */
function searchAreaDataInit(){
	
	$('#search_area_info_pop').addClass('hide');
	
	SEARCHAREADATA.HIHGLIGHTICONARR=[];
	
	if(trueLayerList.nameAtLayer("SEARCH_AREA_SHIP_ACCIDENT_MARKER") != null){		
		trueLayerList.nameAtLayer("SEARCH_AREA_SHIP_ACCIDENT_MARKER").removeAll();
	}
	if(trueLayerList.nameAtLayer("SEARCH_AREA_ACCIDENT_MARKER") != null){		
		trueLayerList.nameAtLayer("SEARCH_AREA_ACCIDENT_MARKER").removeAll();
	}

	for(var i=0;i<THEMATICARR.length;i++){
		if(trueLayerList.nameAtLayer("SEARCH_AREA_"+THEMATICARR[i]+"_MARKER") != null){		
			trueLayerList.nameAtLayer("SEARCH_AREA_"+THEMATICARR[i]+"_MARKER").removeAll();
		}
	}
	
	if(trueLayerList.nameAtLayer("SEARCH_AREA_LINE_LAYER") != null){		
		trueLayerList.nameAtLayer("SEARCH_AREA_LINE_LAYER").removeAll();
	}
	
	if(trueLayerList.nameAtLayer("SEARCH_AREA_Highlight_MARKER") != null){		
		trueLayerList.nameAtLayer("SEARCH_AREA_Highlight_MARKER").removeAll();
	}
	
	SEARCHAREADATA.ACCIDENT_ARR= [];		//연안사고 검색결과 데이터
	SEARCHAREADATA.ACCIDENT_CNT= 0;
	
	SEARCHAREADATA.SHIP_ACCIDENT_ARR= [];	//선박사고 검색결과 데이터
	SEARCHAREADATA.SHIP_ACCIDENT_CNT= 0;
	
	SEARCHAREADATA.TL_YACSGRGY_P_ARR=[];		//주제도 - 연안침식관리구역
	SEARCHAREADATA.TL_YACSGRGY_P_GID_ARR=[];
	SEARCHAREADATA.TL_YACSGRGY_P_CNT=0;

	/*
	SEARCHAREADATA.VI_PILBOP_P_ARR=[];		//주제도 - 도선사승하선구역
	SEARCHAREADATA.VI_PILBOP_P_GID_ARR=[];
	SEARCHAREADATA.VI_PILBOP_P_CNT=0;

	SEARCHAREADATA.TL_SMOZON_P_ARR=[];		//주제도 - 흡연구역
	SEARCHAREADATA.TL_SMOZON_P_GID_ARR=[];
	SEARCHAREADATA.TL_SMOZON_P_CNT=0;
	*/
	SEARCHAREADATA.TB_YACHT_RPNT_ARR=[];		//주제도 - 갯바위 낚시 포인트
	SEARCHAREADATA.TB_YACHT_RPNT_GID_ARR=[];
	SEARCHAREADATA.TB_YACHT_RPNT_CNT=0;

	SEARCHAREADATA.TB_FACI_FSHLC_ARR=[];		//주제도 - 낚시터유어장
	SEARCHAREADATA.TB_FACI_FSHLC_GID_ARR=[];
	SEARCHAREADATA.TB_FACI_FSHLC_CNT=0;

	SEARCHAREADATA.TB_FACI_SPORT_ARR=[];		//주제도 - 레저스포츠
	SEARCHAREADATA.TB_FACI_SPORT_GID_ARR=[];
	SEARCHAREADATA.TB_FACI_SPORT_CNT=0;

	SEARCHAREADATA.TB_YACHT_MARINA_P_ARR=[];		//주제도 - 마리나정보
	SEARCHAREADATA.TB_YACHT_MARINA_P_GID_ARR=[];
	SEARCHAREADATA.TB_YACHT_MARINA_P_CNT=0;

	SEARCHAREADATA.TL_SFISHERY_P_ARR=[];		//주제도 - 바다낚시터
	SEARCHAREADATA.TL_SFISHERY_P_GID_ARR=[];
	SEARCHAREADATA.TL_SFISHERY_P_CNT=0;

	SEARCHAREADATA.TB_YACHT_SPOINT_ARR=[];		//주제도 - 선상낚시포인트
	SEARCHAREADATA.TB_YACHT_SPOINT_GID_ARR=[];
	SEARCHAREADATA.TB_YACHT_SPOINT_CNT=0;

	SEARCHAREADATA.TB_FACI_SCENIC_ARR=[];		//주제도 - 경관도로
	SEARCHAREADATA.TB_FACI_SCENIC_GID_ARR=[];
	SEARCHAREADATA.TB_FACI_SCENIC_CNT=0;

	SEARCHAREADATA.TB_FACI_FISHINGOLE_ARR=[];		//주제도 - 전망대;조망시설
	SEARCHAREADATA.TB_FACI_FISHINGOLE_GID_ARR=[];
	SEARCHAREADATA.TB_FACI_FISHINGOLE_CNT=0;

	/*
	SEARCHAREADATA.TB_FACI_CAMPSITE_ARR=[];		//주제도 - 캠핑장
	SEARCHAREADATA.TB_FACI_CAMPSITE_GID_ARR=[];
	SEARCHAREADATA.TB_FACI_CAMPSITE_CNT=0;
	 */
	SEARCHAREADATA.TB_FACI_BEACH_ARR=[];		//주제도 - 해수욕장
	SEARCHAREADATA.TB_FACI_BEACH_GID_ARR=[];
	SEARCHAREADATA.TB_FACI_BEACH_CNT=0;

	/*
	SEARCHAREADATA.TL_CCTVVI_P_ARR=[];		//주제도 - CCTV
	SEARCHAREADATA.TL_CCTVVI_P_GID_ARR=[];
	SEARCHAREADATA.TL_CCTVVI_P_CNT=0;

	SEARCHAREADATA.TL_POLTRP_P_ARR=[];		//주제도 - 간이치안출장소
	SEARCHAREADATA.TL_POLTRP_P_GID_ARR=[];
	SEARCHAREADATA.TL_POLTRP_P_CNT=0;

	SEARCHAREADATA.VI_LNDMRK_P_ARR=[];		//주제도 - 등대
	SEARCHAREADATA.VI_LNDMRK_P_GID_ARR=[];
	SEARCHAREADATA.VI_LNDMRK_P_CNT=0;
	 */
	SEARCHAREADATA.TL_FIRSTA_P_ARR=[];		//주제도 - 소방서
	SEARCHAREADATA.TL_FIRSTA_P_GID_ARR=[];
	SEARCHAREADATA.TL_FIRSTA_P_CNT=0;

	/*
	SEARCHAREADATA.TL_LEQMBD_P_ARR=[];		//주제도 - 레저기구탑승장
	SEARCHAREADATA.TL_LEQMBD_P_GID_ARR=[];
	SEARCHAREADATA.TL_LEQMBD_P_CNT=0;
	
	SEARCHAREADATA.TL_TKTOFC_P_ARR=[];		//주제도 - 매표소
	SEARCHAREADATA.TL_TKTOFC_P_GID_ARR=[];
	SEARCHAREADATA.TL_TKTOFC_P_CNT=0;

	SEARCHAREADATA.TL_SHWROM_P_ARR=[];		//주제도 - 샤워장
	SEARCHAREADATA.TL_SHWROM_P_GID_ARR=[];
	SEARCHAREADATA.TL_SHWROM_P_CNT=0;

	SEARCHAREADATA.TL_ACCOMM_P_ARR=[];		//주제도 - 숙박업소
	SEARCHAREADATA.TL_ACCOMM_P_GID_ARR=[];
	SEARCHAREADATA.TL_ACCOMM_P_CNT=0;

	SEARCHAREADATA.TL_INFCEN_P_ARR=[];		//주제도 - 종합안내소
	SEARCHAREADATA.TL_INFCEN_P_GID_ARR=[];
	SEARCHAREADATA.TL_INFCEN_P_CNT=0;

	SEARCHAREADATA.TL_PRKPLC_P_ARR=[];		//주제도 - 주차장
	SEARCHAREADATA.TL_PRKPLC_P_GID_ARR=[];
	SEARCHAREADATA.TL_PRKPLC_P_CNT=0;

	SEARCHAREADATA.TL_DREROM_P_ARR=[];		//주제도 - 탈의실
	SEARCHAREADATA.TL_DREROM_P_GID_ARR=[];
	SEARCHAREADATA.TL_DREROM_P_CNT=0;

	SEARCHAREADATA.TL_TUBLND_P_ARR=[];		//주제도 - 튜브대여소
	SEARCHAREADATA.TL_TUBLND_P_GID_ARR=[];
	SEARCHAREADATA.TL_TUBLND_P_CNT=0;

	SEARCHAREADATA.TL_MALIRE_P_ARR=[];		//주제도 - 수상인명구조대
	SEARCHAREADATA.TL_MALIRE_P_GID_ARR=[];
	SEARCHAREADATA.TL_MALIRE_P_CNT=0;

	SEARCHAREADATA.TL_WCHTWR_P_ARR=[];		//주제도 - 안전요원망루
	SEARCHAREADATA.TL_WCHTWR_P_GID_ARR=[];
	SEARCHAREADATA.TL_WCHTWR_P_CNT=0;
	 */
	SEARCHAREADATA.TL_RESCUE_P_PICTURE_ARR=[];		//주제도 - 인명구조장비함
	SEARCHAREADATA.TL_RESCUE_P_PICTURE_GID_ARR=[];
	SEARCHAREADATA.TL_RESCUE_P_PICTURE_CNT=0;
}
/*
 *	영역검색 결과 가져오기
 */
function getSearchArea(){
	searchAreaDataInit();
	
	//선택 영역 좌표 가져오기 
	if(Module.getMap().getInputPoints().get(0).Latitude==0){
		mcxDialog.alert('지도에서 영역을 선택해 주세요.');
	}else{
	
		
		var polygonLineString=''
		for(var i=0;i<=4;i++){
			if(i!=4){
				polygonLineString+=Module.getMap().getInputPoints().get(i).Longitude+' '+Module.getMap().getInputPoints().get(i).Latitude+',';
			}else{
				polygonLineString+=Module.getMap().getInputPoints().get(i).Longitude+' '+Module.getMap().getInputPoints().get(i).Latitude;
			}
		}
		var param = {
			//start_date:$('#searchArea_rangeSlider').val().split(';')[0],
			//end_date:$('#searchArea_rangeSlider').val().split(';')[1],
			polygon_linestring : 'LINESTRING('+polygonLineString+')',
			layer : ""
		};
	
		SEARCHAREADATA.LINESTRING='LINESTRING('+polygonLineString+')';
		//console.log('LINESTRING('+polygonLineString+')');
		
		//영역에 대한 사고 정보 가져오기
		temp_cf_ajax( "/use/gisAnal/getSearchAreaData.do", param, _getSearchAreaData);
		
		//레이어 생성(layerName, layerType, maxDistance, minDistance)
		var lineLayer = createTrueLayer("SEARCH_AREA_LINE_LAYER", Module.ELT_3DLINE, 20000000.0, 10.0);
		
		// 폴리곤 좌표 리스트
		var vPointArr = new Module.Collection();
		
		// 폴리곤 리스트
		var lineArr = [];
		
		// 폴리곤 스타일 설정
		var lineColor = new Module.JSColor(150,246,187,67);  
	 	var lineStyle = new Module.JSPolyLineStyle();
	 	lineStyle.setColor(lineColor);
		lineStyle.setWidth(1.0);
		
			for(var i=0;i<5;i++){
				// 폴리곤 좌표 리스트에 좌표 추가
				vPointArr.add(Module.getMap().getInputPoints().get(i));
			}
			
			
			// 폴리곤 객체 생성
			var object = Module.createLineString("line"+i);
				object.setCoordinates(vPointArr);
				object.setStyle(lineStyle);
				
				//object.setHeight(500);
				vPointArr.clear();
				
				// 폴리곤 리스트에 폴리곤 객체 추가
				lineArr.push(object);

			$.each(lineArr, function(key, value){ //레이어에 담기 
				// 폴리곤 객체를 레이어에 추가
				if(lineLayer!=null)lineLayer.addObject(value, 0);
			});
			
			
			
		//선택 영역에대한 polygon 생성
		Module.getMap().clearInputPoint();
		
		$('#map_move_mode_checkbox').prop("checked", true);
		$('#area_input_mode_checkbox').prop("checked", false);
		
		//객체 선택모드
		//Module.XDSetMouseState(6);
	}
}

/*
 *	검색결과 가져오기
 */
function _getSearchAreaData(_data){
	
	var accdientData=_data.accdient_data;
	
	// 레이어 리스트 초기화
	trueLayerList = new Module.JSLayerList(true);
	
	//영역검색 아이콘 레이어 추가
	createSearchAreaLayer();
	
	
	for(var i=0;i<accdientData.length;i++){
		//연안사고일때
		if(accdientData[i].acdnt_asort_code=='055001009'		//수상레저사고
		 ||accdientData[i].acdnt_asort_code=='055001010'		//고립자
		 ||accdientData[i].acdnt_asort_code=='055001011'		//응급환자
		 ||accdientData[i].acdnt_asort_code=='055001012'		//실종자
		 ||accdientData[i].acdnt_asort_code=='055001013'		//익수자
		 ||accdientData[i].acdnt_asort_code=='055001999')		//기타
			{
				SEARCHAREADATA.ACCIDENT_CNT++;
				SEARCHAREADATA.ACCIDENT_ARR.push(accdientData[i].acdnt_mng_no);
				var paramArr=[
					accdientData[i].lo,
					accdientData[i].la,
					1000,
					'',
					accdientData[i].acdnt_mng_no];
				
				//경찰서  poi 그리기
				drawSearchMark(paramArr, "/static_resources/gis/img/icon/search_area_acident_icon.png","SEARCH_AREA_ACCIDENT_MARKER","search_area_accident_");
				
		//선박사고일때
		}else if(accdientData[i].acdnt_asort_code=='055001001'		//선박단순사고
			   ||accdientData[i].acdnt_asort_code=='055001002'		//좌초/좌주
			   ||accdientData[i].acdnt_asort_code=='055001003'		//충돌
			   ||accdientData[i].acdnt_asort_code=='055001004'		//화재
			   ||accdientData[i].acdnt_asort_code=='055001005'		//전복
			   ||accdientData[i].acdnt_asort_code=='055001006'		//침수
			   ||accdientData[i].acdnt_asort_code=='055001007'		//기관고장
			   ||accdientData[i].acdnt_asort_code=='055001008'		//기타(선박사고)
			   ||accdientData[i].acdnt_asort_code=='055001015')		//침몰
			{
				SEARCHAREADATA.SHIP_ACCIDENT_CNT++;
				SEARCHAREADATA.SHIP_ACCIDENT_ARR.push(accdientData[i].acdnt_mng_no);
				var paramArr=[
					accdientData[i].lo,
					accdientData[i].la,
					1000,
					'',
					accdientData[i].acdnt_mng_no];
				
				//경찰서  poi 그리기
				drawSearchMark(paramArr, "/static_resources/gis/img/icon/search_area_ship_accident_icon.png","SEARCH_AREA_SHIP_ACCIDENT_MARKER","search_area_ship_accident_");
				
			
			}
			
	}

	for(var i=0;i<THEMATICARR.length;i++){
		
		getThematicData(eval('_data.'+THEMATICARR[i]),THEMATICARR[i]);
	}
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
	getSearchAreaPop();
}

/*
 * 레이어 생성
 * */
function createSearchAreaLayer(){
	//선박사고 아이콘 레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("SEARCH_AREA_SHIP_ACCIDENT_MARKER", 5, 480000.0, 1.0);
	
	//연안사고 아이콘 레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("SEARCH_AREA_ACCIDENT_MARKER", 5, 480000.0, 1.0);

	//주제도 레이어 추가
	for(var i=0;i<THEMATICARR.length;i++){
		//주제도 아이콘 레이어 생성(layerName, layerType, maxDistance, minDistance)
		createTrueLayer("SEARCH_AREA_"+THEMATICARR[i]+"_MARKER", 5, 480000.0, 1.0);
	}
}


/*
 * 주제도 아이콘 생성 및 전역변수에 데이터 넣기
 * */
function getThematicData(_data,_thematicLayer){

	var cnt=0;
	for(var i=0;i<_data.length;i++){
		cnt++;
			
		eval('SEARCHAREADATA.'+_thematicLayer+'_GID_ARR').push(_data[i].gid);

		switch (_thematicLayer) {
		
		  case 'TL_YACSGRGY_P':			//연안침식관리구역
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tl_10);
			  break;
			  /*
		  case 'VI_PILBOP_P':			//도선사승하선구역
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].objnum);
			  break;	
		  case 'TL_SMOZON_P':			//흡연구역
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tl_sm);
			  break;*/
		  case 'TB_YACHT_RPNT':			//갯바위낚시포인트
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tb_ya);
			  break;
		  case 'TB_FACI_FSHLC':			//낚시터유어장
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tb_16);
			  break;
		  case 'TB_FACI_SPORT':			//레저스포츠
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tb_11);
			  break;
		  case 'TB_YACHT_MARINA_P':		//마리나정보
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tb__3);
			  break;
		  case 'TL_SFISHERY_P':			//바다낚시터
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tl_10);
			  break;
		  case 'TB_YACHT_SPOINT':		//선상낚시포인트
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tb__8);
			  break;
		  case 'TB_FACI_SCENIC':		//경관도로
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tb_10);
			  break;
		  case 'TB_FACI_FISHINGOLE':	//전망대,조망시설
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tb_11);
			  break;
			  /*
		  case 'TB_FACI_CAMPSITE':		//캠핑장
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tb_11);
			  break;*/
		  case 'TB_FACI_BEACH':			//해수욕장
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tb_11);
			  break;
			  /*
		  case 'TL_CCTVVI_P':			//CCTV
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tl_10);
			  break;
		  case 'TL_POLTRP_P':			//간이치안출장소
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tl__5);
			  break;
		  case 'VI_LNDMRK_P':			//등대
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].objnum);
			  break;*/
		  case 'TL_FIRSTA_P':			//소방서
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].name);
			  break;
			  /*
		  case 'TL_LEQMBD_P':			//레저기구탑승장
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tb__2);
			  break;
		  case 'TL_TKTOFC_P':			//매표소
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tl_11);
			  break;
		  case 'TL_SHWROM_P':			//샤워장
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tb_12);
			  break;
		  case 'TL_ACCOMM_P':			//숙박업소
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].name);
			  break;
		  case 'TL_INFCEN_P':			//종합안내소
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tl__4);
			  break;
		  case 'TL_PRKPLC_P':			//주차장
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tl_18);
			  break;
		  case 'TL_DREROM_P':			//탈의실
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tl_10);
			  break;
		  case 'TL_TUBLND_P':			//튜브대여소
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tl_10);
			  break;
		  case 'TL_MALIRE_P':			//수상인명구조대
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].pictnm);
			  break;
		  case 'TL_WCHTWR_P':			//안전요원망루
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].st_t_tl_10);
			  break;*/
		  case 'TL_RESCUE_P_PICTURE':			//인명구조장비함
			  eval('SEARCHAREADATA.'+_thematicLayer+'_ARR').push(_data[i].gid);
			  break;
		}
		
		var geom =JSON.parse(_data[i].the_geom);
		var paramArr=[
			geom.coordinates[0],
			geom.coordinates[1],
			1000,
			'',
			_data[i].gid];
		
	
		drawSearchMark(paramArr, "/static_resources/gis/data/"+_thematicLayer+".png","SEARCH_AREA_"+_thematicLayer+"_MARKER","search-area-"+_thematicLayer+"-");
	}
	eval('SEARCHAREADATA.'+_thematicLayer+'_CNT'+'=cnt');
}

/*
 * poi 그리기
 * */
function drawSearchMark(pArr,img_src,layer_name,mark_name){

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
			/*object.setBlink(true);
			object.setBlinkSize(1.5);
			object.setBlinkColor(246,187,67);*/
			var setFlag = object.setVisibleRange(true, 1,10000000);
		}catch(e){
			console.log(e.message);
		}
	}
	
	
}

function setHighlightIcon(_layer,_id){
	if(SEARCHAREADATA.HIHGLIGHTICONARR!=null){
		for(var i=0;i<SEARCHAREADATA.HIHGLIGHTICONARR.length;i++){
			SEARCHAREADATA.HIHGLIGHTICONARR[i].setBlink(false);
			SEARCHAREADATA.HIHGLIGHTICONARR=[];
		}
	}else{
	
	}
	var object = trueLayerList.nameAtLayer(_layer).keyAtObject(_id);
	object.setBlink(true);
	object.setBlinkSize(1.5);
	object.setBlinkColor(246,187,67);
	SEARCHAREADATA.HIHGLIGHTICONARR.push(object);
	
	//getSearchAreaInfoPop(_id);
}

function getSearchAreaInfoPop(_id){
	$('#search_area_info_pop').removeClass('hide');
	
	var htmlStr="";
	
	//연안사고
	if(_id.indexOf('search_area_accident_') != -1){
		$('#search_area_info_title').text('연안사고 정보');
		var param={
			acdnt_mng_no:_id.split('_')[3]
		};
		
		//영역에 대한 사고 정보 가져오기
		temp_cf_ajax( "/use/gisAnal/getSearchAreaAccidentInfo.do", param, function(_data){
			
			var accidentInfo=_data.data;

			if(accidentInfo.length!=0){
				htmlStr+="<dt>사고 관리번호</dt><dd>"+stringNullCheck(accidentInfo[0].acdnt_mng_no)+"</dd>";
				htmlStr+="<dt>사고 개요</dt><dd>"+textLengthOverCut(stringNullCheck(accidentInfo[0].acdnt_smry),100)+"</dd>";
				htmlStr+="<dt>발생 일시</dt><dd>"+stringNullCheck(accidentInfo[0].rcept_dt)+"</dd>";
				htmlStr+="<dt>발생 위치</dt><dd>"+Number.parseFloat(accidentInfo[0].lo).toFixed(6)+" "+Number.parseFloat(accidentInfo[0].la).toFixed(6)+"</dd>";
			}
			
			$('#search_area_info_dl').empty();
			$('#search_area_info_dl').append(htmlStr);
			//로딩바 숨기기
			temp_cf_loadingbarHide();
		});

	}
	
	//선박사고
	if(_id.indexOf('search_area_ship_accident_') != -1){
		$('#search_area_info_title').text('선박사고 정보');
		var param={
			acdnt_mng_no:_id.split('_')[4]
		};
		
		//영역에 대한 사고 정보 가져오기
		temp_cf_ajax( "/use/gisAnal/getAccident.do", param, function(_data){
			
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
			
	
			if(accidentInfo.length!=0){
				htmlStr+="<td>사고 관리번호</dt><dd>"+stringNullCheck(accidentInfo[0].acdnt_mng_no)+"</dd>";
				htmlStr+="<td>사고 개요</dt><dd>"+stringNullCheck(accidentInfo[0].acdnt_smry)+"</dd>";
				htmlStr+="<td>발생 일시</dt><dd>"+stringNullCheck(accidentInfo[0].rcept_dt)+"</dd>";			
			}
			
			if(accidentLocation.length!=0){
				htmlStr+= "<td>발생 위치</dt><dd>"+Number.parseFloat(accidentLocation[0].lo).toFixed(6)+" "+Number.parseFloat(accidentLocation[0].la).toFixed(6)+"</dd>";	
				
			}

			if(accidentShip.length!=0){
				htmlStr+= "<td>선박 ID</dt><dd>"+stringNullCheck(accidentShip[0].ship_id)+"</dd>";
				htmlStr+= "<td>선박명</dt><dd>"+stringNullCheck(accidentShip[0].ship_nm)+"</dd>";
				htmlStr+= "<td>RFID</dt><dd>"+stringNullCheck(accidentShip[0].vpass_id)+"</dd>";
				htmlStr+= "<td>MMSI</dt><dd>"+stringNullCheck(accidentShip[0].mmsi_no)+"</dd>";
			}
			
			if(accidentRescueStatus.length!=0){
				htmlStr+= "<td>구조 인원</dt><dd>"+stringNullCheck(accidentRescueStatus[0].rescue_nmpr_co)+"</dd>";
				htmlStr+= "<td>실종 인원</dt><dd>"+stringNullCheck(accidentRescueStatus[0].mss_nmpr_co)+"</dd>";
				htmlStr+= "<td>부상 인원</dt><dd>"+stringNullCheck(accidentRescueStatus[0].inj_nmpr_co)+"</dd>";
				htmlStr+= "<td>사망자수</dt><dd>"+stringNullCheck(accidentRescueStatus[0].dprs_co)+"</dd>";
			}

			if(accidentInfo.length!=0){
				htmlStr+= "<td>풍향,풍속</dt><dd>"+stringNullCheck(accidentInfo[0].wd_ws)+"</dd>";
				htmlStr+= "<td>파고</dt><dd>"+stringNullCheck(accidentInfo[0].wvhgt)+"</dd>";
				htmlStr+= "<td>수온</dt><dd>"+stringNullCheck(accidentInfo[0].wtrtmp)+"</dd>";
				htmlStr+= "<td>수심</dt><dd>"+stringNullCheck(accidentInfo[0].dpwt)+"</dd>";
				htmlStr+= "<td>조류</span>"+stringNullCheck(accidentInfo[0].tdlcrnt)+"</dd>";
			}

			$('#search_area_info_dl').empty();
			$('#search_area_info_dl').append(htmlStr);
			//로딩바 숨기기
			temp_cf_loadingbarHide();
		});
	}
	
	//주제도
	if(_id.indexOf('search-area-') != -1){
		$('#search_area_info_title').text('주제도 정보');
		var param={
			layer : _id.split('-')[2],
			gid:Number(_id.split('-')[3])
		};
		
		//영역에 대한 사고 정보 가져오기
		temp_cf_ajax( "/use/gisAnal/getSelctLayerDetail.do", param, function(_data){
			
			var thisdata=_data.data;
			
			if(thisdata.length!=0){
				
			}
			
			
			//로딩바 숨기기
			temp_cf_loadingbarHide();
		});
		
	}
	

	
	//$('#search_area_info_dl').append(htmlStr);
}


/*
 *	검색결과 팝업 열기
 */
function getSearchAreaPop() {
	window.open("/use/gisAnal/searchPop", "a", "width=562, height=434, left=250, top=50, resizeable=no,location=no");
}