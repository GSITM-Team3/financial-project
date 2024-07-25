/**
 * 분석서비스 - 대화형 통계(태블로)
 */
$( document ).ready(function() {

	//태블로 변경시
	$('.analysis_tableau_checkbox').change(function (e) {
		
		var thisId = this.id;
		
		//태블로 영역 초기화
		$('#tableau').empty();
		
		//툴바 - 태블로(대조기) 비활성화
		$('#contrast_dt').removeClass("active");
		
		if($(this).is(":checked")){
			var param = {
				};
			
			//운영환경일 시 태블로 티켓받아서 자동로그인
			if(runEnv=="prod"){
				temp_cf_ajax( "/use/gisAnal/getTicket.do",param , function(data){
					var ticket = "";
					ticket=data.ticket;
					//로딩바 숨기기
					if(thisId.split('-')[1]=="coastAccident"){
						//태블로(조직정원) 비활성화
						$('#analysisTableau-organization').prop("checked", false);
						
						var htmlStr="";
							htmlStr+='<div class="tablue" style="position: fixed; top: 130px; width: 70%; height: 800px; right: 70px; background: white; z-index: 150;">';
							htmlStr+="	<div class='tableauPlaceholder' id='viz1639548374133' style='position: relative'>";
							htmlStr+="		<object class='tableauViz' style='display: none;'>";
							htmlStr+="			<param name='host_url' value='"+tableauURL+ticket+"/' />";
							htmlStr+="			<param name='embed_code_version' value='3' />";
							htmlStr+="			<param name='site_root' value='' />";
							htmlStr+="			<param name='name' value='"+tableauCoastAccident+"' />";
							htmlStr+="			<param name='customViews' value='no'/>";
							htmlStr+="			<param name='showShareOptions' value='false' />";
							htmlStr+="			<param name='tabs' value='no' />";
							htmlStr+="			<param name='toolbar' value='no' />";
							htmlStr+="			<param name='animate_transition' value='yes' />";
							htmlStr+="			<param name='display_static_image' value='yes' />";
							htmlStr+="			<param name='display_spinner' value='yes' />";
							htmlStr+="			<param name='display_overlay' value='no' />";
							htmlStr+="			<param name='display_count' value='yes' />";
							htmlStr+="			<param name='language' value='ko-KR' />";
							htmlStr+="		</object>";
							htmlStr+="	</div>";
							htmlStr+="	<script type='text/javascript'>";
							htmlStr+="		var divElement = document.getElementById('viz1639548374133');";
							htmlStr+="		var vizElement = divElement.getElementsByTagName('object')[0];";
							htmlStr+="		if (divElement.offsetWidth > 800) {";
							htmlStr+="			vizElement.style.width = '100%';";
							htmlStr+="			vizElement.style.height = '100%';";
							htmlStr+="		} else if (divElement.offsetWidth > 500) {";
							htmlStr+="			vizElement.style.width = '100%';";
							htmlStr+="			vizElement.style.height = '100%';";
							htmlStr+="		} else {";
							htmlStr+="			vizElement.style.width = '100%';";
							htmlStr+="			vizElement.style.height = '100%';";
							htmlStr+="		}";
							htmlStr+="		var scriptElement = document.createElement('script');";
							htmlStr+="		scriptElement.src = '"+tableauURL+"javascripts/api/viz_v1.js';";
							htmlStr+="		vizElement.parentNode.insertBefore(scriptElement, vizElement);";
							htmlStr+="	</script>";
							htmlStr+="</div>";

							$('#tableau').append(htmlStr);
					}else if(thisId.split('-')[1]=="organization"){
						//태블로(연안사고) 비활성화
						$('#analysisTableau-coastAccident').prop("checked", false);
						
						var htmlStr="";
							htmlStr+='<div class="tablue" style="position: fixed; top: 130px; width: 70%; height: 800px; right: 70px; background: white; z-index: 150;">';
							htmlStr+="	<div class='tableauPlaceholder' id='viz1639549297055' style='position: relative'>";
							htmlStr+="		<object class='tableauViz' style='display: none;'>";
							htmlStr+="			<param name='host_url' value='"+tableauURL+ticket+"/' />";
							htmlStr+="			<param name='embed_code_version' value='3' />";
							htmlStr+="			<param name='site_root' value='' />";
							htmlStr+="			<param name='name' value='"+tableauOrganization+"' />";
							htmlStr+="			<param name='tabs' value='no' />";
							htmlStr+="			<param name='customViews' value='no'/>";
							htmlStr+="			<param name='showShareOptions' value='false' />";
							htmlStr+="			<param name='toolbar' value='no' />";
							htmlStr+="			<param name='animate_transition' value='yes' />";
							htmlStr+="			<param name='display_static_image' value='yes' />";
							htmlStr+="			<param name='display_spinner' value='yes' />";
							htmlStr+="			<param name='display_overlay' value='no' />";
							htmlStr+="			<param name='display_count' value='yes' />";
							htmlStr+="			<param name='language' value='ko-KR' />";
							htmlStr+="		</object>";
							htmlStr+="	</div>";
							htmlStr+="	<script type='text/javascript'>";
							htmlStr+="		var divElement = document.getElementById('viz1639549297055');";
							htmlStr+="		var vizElement = divElement.getElementsByTagName('object')[0];";
							htmlStr+="		if (divElement.offsetWidth > 800) {";
							htmlStr+="			vizElement.style.width = '100%';";
							htmlStr+="			vizElement.style.height = '100%';";
							htmlStr+="		} else if (divElement.offsetWidth > 500) {";
							htmlStr+="			vizElement.style.width = '100%';";
							htmlStr+="			vizElement.style.height = '100%';";
							htmlStr+="		} else {";
							htmlStr+="			vizElement.style.width = '100%';";
							htmlStr+="			vizElement.style.height = '100%';";
							htmlStr+="		}";
							htmlStr+="		var scriptElement = document.createElement('script');";
							htmlStr+="		scriptElement.src = '"+tableauURL+"javascripts/api/viz_v1.js';";
							htmlStr+="		vizElement.parentNode.insertBefore(scriptElement, vizElement);";
							htmlStr+="	</script>";
							htmlStr+="</div>";

							$('#tableau').append(htmlStr);
					}
					temp_cf_loadingbarHide();
					});
			}else{
			
				if(thisId.split('-')[1]=="coastAccident"){
					//태블로(조직정원) 비활성화
					$('#analysisTableau-organization').prop("checked", false);
					
					var htmlStr="";
						htmlStr+='<div class="tablue" style="position: fixed; top: 130px; width: 70%; height: 800px; right: 70px; background: white; z-index: 150;">';
						htmlStr+="	<div class='tableauPlaceholder' id='viz1639548374133' style='position: relative'>";
						htmlStr+="		<object class='tableauViz' style='display: none;'>";
						htmlStr+="			<param name='host_url' value='"+tableauURL+"/' />";
						htmlStr+="			<param name='embed_code_version' value='3' />";
						htmlStr+="			<param name='site_root' value='' />";
						htmlStr+="			<param name='name' value='"+tableauCoastAccident+"' />";
						htmlStr+="			<param name='customViews' value='no'/>";
						htmlStr+="			<param name='showShareOptions' value='false' />";
						htmlStr+="			<param name='tabs' value='no' />";
						htmlStr+="			<param name='toolbar' value='no' />";
						htmlStr+="			<param name='animate_transition' value='yes' />";
						htmlStr+="			<param name='display_static_image' value='yes' />";
						htmlStr+="			<param name='display_spinner' value='yes' />";
						htmlStr+="			<param name='display_overlay' value='no' />";
						htmlStr+="			<param name='display_count' value='yes' />";
						htmlStr+="			<param name='language' value='ko-KR' />";
						htmlStr+="		</object>";
						htmlStr+="	</div>";
						htmlStr+="	<script type='text/javascript'>";
						htmlStr+="		var divElement = document.getElementById('viz1639548374133');";
						htmlStr+="		var vizElement = divElement.getElementsByTagName('object')[0];";
						htmlStr+="		if (divElement.offsetWidth > 800) {";
						htmlStr+="			vizElement.style.width = '100%';";
						htmlStr+="			vizElement.style.height = '100%';";
						htmlStr+="		} else if (divElement.offsetWidth > 500) {";
						htmlStr+="			vizElement.style.width = '100%';";
						htmlStr+="			vizElement.style.height = '100%';";
						htmlStr+="		} else {";
						htmlStr+="			vizElement.style.width = '100%';";
						htmlStr+="			vizElement.style.height = '100%';";
						htmlStr+="		}";
						htmlStr+="		var scriptElement = document.createElement('script');";
						htmlStr+="		scriptElement.src = '"+tableauURL+"javascripts/api/viz_v1.js';";
						htmlStr+="		vizElement.parentNode.insertBefore(scriptElement, vizElement);";
						htmlStr+="	</script>";
						htmlStr+="</div>";

						$('#tableau').append(htmlStr);
				}else if(thisId.split('-')[1]=="organization"){
					//태블로(연안사고) 비활성화
					$('#analysisTableau-coastAccident').prop("checked", false);
					
					var htmlStr="";
						htmlStr+='<div class="tablue" style="position: fixed; top: 130px; width: 70%; height: 800px; right: 70px; background: white; z-index: 150;">';
						htmlStr+="	<div class='tableauPlaceholder' id='viz1639549297055' style='position: relative'>";
						htmlStr+="		<object class='tableauViz' style='display: none;'>";
						htmlStr+="			<param name='host_url' value='"+tableauURL+"/' />";
						htmlStr+="			<param name='embed_code_version' value='3' />";
						htmlStr+="			<param name='site_root' value='' />";
						htmlStr+="			<param name='name' value='"+tableauOrganization+"' />";
						htmlStr+="			<param name='tabs' value='no' />";
						htmlStr+="			<param name='customViews' value='no'/>";
						htmlStr+="			<param name='showShareOptions' value='false' />";
						htmlStr+="			<param name='toolbar' value='no' />";
						htmlStr+="			<param name='animate_transition' value='yes' />";
						htmlStr+="			<param name='display_static_image' value='yes' />";
						htmlStr+="			<param name='display_spinner' value='yes' />";
						htmlStr+="			<param name='display_overlay' value='no' />";
						htmlStr+="			<param name='display_count' value='yes' />";
						htmlStr+="			<param name='language' value='ko-KR' />";
						htmlStr+="		</object>";
						htmlStr+="	</div>";
						htmlStr+="	<script type='text/javascript'>";
						htmlStr+="		var divElement = document.getElementById('viz1639549297055');";
						htmlStr+="		var vizElement = divElement.getElementsByTagName('object')[0];";
						htmlStr+="		if (divElement.offsetWidth > 800) {";
						htmlStr+="			vizElement.style.width = '100%';";
						htmlStr+="			vizElement.style.height = '100%';";
						htmlStr+="		} else if (divElement.offsetWidth > 500) {";
						htmlStr+="			vizElement.style.width = '100%';";
						htmlStr+="			vizElement.style.height = '100%';";
						htmlStr+="		} else {";
						htmlStr+="			vizElement.style.width = '100%';";
						htmlStr+="			vizElement.style.height = '100%';";
						htmlStr+="		}";
						htmlStr+="		var scriptElement = document.createElement('script');";
						htmlStr+="		scriptElement.src = '"+tableauURL+"javascripts/api/viz_v1.js';";
						htmlStr+="		vizElement.parentNode.insertBefore(scriptElement, vizElement);";
						htmlStr+="	</script>";
						htmlStr+="</div>";

						$('#tableau').append(htmlStr);
				}
			}
		}
	});
});

