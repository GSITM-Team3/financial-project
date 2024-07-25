//검색 감리대응을 위해 해상지명 검색으로 임시로 구현---------------------------------------------------------------------------------------------------------------------------------------
//POI 오브젝트 삭제
function deletePoiLayer(){
	trueLayerList.nameAtLayer("MAP_POI").removeAll();
}

//해상지명 검색정보 가져오기
function getSearchTemp(current){
	
	if(PoiLayer != null) deletePoiLayer();
	
	var totalRecordCount=0;	//건에 대한 총갯수 
	
	var pageIndex = current;
    var cnt = 0;

	var etp =  pageIndex*10;
	var stp =  etp - (10-1) ;
	
    var params = {
		search_keyword : $('#search_word').val(),
		n_st : stp,
		n_ed : etp
    };	
    
    temp_cf_ajax( "/use/gisAnal/getSearchTempPaging.do", params , function(_data){

    	$('.s_location').empty();
		if(_data.data.length == 0) {	//검색결과 없는 경우 로직 패스
			$('.s_location').append("검색결과가 없습니다.");
		} else {	//검색결과 있는 경우 로직 수행
			
			totalRecordCount = _data.data.length;
    		$(_data.data).each(function(key,val) {
    			
    			var juso  = val.st_t_tb_15;	//주소
    			var njuso  = '';	//새주소
    			var nameFull = val.st_t_tb__5;	
    			var geom =JSON.parse(val.the_geom);
				var xpos = geom.coordinates[0];//위도(x)
				var ypos = geom.coordinates[1];//경도(y)
				
    			var content='<li class="title">';
    			content+='<ul onClick="searchAddrMove(\'' + xpos+ '\', \'' + ypos+ '\');">';
    			content+='<li>'+nameFull+'</li>';
    			
    			if(juso != '') {
					content += '<li>'+juso+'</li>';
				}else{
					content += '<li>주소정보없음</li>';
				}
    			content += '</ul></li>';
    			
    			var position = new Module.JSVector3D(parseFloat(xpos), parseFloat(ypos), Module.getMap().getTerrHeight(parseFloat(xpos),parseFloat(ypos))+5);
				createPoint(position,'searchIcon'+key,'');
				
    			$('.s_location').append(content);
    			cnt++;
    		});
		}
		makePaging(pageIndex, totalRecordCount, "getSearchTemp", 'search_paging', 10);
		temp_cf_loadingbarHide();
	});
    
}


//poi초기화
function initSearchPoi(){
	
	PoiLayer = trueLayerList.createLayer("MAP_POI", Module.ELT_3DPOINT);
	PoiLayer.setMaxDistance(200000.0);
	
	Symbol = Module.getSymbol();
	
	// POI Icon 생성 - 검색탭에서 사용되는 아이콘
	var searchImageURLList = [
		"/static_resources/gis/img/num/site_1.png",
		"/static_resources/gis/img/num/site_2.png",
		"/static_resources/gis/img/num/site_3.png",
		"/static_resources/gis/img/num/site_4.png",
		"/static_resources/gis/img/num/site_5.png",
		"/static_resources/gis/img/num/site_6.png",
		"/static_resources/gis/img/num/site_7.png",
		"/static_resources/gis/img/num/site_8.png",
		"/static_resources/gis/img/num/site_9.png",
		"/static_resources/gis/img/num/site_10.png"];
	for (var i=0, len=searchImageURLList.length; i<len; i+=1) {
		createIcon(searchImageURLList[i], "searchIcon"+i);
	}
	Module.XDRenderData();
}

function createPoint(_vPosition, _iconName, text) {
	
	trueLayerList.nameAtLayer("MAP_POI").setVisible(true);
	
	// Symbol에서 iconName으로 Icon 객체 반환
	var icon = Symbol.getIcon(_iconName);
	
	if (icon == null || PoiLayer == null) {
		return;
	}
	
	// JSPoint 객체 생성
	var poi = Module.createPoint(_iconName);
	poi.setPosition(_vPosition);	// 위치 설정
	poi.setIcon(icon);	// 아이콘 설정
	poi.setText(text);	// 아이콘 텍스트
	
	// poi레이어에 오브젝트 추가
	PoiLayer.addObject(poi, 0);
	
	
}
function createIcon(_url, _iconName){
	
	var img = new Image();
	
	// POI 이미지 로드
	img.onload = function(){
		// canvas를 통해 이미지 데이터 생성
		var canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		
		// Symbol에 새 아이콘 추가
		var bResult = Symbol.insertIcon(_iconName, imageData, canvas.width, canvas.height);
	}
	img.src = _url;
	
}

function numberCommaFormat(num) {
	var str = String(num);
    var pattern = /(-?[0-9]+)([0-9]{3})/;
    while(pattern.test(str)) {
    	str = str.replace(pattern,"$1,$2");
    }
    return str;
}
/**
 * 명칭 검색 카메라 이동 함수 
 * @param lon 경도
 * @param laT 위도
 * @param alt 고도
 * @param tilt 틸트각 
 */
function searchAddrMove(lon, lat)	{ 
	var camera = Module.getViewCamera();
	//camera.moveLonLatAltOval (parseFloat(lon), parseFloat(lat), parseFloat(1000), 10);
	camera.setTilt(89);
	camera.moveLonLatAltOval(parseFloat(lon), parseFloat(lat), parseFloat(500), 5);
}