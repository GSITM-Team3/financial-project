var wthObj = false;;
var selectTime;
function setWeatherEffect(pNum, obj){
	if(wthObj == false){
		wthObj = true;
		M_WEATHER_EFFECT.init();
	}
	var flag = $(obj).hasClass('active'); //늦게 반영되서 반대로함 
	if(pNum == 1){
		M_WEATHER_EFFECT.setRainPlay(!flag);
	}else if(pNum == 2){
		M_WEATHER_EFFECT.setSnowPlay(!flag);
	}else if(pNum == 3){
		M_WEATHER_EFFECT.setDisplayFog(!flag, "M");
	}else if(pNum == 4){
		//makeWeatherIcon(!flag);
		if(!$(".s_8").hasClass('active')){
			// 기상정보 호출
			if(selectTime == null){
			temp_cf_ajax( "/use/gisAnal/getWthInfo.do", null, _getWthInfo);
			}else{
			temp_cf_ajax( "/use/gisAnal/getWeatherDateInfo.do", selectTime, _getWthInfo);	
			}
		}else{
			
			Module.XDSetMouseState(1);
			
			if(trueLayerList.nameAtLayer("WeatherIco") != null){	
				trueLayerList.nameAtLayer("WeatherIco").removeAll();	
			}
			
			if(trueLayerList.nameAtLayer("WeatherInfoPop") != null){		
				trueLayerList.nameAtLayer("WeatherInfoPop").removeAll();
			}
		}
		
	}else if(pNum == 5){
		//바람장
		$(".s_10").removeClass('active');
		if (!$(".s_9").hasClass('active')) {
			if (selectTime == null) {
				temp_cf_ajax("/use/gisAnal/getNowWindInfo.do", null, getWindData);
			} else {
				temp_cf_ajax("/use/gisAnal/getWeatherDateInfo.do", selectTime, getWindData);
			}
		} else {
			var pFlow = Module.getFlow();
			pFlow.ClearFlowData();
		}
		
	}else if(pNum == 6){
		//파도길
		$(".s_9").removeClass('active');
		if (!$(".s_10").hasClass('active')) {
			temp_cf_ajax("/use/gisAnal/getNowFlowInfo.do", null, getFlowData);	
			/*if (selectTime == null) {
				temp_cf_ajax("/use/gisAnal/getNowFlowInfo.do", null, getFlowData);
			} else {
				temp_cf_ajax("/use/gisAnal/getWeatherDateInfo.do", selectTime, getFlowData);
			}*/
		} else {
			var pFlow = Module.getFlow();
			pFlow.ClearFlowData();
		}
		
		
	}else if(pNum == 7){
		//날짜선택
		if ($(".wth_select").hasClass('hide')) {
			$('#wth_datepicker').datepicker({
				showOn: 'button',
				dateFormat: 'yy-mm-dd',
				minDate: new Date('2022-01-19'),
				maxDate: new Date(),
				prevText: '이전달',
				nextText: '다음달',
				monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
				monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
				dayNames: ['일', '월', '화', '수', '목', '금', '토'],
				dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
				dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
				showMonthAfterYear: true,
				yearFuffix: '년', 
				onSelect: function() {
			      $(this).change();
			    }
				}).on("change", function() {
				 selectWthInfo();
			});
			var today = new Date();

			var year = today.getFullYear(); // 년도
			var month = today.getMonth() + 1;  // 월
			if (month < 10) month = '0' + month;
			var date = today.getDate();  // 날짜
			$('#wth_datepicker').val(year + '-' + month + '-' + date);
			if (selectTime != null) {
				$('#wth_datepicker').val(selectTime.year + '-' + selectTime.month + '-' + selectTime.day);
			}
			selectDateCheck();
			$(".wth_select").removeClass('hide');
		} else {
			$(".wth_select").addClass('hide');
		}
	}
	
} 

