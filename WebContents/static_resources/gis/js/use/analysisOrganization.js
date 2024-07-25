/**
 * 분석서비스 - 조직정원 
 */
$( document ).ready(function() {

	//조직정원 탭 컨트롤
	$(".analysis_organization_tab").click(function(){

		$('.analysis_organization_tab').removeClass('active');
		$(this).addClass('active');
		
		$('.analysiss_organization_div').addClass('hide');
		$('#analysis_organization_div_'+this.id.split('_')[3]).removeClass('hide');

	});

	//경찰서, 파출소 POI 체크박스
	$('.analysis_organization_layer_checkbox').change(function (e) {
		if($(this).is(":checked")){
			//카메라 설정
			//setViewCamera();
			var params={};
			
			// 조직정원 - 경찰서 Poi 가져오기
			if(this.id.split('-')[1]=="COASTGUARD"){
				temp_cf_ajax( "/use/gisAnal/getDfResultCoastguard.do", params, _getDfResultCoastguardPoi);
				
			// 조직정원 - 파출소 Poi 가져오기
			}else if(this.id.split('-')[1]=="POLICE"){
				temp_cf_ajax( "/use/gisAnal/getDfResultPolice.do", params, _getDfResultPolicePoi);
			}
			
		}else{
			trueLayerList.nameAtLayer(this.id.split('-')[1]+"_MARKER").removeAll();		
		}
	});
	
	//경찰서, 파출소 치안수요 및 필요정원 조회 체크박스
	$('.analysis_organization_result_checkbox').change(function (e) {
		if($(this).is(":checked")){
			//카메라 위치 이동(lon,lat,alt,tilt,direct)
			setViewCamera(127.46220135664603, 31.56039216088327, 1348461.04383406,67, 0);
			var params={};
			
			// 조직정원 - 경찰서 Poi 가져오기
			if(this.id.split('-')[1]=="COASTGUARD"){
				// 조직정원 - 경찰서 데이터 가져오기
				temp_cf_ajax( "/use/gisAnal/getDfResultCoastguard.do", params, _getDfResultCoastguard);
				
			}else if(this.id.split('-')[1]=="POLICE"){
				// 조직정원 - 파출소 데이터 가져오기
				temp_cf_ajax( "/use/gisAnal/getDfResultPolice.do", params, _getDfResultPolice);
				
			}
			
		}else{

			// 조직정원 - 경찰서 Poi 가져오기
			if(this.id.split('-')[1]=="COASTGUARD"){
				// 레이어 있으면 삭제
				if(trueLayerList.nameAtLayer("DF_RESULT_COASTGUARD_POLYGON_LAYER") != null){		
					trueLayerList.nameAtLayer("DF_RESULT_COASTGUARD_POLYGON_LAYER").removeAll();
				}
				// 레이어 있으면 삭제
				if(trueLayerList.nameAtLayer("OFFICE_POP") != null){		
					trueLayerList.nameAtLayer("OFFICE_POP").removeAll();
				}
				$('.wrap_legend').addClass('hide');
				
			}else if(this.id.split('-')[1]=="POLICE"){
				// 레이어 있으면 삭제
				if(trueLayerList.nameAtLayer("DF_RESULT_POLICE_POLYGON_LAYER") != null){		
					trueLayerList.nameAtLayer("DF_RESULT_POLICE_POLYGON_LAYER").removeAll();
				}
				// 레이어 있으면 삭제
				if(trueLayerList.nameAtLayer("BOX_POP") != null){		
					trueLayerList.nameAtLayer("BOX_POP").removeAll();
				}
				$('.wrap_legend2').addClass('hide');
			}
			
		}
	});

});

