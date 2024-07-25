/**
 * 해상교통
 */
$( document ).ready(function() {
	// 오늘 날짜
	var now = new Date();
	
	// 일주일전~하루전으로 조회날짜 설정
  	for(var i=60;i>0;i--){

  		var tempDate=new Date(now.setDate(now.getDate() - i));
  		var year=tempDate.getFullYear();
  		var month=tempDate.getMonth()+1;
  		var date=tempDate.getDate();
  		if(month<10){
  			month='0'+month;
  		}
  		if(date<10){
  			date='0'+date;
  		}
  		MARITIME.DATEARR.push(year+'/'+month+'/'+date);
  		now = new Date();
  	}
  	
  	//해상교통 조회조건- 조회날짜 슬라이더 생성
	$("#vpassDateSlider").ionRangeSlider({
        skin: "round",
        grid:false,
        /*grid_num:4,
        grid_snap:false,*/
        values: MARITIME.DATEARR,
        from:60
    });
	
	//해상교통 조회조건- 조회날짜 슬라이더 디자인
	$("#vpassDateSlider").change(function(){
	   if($("#vpassDateSlider").val()==MARITIME.DATEARR[0]){
		   $('.irs-single').addClass('m4_irs_to_first');
	   }else{
		   $('.irs-single').removeClass('m4_irs_to_first');
	   }
	   if($("#vpassDateSlider").val()==MARITIME.DATEARR[MARITIME.DATEARR.length-1]){
		   $('.irs-single').addClass('m4_irs_to_last');
	   }else{
		   $('.irs-single').removeClass('m4_irs_to_last');
	   }
	});
	
	//해상교통 vpass, ais 
	$('.maritime_traffic_checkbox').change(function (e) {
		//vpassDateSlider에서 선택되어 있는 날짜
		var date=$('#vpassDateSlider').val();
		
		if($(this).is(":checked")){
			
			// vpass 항적레이어 가져오기
			if(this.id.split('-')[1]=="vpass"){
				getShipVpassWms(MARITIME.VPASSLAYER);
				
			// ais 항적레이어 가져오기
			}else if(this.id.split('-')[1]=="ais"){
				getShipAisWms(MARITIME.AISLAYER);		
			}
			
		}else{
			// vpass 항적레이어 삭제
			if(this.id.split('-')[1]=="vpass"){
				initVpassLegend();
				
			// ais 항적레이어 삭제
			}else if(this.id.split('-')[1]=="ais"){
				initAisLegend();
			}	
		}
	});
});


/*
 * 해상교통 전역변수
 * */
var MARITIME={
	DATEARR:[],	//조회날짜 배열
	VPASSLAYER:'',
	AISLAYER:''
};

/*
 * 해상교통 초기 메뉴 진입시
 * */
function initMaritimeTraffic(){
	if($(".m4").hasClass("active")){
		$('.maritime_traffic_mode').removeClass('hide');
		
		//카메라 위치 이동(lon,lat,alt,tilt,direct)
		setViewCamera(127.46220135664603, 31.56039216088327, 1284964.7099245824, 67, 0);
		
		//기존 vpass, ais 항적 초기화
		initVpassLegend();
		initAisLegend();
		
		//초기값 = 하루전
		var now = new Date();
		var tempDate=new Date(now.setDate(now.getDate() - 1));
  		var year=tempDate.getFullYear();
  		var month=tempDate.getMonth()+1;
  		var date=tempDate.getDate();
  		if(month<10){
  			month='0'+month;
  		}
  		if(date<10){
  			date='0'+date;
  		}
		
		//해상교통 데이터 정상동작시 아래 두줄 주석해제
  		MARITIME.VPASSLAYER='th_track_'+year+month+date+'_l';
  		MARITIME.AISLAYER='tm_track_'+year+month+date+'_l';
  		
		//해상교통 데이터 정상동작시 아래 두줄 주석
		//MARITIME.VPASSLAYER='th_track_20210329_l';
		//MARITIME.AISLAYER='tm_track_20211110_l';
		
		//초기진입시 - 오늘날짜 하루전
		if(date==''){
			getShipVpassWms(MARITIME.VPASSLAYER);
			
		//vpassDateSlider에서 선택되어 있는 날짜
		}else{
			getShipVpassWms(MARITIME.AISLAYER);
		}
	}
}

