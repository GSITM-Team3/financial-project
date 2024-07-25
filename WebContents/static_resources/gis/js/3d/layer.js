const grs80 = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";
const wgs84 = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";
var e2097 ="+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
var e5174 ="+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
var e5178 ="+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
var e5181 ="+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs";
var e5186 ="+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs";
var e3857 ="+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
var onLayerNum = 0;
var onLayerArr = new Array();
$(function () {
	// 체크박스 선택
	$(".wmsLayer").click(function() {
		var check =$(this).is(":checked");
		var type = $(this).attr('id');
		var wmslayer = falseLayerList.nameAtLayer(type);
		if (wmslayer != null) {
			if (check) {
				wmslayer.setVisible(true);
				onLayerNum++;
				onLayerArr.push(type) // 레이어 on/off 동기화 01.28 추가 
			} else {
				wmslayer.setVisible(false);
				onLayerNum--;
				for(let i = 0; i < onLayerArr.length; i++) {  // 레이어 on/off 동기화 01.28 추가 
				  if(onLayerArr[i] === type)  {
					  onLayerArr.splice(i, 1);
					  i--;
				  }
				}
			}
		} else {
			createLayerWMS(type);
			onLayerNum++;
			onLayerArr.push(type) // 레이어 on/off 동기화 01.28 추가 
		}
		layerSituation(type,check,'wmsLayer2');
	});
	
	$(".pointLayer").click(function() {
			Module.XDSetMouseState(6);
			var check =$(this).is(":checked");
			var type = $(this).attr('id');
			console.log(type);
				var poilayer = trueLayerList.nameAtLayer(type);
				if (poilayer != null) {
					if (check) {
						poilayer.setVisible(true);
						onLayerNum++;
						onLayerArr.push(type) // 레이어 on/off 동기화 01.28 추가 
						
					} else {
						poilayer.setVisible(false);
						onLayerNum--;
						for(let i = 0; i < onLayerArr.length; i++) { // 레이어 on/off 동기화 01.28 추가 
						  if(onLayerArr[i] === type)  {
							  onLayerArr.splice(i, 1);
							  i--;
						  }
						}
					}
				} else {				
					createLayer(type);
					onLayerNum++;
					onLayerArr.push(type) // 레이어 on/off 동기화 01.28 추가 
				}
				layerSituation(type,check,'pointLayer2');
		});

	//주제도 접었다 폈다
	$(".layer_accordion").click(function() {
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
		$(this).parent().next('.checkbox_list').slideToggle(500);
		
	});
	
});


