/**
 * 분석서비스 - 조직정원, 연안사고, 대화형 통계(태블로) 공통
 */

$( document ).ready(function() {
	
});

/*
 * 분석서비스 전역변수
 * */
var ANALYSIS={
	GRID_colorGrid3D:null,	// 3D격자 객체
	GRID_colorGrid2D:null,	// 2D격자 객체
	GridBeforeArr:[],		//클릭했던 격자의 정보를 담을 배열
	OfficeNameArr:[],		//안전사고 예방시설 - 경찰서이름 배열
	BoxNameArr:[],			//안전사고 예방시설 - 파출소이름 배열
	COASTACCIDENTYEAR:""	//연안사고 분석년도
};


/*
 * 분석서비스 초기 메뉴 진입시 연안사고 탭(m2_tab1)으로 초기화
 * */
function initAnalysisTab(){
	$('.analysis_menu_tab').removeClass('active');
	$('#m2_tab1').addClass('active');
	
	$('.m2_div').addClass('hide');
	$('#tab1_div').removeClass('hide');
	
	$('#tab1_div').css('display','block');	
	//범례 초기화
	$(".wrap_legend").addClass('hide');
	$(".wrap_legend2").addClass('hide');
	$('.wrap_legend dl dd').off('click');
	$('.wrap_legend2 dl dd').off('click');
	$('.wrap_legend dl dd').removeClass('legend_disabled');
	$('.wrap_legend dl dt').removeClass('legend_disabled');
	$('.wrap_legend2 dl dd').removeClass('legend_disabled');
	$('.wrap_legend2 dl dt').removeClass('legend_disabled');
}
