//영역
var SEARCHAREA=window.opener.SEARCHAREADATA.LINESTRING;

//영역검색 년도별 사고건수 차트
//lineData = 영역, type = 선박(SHIP) or 연안(SPOT) 
function searchAreaYear(type) {

	if(type=='SHIP'){
		$('#chart_title').text('선박사고 통계');
	}else if(type=='SPOT'){
		$('#chart_title').text('연안사고 통계');
	}
	$('#search_contents_info').addClass('hide');
	$('#search_contents_chart').removeClass('hide');
	
	$('#chart_year_div').empty();
	$('#chart_year_div').append('<p class="chart_p">년도별 통계</p>');
	$('#chart_year_div').append('<canvas id="chartYEAR" style="width:100%; height:130px;"></canvas>');
	
	//사고건수가 있는 년도만 담을 배열
	var yeatWithData = [];
	var param = {
		"polygon_linestring" : SEARCHAREA
	}
	//영역에 대한 사고 정보 가져오기
	temp_cf_ajax("/use/gisAnal/getSearchArea" + type + ".do", param, datae);
	function datae(data) {
		data = data.cnt;
		//년도별 사고건수
		var yeatCnt = [];
		for (i = 0; i < data.length; i++) {
			yeatWithData.push(data[i].yyyy);
			yeatCnt.push(data[i].count)
		}
		//<canvas id="chartYEAR" >에 담기
		var chart = document.getElementById('chartYEAR').getContext('2d');
		
		//차트에 담길 데이터
		var data = {
			labels : yeatWithData,
			datasets : [ {
				label : '사고건수',
				backgroundColor : colorList,
				pointBackgroundColor : 'white',
				borderWidth : 1,
				borderColor : colorList,
				data : yeatCnt
			} ]
		};

		var options = {
			responsive : true,
			maintainAspectRatio : true,
			animation : {
				easing : 'easeInOutQuad',
				duration : 520
			},
			elements : {
				line : {
					tension : 0.4
				}
			},
			 plugins: {
                 legend: {
                     display: false
                 },
             },
			point : {
				backgroundColor : 'white'
			},
			tooltips : {
				titleFontFamily : 'Open Sans',
				backgroundColor : 'rgba(0,0,0,0.3)',
				titleFontColor : 'red',
				caretSize : 5,
				cornerRadius : 2,
				xPadding : 10,
				yPadding : 10
			}
		};

		//차트 추가
		var chartInstance = new Chart(chart, {
			type : 'bar',
			data : data,
			options : options
		});
		//사고년도별 월별 차트
		searchArearMonth(type, yeatWithData);
	}
}

//사고년도별 월별 차트
//lineData = 영역, type = 선박(SHIP) or 연안(SPOT),yearWithData = 사고가 있는 년도
function searchArearMonth(type, yeatWithData) {

	$('#chart_month_div').empty();
	$('#chart_month_div').append('<p class="chart_p">월별 통계</p>');
	$('#chart_month_div').append('<canvas id="chartMONTH" style="width:100%; height:200px;"></canvas>');
	
	console.log('searchArearMonth '+type);
	console.log('searchArearMonth '+yeatWithData);
	
	//<canvas id="chartMONTH" >에 담기
	var chartMONTH = document.getElementById('chartMONTH').getContext('2d');
	
	//미리 데이터셋을 생성 하나씩 추가
	var data = {
		labels : [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월",
				"11월", "12월" ],
		datasets : []
	};

	var options = {
		responsive : true,
		maintainAspectRatio : true,
		animation : {
			easing : 'easeInOutQuad',
			duration : 520
		},
		elements : {
			line : {
				tension : 0.4
			}
		},
		legend : {
			display : false
		},
		point : {
			backgroundColor : 'white'
		},
		tooltips : {
			titleFontFamily : 'Open Sans',
			backgroundColor : 'rgba(0,0,0,0.3)',
			titleFontColor : 'red',
			caretSize : 5,
			cornerRadius : 2,
			xPadding : 10,
			yPadding : 10
		}
	};
	
	//차트 추가
	var chartInstance = new Chart(chartMONTH, {
		type : 'bar',
		data : data,
		options : options
	});

	//년도 월별 사고건수 가져오기
		var param = {
			"polygon_linestring" : SEARCHAREA,
			"year" : yeatWithData
		}
		//년도별 월사고데이터 가져오기
		temp_cf_ajax("/use/gisAnal/getSearchAreaMonth" + type + ".do", param, datae);

		function datae(datam) {
			for (i = 0; i < yeatWithData.length; i++) {
				var years = yeatWithData[i];
				var datas = datam[yeatWithData[i]];
				var dataCnt = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
					for (j = 0; j < datas.length; j++) {
						var datamm = parseInt(datas[j].mm);
						dataCnt[datamm-1] = datas[j].count;
					}
					
				chartInstance.data.datasets.push({
					label : years,
					backgroundColor : colorList[i],
					pointBackgroundColor : 'white',
					borderWidth : 1,
					borderColor : colorList[i],
					data : dataCnt
				});
				//데이터셋 업데이트 
				chartInstance.update();
			}
		}
		temp_cf_loadingbarHide();
}

var colorList=['rgba(91, 103,119, 0.8)','rgba(241, 86,40, 0.8)','rgba(255, 200,27, 0.8)','rgba(28, 163,146, 0.8)','rgba(51, 110,120, 0.8)','rgba(200,113,163, 0.8)','rgba(97, 101,113, 0.8)','rgba(146, 118,158, 0.8)','rgba(201, 76,68, 0.8)',
	'rgba(136,107,104, 0.8)','rgba(96, 178,160, 0.8)','rgba(239,161,70, 0.8)'];