function layerSituation(id,check,classNm){
	if(check){
		var htmlStr="";
		var layerNM= $("#"+id+"_NM").text();
		console.log(onLayerNum+","+id)
		
		$(".layer_legend").removeClass('hide');
		if(onLayerNum==1){ //레이어 on/off 기능 추가 01.28
			//var htmlStr = '<li class="layer_legend_li" id="'+id+'_li" ><p style="">'+layerNM+'<button class="layer_del"></button><label class="input_switch fl_r"><input type="checkbox" checked><span class="input_slider round"></span></label></p></li> '
			var htmlStr = '<li class="layer_legend_li" id="'+id+'_li" >'
				+'<p><span style="color: #ea8c12;font-weight:bold;margin-right:5px;">'+$('#'+id).parent().parent().parent().parent().prev().text()+'</span> '+layerNM
				+'<label class="input_switch fl_r" style="right: 5px;">'
				+'<input type="checkbox" class="'+classNm+'" id="'+id+'" checked>'
				+'<span class="input_slider round"></span>'
				+'</label>'
				+'</p>'
				+'</li>';
			$(".layer_legend_ul").append(htmlStr);
		}else{ //레이어 on/off 기능 추가 01.28
			//var htmlStr = '<li class="layer_legend_li" id="'+id+'_li" ><p style="">'+layerNM+'<button class="layer_del"></button><label class="input_switch fl_r"><input type="checkbox" checked><span class="input_slider round"></span></label></p></li> '
			var htmlStr = '<li class="layer_legend_li" id="'+id+'_li" >'
				+'<p><span style="color: #ea8c12;font-weight:bold;margin-right:5px;">'+$('#'+id).parent().parent().parent().parent().prev().text()+'</span> '+layerNM
				+'<label class="input_switch fl_r" style="right: 5px;">'
				+'<input type="checkbox" class="'+classNm+'" id="'+id+'" checked>'
				+'<span class="input_slider round"></span>'
				+'</label>'
				+'</p>'
				+'</li> '
			$(".layer_legend_ul").append(htmlStr);
		}
	}else{
		if(onLayerNum==0){
			$(".layer_legend").addClass('hide');
			console.log($("#"+id+"_NM").text());
			$(".layer_legend_ul").empty();
		}else{
			$("#"+id+"_li").remove();
		}
	}
	
	// 왼쪽목록, 가시화된 주제도 이벤트 동기화 >> 구역+해역(wms) 01.28
	$(".wmsLayer2").click(function() {
		
		var checked =$(this).is(":checked");
		var type = $(this).attr('id');
		var wmslayer = falseLayerList.nameAtLayer(type); //wms
		
		if (wmslayer != null) {
			if (checked) {
				$('input[id="'+type+'"]').prop("checked", true);
				wmslayer.setVisible(true);
				onLayerArr.push(type)
			} else {
				$('input[id="'+type+'"]').prop("checked", false);
				wmslayer.setVisible(false);
				for(let i = 0; i < onLayerArr.length; i++) {
				  if(onLayerArr[i] === type)  {
					  onLayerArr.splice(i, 1);
					  i--;
				  }
				}
			}
		} else {
			createLayerWMS(type);
			onLayerArr.push(type)
		}
		//console.log(onLayerArr)
		if(onLayerArr.length == 0){
			$(".layer_legend").addClass('hide');
			//console.log($("#"+type+"_NM").text());
			$(".layer_legend_ul").empty();
		}else{
			$("#"+type+"_li").remove();
		}
		
	});
	// 왼쪽목록, 가시화된 주제도 이벤트 동기화 >> 기타+장소(poi) 01.28
	$(".pointLayer2").click(function() {
		Module.XDSetMouseState(6);
		var checked =$(this).is(":checked");
		var type = $(this).attr('id');
		var poilayer = trueLayerList.nameAtLayer(type); //poi
		
		if (poilayer != null) {
			if (checked) {
				$('input[id="'+type+'"]').prop("checked", true);
				poilayer.setVisible(true);
				onLayerArr.push(type)
			} else {
				$('input[id="'+type+'"]').prop("checked", false);
				poilayer.setVisible(false);
				for(let i = 0; i < onLayerArr.length; i++) {
					  if(onLayerArr[i] === type)  {
						  onLayerArr.splice(i, 1);
						  i--;
					  }
					}
			}
		} else {				
			createLayer(type);
			onLayerArr.push(type)
		}
		
		//console.log(onLayerArr)
		if(onLayerArr.length == 0){
			$(".layer_legend").addClass('hide');
			//console.log($("#"+type+"_NM").text());
			$(".layer_legend_ul").empty();
		}else{
			$("#"+type+"_li").remove();
		}
	});
}

