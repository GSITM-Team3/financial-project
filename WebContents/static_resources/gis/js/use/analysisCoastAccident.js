/**
 * 분석서비스 - 연안사고 
 */
$( document ).ready(function() {
	
	//서해안 연안사고 다발구역 예측 조회년도 셋팅
	temp_cf_ajax( "/use/gisAnal/getAnaylsisAccidentYear.do", params, function(_data){
		ANALYSIS.COASTACCIDENTYEAR=_data.data.data[0].year;
		$('#anal_year').text(ANALYSIS.COASTACCIDENTYEAR);
	});
	
	//연안사고 조회조건-월 슬라이더 값
	var rangeValue=['1월', '2월', '3월', '4월', '5월', '6월', '7월','8월','9월','10월','11월','12월'];
	
	//연안사고 조회조건-월 슬라이더 생성
	$("#rangeSlider").ionRangeSlider({
        skin: "round",
        grid:true,
        values: rangeValue
    });

	//연안사고 조회조건-월 슬라이더 디자인
	$('.irs-bar--single').css('background-color','#dee4ec');

	$("#rangeSlider").change(function(){
	   if($("#rangeSlider").val()==rangeValue[0]){
		   $('.irs-single').addClass('m2_irs_to_first');
	   }else{
		   $('.irs-single').removeClass('m2_irs_to_first');
	   }
	   
	   if($("#rangeSlider").val()==rangeValue[rangeValue.length-1]){
		   $('.irs-single').addClass('m2_irs_to_last');
	   }else{
		   $('.irs-single').removeClass('m2_irs_to_last');
	   }
	});
	
	//연안사고 조회조건-예측대상 경찰서 리스트 가져오기
	var params={};
	temp_cf_ajax( "/use/gisAnal/getPoliceOfficeList.do", params, _getPoliceOfficeList);
	
	//경찰서 select box 값 변경시
	$('#analysis_select_office').change(function (e) {
		//파출소 리스트 가져오기
		var params={
			police_office:$(this).val()
		};
		temp_cf_ajax( "/use/gisAnal/getPoliceBoxList.do", params, _getPoliceBoxList);
	});
	
	//안전사고 예방시설 체크박스 변경시
	$('.analysis_layer_checkbox').change(function (e) {

		if($(this).is(":checked")){

			var params={};
			if(this.id.split('-')[1]=="COASTGUARD"){
				temp_cf_ajax( "/use/gisAnal/getDfResultCoastguard.do", params, _getDfAnaCoastguardAllPoi);
			}else if(this.id.split('-')[1]=="POLICE"){
				temp_cf_ajax( "/use/gisAnal/getDfResultPolice.do", params, _getDfAnaPoliceAllPoi);
			}else{
				//주제도쓰는 함수로 불러오기
				createLayer(this.id.split('-')[1]);
			}
			
		}else{
			if(this.id.split('-')[1]=="COASTGUARD"||this.id.split('-')[1]=="POLICE"){
				removeTrueLayer(this.id.split('-')[1]+"_MARKER");	
			}else{
				removeTrueLayer(this.id.split('-')[1]);	
			}
			ANALYSIS.OfficeNameArr=[];
			ANALYSIS.BoxNameArr=[];
		}
	});
});

/*
 * 연안사고 마우스 이벤트
 * */
function mouseCoastAccidentEvent(){

	//마우스 휠 이벤트
	$('#canvas').bind('wheel', function(event){
		
		//3D 격자 모드
		if($("#2d_mode").hasClass("hide")){
			
			//카메라 고도가 30000보다 낮으면 격자 레이어 안보이게, 지도(캔버스) 클릭이벤트 삭제
			if(Module.getViewCamera().getAltitude()<30000){
				
				if(trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER")!=null){
					trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER").setVisible(false);					
				}
				
				$('#canvas').off('mousedown mouseup mousemove');
				
				Module.XDSetMouseState(6);
				
				//카메라 고도가 30000보다 높으면 격자 레이어 보이게, 지도(캔버스) 클릭이벤트 생성
			}else{
				
				if(trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER")!=null){
					trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER").setVisible(true);					
				}
				
				//지도(캔버스) 클릭이벤트
				$('#canvas').on('mousedown', function(evt) {
					Module.XDSetMouseState(21);	
					$('#canvas').on('mouseup mousemove', function handler(evt) {
						if (evt.type === 'mouseup') {
							//click
							var vPointList =  Module.getMap().getInputPointList();
							
							if (vPointList.count == 0) {
								return;
							}
							var vClickPoint = vPointList.item(0);
							
							//클릭한 위치의 격자 정보 가져오기
							getDfAnaGridDataOfLocation(vClickPoint.Longitude, vClickPoint.Latitude);				
							
							Module.getMap().clearInputPoint();
							
						} else {
							// drag
							Module.XDSetMouseState(1);	
							
						}
						
						$('#canvas').off('mouseup mousemove', handler);
					});
				});
			}
			
			//2D 격자 모드
		}else{		
			
			//카메라 고도가 30000보다 낮으면 격자 레이어 안보이게, 지도(캔버스) 클릭이벤트 삭제
			if(Module.getViewCamera().getAltitude()<30000){
				
				if(trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER_2D")!=null){
					trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER_2D").setVisible(false);					
				}
				
				$('#canvas').off('mousedown mouseup mousemove');
				
				Module.XDSetMouseState(6);	
				
				//카메라 고도가 30000보다 높으면 격자 레이어 보이게, 지도(캔버스) 클릭이벤트 생성
			}else{
				
				if(trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER_2D")!=null){
					trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER_2D").setVisible(true);					
				}
				
				//지도(캔버스) 클릭이벤트
				$('#canvas').on('mousedown', function(evt) {
					Module.XDSetMouseState(21);	
					$('#canvas').on('mouseup mousemove', function handler(evt) {
						if (evt.type === 'mouseup') {
							//click
							var vPointList =  Module.getMap().getInputPointList();
							
							if (vPointList.count == 0) {
								return;
							}
							var vClickPoint = vPointList.item(0);
							
							//클릭한 위치의 격자 정보 가져오기
							getDfAnaGridDataOfLocation(vClickPoint.Longitude, vClickPoint.Latitude);				
							
							Module.getMap().clearInputPoint();
							
						} else {
							// drag
							Module.XDSetMouseState(1);	
							
						}
						
						$('#canvas').off('mouseup mousemove', handler);
					});
				});
			}
		}
	});
	
}

/*
 * 연안사고 조회조건-예측대상 경찰서 리스트 표출하기
 * */
