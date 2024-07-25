<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<%@ page import="java.util.List" %>
			<%@ page import="kcg.login.vo.MenuVO" %>
				<%@ page import="kcg.login.vo.UserInfoVO" %>
					<%@ page import="common.utils.json.JsonUtil" %>
						<% UserInfoVO userInfoVO=(UserInfoVO)session.getAttribute("userInfoVO"); 
						    String jsn_menuList=""; 
						    if(userInfoVO !=null){ 
						    	List<MenuVO> menuList = userInfoVO.getMenuList();
								jsn_menuList = JsonUtil.toJsonStr(menuList);
							} 
							%>
							<script>
								var auth_menulist = <%=jsn_menuList%>
							</script>
							<meta charset="utf-8">
							<meta http-equiv="X-UA-Compatible" content="IE=edge">
							<meta name="viewport"
								content="wilih=device-wilih, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
							<title>GS 부트캠프 - 환영합니다.</title>

							<link rel="shortcut icon"
								href="/static_resources/system/images/gsitm.jpg" />

							<link rel="stylesheet"
								href="/static_resources/system/css/font.css?rscVer=${properties.rscVer}" />
							<link rel="stylesheet"
								href="/static_resources/system/css/style.css?rscVer=${properties.rscVer}" />
							<link rel="stylesheet"
								href="/static_resources/system/css/style2.css?rscVer=${properties.rscVer}" />
							<link rel="stylesheet"
								href="/static_resources/system/css/common.css?rscVer=${properties.rscVer}" />
							<!--link rel="stylesheet" href="/static_resources/system/css/bootstrap/bootstrap.min.css?rscVer=${properties.rscVer}"/-->
							<link rel="stylesheet"
								href="/static_resources/system/css/bootstrap/bootstrap-datepicker.css?rscVer=${properties.rscVer}" />
							<link rel="stylesheet"
								href="/static_resources/system/css/bootstrap/bootstrap-datetimepicker.min.css?rscVer=${properties.rscVer}" />
							<link rel="stylesheet"
								href="/static_resources/system/css/bootstrap/jquery-ui.css?rscVer=${properties.rscVer}" />
							<!-- 조성숙 추가-->
							<link rel="stylesheet"
								href="/static_resources/system/css/common.css?rscVer=${properties.rscVer}" />
							<link rel="stylesheet"
								href="/static_resources/system/css/font.css?rscVer=${properties.rscVer}" />
							<link rel="stylesheet"
								href="/static_resources/system/css/main.css?rscVer=${properties.rscVer}" />
							<link rel="stylesheet"
								href="/static_resources/system/css/swiper.min.css?rscVer=${properties.rscVer}" />

							<script
								src="/static_resources/system/js/jQuery/jquery-3.4.0.js?rscVer=${properties.rscVer}"></script>
							<script
								src="/static_resources/system/js/bootstrap/bootstrap.min.js?rscVer=${properties.rscVer}"></script>

							<script type="text/javascript"
								src="/static_resources/system/js/lib/jquery/jquery.1.12.4.js?rscVer=${properties.rscVer}"></script>
							<!-- 	<script type="text/javascript" src="/static_resources/system/js/lib/jquery/jquery.cookies.js"></script> -->
							<script type="text/javascript"
								src="/static_resources/system/js/swiper.min.js?rscVer=${properties.rscVer}"></script>
							<script type="text/javascript"
								src="/static_resources/system/js/jquery.mCustomScrollbar.js?rscVer=${properties.rscVer}"></script>
							<script type="text/javascript"
								src="/static_resources/system/js/TweenMax.js?rscVer=${properties.rscVer}"></script>
							<!--script type="text/javascript" src="/static_resources/system/js/script.js?rscVer=${properties.rscVer}"></script-->

							<script
								src="/static_resources/lib/vue/2.6.12/vue.min.js?rscVer=${properties.rscVer}"></script>
							<script
								src="/static_resources/lib/babel-polyfill/7.4.4/polyfill.min.js?rscVer=${properties.rscVer}"></script>
							<script
								src="/static_resources/lib/axios/0.21.0/axios.min.js?rscVer=${properties.rscVer}"></script>
							<script src="/static_resources/js/commonLib.js?rscVer=${properties.rscVer}"></script>
							<script
								src="/static_resources/js/prototype_polyfill.js?rscVer=${properties.rscVer}"></script>

							<!-- 조성숙 추가 -->
							<script src="/static_resources/system/js/jquery-1.12.4.min.js?rscVer=${properties.rscVer}"
								type="text/javascript"></script>
							<script src="/static_resources/system/js/jquery.easing.1.3.js?rscVer=${properties.rscVer}"
								type="text/javascript"></script>
							<script src="/static_resources/system/js/ui.js?rscVer=${properties.rscVer}"
								type="text/javascript"></script>
							<script src="/static_resources/system/js/viewportchecker.js?rscVer=${properties.rscVer}"
								type="text/javascript"></script>



							<!--style type="text/css">