var M_WEATHER_EFFECT = {
	api_map : null,

	/* 날씨 효과 옵션 */
	snow_render : false,
	snow_weight : 1,
	snow_speed : 1,

	rain_render : false,
	rain_weight : 1,
	rain_speed : 1,

	/* 안개, 미세먼지 효과 설정 */
	fog_render : 'off',	// off, mist, dust
	fog_startDist : 5.8,
	fog_gradientDist : 1705.2,
	fog_density : 0.7,

	init:function() {
		// API 호출 클래스 설정
		this.api_map = Module.getMap();

		this.initOptions();

		this.api_map.setFogLimitAltitude(6000000.0);
		this.api_map.setSnowfallDrawLevel(0);
		this.api_map.setSnowfallLevel(1);

		//$("#analysisWeatherAre").show("slide", { direction: "left" }, 200);
		//$("#analysisWeatherAre").show();
		
		this.initRainEffect();
		this.initSnowEffect();
		this.initSmogEffect();

		/*$("#closeWeatherBtn").on('click',function(e){

			var moduleId = $("#analysisWeatherAre").parents("[id*=navs-analy]")[0].id.split("navs-analy-")[1];

			IDE.MODULE.closeModule(moduleId);

		});
		$("#analysisWeatherAre.noScroll").mouseover(function() {
			Module.XDIsMouseOverDiv(true);
		})
		.mouseout(function() {
			Module.XDIsMouseOverDiv(false);
		});
		
		$("#rainAmoutSlider").ionRangeSlider({
			skin: "square",
			min: 1,
			max: 10,
			step:1,
			from: 1,
			onChange: function (data) {
				M_WEATHER_EFFECT.rain_weight = data.from;
				M_WEATHER_EFFECT.modifyRainWeight(0);
			},
		});
		$("#rainSpeedSlider").ionRangeSlider({
			skin: "square",
			min: 1,
			max: 10,
			step:1,
			from: 1,
			onChange: function (data) {
				M_WEATHER_EFFECT.rain_speed = data.from;
				M_WEATHER_EFFECT.modifyRainSpeed(0);
			},
		});
		$("#snowAmoutSlider").ionRangeSlider({
			skin: "square",
			min: 1,
			max: 10,
			step:1,
			from: 1,
			onChange: function (data) {
				M_WEATHER_EFFECT.snow_weight = data.from;
				M_WEATHER_EFFECT.modifySnowWeight(0);
			},
		});
		$("#snowSpeedSlider").ionRangeSlider({
			skin: "square",
			min: 1,
			max: 10,
			step:1,
			from: 1,
			onChange: function (data) {
				M_WEATHER_EFFECT.snow_speed = data.from;
				M_WEATHER_EFFECT.modifySnowSpeed(0);
			},
		});*/

	},
	initRainEffect:function(){
		/*$("#rainEffecCheck").on('click',function(e){
			var check = $(this).is(":checked");

			if(check){
				$("#snowEffect").prop("checked",false);
			}*/

			M_WEATHER_EFFECT.setRainPlay(false);
		//});

	},
	initSnowEffect:function(){
//		$("#snowEffect").on('click',function(e){
//
//			var check = $(this).is(":checked");
//
//			if(check){
//				$("#rainEffecCheck").prop("checked",false);
//			}

			M_WEATHER_EFFECT.setSnowPlay(false);
//		});



	},
	initSmogEffect:function(){

		/*M_WEATHER_EFFECT.setDisplayFog(false, "M");
		M_WEATHER_EFFECT.setDisplayFog(false, "D");
		M_WEATHER_EFFECT.setFogStartDistance(0);
		M_WEATHER_EFFECT.setFogGradationDistance(0);
		M_WEATHER_EFFECT.setFogDensity(0);*/
		/*
		$("#smogEffect").on('click',function(e){
			var radioVal = $("input[name=smogMode]:checked").val();

			var check = $(this).is(":checked");

			if(radioVal=="M"){
				M_WEATHER_EFFECT.setDisplayFog(check, radioVal);
			}else{
				M_WEATHER_EFFECT.setDisplayFog(check, radioVal);
			}

			if(check){
				$("#smogEffectRange").show();
			}else{
				$("#smogEffectRange").hide();
			}
		});

		$("input[name=smogMode]").on('click',function(e){
			var value = $(this).val();

			if(value=="D"){
				M_WEATHER_EFFECT.setDisplayFog(false, "M");
			}else{
				M_WEATHER_EFFECT.setDisplayFog(false, "D");
			}

			M_WEATHER_EFFECT.setDisplayFog(true, value);
		});

		$("#smogStartRange").change(function(e){
			var value=$(this).val();
			M_WEATHER_EFFECT.setFogStartDistance(parseFloat(value));
		});

		$("#smogGradient").change(function(e){
			var value=$(this).val();
			M_WEATHER_EFFECT.setFogGradationDistance(parseFloat(value));
		});

		$("#smogMount").change(function(e){
			var value=$(this).val();
			M_WEATHER_EFFECT.setFogDensity(parseFloat(value));
		});*/
	},
	destory:function() {

		this.setSnowPlay(false);
		this.api_map.setFogEnable(false);
	},

	initOptions : function() {

		this.snow_render = false;
		this.snow_weight = 3;
		this.snow_speed = 7;

		this.rain_render = false;
		this.rain_weight = 6;
		this.rain_speed = 8;

		this.fog_render = 'off';
		this.fog_startDist = 5.8;
		this.fog_gradientDist = 1005.2;
		this.fog_density = 0.6;
	},

	/* 눈 효과 설정 */
	setSnowPlay : function(_set) {
		Module.SetResourceServerAddr("/static_resources/gis/img");
		if (_set) {
			this.api_map.startWeather(0, this.snow_weight, this.snow_speed);
			this.api_map.setSnowfall(1);
		} else {
			this.api_map.stopWeather();
			this.api_map.setSnowfall(0);
			Module.SetResourceServerAddr("/static_resources/gis/img/");
		}

		this.snow_render = _set;
		this.rain_render = !_set;
	},

	modifySnowWeight : function(_value) {

		this.snow_weight += _value;
		if (this.snow_render) {
			this.api_map.startWeather(0, this.snow_weight, this.snow_speed);
		}
	},

	modifySnowSpeed : function(_value) {

		this.snow_speed += _value;
		if (this.snow_render) {
			this.api_map.startWeather(0, this.snow_weight, this.snow_speed);
		}
	},

	/* 비 효과 설정 */
	setRainPlay : function(_set) {
		Module.SetResourceServerAddr("/static_resources/gis/img");
		if (_set) {
			this.api_map.startWeather(1, this.rain_weight, this.rain_speed);
		} else {
			this.api_map.stopWeather();
			Module.SetResourceServerAddr("/static_resources/gis/img/");
		}
		this.api_map.setSnowfall(0);

		this.rain_render = _set;
		this.snow_render = !_set;
	},

	modifyRainWeight : function(_value) {
		
		this.rain_weight += _value;
		if (this.rain_render) {
			this.api_map.startWeather(1, this.rain_weight, this.rain_speed);
		}
	},

	modifyRainSpeed : function(_value) {

		this.rain_speed += _value;
		if (this.rain_render) {
			this.api_map.startWeather(1, this.rain_weight, this.rain_speed);
		}
	},

	/* 안개, 미세먼지 효과 설정 */
	setDisplayFog : function(_display, _fogType) {
		//Module.SetResourceServerAddr("/static_resources/gis/img");
		if (!_display) {
			//Module.SetResourceServerAddr("/static_resources/gis/img/");
			this.api_map.setFogEnable(false);
			this.fog_render = 'off';
			return;
		} else {
			this.api_map.setFogEnable(true);
			this.fog_render = _fogType;
			var color = null;
			if (_fogType == 'M') {
				color = new Module.JSColor(255, 255, 255, 255);
			} else {
				color = new Module.JSColor(255, 255, 255, 100);
			}

			this.api_map.setFog(color, this.fog_startDist, this.fog_startDist+this.fog_gradientDist, this.fog_density);
		}
		Module.XDRenderData();
	},

	setFogStartDistance : function(_value) {

		this.fog_startDist = _value;
		//document.getElementById("fogStartDistanceText").innerHTML = _value.toFixed(1).toString();
		//$("#fogStartDistanceText").text(_value.toFixed(1)+"(m)")
		this.setDisplayFog(true, this.fog_render);
	},

	setFogGradationDistance : function(_value) {

		this.fog_gradientDist = _value;
		console.log(_value);
		//document.getElementById("fogGradationDistanceText").innerHTML = _value.toFixed(1).toString();
		//$("#fogGradationDistanceText").text(_value.toFixed(1)+"(m)");
		this.setDisplayFog(true, this.fog_render);
	},

	setFogDensity : function(_value) {

		this.fog_density = _value;
		//document.getElementById("fogDensityText").innerHTML = _value.toFixed(1).toString();
		//$("#fogDensityText").text(_value.toFixed(1)+"(α)");
		this.setDisplayFog(true, this.fog_render);
	}
}

