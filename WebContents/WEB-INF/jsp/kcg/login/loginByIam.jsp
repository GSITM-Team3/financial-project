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

	var ubi_ori = encodeURIComponent("${ubi_ori}")

	sessionStorage.setItem("ubi_ori", ubi_ori);

	var auth_menulist;
    var params = {
			usr_id : "",
			usr_pw : "",
			ubi_ori : ubi_ori,
    	}
    
    cf_ajax("/login/proc", params, function(data){
    	if("SUCC_CLIENT" === data.rslt){
    		location.href = "/";
    	} else {
    		location.href = "/login";
    	}
    });
	
	
	
</script>
</html>