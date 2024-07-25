$(document).ready(function(){
	// 탭버튼 클릭 시
	$(".tabArea").each(function(q){
		$(".tabArea").eq(q).find(".tabBtn a").each(function(j){
			$(this).click(function(){
				$(".tabArea").eq(q).find(".tabBtn a").removeClass("on");
				$(this).addClass("on");
				$(".tabArea").eq(q).find(".tabCon").hide();
				$(".tabArea").eq(q).find(".tabCon").eq(j).show();
				whResize();
			});
		});
	});

	// miniTab
	$(".miniTab a").each(function(q){
		$(this).click(function(){
			$(".miniTab a").removeClass("on");
			$(".miniTabCon").hide();
			$(".miniTab a").eq(q).addClass("on");
			$(".miniTabCon").eq(q).show();
			whResize();
		});
	});

	// gnb
	$(".gnbDiv .inner").mouseenter(function(){
		$("#headerW").addClass("on");
		$(".gnbDiv .inner").stop().animate({"height": $(".gnbDiv ul").outerHeight(true) + 350}, 350);
		$(".blackBg").css("z-index",101).fadeIn(300);
	});
	$(".gnbDiv .inner").mouseleave(function(){
		$(".gnbDiv .inner").stop().animate({"height":80}, 300, function(){
		$("#headerW").removeClass("on");
		$(".blackBg").css("z-index",99);
		});
		$(".blackBg").stop(true, true).fadeOut(300);
	});

	$(".gnbDiv .inner .twoD a").mouseenter(function(){
		$(this).next(".thrD").stop().slideDown(300);
		$(this).addClass("on");
	});

	$(".gnbDiv .inner .twoD a").mouseleave(function(){
		$(this).next(".thrD").stop(true,true).slideUp(300);
		$(this).removeClass("on");		
	});

	$(".gnbDiv .inner .thrD").hover(function(){
		$(this).stop().slideDown(0);
		$(this).prev("a").addClass("on");
	},function(){
		$(this).stop(true,true).slideUp(300);
		$(this).prev("a").removeClass("on");
	});

	//전체메뉴
	$(".allMenu").css("height", $(window).height());
	if($(window).width() < 964){
		$(".allMenu").css("overflow-y","scroll");
	}
	$(".fmSitBt").click(function(){
		TweenMax.to($(".allMenu"), 0.4, {width:"100%", display:"block", opacity:1, ease:Power3.easeOut});
		TweenMax.to($(".mainIndi"), 0.1, {opacity:0, ease:Power3.easeOut});
		if($(window).width() < 964){
			if(!$("#wrap").hasClass("main")){
				$("#wrap").css("overflow","hidden");
			}
		}
	});
	$(".allMenu .closeBtn").click(function(){
		TweenMax.to($(".mainIndi"), 0.1, {opacity:1, ease:Power3.easeOut});
		if($(window).width() < 964){
			TweenMax.to($(".allMenu"), 0.4, {width:0, display:"none", opacity:0, ease:Power3.easeOut, onComplete:function(){
				$(".allMenu ul li").removeClass("on");
				$(".allMenu ul li .twoD").stop(true.true).slideUp(0);
			}});
			if(!$("#wrap").hasClass("main")){
				$("#wrap").css("overflow","auto");
			}
		}else{
			TweenMax.to($(".allMenu"), 0.4, {width:0, display:"none", opacity:0, ease:Power3.easeOut});
		}
	});

	var lnbMove = true;

	$(".allMenu ul li a.oneD").each(function(q){
		$(this).click(function(){
			if(!lnbMove){
				if(!$(this).parent("li").hasClass("on")){
					$(".allMenu ul li").removeClass("on");
					$(".allMenu ul li .twoD").stop(true.true).slideUp(400);
					$(".allMenu ul li .thrD").show();
					$(this).parent("li").addClass("on");
					$(this).next(".twoD").stop(true,true).slideDown(400);
					console.log(1);
				}else{
					$(this).parent("li").removeClass("on");
					$(this).next(".twoD").stop(true,true).slideUp(400);
					console.log(2)
				}
			}
		});
	})
	
	$(window).resize(function(){
		if($(window).width() < 964){
			$(".allMenu ul li").removeClass("on");
			$(".allMenu ul li .twoD").hide();
			$(".allMenu ul li .thrD").hide();
			lnbMove = false;
		}else{
			lnbMove = true;
			$(".allMenu ul li .twoD").show();
			$(".allMenu ul li .thrD").show();
		}
	}); $(window).resize();

	// 푸터 셀렉트 클릭 시
	var curFamily = false;
	jQuery("#footer .fmSel > a").click(function(){
		if(curFamily == false){
			jQuery(this).addClass("on");
			jQuery(this).attr("title", "패밀리사이트 닫기");
			jQuery("#footer .fmSel div").stop().slideDown(300);

			curFamily = true;
		}else if(curFamily == true){
			jQuery(this).removeClass("on");
			jQuery(this).attr("title", "패밀리사이트 열기");
			jQuery("#footer .fmSel > div").stop().slideUp(300);

			curFamily = false;
		}
	});

	// LNB 클릭 시
	$("#subBody .location .oneD > a").click(function(){
		if(!$(this).hasClass("on")){
			$("#subBody .location .oneD > a").removeClass("on");
			$("#subBody .location .oneD .twoD").css("z-index", "0").slideUp(300);
			$(this).addClass("on");
			$(this).next().css("z-index", "999").slideDown(300);
			$(this).slideDown(300);
		}else{
			$(this).removeClass("on");
			$(this).next().css("z-index", "0").slideUp(300);
		}
	});

	// 탑버튼
	$(".gotoTop").click(function(){
		TweenMax.to($("html, body"), 0.5, {scrollTop:0, ease:Power3.easeOut});
	});

	//사업 레이어팝업
	$(".businessDiv .viewBtn").each(function(q){
		$(this).click(function(){
			$(".blackBg").fadeIn(400);
			$(".layerPop").eq(q).fadeIn(400);
			$(".layerPop").eq(q).css("top", $(window).scrollTop() + ( $(window).height() - $(".layerPop").eq(q).height())/2 )
			$(".layerPop").eq(q).find(".bodyWrap").mCustomScrollbar();
		});
	});
	$(".businessDiv .layerPop .closeBtn").click(function(){
		$(".blackBg").fadeOut(400);
		$(this).parents(".layerPop").fadeOut(400, function(){
			$(this).find(".bodyWrap").mCustomScrollbar("destroy");
		});
	});

	// 재무정보 표
	/* $(".swiperArea").mCustomScrollbar({
			horizontalScroll:true,
			scrollInertia:50,
			advanced:{
				updateOnContentResize: true
			}
		})
		$(window).resize(function(){
			if($(window).width() > 758){
				$(".swiperArea").mCustomScrollbar("disable");
			}
		});$(window).resize(); */




	$(".socialConDiv .rollArea .indiBtn a").each(function(q){
		$(this).click(function(){
			if(socialN != q){
				if(!isSocialRollMove){
					isSocialRollMove = true;
					TweenMax.to($(".socialConDiv .rollArea .rollDiv .roll").eq(socialN), 0.6, {left:"-100%", ease:Power3.easeOut});
					$(".socialConDiv .rollArea .indiBtn a").eq(socialN).removeClass("on");
					socialN = q;
					$(".socialConDiv .rollArea .indiBtn a").eq(socialN).addClass("on");
					TweenMax.to($(".socialConDiv .rollArea .rollDiv .roll").eq(socialN), 0, {left:"100%", ease:Power3.easeOut});
					TweenMax.to($(".socialConDiv .rollArea .rollDiv .roll").eq(socialN), 0.6, {left:0, ease:Power3.easeOut, onComplete:function(){
						isSocialRollMove = false;
					}});
				}
			}
		});
	});

	//사업소개_제어기 아코디언
	var contAccorN = -1;
	$(".businessDiv .busiAccorDiv .list").each(function(q){
		$(this).children(".btn").click(function(){
			if(contAccorN != q){
				$(".businessDiv .busiAccorDiv .list").eq(contAccorN).removeClass("on");
				$(".businessDiv .busiAccorDiv .list .btn span").eq(contAccorN).text("더보기");
				$(".businessDiv .busiAccorDiv .view").eq(contAccorN).stop(true, true).slideUp(400);
				TweenMax.to($(".businessDiv .busiAccorDiv .list .btn img").eq(contAccorN), 0.4, {rotation:0, ease:Power3.easeOut});
				contAccorN = q;
				$(".businessDiv .busiAccorDiv .list").eq(contAccorN).addClass("on");
				$(".businessDiv .busiAccorDiv .list .btn span").eq(contAccorN).text("닫기");
				$(".businessDiv .busiAccorDiv .view").eq(contAccorN).stop(true, true).slideDown(400);
				TweenMax.to($(".businessDiv .busiAccorDiv .list .btn img").eq(contAccorN), 0.4, {rotation:180, ease:Power3.easeOut});
			}else{
				$(".businessDiv .busiAccorDiv .list").eq(contAccorN).removeClass("on");
				$(".businessDiv .busiAccorDiv .list .btn span").eq(contAccorN).text("더보기");
				$(".businessDiv .busiAccorDiv .view").eq(contAccorN).stop(true, true).slideUp(400);
				TweenMax.to($(".businessDiv .busiAccorDiv .list .btn img").eq(contAccorN), 0.4, {rotation:0, ease:Power3.easeOut});
				contAccorN = -1;
			}
		});
	});

	//윤리경영 faq탭
	var faqTabN = 0;
	$(".faqTabs a").each(function(q){
		$(this).click(function(){
			if(faqTabN != q){
				$(".faqTabs a").eq(faqTabN).removeClass("on");
				$(".faqCon ").eq(faqTabN).hide();
				faqTabN = q;
				$(".faqTabs a").eq(faqTabN).addClass("on");
				$(".faqCon ").eq(faqTabN).show();
			}
		});
	});

	//faq
	var faqAccorN = -1;
	$(".faqList .list").each(function(q){
		$(this).children(".question").click(function(){
			if(faqAccorN != q){
				$(".faqList .list .question").eq(faqAccorN).removeClass("on");
				$(".faqList .list .answer").eq(faqAccorN).stop(true, true).slideUp(300);
				TweenMax.to($(".faqList .list .question .btn img").eq(faqAccorN), 0.4, {rotation:0, ease:Power3.easeOut});
				$(".faqList .list .question").eq(faqAccorN).find(".btn img").attr("src", $(".faqList .list .question").eq(faqAccorN).find(".btn img").attr("src").replace("_close","_open"));
				faqAccorN = q;
				$(".faqList .list .question").eq(faqAccorN).addClass("on");
				$(".faqList .list .answer").eq(faqAccorN).stop(true, true).slideDown(300);
				TweenMax.to($(".faqList .list .question .btn img").eq(faqAccorN), 0.4, {rotation:180, ease:Power3.easeOut});
				$(".faqList .list .question").eq(faqAccorN).find(".btn img").attr("src", $(".faqList .list .question").eq(faqAccorN).find(".btn img").attr("src").replace("_open","_close"));
			}else{
				$(".faqList .list .question").eq(faqAccorN).removeClass("on");
				$(".faqList .list .answer").eq(faqAccorN).stop(true, true).slideUp(300);
				TweenMax.to($(".faqList .list .question .btn img").eq(faqAccorN), 0.4, {rotation:0, ease:Power3.easeOut});
				$(".faqList .list .question").eq(faqAccorN).find(".btn img").attr("src", $(".faqList .list .question").eq(faqAccorN).find(".btn img").attr("src").replace("_close","_open"));
				faqAccorN = -1;
			}
		});
	});
	
	
	$(window).scroll(function(){
		lnbScroll();
		if($(window).width() > 1200){
			if($(window).scrollTop() > 0){
				$(".gotoTop").fadeIn(500);
			}else{
				$(".gotoTop").fadeOut(500);
			}
			if($(window).scrollTop() + $(window).height() >= $("#footer").offset().top){
				$(".gotoTop").css({"position":"absolute", "bottom":30});
			}else{
				$(".gotoTop").css({"position":"fixed", "bottom":40});
			}
		}else{
			if($(window).scrollTop() + $(window).height() >= $("#footer").offset().top){
				$(".gotoTop").fadeIn(500);
				$(".gotoTop").css({"position":"absolute", "bottom":30});
			}else{
				$(".gotoTop").fadeOut(500);
			}
		}
	});


	// 검색영역 셀렉트 클릭 시
	$(".srchSel > a").click(function(){
		if(!$(this).hasClass("on")){
			$(".srchSel > a").removeClass("on");
			$(".srchSel > div").slideUp(300);
			$(this).addClass("on");
			$(this).next().stop().slideDown(300);
		}else{
			$(this).removeClass("on");
			$(this).next().slideUp(300);
		}
	});
	$(".srchSel > div a").click(function(){
		var selTxt = $(this).text();
		$(this).siblings(".active").removeClass("active");
		$(this).addClass("active");
		$(this).parent().siblings("a").text(selTxt).removeClass("on");
		$(this).parent().slideUp(300);
	});
	$(".srchSel").focusout(function(){
		$(this).children("a").removeClass("on");
		$(this).children("div").slideUp(300);
	});


	$(window).resize(function(){
		
		//리사이즈 width, height 관련
		whResize();

		// Lnb 리사이징때 노출관련
		lnbW();
			
		//전체메뉴
		$(".allMenu").css("minHeight", $(window).height());

		//영상룸
		$(".videoList .topArea .video").css("height", $(".videoList .topArea .video").width() * 0.562);
		//오시는길
		$(".locationDiv .mapArea #map").css("height",$(".locationDiv .mapArea #map").width() * 0.372);

		//레이어팝업
		$(".layerPop").each(function(q){
			$(".layerPop").eq(q).css("top", $(window).scrollTop() + ( $(window).height() - $(".layerPop").eq(q).height())/2 )
		});


		//연혁
		if($(window).width() > 741){
			$(".historyDiv .line .txtArea").each(function(){
				$(this).css("height", $(this).parent().children(".img").height());
			});
		}else{
			$(this).css("height", "auto");
		}

		//비전
		/*
		if($(window).width() <= 964){
			$(".valueDiv .listDiv .list").each(function(q){
				var pdT = $(".valueDiv .listDiv .list").outerWidth();
				$(".valueDiv .listDiv .list").css("paddingTop", pdT + 15);
			});
		}else if($(window).width() < 1224){
			$(".valueDiv .listDiv .list").css("paddingTop", "95px");
		}else{
			$(".valueDiv .listDiv .list").css("paddingTop", "115px");
		}*/
		//뷰페이지 리사이즈
		$(".viewCon img").each(function(){
			if($(this).get(0).naturalWidth >= $(".viewCon .viewTxt").width()){
				$(this).css("width","100%");
			}else{
				$(this).css("width", "auto");
				$(this).css("maxWidth", $(this).get(0).naturalWidth);
			}
		});

	});$(window).resize();



}); 