var wpoi1000 = [{"x":124.7777564,"y":36.96588021},
				{"x":124.4088327,"y":35.387235},
				{"x":125.570431,"y":32.84424911},
				{"x":128.7365778,"y":34.82256598},
				{"x":131.5630296,"y":37.0586849}];

var wpoi2000 = [{"x":125.3625946,"y":37.55752579},
				{"x":126.4505897,"y":37.13054698},
				{"x":125.483095,"y":36.62922615},
				{"x":126.8917022,"y":36.30062814},
				{"x":124.3905671,"y":35.61918241},
				{"x":126.6727087,"y":35.55623749},
				{"x":124.3108517,"y":34.32126302},
				{"x":126.747389,"y":34.32283745},
				{"x":127.5390585,"y":34.44828073},
				{"x":128.1870161,"y":34.68289925},
				{"x":128.4542802,"y":35.2968856},
				{"x":128.9935939,"y":35.03362213},
				{"x":129.7840881,"y":35.4054486},
				{"x":130.7332694,"y":36.33279311},
				{"x":129.2245789,"y":36.69542862},
				{"x":132.3848123,"y":37.95811626},
				{"x":128.4425349,"y":38.11583635},
				{"x":125.101268,"y":32.95978694},
				{"x":126.4020247,"y":31.85540294}];


var wpoi3000 = [{"x":124.6465907,"y":37.93242754},
				{"x":124.6717355,"y":37.80443019},
				{"x":125.7070204,"y":37.64521376},
				{"x":126.2164274,"y":37.24313814},
				{"x":126.5515398,"y":37.43454835},
				{"x":126.57267,"y":37.55714598},
				{"x":126.3537122,"y":37.68721426},
				{"x":126.4116879,"y":37.45972753},
				{"x":126.5791657,"y":37.3410502},
				{"x":126.6310265,"y":37.16083423},
				{"x":126.8075979,"y":36.9556476},
				{"x":126.6009698,"y":37.03727855},
				{"x":126.4008782,"y":37.03064077},
				{"x":126.2756092,"y":36.89091233},
				{"x":126.0965302,"y":36.75254971},
				{"x":126.1471501,"y":36.6722444},
				{"x":126.3072587,"y":36.54195865},
				{"x":126.4506058,"y":36.53786685},
				{"x":126.4677554,"y":36.43492943},
				{"x":126.0337869,"y":36.22480974},
				{"x":125.975971,"y":36.09600694},
				{"x":126.3948413,"y":36.29936491},
				{"x":126.5250628,"y":36.12715989},
				{"x":126.4484822,"y":35.99644817},
				{"x":126.6078328,"y":36.03888931},
				{"x":126.4086533,"y":35.81798768},
				{"x":126.2078691,"y":35.58391551},
				{"x":126.1478754,"y":35.2911582},
				{"x":126.1273243,"y":35.05966097},
				{"x":126.0800347,"y":34.86896158},
				{"x":126.0125272,"y":34.65085321},
				{"x":126.0082035,"y":34.33452318},
				{"x":126.404054,"y":34.32775611},
				{"x":126.5523338,"y":34.10302601},
				{"x":126.3885751,"y":33.87259731},
				{"x":126.9197393,"y":34.12029532},
				{"x":126.966884,"y":34.33889024},
				{"x":127.0243874,"y":34.50098918},
				{"x":127.2106557,"y":34.50512795},
				{"x":127.4558078,"y":34.58284768},
				{"x":127.7063238,"y":34.69327255},
				{"x":127.7816042,"y":34.52309874},
				{"x":127.7368248,"y":34.88718368},
				{"x":127.9513394,"y":34.94048217},
				{"x":128.0954178,"y":34.88359818},
				{"x":128.3459283,"y":34.7481239},
				{"x":128.2843663,"y":34.89310026},
				{"x":128.4162005,"y":35.05070227},
				{"x":128.4725977,"y":35.0027982},
				{"x":128.5703531,"y":35.09665215},
				{"x":128.7010392,"y":35.0948567},
				{"x":128.6153047,"y":34.96627576},
				{"x":128.5863142,"y":34.73956751},
				{"x":128.7087637,"y":34.81418861},
				{"x":128.8175617,"y":35.03680744},
				{"x":128.9061103,"y":35.03238685},
				{"x":128.9686422,"y":35.01729598},
				{"x":129.0158901,"y":35.02975557},
				{"x":129.0488029,"y":35.05646783},
				{"x":129.0996672,"y":35.07231232},
				{"x":129.1505483,"y":35.1167186},
				{"x":129.2212688,"y":35.15136354},
				{"x":129.2968712,"y":35.25229625},
				{"x":129.3861739,"y":35.39118501},
				{"x":129.383571,"y":35.50658303},
				{"x":129.4600257,"y":35.50474208},
				{"x":129.4844947,"y":35.61725692},
				{"x":129.5252198,"y":35.74570457},
				{"x":129.5801805,"y":35.93475897},
				{"x":129.5437704,"y":36.05769302},
				{"x":129.4328179,"y":36.0487907},
				{"x":129.4234083,"y":36.17153583},
				{"x":129.4302777,"y":36.36556163},
				{"x":129.4647437,"y":36.53846389},
				{"x":129.4703279,"y":36.7324348},
				{"x":129.4421244,"y":37.00677428},
				{"x":129.3777448,"y":37.21596189},
				{"x":129.2699876,"y":37.38880419},
				{"x":129.1254051,"y":37.58701827},
				{"x":128.9624688,"y":37.79375905},
				{"x":128.8183662,"y":37.95303852},
				{"x":128.6895194,"y":38.11501755},
				{"x":128.617918,"y":38.24621135},
				{"x":128.4990189,"y":38.44828419},
				{"x":126.5861274,"y":36.00583701},
				{"x":126.4402462,"y":35.62806179},
				{"x":126.4259143,"y":35.49535639},
				{"x":125.3861394,"y":34.68046339},
				{"x":125.1203411,"y":34.06730234},
				{"x":126.2587055,"y":33.18120031},
				{"x":126.2224727,"y":33.41498208},
				{"x":126.6610475,"y":33.56197918},
				{"x":126.9099059,"y":33.38800902}];
