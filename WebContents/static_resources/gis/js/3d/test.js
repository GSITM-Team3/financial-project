
var M_PATH = [	// 이동 경로
	 [129.12963764590378, 35.169961910875635, 5.4206658117473125],
	[129.12951952593923, 35.16996377359737, 5.53195112105459 ],
	[129.12883661169826, 35.170780809689894, 5.180730025283992],
	[129.1289018623607, 35.170879079770735, 5.202075242996216],
	[129.13018263055267, 35.17158870531483, 5.0828983671963215],
	[129.1303365138692, 35.17158272158551, 4.921365736052394],
	[129.130998657037, 35.17075438554098, 4.4021493904292583],
	[129.130922282423, 35.17065684797733, 4.4786185761913657],
	[129.12963764590378, 35.169961910875635, 5.4206658117473125]
]
var M_PATH = [	// 이동 경로
	[129.1384295, 35.1329108, -0.1380966],
	[129.1279133,35.1485128,-0.4348764],
	[129.1307721,35.1500130,-0.4005453],
	[129.1348694,35.1440907,-0.0456795]
]

var GLOBAL = {
	CAMERA : null,	// 카메라 설정 API
	TRACE : null,	// 오브젝트 경로 이동 설정 API
	CONTROL : null,	// 지도 컨트롤 옵션 설정 API
	MOVE_PATH : [	// 이동 경로
		{lon : 129.12963764590378, lat : 35.169961910875635, alt : 5.4206658117473125},
		{lon : 129.12951952593923, lat : 35.16996377359737, alt : 5.53195112105459, speed : 10.0, direction : -88.7499},
		{lon : 129.12883661169826, lat : 35.170780809689894, alt : 5.180730025283992, speed : 10.0, direction : -35.2500},
		{lon : 129.1289018623607, lat : 35.170879079770735, alt : 5.202075242996216, speed : 10.0, direction : 36.2496},
		{lon : 129.13018263055267, lat : 35.17158870531483, alt : 5.0828983671963215, speed : 10.0, direction : 55.7497},
		{lon : 129.1303365138692, lat : 35.17158272158551, alt : 4.921365736052394, speed : 10.0, direction : 89.2502},
		{lon : 129.130998657037, lat : 35.17075438554098, alt : 4.4021493904292583, speed : 10.0, direction : 145.0003},
		{lon : 129.130922282423, lat : 35.17065684797733, alt : 4.4786185761913657, speed : 10.0, direction : -180.7493},
		{lon : 129.12963764590378, lat : 35.169961910875635, alt : 5.4206658117473125, speed : 10.0, direction : -125.4994}
	]
};129.1384295, 35.1329108, -0.1380966
var GLOBAL = {
		CAMERA : null,	// 카메라 설정 API
		TRACE : null,	// 오브젝트 경로 이동 설정 API
		CONTROL : null,	// 지도 컨트롤 옵션 설정 API
		MOVE_PATH : [	// 이동 경로
			{lon : 129.1384295, lat : 35.1329108, alt : 0.009984887205064297},
			{lon : 129.1279133, lat : 35.1485128, alt :0.009944349527359009, speed : 10.0},
			{lon :129.1307721, lat : 35.150013, alt : 0.009974319487810135, speed : 10.0},
			{lon : 129.1348694, lat : 35.1440907, alt : 0.009974319487810135, speed : 10.0}
		]
	};


//두점으로 방위각 계산
function bangwekag(x1,y1,x2,y2){
	var lat1 = y1; 
	var lon1 = x1; 
	var lat2 = y2; 
	var lon2 = x2; 
	// 위도, 경도를 라디안 단위로 변환
	var o1 = lat1 * Math.PI / 180; 
	var o2 = lat2 * Math.PI / 180; 
	var i1 = lon1 * Math.PI / 180; 
	var i2 = lon2 * Math.PI / 180; 
	var y = Math.sin(i2 - i1) * Math.cos(o2); 
	var x = Math.cos(o1) * Math.sin(o2) - Math.sin(o1) * Math.cos(o2) * Math.cos(i2 - i1);
	var oo = Math.atan2(y, x); 
	// 방위각 (라디안)
	var bearing = (oo * 180 / Math.PI + 360) % 360; // 방위각 (디그리, 정규화 완료)
	return bearing;
	}