function getOrganization(){
	
	$('.analysis_tab').removeClass('hide');
	$('.analysis_tab_div').removeClass('hide');
	
	//getOfficeOrganizationResult("analysis_organization_office_result_checkbox");
	
	//카메라 위치 이동(lon,lat,alt,tilt,direct)
	setViewCamera(127.46220135664603, 31.56039216088327, 1348461.04383406,67, 0);
	var params={};
	// 조직정원 - 경찰서 데이터 가져오기
	temp_cf_ajax( "/use/gisAnal/getDfResultCoastguard.do", params, _getDfResultCoastguard);

	
	getDfResultCoastguardPaging(1);
	getDfResultPolicePaging(1);
	
	//경찰서 범례클릭시
	$('.wrap_legend dl dd').click(function(){

		if($(this).hasClass("legend_disabled")){
			$(this).prev().removeClass('legend_disabled');
			$(this).removeClass('legend_disabled');
			
		}else{
			$(this).prev().addClass('legend_disabled');
			$(this).addClass('legend_disabled');
			
		}
		temp_cf_ajax( "/use/gisAnal/getDfResultCoastguard.do", params, _getDfResultCoastguard);

	});
	
	//파출소 범례클릭시
	$('.wrap_legend2 dl dd').click(function(){

		if($(this).hasClass("legend_disabled")){
			$(this).prev().removeClass('legend_disabled');
			$(this).removeClass('legend_disabled');
			
		}else{
			$(this).prev().addClass('legend_disabled');
			$(this).addClass('legend_disabled');
			
		}
		temp_cf_ajax( "/use/gisAnal/getDfResultPolice.do", params, _getDfResultPolice);

	});

}

function getDfResultCoastguardPaging(current){
	
	var totalRecordCount=0;	//건에 대한 총갯수 
	var pageIndex = current;
    var cnt = 0;
	var etp =  pageIndex*10;
	var stp =  etp - (10-1) ;
	
	var params= {
		n_st : stp,
		n_ed : etp
	};	
		
	//조직정원 경찰서 데이터 가져오기 - 페이징
	temp_cf_ajax( "/use/gisAnal/getDfResultCoastguardPaging.do", params , function(_data){

    	$('.analysis_organization_office_dl').empty();
		if(_data.total.data[0].count == 0) {	//검색결과 없는 경우 로직 패스
			$('.analysis_organization_office_dl').append("검색결과가 없습니다.");
		} else {	//검색결과 있는 경우 로직 수행
			
			totalRecordCount = _data.total.data[0].count;
    		$(_data.data.data).each(function(key,val) {
    			
    			var index=(Number(current-1)*10)+Number(cnt+1);
    			var htmlStr="";
    			
    			//조회 결과 목록에 뿌릴 html
    			htmlStr+="<div style='margin:3px;' onclick='movePolygon("+val.the_geom_point+",\"office\")'>";
    			
    			htmlStr+="<dt><span>"+index+"</span>"+val.belong1+" > "+val.coastguard+"</dt>";
    			
    			if(val.workloadrate4=="A+"){
    				htmlStr+="<dd><span class='color' style='background: rgba(211,78,69,170); color: #fff'>"+val.workloadrate4+"등급</span>";			
    			}else if(val.workloadrate4=="A"){
    				htmlStr+="<dd><span class='color' style='background: rgba(214,104,100,170); color: #fff'>"+val.workloadrate4+"등급</span>";			
    			}else if(val.workloadrate4=="B"){
    				htmlStr+="<dd><span class='color' style='background: rgba(221,135,135,170); color: #fff'>"+val.workloadrate4+"등급</span>";		
    			}else if(val.workloadrate4=="C"){
    				htmlStr+="<dd><span class='color' style='background: rgba(229,173,173,170); color: #fff'>"+val.workloadrate4+"등급</span>";		
    			}
    			
    			htmlStr+="<span class='title'>치안수요  </span><span class='data'>"+Number.parseFloat(val.workload).toFixed(2)+"</span>";
    			htmlStr+="<span class='title'>필요정원 </span><span class='data'>"+val.new_psncpa+"</span></dd></div>";	
    			
    			$('.analysis_organization_office_dl').append(htmlStr);
    			cnt++;
    		});
		}
		makePaging(pageIndex, totalRecordCount, "getDfResultCoastguardPaging", 'analysis_organization_office_paging', 10);
		temp_cf_loadingbarHide();
	});
}