$(window).load(function(){

	//리사이즈 width, height 관련
	whResize();

	// Lnb 리사이징때 노출관련
	lnbW();

	//연혁
	if($(window).width() > 741){
		$(".historyDiv .line .txtArea").each(function(){
			$(this).css("height", $(this).parent().children(".img").height());
		});
	}else{
		$(this).css("height", "auto");
	}
});

function whResize(){
	//영상룸 썸네일 높이잡기
	var maxH1 = 0;
	var longH1;
	$(".videoList .listArea .list").each(function(q){
		if($(window).width() > 964){
			longH1 = $(this).children(".thumb").height() + $(this).children(".tit").height() + $(this).children(".date").height()+ 50;
		}else{
			longH1 = $(this).children(".thumb").height() + $(this).children(".tit").height() + $(this).children(".date").height()+ 20;
		}
		if(maxH1 < longH1) maxH1 = longH1;
	});
	$(".videoList .listArea .list").css("height", maxH1);
	
	//직무소개 높이잡기
	var maxH2 = 0;
	var longH2;
	$(".introListDiv .list .txtArea").each(function(q){
		if($(window).width() > 964){
			$(".introListDiv .list .txtArea").each(function(q){
				$(this).css("height", $(".introListDiv .list .img").eq(q).height());
			});
		}else if($(window).width() > 700){
			longH2 = $(this).children().children(".icon").height() + $(this).children().children(".tit").height() + $(this).children().children(".txt").height()+ 70;
			if(maxH2 < longH2) maxH2 = longH2;
			$(".introListDiv .list .txtArea").css("height", maxH2);
		}else{
			$(".introListDiv .list .txtArea").css("height", "auto");
		}
	});
	
	if($(window).width() <= 1183){
		$(".tableType2 .line .tit.area").css("height", $(".tableType2 .line .tit.area").next("div").outerHeight());
	}
	
	//사업소개 제품 설명
	var maxH4 = 0;
	var longH4;
	if($(window).width() > 1183){
		$(".businessDiv .busiTable .list").each(function(q){
			longH4 = $(this).children(".table").height() + 146
			if(maxH4 < longH4) maxH4 = longH4;
		});
		$(".businessDiv .busiTable .list").css("height", maxH4);
	}else{
		$(".businessDiv .busiTable .list").css("height", "auto");
	}
	
	//사업소개 오버뷰
	var maxH5 =0;
	var longH5 = 0;
	if($(window).width() <= 964){
		$(".businessDiv .overViewDiv .researchDiv .list").each(function(q){
			longH5 = $(this).children(".tit").height() + $(this).children(".txt").height() + $(this).children(".img").height() +75
			if(maxH5 < longH5) maxH5 = longH5;
		});
		$(".businessDiv .overViewDiv .researchDiv .list").css("height", maxH5);
	}else{
		$(".businessDiv .overViewDiv .researchDiv .list").css("height", "auto");
	}
}

