//맵 툴바_오른쪽 사이드 버튼
$(function () {
	//map_tools 레이어 자식 버튼
	 $("#layer_sub li button").click(function(){
		 var thisClass=$(this).attr("class");
		 if($(this).hasClass("active")){
			$(this).removeClass("active");
			thisClass=$(this).attr("class");
			basicLayerOnOff(thisClass,false);
		}else{
			$(this).addClass("active");
			basicLayerOnOff(thisClass,true);
		}
	  });
	 
	//map_tools 도구 자식 버튼
	 $("#tool_sub li button").click(function(){
		var activeFlag=!$(this).hasClass("active");

		$('#tool_sub li button').removeClass('active');
			
		 Module.XDSetMouseState(6);
		 var thisClass=$(this).attr("class");

		 if(thisClass=="s_4"){
			 if(activeFlag){
				 $(this).addClass('active');
			 }else{
				 $(this).removeClass('active');
			 }
			 measureDistance(activeFlag);
		 }else if(thisClass=="s_5"){
			 if(activeFlag){
				 $(this).addClass('active');
			 }else{
				 $(this).removeClass('active');
			 }
			 measureArea(activeFlag);
		 }else if(thisClass=="s_6"){
			 downloadMapImage();
		 }else if(thisClass=="s_7"){
			 initToolbar();
			 $('#layer_search_dt').removeClass('active');
			 $('#layer_grid_dt').removeClass('active');
			 $('#contrast_dt').removeClass('active');
			 //clearMeasurement();
			 //searchAreaDataInit();
		 }else if(thisClass=="s_11"){
			 if(activeFlag){
				 $(this).addClass('active');
			 }else{
				 $(this).removeClass('active');
			 }
			 measureAltitude(activeFlag);
		 }else if(thisClass=="s_1"){
			 if(activeFlag){
				 $(this).addClass('active');
			 }else{
				 $(this).removeClass('active');
			 }
			 measureCoord(activeFlag);
		 }
	  });
	 
		//map_tools 기상 자식 버튼
	 $("#weather_sub li button").click(function(){
		 var thisClass=$(this).attr("class");
		 if($(this).hasClass("active")){
			$(this).removeClass("active");
			thisClass=$(this).attr("class");
		}else{
			$(this).addClass("active");
		}
	  });

	 $("#t_3").click(function(){
		if(!$("#t_3").hasClass('active')){
		 $(".wth_select").addClass('hide');
	 }
	 });
	 
});

//레이어 탭 레이어 온오프
function basicLayerOnOff(kind,type){
	if(kind=="s_1"){
	falseLayerList.nameAtLayer("poi_base").setVisible(type);
	falseLayerList.nameAtLayer("poi_bound").setVisible(type);
	falseLayerList.nameAtLayer("poi_road").setVisible(type);
	}else if(kind=="s_2"){
	falseLayerList.nameAtLayer("facility_build").setVisible(type);	
	}else if(kind=="s_3"){
	falseLayerList.nameAtLayer("facility_bridge").setVisible(type);	
	}
}