.popup_chkchrome{
	display:none;
	width:100%;
	height:100%;
	z-index:10;
	padding:20px 10px;
	width: 600px;
	height: 400px;
	position: fixed;
	top: 50%;
	left: 50%;
	margin: -200px 0 0 -300px;
	background-color: #f7f7f7;
	z-index:999;
	border-radius: 5px;
	border:4px solid #0b4094;
}
.backon2{
	content: "";
	width: 100%;
	height: 100%;
	background-color: lightgrey;
	opacity : 0.5;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 800;
}

</style-->

							<div id="popup_chkchrome">
								<div class="pop_top">
									<div class="pop_tit"> GS-ITM 금융Project 부트캠프는 Crome 브라우저에 최적화되어 있습니다.
									</div>
									<!--div class="close" @click="closeSet">×</div-->
								</div>
								<div class="pop_con">
									<table>
										<tbody>
											<tr>
												정상적인 이용을 위해선 크롬브라우저 설치 후 아래 url을 복사하여 주소 창에 넣으세요.
											<tr>
												<td style="margin-right:20px">
													<input type="text" id="chromeurl" value=""; readonly>
												</td>
												<!--td>
													<button class="b2" onclick="copyText()">&nbsp;복사</button>
													<button onClick="text_clip(document.getElementById('chromeurl').innerHTML)">복사</button>
												</td-->
											</tr>
											</tr>
										</tbody>
									</table>
								</div>
								<div class="foot">
									<ul>
										<!--a href="/fileDown.jsp?fId=chrome"></a-->
										<button class="b2" onclick="window.open('/fileDown.jsp?fId=chrome')">
											<img src="/static_resources/system/images/check.png"
												alt="체크" />&nbsp;Crome 브라우저 다운로드
										</button>
									</ul>
								</div>
							</div>
							</div>

							<script>
								
							/*
							if (window.location.pathname.indexOf("login") != -1) {
								$("#chromeurl").val("https://data.kcg.go.kr/login");
							} else {
								$("#chromeurl").val("https://data.kcg.go.kr?ubi=${ubi_ori}");
							}
							*/
								$(function () {
									if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (navigator.userAgent.indexOf("msie") != -1)) { // IE 일 경우	
										
										var ubi_ori = sessionStorage.getItem("ubi_ori");
										//alert(ubi_ori);
									
										if (ubi_ori == '' || ubi_ori == undefined || ubi_ori == null || ubi_ori == 'null' || ubi_ori == 'undefined') { // 체킹방법 고민필요...
											$("#chromeurl").val("https://data.kcg.go.kr/login");
										} else {
											$("#chromeurl").val("https://data.kcg.go.kr?ubi="+ubi_ori);
										}
									
										
										
										
										$("#popup_chkchrome").show();   //팝업 오픈
										$("body").append('<div class="backon"></div>'); //뒷배경 생성	
									}


									$.fn.dropdown = function () {
										return this.each(function () {
											var $gnb = $(this);
											var $menu = $gnb.find(".menu");
											var $depth1 = $gnb.find(".depth1");
											var $depth2 = $gnb.find(".depth2");

											$gnb.mouseenter(function () {
												gnbOn();
											}).mouseleave(function () {
												gnbOff();
											});

											$gnb.find("a").focusin(function () {
												gnbOn();
											}).focusout(function () {
												gnbOff();
											});

											function gnbOn() {
												$gnb.find($depth2).stop().animate({ height: "280" });
											}

											function gnbOff() {
												$gnb.find($depth2).stop().animate({ height: "0" });
											}

										});
									}

									$(".dropdown").dropdown();
								});     
							</script>