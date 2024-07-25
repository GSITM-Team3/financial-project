$( document ).ready(function() {

	//관할구역 레이어
	$(".layer_police_area").click(function(){

		if($(this).hasClass('active')){
			$(this).removeClass('active');
			// 레이어 있으면 삭제
			if(falseLayerList.nameAtLayer("kcg:"+this.id.split('-')[1]) != null){		
				falseLayerList.delLayerAtName("kcg:"+this.id.split('-')[1]);
			}
		}else{
			$(this).addClass('active');
			createWMSLayer("kcg:"+this.id.split('-')[1]);
		}
	});
	
	//격자보기 버튼 클릭시
	$('#layer_grid_dt').click(function(){
		var params={};
		// 레이어 리스트 초기화
		trueLayerList = new Module.JSLayerList(true);
		
		if($(this).hasClass('active')){

			temp_cf_ajax( "/use/gisAnal/getGrid.do", params, _getGrid);
			
		}else{
			// 레이어 있으면 삭제
			if(trueLayerList.nameAtLayer("GRID_LAYER") != null){		
				trueLayerList.nameAtLayer("GRID_LAYER").removeAll();
			}
			//$('#layer_grid_dt').removeClass('active');
			
		}
	});
	
	//map_tools 레이어 자식 버튼
	 $("#layer_sub li button").click(function(){
		 var thisClass=$(this).attr("class");
		 if($(this).hasClass("active")){
			$(this).removeClass("active");
			thisClass=$(this).attr("class");
			basicLayerOnOff(thisClass,false);
		}else{
			$(this).addClass("active");
			basicLayerOnOff(thisClass,true);
		}
	  });
});

//측정 관련 객체 초기화 함수
function setMeasurement(symbol, layer, poi, index) {
	this.symbol = symbol;
	this.layer = layer;
	this.poi = poi;
	this.index = index;

}

//측정 객체 초기화
var DistanceObject = new setMeasurement(null, null, null, 0);
var AreaObject = new setMeasurement(null, null, null, 0);
var AltitudeObject = new setMeasurement(null, null, null, 0);

//지도측정기능 초기화 - 툴바 초기화 
function clearMeasurement() {
	Module.XDSetMouseState(6);
	$('#tool_sub li button').removeClass('active');
	clearMeasurementDistance();
	clearMeasurementArea();
	clearMeasurementAltitude();
}

/* 지도 화면 내려받기 */

/* 지도 화면 내려받기 */
function downloadMapImage() {
	
	var mapCanvas = Module.canvas;
	
	if (mapCanvas == null) {
		return;
	}
	
	// 스크린 샷 만들 canvas
	var captureCanvas = document.createElement('canvas'),
		ctx = captureCanvas.getContext('2d');
	
	// 크기는 지도 canvas와 동일하게 설정
	captureCanvas.width = mapCanvas.width;
	captureCanvas.height = mapCanvas.height;
	
	// 지도 canvas 이미지 로드
	var img = new Image();
	img.onload = function() {
		
		// 지도 캔버스 화면을 복사
        ctx.drawImage(this, 0, 0, mapCanvas.width, mapCanvas.height);

				
			// 워터마크 이미지 그리기
			ctx.drawImage(this, canvas.width-this.width, canvas.height-this.height);
			
			if (captureCanvas.msToBlob) {
				
				// IE 이미지 처리 및 다운로드
				var blob = captureCanvas.msToBlob();
				return window.navigator.msSaveBlob(blob, 'ForestScreenShot.png');
							
			} else {

				// FireFox, Chrome 이미지 처리 및 다운로드
				captureCanvas.toBlob(function(e) {
					
					var data = URL.createObjectURL(e),
						eLink = document.createElement("a")
						;
					
					eLink.setAttribute("href", data);
					eLink.setAttribute("download", "KCGMAPScreenShot.png");
					document.body.appendChild(eLink);
					eLink.click();
					document.body.removeChild(eLink);

					return true;
				
				}, "image/png", 1);
			}
	};
	img.src = mapCanvas.toDataURL("image/jpeg");	
}
/**
 * 	거리측정 함수
 */
function measureDistance(flag) {
	//거리, 면적, 터파기측정 결과 초기화
	//	clearMeasurementDistance();
	//	clearMeasurementArea();
	//	clearMeasurementTransparency();
	if (flag) {
		DistanceObject.layer = trueLayerList.createLayer("MEASURE_POI",
				Module.ELT_3DPOINT);
		DistanceObject.symbol = Module.getSymbol();
		DistanceObject.layer.setMaxDistance(1000000.0);

		if (trueLayerList.nameAtLayer("searchPoint") != null) { //검색 위치 핀 삭제
			trueLayerList.nameAtLayer("searchPoint").removeAll();
		}

		Module.XDSetMouseState(Module.MML_ANALYS_DISTANCE);
		Module.canvas.addEventListener("Fire_EventAddDistancePoint",
				addDistancePoint);
	} else {
		Module.canvas.removeEventListener("Fire_EventAddDistancePoint",
				addDistancePoint);
		//toolbar(1); //거리재기 종료
		Module.XDSetMouseState(Module.MML_SELECT_POINT);
	}

}

