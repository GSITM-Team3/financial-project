// gnb
var gnbNav = {
	initEvent : function(){
		$('#gnb, #ly_gnbback').mouseenter(function(){
			gnbNav.sideNavOpen();
		});
		$('#gnb, #ly_gnbback').mouseleave(function(){
			gnbNav.sideNavClose();
		});
	},
	sideNavOpen : function(){
		$('#header').addClass('scrollon');
		$('#ly_gnbback').show();
	    $('#ly_gnbback .inner').stop(true, false).animate({height:'260px'},420, 'easeOutCubic');
	    $('#gnb .depth').show();
	},
	sideNavClose : function(){
		 $('#ly_gnbback .inner').stop(true, false).animate({height:'0'},420, 'easeOutCubic', function(){
            $('#ly_gnbback').hide();
        });
		var scroll = $(window).scrollTop();
		var header = $('#header');
		if (scroll >= 100) header.addClass('scrollon');
	  	else header.removeClass('scrollon');
        $('#gnb .depth').hide();
	}
};

$(window).load(function(){
	var scroll = $(this).scrollTop();
	var header = $('#header');
	if ( scroll >= 100) header.addClass('scrollon');
	else header.removeClass('scrollon');
})

$(document).ready(function(){

	// gnb 메뉴
	gnbNav.initEvent();
	$(window).scroll(function(){
	  var header = $('#header'),
	      scroll = $(window).scrollTop();

	  if (scroll >= 100) header.addClass('scrollon');
	  else header.removeClass('scrollon');
	});

		// LNB 클릭 시
		$("#subBody .location .oneD > a").click(function(){
			if(!$(this).hasClass("on")){
				$("#subBody .location .oneD > a").removeClass("on");
				$("#subBody .location .oneD .twoD").css("z-index", "0").slideUp(300);
				$(this).addClass("on");
				$(this).next().css("z-index", "115").slideDown(300);
				$(this).slideDown(300);
			}else{
				$(this).removeClass("on");
				$(this).next().css("z-index", "0").slideUp(300);
			}
		});

    // 툴팁
    $('.tooltip_info').find('.ico').hover(function(){
    	var posX = $(this).position().left;
    	var posY = $(this).position().top;
    	$(this).next().addClass('active').css({
    		left : posX + 30,
    		top : posY - 6
    	});
    }, function(){
    	$('.tooltip_info .desc').removeClass('active');
    });
	    // 툴팁
		$('.tooltip_info2').find('.ico').hover(function(){
			var posX = $(this).position().left;
			var posY = $(this).position().top;
			$(this).next().addClass('active').css({
				left : posX + 30,
				top : posY - 6
			});
		}, function(){
			$('.tooltip_info2 .desc').removeClass('active');
		});
    
})