//				{"x":126.5846598,"y":33.2069252},
//				{"x":127.3285308,"y":34.03555373},
//				{"x":130.8667572,"y":37.51982374}];

var w1000Map = new Array(); //날씨 json 을 map으로 변경해서 담는 배열
var w2000Map = new Array(); //날씨 json 을 map으로 변경해서 담는 배열
var w3000Map = new Array(); //날씨 json 을 map으로 변경해서 담는 배열
//날씨에 따라 아이콘 생성에서 지도에표출
function makeWeatherIcon(flag){
	/*if(WICO_INIT == false){
		initWeatherPoi();
		WICO_INIT = true;
	}*/
	let thisLayer = trueLayerList.createLayer("WeatherIco", Module.ELT_3DPOINT);
	if(flag){
		if(w1000Map.length < 4){
			wpoi1000.forEach(function(data, idx){		//경찰철 구역 날씨 
				var position = new Module.JSVector3D(data.x, data.y, 1000);
				var infoMap = parseWeatherInfo(w1000, idx); //retrun 기상정보 맵
				w1000Map.push(infoMap);
				//_vPosition, _iconName, text, objId,_minRange, _maxRange
				makeWeatherPoi(position, infoMap.get("icon"), infoMap.get("msg"), "wpoi1000_" +idx,800000, 50000000);				
			});
			wpoi2000.forEach(function(data, idx){		//경찰서 구역 날씨
				var position = new Module.JSVector3D(data.x, data.y, 1000);
				var infoMap = parseWeatherInfo(w2000, idx); //retrun [아이콘이름, 텍스트]
				w2000Map.push(infoMap);
				makeWeatherPoi(position, infoMap.get("icon"), infoMap.get("msg"), "wpoi2000_" +idx,100, 800000);
			});
			wpoi3000.forEach(function(data, idx){		//파출소 구역 날씨
				var position = new Module.JSVector3D(data.x, data.y, 1000);
				var infoMap = parseWeatherInfo(w3000, idx); //retrun [아이콘이름, 텍스트]
				w3000Map.push(infoMap);
				makeWeatherPoi(position, infoMap.get("icon"), infoMap.get("msg"), "wpoi3000_" +idx,100, 350000);
			});
		}else{
			thisLayer.setVisible(true);
		}
		//기상 아이콘에 객체선택 이벤트 추가하기
		Module.XDSetMouseState(6);
	}else{
		Module.XDSetMouseState(1);
		
		thisLayer.setVisible(false);
	}
	
}