function getLayerDetail(objKey,layerName){
	var param = {
			layer : layerName,
            gid : objKey
		};
	temp_cf_ajax( "/use/gisAnal/getSelctLayerDetail.do",param , function(data){
		var data= data.data;
		$('#layerDetail').removeClass('hide');
		switch (layerName) {
		  case 'TL_YACSGRGY_P':
		    var str= "";
		     str += '<dt>명칭</dt><dd>'+data[0].st_t_tl_10+'</dd>'
		    +'<dt>정의</dt><dd>'+data[0].st_t_tl_11+'</dd>'
		    +'<dt>참조문서</dt><dd>'+data[0].st_t_tl_14+'</dd>'
		    +'<dt>법률명</dt><dd>'+data[0].st_t_tl_12+'</dd>'
		    +'<dt>세부조항</dt><dd>'+data[0].st_t_tl_13+'</dd>'
		    +'<dt>제작년월일</dt><dd>'+data[0].st_t_tl__8+'</dd>'
		    +'<dt>고시날짜</dt><dd>'+data[0].st_t_tl_15+'</dd>'
		    +'<dt>개정날짜</dt><dd>'+data[0].st_t_tl_16+'</dd>'
		    +'<dt>관련부서</dt><dd>'+data[0].st_t_tl_17+'</dd>'
		    +'<dt>기관코드</dt><dd>'+data[0].st_t_tl__6+'</dd>'
		    +'<dt>관련부서연락처</dt><dd>'+data[0].st_t_tl_18+'</dd>'
		    +'<dt>참조사이트</dt><dd>'+data[0].st_t_tl_20+'</dd>';
		    
		    $('#layerTitle').html('연안침식관리구역');
		    $('#layerDetailInfo').empty();
		    
		    $('#layerDetailInfo').append(str);
		    break;
		  case 'VI_PILBOP_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('도선사승하선구역');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_SMOZON_P':
			  var str= "";
			     str += '<dt>-</dt>';
				 
				    $('#layerTitle').html('흡연구역');
				    $('#layerDetailInfo').empty();
				    
				    $('#layerDetailInfo').append(str);
				    break;
		  case 'TB_YACHT_RPNT':
			  var str= "";
			     str += '<dt>지역명칭</dt><dd>'+data[0].st_t_tb__7+'</dd>'
			    +'<dt>포인트명</dt><dd>'+data[0].st_t_tb__8+'</dd>'
			    /*+'<dt>대상어,채비</dt><dd>'+data[0].st_t_tb_12+'</dd>'*/
			    +'<dt>수심</dt><dd>'+data[0].st_t_tb__9+'</dd>'
			    +'<dt>저질</dt><dd>'+data[0].st_t_tb_10+'</dd>'
			    +'<dt>적정물때</dt><dd>'+data[0].st_t_tb_11+'</dd>';
			    
			    $('#layerTitle').html('갯바위낚시포인트');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TB_FACI_FSHLC':
			  var str= "";
			     str += '<dt>명칭</dt><dd>'+data[0].st_t_tb_16+'</dd>'
			    +'<dt>주소</dt><dd>'+data[0].st_t_tb_19+'</dd>'
			    +'<dt>관련부서</dt><dd>'+data[0].st_t_tb__5+'</dd>'
			    +'<dt>주요어종</dt><dd>'+data[0].st_t_tb_17+'</dd>';
			    
			    $('#layerTitle').html('낚시터유어장');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_SFISHERY_P':
			  var str= "";
			     str += '<dt>명칭</dt><dd>'+data[0].st_t_tl_10+'</dd>'
			    +'<dt>주소</dt><dd>'+data[0].st_t_tl_21+'</dd>'
			    +'<dt>정의</dt><dd>'+data[0].st_t_tl_11+'</dd>'
			   /* +'<dt>어촌계</dt><dd>'+data[0].st_t_tl_22+'</dd>'
			    +'<dt>주요어종</dt><dd>'+data[0].st_t_tl_23+'</dd>'*/
			    +'<dt>참조문서</dt><dd>'+data[0].st_t_tl_14+'</dd>'
			    +'<dt>법률명</dt><dd>'+data[0].st_t_tl_12+'</dd>'
			    +'<dt>제작년월일</dt><dd>'+data[0].st_t_tl__8+'</dd>'
			    +'<dt>고시날짜</dt><dd>'+data[0].st_t_tl_15+'</dd>'
			    +'<dt>개정날짜</dt><dd>'+data[0].st_t_tl_16+'</dd>'
			    +'<dt>관련부서</dt><dd>'+data[0].st_t_tl_17+'</dd>'
			    +'<dt>관련부서연락처</dt><dd>'+data[0].st_t_tl_18+'</dd>'
			    +'<dt>기관코드</dt><dd>'+data[0].st_t_tl__6+'</dd>'
			    +'<dt>참조사이트</dt><dd>'+data[0].st_t_tl_20+'</dd>';
			    
			    $('#layerTitle').html('바다낚시터');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TB_FACI_SPORT':
			  var str= "";
			     str += '<dt>명칭</dt><dd>'+data[0].st_t_tb_11+'</dd>'
			    +'<dt>주소</dt><dd>'+data[0].st_t_tb_13+'</dd>'
			    +'<dt>부대시설</dt><dd>'+data[0].st_t_tb_12+'</dd>';
			    
			    $('#layerTitle').html('레저,스포츠');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TB_YACHT_SPOINT':
			  var str= "";
			     str += '<dt>지역명칭</dt><dd>'+data[0].st_t_tb__7+'</dd>'
			    +'<dt>포인트명</dt><dd>'+data[0].st_t_tb__8+'</dd>'
			    /*+'<dt>대상어,채비</dt><dd>'+data[0].st_t_tb_12+'</dd>'*/
			    +'<dt>수심</dt><dd>'+data[0].st_t_tb__9+'</dd>'
			    +'<dt>적정물때</dt><dd>'+data[0].st_t_tb_11+'</dd>'
			    +'<dt>저질</dt><dd>'+data[0].st_t_tb_10+'</dd>'
			    +'<dt>위도</dt><dd>'+data[0].st_t_tb_13+'</dd>'
			    +'<dt>경도</dt><dd>'+data[0].st_t_tb_14+'</dd>';
			    
			    $('#layerTitle').html('선상낚시포인트');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TB_YACHT_MARINA_P':
			  var str= "";
			     str += '<dt>명칭</dt><dd>'+data[0].st_t_tb__3+'</dd>'
			    +'<dt>주소</dt><dd>'+data[0].st_t_tb__6+'</dd>'
			    /*+'<dt>자가용</dt><dd>'+data[0].st_t_tb_14+'</dd>'
			    +'<dt>대중교통</dt><dd>'+data[0].st_t_tb_13+'</dd>'*/
			    +'<dt>정보</dt><dd>'+data[0].st_t_tb_12+'</dd>'
			    +'<dt>설명</dt><dd>'+data[0].st_t_tb__8+'</dd>'
			    +'<dt>안전시설</dt><dd>'+data[0].st_t_tb_26+'</dd>'
			    +'<dt>안전시설전화번호</dt><dd>'+data[0].st_t_tb_27+'</dd>';
			    
			    $('#layerTitle').html('마리나정보');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TB_FACI_SCENIC':
			  var str= "";
			     str += '<dt>이름</dt><dd>'+data[0].st_t_tb_10+'</dd>'
			    +'<dt>위치</dt><dd>'+data[0].st_t_tb_11+'</dd>';
			    
			    $('#layerTitle').html('경관도로');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TB_FACI_FISHINGOLE':
			  var str= "";
			     str += '<dt>명칭</dt><dd>'+data[0].st_t_tb_11+'</dd>'
			    +'<dt>주소</dt><dd>'+data[0].st_t_tb_13+'</dd>'
			    +'<dt>부대시설</dt><dd>'+data[0].st_t_tb_12+'</dd>';
			    
			    $('#layerTitle').html('전망대');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TB_FACI_CAMPSITE':
			  var str= "";
			     str += '<dt>명칭</dt><dd>'+data[0].st_t_tb_11+'</dd>'
			    +'<dt>주소</dt><dd>'+data[0].st_t_tb_13+'</dd>'
			    +'<dt>전화번호</dt><dd>'+data[0].st_t_tb_14+'</dd>'
			    +'<dt>인근지역</dt><dd>'+data[0].st_t_tb_12+'</dd>';
			    
			    $('#layerTitle').html('캠핑장');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TB_FACI_BEACH':
			  var str= "";
			     str += '<dt>명칭</dt><dd>'+data[0].st_t_tb_11+'</dd>'
			    +'<dt>주소</dt><dd>'+data[0].st_t_tb_13+'</dd>'
			    +'<dt>부대시설</dt><dd>'+data[0].st_t_tb_12+'</dd>';
			    
			    $('#layerTitle').html('해수욕장');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_CCTVVI_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('CCTV');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_POLTRP_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('간이치안출장소');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'VI_LNDMRK_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('등대');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_FIRSTA_P':
			  var str= "";
			     str += '<dt>명칭</dt><dd>'+data[0].name+'</dd>'
			    +'<dt>주소</dt><dd>'+data[0].rnadres+'</dd>';
			    
			    $('#layerTitle').html('소방서');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;   
		  case 'TL_TKTOFC_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('매표소');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_LEQMBD_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('레저기구탑승장');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_SHWROM_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('샤워장');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_INFCEN_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('종합안내소');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_ACCOMM_P':
			  var str= "";
			     str += '<dt>명칭</dt><dd>'+data[0].name+'</dd>'
			    +'<dt>지번주소</dt><dd>'+data[0].etcadres+'</dd>'
			    +'<dt>도로명주소</dt><dd>'+data[0].rnadres+'</dd>';
			 
			    $('#layerTitle').html('숙박업소');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_PRKPLC_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('주차장');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_DREROM_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('탈의실');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
			    break;
		  case 'TL_TUBLND_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('튜브대여소');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
			    break;
		  case 'TL_WCHTWR_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('안전요원망루');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_MALIRE_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('수상인명구조대');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_RESCUE_P_PICTURE':
			  var str= "";
			     str += '<dt>행정구역</dt><dd>'+stringNullCheck(data[0].sido)+' '+stringNullCheck(data[0].sigungu)+' '+stringNullCheck(data[0].eupmyeondong)+' '+stringNullCheck(data[0].dongri)+'</dd>'
				    +'<dt>구역구분</dt><dd>'+stringNullCheck(data[0].area)+'</dd>'
				    +'<dt>장소</dt><dd>'+stringNullCheck(data[0].location)+'</dd>'
			        +'<dt>현장사진</dt><dd><img src="/use/gisAnal/rescuePictureDn?p='+stringNullCheck(data[0].image_name)+'" style="width: 160px; margin-top: 5px; margin-bottom: 25px;"/></dd>';
			 
			    $('#layerTitle').html('인명구조장비함');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TB_SAILER':
			  var str= "";
			     str += '<dt>행정구역명칭</dt><dd>'+data[0].st_t_tb_21+'</dd>'
			    +'<dt>항명칭</dt><dd>'+data[0].st_t_tb_22+'</dd>'
			    +'<dt>참조해도</dt><dd>'+data[0].st_t_tb__9+'</dd>'
			    +'<dt>축척</dt><dd>'+data[0].st_t_tb_24+'</dd>'
			    +'<dt>해구번호</dt><dd>'+data[0].st_t_tb_25+'</dd>';
			 
			    $('#layerTitle').html('소형선항만안내정보');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TB_FACI_FESTIVAL':
			  var str= "";
			     str += '<dt>명칭</dt><dd>'+data[0].st_t_tb_11+'</dd>'
			    +'<dt>주소</dt><dd>'+data[0].st_t_tb_12+'</dd>';
			 
			    $('#layerTitle').html('축제');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_VTSCEN_P':
			  var str= "";
			     str += '<dt>명칭</dt><dd>'+data[0].st_t_tl_10+'</dd>';
			 
			    $('#layerTitle').html('해상교통관제센터');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TL_OBSTRN_P':
			  var str= "";
			     str += '<dt>-</dt>';
			 
			    $('#layerTitle').html('어초정보');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  case 'TB_AREA_NAME_OCEAN':
			  var str= "";
			     str += '<dt>한글명</dt><dd>'+data[0].st_t_tb__5+'</dd>'
			     +'<dt>영문명</dt><dd>'+data[0].st_t_tb__6+'</dd>'
			     +'<dt>수심높이폭</dt><dd>'+data[0].st_t_tb_13+'</dd>'
			     +'<dt>지명유래</dt><dd>'+data[0].st_t_tb_14+'</dd>';
			 
			    $('#layerTitle').html('해양지명');
			    $('#layerDetailInfo').empty();
			    
			    $('#layerDetailInfo').append(str);
			    break;
		  default:
			  $('#layerDetail').addClass('hide');
		}
		temp_cf_loadingbarHide();
		});
}

