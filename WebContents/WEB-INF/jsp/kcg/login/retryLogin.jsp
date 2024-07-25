<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
<body></body>

<script type="text/javascript" src="/static_resources/system/js/lib/jquery/jquery.1.12.4.js?rscVer=${properties.rscVer}"></script>
<!-- 	<script type="text/javascript" src="/static_resources/portal/js/lib/jquery/jquery.cookies.js"></script> -->
<script type="text/javascript" src="/static_resources/system/js/swiper.min.js?rscVer=${properties.rscVer}"></script>
<script type="text/javascript" src="/static_resources/system/js/jquery.mCustomScrollbar.js?rscVer=${properties.rscVer}"></script>
<script type="text/javascript" src="/static_resources/system/js/TweenMax.js?rscVer=${properties.rscVer}"></script>
<script type="text/javascript" src="/static_resources/system/js/script.js?rscVer=${properties.rscVer}"></script>

<script src="/static_resources/lib/vue/2.6.12/vue.min.js"></script>
<script src="/static_resources/lib/babel-polyfill/7.4.4/polyfill.min.js"></script>
<script src="/static_resources/lib/axios/0.21.0/axios.min.js"></script>
<script src="/static_resources/js/commonLib.js?rscVer=${properties.rscVer}"></script>
<script src="/static_resources/js/prototype_polyfill.js?rscVer=${properties.rscVer}"></script>

<script>

	var login_conf = cv_sessionStorage.getItem("login_conf");
	if(login_conf.try_cnt > 3){
		location.href = "/login";
	} else {
		login_conf.try_cnt = login_conf.try_cnt + 1;
	}
	
	cv_sessionStorage
		.setItem('login_conf', login_conf)
		;

	var form = document.createElement("form");
	form.setAttribute("charset", "UTF-8");
	form.setAttribute("method", "Post");
	form.setAttribute("action", "/login/proc");
	
	var hiddenField_01 = document.createElement("input");
	hiddenField_01.setAttribute("type", "hidden");
	hiddenField_01.setAttribute("name", "iam_yn");
	hiddenField_01.setAttribute("value", login_conf.iam_yn);
	form.appendChild(hiddenField_01);
	
	var hiddenField_02 = document.createElement("input");
	hiddenField_02.setAttribute("type", "hidden");
	hiddenField_02.setAttribute("name", "usr_id");
	hiddenField_02.setAttribute("value", login_conf.usr_id);
	form.appendChild(hiddenField_02);
	
	var hiddenField_03 = document.createElement("input");
	hiddenField_03.setAttribute("type", "hidden");
	hiddenField_03.setAttribute("name", "usr_pw");
	hiddenField_03.setAttribute("value", login_conf.usr_pw);
	form.appendChild(hiddenField_03);
	
	var hiddenField_04 = document.createElement("input");
	hiddenField_04.setAttribute("type", "hidden");
	hiddenField_04.setAttribute("name", "ubi");
	hiddenField_04.setAttribute("value", login_conf.ubi);
	form.appendChild(hiddenField_04);
	
	document.body.appendChild(form);
	
	setTimeout(
		function(){
			form.submit();
		}, 500);
</script>
</html>