//poi초기화 //날씨 아이콘 등록
function initWeatherPoi(){
	
	let thisLayer = trueLayerList.createLayer("WeatherIco", Module.ELT_3DPOINT);
		thisLayer.setMaxDistance(2000000.0);
	
	Symbol = Module.getSymbol();
	
	// POI Icon 생성 - 검색탭에서 사용되는 아이콘
	var searchImageURLList = [
		"/static_resources/gis/img/weather/DB01_B.png",
		"/static_resources/gis/img/weather/DB02_B.png",
		"/static_resources/gis/img/weather/DB03_B.png",
		"/static_resources/gis/img/weather/DB04_B.png",
		"/static_resources/gis/img/weather/DB05_B.png",
		"/static_resources/gis/img/weather/DB06_B.png",
		"/static_resources/gis/img/weather/DB07_B.png",
		"/static_resources/gis/img/weather/DB08_B.png"];
	for (var i=0, len=searchImageURLList.length; i<len; i+=1) {
		createIcon(searchImageURLList[i], "wIcon"+i);
	}
	Module.XDRenderData();
}
//날씨 아이콘 지도 표출
function makeWeatherPoi(_vPosition, _iconName, text, objId,_minRange, _maxRange) {
	
	if(trueLayerList.nameAtLayer("WeatherIco") != null){
		
		var thisLayer = trueLayerList.nameAtLayer("WeatherIco");
			thisLayer.setVisible(true);
		
		// Symbol에서 iconName으로 Icon 객체 반환
		var icon = Symbol.getIcon(_iconName);
		
		if (icon == null) {
			return;
		}
		
		// JSPoint 객체 생성
		var poi = Module.createPoint(objId);
			poi.setVisibleRange(true, _minRange, _maxRange);
			poi.setPosition(_vPosition);	// 위치 설정
			poi.setIcon(icon);	// 아이콘 설정
			poi.setText(text);	// 아이콘 텍스트
		
		// poi레이어에 오브젝트 추가
			thisLayer.addObject(poi, 0);
			
	}
}
//날씨 정보에 따라 아이콘 생성해서 map에 추가
function parseWeatherInfo(_data, _idx){
	var stIndex = (_idx * 11)+(_idx*1); 
	var edIndex = stIndex+11;
	var dataMap = new Map();
	var thisData = _data.item;
	for(var i = stIndex; i <= edIndex; i++){
		dataMap.set(thisData[i].category, thisData[i].fcstValue);
	}
	var skyNum  = parseInt(dataMap.get('SKY')); 	//하늘상태
	var rainNum = parseFloat(dataMap.get('POP'));	//강수확률
	var rainCde = parseInt(dataMap.get('PTY'));		//강수종류 
	var waveVal = parseFloat(dataMap.get('WAV'));		//강수종류

	dataMap.set('icon', 'wIcon0'); //기본 맑음 지정
	//하늘 상태로 날씨 아이콘
	if(skyNum == 1 ){	 		//맑음
		dataMap.set('icon', 'wIcon0');
		dataMap.set('msg', '맑음, 파고 '+waveVal+"m");
	}else if(skyNum == 3 ){		//구름 많음
		dataMap.set('icon', 'wIcon2');
		dataMap.set('msg', '구름많음, 파고 '+waveVal+"m");
	}else if(skyNum == 4 ){		//흐림
		dataMap.set('icon', 'wIcon3');
		dataMap.set('msg', '흐림, 파고 '+waveVal+"m");
	}
	//강수량 상태로 날씨 아이콘
	if(rainNum > 50){ //강수확률 50% 이상
		if(rainCde == 1){		//비
			dataMap.set('icon', 'wIcon4');
			dataMap.set('msg', '비 내림, 파고 '+waveVal+"m");
		}else if(rainCde == 2){	//눈비
			dataMap.set('icon', 'wIcon5');
			dataMap.set('msg', '눈/비 내림, 파고 '+waveVal+"m");
		}else if(rainCde == 3){ //눈
			dataMap.set('icon', 'wIcon7');
			dataMap.set('msg', '눈 내림, 파고 '+waveVal+"m");
		}else if(rainCde == 3){ //소나기
			dataMap.set('icon', 'wIcon4');
			dataMap.set('msg', '소나기, 파고 '+waveVal+"m");
		}
	}
	return dataMap;
}

//날씨 아이콘 클릭이벤트 헨들러
function weatherIcoEvtHd(evt){
	var layer = "";
	if(trueLayerList.nameAtLayer("WeatherInfoPop") != null){		
		layer = trueLayerList.nameAtLayer("WeatherInfoPop");
		layer.removeAll();
	}else{
		// 말풍선 팝업 레이어 추가
		layer = trueLayerList.createLayer("WeatherInfoPop", 5);
	}

	layer.setMaxDistance(1000000);
	layer.setMinDistance(100);
	var objId = evt.objKey.split('_');
	
	$('#weatherInfo').removeClass('hide');
	//상세정보 불러오기
	setWeatherDetailInfo(objId[1])
	
	/*var val = evt.objKey.split('_')[0];
	var idx = Number(evt.objKey.split('_')[1]);
	var lon = 0;
	var lat = 0;
	var cam = Module.getViewCamera();
	var nowAlt = cam.getAltitude();
	var yVal = nowAlt/2200000;
	var MaxVal = nowAlt;  //최대가시범위
	var MinVal = nowAlt;	//최소가시범위
	$('#weatherInfo').removeClass('hide');
	setWeatherDetail(val, idx);	//상세정보 불러오기
	if(val.indexOf('wpoi1000') != -1){
		lon=wpoi1000[idx].x;
		lat=wpoi1000[idx].y-yVal;
		MaxVal = MaxVal + 100000;
		MinVal = nowAlt - 100000;
//			lon=wpoi1000[idx].x+1;
//			lat=wpoi1000[idx].y-0.3;
		
	}else if(val.indexOf('wpoi2000') != -1){
		lon=wpoi2000[idx].x;
		lat=wpoi2000[idx].y-yVal;
		MaxVal = MaxVal + 10000;
		MinVal = nowAlt - 10000;
//			lon=wpoi2000[idx].x+0.2;
//			lat=wpoi2000[idx].y-0.1;
		layer.setMaxDistance(800000.0);
		layer.setMinDistance(100.0);			
	}else if(val.indexOf('wpoi3000') != -1){
//			lon=wpoi3000[idx].x+0.15;
//			lat=wpoi3000[idx].y-0.08;
		lon=wpoi3000[idx].x;
		lat=wpoi3000[idx].y-yVal;
		MaxVal = MaxVal + 5000;
		MinVal = nowAlt - 3000;
		layer.setMaxDistance(350000.0);
		layer.setMinDistance(100.0);
	}
	layer.setMaxDistance(MaxVal);
	layer.setMinDistance(MinVal);
	drawWeatherInfoPop(lon,lat); //팝업
*/
}

//상세정보 불러오기
function setWeatherDetailInfo(objId){
	
	objId.indexOf("#") != -1 ? objId = objId.split("#")[0] : objId = objId
	if(selectTime == null){
	var params= {
		objId : objId,
		st : "check"
		}	
	}else{
	var params= {
		objId : objId,
		st : selectTime.dt
	};
	}
	temp_cf_ajax( "/use/gisAnal/getWeatherDetailInfo.do", params, _getWeatherDetailInfo);
	function _getWeatherDetailInfo(data){
		var result = data.data[0];
		
		temp_cf_loadingbarHide();

		$('#wdIco').removeClass();
		$('#wdIco').addClass('icon');
		$('#wdIco').addClass('weather_0'+result.pred_wf_num); //날씨 아이콘
		
		$('#wdSky').text(result.pred_wf);			 //날씨 텍스트
		
		let wav = ((parseFloat(result.cd_wh1)+parseFloat(result.cd_wh2))/2).toFixed(2)
		let uuu = (parseFloat(result.cd_ws1)+parseFloat(result.cd_ws2))/2
		
		$('#wdWav').text('파고 : '+wav+"m");//파고
		$('#wdUuu').text('풍속 : '+uuu+"m/s");//풍속
		$('#wdVec').text('풍향 : '+windDirection(result.cd_wd1)+"˚");	 	//풍향
		
		var coord =  proj4(e5174, wgs84, [ parseFloat(result.coord_x), parseFloat(result.coord_y)]);
		
		//기상 아이콘 클릭시 말풍선 그리기
		var cam = Module.getViewCamera();
		var nowAlt = cam.getAltitude();
		
		var yVal = nowAlt/2200000;
		drawWeatherInfoPop(coord[0],coord[1]-yVal)
		
	}
}