var addDistancePoint = function(e) {
	var partDistance = e.dDistance, totalDistance = e.dTotalDistance;
	if (partDistance == 0 && totalDistance == 0) {
		createMeasurementPOI(new Module.JSVector3D(e.dLon, e.dLat, e.dAlt),
				"rgba(13, 82, 161, 0.8)", totalDistance, true);
	} else {

		// 이전 입력지점 ~ 최종 지점 간 거리
		if (e.dDistance > 0.01) {
			// 첫 입력 지점 ~ 최종 지점 간 거리
			createMeasurementPOI(new Module.JSVector3D(e.dLon, e.dLat, e.dAlt),
					"rgba(13, 82, 161, 0.8)", e.dTotalDistance, true);
			createMeasurementPOI(new Module.JSVector3D(e.dMidLon, e.dMidLat,
					e.dMidAlt), "rgba(255, 255, 255, 0.8)", e.dDistance, false);
		} else {
			areaMeasurementFlag = 0;
			// 첫 입력 지점 ~ 최종 지점 간 거리
			createMeasurementPOI(new Module.JSVector3D(e.dLon, e.dLat, e.dAlt),
					"rgba(13, 82, 161, 0.8)", e.dTotalDistance, true);
		}
	}
};
/* 분석 내용 출력 POI 생성 */
function createMeasurementPOI(_position, _color, _value, _balloonType) {

	// POI 아이콘 이미지를 그릴 Canvas 생성
	var drawCanvas = document.createElement('canvas');
	drawCanvas.width = 100;
	drawCanvas.height = 100;

	// 아이콘 이미지 데이터 반환
	var imageData = drawMeasurementIcon(drawCanvas, _color, _value,
			_balloonType), nIndex = DistanceObject.index;

	// 심볼에 아이콘 이미지 등록
	if (DistanceObject.symbol.insertIcon("MeasurementIcon" + nIndex, imageData,
			drawCanvas.width, drawCanvas.height)) {

		// 등록한 아이콘 객체 반환
		var icon = DistanceObject.symbol.getIcon("MeasurementIcon" + nIndex);

		// JSPoint 객체 생성
		var count = DistanceObject.layer.getObjectCount(), poi = Module
				.createPoint("MeasurementPOI" + nIndex);

		poi.setPosition(_position); // 위치 설정
		poi.setIcon(icon); // 아이콘 설정

		// 레이어에 오브젝트 추가
		DistanceObject.layer.addObject(poi, 0);

		// 인덱스 값 상승
		DistanceObject.index++;
	}
}

/* 아이콘 이미지 데이터 반환 */
function drawMeasurementIcon(_canvas, _color, _value, _balloonType) {

	// 컨텍스트 반환 및 배경 초기화
	var ctx = _canvas.getContext('2d'), width = _canvas.width, height = _canvas.height;
	ctx.clearRect(0, 0, width, height);

	// 배경 Draw Path 설정 후 텍스트 그리기
	if (_balloonType) {
		drawMeasurementBalloon(ctx, height * 0.5, width, height, 5,
				height * 0.25, _color);
		setMeasurementText(ctx, width * 0.5, height * 0.2, _value);
	} else {
		drawMeasurementRoundRect(ctx, 0, height * 0.3, width, height * 0.25, 5,
				_color);
		setMeasurementText(ctx, width * 0.5, height * 0.5, _value);
	}

	return ctx.getImageData(0, 0, _canvas.width, _canvas.height).data;
}

/* 말풍선 배경 그리기 */
function drawMeasurementBalloon(ctx, marginBottom, width, height, barWidth,
		barHeight, color) {

	var wCenter = width * 0.5, hCenter = height * 0.5;

	// 말풍선 형태의 Draw Path 설정
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, height - barHeight - marginBottom);
	ctx.lineTo(wCenter - barWidth, height - barHeight - marginBottom);
	ctx.lineTo(wCenter, height - marginBottom);
	ctx.lineTo(wCenter + barWidth, height - barHeight - marginBottom);
	ctx.lineTo(width, height - barHeight - marginBottom);
	ctx.lineTo(width, 0);
	ctx.closePath();

	// 말풍선 그리기
	ctx.fillStyle = color;
	ctx.fill();
}