function getDfResultPolicePaging(current){

	var totalRecordCount=0;	//건에 대한 총갯수 
	var pageIndex = current;
    var cnt = 0;
	var etp =  pageIndex*10;
	var stp =  etp - (10-1) ;

	var params= {
		n_st : stp,
		n_ed : etp
	};	
			
		
	//조직정원 파출소 데이터 가져오기 - 페이징
	temp_cf_ajax( "/use/gisAnal/getDfResultPolicePaging.do", params , function(_data){

    	$('.analysis_organization_box_dl').empty();
		if(_data.total.data[0].count == 0) {	//검색결과 없는 경우 로직 패스
			$('.analysis_organization_box_dl').append("검색결과가 없습니다.");
		} else {	//검색결과 있는 경우 로직 수행
			
			totalRecordCount = _data.total.data[0].count;
    		$(_data.data.data).each(function(key,val) {

    			var index=(Number(current-1)*10)+Number(cnt+1);
    			var htmlStr="";
    			
    			//조회 결과 목록에 뿌릴 html
    			htmlStr+="<div style='margin:3px;' onclick='movePolygon("+val.the_geom_point+",\"box\")'>";
    			
    			if(val.orgnzt_nm==null){
    				htmlStr+="<dt><span>"+index+"</span>"+val.belong1+" > "+val.belong2+"</dt>";
    			}else{
    				htmlStr+="<dt><span>"+index+"</span>"+val.belong1+" > "+val.belong2+" > "+val.orgnzt_nm+"</dt>";
    			}
    			if(val.workloadrate4=="A+"){
    				htmlStr+="<dd><span class='color' style='background: rgba(211,78,69,200); color: #fff'>"+val.workloadrate4+"등급</span>";			
    			}else if(val.workloadrate4=="A"){
    				htmlStr+="<dd><span class='color' style='background: rgba(214,104,100,200); color: #fff'>"+val.workloadrate4+"등급</span>";			
    			}else if(val.workloadrate4=="B"){
    				htmlStr+="<dd><span class='color' style='background: rgba(221,135,135,200); color: #fff'>"+val.workloadrate4+"등급</span>";		
    			}else if(val.workloadrate4=="C"){
    				htmlStr+="<dd><span class='color' style='background: rgba(229,173,173,200); color: #fff'>"+val.workloadrate4+"등급</span>";		
    			}
    			
    			htmlStr+="<span class='title'>치안수요  </span><span class='data'>"+Number.parseFloat(val.workload).toFixed(2)+"</span>";
    			htmlStr+="<span class='title'>필요정원 </span><span class='data'>"+val.new_psncpa_police+"</span></dd></div>";										
    		
    			$('.analysis_organization_box_dl').append(htmlStr);
    			cnt++;
    		});
		}
		makePaging(pageIndex, totalRecordCount, "getDfResultPolicePaging", 'analysis_organization_box_paging', 10);
		temp_cf_loadingbarHide();
	});
}

//탭 컨트롤
function analysisOrganizationTabControl(_id){
	
	$('.analysis_tab').removeClass('active');
	$('#'+_id).addClass('active');
	
	$('.analysis_div').addClass('hide');
	$('#analysis_organization_div_'+_id.split('_')[3]).removeClass('hide');
	
}

/*
 *  조직정원 - 경찰서 Poi 표출하기
 * */