/*
 * 조회 버튼 클릭시
 * */
function getMaritimeTrafficData(){
	initVpassLegend();
	initAisLegend();
	closePop();
	
	if(trueLayerList.nameAtLayer("MARITIME_TRAFFICE_LINE") != null){		
		trueLayerList.nameAtLayer("MARITIME_TRAFFICE_LINE").removeAll();
	}
	if(trueLayerList.nameAtLayer("MARITIME_TRAFFICE_SELECTED_LINE") != null){		
		trueLayerList.nameAtLayer("MARITIME_TRAFFICE_SELECTED_LINE").removeAll();
	}
	
	$('.maritimeTraffice_list_div').addClass('hide');
	
	var date=$("#vpassDateSlider").val();
	
	//해상교통 데이터 정상동작시 아래 두줄 주석해제
	MARITIME.VPASSLAYER='th_track_'+date.split('/')[0]+date.split('/')[1]+date.split('/')[2]+'_l';
	MARITIME.AISLAYER='tm_track_'+date.split('/')[0]+date.split('/')[1]+date.split('/')[2]+'_l';
	
	//해상교통 데이터 정상동작시 아래 두줄 주석
	//MARITIME.VPASSLAYER='th_track_20210329_l';
	//MARITIME.AISLAYER='tm_track_20211110_l';
	
	if($("input:checkbox[id='maritimeTraffic-vpass']").is(":checked")){
		//VPASS WMS 항적 가져오기
		getShipVpassWms(MARITIME.VPASSLAYER);
	}
	if($("input:checkbox[id='maritimeTraffic-ais']").is(":checked")){
		//VPASS AIS 항적 가져오기
		getShipAisWms(MARITIME.AISLAYER);
	}
}

/*
 * wms 레이어 삭제
 * */
function removeWms(_layer){
	if(falseLayerList.nameAtLayer(_layer) != null){
		falseLayerList.delLayerAtName(_layer);	
	}
}

/*
 * vpass wms 범례 초기화
 * */
function initVpassLegend(){
	removeWms(MARITIME.VPASSLAYER);
	$('.wrap_legend2').addClass('hide');
	$('.wrap_legend2 dl dd').removeClass('legend_disabled');
	$('.wrap_legend2 dl dt').removeClass('legend_disabled');
}

/*
 * ais wms 범례 초기화
 * */
function initAisLegend(){
	removeWms(MARITIME.AISLAYER);
	$('.wrap_legend').addClass('hide');
	$('.wrap_legend dl dd').removeClass('legend_disabled');
	$('.wrap_legend dl dt').removeClass('legend_disabled');
}


/*
 * vpass 항적레이어 가져오기
 * */
function getShipVpassWms(_layer){
	//우선 vpass 데이터 하나라서 임시로 불러오기
	createLayerVpassWMS(MARITIME.VPASSLAYER,null);
	//createLayerVpassWMS(_layer);	
	
	showLegend2('민간어선','rgb(255,255,0)',
			   '공공선','rgb(0,255,0)');
	
	$('.wrap_legend2 dl dd').click(function(){
		if($(this).hasClass("legend_disabled")){
			$(this).prev().removeClass('legend_disabled');
			$(this).removeClass('legend_disabled');
			
		}else{
			$(this).prev().addClass('legend_disabled');
			$(this).addClass('legend_disabled');	
		}
	
		//항적레이어 삭제
		removeWms(MARITIME.VPASSLAYER);
		
		//항적레이어 생성
		createLayerVpassWMS(MARITIME.VPASSLAYER, makeVpassCqlStr());
	});
}

/*
 * vpass 항적레이어 WMS 호출
 * */