/* 둥근 사각형 배경 그리기 */
function drawMeasurementRoundRect(ctx, x, y, width, height, radius, color) {

	if (width < 2 * radius)
		radius = width * 0.5;
	if (height < 2 * radius)
		radius = height * 0.5;

	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + width, y, x + width, y + height, radius);
	ctx.arcTo(x + width, y + height, x, y + height, radius);
	ctx.arcTo(x, y + height, x, y, radius);
	ctx.arcTo(x, y, x + width, y, radius);
	ctx.closePath();

	// 사각형 그리기
	ctx.fillStyle = color;
	ctx.fill();

	return ctx;
}

/* 텍스트 그리기 */
function setMeasurementText(_ctx, _posX, _posY, _value) {

	var strText = "";

	// 텍스트 문자열 설정
	if (typeof _value == 'number') {
		strText = setMeasurementKilloUnit(_value, 0.001, 0);
	} else {
		strText = _value;
	}

	// 텍스트 스타일 설정
	_ctx.font = "bold 16px sans-serif";
	_ctx.textAlign = "center";
	_ctx.fillStyle = "rgb(0, 0, 0)";

	// 텍스트 그리기
	_ctx.fillText(strText, _posX, _posY);
}

/* 거리 분석 내용 초기화 */
function clearMeasurementDistance() {

	// 실행 중인 분석 내용 초기화
	Module.XDClearDistanceMeasurement();

	var layer = trueLayerList.nameAtLayer("MEASURE_POI"), symbol = DistanceObject.symbol;
	if (layer == null) {
		return;
	}

	// 등록된 아이콘 리스트 삭제
	var i, len, icon, poi;
	for (i = 0, len = layer.getObjectCount(); i < len; i++) {

		poi = trueLayerList.nameAtLayer("MEASURE_POI").keyAtObject(
				"MeasurementPOI" + i);
		icon = poi.getIcon();

		// 아이콘을 참조 중인 POI 삭제
		layer.removeAtKey("MeasurementPOI" + i);

		// 아이콘을 심볼에서 삭제
		symbol.deleteIcon(icon.getId());
	}

	// POI 오브젝트 삭제
	trueLayerList.nameAtLayer("MEASURE_POI").removeAll();

	// POI, Icon 키 지정 인덱스 초기화
	DistanceObject.index = 0;
}


var areaMeasurementFlag=0;
var totalAreaValue = new Array();

/**
 * 	면적측정 함수
 */
function measureArea(flag){
	if(flag){
		Module.XDSetMouseState(Module.MML_ANALYS_AREA);
		AreaObject.symbol = Module.getSymbol();
		AreaObject.layer = trueLayerList.createLayer("MEASURE_Area", Module.ELT_3DPOINT);
		AreaObject.layer.setMaxDistance(1000000.0);
		// 면적 측정 이벤트 설정
		Module.canvas.addEventListener("Fire_EventAddAreaPoint",addAreaPoint);
	}else{
		Module.XDSetMouseState(Module.MML_SELECT_POINT);
		Module.canvas.removeEventListener("Fire_EventAddAreaPoint",addAreaPoint);
	}
}


/**
 * 	면적측정 이벤트 함수
 */
var addAreaPoint=function(e) {
	
	var nIndex = AreaObject.index;
	
	if (AreaObject.poi == null) {
		
		// 첫 이벤트 호출 시 POI 오브젝트 생성
		AreaObject.poi = Module.createPoint("Area"+nIndex);
		AreaObject.layer.addObject(AreaObject.poi, 0);	
	}
	setPoiIcon_area(e.dArea);
	AreaObject.poi.setPosition(new Module.JSVector3D(e.dLon, e.dLat, e.dAlt+10));
//	toolbar(2);//면적재기 종료	
};



/* 분석 내용 출력 아이콘 생성 */
function setPoiIcon_area(_value) {
	
	// POI 아이콘 이미지를 그릴 Canvas 생성
	var drawCanvas = document.createElement('canvas'), nIndex = AreaObject.index;
    drawCanvas.width = 300;
    drawCanvas.height = 100;
	
	// 아이콘 이미지 데이터 반환
	var imageData = drawIcon_area(drawCanvas, _value);
	
	// 아이콘 해제
	var oldIcon = AreaObject.poi.getIcon();
	if (oldIcon != null) {
		AreaObject.poi.releaseIcon();
		AreaObject.symbol.deleteIcon(oldIcon.getId());
	}
	
	// 심볼에 아이콘 이미지 등록
	if (AreaObject.symbol.insertIcon("Area_Icon"+nIndex, imageData, drawCanvas.width, drawCanvas.height)) {
		
		// 기존 등록한 POI의 아이콘 이미지 반환
		var newIcon = AreaObject.symbol.getIcon("Area_Icon"+nIndex);

		// 새로 생성한 POI 아이콘 이미지 설정
		AreaObject.poi.setIcon(newIcon);
		AreaObject.index++;
	}
}