//상세보기 닫기
function closeLayerDetail(){
	$('#layerDetail').addClass('hide');
}

//WMS레이어 불러오기 ex)createLayerWMS('TL_ACCOMM_P',127,36,128,37);
//숙박업소:TL_ACCOMM_P,인명구조장비함:TL_RESCUE_P_PICTURE,수상인명구조대:TL_MALIRE_P
function createLayerWMSrange(type, minx, miny, maxx, maxy) {
	
	var layerList = new Module.JSLayerList(true);
	var layer = layerList.nameAtLayer(type+"Range");
	if(layer != null)	layerList.delLayerAtName(type+"Range") 				// WMS 삭제
	
	var param = {
				layer : type,
	            minx : minx,
	            maxx : maxx,
	            miny : miny,
	            maxy : maxy
			};
	temp_cf_ajax( "/use/gisAnal/getRescueGrid.do",param , function(data){
		var data= data.data;
		for(i=0;i<data.length;i++){
			var geom =JSON.parse(data[i].the_geom);
			var lon = geom.coordinates[0];
			var lat = geom.coordinates[1];
			createPOI(lon,lat,type);
			}
		temp_cf_loadingbarHide();
	});
	
	/*//좌표계변환 
	//좌하단
	var wgs84P1 = proj4(wgs84, grs80, [ minx, miny]);
	//우상단
	var wgs84P2 = proj4(wgs84, grs80, [ maxx, maxy]);
	
	var seaLayer = falseLayerList.createWMSLayer(type+"Range");
	let option = {
		url : GeoserverWMS,
		layer : 'kcg:' + type,
		minimumlevel : 0,
		maximumlevel : 16,
		tilesize : 256,
		srs : "EPSG:4326",
		parameters : {
			version : "1.1.0",
			CQL_FILTER : 'bbox(geom,'+wgs84P1[0]+','+wgs84P1[1]+','+wgs84P2[0]+','+wgs84P2[1]+')',
		}
	};
	seaLayer.setProxyRequest(true);
	seaLayer.setWMSProvider(option);
	seaLayer.setBBoxOrder(true);
	seaLayer.clearWMSCache();
	seaLayer.setVisible(true);*/
}