function createLayerVpassWMS(_layer,_cqlStr) {
	
	var vpassLayer = falseLayerList.createWMSLayer(_layer);
	
	let option = {
		url : GeoserverWMS,
		layer : 'kcg:' + _layer,
		minimumlevel : 0,
		maximumlevel : 16,
		tilesize : 256,
		srs : "EPSG:4326",
		parameters : {
			version : "1.1.0",
			cql_filter:_cqlStr,
			styles:"th_track_l"
		}
	};
	
	vpassLayer.setMaxDistance(200000000.0);
	vpassLayer.setMinDistance(1.0);
	if(runEnv=="prod"){
	}else{
		vpassLayer.setProxyRequest(true);
	}
	vpassLayer.setWMSProvider(option);
	//vpassLayer.setStylesWMS("th_track_l");
	vpassLayer.setBBoxOrder(true);
	vpassLayer.clearWMSCache();
	vpassLayer.setVisible(true);
}

/*
 * ais 항적레이어 가져오기
 * */
function getShipAisWms(_layer){
	//우선 ais 데이터 하나라서 임시로 불러오기
	createLayerAisWMS(MARITIME.AISLAYER,null);
		
	showLegend( '국적선박','rgb(255,0,255)',		//440,441
				'북한선박','rgb(255,127,0)',		//445
				'중국선박','rgb(150,75,0)',		//412,413,414
				'일본선박','rgb(138,43,226)',		//431,432	
				'그외선박','rgb(211,211,211)');	//other
	
	
	$('.wrap_legend dl dd').click(function(){
		
		if($(this).hasClass("legend_disabled")){
			$(this).prev().removeClass('legend_disabled');
			$(this).removeClass('legend_disabled');
		}else{
			$(this).prev().addClass('legend_disabled');
			$(this).addClass('legend_disabled');
		}
		
		//항적레이어 삭제
		removeWms(MARITIME.AISLAYER);
		
		//항적레이어 생성
		createLayerAisWMS(MARITIME.AISLAYER,makeAisCqlStr());
	});
}

/*
 * ais 항적레이어 WMS 호출
 * */
function createLayerAisWMS(_layer,_cqlStr) {
	
	var aisLayer = falseLayerList.createWMSLayer(_layer);
	
	let option = {
		url :  GeoserverWMS,
		layer : 'kcg:' + _layer,
		minimumlevel : 0,
		maximumlevel : 16,
		tilesize : 256,
		srs : "EPSG:4326",
		parameters : {
			version : "1.1.0",
			cql_filter:_cqlStr,
			styles:"tm_track_l"
		}
	};
	aisLayer.setMaxDistance(200000000.0);
	aisLayer.setMinDistance(1.0);
	if(runEnv=="prod"){
	}else{
		aisLayer.setProxyRequest(true);
	}
	aisLayer.setWMSProvider(option);
	//aisLayer.setStylesWMS("tm_track_l");
	aisLayer.setBBoxOrder(true);
	aisLayer.clearWMSCache();
	aisLayer.setVisible(true);
}


/*
 * 지도 이동 모드, 항적 선택 모드 변경
 * */
function viewMaritimeTrafficModeChange(){
	
	//항적 선택 모드
	if(!$("#map_move_mode").hasClass("hide")){
		
		$("#map_move_mode").addClass("hide");
		$("#area_select_mode").removeClass("hide");

		Module.XDSetMouseState(21);	
		Module.canvas.onclick = function(e) {
			
			var vPointList = Module.getMap().getInputPointList();
			if (vPointList.count == 0) {
				return;
			}
			var vClickPoint = vPointList.item(0);
			
			//지도에 원그리기
			createBoundaryLayer(vClickPoint.Longitude, vClickPoint.Latitude);
			
			//반경에 속하는 데이터 가져오기
			getBoundaryData(vClickPoint.Longitude, vClickPoint.Latitude);
			
			
			Module.getMap().clearInputPoint();

			$("#area_select_mode").addClass("hide");
			$("#map_move_mode").removeClass("hide");
			Module.XDSetMouseState(1);	
			
		};
		
	//지도 이동 모드
	}else{
		
		$("#area_select_mode").addClass("hide");
		$("#map_move_mode").removeClass("hide");
		
		Module.XDSetMouseState(1);	
	}
	
}

