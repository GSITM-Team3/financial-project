$(function () {

	$(".acd_1_cts").hide();
	//content 클래스를 가진 div를 표시/숨김(토글)
	$(".acd_1").click(function()
			{
		if($(this).hasClass('acd_1_off')){
			$(this).removeClass('acd_1_off');
		}else{
			$(this).addClass('acd_1_off');
		} 
		$(this).next(".acd_1_cts").slideToggle(500);
			});


	$(".content").hide();
	//content 클래스를 가진 div를 표시/숨김(토글)
	$(".heading").click(function()
			{
		if($(this).hasClass('heading_off')){
			$(this).removeClass('heading_off');
		}else{
			$(this).addClass('heading_off');
		} 
		$(this).next(".content").slideToggle(500);
			});

	$( "#dialog" ).dialog({

		autoOpen: false,
		width: 400,
		position:[425,120], 
	});



	$( "#opener" ).on( "click", function() {

		$( "#dialog" ).dialog( "open" );

	});
	
	//map_tools (레이어,도구,기상,배경지도)
	$(".map_tools dl dt").click(function(){
		var thisId = $(this).attr("id");
	
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("."+thisId).removeClass("active");
		}else{
			$(this).addClass("active");
			$("."+thisId).addClass("active");	
		}
	});
	
	//배경지도 변경
	$("#background_map_sub li button").click(function(){
		var thisId = $(this).attr("class");
		$("#background_map_sub li button").removeClass("active");
		if($(this).hasClass("active")){
			$("."+thisId).removeClass("active");
		}else{
			$(this).addClass("active");
			$("."+thisId).addClass("active");	
		}
	});
});


      $(document).ready(function(){
        var tabBtn = $(".tab-btn > li");
        var tabCont = $(".wrap_contents > .tab_contents");
        
        tabCont.hide().eq(0).show();
        
        tabBtn.click(function(e){
            e.preventDefault();
            var target = $(this);
            //선택메뉴 한번더 선택시 꺼버리기
            if(target.hasClass('active')){
	            $(".wrapHideDiv").addClass('hide');
	            tabBtn.removeClass("active");
	            $('.wrap_contents').addClass('hide');	
	            tabCont.css("display","none");
            }else{
            	$(".wrapHideDiv").removeClass('hide');
            	$(".wrapHideButton").removeClass('active');
	            tabBtn.removeClass("active");
	            var index = target.index();
				$('.wrap_contents').removeClass('hide');
	            target.addClass("active");
	            tabCont.css("display","none");
	            tabCont.eq(index).css("display","block");
            }
        });
    });

 $(document).ready(function(){
        var tabBtn = $(".Sub-Tabs-1 > li");
        var tabCont = $(".m-1 > .c-1");
        
        tabCont.hide().eq(0).show();
        
        tabBtn.click(function(e){
            e.preventDefault();
            var target = $(this);
            var index = target.index();
            tabBtn.removeClass("active");
            target.addClass("active");
            tabCont.css("display","none");
            tabCont.eq(index).css("display","block");
        });
    });

 $(document).ready(function(){
        var tabBtn = $(".Sub-Tabs-2 > li");
        var tabCont = $(".m-2 > .c-2");
        
        tabCont.hide().eq(0).show();
        
        tabBtn.click(function(e){
            e.preventDefault();
            var target = $(this);
            var index = target.index();
            tabBtn.removeClass("active");
            target.addClass("active");
            tabCont.css("display","none");
            tabCont.eq(index).css("display","block");
        });
    });

 $(document).ready(function(){
        var tabBtn = $(".Sub-Tabs-3 > li");
        var tabCont = $(".m-3 > .c-3");
        
        tabCont.hide().eq(0).show();
        
        tabBtn.click(function(e){
            e.preventDefault();
            var target = $(this);
            var index = target.index();
            tabBtn.removeClass("active");
            target.addClass("active");
            tabCont.css("display","none");
            tabCont.eq(index).css("display","block");
        });
    });

 $(document).ready(function(){
        var tabBtn = $(".Sub-Tabs-4 > li");
        var tabCont = $(".m-4 > .c-4");
        
        tabCont.hide().eq(0).show();
        
        tabBtn.click(function(e){
            e.preventDefault();
            var target = $(this);
            var index = target.index();
            tabBtn.removeClass("active");
            target.addClass("active");
            tabCont.css("display","none");
            tabCont.eq(index).css("display","block");
        });
    });