function _getPoliceOfficeList(_data){
	var thisdata=_data.data.data;
	
	$('#analysis_select_office').empty();
	
	var htmlStr="";
		htmlStr+="<option value='all' >서해안전역</option>";
		
	for(var i=0;i<thisdata.length;i++){
		if(thisdata[i].coastguard_nm.indexOf("GS-ITM부트캠프")==-1){
		htmlStr+="<option value='"+thisdata[i].coastguard_nm+"' > "+thisdata[i].coastguard_nm+"</option>";
		}
	}
	
	$('#analysis_select_office').append(htmlStr);
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
	
}

/*
 * 연안사고 조회조건-예측대상 파출소 리스트 표출하기
 * */
function _getPoliceBoxList(_data){
	var thisdata=_data.data.data;
	
	$('#analysis_select_area').empty();
	
	var htmlStr="";
	
	if(thisdata.length==0){
		htmlStr+="<option value='' >선택해주세요.</option>";
	}else{
		for(var i=0;i<thisdata.length;i++){
			htmlStr+="<option value='"+thisdata[i].police_nm+"' > "+thisdata[i].police_nm+"</option>";
		}
	}
	
	$('#analysis_select_area').append(htmlStr);
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 안전사고 예방시설(경찰서) POI 표출하기
 * */
function _getDfAnaCoastguardAllPoi(_data){
	
	var thisdata =_data.data.data;
	
	//레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("COASTGUARD_MARKER", 5, 480000.0, 1.0);
	
	for(var i=0;i<thisdata.length;i++){
		var geom;

		geom = JSON.parse(thisdata[i].the_geom_point);
		
		var x=geom.coordinates[0];
		var y=geom.coordinates[1];
		
		var paramArr=[
			x,
			y,
			1000,
			thisdata[i].coastguard,
			i];
		
		//경찰서  poi 그리기
		drawMark(paramArr, "/static_resources/gis/img/icon/police_office2.png","COASTGUARD_MARKER","coastguard_");
		
		ANALYSIS.OfficeNameArr.push(thisdata[i].coastguard);
	}
	
	//객체 선택모드로 변경
	Module.XDSetMouseState(6);
	
	temp_cf_loadingbarHide();

}

/*
 * 클릭한 경찰서 정보 표출하기
 * */
function _getSelectedDfAnaCoastguardAllPoi(_data){
	
	var thisdata=_data.data.data;

	$('.analysis_accident_pop').removeClass('hide');
	
	$('.analysis_accident_pop_title').text("경찰서 정보");
	
	
	var btnHtmlStr="<button class='close_btn' style='margin-left: 5px' onclick='closePop()'>닫기</button>";
	var htmlStr= "<dt>관할 경찰청</dt><dd>"+thisdata[0].belong1+"</dd>";
		htmlStr+="<dt>관할 경찰서</dt><dd>"+thisdata[0].coastguard+"</dd>";
		
	$('.analysis_accident_pop_btn').empty();
	$('.analysis_accident_pop_btn').append(btnHtmlStr);
	
	$('.analysis_accident_pop_dl').empty();
	$('.analysis_accident_pop_dl').append(htmlStr);
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 안전사고 예방시설(파출소) POI 표출하기
 * */
function _getDfAnaPoliceAllPoi(_data){
	
	var thisdata =_data.data.data;
	
	//레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("POLICE_MARKER", 5, 480000.0, 1.0);
	
	for(var i=0;i<thisdata.length;i++){
		var geom;

		geom = JSON.parse(thisdata[i].the_geom_point);
		
		var x=geom.coordinates[0];
		var y=geom.coordinates[1];
	
		var paramArr=[
			x,
			y,
			1000,
			thisdata[i].orgnzt_nm,
			i];
		
		//파출소  poi 그리기
		drawMark(paramArr, "/static_resources/gis/img/icon/police_box2.png","POLICE_MARKER","office_");
		
		ANALYSIS.BoxNameArr.push(thisdata[i].orgnzt_nm);
		
	}
	
	//객체 선택모드로 변경
	Module.XDSetMouseState(6);
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 클릭한 파출소 정보 표출하기
 * */
function _getSelectedDfAnaPoliceAllPoi(_data){

	var thisdata=_data.data.data;

	$('.analysis_accident_pop').removeClass('hide');
	$('.analysis_accident_pop_title').text("파출소 정보");
	
	var btnHtmlStr="<button class='close_btn' style='margin-left: 5px' onclick='closePop()'>닫기</button>";
	var htmlStr= "<dt>관할 경찰청</dt><dd>"+thisdata[0].belong1+"</dd>";
		htmlStr+="<dt>관할 경찰서</dt><dd>"+thisdata[0].belong2+"</dd>";
		htmlStr+="<dt>관할 파출소</dt><dd>"+thisdata[0].orgnzt_nm+"</dd>";
		
	$('.analysis_accident_pop_btn').empty();
	$('.analysis_accident_pop_btn').append(btnHtmlStr);
	
	$('.analysis_accident_pop_dl').empty();
	$('.analysis_accident_pop_dl').append(htmlStr);

	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 연안사고 데이터 조회
 * */
function getAnalysisAccidentData(){
	
	//범례 초기화
	$(".wrap_legend").addClass('hide');
	$('.wrap_legend dl dd').off('click');
	$('.wrap_legend dl dd').removeClass('legend_disabled');
	$('.wrap_legend dl dt').removeClass('legend_disabled');
	
	mouseCoastAccidentEvent();
	closePop();
	
	//클릭했던 격자의 정보를 담을 배열 초기화
	ANALYSIS.GridBeforeArr=[];
	
	$('.analysis_tab_div').removeClass('hide');
	
	//위치선택모드 초기화
	$('.view_mode').removeClass('hide');
	$("#2d_mode").removeClass('hide');
	$("#3d_mode").addClass('hide');
	
	//카메라 위치 이동(lon,lat,alt,tilt,direct)
	setViewCamera(127.46220135664603, 31.56039216088327, 1348461.04383406,67,0);
	
	//연안사고 격자별 데이터 가져오기
	getAnaylsisAccidentGridData(1);
	
	//위험도 범례클릭시
	$('.wrap_legend dl dd').click(function(){
		var selectMonth=$("#rangeSlider").val().split('월')[0];
		
		if($(this).hasClass("legend_disabled")){
			$(this).prev().removeClass('legend_disabled');
			$(this).removeClass('legend_disabled');
			
		}else{
			$(this).prev().addClass('legend_disabled');
			$(this).addClass('legend_disabled');
			
		}
		//조회 조건이 서해안 전역일경우
		if($('#analysis_select_office option:selected').val()=='all'){
			params= {
				"search_month":selectMonth
			};
		
		//조회 조건이 특정 파출소일때
		}else{
			params= {
				"search_month":selectMonth,
				"police_box":$('#analysis_select_area option:selected').val()
			}
		}
		
		//연안사고 다발구역 예측 정보 가져오기 - 격자 그리기
		temp_cf_ajax( "/use/gisAnal/getAnaylsisAccidentGridData.do", params, _getAnaylsisAccidentGridData);

	});
}



/*
 * 연안사고 격자별 데이터 가져오기
 * */
function getAnaylsisAccidentGridData(current){
	
	$('#analysis_div').removeClass('hide');
	
	var selectMonth=$("#rangeSlider").val().split('월')[0];
	/*if($("#rangeSlider").val().split('월')[0].length==1){
		selectMonth='0'+selectMonth;
	}*/
	
	var params={};
	
	//페이징 초기화
	var totalRecordCount=0;	//건에 대한 총갯수 
	var pageIndex = current;
	var cnt = 0;
	var etp =  pageIndex*10;
	var stp =  etp - (10-1) ;
	
	//조회 조건이 서해안 전역일경우
	if($('#analysis_select_office option:selected').val()=='all'){
		params= {
				"search_month":selectMonth,
				n_st : stp,
				n_ed : etp
		};
	
	//조회 조건이 특정 파출소일때
	}else{
		params= {
				"search_month":selectMonth,
				"police_box":$('#analysis_select_area option:selected').val(),
				n_st : stp,
				n_ed : etp
		}
	}

	//초기 실행시에만 사고정보 가져오기
	if(current==1){
		
		//연안사고 다발구역 예측 정보 가져오기 - 격자 그리기
		temp_cf_ajax( "/use/gisAnal/getAnaylsisAccidentGridData.do", params, _getAnaylsisAccidentGridData);
		
		if($("#rangeSlider").val().split('월')[0].length==1){
			selectMonth='0'+selectMonth;
		}
		
		//서해안 전역 조회일 경우
		if($('#analysis_select_office option:selected').val()=='all'){
			
			var accident_params= {
				"search_month":'-'+selectMonth,
				"police_box":''
			}
			//연안사고 정보 가져오기
			temp_cf_ajax( "/use/gisAnal/getPoliceAccidentDataPoi.do", accident_params, _getPoliceAccidentDataPoi);
			
		//파출소별 조회일 경우
		}else{

			var accident_params= {
				"search_month":'-'+selectMonth,
				"police_box":$('#analysis_select_area option:selected').val()
			}
			//연안사고 정보 가져오기
			temp_cf_ajax( "/use/gisAnal/getPoliceAccidentDataPoi.do", accident_params, _getPoliceAccidentDataPoi);
		}
		
	}
	console.log(params)
	//연안사고 다발구역 예측 정보 가져오기 - 페이징
	temp_cf_ajax( "/use/gisAnal/getAnaylsisAccidentGridDataPaging.do", params , function(_data){

		console.log(_data)
    	$('.analysis_result_dl').empty();
    	
    	//검색결과 없는 경우 로직 패스
		if(_data.total.data[0].count == 0) {	
			$('.analysis_result_dl').append("검색결과가 없습니다.");
		
		//검색결과 있는 경우 로직 수행
		} else {								
			
			totalRecordCount = _data.total.data[0].count;
    		$(_data.data.data).each(function(key,val) {
    			
    			var risk="";
    			
    			//서해안 전역 조회일 경우
    			if($('#analysis_select_office option:selected').val()=='all'){
    				risk=val.grade;
    			//파출소별 조회일 경우
    			}else{
    				risk=val.grade_police;
    			}
    			
    			//격자 색 설정값 초기화
    			var color=[0,0,0];
    			//격자 색 설정
				if(risk=="고위험"){		//red
					color=[219,68,85];
				}else if(risk=="위험"){	//orange
					color=[246,187,67];
				}else if(risk=="주의"){	//yellow
					color=[255,255,0];
				}else if(risk=="보통"){	//green
					color=[60,179,113];	
				}else if(risk=="안전"){	//blue
					color=[75,137,220];		
				}
    			
    			var index=(Number(current-1)*10)+Number(cnt+1);
    			
    			var htmlStr="";
    			htmlStr+="<div style='margin:3px;' onclick='showAnalysisResultPop("+JSON.stringify(val)+"); moveGrid("+val.the_geom+","+val.index_y+","+val.index_x+","+color[0]+","+color[1]+","+color[2]+");'>";
    			
    			if(val.police_box==null){
    				htmlStr+="<dt><span>"+index+"</span>"+val.agency_nm+" > "+val.coastguard_nm+"</dt>";
    			}else{
    				htmlStr+="<dt><span>"+index+"</span>"+val.agency_nm+" > "+val.coastguard_nm+" > "+val.police_nm+"</dt>";
    			}
    			
    			if(risk=="고위험"){
    				htmlStr+="<dd><span class='color' style='background: red; color: #fff'>"+risk+"</span>";			
    			}else if(risk=="위험"){
    				htmlStr+="<dd><span class='color' style='background: orange; color: #fff'>"+risk+"</span>";		
    			}else if(risk=="주의"){
    				htmlStr+="<dd><span class='color' style='background: yellow; color: #000'>"+risk+"</span>";		
    			}else if(risk=="보통"){
    				htmlStr+="<dd><span class='color' style='background: green; color: #fff'>"+risk+"</span>";		
    			}else if(risk=="안전"){
    				htmlStr+="<dd><span class='color' style='background: blue; color: #fff'>"+risk+"</span>";		
    			}
    			
    			htmlStr+="<span class='title'>예측값 </span><span class='data'>"+Number.parseFloat(val.result).toFixed(2)+"</span>";
    			htmlStr+="<span class='title'>격자번호 </span><span class='data'>"+val.grid_no+"</span></dd></div>";									
    			
    		
    			$('.analysis_result_dl').append(htmlStr);
    			cnt++;
    		});
		}
		
		makePaging(pageIndex, totalRecordCount, "getAnaylsisAccidentGridData", 'analysis_grid_paging', 10);
		
		//로딩바 숨기기
		temp_cf_loadingbarHide();
	});

	
}

/*
 * 연안사고 다발 구역 격자에 데이터 표출(3D 격자 레이어)
 * */
function _getAnaylsisAccidentGridData(_data){
	
	var thisdata=_data.data.data;
	var centerData=_data.center.data;
	
	//연안사고 다발 구역 격자에 데이터 표출(2D 격자 레이어)
	_getAnaylsisAccidentGridData2D(_data);
	
	//파출소별 조회일 경우(카메라 위치 이동)
	if($('#analysis_select_office option:selected').val()!='all'){
		var geom = JSON.parse(centerData[0].center_geom);
		//카메라 위치 이동(lon,lat,alt,tilt,direct)
		setViewCamera(parseFloat(geom.coordinates[0]), parseFloat(geom.coordinates[1]),120000,90, 0);
	}
	
	// 격자 레이어 생성(layerName, layerType, maxDistance, minDistance)
	var layer = createTrueLayer("DF_ANA_GRID_LAYER", Module.ELT_POLYHEDRON, 20000000.0, 100000.0);
	
	// 격자 poi(격자 num) 레이어 있으면 삭제
	var poiLayer = createTrueLayer("DF_ANA_GRID_POI", Module.ELT_POLYHEDRON, 75000.0, 10000.0);
	
	trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER").setVisible(false);
	trueLayerList.nameAtLayer("DF_ANA_GRID_POI").setVisible(false);
	
	// 그리드 객체 생성
	ANALYSIS.GRID_colorGrid3D = Module.createColorGrid3D("DF_ANA_GRID");

	// 최대, 최소 rect와 셀 갯수에 따른 그리드 cell 위치 지정
	ANALYSIS.GRID_colorGrid3D.SetGridCellDefaultColor(new Module.JSColor(0, 0, 0, 0));

	// 그리드 셀의 위치 및 크기, 높이 설정
	var rowNum = 180,
		colNum = 160;
	
	var gridCellNum = ANALYSIS.GRID_colorGrid3D.SetGridPosition(
		new Module.JSVector2D(124, 38.95), 		// 그리드 좌상단
		new Module.JSVector2D(133, 38.95), 		// 그리드 우상단
		new Module.JSVector2D(133, 30.9), 		// 그리드 우하단
		new Module.JSVector2D(124, 30.9), 		// 그리드 좌하단
		1000.0, 								// 그리드 바닥면 고도
		rowNum, 								// 그리드 가로 셀 갯수
		colNum									// 그리드 세로 셀 갯수
	);

	// 값에 따른 그리드 셀 색상 리스트
	var gridCellColor = [
		new Module.JSColor(150,219,68,85),		//빨
		new Module.JSColor(150,246,187,67),		//주
		new Module.JSColor(150,255,255,0),		//노
		new Module.JSColor(150,60,179,113),		//초
		new Module.JSColor(150,75,137,220)		//파
	];
	
	
	//범례에 표시할 고위험, 위험, 주의, 보통, 안전 갯수
	var stepCountArr=[0,0,0,0,0];
	
	// 격자 cell line color 초기화
	for(var i=0;i<180;i++){
		for(var j=0;j<160;j++){
			ANALYSIS.GRID_colorGrid3D.SetGridCellLineColor(i, j,  new Module.JSColor(0,0,0,0));
		}
	}
	
	for(var i=0;i<thisdata.length;i++){
	
		var risk="";
		
		//서해안 전역 조회일 경우
		if($('#analysis_select_office option:selected').val()=='all'){
			risk=thisdata[i].grade;
		//파출소별 조회일 경우
		}else{
			risk=thisdata[i].grade_police;
		}
		
		
		//서해안 전역 조회일 경우
		if($('#analysis_select_office option:selected').val()!='all'){
			var geom;
	
			geom = JSON.parse(thisdata[i].the_center_geom);
			
			var x=geom.coordinates[0];
			var y=geom.coordinates[1];
			
			//격자에 격자 번호 표시
			var poi = Module.createPoint(thisdata[i].grid_no);
			var vec3 = new Module.JSVector3D();
			
			vec3.Longitude = parseFloat(x);
			vec3.Latitude = parseFloat(y);
			vec3.Altitude = thisdata[i].result*10000;
			
			poi.setPosition(vec3);
			poi.setText(thisdata[i].grid_no);
			
			// 레이어에 오브젝트 추가
			poiLayer.addObject(poi, 0);
			
		}
		
		//격자 색 설정
		if(risk =='고위험') 		{
			if(!$('#legend1_text').hasClass('legend_disabled')){
				ANALYSIS.GRID_colorGrid3D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, gridCellColor[0]);
			}else{
				ANALYSIS.GRID_colorGrid3D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, new Module.JSColor(0,0,0,0));
			}
			stepCountArr[0]++;
		}else if(risk =='위험')	{
			if(!$('#legend2_text').hasClass('legend_disabled')){
				ANALYSIS.GRID_colorGrid3D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, gridCellColor[1]);
			}else{
				ANALYSIS.GRID_colorGrid3D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, new Module.JSColor(0,0,0,0));
			}
			stepCountArr[1]++;
		}else if(risk =='주의')	{
			if(!$('#legend3_text').hasClass('legend_disabled')){
				ANALYSIS.GRID_colorGrid3D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, gridCellColor[2]);
			}else{
				ANALYSIS.GRID_colorGrid3D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, new Module.JSColor(0,0,0,0));
			}
			stepCountArr[2]++;
		}else if(risk =='보통')	{
			if(!$('#legend4_text').hasClass('legend_disabled')){
				ANALYSIS.GRID_colorGrid3D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, gridCellColor[3]);
			}else{
				ANALYSIS.GRID_colorGrid3D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, new Module.JSColor(0,0,0,0));
			}
			stepCountArr[3]++;
		}else if(risk =='안전')	{
			if(!$('#legend5_text').hasClass('legend_disabled')){
				ANALYSIS.GRID_colorGrid3D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, gridCellColor[4]);
			}else{
				ANALYSIS.GRID_colorGrid3D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, new Module.JSColor(0,0,0,0));
			}
			stepCountArr[4]++;
		}
		
		// 셀 높이 설정
		ANALYSIS.GRID_colorGrid3D.SetGridCellHeight(thisdata[i].index_y, thisdata[i].index_x, thisdata[i].result*10000);
		
		//격자 외곽라인 색 설정
		ANALYSIS.GRID_colorGrid3D.SetGridCellLineColor(thisdata[i].index_y, thisdata[i].index_x,  new Module.JSColor(150,  0,0,0));
	}
	
	// 그리드 외곽 라인 색상 설정
	//colorGrid3D.SetGridLineColor(gridCellColor[0]);

	// 설정한 옵션으로 그리드 객체 형태 생성
	ANALYSIS.GRID_colorGrid3D.Create();
	
	//레이어에 격자 객체 추가
	layer.addObject(ANALYSIS.GRID_colorGrid3D, 0);
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
	
	//범례추가
	showLegend('고위험['+stepCountArr[0]+']','rgba(219,68,85,150)',
			   '위험['+stepCountArr[1]+']','rgba(246,187,67,150)',
			   '주의['+stepCountArr[2]+']','rgba(255,255,0,150)',
			   '보통['+stepCountArr[3]+']','rgba(60,179,113,150)',
			   '안전['+stepCountArr[4]+']','rgba(75,137,220,150)');
	
}