/* 아이콘 이미지 데이터 반환 */
function drawIcon_area(_canvas, _value) {
	
	// 컨텍스트 반환 및 배경 초기화
	var ctx = _canvas.getContext('2d'),
		width = _canvas.width,
		height = _canvas.height
		;
	ctx.clearRect(0, 0, width, height);

	// 배경 Draw Path 설정 후 텍스트 그리기
	drawBalloon_area(ctx, height*0.5, width, height, 5, height*0.25);
	setText_area(ctx, width*0.5, height*0.2, _value);
			
	return ctx.getImageData(0, 0, _canvas.width, _canvas.height).data;
}

/* 말풍선 배경 그리기 */
function drawBalloon_area(ctx,
					 marginBottom, width, height,
					 barWidth, barHeight) {
	
	var wCenter = width * 0.5,
		hCenter = height * 0.5;
	
	// 말풍선 형태의 Draw Path 설정
	ctx.beginPath();
	ctx.moveTo(0, 				 0);
	ctx.lineTo(0, 				 height-barHeight-marginBottom);
	ctx.lineTo(wCenter-barWidth, height-barHeight-marginBottom);
	ctx.lineTo(wCenter, 		 height-marginBottom);
	ctx.lineTo(wCenter+barWidth, height-barHeight-marginBottom);
	ctx.lineTo(width,			 height-barHeight-marginBottom);
	ctx.lineTo(width,			 0);			
	ctx.closePath();
			
	// 말풍선 그리기
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fill(); 
}

/* 텍스트 그리기 */
function setText_area(_ctx, _posX, _posY, _value) {
	
	// 텍스트 문자열 설정
	var strText = setTextComma_area(_value.toFixed(2))+'㎡';
	
	// 텍스트 스타일 설정
	_ctx.font = "bold 16px sans-serif";
    _ctx.textAlign = "center";
	_ctx.fillStyle = "rgb(0, 0, 0)";
	
	// 텍스트 그리기
    _ctx.fillText(strText, _posX, _posY);
}