/* 폴리곤 생성 */
function createLine( id, _vertices, _option) {

	var color = new Module.JSColor(0.1, 0.1, 0.1);

	var layerList = new Module.JSLayerList(true);
	var layer = layerList.createLayer("COLOR_POLYGONS", Module.ELT_3DLINE);

	// 폴리곤 객체 생성
	var line = Module.createLineString(id);

	// 폴리곤 색상 설정
	var lineStyle = new Module.JSPolyLineStyle();
	lineStyle.setColor(color);
	lineStyle.setWidth(3.0);
	line.setStyle(lineStyle);

	// 버텍스 배열 생성
	var vertex = new Module.JSVec3Array();
	for (var i=0; i<_vertices.length; i++) {
		vertex.push(new Module.JSVector3D(_vertices[i][0], _vertices[i][1], _vertices[i][2]));
	}

	var part = new Module.Collection();
	part.add(_vertices.length);

	line.setPartCoordinates(vertex, part);
	
	if (_option == "SKY_LINE") {
		line.setUnionMode(false);
	} else if (_option == "dash") {
		line.SetDashType(10.0);
	} else if (_option == "dash_SKY_LINE") {
        line.setUnionMode(false);
		line.SetDashType(10.0);
	}

	// 레이어에 객체 추가
	layer.addObject(line, 0);
}



function initMovement() {
	$('#objectMovement').removeClass('hide');
    // 경로 이동 설정 API
    GLOBAL.CONTROL = Module.getControl();
    
	// 경로 이동 객체 생성
	var trace = Module.CreateTrace("DRIVE_TRACE");

	// 이동 경로 설정
	var startPosition = new Module.JSVector3D(GLOBAL.MOVE_PATH[0].lon, GLOBAL.MOVE_PATH[0].lat, GLOBAL.MOVE_PATH[0].alt+2);	// 경로 시작 지점
	trace.SetPathStartPosition(startPosition);

	for (var i=1; i<GLOBAL.MOVE_PATH.length; i++) {
		trace.AddPath(
			new Module.JSVector3D(GLOBAL.MOVE_PATH[i].lon, GLOBAL.MOVE_PATH[i].lat, GLOBAL.MOVE_PATH[i].alt+2),
			GLOBAL.MOVE_PATH[i].speed,
			bangwekag(GLOBAL.MOVE_PATH[i-1].lon,GLOBAL.MOVE_PATH[i-1].lat,GLOBAL.MOVE_PATH[i].lon,GLOBAL.MOVE_PATH[i].lat)
		);
	}
	
	Module.canvas.onmousedown = function(e){
		var loc = Module.getMap().ScreenToMapPointEX(new Module.JSVector2D(e.x, e.y));
		console.log("["+loc.Longitude + ", " + loc.Latitude + ", " + loc.Altitude+"],");
		var loc = Module.getViewCamera().getLocation();
		console.log(loc.Longitude+", "+loc.Latitude+", "+loc.Altitude);
		console.log(Module.getViewCamera().getDirect());
		console.log(Module.getViewCamera().getTilt());
	};	

	// 이동 오브젝트 등록
	var startPosition = new Module.JSVector3D(GLOBAL.MOVE_PATH[0].lon, GLOBAL.MOVE_PATH[0].lat, GLOBAL.MOVE_PATH[0].alt);
	var traceObject = createObject("./resources/data/3ds", "Ship.3ds", startPosition);
	trace.SetObject(traceObject);
	trace.SetObjectScale(0.1);

	// 경로 옵션 설정
	trace.SetPathMoveRepeat(true);		// 경로 반복 이동

	GLOBAL.TRACE = trace;

	// 카메라 추적 등록
	var camera = Module.getViewCamera();
	camera.SetTrace(trace);
	camera.setLocation(new Module.JSVector3D(129.12987497705203, 35.17075391903026, 300.0));
	camera.setPermitUnderGround(true);
	camera.setLimitTilt(-88.0);
	
	GLOBAL.CAMERA = camera;

	// 오브젝트 위치 출력
	(function printPosition() {
	  	setTimeout(function() {

	  		if (GLOBAL.TRACE == null) {
	 			return;
	 		}

	  		// 오브젝트 현재 위치 반환
	 		var position = GLOBAL.TRACE.GetCurrentPosition();
	 		document.getElementById("OUTPUT_LONGITUDE").innerHTML = position.Longitude.toFixed(5);
	 		document.getElementById("OUTPUT_LATITUDE").innerHTML = position.Latitude.toFixed(5);
	 		document.getElementById("OUTPUT_ALTIDUE").innerHTML = position.Altitude.toFixed(5);

	   		printPosition();

	   	}, 10);
	})();
	
	// 경로 이동 시작
	trace.SetPathMoveStart();
	createPOI();

	createLine( "LINE_0", M_PATH, "SKY_LINE");
	
}