/*
 * 연안사고 다발 구역 격자에 데이터 표출(2D 격자 레이어)
 * */
function _getAnaylsisAccidentGridData2D(_data){

	var thisdata=_data.data.data;
	var centerData=_data.center.data;
	
	//2D 격자 레이어 생성(layerName, layerType, maxDistance, minDistance)
	var layer = createTrueLayer("DF_ANA_GRID_LAYER_2D", Module.ELT_POLYHEDRON, 20000000.0, 100000.0);
	
	//격자 poi(격자 num) 레이어 생성(layerName, layerType, maxDistance, minDistance)
	var poiLayer = createTrueLayer("DF_ANA_GRID_POI_2D", Module.ELT_3DPOINT, 55000.0, 10000.0);
	
	trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER_2D").setVisible(true);
	trueLayerList.nameAtLayer("DF_ANA_GRID_POI_2D").setVisible(true);
	
	// 그리드 객체 생성
	ANALYSIS.GRID_colorGrid2D = Module.createColorGrid3D("DF_ANA_GRID");

	// 최대, 최소 rect와 셀 갯수에 따른 그리드 cell 위치 지정
	ANALYSIS.GRID_colorGrid2D.SetGridCellDefaultColor(new Module.JSColor(0, 0, 0, 0));

	// 그리드 셀의 위치 및 크기, 높이 설정
	var rowNum = 180,
		colNum = 160;

	var gridCellNum = ANALYSIS.GRID_colorGrid2D.SetGridPosition(
		new Module.JSVector2D(124, 38.95), 		// 그리드 좌상단
		new Module.JSVector2D(133, 38.95), 		// 그리드 우상단
		new Module.JSVector2D(133, 30.9), 		// 그리드 우하단
		new Module.JSVector2D(124, 30.9), 		// 그리드 좌하단
		1000.0, 								// 그리드 바닥면 고도
		rowNum, 								// 그리드 가로 셀 갯수
		colNum									// 그리드 세로 셀 갯수
	);
	
	// 값에 따른 그리드 셀 색상 리스트
	var gridCellColor = [
		new Module.JSColor(150,219,68,85),		//빨
		new Module.JSColor(150,246,187,67),		//주
		new Module.JSColor(150,255,255,0),		//노
		new Module.JSColor(150,60,179,113),		//초
		new Module.JSColor(150,75,137,220)		//파
	];
	
	
	//범례에 표시할 고위험, 위험, 주의, 보통, 안전 갯수
	var stepCountArr=[0,0,0,0,0];

	// 격자 cell line color 초기화
	for(var i=0;i<180;i++){
		for(var j=0;j<160;j++){
			ANALYSIS.GRID_colorGrid2D.SetGridCellLineColor(i, j,  new Module.JSColor(0,0,0,0));
		}
	}
	
	for(var i=0;i<thisdata.length;i++){

		var risk="";
		
		//서해안 전역 조회일 경우
		if($('#analysis_select_office option:selected').val()=='all'){
			risk=thisdata[i].grade;
		//파출소별 조회일 경우
		}else{
			risk=thisdata[i].grade_police;
		}
		
		//서해안 전역 조회일 경우
		if($('#analysis_select_office option:selected').val()!='all'){
			
			var geom;
			
			//데이터에서 좌표부분, 일단 0번째 좌표만 불러오기
			geom = JSON.parse(thisdata[i].the_center_geom);
			//geom=geom.coordinates[0];
			
			var x=geom.coordinates[0];
			var y=geom.coordinates[1];
			
			//격자에 격자 번호 표시
			var poi = Module.createPoint(thisdata[i].grid_no);
			var vec3 = new Module.JSVector3D();
			
			vec3.Longitude = parseFloat(x);
			vec3.Latitude = parseFloat(y);
			vec3.Altitude = 10;
			
			poi.setPosition(vec3);
			poi.setText(thisdata[i].grid_no);
			
			// 레이어에 오브젝트 추가
			poiLayer.addObject(poi, 0);
			
		}
		
		//격자 색 설정
		if(risk =='고위험') 		{
			if(!$('#legend1_text').hasClass('legend_disabled')){
				ANALYSIS.GRID_colorGrid2D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, gridCellColor[0]);
			}else{
				ANALYSIS.GRID_colorGrid2D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, new Module.JSColor(0,0,0,0));
			}
			stepCountArr[0]++;
		}else if(risk =='위험')	{
			if(!$('#legend2_text').hasClass('legend_disabled')){
				ANALYSIS.GRID_colorGrid2D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, gridCellColor[1]);
			}else{
				ANALYSIS.GRID_colorGrid2D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, new Module.JSColor(0,0,0,0));
			}
			stepCountArr[1]++;
		}else if(risk =='주의')	{
			if(!$('#legend3_text').hasClass('legend_disabled')){
				ANALYSIS.GRID_colorGrid2D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, gridCellColor[2]);
			}else{
				ANALYSIS.GRID_colorGrid2D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, new Module.JSColor(0,0,0,0));
			}
			stepCountArr[2]++;
		}else if(risk =='보통')	{
			if(!$('#legend4_text').hasClass('legend_disabled')){
				ANALYSIS.GRID_colorGrid2D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, gridCellColor[3]);
			}else{
				ANALYSIS.GRID_colorGrid2D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, new Module.JSColor(0,0,0,0));
			}
			stepCountArr[3]++;
		}else if(risk =='안전')	{
			if(!$('#legend5_text').hasClass('legend_disabled')){
				ANALYSIS.GRID_colorGrid2D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, gridCellColor[4]);
			}else{
				ANALYSIS.GRID_colorGrid2D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, new Module.JSColor(0,0,0,0));
			}
			stepCountArr[4]++;
		}
		
		// 셀 높이 설정
		ANALYSIS.GRID_colorGrid2D.SetGridCellHeight(thisdata[i].index_y, thisdata[i].index_x, 10);
	
		//격자 외곽라인 색 설정
		ANALYSIS.GRID_colorGrid2D.SetGridCellLineColor(thisdata[i].index_y, thisdata[i].index_x,  new Module.JSColor(150,  0,0,0));
	}
	
	// 그리드 외곽 라인 색상 설정
	//colorGrid3D.SetGridLineColor(gridCellColor[0]);
	
	// 설정한 옵션으로 그리드 객체 형태 생성
	ANALYSIS.GRID_colorGrid2D.Create();
	
	//레이어에 격자 객체 추가
	layer.addObject(ANALYSIS.GRID_colorGrid2D, 0);

}