// 풍향 반환
function windDirection(wd){
	
	let windDirection;
	
	switch(wd){ //바람 방향을 각도로 환산
		case "E" : //동
			windDirection = 270;
			break;
		case "W" : //서
			windDirection = 90;				
			break;
		case "S" : //남
			windDirection = 0;				
			break;
		case "N" : //북
			windDirection = 180;
			break;
		case "NE" : //북동
			windDirection = 225;								
			break;
		case "NW" : //북서
			windDirection = 135;								
			break;			
		case "SE" : //남동
			windDirection = 315;
			break;
		case "SW" : //남서				
			windDirection = 45;
			break;				
	}
	
	return windDirection;
}

//기상 아이콘 클릭시 말풍선 그리기
function drawWeatherInfoPop(_lon,_lat){
	//console.log(_lon,_lat)

	var wd = $('#weatherInfo').width()+20; //팝업창 사이즈 구하기
	var hi = $('#weatherInfo').height()+25;
	
	// 말풍선 그리기
	html2canvas(document.getElementById("weatherInfo"), {
		backgroundColor: null
	}).then(function(canvas) {
		
		var imgData = canvas.getContext('2d').getImageData(0, 0, wd, hi); 
		const mycanvas = document.createElement('canvas');
		const ctx = mycanvas.getContext('2d');
		ctx.putImageData(imgData, 500, 500);
		
		Module.getAddObject().Add3DPoint( "WeatherInfoPop", 'areaOne', parseFloat(_lon), parseFloat(_lat), parseFloat(1000), imgData.data, imgData.width, imgData.height, '' );//신규 말풍선 생성
		Module.getMap().clearInputPoint();
	
	});
}
//기상 상세정보 가져오기
function setWeatherDetail(_kind,_idx){

	var thisArr = w1000Map; //데이터 배열 종류 선택
	if(_kind == "wpoi1000"){
		thisArr = w1000Map;
	}else if(_kind == "wpoi2000"){
		thisArr = w2000Map;
	}else if(_kind == "wpoi3000"){
		thisArr = w3000Map;
	}
	var thisMap = thisArr[_idx]; 	//배열에서 해당 날씨 정보 취득
	var ICO = thisMap.get("icon");	//최고온도
	var MSG = (thisMap.get("msg")).split(',')[0];	//최고온도
	var TMP = thisMap.get("TMP"); 	//최고온도
	var WAV = thisMap.get("WAV"); 	//파고
	var VEC = thisMap.get("VEC"); 	//풍향
	var WSD = thisMap.get("WSD");	//풍속
	var REH = thisMap.get("REH"); 	//습도
	var PCP = thisMap.get("PCP");	 //강수량
		ICO = ICO.replace('wIcon','');	//아이콘값 번호로 변경
	$('#wdIco').removeClass();
	$('#wdIco').addClass('icon');
	$('#wdIco').addClass('weather_0'+ICO); //날씨 아이콘
	$('#wdSky').text(MSG);			 //날씨 텍스트
	if(PCP=='강수없음')$('#wdPcp').text(PCP);			//강수
	else $('#wdPcp').text('강수 : '+PCP);			//강수
	$('#wdTmp').text(TMP+"℃");		 //온도
	$('#wdWav').text('파고 : '+WAV+"m");//파고
	$('#wdVec').text('풍향 : '+VEC+"˚");	 	//풍향
	$('#wdUuu').text('풍속 : '+WSD+"m/s");//풍속
};
//파도
function getFlowData(data){
	
	temp_cf_loadingbarHide();
	var data = data.flowData;	
	var count = 0;
	var pFlow = Module.getFlow();
		$.each(data, function (idx, item) {			

		if(item.landflag == "0"){
			count++;
		}
			pFlow.AddFlowData(parseFloat(item.cy),parseFloat(item.cx),parseFloat(item.current_speed),parseFloat(item.current_dir));//위도, 경도, 풍속, 풍향						
		
		})
		pFlow.SetFlowColor( 51, 135,  255, 51, 135,  255 );
		pFlow.CreateFlowData(0.0005,1,1000);// 풍속 계수, 바람 표현 고도, 바람 표시 개수(바람장 파티클 수)
		
	if(count == 0){
		temp_cf_loadingbarShow2("해당일자의 파도 데이터가 존재하지 않습니다.")
		$(".s_10").removeClass('active');
		
		setTimeout(temp_cf_loadingbarHide, 2000);
		
		return;
	}
}
//바람
function getWindData(data){

	temp_cf_loadingbarHide();
	var data = data.windData;
	var count = 0;	
	var pFlow = Module.getFlow();
		$.each(data, function (idx, item) {		
		
		if(item.landflag == 'Y'){	
			count++;
			pFlow.AddFlowData(parseFloat(item.cy),parseFloat(item.cx),parseInt(item.cd_ws2),parseInt(windDirection(item.cd_wd1)));//위도, 경도, 풍속, 풍향					
		}
	
		})
		pFlow.SetFlowColor(255, 255,  255, 255, 255,  255 );
		pFlow.CreateFlowData(0.001,1,300);// 풍속 계수, 바람 표현 고도, 바람 표시 개수(바람장 파티클 수)					
	if(count == 0){
		temp_cf_loadingbarShow2("해당일자의 바람 데이터가 존재하지 않습니다.")
		$(".s_9").removeClass('active');
		setTimeout(temp_cf_loadingbarHide, 2000);
		return;
	}
}