//WMS생성
function createLayerWMS(type) {
	var seaLayer = falseLayerList.createWMSLayer(type);
	let option = {
		url : GeoserverWMS,
		layer : 'kcg:' + type,
		minimumlevel : 0,
		maximumlevel : 16,
		tilesize : 256,
		srs : "EPSG:4326",
		parameters : {
			version : "1.1.0",
		}
	};
	if(runEnv=="prod"){
	}else{
		seaLayer.setProxyRequest(true);
	}
	seaLayer.setWMSProvider(option);
	seaLayer.setBBoxOrder(true);
	seaLayer.clearWMSCache();
	seaLayer.setVisible(true);
}

function createLayer(name){
	var param = {
			layer : name
		};
	temp_cf_ajax( "/use/gisAnal/getRescue.do",param , function(data){
		var data= data.data;
		for(i=0;i<data.length;i++){
			var geom =JSON.parse(data[i].the_geom);
			var gid =data[i].gid;
			var lon = geom.coordinates[0];
			var lat = geom.coordinates[1];
			createPOI(lon,lat,name,gid);
			}
		temp_cf_loadingbarHide();
	});
}

function createPOI(lon,lat,name,gid) {
	// POI 오브젝트를 추가 할 레이어 생성
	var layer = trueLayerList.createLayer(name, Module.ELT_3DPOINT);	
    layer.setMaxDistance(10000000);
    
    var alt = Module.getMap().getTerrHeight(lon,lat);
	var img = new Image();
	img.onload = function() {

		// 이미지 로드 후 캔버스에 그리기
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
		
		// 이미지 POI 생성
		var poi_with_text_n_image = Module.createPoint("theLayer_"+gid);
		poi_with_text_n_image.setPosition(new Module.JSVector3D(lon, lat,alt));
		poi_with_text_n_image.setImage(ctx.getImageData(0, 0, this.width, this.height).data, this.width,this.height);
		
		this.layer.addObject(poi_with_text_n_image, 0);
    };
    img.layer = layer;
    img.src = "/static_resources/gis/data/"+name+".png"
}

