<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List"  %>
<%@ page import="kcg.login.vo.MenuVO"  %>
<%@ page import="kcg.login.vo.UserInfoVO"  %>
<%@ page import="common.utils.json.JsonUtil"  %>
<%
	UserInfoVO userInfoVO = (UserInfoVO)session.getAttribute("userInfoVO");
	List<MenuVO> menuList = userInfoVO.getMenuList();
	String jsn_menuList = JsonUtil.toJsonStr(menuList);
%>
<script>
var auth_menulist = <%=jsn_menuList%>
</script>
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="Neon Admin Panel" />
<meta name="author" content="" />

<link rel="icon" href="/static_resources/system/images/favicon.ico">

<link rel="stylesheet" href="/static_resources/system/js/jquery-ui/css/no-theme/jquery-ui-1.10.3.custom.min.css">
<link rel="stylesheet" href="/static_resources/system/css/font-icons/entypo/css/entypo.css">
<link rel="stylesheet" href="/static_resources/lib/fonts/font-awesome-4.7.0/css/font-awesome.css">
<link rel="stylesheet" href="/static_resources/system/css/bootstrap.css">
<link rel="stylesheet" href="/static_resources/system/css/neon-core.css?rscVer=${properties.rscVer}">
<link rel="stylesheet" href="/static_resources/system/css/neon-theme.css">
<link rel="stylesheet" href="/static_resources/system/css/neon-forms.css">
<link rel="stylesheet" href="/static_resources/system/css/custom.css?rscVer=${properties.rscVer}">

<style>
td.center {
	text-align: center;
}
th.center {
	text-align: center;
}
body {
	font-size: 14px;
}
</style>

<script src="/static_resources/system/js/jquery-1.11.3.min.js"></script>

<!--[if lt IE 9]><script src="/static_resources/system/js/ie8-responsive-file-warning.js"></script><![endif]-->

<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->


<!-- Bottom scripts (common) -->
<script src="/static_resources/system/js/gsap/TweenMax.min.js"></script>
<script src="/static_resources/system/js/jquery-ui/js/jquery-ui-1.10.3.minimal.min.js"></script>
<script src="/static_resources/lib/vue/2.6.12/vue.min.js"></script>
<script src="/static_resources/lib/babel-polyfill/7.4.4/polyfill.min.js"></script>
<script src="/static_resources/system/js/bootstrap.js"></script>
<script src="/static_resources/system/js/joinable.js"></script>
<script src="/static_resources/system/js/resizeable.js"></script>
<script src="/static_resources/system/js/neon-api.js?rscVer=${properties.rscVer}"></script>
<script src="/static_resources/system/js/jvectormap/jquery-jvectormap-1.2.2.min.js"></script>
<script src="/static_resources/system/js/bootstrap-datepicker.js"></script>
<script src="/static_resources/system/js/bootstrap-datepicker.ko.js"></script>
	

<!-- JavaScripts initializations and stuff -->
<script src="/static_resources/system/js/neon-custom.js"></script>

<!-- Demo Settings -->
<script src="/static_resources/system/js/neon-demo.js"></script>


<script src="/static_resources/lib/vue/2.6.12/vue.min.js"></script>
<script src="/static_resources/lib/babel-polyfill/7.4.4/polyfill.min.js"></script>
<script src="/static_resources/lib/axios/0.21.0/axios.min.js"></script>
<script src="/static_resources/js/commonLib.js?rscVer=${properties.rscVer}"></script>
<script src="/static_resources/js/prototype_polyfill.js?rscVer=${properties.rscVer}"></script>