// 기상정보 가져오기
function _getWthInfo(data){
	temp_cf_loadingbarHide();
	if(data.data3.length == 0 || data.data2.length == 0 || data.data1.length == 0){
		temp_cf_loadingbarShow2("해당일자의 기상 데이터가 존재하지 않습니다.")		
		$(".s_8").removeClass('active');
		setTimeout(temp_cf_loadingbarHide, 2000);
		return;
	}
	

	var result3 = data.data3
	var result2 = data.data2
	var result1 = data.data1

	
	$.each(result1, function (key, val) {		
		// 날씨코드, 날씨, 파고아래범위, 파고위범위
		var infoMap = setWthInfoIcon(val.pred_wf_cd,val.pred_wf, val.cd_wh1, val.cd_wh2) //retrun 기상정보 맵
		
		// 좌표변환
		var coord =  proj4(e5174, wgs84, [ parseFloat(val.coord_x), parseFloat(val.coord_y)]);
		var position = new Module.JSVector3D(coord[0], coord[1], 1000);
		
		makeWeatherPoi(position, infoMap.get("icon"), infoMap.get("msg"), "wth_"+val.ogc_fid ,800000, 50000000);
		
	})
	
	$.each(result2, function (key, val) {		
		// 날씨코드, 날씨, 파고아래범위, 파고위범위
		var infoMap = setWthInfoIcon(val.pred_wf_cd,val.pred_wf, val.cd_wh1, val.cd_wh2) //retrun 기상정보 맵
		
		// 좌표변환
		var coord =  proj4(e5174, wgs84, [ parseFloat(val.coord_x), parseFloat(val.coord_y)]);
		var position = new Module.JSVector3D(coord[0], coord[1], 1000);
		
		makeWeatherPoi(position, infoMap.get("icon"), infoMap.get("msg"), "wth_"+val.ogc_fid ,100, 800000);
		
		
	})
	
	$.each(result3, function (key, val) {		
		// 날씨코드, 날씨, 파고아래범위, 파고위범위
		var infoMap = setWthInfoIcon(val.pred_wf_cd,val.pred_wf, val.cd_wh1, val.cd_wh2) //retrun 기상정보 맵
		
		// 좌표변환
		var coord =  proj4(e5174, wgs84, [ parseFloat(val.coord_x), parseFloat(val.coord_y)]);
		var position = new Module.JSVector3D(coord[0], coord[1], 1000);
		
		makeWeatherPoi(position, infoMap.get("icon"), infoMap.get("msg"), "wth_"+val.ogc_fid ,100, 350000);
		
	})
	
	//기상 아이콘에 객체선택 이벤트 추가하기
	Module.XDSetMouseState(6);	
}

// 날씨 코드 및 명칭으로 날씨 아이콘 표출 
function setWthInfoIcon(wthCd,wth, wav1, wav2){
	
	var dataMap = new Map();
	var wavavg = ((parseFloat(wav1)+parseFloat(wav2))/2).toFixed(2)
	
	
	if(wthCd == "DB04"){
		if(wth == "흐리고 가끔 비/눈"){
			dataMap.set('icon', 'wIcon6');
			dataMap.set('msg', wth+", 파고 "+wavavg+"m")
		}else if(wth == "흐림"){
			dataMap.set('icon', 'wIcon3');
		  	dataMap.set('msg', wth+", 파고 "+wavavg+"m");
		}else if(wth == "흐리고 가끔 눈" || wth == "흐리고 한때 눈"){
			dataMap.set('icon', 'wIcon7');
		  	dataMap.set('msg', wth+", 파고 "+wavavg+"m");
		}else{
			dataMap.set('icon', 'wIcon4');
			dataMap.set('msg', wth+", 파고 "+wavavg+"m");
		}
		
	}else if(wthCd == "DB03"){
		
		if(wth == "구름많고 한때 비/눈"){
			dataMap.set('icon', 'wIcon6');
			dataMap.set('msg', wth+", 파고 "+wavavg+"m")
		}else if(wth == "구름많음"){
			dataMap.set('icon', 'wIcon2');
		  	dataMap.set('msg', wth+", 파고 "+wavavg+"m");
		}else{
			dataMap.set('icon', 'wIcon4');
			dataMap.set('msg', wth+", 파고 "+wavavg+"m");
		}
			
	}else if(wthCd == "DB02"){
		dataMap.set('icon', 'wIcon1');
	  	dataMap.set('msg', '구름조금, 파고'+wavavg+"m");
	}else{
		dataMap.set('icon', 'wIcon0');
	  	dataMap.set('msg', '맑음, 파고 '+wavavg+"m");
	
	}
	
	return dataMap;
	
}
//선택된 날짜 기상조회
function selectWthInfo(){
	
	/*if($("#wth_year option:selected").val() == "default"|| $("#wth_month option:selected").val() == "default" || $("#wth_day option:selected").val() == "default"){
		alert("날짜와 시간을 선택해 주세요");
		return;
	}*/
	if ($('#wth_time option:selected').val() == "시간") {
		return;
	}
	if ($('#wth_datepicker').val() == "") {
		temp_cf_loadingbarShow2("날짜와 시간을 선택해 주세요");
		setTimeout(temp_cf_loadingbarHide, 500);
		return;
	}

	Module.XDSetMouseState(1);
	if (trueLayerList.nameAtLayer("WeatherIco") != null) {
		trueLayerList.nameAtLayer("WeatherIco").removeAll();
	}

	if (trueLayerList.nameAtLayer("WeatherInfoPop") != null) {
		trueLayerList.nameAtLayer("WeatherInfoPop").removeAll();
	}
	var pFlow = Module.getFlow();
	pFlow.ClearFlowData();
	/*var year = $("#wth_year option:selected").val();
	var month = $("#wth_month option:selected").val();
	var day = $("#wth_day option:selected").val();*/

	var year = $('#wth_datepicker').val().split('-')[0];
	var month = $('#wth_datepicker').val().split('-')[1];
	var day = $('#wth_datepicker').val().split('-')[2];
	var selTime = $("#wth_time option:selected").val();	
	if(selTime == "오전") { time = "0500";}
	else if(selTime == "오후"){ time = "1700";}
	var dt = year + month + day + time
	var date = year + "-" + month + "-" + day + " " + $("#wth_time option:selected").val().slice(0, -1) + ":" + "00";
	selectTime = { dt: dt, date: date, year: year, month: month, day: day };
	if ($(".s_8").hasClass('active') === true) {
		temp_cf_ajax("/use/gisAnal/getWeatherDateInfo.do", selectTime, _getWthInfo);
	}
	if ($(".s_9").hasClass('active') === true) {
		temp_cf_ajax("/use/gisAnal/getWeatherDateInfo.do", selectTime, getWindData);
	}
	if ($(".s_10").hasClass('active') === true) {
		temp_cf_ajax("/use/gisAnal/getWeatherDateInfo.do", null, getFlowData);
	}

}

