<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ page import="java.util.List"  %>
<%@ page import="kcg.login.vo.MenuVO"  %>
<%@ page import="kcg.login.vo.UserInfoVO"  %>
<%@ page import="common.utils.json.JsonUtil"  %>
<%
	UserInfoVO userInfoVO = (UserInfoVO)session.getAttribute("userInfoVO");
	List<MenuVO> menuList = userInfoVO.getMenuList();
	String jsn_menuList = JsonUtil.toJsonStr(menuList);
%>

	<!-- 상단 -->
	<div id="header">
		<div class="top">
			<div class="inner">
				<div class="logo">
					<a href="/">
						<span class="bg"></span>
						<h1 class="t"><span>::</span><span>통합 Data-Hub</span></h1>
					</a>
				</div>

				<div class="user_profile" style="cursor: pointer;">
					<p onclick="f_gotomypage()"><span class="lv"> ${userInfoVO.name} </span>님 반갑습니다.</p>
					<span class="img" alter="로그아웃" onclick="goto_logout();"></span>
				</div>
			</div>
		</div>
		<div id="gnb">
			<ul>
				<li>
					<a href="javascript:void(0);" onclick="cf_movePage('/introduce')">이용안내</a>
					<div class="depth">
						<ul>
							<li id="about"><a href="javascript:void(0);" onclick="cf_movePage('/introduce')">포털 소개</a></li>
							<li><a href="#none" onclick="cf_movePage('/guid/createBehind')">제작 비하인드</a></li>
							<li><a href="#none" onclick="cf_movePage('/guid/help')">도움말</a></li>
						</ul>
					</div>
				</li>
				<li>
					<a href="javascript:void(0);" onclick="cf_movePage('/search/dataSearch')">데이터 찾기</a>
					<div class="depth">
						<ul>
							<!--li><a href=""><span>데이터 맵</span></a></li>
							<li><a href=""><span>데이터 검색</span></a></li>
							<li><a href=""><span>데이터 수집신청</span></a></li-->
							<li id="dataMap"><a href="javascript:void(0);" onclick="cf_movePage('/search/dataMap')">데이터 맵</a></li>
							<!--li id="dataSearch"><a href="javascript:void(0);" onclick="cf_movePage('/search/internalData')">데이터셋 검색</a></li>
							<li id="openData"><a href="javascript:void(0);" onclick="cf_movePage('/search/externalData/list')">공개문서 데이터</a></li-->
							<li id="openData"><a href="javascript:void(0);" onclick="cf_movePage('/search/dataSearch')">데이터 검색</a></li>
							<li id="openData"><a href="javascript:void(0);" onclick="cf_movePage('/req/dataCollect')">데이터 수집신청</a></li>
						</ul>
					</div>
				</li>
				<li>
					<a href="#none" onclick="cf_movePage('/use/tableau')">데이터 활용</a>
					<div class="depth">
						<ul>
							<!--li><a href=""><span>통계정보</span></a></li>
							<li><a href=""><span>텍스트 분석</span></a></li>
							<li><a href=""><span>공간정보활용</span></a></li>
							<li><a href=""><span>분석도구 사용신청</span></a></li-->
							<li><a href="#none" onclick="cf_movePage('/use/tableau')">통합 분석</a></li>
							<li><a href="#none" onclick="cf_movePage('/use/textAnal')">분석도구 체험하기</a></li>
							<li><a href="#none" onclick="cf_movePage('/use/wordCloud')">워드 클라우드</a></li>
							<li><a href="#none" onclick="cf_movePage('/use/gisAnal')">공간 정보 활용</a></li>
							<li><a href="#none" onclick="cf_movePage('/req/analTool')">분석 도구 사용 신청</a></li>
						</ul>
					</div>
				</li>
				<li>
					<a href="#none" onclick="cf_movePage('/share/dataVisualization/list')">데이터 공유</a>
					<div class="depth">
						<ul>
							<!--li><a href=""><span>시각화 갤러리</span></a></li>
							<li><a href=""><span>데이터 소통방</span></a></li>
							<li><a href=""><span>공유문서등록</span></a></li-->
							<li><a href="#none" onclick="cf_movePage('/share/dataVisualization/list')">시각화 갤러리</a></li>
							<li><a href="#none" onclick="cf_movePage('/share/analIdea/list')">데이터 소통방</a></li>
							<li><a href="#none" onclick="cf_movePage('/share/doc')">공유 문서 등록</a></li>
						</ul>
					</div>
				</li>
				<li>
					<a href="#none" onclick="cf_movePage('/communi/news/list')">소통ㆍ참여</a>
					<div class="depth">
						<ul>
							<!--li><a href=""><span>새소식</span></a></li>
							<li><a href=""><span>자료실</span></a></li>
							<li><a href=""><span>문의하기</span></a></li>
							<li><a href=""><span>빅데이터 동향</span></a></li>
							<li><a href=""><span>강의 영상</span></a></li-->
							<li><a href="#none" onclick="cf_movePage('/communi/news/list')">새 소식</a></li>
							<li><a href="#none" onclick="cf_movePage('/communi/library/list')">자료실</a></li>
							<li><a href="#none" onclick="cf_movePage('/communi/inquire/list')">문의하기</a></li>
							<li><a href="#none" onclick="cf_movePage('/communi/bigdataTrend/list')">빅데이터 동향</a></li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
		<div id="ly_gnbback">
			<div class="inner"></div>
		</div>
	</div>
	<!-- //상단 -->

<script type="text/javascript">

	function f_gotomypage(){
<%		if(!"Y".equals(userInfoVO.getAdminYn())) {    %>
			cf_movePage('/mypage/dashboard')
<%		} %>
	}
	
	/* 스크롤시 헤더 영역  색상 변경 */
	$(window).scroll(function(event){
		// 스크롤 발생시
		if($(window).scrollTop() > 0){
			$(".topmenu").css("background-color", "#242a35");
		// 스크롤이 최상단인 경우
		}else{
			$(".topmenu").css("background-color", "rgba(0,0,0,.7)");
		}
	});
	
	function goto_logout(){
		if(!confirm("로그아웃 하시겠습니까?")) return;
		
		cf_movePage('/login')
	}
</script>