/*
 * 3D, 2D 모드 변경
 * */
function viewModeChange(){
	
	//3D모드
	if(!$("#2d_mode").hasClass("hide")){
		$("#2d_mode").addClass("hide");
		$("#3d_mode").removeClass("hide");
		trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER_2D").setVisible(false);
		trueLayerList.nameAtLayer("DF_ANA_GRID_POI_2D").setVisible(false);
		trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER").setVisible(true);
		trueLayerList.nameAtLayer("DF_ANA_GRID_POI").setVisible(true);
		
		//이전 격자 색 되돌리기
		//격자 외곽라인 색 설정
		ANALYSIS.GRID_colorGrid3D.SetGridCellLineColor(ANALYSIS.GridBeforeArr[0][0],ANALYSIS.GridBeforeArr[0][1], new Module.JSColor(150,  0,0,0));
		//격자 색 설정
		ANALYSIS.GRID_colorGrid3D.SetGridCellColor(ANALYSIS.GridBeforeArr[0][0],ANALYSIS.GridBeforeArr[0][1],  ANALYSIS.GridBeforeArr[0][2]);
		ANALYSIS.GRID_colorGrid3D.Create();
		
		
	//2D모드
	}else{
		$("#2d_mode").removeClass("hide");
		$("#3d_mode").addClass("hide");
		trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER").setVisible(false);
		trueLayerList.nameAtLayer("DF_ANA_GRID_POI").setVisible(false);
		trueLayerList.nameAtLayer("DF_ANA_GRID_LAYER_2D").setVisible(true);
		trueLayerList.nameAtLayer("DF_ANA_GRID_POI_2D").setVisible(true);
		
		//이전 격자 색 되돌리기
		//격자 외곽라인 색 설정
		ANALYSIS.GRID_colorGrid2D.SetGridCellLineColor(ANALYSIS.GridBeforeArr[0][0],ANALYSIS.GridBeforeArr[0][1], new Module.JSColor(150,  0,0,0));
		//격자 색 설정
		ANALYSIS.GRID_colorGrid2D.SetGridCellColor(ANALYSIS.GridBeforeArr[0][0],ANALYSIS.GridBeforeArr[0][1],  ANALYSIS.GridBeforeArr[0][2]);
		ANALYSIS.GRID_colorGrid2D.Create();
	}
	
	//모드 변경시 클릭했던 격자 정보 초기화
	ANALYSIS.GridBeforeArr=[];
	
}