function createPOI() {
	// POI 오브젝트를 추가 할 레이어 생성
	var layerList = new Module.JSLayerList(true);
	var layer = layerList.createLayer("POI_TEST", Module.ELT_3DPOINT);

	// Text & image POI
	var img = new Image();
	img.onload = function() {

		// 이미지 로드 후 캔버스에 그리기
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
		for (var i=1; i<GLOBAL.MOVE_PATH.length; i++) {
		// 이미지 POI 생성
		var poi_with_text_n_image = Module.createPoint("POI_WITH_IMAGE");
		poi_with_text_n_image.setPosition(new Module.JSVector3D(GLOBAL.MOVE_PATH[i].lon, GLOBAL.MOVE_PATH[i].lat, GLOBAL.MOVE_PATH[i].alt+2));
		poi_with_text_n_image.setImage(ctx.getImageData(0, 0, this.width, this.height).data, this.width, this.height);
		
		// 텍스트 설정
		poi_with_text_n_image.setText(i+"이동경로");
		
		this.layer.addObject(poi_with_text_n_image, 0);
		}		
    };
    img.layer = layer;
    img.src = "./resources/img/poi/shipIcon.png"
}

/* 카메라 위치 및 시점 설정 */
function setCameraPosition(_type) {
	
	if (GLOBAL.CAMERA == null || GLOBAL.TRACE == null) {
		return;
	}
	
	switch (_type) {
	
	// 자유 시점
	case 'free' :
		
		// 카메라 Trace 이동 비활성화
		GLOBAL.CAMERA.SetTraceActive(false);	
		
		// 카메라 조정
		GLOBAL.CAMERA.setTilt(90.0);
		
		// 지도 이동 컨트롤 활성화
		GLOBAL.CONTROL.activeMouse(true);
		break;
		
	// 오브젝트 시점
	case 'object' :
		
		// 카메라 Trace 이동 활성화
		GLOBAL.CAMERA.SetTraceActive(true);
		
		// 지도 이동 컨트롤 비활성화
		GLOBAL.CONTROL.activeMouse(false);
		break;
		
	// 지정 위치(A)
	case 'position_A' :
		
		// 카메라 Trace 이동 비활성화
		GLOBAL.CAMERA.SetTraceActive(false);	
		
		// 지도 이동 컨트롤 활성화
		GLOBAL.CONTROL.activeMouse(false);
		
		// 카메라 위치 설정
		GLOBAL.CAMERA.setTilt(90.0);
		GLOBAL.CAMERA.setDirect(0.0);
		GLOBAL.CAMERA.setLocation(new Module.JSVector3D(129.12987497705203, 35.17075391903026, 500.0));
		break;
		
	// 지정 위치(B)
	case 'position_B' :
		
		// 카메라 Trace 이동 비활성화
		GLOBAL.CAMERA.SetTraceActive(false);	
		
		// 지도 이동 컨트롤 활성화
		GLOBAL.CONTROL.activeMouse(false);
		
		// 카메라 위치 설정
		GLOBAL.CAMERA.setTilt(0.0);
		GLOBAL.CAMERA.setDirect(69.50);
		GLOBAL.CAMERA.setLocation(new Module.JSVector3D(129.12960723322536, 35.17003416771986, 8.0));
		break;
				
	default :
		return;
	}
}


/* 오브젝트 이동 경로 설정 */
function setMovePath(trace) {

	// 시작 지점 설정
	var startPosition = new Module.JSVector3D(GLOBAL.MOVE_PATH[0].lon, GLOBAL.MOVE_PATH[0].lat, GLOBAL.MOVE_PATH[0].alt);
	trace.SetPathStartPosition(startPosition);

	// 경로 추가
	for (var i=1; i<GLOBAL.MOVE_PATH.length; i++) {
		trace.AddPath(
			new Module.JSVector3D(GLOBAL.MOVE_PATH[i].lon, GLOBAL.MOVE_PATH[i].lat, GLOBAL.MOVE_PATH[i].alt), 
			GLOBAL.MOVE_PATH[i].speed,
			bangwekag(GLOBAL.MOVE_PATH[i-1].lon,GLOBAL.MOVE_PATH[i-1].lat,GLOBAL.MOVE_PATH[i].lon,GLOBAL.MOVE_PATH[i].lat)
		);
	}
	trace.AddPath(new Module.JSVector3D(129.1290688666648, 35.17318243181746, 10.0), 20.0, -40.0);
	trace.AddPath(new Module.JSVector3D(129.1274218324719, 35.17234295766914, 10.0), 20.0, 230.0);
	trace.AddPath(new Module.JSVector3D(129.1294884900169, 35.16979616935218, 10.0), 20.0, 140.0);
}
/* 오브젝트 생성 */
function createObject(_path, _fileName, _position) {

	var object = Module.createPolygon("FILE_OBJECT");
	if (object == null) {
		return null;
	}

	// 3DS 파일 로드
	object.setFileMesh(_path, _fileName, _position);

	return object;
}

/* 오브젝트 스케일 설정 */
function setObjectScale(_value) {

	if (GLOBAL.TRACE == null) {
		return;
	}

	GLOBAL.TRACE.SetObjectScale(parseFloat(_value));
	document.getElementById("txScale").value = _value;
}