function _getDfResultCoastguardPoi(_data){
	var thisdata =_data.data.data;
	
	//레이어 삭제
	//deleteLayer();
	
	//레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("COASTGUARD_MARKER", 5, 4800000.0, 640000.0);
	
	for(var i=0;i<thisdata.length;i++){
		var geom;

		//데이터에서 좌표부분, 일단 0번째 좌표만 불러오기
		geom = JSON.parse(thisdata[i].the_geom_point);
		//geom=geom.coordinates[0];
		
		var x=geom.coordinates[0];
		var y=geom.coordinates[1];
		
		var paramArr=[
			x,
			y,
			3000,
			thisdata[i].coastguard,
			i];
		
		//경찰서  poi 그리기
		drawMark(paramArr, "/static_resources/gis/img/icon/police_office2.png","COASTGUARD_MARKER","coastguard_");
		
		//객체 선택모드로 변경
		//Module.XDSetMouseState(6);
	}	
	temp_cf_loadingbarHide();
}

/*
 *  조직정원 - 경찰서 관할구역별 치안부담도 및 필요정원 조회
 * */
function _getDfResultCoastguard(_data){
	
	_drawOrganizationOfficePop(_data);
	
	var thisdata=_data.data.data;
	
	//경찰서 관할구역별 치안부담도 및 필요정원 목록에 데이터 출력
	//_getDfResultCoastguardList(_data);
	
	
	// 폴리곤 레이어 생성(layerName, layerType, maxDistance, minDistance)
	var polygonLayer = createTrueLayer("DF_RESULT_COASTGUARD_POLYGON_LAYER", Module.ELT_POLYHEDRON, 20000000.0, 6000.0);
	
	// 폴리곤 좌표 리스트
	var vPointArr = new Module.Collection();
	
	// 폴리곤 리스트
	var polyArr = [];
	
	// 값에 따른 그리드 셀 색상 리스트
	var polygonColor = [
		new Module.JSColor(170,211,78,69),		//빨
		new Module.JSColor(170,214,104,100),	//빨
		new Module.JSColor(170,221,135,135),	//빨
		new Module.JSColor(170,229,173,173)		//빨
	];
	
	// 폴리곤 스타일 설정
	var polygonStyle = new Module.JSPolygonStyle();

		polygonStyle.setOutLine(true);
		
	
	var thisdata=_data.data.data;
	var coordinates;

	var stepCountArr=[0,0,0,0];
	for(var i=0;i<thisdata.length;i++){
		polygonStyle.setOutLineColor(new Module.JSColor(150, 0, 0, 0));
		//박규호 업데이트 엔진에서 DEM이 바뀔때 폴리곤에 선이 생겨서 포항경찰서만 외곽선 지우겠습니다.
		if(thisdata[i].coastguard==" GS-ITM부트캠프"){
			polygonStyle.setOutLineColor(new Module.JSColor(0, 0, 0, 0));
		}
		//데이터에서 좌표부분, 일단 0번째 좌표만 불러오기
		coordinates = JSON.parse(thisdata[i].the_geom).coordinates[0];
	
		for(var j=0;j<coordinates[0].length;j++){
			
			var vPoint = new Module.JSVector3D( 
					parseFloat(coordinates[0][j][0]),		// 경도 (degree)
					parseFloat(coordinates[0][j][1]), 		// 위도 (degree)
					Module.getMap().getTerrHeight(parseFloat(coordinates[0][j][0]),parseFloat(coordinates[0][j][1]))+5000);	// 고도 (m)
			// 폴리곤 좌표 리스트에 좌표 추가
			vPointArr.add(vPoint);
		}
		
		if(thisdata[i].workloadrate4=='A+'){
			if(!$('#legend1_text').hasClass('legend_disabled')){
				polygonStyle.setFill(true);
				polygonStyle.setFillColor(polygonColor[0]);
			}else{
				polygonStyle.setFill(true);
				polygonStyle.setFillColor(new Module.JSColor(100,128,128,128));
			}
			stepCountArr[0]++;				
		}else if(thisdata[i].workloadrate4=='A'){
			if(!$('#legend2_text').hasClass('legend_disabled')){
				polygonStyle.setFill(true);
				polygonStyle.setFillColor(polygonColor[1]);
			}else{
				polygonStyle.setFill(true);
				polygonStyle.setFillColor(new Module.JSColor(100,128,128,128));
			}
			stepCountArr[1]++;				
		}else if(thisdata[i].workloadrate4=='B'){
			if(!$('#legend3_text').hasClass('legend_disabled')){
				polygonStyle.setFill(true);
				polygonStyle.setFillColor(polygonColor[2]);
			}else{
				polygonStyle.setFill(true);
				polygonStyle.setFillColor(new Module.JSColor(100,128,128,128));
			}
			stepCountArr[2]++;				
		}else if(thisdata[i].workloadrate4=='C'){
			if(!$('#legend4_text').hasClass('legend_disabled')){
				polygonStyle.setFill(true);
				polygonStyle.setFillColor(polygonColor[3]);
			}else{
				polygonStyle.setFill(true);
				polygonStyle.setFillColor(new Module.JSColor(100,128,128,128));
			}
			stepCountArr[3]++;				
		}
		
		// 폴리곤 객체 생성
		var polygon = Module.createPolygon("Polygon"+i);
		polygon.setCoordinates(vPointArr);
		polygon.setStyle(polygonStyle);
		//polygon.setUnionMode(true);
		polygon.setHeight(10);
		vPointArr.clear();
		// 폴리곤 리스트에 폴리곤 객체 추가
		polyArr.push(polygon);
			
	}
	
	
	$.each(polyArr, function(key, value){ //레이어에 담기 
		// 폴리곤 객체를 레이어에 추가
		if(polygonLayer!=null)polygonLayer.addObject(value, 0);
	});
	
	//범례추가
	showLegend('경찰서 A+등급['+stepCountArr[0]+']','rgba(211,78,69,170)',
			   '경찰서 A등급['+stepCountArr[1]+']','rgba(214,104,100,170)',
			   '경찰서 B등급['+stepCountArr[2]+']','rgba(221,135,135,170)',
			   '경찰서 C등급['+stepCountArr[3]+']','rgba(229,173,173,170)');
	
	temp_cf_loadingbarHide();
}