/*
 * 지도에 원그리기
 * */
function createBoundaryLayer(_x,_y){
	//고도에 따라서 반경, 가시범위 다르게
	var radius = 1000.0;
	if(Module.getViewCamera().getAltitude()<5000){
		radius = 500.0;
	}else if(Module.getViewCamera().getAltitude()>5000&&Module.getViewCamera().getAltitude()<50000){
		radius = 1000.0;
	}else if(Module.getViewCamera().getAltitude()>50000&&Module.getViewCamera().getAltitude()<130000){
		radius = 5000.0;
	}else if(Module.getViewCamera().getAltitude()>130000&&Module.getViewCamera().getAltitude()<470000){
		radius = 10000.0;
	}else if(Module.getViewCamera().getAltitude()>470000){
		radius = 15000.0;
	}
	

	//레이어 생성(layerName, layerType, maxDistance, minDistance)
	var boundaryLayer = createTrueLayer("BOUNDARY_POLYGONS", Module.ELT_POLYHEDRON, 3000000000.0, 10.0);
	
	var center = new Module.JSVector3D(_x,_y, 15.0);
	var segment = 40;	// 원을 구성하는 점 수. 점 수가 많을수록 곡면과 가깝게 생성됩니다.
	
	createCirclePolygon(boundaryLayer, "POLYGON_0", center, radius, segment);
}


/*
 * 원폴리곤 생성
 * */
function createCirclePolygon(_layer, id, _center, _radius, _segment, _fillColor, _outlineColor) {

	// 폴리곤 객체 생성
	var polygon = Module.createPolygon(id);

	// 폴리곤 색상 설정
	var polygonStyle = new Module.JSPolygonStyle();
		polygonStyle.setFill(true);
		polygonStyle.setFillColor( new Module.JSColor(100, 238, 137, 95));
		polygonStyle.setOutLineWidth(0);
		
		polygon.setStyle(polygonStyle);

	// 버텍스 폴리곤 형태 설정
	polygon.setCircle(_center, _radius, _segment);
	
	// 레이어에 객체 추가
	_layer.addObject(polygon, 0);
}

/*
 * 반경에 속하는 데이터 가져오기
 * */
function getBoundaryData(_x, _y){
	
	var boundaryString=_x+'%20'+_y;
	
	var layerList=[];
	
	
	// vpass 항적 활성화일때
	if($("input:checkbox[id='maritimeTraffic-vpass']").is(":checked")){
		layerList.push(MARITIME.VPASSLAYER);
	}
	
	// ais 항적 활성화일때
	if($("input:checkbox[id='maritimeTraffic-ais']").is(":checked")){
		layerList.push(MARITIME.AISLAYER);
	}
	
	//라인레이어 생성(layerName, layerType, maxDistance, minDistance)
	var lineLayer = createTrueLayer("MARITIME_TRAFFICE_LINE", Module.ELT_PLANE, 3000000000.0, 2000.0);
	
	//선택됬던 항적 라인레이어 삭제
	removeTrueLayer("MARITIME_TRAFFICE_SELECTED_LINE");
	
	for(var i=0;i<layerList.length;i++){
		
		//반경에 속하는 항적 라인 그리기
		createBoundaryLine(lineLayer,layerList[i],boundaryString,i, layerList.length);
	}
	
}

/*
 * 반경에 속하는 항적 라인 그리기
 * */