// 현재 년월일 지정, 년월일 select 지정
function selectDateCheck(){
	
	var nowDate = new Date(),
		nowYear = nowDate.getFullYear(),
		nowMonth = nowDate.getMonth() + 1,
		nowDay = nowDate.getDay(),
		_wrap = document.querySelectorAll('.ui-check-date'),
		_select = document.querySelectorAll('.ui-check-date select'),
		_year = document.querySelectorAll('.ui-check-date select[data-unit=y]'),
		_month = document.querySelectorAll('.ui-check-date select[data-unit=m]'),
		_day = document.querySelectorAll('.ui-check-date select[data-unit=d]'),
		yearTerm = 100;	// default 년도 기간 설정

	// 초기 년도 설정
	// (1) data-tearm : 년도 기간 설정
	// (2) data-point : 년도 시점 설정
	for(var i=0; i < _wrap.length; i++){
		var startYear,
			endYear,
			setTerm = _wrap[i].getAttribute('data-term') *1,
			setPoint = _wrap[i].getAttribute('data-point'),
			num = 0;
			
		_year[i].options[0] = new Option(_year[i].getAttribute('data-default-option'), 'default');	// 'default' || ''
		
		// data-term 속성값이 있을 경우 기간 적용
		if(setTerm != null && setTerm != ''){ yearTerm = setTerm; }
		
		// 년도 option 설정
		if(setPoint =='up'){
			// 미래~현재
			startYear = nowYear + yearTerm;
			endYear = nowYear;
		}else if(setPoint =='down' || setPoint =='' || setPoint == null) {
			// 현재~과거
			startYear = nowYear;
			endYear = nowYear - yearTerm;
		}else{
			// up, down, null 이외의 값 지정
		}
		
		for(var j=startYear; j>=endYear; j--){
			num++;
			_year[i].options[num] = new Option(j, j);
		}
	}
		
	// 초기 월 설정
	for(var i=0; i<_wrap.length; i++){
		_month[i].options[0] = new Option(_month[i].getAttribute('data-default-option'), 'default');
		for(var j=1; j<=12; j++){
			_month[i].options[j] = new Option(('00'+String(j)).slice(-2), ('00'+String(j)).slice(-2));
		}
	}
	
	// 초기 일 절정
	for(var i=0; i<_wrap.length; i++){
		_day[i].options[0] = new Option(_day[i].getAttribute('data-default-option'), 'default');
		for(var j=1; j<=31; j++){
			_day[i].options[j] = new Option(('00'+String(j)).slice(-2), ('00'+String(j)).slice(-2));
		}
	}
	
	// 년 선택 시, 일 설정 함수 실행
	for(var i=0; i<_wrap.length; i++){
		_year[i].addEventListener('change', selectSetDay, false);
	}
	
	// 월 선택 시, 일 설정 함수 실행
	for(var i=0; i<_wrap.length; i++){
		_month[i].addEventListener('change', selectSetDay, false);
	}
	

		
	var option = $("<option>"+"오전"+"</option>"+"<option>"+"오후"+"</option>");
	$("#wth_time").append(option);		

	// 일 설정 함수
	function selectSetDay(){
		// 평년 각 달의 일수 배열
		// 선택한 select 그룹의 년월일 option value
		var arrDay=[31,28,31,30,31,30,31,31,30,31,30,31],
			lastDay,
			wrap = this.parentNode,
			yearVal = wrap.querySelector('select[data-unit=y]').value,
			monthVal = wrap.querySelector('select[data-unit=m]').value,
			selectedDay = wrap.querySelector('select[data-unit=d]'),
			dayVal = selectedDay.value,
			defaultTxt = selectedDay.getAttribute('data-default-option'),
			defaultVal = 'default';	// 'default' || ''
			
		// 윤달체크 (true : 2월 마지막날 29일)
		if(yearVal%4 == 0 && yearVal%100 !=0 || yearVal%400 == 0){ arrDay[1]=29; }
		// 선택한 달의 일수 설정
		lastDay = (monthVal != defaultVal) ? arrDay[monthVal-1] : 31;
		
		// 일 option 재설정
		selectedDay.options.length = 0;	// option 목록 초기화
		selectedDay.options[0] = new Option(defaultTxt, defaultVal);
		for(var i=1; i<=lastDay; i++){
			selectedDay.options[i] = new Option(('00'+String(i)).slice(-2), ('00'+String(i)).slice(-2));
		}
		
		// 선택한 날과 그 달의 마지막 날 비교
		// 선택한 날이 default가 아니고 마지막 날 보다 크면 : 마지막 날짜로 선택 일 변경
		// 아니면 : 선택한 날 그대로 가져감
		selectedDay.value = (dayVal != defaultVal && dayVal > lastDay) ? lastDay : dayVal;
	}
	
}