/*
 * 파출소 말풍선 html2canvas 방식으로 그리기엔 너무느려서
 * 사전에 이미지로 생성해놓은다음 불러옴
 * */
function _drawOrganizationOfficePop(_data){

	//레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("OFFICE_POP", 5, 600000.0, 1.0);

	for(var i=0;i<_data.data.data.length;i++){
		var geom = JSON.parse(_data.data.data[i].the_geom_point);
		
		var lon = geom.coordinates[0];
		var lat = geom.coordinates[1];
		
		var paramArr=[
			lon,
			lat,
			3000,
			_data.data.data[i].coastguard,
			i];
		
		//경찰서  poi 그리기
		//drawPop(paramArr, "/static_resources/gis/img/organizationPopupImage/popup2/office2/office"+"_"+lon+"_"+lat+".png","OFFICE_POP","office_pop_"+i);
		drawPop(paramArr, "/static_resources/gis/img/organizationPopupImage/newPopup/office/office_"+changeOfficeName(_data.data.data[i].coastguard)+".png","OFFICE_POP","office_pop_"+i);
		
		//객체 선택모드로 변경
		//Module.XDSetMouseState(6);
	}
}



/*
 *  조직정원 - 파출소 Poi 표출하기
 * */
function _getDfResultPolicePoi(_data){
	var thisdata =_data.data.data;
	
	//레이어 삭제
	//deleteLayer();
	
	//레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("POLICE_MARKER", 5, 300000.0, 80000.0);

	for(var i=0;i<thisdata.length;i++){
		var geom;

		//데이터에서 좌표부분, 일단 0번째 좌표만 불러오기
		geom = JSON.parse(thisdata[i].the_geom_point);
		//geom=geom.coordinates[0];
		
		var x=geom.coordinates[0];
		var y=geom.coordinates[1];
		
		var paramArr=[
			x,
			y,
			1000,
			thisdata[i].orgnzt_nm,
			i];
		
		//경찰서  poi 그리기
		drawMark(paramArr, "/static_resources/gis/img/icon/police_box2.png","POLICE_MARKER","office_");
		
		//객체 선택모드로 변경
		//Module.XDSetMouseState(6);
	}	
	temp_cf_loadingbarHide();
}

