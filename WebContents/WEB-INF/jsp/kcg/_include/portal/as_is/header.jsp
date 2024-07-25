<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="wrap">
	<!-- /top menu -->
	<div class="topmenu">
	    <h1>
	        <a href="/portal">해양경찰 <span>통합 Data-Hub</span></a>
	        <!--img src="/static_resources/system/images/img_betaService.png" alt="beta Service" style="position: relative; top: 3px; left: 10px;" /-->
	    </h1>
		<div class="gnb dropdown">
			<ul>
			  <li class="menu">
				<div class="depth1"><a href="#none">이용안내</a></div>
				<div class="depth2">
				  <ul>
					<li id="about"><a href="javascript:void(0);" onclick="fn_introduce()">포털 소개</a></li>
					<li><a href="#none">도움말</a></li>
				  </ul>
				</div>
			  </li>
			  <li class="menu">
				<div class="depth1"><a href="#none">데이터 찾기</a></div>
				<div class="depth2">
				  <ul>
					<li id="dataMap"><a href="javascript:void(0);" onclick="fn_datamap()">데이터 맵</a></li>
					<li id="dataSearch"><a href="javascript:void(0);" onclick="fn_ind()">데이터셋 검색</a></li>
					<li id="openData"><a href="javascript:void(0);" onclick="fn_exd()">공개문서 데이터</a></li>
				  </ul>
				</div>
			  </li>
			  <li class="menu">
				<div class="depth1"><a href="#none">데이터 활용</a></div>
				<div class="depth2">
				  <ul>
					<li>
					  <a href="#none" onclick="fn_tableau()">통계 정보</a>
					</li>
					<li>
					  <a href="#none" onclick="fn_goto_gis()">공간 정보 활용</a>
					</li>
					<li>
					  <a href="#none">분석 도구 사용 신청</a>
					</li>
				  </ul>
				</div>
			  </li>
			  <li class="menu">
				<div class="depth1"><a href="#none">데이터 공유</a></div>
				<div class="depth2">
					<ul>
					    <li><a href="#none">시각화 갤러리</a></li>
						<li><a href="#none">데이터 소통방</a></li>
						<li><a href="#none">공유 문서 등록</a></li>
					</ul>
				  </div>
			  </li>
			  <li class="menu">
				<div class="depth1"><a href="#none">소통·참여</a></div>
				<div class="depth2">
					<ul>
					  <li><a href="#none">세 소식</a></li>
					  <li><a href="#none">자료실</a></li>
					  <li><a href="#none">문의하기</a></li>
					  <li><a href="#none">빅데이터 동향</a></li>
					</ul>
				  </div>
			  </li>
			</ul>
		  </div>
	    <!--div class="gnb">
	        <ul>
	            <li id="about"><a href="javascript:void(0);" onclick="fn_introduce()">소개</a></li>
	            <li id="dataSearch"><a href="javascript:void(0);" onclick="fn_ind()">데이터셋 검색</a></li>
	            <li id="openData"><a href="javascript:void(0);" onclick="fn_exd()">공개문서 데이터</a></li>
	            <li id="dataUse"><a href="javascript:void(0);" onclick="fn_anal()">데이터 활용</a></li>
	            <li><a href="javascript:void(0);" onclick="fn_gis('http://10.188.141.74:28089/xdWorld/')">GIS</a></li>
	            <li id="video"><a href="javascript:void(0);" onclick="fn_video()">강의 영상</a></li>
	        </ul>
	    </div-->
	    <!-- <div class="howTouse"><a href="#">이용안내</a></div> -->
	</div>
	<!-- //top menu -->
</div>

<script type="text/javascript">
	// logo 버튼
	function fn_main() {
		location.href = "/";
	}
	
	// 소개 버튼
	function fn_introduce() {
		location.href = "/portal/introduce";
	}
	
	// 데이터 검색 버튼
	function fn_ind() {
		location.href = "/portal/internalData";
	}
	
	// 데이터 수집 버튼
	function fn_exd(value) {
		if(value == undefined || value == null){
			value = '';
		}
		location.href = "/portal/externalData/list?keyword="+value;
	}
	
	// 데이터 활용 버튼
	function fn_anal() {
		location.href = "/portal/analysisResult/info";
	}
	
	// gis 버튼
	function fn_goto_gis() {
		location.href = "/use/gisAnal/portal";
	}
	
	// tableau 버튼
	function fn_tableau() {
		location.href = "/use/tableau/portal";
	}
	
	function fn_datamap(){
		location.href = "/search/dataMap/portal";
	}
	
    function fn_gis(dataurl) {
    	var str = 'GIS 화면은 chrome 브라우저에 최적화 되어 있습니다.\n타 브라우저에서는 다소 느릴 수 있습니다.\n\nchrome 브라우저를 다운로드 받으시겠습니까?';
    	
    	var userAgent = window.navigator.userAgent.toLowerCase(); //크롬일 경우 isChrome에는 Chrome이라는 문잘의 위치 값이 반환되고 크롬이 아닐경우는 //-1이 반환된다. 나머지도 동일 
    	var isChrome = userAgent.indexOf('chrome')

    	if(isChrome > -1) { 
    		window.open(dataurl , '_blank');
    	} else { 
    		if (window.confirm(str)) {
    			location.href = "/fileDown.jsp?fId=chrome";
            } else {
                window.open(dataurl , '_blank');
            }
    	}
    }
	
	// 강의 영상 버튼
	function fn_video() {
		location.href = "/portal/video";
	}
	
	// 이용가이드 window popup
	function fn_useGuid() {
		var popup = window.open('/userGuide/read', '이용가이드', 'width=700px,height=800px,scrollbars=yes');
	}
	
	/* 스크롤시 헤더 영역 색상 변경 */
	$(window).scroll(function(event){
		// 스크롤 발생시
		if($(window).scrollTop() > 0){
			$(".topmenu").css("background-color", "#242a35");
		// 스크롤이 최상단인 경우
		}else{
			$(".topmenu").css("background-color", "rgba(0,0,0,.5)");
		}
	});
</script>