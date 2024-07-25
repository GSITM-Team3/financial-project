//검색---------------------------------------------------------------------------------------------------------------------------------------
//POI 오브젝트 삭제
function deletePoiLayer(){
	trueLayerList.nameAtLayer("MAP_POI").removeAll();
}
function search_vworld(current) {
	if(PoiLayer != null) deletePoiLayer();
	var Vworld = { 
			Api_key: '42F6D36E-1A78-34B7-959F-37611794397B',
			Url: 'http://xdworld.vworld.kr:8080',
			Port : 8080,
			Wms_Url : 'http://api.vworld.kr',
			Wms_key : 'A632FC0F-1DE6-3FB1-AD2B-64B09AA41FB6',
			Wms_workspace : '/req/wms?',
			Wfs_workspace : '/req/wfs?',
			Wms_domain : 'localhost',
			Wms_port : 80
		};
	
	var resultNotZero = true;
	var totalRecordCount=0;	//건에 대한 총갯수 
	var sumTotalRecordCount = 0;	//전체 건수 총합
	var arrTotalRecordCount = new Array();
    
	var q = $('#search_word').val();
    var output = 'json';	//xml, json
    
    var pageIndex = current;
    var cnt = 0;
    var initalLonlat = 0;
    var lonlat = 0;
    var returnCntState = true;

	var url = "http://map.vworld.kr/search.do";
	var params = "apiKey="+Vworld.Api_key+"&q="+encodeURIComponent(q)+"&category=Poi&output="+output+"&pageUnit="+10+"&pageIndex="+pageIndex;

	var realUrl = "/static_resources/gis/Engine/proxy.jsp?url="+ encodeURIComponent(url + "q?" + params);
		
	var jsonpUrl= url+"?"+params;

	$.ajax({
		type: 'post',
		url: jsonpUrl,
		ansync : true,
		dataType: "jsonp",
		data: '',
		jsonp:"callback",
		success: function(data){
			console.log(data);
			if(q=="GS-ITM부트캠프"){data ={
				    "paginationInfo": {
				        "totalRecordCount": "28",
				        "totalPageCount": "3",
				        "lastPageNo": "3",
				        "firstPageNo": "1",
				        "currentPageNo": "1"
				    },
				    "category": "Poi",
				    "LIST": [
				    	{
				    	    "codeName": " GS-ITM부트캠프",
				    	    "xpos": "126 ",
				    	    "WEIGHT": "65",
				    	    "njuso": "인천광역시 연수구  ",
				    	    "PNU": "",
				    	    "ypos": "37.3934393649673",
				    	    "nameDp": "",
				    	    "nameFull": "GS-ITM부트캠프",
				    	    "ZIP_CL": "21995",
				    	    "RD_NM": "",
				    	    "juso": "인천광역시 연수구 송도동 3-8",
				    	    "nId": "AA0003798760",
				    	    "NCODE": "01020207"
				    	},
				    	
				    ],
				    "Poi": "28"
				}}
			
			$('.s_location').empty();
			var obj = data;
			if(obj.Poi == 0) {	//검색결과 없는 경우 로직 패스
    			resultNotZero = false;
    			$('.s_location').append("검색결과가 없습니다.");
    		} else {	//검색결과 있는 경우 로직 수행
    			
    			totalRecordCount = obj.Poi;
	    		$(obj.LIST).each(function(key,val) {
	    			var juso  = val.juso;	//지번
	    			var nameFull = val.nameFull;	
	    			var njuso = val.njuso;	//새주소
	    			var codeName = val.codeName;//카테고리
	    			var xpos = val.xpos;	//위도(x)
	    			var ypos = val.ypos;	//경도(y)
	    			
	    			if(cnt == 0) {
	    				returnCntState = false;
	    				initalLonlat = lonlat;	//첫번째 검색결과값 마지막에 이동하기 위해 저장 : Poi
	    			} 
    			
	    			var content='<li class="title">';
	    			content+='<ul onClick="searchAddrMove(\'' + xpos+ '\', \'' + ypos+ '\');">';
	    			content+='<li>'+nameFull+'</li>';
	    			
	    			if(njuso != '') {
						content += '<li>'+njuso+'</li>';
					}else{
						content += '<li>도로명주소정보없음</li>';
					}
	    			if(juso != '') {
						content += '<li class="addr">'+juso+'</li>';
					}else{
						content += '<li class="addr">지번주소정보없음</li>';
					}
	    			content += '</ul></li>';
	    			
	    			var position = new Module.JSVector3D(parseFloat(xpos), parseFloat(ypos), Module.getMap().getTerrHeight(parseFloat(xpos),parseFloat(ypos))+5);
					createPoint(position,'searchIcon'+key,'');
    				
	    			$('.s_location').append(content);
	    			cnt++;
	    		});
    		}
			makePaging(pageIndex, totalRecordCount, "search_vworld", 'search_paging', 10);
		},
		error: function(request, status, error) {
			console.log('검색에러');
		},
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