function createBoundaryLine(_lineLayer,_layer,_boundaryString,_index,_indexLength){
	
	var colorList=[ new Module.JSColor(200,0,255,0),		// vpass-공공선
					new Module.JSColor(200,255,255,0),		// vpass-민간어선
					new Module.JSColor(200,150,75,0),		// ais - 중국선박(412,413,414)	
					new Module.JSColor(200,138,43,226),		// ais - 일본선박(431,432)
					new Module.JSColor(200,255,0,255),		// ais - 국적선박(440,441)
					new Module.JSColor(200,255,127,0),		// ais - 북한선박(445)
					new Module.JSColor(200,211,211,211)];	// ais - 그외선박
	
	//고도에 따라서 반경 다르게
	var radius=0.01;
	if(Module.getViewCamera().getAltitude()<5000){
		radius = 0.005;
	}else if(Module.getViewCamera().getAltitude()>5000&&Module.getViewCamera().getAltitude()<50000){
		radius = 0.01;
	}else if(Module.getViewCamera().getAltitude()>50000&&Module.getViewCamera().getAltitude()<130000){
		radius = 0.05;
	}else if(Module.getViewCamera().getAltitude()>130000&&Module.getViewCamera().getAltitude()<470000){
		radius = 0.1;
	}else if(Module.getViewCamera().getAltitude()>470000){
		radius = 0.15;
	}
	
	var uurl =  "";
		uurl +=  GeoserverURL+"ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kcg:"+_layer+"&maxFeatures=50&outputFormat=application%2Fjson&cql_filter=DWITHIN(geom,Point("+_boundaryString+"),"+radius+",meters)";
	
	//vpass
	if(_layer.indexOf(MARITIME.VPASSLAYER) != -1){
		
		uurl+="%20AND%20("+makeVpassCqlStr()+")";
		
	//ais
	}else if(_layer.indexOf(MARITIME.AISLAYER) != -1){
		
		uurl+="%20AND%20("+makeAisCqlStr()+")";
	}
	
	
	if(runEnv=="prod"){
		var url = uurl;
	}else{
		var url = proxy + encodeURIComponent(uurl);
	}
	
	var ObjectArray = new Array();	
	
	//  좌표 리스트
	var vPointArr = new Module.Collection();
	
	var office_id = null;

	$.ajax({
		type : "get",
		url : url,
		timeout : 10000,
		dataType : "json",
		async: false,
		error : function(request, status, error) {
			alert("code : " + request.status +","+status +","+ error +"\r\nmessage : "	+ request.responseText);
			// alert('검색에 실패했습니다. \n다시 시도해주세요 ');
		},
		success : function(_data){
			
			// 항적반경 검색결과 리스트 표출
			maritimeTrafficList(_layer, _data, _index, _indexLength);
			
			var result = _data.features;
			
			for(var i=0;i<result.length;i++){
				
				var coordinateList=result[i].geometry.coordinates;
				
				for(var j=0;j<coordinateList.length;j++){
					
					var coordinateLineList=coordinateList[j];
					
					for(var k=0;k<coordinateLineList.length;k++){
						
						var vPoint = new Module.JSVector3D( 
								parseFloat(coordinateLineList[k][0]),		// 경도 (degree)
								parseFloat(coordinateLineList[k][1]), 		// 위도 (degree)
								Module.getMap().getTerrHeight(parseFloat(coordinateLineList[k][0]),parseFloat(coordinateLineList[k][1]))+200);	// 고도 (m)
						
						// 폴리곤 좌표 리스트에 좌표 추가
						vPointArr.add(vPoint);	
					}
					
				}
				
				var object = new Module.createLineString("line"+i);
				object.setUnionMode(false);
				var lineColor = null;
				if(result[i].properties.gubun=='2'){		
					lineColor = colorList[0];  
				}else if(result[i].properties.gubun=='3'){
					lineColor = colorList[1];  
				}else if(result[i].properties.gubun=='412'||result[i].properties.gubun=='413'||result[i].properties.gubun=='414'){
					lineColor = colorList[2];  
				}else if(result[i].properties.gubun=='431'||result[i].properties.gubun=='432'){
					lineColor = colorList[3];  
				}else if(result[i].properties.gubun=='440'||result[i].properties.gubun=='441'){
					lineColor = colorList[4];  
				}else if(result[i].properties.gubun=='445'){
					lineColor = colorList[5];  
				}else{
					lineColor = colorList[6];  
				}
				
				var lineStyle = new Module.JSPolyLineStyle();
				
				lineStyle.setColor(lineColor);
				lineStyle.setWidth(2.0);
				object.setStyle(lineStyle);	
				
				object.setCoordinates(vPointArr);
				
				vPointArr.clear();
				ObjectArray.push(object);
			}
			
			$.each(ObjectArray, function(key, value){ //레이어에 담기 
				// 폴리곤 객체를 레이어에 추가
				if(_lineLayer!=null)_lineLayer.addObject(value, 0);
			});
			Module.XDSetMouseState(Module.MML_INPUT_RECT);

		}
	});
}