//라인생성 테스트
function createNomalLineJson(_coordinates) {
	let data = {
		coordinates: _coordinates,
		type: 4,											// 실선 생성
		union: false,										// 지형 결합 유무
		depth: false,										// 오브젝트 겹침 유무
		color: new Module.JSColor(255, 255, 0, 0),			// ARGB 설정
		width: 3,											// 선 굵기
		dash:5000
	}
	return data;
}
function createLine( _id, _coordinate) {
	
	let coordinates = {
			coordinate: _coordinate,						// 정점 배열
			style: "XY"
		};

		let object_option = null;

		object_option = createNomalLineJson(coordinates);
		let line = Module.createLineString(_id)

		let lineLayer = trueLayerList.nameAtLayer(_id);
		lineLayer.addObject(line, 0);
}
function createPOLYLINELayer(_layerName) {
	var layer = trueLayerList.createLayer(_layerName, Module.ELT_3DLINE);
	trueLayerList.nameAtLayer(_layerName).setMaxDistance(8000000);
	return layer;
}

//폴리곤생성 테스트
function createPolygon(_layer, id, _vertices, _fillColor, _outlineColor) {

	// 폴리곤 객체 생성
	var polygon = Module.createPolygon(id);

	// 폴리곤 색상 설정
	var polygonStyle = new Module.JSPolygonStyle();
	polygonStyle.setFill(true);
	polygonStyle.setFillColor(_fillColor);
	if (_outlineColor != null) {
		polygonStyle.setOutLine(true);
		polygonStyle.setOutLineWidth(2.0);
		polygonStyle.setOutLineColor(_outlineColor);
	}

	polygon.setStyle(polygonStyle);
	polygon.setHeight(300);
	// 버텍스 배열 생성
	var vertex = new Module.JSVec3Array();
	for (var i=0; i<_vertices.length; i++) {
		vertex.push(new Module.JSVector3D(_vertices[i][0], _vertices[i][1], _vertices[i][2]));
	}

	var part = new Module.Collection();
	part.add(_vertices.length);

	polygon.setPartCoordinates(vertex, part);

	// 레이어에 객체 추가
	_layer.addObject(polygon, 0);
}

