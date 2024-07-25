<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!--// location 시작 -->
<div class="location">
	<a href="#none" onclick="cf_movePage('/')" class="home"><img src="/static_resources/system/images/location_home.png" alt="전체 메뉴 창 닫기 버튼"/></a>
	<div class="oneD one">
		<a href="javascript:" id="locationMenu_a"><span id="locationMenuName0">데이터 찾기</span></a>
		<div class="twoD" id="locationMenuContainer0">
			<a href="#none" onclick="changgnb(1)">이용안내</a>
			<a href="#none" onclick="changgnb(2)">데이터 찾기</a>
			<a href="#none" onclick="changgnb(3)">데이터 활용</a>
<!-- 			<a href="#none" onclick="changgnb(4)">신청하기</a> -->
			<a href="#none" onclick="changgnb(5)">데이터 공유</a>
			<a href="#none" onclick="changgnb(6)">소통/참여</a>
			<a href="#none" onclick="changgnb(7)">마이페이지</a>
		</div>
	</div>
	<div class="oneD two">
		<a href="javascript:"><span id="locationMenuName1" style="font-weight:bold">데이터 맵</span></a>
		<div class="twoD" id="locationMenuContainer1">
		</div>
	</div>
</div>
<script>
var subnavgnb = [
	{idx : 1, name : "이용안내"},
	{idx : 2, name : "데이터 찾기"},
	{idx : 3, name : "데이터 활용"},
// 	{idx : 4, name : "신청하기"},
	{idx : 5, name : "데이터 공유"},
	{idx : 6, name : "소통/참여"},
	{idx : 7, name : "마이페이지"},
];

var subnavlnb = [
	{gnbidx : 1, url : "/introduce", name : "포털소개"},
	{gnbidx : 1, url : "/guid/createBehind", name : "제작 비하인드"},
	{gnbidx : 1, url : "/guid/help", name : "도움말"},
	
	{gnbidx : 2, url : "/search/dataMap", name : "데이터 맵"},
	{gnbidx : 2, url : "/search/dataSearch", name : "데이터 검색"},
	{gnbidx : 2, url : "/req/dataCollect", name : "데이터 수집 신청"},
	
	{gnbidx : 3, url : "/use/tableau", name : "통합 분석"},
	{gnbidx : 3, url : "/use/textAnal", name : "분석도구 체험하기"},
	{gnbidx : 3, url : "/use/wordCloud", name : "워드 클라우드"},
	{gnbidx : 3, url : "/use/gisAnal", name : "공간정보 활용"},
	
	{gnbidx : 4, url : "/req/dataCollect", name : "데이터 수집 신청"},
	{gnbidx : 4, url : "/req/dataAnal", name : "데이터 분석 신청"},
	{gnbidx : 4, url : "/req/analTool", name : "분석 도구 사용 신청"},
	
// 	{gnbidx : 5, url : "/share/useExample/list", name : "활용사례"},
	{gnbidx : 5, url : "/share/dataVisualization/list", name : "시각화 갤러리"},
	{gnbidx : 5, url : "/share/analIdea/list", name : "데이터 소통방"},
	{gnbidx : 5, url : "/share/doc", name : "공유 문서 등록"},
	
	
	{gnbidx : 6, url : "/communi/news/list", name : "새소식"},
	{gnbidx : 6, url : "/communi/library/list", name : "자료실"},
	{gnbidx : 6, url : "/communi/inquire/list", name : "문의하기"},
	{gnbidx : 6, url : "/communi/bigdataTrend/list", name : "빅데이터 동향"},
//	{gnbidx : 6, url : "/communi/lectureVideo", name : "강의 영상"},
	
	{gnbidx : 7, url : "/mypage/dashboard", name : "대시보드"},
	{gnbidx : 7, url : "/mypage/reqDataCollectStatus/list", name : "수집 신청 내역"},
// 	{gnbidx : 7, url : "/mypage/reqDataAnalStatus/list", name : "분석 신청 내역"},
	{gnbidx : 7, url : "/mypage/reqAnalToolStatus/list", name : "분석 도구 신청 내역"},
	{gnbidx : 7, url : "/mypage/reqDnldStatus/list", name : "다운로드 신청 내역"},
	{gnbidx : 7, url : "/mypage/board/list", name : "게시 글 내역"},
	{gnbidx : 7, url : "/mypage/inquireStatus/list", name : "문의 내역"},
	{gnbidx : 7, url : "/mypage/allocDnldReqStatus/list", name : "배당된 다운로드 현황"},
];

function changgnb(gnbidx){
	var subnavgnb_target = subnavgnb.getElementFirst("idx", gnbidx);
	$("#locationMenuName0").text(subnavgnb_target.name);
	
	var subnavlnb_list = subnavlnb.getElementList("gnbidx", gnbidx);
	var tmphtml = "";
	for(var i=0; i<subnavlnb_list.length; i++){
		tmphtml += '<a href="#none" onclick="cf_movePage(\'' + subnavlnb_list[i].url + '\')">' + subnavlnb_list[i].name + '</a>';
	}
	$("#locationMenuContainer1").html(tmphtml);	
	$("#locationMenuName1").text(subnavlnb_list[0].name);
	
	$("#locationMenu_a").removeClass("on");
	$("#locationMenuContainer0").css("display", "none");
	$("#locationMenuContainer0").css("z-index", "0");
	
}

var locpathname = location.pathname;

var cursubnav = subnavlnb.getElementFirst("url", locpathname);

// 만약 서브 메뉴가 조회되지 않는다면 상세페이지등 다른 url이 되므로 2단계 depts로 맞추어 조회하여 메뉴를 찾는다. 
if(!cursubnav){
	var locpathnameArray = locpathname.split('/',-1);	
	var locpathnameTemp = "/"+locpathnameArray[1] +"/"+locpathnameArray[2];
	cursubnav = subnavlnb.filter((element, index, source) => {		
		var elementUrlArray = (element.url).split('/',-1);	
		var elementTemp = "/"+elementUrlArray[1] +"/"+elementUrlArray[2];
		return locpathnameTemp === elementTemp;		
	})[0];		
}
changgnb(cursubnav.gnbidx);
$("#locationMenuName1").text(cursubnav.name);

</script>
<!--// location 끝 -->