var MARITIMETRAFFICLISTHTMLSTR="";
var MARITIMETRAFFICLISTINDEX=1;
/*
 * 항적반경 검색결과 리스트 표출
 * */
function maritimeTrafficList(_layer, _data, _index, _indexLength){

	var thisdata=_data.features;
	
	for(var i=0;i<thisdata.length;i++){
		
		var fieldIdObj = null;
		//vpass
		if(_layer.indexOf("th_") != -1 ){
			fieldIdObj= JSON.stringify({
				fieldId : thisdata[i].properties.rfid_id
			});	
		//ais
		}else if(_layer.indexOf("tm_") != -1){
			fieldIdObj= JSON.stringify({
				fieldId : thisdata[i].properties.target_id
			});	
		}
		
		var layerObj= JSON.stringify({
			layer : _layer
		});	
		

		MARITIMETRAFFICLISTHTMLSTR+="<div style='margin:3px;' onclick='getMaritimeTrafficShipInfo("+layerObj+","+fieldIdObj+");selectMaritimeTrafficShip("+layerObj+","+fieldIdObj+")'>";
		MARITIMETRAFFICLISTHTMLSTR+="<dt><span>"+MARITIMETRAFFICLISTINDEX+"</span>"+stringNullCheck(thisdata[i].properties.begin_dt).split('.')[0]+" - "+stringNullCheck(thisdata[i].properties.end_dt).split('.')[0]+"</dt>";
		
		
		if(thisdata[i].properties.gubun=='2'){
			MARITIMETRAFFICLISTHTMLSTR+="<dd><span class='color' style='background: rgb(0,255,0); color: #fff'>공공선</span>";			
		}else if(thisdata[i].properties.gubun=='3'){
			MARITIMETRAFFICLISTHTMLSTR+="<dd><span class='color' style='background: rgb(255,255,0); color: #000'>민간어선</span>";		
		}else if(thisdata[i].properties.gubun=='412'||thisdata[i].properties.gubun=='413'||thisdata[i].properties.gubun=='414'){
			MARITIMETRAFFICLISTHTMLSTR+="<dd><span class='color' style='background: rgb(150,75,0); color: #fff'>중국선박</span>";		
		}else if(thisdata[i].properties.gubun=='431'||thisdata[i].properties.gubun=='432'){
			MARITIMETRAFFICLISTHTMLSTR+="<dd><span class='color' style='background: rgb(138,43,226); color: #fff'>일본선박</span>";		
		}else if(thisdata[i].properties.gubun=='440'||thisdata[i].properties.gubun=='441'){
			MARITIMETRAFFICLISTHTMLSTR+="<dd><span class='color' style='background: rgb(255,0,255); color: #fff'>국적선박</span>";		
		}else if(thisdata[i].properties.gubun=='445'){
			MARITIMETRAFFICLISTHTMLSTR+="<dd><span class='color' style='background: rgb(255,127,0); color: #fff'>북한선박</span>";		
		}else{
			MARITIMETRAFFICLISTHTMLSTR+="<dd><span class='color' style='background: rgb(211,211,211); color: #fff'>그외선박</span>";		
		}
		
		//vpass
		if(_layer.indexOf("th_") != -1){
			MARITIMETRAFFICLISTHTMLSTR+="<span class='title'>VPASS ID </span><span class='data'>"+stringNullCheck(thisdata[i].properties.rfid_id)+"</span></dd></div>";			
		//ais
		}else if(_layer.indexOf("tm_") != -1){
			MARITIMETRAFFICLISTHTMLSTR+="<span class='title'>AIS ID </span><span class='data'>"+stringNullCheck(thisdata[i].properties.target_id)+"</span></dd></div>";		
		}
		
		MARITIMETRAFFICLISTINDEX++;
	}
	
	
	//데이터 처음
	if(_index==0){
		$('.maritimeTraffice_list_div').removeClass('hide');
		$('.martimeTraffic_list_dl').empty();
		
	}
	
	//데이터 마지막
	if(_index==(_indexLength-1)){
		
		$('.martimeTraffic_list_dl').append(MARITIMETRAFFICLISTHTMLSTR);
		MARITIMETRAFFICLISTHTMLSTR="";
		MARITIMETRAFFICLISTINDEX=1;
	}
}