function createPOLYGONLayer(_layerName) {
	var layer = trueLayerList.createLayer(_layerName, Module.ELT_POLYHEDRON);
	trueLayerList.nameAtLayer(_layerName).setMaxDistance(800000);
	return layer;
}
function createGISLine(type){
	var param = {layer : type};
	temp_cf_ajax( "/use/gisAnal/getline.do",param , function(data){
      data =data.data;
      createPOLYLINELayer(type);
        for(l=0;l<data.length;l++){
            var cors = eval("data["+l+"].st_t_"+ type.lower() + ".ag_geom");
            var corsList = cors.split(",");
            for(i=0;i<corsList.length;i++){
            var codi= corsList[i].split(" ");
            var le = codi.length/2;
            var lis=[];    
            for(j=0;j<le;j++){
               var k= j*2;
                var wgs84P1 = proj4(grs80, wgs84, [ codi[k], codi[k+1]]);
                lis[j]=wgs84P1;

                }
                createLine(type,lis);
            }
        }
		temp_cf_loadingbarHide();
		});
}

function createGISPolygon(type){
	var param = {layer : type};
	temp_cf_ajax( "/use/gisAnal/getline.do",param , function(data){
      data =data.data;
      createPOLYGONLayer(type);
        for(l=0;l<data.length;l++){
            var cors = eval("data["+l+"].st_t_"+ type.lower() + ".ag_geom");
            var corsList = cors.split(",");
            for(i=0;i<corsList.length;i++){
            var codi= corsList[i].split(" ");
            var le = codi.length/2;
            var lis=[];    
            for(j=0;j<le;j++){
               var k= j*2;
                var wgs84P1 = proj4(grs80, wgs84, [ codi[k], codi[k+1]]);
                lis[j]=[wgs84P1[0],wgs84P1[1],15];
                }
            var layer = createPOLYGONLayer(type);
           
            createPolygon(layer, type ,lis, new Module.JSColor(100,100, 0, 100), new Module.JSColor(255,0, 0, 10));
            
            }
        }
		temp_cf_loadingbarHide();
		});
}