/*
 *  조직정원 - 파출소 관할구역별 치안부담도 및 필요정원 조회
 * */
function _getDfResultPolice(_data){

	var thisdata=_data.data.data;
	
	_drawOrganizationBoxPop(_data);
	
	//경찰서 관할구역별 치안부담도 및 필요정원 목록에 데이터 출력
	//_getDfResultCoastguardList(_data);

	// 폴리곤 레이어 생성(layerName, layerType, maxDistance, minDistance)
	var polygonLayer = createTrueLayer("DF_RESULT_POLICE_POLYGON_LAYER", Module.ELT_POLYHEDRON, 20000000.0, 6000.0);
	
	// 폴리곤 좌표 리스트
	var vPointArr = new Module.Collection();
	
	// 폴리곤 리스트
	var polyArr = [];
	
	// 값에 따른 그리드 셀 색상 리스트
	var polygonColor = [
		new Module.JSColor(200,211,78,69),		//빨
		new Module.JSColor(200,214,104,100),	//빨
		new Module.JSColor(200,221,135,135),	//빨
		new Module.JSColor(200,229,173,173)		//빨
	];
	
	// 폴리곤 스타일 설정
	var polygonStyle = new Module.JSPolygonStyle();

		polygonStyle.setOutLine(true);
		polygonStyle.setOutLineColor(new Module.JSColor(150, 0, 0, 0));
	
		
	var thisdata=_data.data.data;

	var stepCountArr=[0,0,0,0];
	for(var i=0;i<thisdata.length;i++){
		
		//데이터에서 좌표부분, 일단 0번째 좌표만 불러오기
		var geoms = JSON.parse(thisdata[i].the_geom).coordinates;
		
		for(var k=0;k<geoms.length;k++){
			
			var coordinates = geoms[k];
			
			for(var j=0;j<coordinates.length;j++){
				for(var l=0;l<coordinates[j].length;l++){
					var vPoint = new Module.JSVector3D( 
							parseFloat(coordinates[j][l][0]),		// 경도 (degree)
							parseFloat(coordinates[j][l][1]), 		// 위도 (degree)
							Module.getMap().getTerrHeight(parseFloat(coordinates[j][l][0]),parseFloat(coordinates[j][l][1]))+6000);	// 고도 (m)
					// 폴리곤 좌표 리스트에 좌표 추가
					vPointArr.add(vPoint);
				}
			}

			if(thisdata[i].workloadrate4=='A+'){
				if(!$('#legend2_1_text').hasClass('legend_disabled')){
					polygonStyle.setFill(true);
					polygonStyle.setFillColor(polygonColor[0]);
				}else{
					polygonStyle.setFill(true);
					polygonStyle.setFillColor(new Module.JSColor(100,128,128,128));
				}
				stepCountArr[0]++;				
			}else if(thisdata[i].workloadrate4=='A'){
				if(!$('#legend2_2_text').hasClass('legend_disabled')){
					polygonStyle.setFill(true);
					polygonStyle.setFillColor(polygonColor[1]);
				}else{
					polygonStyle.setFill(true);
					polygonStyle.setFillColor(new Module.JSColor(100,128,128,128));
				}
				stepCountArr[1]++;				
			}else if(thisdata[i].workloadrate4=='B'){
				if(!$('#legend2_3_text').hasClass('legend_disabled')){
					polygonStyle.setFill(true);
					polygonStyle.setFillColor(polygonColor[2]);
				}else{
					polygonStyle.setFill(true);
					polygonStyle.setFillColor(new Module.JSColor(100,128,128,128));
				}
				stepCountArr[2]++;				
			}else if(thisdata[i].workloadrate4=='C'){
				if(!$('#legend2_4_text').hasClass('legend_disabled')){
					polygonStyle.setFill(true);
					polygonStyle.setFillColor(polygonColor[3]);
				}else{
					polygonStyle.setFill(true);
					polygonStyle.setFillColor(new Module.JSColor(100,128,128,128));
				}
				stepCountArr[3]++;				
			}
			
			
			// 폴리곤 객체 생성
			var polygon = Module.createPolygon("Polygon"+i);
			polygon.setCoordinates(vPointArr);
			polygon.setStyle(polygonStyle);
			//polygon.setUnionMode(true);
			polygon.setHeight(10);
			vPointArr.clear();
			// 폴리곤 리스트에 폴리곤 객체 추가
			polyArr.push(polygon);
			
		}
			
	}
	
	
	$.each(polyArr, function(key, value){ //레이어에 담기 
		// 폴리곤 객체를 레이어에 추가
		if(polygonLayer!=null)polygonLayer.addObject(value, 0);
	});
	
	//범례추가
	showLegend2('파출소 A+등급['+stepCountArr[0]+']','rgba(211,78,69,200)',
				'파출소 A등급['+stepCountArr[1]+']','rgba(214,104,100,200)',
			   '파출소 B등급['+stepCountArr[2]+']','rgba(221,135,135,200)',
			   '파출소 C등급['+stepCountArr[3]+']','rgba(229,173,173,200)');

	
	temp_cf_loadingbarHide();
}