/*
 * 선택된 선박 상세정보 가져오기
 * */
function getMaritimeTrafficShipInfo(_layer,_fieldId){
	
	var params = {
		field_no : _fieldId.fieldId
	};

	temp_cf_ajax( "/use/gisAnal/getMaritimeTrafficShipInfo.do", params, _getMaritimeTrafficShipInfo);
	
}

/*
 * 선택된 선박 상세정보 표출하기
 * */
function _getMaritimeTrafficShipInfo(_data){
	$('.maritimeTraffic_info_pop').empty();
	var thisdata=_data.data.data;
	var htmlStr="";
		htmlStr= "<h3><span class='title'>선박 정보</span>";
		htmlStr+= "<span class='btn'><button class='close_btn' onclick='closePop()'>닫기</button></span></h3>";

	if(thisdata.length!=0){
		htmlStr+= "<dl class='grid_contents'><dt>선박 관리번호</dt><dd>"+stringNullCheck(thisdata[0].ship_mng_no)+"</dd>";
		htmlStr+= "<dt>선박명</dt><dd>"+stringNullCheck(thisdata[0].ship_nm)+"</dd>";
		htmlStr+= "<dt>선박 분류</dt><dd>"+stringNullCheck(thisdata[0].code_nm)+"</dd>";
		htmlStr+= "<dt>선박 ID</dt><dd>"+stringNullCheck(thisdata[0].ship_id)+"</dd>";
		htmlStr+= "<dt>VPASS ID</dt><dd>"+stringNullCheck(thisdata[0].vpass_id)+"</dd>";	
		htmlStr+= "<dt>MMSI ID</dt><dd>"+stringNullCheck(thisdata[0].mmsi_no)+"</dd>";	
		htmlStr+= "</dl>";
		
	}else{
		htmlStr+= "<dl class='grid_contents'><dd>선택한 선박의 정보가 없습니다.</dd></dl>";
	}
	$('.maritimeTraffic_info_pop').removeClass('hide');
	$('.maritimeTraffic_info_pop').append(htmlStr);

	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 선택된 선박 항적 보기
 * */
function selectMaritimeTrafficShip(_layer,_fieldId){
	var uurl = "";
	
	//vpass
	if(_layer.layer.indexOf("th_") != -1){
		 uurl = GeoserverURL+"ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kcg:"+_layer.layer
			+"&outputFormat=application%2Fjson"
			+"&CQL_FILTER=rfid_id="+_fieldId.fieldId;
	//ais
	}else if(_layer.layer.indexOf("tm_") != -1){
		 uurl = GeoserverURL+"ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kcg:"+_layer.layer
			+"&outputFormat=application%2Fjson"
			+"&CQL_FILTER=target_id="+_fieldId.fieldId;
	}

	if(runEnv=="prod"){
		var url = uurl;
	}else{
		var url = proxy + encodeURIComponent(uurl);
	}
	
	var ObjectArray = new Array();	
	
	//  좌표 리스트
	var vPointArr = new Module.Collection();
	
	var office_id = null;

	
	$.ajax({
		type : "get",
		url : url,
		timeout : 10000,
		dataType : "json",
		async: false,
		error : function(request, status, error) {
			alert("code : " + request.status +","+status +","+ error +"\r\nmessage : "	+ request.responseText);
			// alert('검색에 실패했습니다. \n다시 시도해주세요 ');
		},
		success : function(_data){

			//레이어 생성(layerName, layerType, maxDistance, minDistance)
			var lineLayer = createTrueLayer("MARITIME_TRAFFICE_SELECTED_LINE", Module.ELT_PLANE, 3000000000.0, 2000.0);
			
			var result = _data.features;
			
			for(var i=0;i<result.length;i++){
				var coordinateList=result[i].geometry.coordinates;
				
				for(var j=0;j<coordinateList.length;j++){
					
					var coordinateLineList=coordinateList[j];
					
					for(var k=0;k<coordinateLineList.length;k++){
						
						var vPoint = new Module.JSVector3D( 
								parseFloat(coordinateLineList[k][0]),		// 경도 (degree)
								parseFloat(coordinateLineList[k][1]), 		// 위도 (degree)
								Module.getMap().getTerrHeight(parseFloat(coordinateLineList[k][0]),parseFloat(coordinateLineList[k][1]))+200);	// 고도 (m)
						
						// 폴리곤 좌표 리스트에 좌표 추가
						vPointArr.add(vPoint);	
					}
					
				}
				
				var object = new Module.createLineString("line"+i);
				object.setUnionMode(false);
				
				var lineColor = new Module.JSColor(255,196,48,43);  
				var lineStyle = new Module.JSPolyLineStyle();
				
				lineStyle.setColor(lineColor);
				lineStyle.setWidth(4.0);
				object.setStyle(lineStyle);	
				
				object.setCoordinates(vPointArr);
				
				vPointArr.clear();
				ObjectArray.push(object);
			}
			
			$.each(ObjectArray, function(key, value){ //레이어에 담기 
				// 폴리곤 객체를 레이어에 추가
				if(lineLayer!=null)lineLayer.addObject(value, 0);
			});
			
		}
	});
}


/*
 * 범례에서 활성화된 VPASS 선박으로 cql Str 만들기
 * */
function makeVpassCqlStr(){
	var gubunStrList=["gubun%20IN(3)","gubun%20IN(2)"];
	var cqlStrList=[];
	var cqlStr="";

	for(var i=0;i<gubunStrList.length;i++){
		if(!$('#legend2_'+(i+1)+'_text').hasClass('legend_disabled')){
			cqlStrList.push(gubunStrList[i]);
		}			
	}
	
	if(cqlStrList.length==0){
		cqlStr="gubun%20IN(999999)";
	}else{
		for(var i=0;i<cqlStrList.length;i++){
			if(i==cqlStrList.length-1){
				cqlStr+=cqlStrList[i];
			}else{
				cqlStr+=cqlStrList[i]+"%20OR%20";	
			}	
		}			
	}

	return cqlStr;
}


/*
 * 범례에서 활성화된 AIS 선박으로 cql Str 만들기
 * */
function makeAisCqlStr(){
	var gubunStrList=["gubun%20IN(440,441)","gubun%20IN(445)","gubun%20IN(412,413,414)","gubun%20IN(432)","gubun%20NOT%20IN(440,441,445,412,413,414,431,432)"];
	var cqlStrList=[];
	var cqlStr="";
	
	for(var i=0;i<gubunStrList.length;i++){
		if(!$('#legend'+(i+1)+'_text').hasClass('legend_disabled')){
			cqlStrList.push(gubunStrList[i]);
		}			
	}
	
	if(cqlStrList.length==0){
		cqlStr="gubun%20IN(999999)";
	}else{
		for(var i=0;i<cqlStrList.length;i++){
			if(i==cqlStrList.length-1){
				cqlStr+=cqlStrList[i];
			}else{
				cqlStr+=cqlStrList[i]+"%20OR%20";	
			}	
		}			
	}

	return cqlStr;
}