var pointIndex = 0;

function createCOORDINATE(lon,lat,alt,gid) {
	// POI 오브젝트를 추가 할 레이어 생성
	var layer = trueLayerList.createLayer("pointCoord", Module.ELT_3DPOINT);	
    layer.setMaxDistance(10000000);

	var img = new Image();
	img.onload = function() {

		// 이미지 로드 후 캔버스에 그리기
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
		
		// 이미지 POI 생성
		var poi_with_text_n_image = Module.createPoint("coordinatePoint_"+gid);
		poi_with_text_n_image.setPosition(new Module.JSVector3D(lon, lat,alt));
		poi_with_text_n_image.setImage(ctx.getImageData(0, 0, this.width, this.height).data, this.width,this.height);
		// 텍스트 설정
		poi_with_text_n_image.setText("point."+gid);
		
		this.layer.addObject(poi_with_text_n_image, 0);
    };
    img.layer = layer;
    img.src = "/static_resources/gis/data/select_icon.png"
}

function measureCoordinate(){
	var flag = $("#coorPoint").is(":checked");
	if(flag){
		Module.canvas.onclick = function(e) {
			pointIndex++;
			if(pointIndex==1){$('#layer_tbodyTR').removeClass("hide");}
			var Projection=Module.getProjection();
		      var positionString = Module.GetClickPosition();
		      var position = positionString.split("_");      
		      var pointX = Number(position[0]); //x 좌표
		      var pointY = Number(position[1]); //y 좌표
		      var alt = Module.getMap().getTerrHeight(pointX,pointY);
		      createCOORDINATE(pointX,pointY,alt,pointIndex);
		      var str="<tr><th>point."+pointIndex+"</th><td>"+pointX.toFixed(7)+"</td><td>"+pointY.toFixed(7)+"</td><td>"+alt.toFixed(7)+"</td></tr>";
		      $('#layer_tbody').append(str);
		};
	}else{
		Module.canvas.onclick = "";
	}
}
function clearCoord(){
	pointIndex = 0;
	$('#layer_tbodyTR').addClass("hide");
	trueLayerList.nameAtLayer("pointCoord").removeAll();
	$('#layer_tbody').empty();
}
function sampleDW(){
	location.href="/static_resources/gis/data/sampleCSV.csv";
}