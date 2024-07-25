var kelim = {
    common : function(){
            var $window = $(window),
                $body = $("body"),
                $header = $("#header"),
                $headerWrap = $header.find(".header_wrap");

            // gnb
            var $gnb = $("#gnb"),
                $depth1 = $gnb.find(".depth1"),
                $depth2 = $depth1.find(".depth2_wrap"),
                headerH = $header.outerHeight();
            var item_h_arry = [];

            $depth2.each(function(index, item){
                var item_h = $(item).find(".depth2").outerHeight();
                if ( item_h == undefined ) {
                    item_h_arry.push(0);
                } else {
                    item_h_arry.push(item_h);
                }
            });

            var item_h_max = Math.max.apply(null, item_h_arry);
            $depth1.find(">a").on("focusin mouseenter", function(){
                $depth2.stop().animate({"height" : item_h_max}, 200, "linear");
                $headerWrap.addClass("open").height(headerH+item_h_max);
            })
            $headerWrap.on("blur mouseleave", function(){
                $depth2.stop().animate({"height" : 0}, 50, "linear");
                $headerWrap.removeClass("open").height(headerH);
            });

            // search
            var $searchWrap = $headerWrap.find(".search_wrap"),
                $searchBtn =  $searchWrap.find(".btn_search")
            $searchBtn.on("click", function(){
                if(!$searchBtn.hasClass("on")){
                    $(this).addClass("on").next(".input_wrap").slideDown(200);
                    return false;
                }
                $(this).removeClass("on").next(".input_wrap").slideUp(100);
            });

            // top_banner
            $(".main .top_banner .btn_close").on("click", function(){
                $(".top_banner").addClass("dpNone");
            });

            // sticky nav
            var visualTopH = $(".visual_wrap").height();
            var $lnbScroll = $(".lnb_scroll");

            var fixedTop = 0, currentT = 0;
            // lnb가 있을 경우 체크, header hidden 위치 설정
            if($lnbScroll.length > 0){
                fixedTop = $lnbScroll.offset().top - $lnbScroll.outerHeight();
            }else{
                fixedTop = visualTopH;
            };

            // lnbScroll function
            var lnbScroll = function(scrollT){
                if(scrollT >= fixedTop){
                    $lnbScroll.attr("data-fixed" , "fixed");
                }else{
                    $lnbScroll.attr("data-fixed" , "none");
                }
            };

            // topBtnScroll
            var topBtnScroll = function(scrollT){
                var winH = $window.height(),
                    footerT = $("#footer").offset().top;

                (scrollT > 0)  ? $(".quick_menu").fadeIn() : $(".quick_menu").fadeOut(500);

                if(footerT <= winH + scrollT) {
                    $(".quick_menu").removeClass("on");
                }else{
                    $(".quick_menu").addClass("on");
                }
            };
            // topBtn
            $("#topBtn").click(function(){
                $("html, body").animate({scrollTop: 0}, 500);
                return false;
            });

            $window.scroll(function(e){
                e.preventDefault();
                var scrollT = $(this).scrollTop();

                // scroll상태 체크
                if(scrollT > currentT){
                    $body.attr("data-scroll" , "down");
                }else if(scrollT < currentT){
                    $body.attr("data-scroll" , "up");
                };

                if($body.attr("data-scroll") === "down"){
                    if(scrollT > currentT){
                        $headerWrap.attr("data-fixed" , "none");
                    }
                }else if($body.attr("data-scroll") === "up"){
                    $headerWrap.attr("data-fixed" , "fixed");

                    if(scrollT == 0){
                        $headerWrap.attr("data-fixed" , "none");
                    };

                };

                currentT = scrollT;

                //lnbScroll function 호출
                if($lnbScroll.length > 0){
                    lnbScroll(scrollT);
                }
                //topBtnScroll function 호출
                if(!$("#wrap").hasClass("main")){
                    if($(".quick_menu").length > 0){
                        topBtnScroll(scrollT);
                    }
                }

            }).trigger("scroll");



            
            
            
            
            
            
            
            
            
            
            
            
            
            


            // video iframe
            var $videoView = $("#videoView"),
                $videoCont = $videoView.find(".video_wrap"),
                $btnClose = $videoView.find(".btn_close");
                $videoWrap = $(".video_list"),
                $video = $videoWrap.find("a");

            function mediaShow(videoId){
                var html = "";
                html += '<iframe width="100%" height="100%" src="//www.youtube.com/embed/' + videoId + '?rel=0&showinfo=0" frameborder="0" allowfullscreen></iframe>';
                $body.addClass("not_scroll");
                $videoView.show();
                $videoCont.append(html);
                $("<div class='dim on'></div>").insertAfter($videoCont);
            };
            function mediaHide(){
                $body.removeClass("not_scroll");
                $videoView.hide();
                $videoView.find("iframe").remove();
                $videoView.find(".dim").remove();
            }
            $video.on("click", function(){
                var videoId = $(this).attr('data-id');
                mediaShow(videoId)
            })
            $btnClose.on("click", function(){
                mediaHide();
            })
            $(document).on("click","#videoView .dim",function(){
                mediaHide();
            });

            // 사무소/대리점 안내 all checked
            $("#cusdivAll").on("click", function(){
                if($("#cusdivAll").prop("checked")){
                    $("input[name=cusdiv]").prop("checked",true);
                    $("input[name=cusdiv]").addClass("on");
                }else{
                    $("input[name=cusdiv]").prop("checked",false);
                    $("input[name=cusdiv]").removeClass("on");
                }
            });
           //$("#cusdivAll").trigger("click");

            // 사무소/대리점 안내 checked
            $(".chk_input input").on("click", function(){
                var cusdivTotal = $(".chk_input input[name=cusdiv]").length,
                    cusdivChk = $(".chk_input input[name=cusdiv]:checked").length
                // all checked
                if(cusdivTotal > cusdivChk){
                	if($(this).attr("id")!="cusdivAll" && $(this).is(":checked") == true && cusdivTotal-1 == cusdivChk) {
                        $("#cusdivAll").prop("checked",true);
                        $("#cusdivAll").addClass("on");
                	}else {
                		$("#cusdivAll").prop("checked",false);
                		$("#cusdivAll").removeClass("on");
                	}
                    //$("#cusdivAll").prop("checked",false);
                }else{
                    $("#cusdivAll").prop("checked",true);
                    $("#cusdivAll").addClass("on");
                }
            });

            // 사무소/대리점 map on
            $(".map_wrap .list li").on("click",function(){
                $(".map_wrap .list li").removeClass("on");
                $(this).addClass("on");
            });
       },
       gnb : function(depth1, lnb1depth, lnb2depth){
            var $gnb = $("#gnb"),
                $lnb = $(".lnb"),
                $lnb2depth1 =  $lnb.find(".sub_menu"),
                $lnb2depth2 = $(".multi_wrap li .list");

            if(depth1 !==  null){
                $gnb.find("li[data-page=" + depth1 +"]").addClass("on").siblings("li").removeClass("on");
                $lnb.find("li[data-page=" + lnb1depth +"]").addClass("on").siblings("li").removeClass("on");
                $lnb2depth1.find("li[data-page=" + lnb2depth +"]").addClass("on").siblings("li").removeClass("on");
                $lnb2depth2.find("li[data-page=" + lnb2depth +"]").addClass("on").siblings("li").removeClass("on");
            }
       },
       tab : function(){
            // tab
            var $tabWrap = $(".tab_area"),
                $tab = $tabWrap.find(".tab_list").children("li"),
                $tabCont = $tabWrap.find(".tabpanel");
            $tab.on("click", function(){
                var idx = $(this).index();
                $(this).addClass("active").siblings().removeClass("active");
                $tabCont.eq(idx).addClass("active").siblings().removeClass("active");
            });
       },
       accordion : function(){
            /* accordion_list */
            var $accoList = $(".accordion_list"),
                $accoLi = $accoList.children("li"),
                $accoBtn = $accoLi.find(".btn"),
                $accoBox = $accoLi.find(".accordion_box");
            $accoBtn.on("click", function(){
                var $this = $(this);
                if (!$this.hasClass("on")) {
                    // 활성화 accordion_list 초기화
                    $accoBox.stop(true, true).slideUp();
                    $accoBtn.removeClass("on");

                    $this.next(".accordion_box").stop(true, true).slideDown();
                    $this.addClass("on");
                }else{
                    $accoBtn.removeClass("on");
                    $accoBox.slideUp();
                };
            });
       },
       product : function(){
           var $lnbWrap = $(".lnb_scroll").find(".lnb"),
                $lnb = $lnbWrap.find("li");

            $lnb.on("mouseenter", function(){
                $(this).find(">.sub_menu").stop(true, true).slideDown(200);
            }).on("mouseleave", function(){
                $(this).find(">.sub_menu").stop(true, true).slideUp(100);
            });


           var $searchBtn = $(".sch_top").find(".btn"),
                $arrow = $searchBtn.find(".triangle"),
                $searcCont = $(".sch_cont_wrap");

            $searchBtn.on("click", function(){
                if(!$(this).hasClass("down")){
                    $(this).addClass("down");
                    $arrow.removeClass("up").addClass("down")
                    $searcCont.slideDown(200);
                    //$("#btbReset").trigger("click");
                    return false;
                }
                $(this).removeClass("down");
                $arrow.removeClass("down").addClass("up")
                $searcCont.slideUp(100);
                return false;
            });


            var $sliders = $(".skip_step"),
            allValues = [];

            var data = {
                // product - sanitarywares - toilets
                type1 : [
                    {//가로
                        min : 410,
                        max : 740
                    },
                    {//세로
                        min : 270,
                        max : 450
                    },
                    {//높이
                        min : 245,
                        max : 765
                    }
                ],
                // product - sanitarywares - wash-basin
                type2 : [
                    {//가로
                        min : 340,
                        max : 650
                    },
                    {//세로
                        min : 295,
                        max : 510
                    },
                    {//높이
                        min : 120,
                        max : 400
                    }
                ],
                // product - sanitarywares - urinals
                type3 : [
                    {//가로
                        min : 320,
                        max : 460
                    },
                    {//세로
                        min : 260,
                        max : 430
                    },
                    {//높이
                        min : 510,
                        max : 1040
                    }
                ],
				// product - watersaving_toilets
                type5 : [
                    {//가로
                        min : 385,
                        max : 410
                    },
                    {//세로
                        min : 680,
                        max : 730
                    },
                    {//높이
                        min : 655,
                        max : 735
                    }
                ],
            }

            $sliders.each(function(index, item){
                var type = $(item).closest(".range_wrap").data("type");

                noUiSlider.create(item, {
                    start: [data[type][index].min, data[type][index].max],
                    connect: true,
                    range: {
                        'min': data[type][index].min,
                        'max': data[type][index].max
                    },
                    step: 10,
                    tooltips: [true, true],
                    format: {
                    from: function(value) {
                            return parseInt(value);
                        },
                    to: function(value) {
                            return parseInt(value);
                        }
                    }
                });

                allValues.push($sliders[index].noUiSlider.get());
                $(item).parent(".range").find(".value-lower").text(allValues[index][0]);
                $(item).parent(".range").find(".value-upper").text(allValues[index][1]);



                // search 초기화
                $("#btbReset").on("click", function(){
                    $("input[type=checkbox]").prop("checked", false);
                    $sliders[index].noUiSlider.reset();

                    // 초기화 후 타입, KS기호 전체 체크 디폴트
                    $(".sch_cont #categoryAll").trigger("click");
                    $(".sch_cont #signAll").trigger("click");
                });
            });

            // 타입 전체 선택
            $("#categoryAll").on("click", function(){
                if($("#categoryAll").prop("checked")){
                    $("input[name=category]").prop("checked",true);
                    $("input[name=category]").addClass("on");
                }else{
                    $("input[name=category]").prop("checked",false);
                    $("input[name=category]").removeClass("on");
                }
            });
            // KS기호 기호 전체 선택
            $("#signAll").on("click", function(){
                if($("#signAll").prop("checked")){
                    $("input[name=sign]").prop("checked",true);
                    $("input[name=sign]").addClass("on");
                }else{
                    $("input[name=sign]").prop("checked",false);
                    $("input[name=sign]").removeClass("on");
                }
            });
            // 타입, KS기호 checked
            $(".chk_input input").on("click", function(){
                var categoryTotal = $(".chk_input input[name=category]").length,
                    categoryChk = $(".chk_input input[name=category]:checked").length
                var signTotal = $(".chk_input input[name=sign]").length,
                    signChk = $(".chk_input input[name=sign]:checked").length

                if($(this).prop("checked") == false) {
                	$(this).removeClass("on");
                } else {
                	$(this).addClass("on");
                }
                // 타입
                if(categoryTotal > categoryChk){
                	if($(this).attr("id")!="categoryAll" && $(this).is(":checked") == true && categoryTotal-1 == categoryChk) {
                        $("#categoryAll").prop("checked",true);
                        $("#categoryAll").addClass("on");
                	}else {
                		$("#categoryAll").prop("checked",false);
                		$("#categoryAll").removeClass("on");
                	}
                }else{
                    $("#categoryAll").prop("checked",true);
                    $("#categoryAll").addClass("on");
                }
                // KS기호
                if(signTotal > signChk){
                	if($(this).attr("id")!="signAll" && $(this).is(":checked") == true && signTotal-1 == signChk) {
                        $("#signAll").prop("checked",true);
                        $("#signAll").addClass("on");
                	}else {
                		$("#signAll").prop("checked",false);
                		$("#signAll").removeClass("on");
                	}
                }else{
                    $("#signAll").prop("checked",true);
                    $("#signAll").addClass("on");
                }
            });

            // ios input clear none
            (function iosChk(){
                var ua = navigator.userAgent.toLowerCase();
                var iOS = (/iphone|ipad|ipod/i.test(ua));
                if(!iOS){
                    $(".product .sch_input input").addClass("clear");
                }
            })();
       },
       placeholder : function(){
            // input focus 시 placeholder 숨김
            $(".input_wrap input" || ".sch_input input").on("focusin", function(){
                $(this).addClass("cursor");
            }).on("blur", function(){
                $(this).removeClass("cursor");
            })
        },
        guideSelect : function(){
            // privacy
            $("#PRIVACY_SELECT option[value='privacy.do']").attr('selected', 'selected');
            $("#PRIVACY_SELECT").change(function(){
                var _url = $(this).val();
                if(_url != "") location.href = _url;
            });
            // terms
            $("#TERMS_SELECT option[value='terms.do']").attr('selected', 'selected');
            $("#TERMS_SELECT").change(function(){
                var _url = $(this).val();
                if(_url != "") location.href = _url;
            });
        },
        productAnchor : function(){
            // product anchor_menu
            var $anchor = $(".anchor_menu"),
                anchorH = $("#Water").offset().top,
                scrollPosition = 0;

            var lnbScroll = function(scrollT){
                // scroll 시 fixed 유/무
                if(scrollT > anchorH){
                    $anchor.addClass("fixed");
                    $anchor.find("li").removeClass("on");
                    $anchor.find("li").eq(0).addClass("on");

                    $(".anchor").each(function(idx, item) {
                        if (parseInt($(item).offset().top) <= scrollT + 60) {
                            $anchor.find("li").removeClass("on");
                            $anchor.find("li").eq(idx).addClass("on");
                        }
                    });
                }else{
                    $anchor.removeClass("fixed");
                    $anchor.find("li").removeClass("on");
                }
            }

            $(window).on("scroll", function(e){
                e.preventDefault();
                var scrollT = $(this).scrollTop();

                lnbScroll(scrollT);
            }).trigger("scroll");

            $(".anchor_menu li a").on("click", function(){
                var scrollAnchor = $(this).attr('data-scroll'),
                    scrollPoint = $('.anchor[data-anchor="' + scrollAnchor + '"]').offset().top;

                if($anchor.hasClass("fixed") == true){
                    if($(window).scrollTop() > scrollPoint){
                        scrollPosition = 58;
                    }else{
                        scrollPosition = 0;
                    }
                }else{
                    scrollPosition = 90;
                }
                scrollMove(scrollPoint);

                $anchor.find("li").removeClass("on");
                $(this).addClass("on");

                return false;
            });

            function scrollMove(scrollPoint){
                $('body,html').animate({scrollTop: scrollPoint - scrollPosition}, 200);
            }
        },
        popup : function(open){
            // product popupOpen
            var $popupLayer = $("#popupLayer"),
                $btnClose = $popupLayer.find(".popup_close"),
                $body = $("body");
                $dim = $popupLayer.find(".dim");

            function popupOpen(){
                $body.addClass("not_scroll");
                $popupLayer.addClass("open");
                $dim.addClass("on");
            }
            function popupClose(){
                $body.removeClass("not_scroll");
                $popupLayer.scrollTop(0);
                $popupLayer.removeClass("open");
                $dim.removeClass("on");
            }

            // close
            $btnClose.on("click", function(){
                popupClose();
            });
            $dim.on("click", function(){
                popupClose();
            });
            $popupLayer.on("click", function(e){
                if($(e.target).is("#popupLayer")){
                    popupClose();
                }
            });

            // product list
            $(".product_list").find("li").on("click", function(){
            	//if($(this).data("modelcode") != undefined) {
            		//popupOpen();
            	//}

          	  if($(this).data("modelcode") != undefined) {
        	      var url = "/product/detail.do";
        	      var data = {modelcode:$(this).data("modelcode")};
        		  $.ajax({
        			    url: url,
        			    type: "POST",
        			    cache: false,
        			    dataType: "json",
        			    data: data,
        			    success: function(data){
        			    	if(data.newflag == "Y")
        			    		$('#newflag').show();
        			    	else
        			    		$('#newflag').hide();

        			    	$('#model_title').html(data.modelnamecat);
        			    	$('#modelcode').html(data.modelfullname);
        			    	$('#model_image').html('<img src="/upload/product/'+data.modelcode+'.jpg" onError="this.src=\'/resource/images/product/noimg.jpg\'">');
        			    	$('#mark1').html('');
        			    	$('#mark2').html('');
        			    	$('#ksmark').html(data.kscode);
        			    	if(data.width != null)
        			    		$('#product_size').html((data.width*1)+"x"+(data.height*1)+"x"+(data.depth*1)+"mm");
        			    	else
        			    		$('#product_size').html('');

        			    	$('#product_watercapacity').html('');
        			    	$('#product_desc').html('');

        			    	//이미지
        			    	if(data.modelpicName != null) {
        			    		$('#product_down1').attr("href", "/product/productDown.do?modelcode="+data.modelcode+"&type=image");
        			    	} else {
        			    		$('#product_down1').attr("href", "javascript:void(alert('해당 제품은 파일이 제공되지 않습니다. Q&A를 이용해 주세요.'));");
        			    	}

        			    	//CAD
        			    	if(data.cadName != null)
        			    		$('#product_down2').attr("href", "/product/productDown.do?modelcode="+data.modelcode+"&type=cad");
        			    	else
        			    		$('#product_down2').attr("href", "javascript:void(alert('해당 제품은 파일이 제공되지 않습니다. Q&A를 이용해 주세요.'));");

        			    	if(data.constructName != null)
        			    		$('#product_down3').attr("href", "/product/productDown.do?modelcode="+data.modelcode+"&type=construct");  //시공도면
        			    	else
        			    		$('#product_down3').attr("href", "javascript:void(alert('해당 제품은 파일이 제공되지 않습니다. Q&A를 이용해 주세요.'));");

        			    	if(data.testName != null)
        			    		$('#product_down4').attr("href", "/product/productDown.do?modelcode="+data.modelcode+"&type=test");  //시험성적서
        			    	else
        			    		$('#product_down4').attr("href", "javascript:void(alert('해당 제품은 파일이 제공되지 않습니다. Q&A를 이용해 주세요.'));");

        			    	if(data.hsCertName != null)
        			    		$('#product_down5').attr("href", "/product/productDown.do?modelcode="+data.modelcode+"&type=hs_cert");  //환경표지인증서
        			    	else
        			    		$('#product_down5').attr("href", "javascript:void(alert('해당 제품은 파일이 제공되지 않습니다. Q&A를 이용해 주세요.'));");

        			    	if(data.usermanualName != null)
        			    		$('#product_down6').attr("href", "/product/productDown.do?modelcode="+data.modelcode+"&type=usermanual");  //사용설명서
        			    	else
        			    		$('#product_down6').attr("href", "javascript:void(alert('해당 제품은 파일이 제공되지 않습니다. Q&A를 이용해 주세요.'));");
        			    	
        			    	if(data.promotionName != null) {
        			    		$('.pop_big_img').html('<img src="/upload/product/'+data.modelcode+'_promotion.'+data.promotionName.slice(-3)+'" alt="">');
        			    		$('.pop_big_img').show();        			    		
        			    	} else {
        			    		$('.pop_big_img').html('');
        			    		$('.pop_big_img').hide();
        			    	}
        			    		

        			    	//$('#product_print').attr("href","javascript:printArea()");
        			    	$("#product_print").off("click");
        			        $("#product_print").on("click",function () {
        			        	$('.pop_big_img').hide();
        			            var $container = $("#popupLayer").clone()    // 프린트 할 특정 영역 복사
        			            var cssText = "";
        			            /** 팝업 */
        			            var innerHtml = $container[0].innerHTML
        			            var popupWindow = window.open("", "_blank", "width=960,height=576")
        			            popupWindow.document.write("<!DOCTYPE html>"+
        			              "<html>"+
        			                "<head>"+
        			                "<style>"+cssText+"</style>"+
        			                '<script type="text/javascript" src="/resource/js/lib/jquery-3.4.1.min.js"></script>'+
        			                '<link rel="stylesheet" href="/resource/css/common.css">'+
        			                '<link rel="stylesheet" href="/resource/css/popup.css">'+
        			                "</head>"+
        			                "<body>"+innerHtml+"</body>"+
        			              "</html>");
        			            popupWindow.document.close();
        			            popupWindow.focus();
        			            
        			            $('.pop_big_img').hide();
        			            /** 1초 지연 */
        			            setTimeout(function(){
        			            	popupWindow.$('.download_list').remove();
        			            	popupWindow.$('.dim').remove();
        			                popupWindow.print();         // 팝업의 프린트 도구 시작
        			                popupWindow.close();         // 프린트 도구 닫혔을 경우 팝업 닫기
        			                $('.pop_big_img').show();
        			            }, 500)
        			        });


                            popupOpen();
        			    	//kelim.popup("open");
        			    	//kelim.popup();
        			     	//$(".product_list").find("li").off("click");
        			    },
        			    error: function (request, status, error){
        			        var msg = "ERROR : " + request.status + "<br>"
        			      msg +=  + "내용 : " + request.responseText + "<br>" + error;
        			    }
        			  });
        	   }
            });
            // customer - library
            $(".popup_open").on("click", function(){
                popupOpen();
            });
            if(open == "open") {
            	popupOpen();
            }
        },
        init : function(){
            kelim.common();
            kelim.placeholder();
            kelim.popup();
        }
   }
   kelim.init();