function setTextComma_area(str) {
	str = String(str);
	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

/* 면적 분석 내용 초기화 */
function clearMeasurementArea() {
	
// 실행 중인 분석 내용 초기화
	Module.XDClearAreaMeasurement();	
	
	var layer = trueLayerList.nameAtLayer("MEASURE_Area"),
		symbol = AreaObject.symbol;
	if (layer == null) {
		return;
	}
	var areaKey=new Array();
	// 등록된 아이콘 리스트 삭제
	var i, len,
		icon, poi;
	for (i=0, len=layer.getObjectCount(); i<len; i++) {
		areaKey[i]=trueLayerList.nameAtLayer("MEASURE_Area").indexAtKey(i);
	}
	
	for (i=0, len=areaKey.length; i<len; i++) {
		
		poi = layer.keyAtObject(areaKey[i]);
		icon = poi.getIcon();
		
		// 아이콘을 참조 중인 POI 삭제
		layer.removeAtKey(areaKey[i]);
		
		// 아이콘을 심볼에서 삭제
		symbol.deleteIcon(icon.getId());
	}
	// POI, Icon 키 지정 인덱스 초기화
	AreaObject.index = 0;
	//오브젝트 널처리
	AreaObject.poi=null;
}

/* m/km 텍스트 변환 */
function setMeasurementKilloUnit(_text, _meterToKilloRate, _decimalSize) {

	if (_decimalSize < 0) {
		_decimalSize = 0;
	}
	if (typeof _text == "number") {
		if (_text < 1.0 / (_meterToKilloRate * Math.pow(10, _decimalSize))) {
			_text = _text.toFixed(1).toString() + 'm';
		} else {
			_text = (_text * _meterToKilloRate).toFixed(2).toString() + '㎞';
		}
	}
	return _text;
}

/**
 * 	고도측정 함수
 */
function measureAltitude(flag){
	//거리, 면적측정, 터파기 결과 초기화 
//	clearMeasurementDistance();
//	clearMeasurementArea();
//	clearMeasurementTransparency();
	if(flag){
		//아이콘 관리 심볼 생성
		AltitudeObject.symbol = Module.getSymbol();
		//측정 출력 POI 레이어 생성
		AltitudeObject.layer = trueLayerList.createLayer("MEASURE_Altitude", Module.ELT_3DPOINT);
		AltitudeObject.layer.setMaxDistance(1000000.0);
		AltitudeObject.layer.setSelectable(false);
		Module.XDSetMouseState(Module.MML_ANALYS_ALTITUDE);
		
		// 높이 측정 이벤트 설정
		Module.canvas.addEventListener("Fire_EventAddAltitudePoint", eventAddAltitudePoint);
	}else{
		Module.XDSetMouseState(Module.MML_SELECT_POINT);
		// 높이 측정 이벤트 설정
		Module.canvas.removeEventListener("Fire_EventAddAltitudePoint", eventAddAltitudePoint);
	}
	
	
}

/**
 * 	고도측정 이벤트 함수
 */
var eventAddAltitudePoint=function(e) {
	console.log(e.dLon);
	console.log(e.dLat);
	createAltitudePOI( new Module.JSVector3D(e.dLon, e.dLat, e.dAlt),
			   "rgba(10, 10, 0, 0.5)",
			   e.dGroundAltitude, e.dObjectAltitude );
};

/**
 * 	고도 측정 분석 내용 출력 POI 생성
 */
function createAltitudePOI(_position, _color, _value, _subValue) {
	// POI 아이콘 이미지를 그릴 Canvas 생성
	var drawCanvas = document.createElement('canvas');
    drawCanvas.width = 200;
    drawCanvas.height = 100;
	
	// 아이콘 이미지 데이터 반환
	var imageData = drawAltitudeIcon(drawCanvas, _color, _value, _subValue),
		nIndex = AltitudeObject.index;
	
	// 심볼에 아이콘 이미지 등록
	if (AltitudeObject.symbol.insertIcon("Icon"+nIndex, imageData, drawCanvas.width, drawCanvas.height)) {
		
		// 등록한 아이콘 객체 반환
		var icon = AltitudeObject.symbol.getIcon("Icon"+nIndex);
	
		// JSPoint 객체 생성
		var count = AltitudeObject.layer.getObjectCount(),
			poi = Module.createPoint("POI"+nIndex)
			;
			
		poi.setPosition(_position);		// 위치 설정
		poi.setIcon(icon);				// 아이콘 설정
			
		// 레이어에 오브젝트 추가
		AltitudeObject.layer.addObject(poi, 0);
		
		// 인덱스 값 상승
		AltitudeObject.index++;
	}
}

/**
 * 	고도 측정 아이콘 이미지 데이터 반환
 */
function drawAltitudeIcon(_canvas, _color, _value, _subValue) {
	// 컨텍스트 반환 및 배경 초기화
	var ctx = _canvas.getContext('2d'),
		width = _canvas.width,
		height = _canvas.height
		;
	ctx.clearRect(0, 0, width, height);

	// 배경과 높이 값 텍스트 그리기
	if (_subValue == -1) {
		drawAltitudeRoundRect(ctx, 50, 20, 100, 20, 5, _color);		// 오브젝트 높이 값이 유효하지 않는 경우
		
	} else {
		drawAltitudeRoundRect(ctx, 50, 5, 100, 35, 5, _color);		// 오브젝트 높이 값이 유효한 경우
		setAltitudeText(ctx, width*0.5, height*0.2, '지면고도 : ' + setKilloUnit(_subValue, 0.001, 0));
	}
	setAltitudeText(ctx, width*0.5, height*0.2+15, '해발고도 : '+ setKilloUnit(_value, 0.001, 0));
	
	// 위치 표시 점 그리기
	drawAltitudeDot(ctx, width, height);

	return ctx.getImageData(0, 0, _canvas.width, _canvas.height).data;
}

/**
 * 	고도 측정 위치 표시 점 그리기
 */
function drawAltitudeDot(ctx, width, height) {
			
	ctx.beginPath();			
    ctx.lineWidth = 6;
    ctx.arc(width*0.5, height*0.5, 2, 0, 2*Math.PI, false);    
	ctx.closePath();
			
	ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
	ctx.fill();
	ctx.lineWidth = 8;
	ctx.strokeStyle = "rgba(255, 255, 0, 0.8)";
	ctx.stroke();
}

/**
 * 	고도 측정 둥근 사각형 배경 그리기
 */
function drawAltitudeRoundRect(ctx, 
					   x, y,
					   width, height, radius,
					   color) {
			
	if (width < 2 * radius) 	radius = width * 0.5;
	if (height < 2 * radius) 	radius = height * 0.5;
		
	ctx.beginPath();
	ctx.moveTo(x+radius, y);
	ctx.arcTo(x+width, 	y, 	 		x+width, 	y+height, 	radius);
	ctx.arcTo(x+width, 	y+height, 	x,		 	y+height, 	radius);
	ctx.arcTo(x, 	 	y+height, 	x,   		y,   		radius);
	ctx.arcTo(x,	   	y,   	 	x+width, 	y,   		radius);
	ctx.closePath();
	
	// 사각형 그리기
	ctx.fillStyle = color;
    ctx.fill(); 
	
	return ctx;
}

/**
 * 	고도 측정 텍스트 그리기
 */
function setAltitudeText(_ctx, _posX, _posY, _strText) {
	
	_ctx.font = "bold 12px sans-serif";
    _ctx.textAlign = "center";
	
	_ctx.fillStyle = "rgb(255, 255, 255)";
    _ctx.fillText(_strText, _posX, _posY);
}

/* 고도 분석 내용 초기화 */
function clearMeasurementAltitude() {

	// 실행 중인 분석 내용 초기화
	Module.XDClearDistanceMeasurement();	
	
	var layer = trueLayerList.nameAtLayer("MEASURE_Altitude"), symbol = AltitudeObject.symbol;
	if (layer == null) {
		return;
	}

	// 등록된 아이콘 리스트 삭제
	var i, len, icon, poi;
	for (i=0, len=layer.getObjectCount(); i<len; i++) {
		
		poi = trueLayerList.nameAtLayer("MEASURE_Altitude").keyAtObject("POI"+i);
		icon = poi.getIcon();
		
		// 아이콘을 참조 중인 POI 삭제
		layer.removeAtKey("POI"+i);
		
		// 아이콘을 심볼에서 삭제
		symbol.deleteIcon(icon.getId());
	}
	
	// POI 오브젝트 삭제
	AltitudeObject.layer.removeAll();
	trueLayerList.nameAtLayer("MEASURE_Altitude").removeAll();
	
	// POI, Icon 키 지정 인덱스 초기화
	AltitudeObject.index = 0;
}

/**
 * 	m/km 텍스트 변환 함수
 */
function setKilloUnit(_text, _meterToKilloRate, _decimalSize){
			
	if (_decimalSize < 0){
		_decimalSize = 0;
	}
	if (typeof _text == "number") {
		if (_text < 1.0/(_meterToKilloRate*Math.pow(10,_decimalSize))) {
			_text = _text.toFixed(1).toString()+'m';
		} else {			
			_text = (_text*_meterToKilloRate).toFixed(2).toString()+'㎞';
		}
	}
	return _text;
}

/*
 * 태블로(대조기) 가져오기
 * */
function getTableauContrast(){

	//태블로 영역 초기화
	$('#tableau').empty();

	//태블로(연안사고) 비활성화
	$('#analysisTableau-coastAccident').prop("checked", false);

	//태블로(조직정원) 비활성화
	$('#analysisTableau-organization').prop("checked", false);

	if($('#contrast_dt').hasClass('active')){
		
	//태블로 영역에 태블로(대조기) 활성화
	}else{
		var param = {
		};
		var ticket = "";
		//운영환경일 시 태블로 티켓받아서 자동로그인
		if(runEnv=="prod"){
			temp_cf_ajax( "/use/gisAnal/getTicket.do",param , function(data){
				ticket=data.ticket;
					//로딩바 숨기기
				var htmlStr="";
					htmlStr+='<div class="tablue" style="position: fixed; top: 130px; width: 70%; height: 800px; right: 70px; background: white; z-index: 150;">';
					htmlStr+="	<div class='tableauPlaceholder' id='viz1639548704310' style='position: relative'>";
					htmlStr+="		<object class='tableauViz' style='display: none;'>";
					htmlStr+="			<param name='host_url' value='"+tableauURL+ticket+"/' />";
					htmlStr+="			<param name='embed_code_version' value='3' />";
					htmlStr+="			<param name='site_root' value='' />";
					htmlStr+="			<param name='name' value='"+tableauContrast+"' />";
					htmlStr+="			<param name='customViews' value='no'/>";
					htmlStr+="			<param name='showShareOptions' value='false' />";
					htmlStr+="			<param name='tabs' value='no' />";
					htmlStr+="			<param name='toolbar' value='no' />";
					htmlStr+="			<param name='animate_transition' value='yes' />";
					htmlStr+="			<param name='display_static_image' value='yes' />";
					htmlStr+="			<param name='display_spinner' value='yes' />";
					htmlStr+="			<param name='display_overlay' value='no' />";
					htmlStr+="			<param name='display_count' value='yes' />";
					htmlStr+="			<param name='language' value='ko-KR' />";
					htmlStr+="		</object>";
					htmlStr+="	</div>";
					htmlStr+="	<script type='text/javascript'>";
					htmlStr+="		var divElement = document.getElementById('viz1639548704310');";
					htmlStr+="		var vizElement = divElement.getElementsByTagName('object')[0];";
					htmlStr+="		if (divElement.offsetWidth > 800) {";
					htmlStr+="			vizElement.style.width = '100%';";
					htmlStr+="			vizElement.style.height = '100%';";
					htmlStr+="		} else if (divElement.offsetWidth > 500) {";
					htmlStr+="			vizElement.style.width = '100%';";
					htmlStr+="			vizElement.style.height = '100%';";
					htmlStr+="		} else {";
					htmlStr+="			vizElement.style.width = '100%';";
					htmlStr+="			vizElement.style.height = '100%';";
					htmlStr+="		}";
					htmlStr+="		var scriptElement = document.createElement('script');";
					htmlStr+="		scriptElement.src = '"+tableauURL+"javascripts/api/viz_v1.js';";
					htmlStr+="		vizElement.parentNode.insertBefore(scriptElement, vizElement);";
					htmlStr+="	</script>";
					htmlStr+="</div>";
					$('#tableau').append(htmlStr);
				temp_cf_loadingbarHide();
				});
		}else{
				var htmlStr="";
					htmlStr+='<div class="tablue" style="position: fixed; top: 130px; width: 70%; height: 800px; right: 70px; background: white; z-index: 150;">';
					htmlStr+="	<div class='tableauPlaceholder' id='viz1639548704310' style='position: relative'>";
					htmlStr+="		<object class='tableauViz' style='display: none;'>";
					htmlStr+="			<param name='host_url' value='"+tableauURL+"/' />";
					htmlStr+="			<param name='embed_code_version' value='3' />";
					htmlStr+="			<param name='site_root' value='' />";
					htmlStr+="			<param name='name' value='"+tableauContrast+"' />";
					htmlStr+="			<param name='customViews' value='no'/>";
					htmlStr+="			<param name='showShareOptions' value='false' />";
					htmlStr+="			<param name='tabs' value='no' />";
					htmlStr+="			<param name='toolbar' value='no' />";
					htmlStr+="			<param name='animate_transition' value='yes' />";
					htmlStr+="			<param name='display_static_image' value='yes' />";
					htmlStr+="			<param name='display_spinner' value='yes' />";
					htmlStr+="			<param name='display_overlay' value='no' />";
					htmlStr+="			<param name='display_count' value='yes' />";
					htmlStr+="			<param name='language' value='ko-KR' />";
					htmlStr+="		</object>";
					htmlStr+="	</div>";
					htmlStr+="	<script type='text/javascript'>";
					htmlStr+="		var divElement = document.getElementById('viz1639548704310');";
					htmlStr+="		var vizElement = divElement.getElementsByTagName('object')[0];";
					htmlStr+="		if (divElement.offsetWidth > 800) {";
					htmlStr+="			vizElement.style.width = '100%';";
					htmlStr+="			vizElement.style.height = '100%';";
					htmlStr+="		} else if (divElement.offsetWidth > 500) {";
					htmlStr+="			vizElement.style.width = '100%';";
					htmlStr+="			vizElement.style.height = '100%';";
					htmlStr+="		} else {";
					htmlStr+="			vizElement.style.width = '100%';";
					htmlStr+="			vizElement.style.height = '100%';";
					htmlStr+="		}";
					htmlStr+="		var scriptElement = document.createElement('script');";
					htmlStr+="		scriptElement.src = '"+tableauURL+"javascripts/api/viz_v1.js';";
					htmlStr+="		vizElement.parentNode.insertBefore(scriptElement, vizElement);";
					htmlStr+="	</script>";
					htmlStr+="</div>";
					$('#tableau').append(htmlStr);
		}
	
	}
}
/*
 * 빈 격자 그리기
 * */
function _getGrid(_data){
	var thisdata=_data.data.data;

	// 레이어 추가
	var layer = trueLayerList.createLayer("GRID_LAYER", Module.ELT_POLYHEDRON);
		layer.setMaxDistance(20000000.0);
		layer.setMinDistance(140000.0);
		
	// 그리드 객체 생성
	var colorGrid3D = Module.createColorGrid3D("DF_ANA_GRID");

	// 최대, 최소 rect와 셀 갯수에 따른 그리드 cell 위치 지정
	colorGrid3D.SetGridCellDefaultColor(new Module.JSColor(0, 0, 0, 0));
	
	// 그리드 셀의 위치 및 크기, 높이 설정
	var rowNum = 180,
		colNum = 160;
		
		
	var gridCellNum = colorGrid3D.SetGridPosition(
		new Module.JSVector2D(124, 38.95), 		// 그리드 좌상단
		new Module.JSVector2D(133, 38.95), 		// 그리드 우상단
		new Module.JSVector2D(133, 30.9), 		// 그리드 우하단
		new Module.JSVector2D(124, 30.9), 		// 그리드 좌하단
		1000.0, 								// 그리드 바닥면 고도
		rowNum, 								// 그리드 가로 셀 갯수
		colNum									// 그리드 세로 셀 갯수
	);
	
	
	// cell line color 초기화
	for(var i=0;i<180;i++){
		for(var j=0;j<160;j++){
			colorGrid3D.SetGridCellLineColor(i, j,  new Module.JSColor(0,0,0,0));
		}
	}
	
	// 값에 따른 그리드 셀 색상 리스트
	var gridCellColor = [
		new Module.JSColor(150,128,128,128),		
	];
	
	//selectBox에서 선택한 데이터로 격자에 색 넣기
	for(var i=0;i<thisdata.length;i++){
	
		
		
		colorGrid3D.SetGridCellColor(thisdata[i].index_y, thisdata[i].index_x, gridCellColor[0]);
		// 셀 높이 설정
		colorGrid3D.SetGridCellHeight(thisdata[i].index_y, thisdata[i].index_x, 5000);
		
		colorGrid3D.SetGridCellLineColor(thisdata[i].index_y, thisdata[i].index_x, new Module.JSColor(50,  0,0,0));
		
	}
	
	// 설정한 옵션으로 그리드 객체 형태 생성
	colorGrid3D.Create();
	
	//레이어에 격자 객체 추가
	layer.addObject(colorGrid3D, 0);
	//layer.setMaxDistance(8000000000.0);
	
	//$('#layer_grid_dt').addClass('active');
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 2D/3D 변경
 * */
function mapChange(){
	
	if($('#map_change').text() == "2D"){
		$('#map_change').text('3D');
		Module.XDESetDemUrlLayerName("","");  
		Module.XDEPlanetRefresh(); // 지도 초기화 후 새로 로딩
		Module.getViewCamera().setTilt(90);
		Module.getViewCamera().setLimitTilt(90);
		/*
		$('#canvas').css('visibility','hidden');
		$('#map2D').css('visibility','visible');

		//화면 좌표 이동 3D->2D
		var camera = Module.getViewCamera();
		var vCenter = camera.getCenterPoint();
		var dCenterLon = vCenter.Longitude;
		var dCenterLat = vCenter.Latitude;
		var ZoomLevel= camera.getMapZoomLevel();
		var lonlat =[dCenterLon,dCenterLat];
		var coords = ol.proj.fromLonLat(lonlat); //WGS84 -> EPSG:3857
		map.getView().setCenter(coords); 	//바로이동
		map.getView().setZoom(ZoomLevel+4);*/
	}else{
		$('#map_change').text('2D');
		Module.XDESetDemUrlLayerName(XDServerURL, "dem"); //지도 설정
		Module.XDEPlanetRefresh(); // 지도 초기화 후 새로 로딩
		Module.getViewCamera().setTilt(90);
		Module.getViewCamera().setLimitTilt(0);
		/*	
		$('#canvas').css('visibility','visible');
		$('#map2D').css('visibility','hidden');
		
		var centerCoor = ol.proj.toLonLat( map.getView().getCenter() );
		var camera = Module.getViewCamera();

		camera.moveLonLat(parseFloat(centerCoor[0]), parseFloat(centerCoor[1]));
		camera.setTilt(90);*/
	}
}

/*
 * 배경지도 변경(항공영상, 일반해도, 종이해도)
 * 
 */
function backgroundMapChange(){
	var option = {
		    url: "/static_resources/gis/Engine/proxy2.jsp?url=",
		    serviceName: "CHART",
		    key: "75ab39dfa4584cacb0c41d31e1ca1a69",
		    projection: "EPSG:5179",
		    maxResolution: 125094.232896,    // 0레벨 해상도 (zero 타일 개수 구하기 위한 값)
		    tileSize: 256,
		    tileExtent: {
		        min: new Module.JSVector2D(-200000.0, -28024123.62),
		        max: new Module.JSVector2D(31824123.62, 4000000.0)
		    },
		    zeroLevel: 4,
		     dataArea: {
		        min: new Module.JSVector2D(113.335165, 17.267894),
		        max: new Module.JSVector2D(153.755086, 50.378477)
		    },
		    serviceLevel: {
		        min: 2,
		         max: 16
		    },
		    type: 92
		};

		Module.getMap().changeBaseMap(option);
}