/*
 * 파출소 말풍선 html2canvas 방식으로 그리기엔 너무느려서
 * 사전에 이미지로 생성해놓은다음 불러옴
 * */
function _drawOrganizationBoxPop(_data){

	//레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("BOX_POP", 5, 65000.0, 1.0);

	for(var i=0;i<_data.data.data.length;i++){
		var geom = JSON.parse(_data.data.data[i].the_geom_point);
		
		var lon = geom.coordinates[0];
		var lat = geom.coordinates[1];
		
		var paramArr=[
			lon,
			lat,
			1000,
			_data.data.data[i].orgnzt_nm,
			i];
		
		//경찰서  poi 그리기
		drawPop(paramArr, "/static_resources/gis/img/organizationPopupImage/newPopup/box/box"+"_"+_data.data.data[i].orgnzt_id+".png","BOX_POP","box_pop_"+i);
		//drawPop(paramArr, "/use/gisAnal/fileImg?p=box"+"_"+lon+"_"+lat+".png","BOX_POP","box_pop_"+i);
		
		//객체 선택모드로 변경
		//Module.XDSetMouseState(6);
	}
}



/*
 * 관할구역으로 이동
 * */
function movePolygon(_coordinates,_area){
	var geom=_coordinates.coordinates[0];
	
	if(_area=='agency'){
		//카메라 위치 이동(lon,lat,alt,tilt,direct)
		setViewCamera(parseFloat(_coordinates.coordinates[0]), parseFloat(_coordinates.coordinates[1]),180000,90,0);
	}else if(_area=='office'){
		//카메라 위치 이동(lon,lat,alt,tilt,direct)
		setViewCamera(parseFloat(_coordinates.coordinates[0]), parseFloat(_coordinates.coordinates[1]),156000,90,0);
	}else if(_area=='box'){
		//카메라 위치 이동(lon,lat,alt,tilt,direct)
		setViewCamera(parseFloat(_coordinates.coordinates[0]), parseFloat(_coordinates.coordinates[1]),11000,90,0);
		
	}		
	
}

/*
 * 경찰서이름변환
 * */
function changeOfficeName(e_layerName){
	var layerName;

	switch(e_layerName)
	{
		case(" GS-ITM부트캠프"):
			layerName = "1";
			return layerName;
			break;
				
		default : return e_layerName; 
				  break;
	}
}

