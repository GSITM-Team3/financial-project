$(function(){

	// 국가데이터맵 - tab filter 클릭
	/*if( $('.tab-filter').length > 0 ){
		$(document).on('click', '.tab-filter li a', function(e){
			e.preventDefault();

			$(this).closest('li').addClass('on').siblings().removeClass('on');
		});
	}*/

	// 국가데이터맵 - 필터영역 보이고 안보이기
	/*$(document).on('click', '.map-area .filter-section .btn-move', function(){
		$(this).closest('.filter-section').toggleClass('off');

		if( $(this).closest('.filter-section').hasClass('off') ){
			$(this).text('필터기능 보기');

			$(this).closest('.map-area').find('.graph-section').addClass('large');
		}
		else {
			$(this).text('필터기능 안보기');
			$(this).closest('.map-area').find('.graph-section').removeClass('large');
		}
	});*/

	// 국가데이터맵 - 상세영역 열기
	/*$(document).on('click', '.map-area .btn-open-detail-section', function(e){
		e.preventDefault();

		$(this).closest('.map-area').find('.detail-section').addClass('on');
	});*/

	// 국가데이터맵 - 상세영역 닫기
	/*$(document).on('click', '.map-area .btn-close-detail-section', function(e){
		e.preventDefault();
		$(this).closest('.map-area').find('.detail-section').removeClass('on');
	});*/

	// 트리메뉴 목록
	/*$(".tree-list > ul > li > a").click(function(e){
		e.preventDefault();
		$(this).next().slideToggle();
	});*/

	// 데이터 정보 열기 닫기
	/*$(".table-control a").click(function(e){
		e.preventDefault();

		$(this).toggleClass("open");
		if ($(this).hasClass("open"))
		{
			$(this).text("데이터 정보 닫기");
		}else{
			$(this).text("데이터 정보 열기");
		}
		$(this).closest(".table-area").find(".row-table").slideToggle();
	});*/

	// 2020-02-26 : 툴팁 추가
	// 툴팁 - 공통
	if( $('.tool-tip').length > 0 ){
		$(document).on('click', 'a.tool-tip', function(e){
			e.preventDefault();
		});

		$('.tool-tip').tooltipster({
			trigger: 'hover'
		});
	}

	if( $('.tool-tip-txt').length > 0 ){
		$('.tool-tip-txt').tooltipster({
			trigger: 'hover'
		});
	}

});