<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<html>
<head>
<!-- CSS -->
<link rel="stylesheet" href="../static_resources/gis/css/core.css" type="text/css">
<link rel="stylesheet" href="../static_resources/gis/css/kcgGIS.css" type="text/css">
<link rel="stylesheet" href="../static_resources/gis/css/lib/jquery-ui.css" type="text/css">
<link rel="stylesheet" href="../static_resources/gis/css/lib/jquery-ui.theme.css" type="text/css">
<link rel="stylesheet" href="../static_resources/gis/css/lib/jquery.bxslider.css" type="text/css">
<link rel="stylesheet" href="../static_resources/gis/css/lib/jquery.mCustomScrollbar.min.css" type="text/css">
<!-- 공용 js -->
<script src="../static_resources/gis/js/lib/jquery-3.4.1.min.js" type="text/javascript"></script>

<!-- 기능테스트 --><!-- 
<script src="../static_resources/gis/js/objectMovement.js" type="text/javascript"></script> -->

<title>GIS</title>
</head>
<body>
<!-- 왼쪽사이드바 -->
<div>

</div>

<!-- 지도 -->
	<canvas id="canvas" oncontextmenu="event.preventDefault()"></canvas>
</body>
<!-- 모듈 -->
<script src="../static_resources/gis/js/module.js" type="text/javascript"></script>
</html>