function lnbW(){
	//2뎁스,3뎁스 관련
	if($(window).width() > 964){
		$("#subBody .location .oneD").css("width","180px");
	}else{		
		if($("#subBody .location .thrOn").size() > 0 ){
			$("#subBody .location .oneD").css("width","50%");
		}else{
			$("#subBody .location .oneD").css("width","100%");
		}
	}
}

function lnbScroll(){
	$(window).resize(function(){
		//LNB 스크롤
		var scrollTop = $(window).scrollTop();
		if(scrollTop >= $("#subBody .subVisual").innerHeight()){
			$("#subBody .location").css({"position":"relative","top":"0"});
		}else if(scrollTop < $("#subBody .subVisual").innerHeight()){
				$("#subBody .location").css({"position":"","top":""});
		}
	}); $(window).resize();
}

// 2021-09-14 추가 //
$('.accordion-item .heading').on('click', function(e) {
    e.preventDefault();

    // Add the correct active class
    if($(this).closest('.accordion-item').hasClass('active')) {
        // Remove active classes
        $('.accordion-item').removeClass('active');
    } else {
        // Remove active classes
        $('.accordion-item').removeClass('active');

        // Add the active class
        $(this).closest('.accordion-item').addClass('active');
    }

    // Show the content
    var $content = $(this).next();
    $content.slideToggle(100);
    $('.accordion-item .content').not($content).slideUp('fast');
});