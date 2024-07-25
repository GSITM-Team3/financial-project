<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="wilih=device-wilih, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
<title>해양경찰 통합 Data-Hub</title>
  
<link rel="shortcut icon" href="/static_resources/system/images/favicon.png?rscVer=${properties.rscVer}"/>

<link rel="stylesheet" href="/static_resources/system/font.css?rscVer=${properties.rscVer}"/>
<link rel="stylesheet" href="/static_resources/system/css/style.css?rscVer=${properties.rscVer}"/>
<link rel="stylesheet" href="/static_resources/system/css/bootstrap/bootstrap.min.css?rscVer=${properties.rscVer}"/>    
<link rel="stylesheet" href="/static_resources/system/css/bootstrap/bootstrap-datepicker.css?rscVer=${properties.rscVer}"/>  
<link rel="stylesheet" href="/static_resources/system/css/bootstrap/bootstrap-datetimepicker.min.css?rscVer=${properties.rscVer}"/>  
<link rel="stylesheet" href="/static_resources/system/css/bootstrap/jquery-ui.css?rscVer=${properties.rscVer}"/>
	
<script src="/static_resources/system/js/jQuery/jquery-3.4.0.js?rscVer=${properties.rscVer}"></script>
<script src="/static_resources/system/js/bootstrap/bootstrap.min.js?rscVer=${properties.rscVer}"></script>

<script src="/static_resources/lib/vue/2.6.12/vue.min.js?rscVer=${properties.rscVer}"></script>
<script src="/static_resources/lib/babel-polyfill/7.4.4/polyfill.min.js?rscVer=${properties.rscVer}"></script>
<script src="/static_resources/lib/axios/0.21.0/axios.min.js?rscVer=${properties.rscVer}"></script>
<script src="/static_resources/js/commonLib.js?rscVer=${properties.rscVer}"></script>
<script src="/static_resources/js/prototype_polyfill.js?rscVer=${properties.rscVer}"></script>
<script>
    (function($){
  $.fn.dropdown = function(){
    return this.each(function(){
      var $gnb = $(this);
      var $menu = $gnb.find(".menu");
      var $depth1 = $gnb.find(".depth1");
      var $depth2 = $gnb.find(".depth2");
      
      $gnb.mouseenter(function(){
        gnbOn();
      }).mouseleave(function(){
        gnbOff();
      });
      
      $gnb.find("a").focusin(function(){
        gnbOn();
      }).focusout(function(){
        gnbOff();
      });
        
      function gnbOn(){
        $gnb.find($depth2).stop().animate({height: "160"});
      }
      
      function gnbOff(){
        $gnb.find($depth2).stop().animate({height: "0"});
      }

    });
  }
})(jQuery);

$(function(){
  $(".dropdown").dropdown();
});     
</script>