/*
 * 클릭한 위치 격자 정보 가져오기
 * */
function getDfAnaGridDataOfLocation(lon,lat){
	
	
	var selectMonth=$("#rangeSlider").val().split('월')[0];
	/*if($("#rangeSlider").val().split('월')[0].length==1){
		selectMonth='0'+selectMonth;
	}*/
	
	var params= {
		"search_month": selectMonth,
		"lon" : lon,
		"lat" : lat
	};	

	console.log(params);

	//위치 클릭한 연안사고 다발구역 정보 가져오기
	temp_cf_ajax( "/use/gisAnal/getDfAnaGridDataOfLocation.do", params, _getDfAnaGridDataOfLocation);
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 클릭한 위치 격자 정보 표출하기
 * */
function _getDfAnaGridDataOfLocation(_data){
	console.log(_data);
	var thisdata=_data.data.data;
	if(thisdata.length==0){
		mcxDialog.alert('다시 선택해주세요');
	}else{
		showAnalysisResultPop(thisdata[0]);
		
		// 값에 따른 그리드 셀 색상 리스트
		var gridCellColor = [
			new Module.JSColor(150,219,68,85),		//빨
			new Module.JSColor(150,246,187,67),		//주
			new Module.JSColor(150,255,255,0),		//노
			new Module.JSColor(150,60,179,113),		//초
			new Module.JSColor(150,75,137,220)		//파
		];
		
		//3D모드
		if($("#2d_mode").hasClass("hide")){
			//격자 외곽라인 색 설정
			ANALYSIS.GRID_colorGrid3D.SetGridCellLineColor(thisdata[0].index_y, thisdata[0].index_x,  new Module.JSColor(250,219,68,85));
			//격자 색 설정
			ANALYSIS.GRID_colorGrid3D.SetGridCellColor(thisdata[0].index_y, thisdata[0].index_x, new Module.JSColor(250,219,68,85));
			ANALYSIS.GRID_colorGrid3D.Create();
			
		//2D모드
		}else{
			//격자 외곽라인 색 설정
			ANALYSIS.GRID_colorGrid2D.SetGridCellLineColor(thisdata[0].index_y, thisdata[0].index_x,  new Module.JSColor(250,219,68,85));
			//격자 색 설정
			ANALYSIS.GRID_colorGrid2D.SetGridCellColor(thisdata[0].index_y, thisdata[0].index_x, new Module.JSColor(250,219,68,85));
			ANALYSIS.GRID_colorGrid2D.Create();
		}

		
		//전에 선택된 격자 정보 저장
		if(ANALYSIS.GridBeforeArr.length==0){
	
			
		}else{
			//3D모드
			if($("#2d_mode").hasClass("hide")){
				//이전 격자 색 되돌리기
				//격자 외곽라인 색 설정
				ANALYSIS.GRID_colorGrid3D.SetGridCellLineColor(ANALYSIS.GridBeforeArr[0][0],ANALYSIS.GridBeforeArr[0][1], new Module.JSColor(150,  0,0,0));
				//격자 색 설정
				ANALYSIS.GRID_colorGrid3D.SetGridCellColor(ANALYSIS.GridBeforeArr[0][0],ANALYSIS.GridBeforeArr[0][1],  ANALYSIS.GridBeforeArr[0][2]);
				ANALYSIS.GRID_colorGrid3D.Create();
				
			//2D모드
			}else{
				//이전 격자 색 되돌리기
				//격자 외곽라인 색 설정
				ANALYSIS.GRID_colorGrid2D.SetGridCellLineColor(ANALYSIS.GridBeforeArr[0][0],ANALYSIS.GridBeforeArr[0][1], new Module.JSColor(150,  0,0,0));
				//격자 색 설정
				ANALYSIS.GRID_colorGrid2D.SetGridCellColor(ANALYSIS.GridBeforeArr[0][0],ANALYSIS.GridBeforeArr[0][1],  ANALYSIS.GridBeforeArr[0][2]);
				ANALYSIS.GRID_colorGrid2D.Create();
			}
			
			ANALYSIS.GridBeforeArr=[];

		}
		
		var risk="";
		
		//서해안 전역 조회일 경우
		if($('#analysis_select_office option:selected').val()=='all'){
			risk=thisdata[0].grade;
			//파출소별 조회일 경우
		}else{
			risk=thisdata[0].grade_police;
		}
		
		if(risk=='고위험'){
			if(!$('#legend1_text').hasClass('legend_disabled')){
				ANALYSIS.GridBeforeArr.push([thisdata[0].index_y, thisdata[0].index_x, gridCellColor[0]]);
			}else{
				ANALYSIS.GridBeforeArr.push([thisdata[0].index_y, thisdata[0].index_x, new Module.JSColor(0,0,0,0)]);
			}
		}else if(risk=='위험'){
			if(!$('#legend2_text').hasClass('legend_disabled')){
				ANALYSIS.GridBeforeArr.push([thisdata[0].index_y, thisdata[0].index_x, gridCellColor[1]]);
			}else{
				ANALYSIS.GridBeforeArr.push([thisdata[0].index_y, thisdata[0].index_x, new Module.JSColor(0,0,0,0)]);
			}
		}else if(risk=='주의'){
			if(!$('#legend3_text').hasClass('legend_disabled')){
				ANALYSIS.GridBeforeArr.push([thisdata[0].index_y, thisdata[0].index_x, gridCellColor[2]]);
			}else{
				ANALYSIS.GridBeforeArr.push([thisdata[0].index_y, thisdata[0].index_x, new Module.JSColor(0,0,0,0)]);
			}
		}else if(risk=='보통'){
			if(!$('#legend4_text').hasClass('legend_disabled')){
				ANALYSIS.GridBeforeArr.push([thisdata[0].index_y, thisdata[0].index_x, gridCellColor[3]]);
			}else{
				ANALYSIS.GridBeforeArr.push([thisdata[0].index_y, thisdata[0].index_x, new Module.JSColor(0,0,0,0)]);
			}
		}else if(risk=='안전'){
			if(!$('#legend5_text').hasClass('legend_disabled')){
				ANALYSIS.GridBeforeArr.push([thisdata[0].index_y, thisdata[0].index_x, gridCellColor[4]]);
			}else{
				ANALYSIS.GridBeforeArr.push([thisdata[0].index_y, thisdata[0].index_x, new Module.JSColor(0,0,0,0)]);
			}
		}
		
	}
}

/*
 * 연안사고 POI 표출하기
 * */
function _getPoliceAccidentDataPoi(_data){
	var thisdata=_data.data.data;
	
	//사고 POI 레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("ACCIDENT_MARKER", 5, 34000.0, 1.0);
	
	for(var i=0;i<thisdata.length;i++){
		
		var paramArr=[
			thisdata[i].lon,
			thisdata[i].lat,
			10,
			thisdata[i].acdntty_etc,
			thisdata[i].safeacdnt_sn];
		
		//경찰서  poi 그리기
		drawMark(paramArr, "/static_resources/gis/img/icon/accident_icon.png","ACCIDENT_MARKER","anaylsis_accident_");
		
	}
	
	//객체 선택모드로 변경
	Module.XDSetMouseState(6);
	
}

/*
 * 연안사고 정보 표출하기
 * */
function _getSelectedPoliceAccidentDataPoi(_data){
	
	console.log(_data);
	
	var thisdata=_data.data.data;
	
	//카메라 위치 이동(lon,lat,alt,tilt,direct)
	setViewCamera(parseFloat(thisdata[0].lon)-0.0014315, parseFloat(thisdata[0].lat)-0.00312589,444,52,0);
	
	$('.analysis_accident_pop').removeClass('hide');
	
	$('.analysis_accident_pop_title').text(thisdata[0].occrrnc_de+" "+thisdata[0].occrrnc_time+" 사고정보");
	
	var btnHtmlStr="<button class='close_btn' style='margin-left: 5px' onclick='closePop()'>닫기</button>";

	var htmlStr= "<dd style='width:100%'>"+textLengthOverCut(thisdata[0].acdnt_sumry,1000)+"</dd>";
	$('.analysis_accident_pop_btn').empty();
	$('.analysis_accident_pop_btn').append(btnHtmlStr);
	
	$('.analysis_accident_pop_dl').empty();
	$('.analysis_accident_pop_dl').append(htmlStr);
	
	temp_cf_loadingbarHide();
}

/*
 * 조회결과 팝업 출력 - 연안사고 다발구역 
 * */
function showAnalysisResultPop(_data){

	var selectMonth=$("#rangeSlider").val().split('월')[0];
	
	var params={
		"search_month":selectMonth,
		grid_num:_data.grid_no
	}
	
	//격자에 포함된 사고수 가져오기
	temp_cf_ajax( "/use/gisAnal/getDfAnaGridAccidentDataOfGrid.do", params, _getDfAnaGridAccidentDataOfGrid);
	
	$('.analysis_result_pop').removeClass('hide');
	
	$('.analysis_result_pop_title').text(_data.grid_no);
	
	var color=[0,0,0];
	
	var risk="";
	
	//서해안 전역 조회일 경우
	if($('#analysis_select_office option:selected').val()=='all'){
		risk=_data.grade;
	//파출소별 조회일 경우
	}else{
		risk=_data.grade_police;
	}
	
	//격자 색 설정값 초기화
	var color=[0,0,0];
	//격자 색 설정
	if(risk=="고위험"){		//red
		color=[219,68,85];
	}else if(risk=="위험"){	//orange
		color=[246,187,67];
	}else if(risk=="주의"){	//yellow
		color=[255,255,0];
	}else if(risk=="보통"){	//green
		color=[60,179,113];	
	}else if(risk=="안전"){	//blue
		color=[75,137,220];		
	}
	
	
	var btnHtmlStr= "<button class='location' title='위치이동' ' onclick='moveGrid("+_data.the_geom+","+_data.index_y+","+_data.index_x+","+color[0]+","+color[1]+","+color[2]+");'>위치</button>";
		btnHtmlStr+="<button class='close_btn' style='margin-left: 5px' onclick='closePop()'>닫기</button>";
	var htmlStr= "<dt>관할 경찰청</dt><dd>"+_data.agency_nm+"</dd>";
		htmlStr+="<dt>관할 경찰서</dt><dd>"+_data.coastguard_nm+"</dd>";
		if(_data.police_nm==null){
			htmlStr+="<dt>관할 파출소</dt><dd>-</dd>";
		}else{
			htmlStr+="<dt>관할 파출소</dt><dd>"+_data.police_nm+"</dd>";
		}

		htmlStr+="<dt>예측값</dt><dd>"+Number.parseFloat(_data.result).toFixed(2)+"</dd>";
		
		if(risk=="고위험"){
			htmlStr+="<dt>위험도</dt><dd><span class='color' style='background: red;'></span>"+risk+"</dd>";			
		}else if(risk=="위험"){
			htmlStr+="<dt>위험도</dt><dd><span class='color' style='background: orange;'></span>"+risk+"</dd>";		
		}else if(risk=="주의"){
			htmlStr+="<dt>위험도</dt><dd><span class='color' style='background: yellow;'></span>"+risk+"</dd>";		
		}else if(risk=="보통"){
			htmlStr+="<dt>위험도</dt><dd><span class='color' style='background: green;'></span>"+risk+"</dd>";		
		}else if(risk=="안전"){
			htmlStr+="<dt>위험도</dt><dd><span class='color' style='background: blue;'></span>"+risk+"</dd>";		
		}
		
		htmlStr+="<dt>수상인명구조대</dt><dd>"+_data.malire+"개</dd>";
		htmlStr+="<dt>인명구조장비함</dt><dd>"+_data.rescue+"개</dd>";
		
		
	$('.analysis_result_pop_btn').empty();
	$('.analysis_result_pop_btn').append(btnHtmlStr);
	
	$('.analysis_result_pop_dl').empty();
	$('.analysis_result_pop_dl').append(htmlStr);
	
}

/*
 * 격자에 포함된 사고수 표출하기
 * */
function _getDfAnaGridAccidentDataOfGrid(_data){
	
	var thisdata=_data.data.data;
	var htmlStr= "<dt>연안사고 건수</dt><dd>"+thisdata[0].count+"건</dd>";
	$('.analysis_result_pop_dl').append(htmlStr);
	
	temp_cf_loadingbarHide();
}

/*
 * 격자 위치이동
 * */
function moveGrid(_coordinates,_index_y,_index_x,_color1,_color2,_color3){
	
	var geom=_coordinates.coordinates[0];

	//중심좌표 설정
	middleCoordinate_x=((parseFloat(geom[0][0][0])+parseFloat(geom[0][1][0]))/2);
	middleCoordinate_y=((parseFloat(geom[0][0][1])+parseFloat(geom[0][2][1]))/2);
	
	//3D모드
	if($("#2d_mode").hasClass("hide")){
		//카메라 위치 이동(lon,lat,alt,tilt,direct)
		setViewCamera(parseFloat(middleCoordinate_x)-0.1, parseFloat(middleCoordinate_y)-0.5,51000,33,0);
		
	//2D모드
	}else{
		//카메라 위치 이동(lon,lat,alt,tilt,direct)
		setViewCamera(parseFloat(middleCoordinate_x)-0.05, parseFloat(middleCoordinate_y)+0.032,35000,90,0);
		
	}
	
	
	//이전에 선택된 격자 정보 저장
	if(ANALYSIS.GridBeforeArr.length==0){
		ANALYSIS.GridBeforeArr.push([_index_y,_index_x, new Module.JSColor(150,_color1,_color2,_color3)]);

		//3D모드
		if($("#2d_mode").hasClass("hide")){
			//격자 외곽라인 색 설정
			ANALYSIS.GRID_colorGrid3D.SetGridCellLineColor(_index_y, _index_x,  new Module.JSColor(250,219,68,85));
			//격자 색 설정
			ANALYSIS.GRID_colorGrid3D.SetGridCellColor(_index_y, _index_x, new Module.JSColor(250,219,68,85));
			ANALYSIS.GRID_colorGrid3D.Create();
			
			
		//2D모드
		}else{
			
			//격자 외곽라인 색 설정
			ANALYSIS.GRID_colorGrid2D.SetGridCellLineColor(_index_y, _index_x,  new Module.JSColor(250,219,68,85));
			//격자 색 설정
			ANALYSIS.GRID_colorGrid2D.SetGridCellColor(_index_y, _index_x, new Module.JSColor(250,219,68,85));
			ANALYSIS.GRID_colorGrid2D.Create();
			
		}
		
	}else{
		
		//3D모드
		if($("#2d_mode").hasClass("hide")){
			
			//이전 격자 색 되돌리기
			//격자 외곽라인 색 설정
			ANALYSIS.GRID_colorGrid3D.SetGridCellLineColor(ANALYSIS.GridBeforeArr[0][0],ANALYSIS.GridBeforeArr[0][1], new Module.JSColor(150,  0,0,0));
			//격자 색 설정
			ANALYSIS.GRID_colorGrid3D.SetGridCellColor(ANALYSIS.GridBeforeArr[0][0],ANALYSIS.GridBeforeArr[0][1],  ANALYSIS.GridBeforeArr[0][2]);
			ANALYSIS.GRID_colorGrid3D.Create();
			//격자 외곽라인 색 설정
			ANALYSIS.GRID_colorGrid3D.SetGridCellLineColor(_index_y, _index_x,  new Module.JSColor(250,219,68,85));
			//격자 색 설정
			ANALYSIS.GRID_colorGrid3D.SetGridCellColor(_index_y, _index_x, new Module.JSColor(250,219,68,85));
			ANALYSIS.GRID_colorGrid3D.Create();
			
		//2D모드
		}else{
			
			//이전 격자 색 되돌리기
			//격자 외곽라인 색 설정
			ANALYSIS.GRID_colorGrid2D.SetGridCellLineColor(ANALYSIS.GridBeforeArr[0][0],ANALYSIS.GridBeforeArr[0][1], new Module.JSColor(150,  0,0,0));
			//격자 색 설정
			ANALYSIS.GRID_colorGrid2D.SetGridCellColor(ANALYSIS.GridBeforeArr[0][0],ANALYSIS.GridBeforeArr[0][1],  ANALYSIS.GridBeforeArr[0][2]);
			ANALYSIS.GRID_colorGrid2D.Create();
			//격자 외곽라인 색 설정
			ANALYSIS.GRID_colorGrid2D.SetGridCellLineColor(_index_y, _index_x,  new Module.JSColor(250,219,68,85));
			//격자 색 설정
			ANALYSIS.GRID_colorGrid2D.SetGridCellColor(_index_y, _index_x, new Module.JSColor(250,219,68,85));
			ANALYSIS.GRID_colorGrid2D.Create();
		}
		ANALYSIS.GridBeforeArr=[];
		ANALYSIS.GridBeforeArr.push([_index_y,_index_x,new Module.JSColor(150,_color1,_color2,_color3)]);	
	}
}

