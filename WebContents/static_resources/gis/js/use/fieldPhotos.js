$( document ).ready(function() {

	// 현장사진 조회조건-월 슬라이더 생성
	$("#fieldPhoto_rangeSlider").ionRangeSlider({
		type: "double",
        skin: "round",
        grid:false,
        values: RANGEVALUE,
        from: 36,
        to: 47
    });
	
	//연안사고 조회조건-월 슬라이더 디자인
	$('.irs--round .irs-bar').css('background-color','#89D4FF');
	$('.irs-bar--single').css('background-color','#dee4ec');

	$("#fieldPhoto_rangeSlider").change(function(){
	   if($("#searchShipAccident_rangeSlider").val().split(';')[0]==RANGEVALUE[0]){
		   $('.irs-from').addClass('m7_irs_to_first');
	   }else{
		   $('.irs-from').removeClass('m7_irs_to_first');
	   }
	   
	   if($("#fieldPhoto_rangeSlider").val().split(';')[1]==RANGEVALUE[RANGEVALUE.length-1]){
		   $('.irs-to').addClass('m7_irs_to_last');
	   }else{
		   $('.irs-to').removeClass('m7_irs_to_last');
	   }
	});
	
	//현장사진 등록시 발생일시 선택하는 달력
	$('#datepicker').datepicker({
		showOn:'button',
		dateFormat:'yy-mm-dd',
		prevText:'이전달',
		nextText:'다음달',
		monthNames:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		monthNamesShort:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		dayNames:['일','월','화','수','목','금','토'],
		dayNamesShort:['일','월','화','수','목','금','토'],
		dayNamesMin:['일','월','화','수','목','금','토'],
		showMonthAfterYear:true,
		yearFuffix:'년'
	});
	
	//현장사진 조회시 경찰청 리스트 가져오기
	getFieldPhotoPoliceAgencyList("fieldPhoto_select_agency");
	
	//현장사진 조회시 경찰서 리스트 가져오기
	$('.fieldPhoto_agency_select').change( function(){

		//경찰서 리스트 가져오기
		var params={
			agency_name:$(this).val()
		};
		
		var selectBoxId=this.id.split('_')[0]+'_'+this.id.split('_')[1]+'_office';
		
		//현장사진 조회시 경찰서 리스트 표출하기
		temp_cf_ajax( "/use/gisAnal/getFieldPhotoPoliceOfficeList.do", params, function(_data){
			var thisdata=_data.data.data;
			$('#'+selectBoxId).empty();
			var htmlStr="";
			if(thisdata.length==0){
				htmlStr+="<option value='' >전체</option>";
			
			}else{
				htmlStr+="<option value='' >전체</option>";
				for(var i=0;i<thisdata.length;i++){
					htmlStr+="<option value='"+thisdata[i].name+"' > "+thisdata[i].name+"</option>";
				}
			}
			
			$('#'+selectBoxId).append(htmlStr);
			
			//로딩바 숨기기
			temp_cf_loadingbarHide();
		});
	});
});

//현장사진 전역변수
var FIELDPHOTO = {
	FILELIST:[],
	FILEINPUTLIST:[],
	EDITDELITEFILELIST:[],
};

/*
 * 현장사진 등록시 경찰청 리스트 가져오기
 * */
function getFieldPhotoPoliceAgencyList(_selectBoxId){
	
	//경찰청 리스트 가져오기
	var params={};
	temp_cf_ajax( "/use/gisAnal/getFieldPhotoPoliceAgencyList.do", params, function(_data){
		var thisdata=_data.data.data;
		$('#'+_selectBoxId).empty();
		var htmlStr="";
			htmlStr+="<option value='' >전체</option>";
		for(var i=0;i<thisdata.length;i++){
			htmlStr+="<option value='"+thisdata[i].name+"' > "+thisdata[i].name+"</option>";
		}
		$('#'+_selectBoxId).append(htmlStr);
		//로딩바 숨기기
		temp_cf_loadingbarHide();
	});
}

/*
 * 현장사진 데이터 가져오기
 * */
function getFieldPhoto(current){
	
	//현장사진 등록 화면 보이기
	$('#fieldPhotoRegisger_div').addClass('hide');
	//현장사진 목록 화면 숨기기.
	$('#fieldPhotoList_div').removeClass('hide');
	//현장사진 등록 버튼 숨기기
	$('#fieldPhoto_add_btn').removeClass('hide');
	//현장사진 등록 버튼 숨기기
	$('#fieldPhoto_h1_text').text('현장사진');
	
	//페이징 관련 변수
	var totalRecordCount=0;	//건에 대한 총갯수 
	var pageIndex = current;
    var cnt = 0;
	var etp =  pageIndex*10;
	var stp =  etp - (10-1) ;
	
	var params = {
		start_date:$('#fieldPhoto_rangeSlider').val().split(';')[0]+'-01',
		end_date:$('#fieldPhoto_rangeSlider').val().split(';')[1]+'-31',
		agency_name:$('#fieldPhoto_select_agency option:selected').val(),
		office_name:$('#fieldPhoto_select_office option:selected').val(),
		classification:$('#fieldPhoto_select_classification option:selected').val(),
		n_st : stp,
		n_ed : etp
	};
	
	//초기 조회시 현장사진 아이콘 표출하기
	if(current==1){
		//현장사진 데이터 가져오기 - 전체아이콘
		temp_cf_ajax( "/use/gisAnal/getFileList.do", params, _getFileList);
	}
	
	//현장사진 데이터 가져오기 - 페이징
	temp_cf_ajax( "/use/gisAnal/getFieldPhotoListPaging.do", params , function(_data){

		$('.fieldPhoto_list_div').removeClass('hide');
		
    	$('.fieldPhoto_list_dl').empty();
		if(_data.total.data[0].count == 0) {	//검색결과 없는 경우 로직 패스
			$('.fieldPhoto_list_dl').append("검색결과가 없습니다.");
		} else {	//검색결과 있는 경우 로직 수행
			
			totalRecordCount = _data.total.data[0].count;
    		$(_data.data.data).each(function(key,val) {
    			
    			var fieldNoObj= JSON.stringify({
    				fieldNo : val.idx
    			});	
    			
    			var fieldInfoObj= JSON.stringify({
    				fieldNo : val.idx,
    				fieldTitle : val.title
    			});	
    			
    			var index=(Number(current-1)*10)+Number(cnt+1);
    			var htmlStr="";
    			//조회 결과 목록에 뿌릴 html
    			htmlStr+="<div style='margin:3px;' onclick='moveFieldPhotoLocation("+val.lon+","+val.lat+"); getFieldPhotoInfo("+fieldNoObj+");'>";
    			htmlStr+="<dt><span>"+index+"</span>"+val.classification+" / "+val.title+"<button class='fieldPhoto_delete' onclick='event.cancelBubble = true;deleteFieldPhoto("+fieldInfoObj+")'></button><button class='fieldPhoto_edit' onclick='event.cancelBubble = true;editFieldPhoto("+fieldInfoObj+")'></button></dt>";
    			htmlStr+="<dd><span class='title'>사고 일시 </span><span class='data'>"+val.date+"</span><span class='title'>위치 </span><span class='data'>"+Number(stringNullCheck(val.lon)).toFixed(6)+", "+Number(stringNullCheck(val.lat)).toFixed(6)+"</span></dd></div>";										
    
    			$('.fieldPhoto_list_dl').append(htmlStr);
    			cnt++;
    		});
		}
		makePaging(pageIndex, totalRecordCount, "getFieldPhoto", 'fieldPhoto_paging', 10);
		temp_cf_loadingbarHide();
	});
	
}

/*
 * 현장사진 데이터(아이콘) 표출하기
 * */
function _getFileList(_data){
	
	//현장사진 정보 팝업 안보이게 초기화
	$('.fieldPhoto_info_pop').addClass('hide');
	
	//경찰청만 선택시, 경찰청 중앙 좌표 가져와서 위치, 가시범위 설정해주기
	if($('#fieldPhoto_select_agency option:selected').val()!='' && $('#fieldPhoto_select_office option:selected').val()==''){
		var params={
			name:$('#fieldPhoto_select_agency option:selected').val()
		};
	
		temp_cf_ajax( "/use/gisAnal/getFieldPhotoPoliceAgencyList.do", params , function(_data){

			var thisdata= _data.data.data;

			for(i=0;i<thisdata.length;i++){
				var geom =JSON.parse(thisdata[i].the_center_geom);
				var lon = geom.coordinates[0];
				var lat = geom.coordinates[1];
				
				//카메라 위치 이동(lon,lat,alt,tilt,direct)
				setViewCamera(parseFloat(lon), parseFloat(lat),550000,90,0);
			}
			temp_cf_loadingbarHide();
		});
		
	//경찰서 선택시, 경찰서 중앙 좌표 가져와서 위치, 가시범위 설정해주기
	}else if($('#fieldPhoto_select_agency option:selected').val()!=''&&$('#fieldPhoto_select_office option:selected').val()!=''){
		var params={
			name:$('#fieldPhoto_select_office option:selected').val()
		};
	
		temp_cf_ajax( "/use/gisAnal/getFieldPhotoPoliceOfficeList.do", params , function(_data){

			var thisdata= _data.data.data;

			for(i=0;i<thisdata.length;i++){
				var geom =JSON.parse(thisdata[i].the_center_geom);
				var lon = geom.coordinates[0];
				var lat = geom.coordinates[1];
				
				//카메라 위치 이동(lon,lat,alt,tilt,direct)
				setViewCamera(parseFloat(lon), parseFloat(lat),280000, 90, 0);
			}
			temp_cf_loadingbarHide();
		});
	}
	
	var thisdata=_data.data;
	
	//레이어 생성(layerName, layerType, maxDistance, minDistance)
	createTrueLayer("FIELD_PHOTO_MARKER", 5, 1400000.0, 1.0);
	
	for(var i=0;i<thisdata.length;i++){
		var paramArr=[
			thisdata[i].lon,
			thisdata[i].lat,
			1000,
			thisdata[i].title,
			thisdata[i].idx];
		
		//현장사진 아이콘 그리기
		drawSearchMark(paramArr, "/static_resources/gis/img/icon/field_photo_icon.png","FIELD_PHOTO_MARKER","field_photo_");
	}
	
	//객체 선택모드로 변경
	Module.XDSetMouseState(6);
	
	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 현장사진 상세정보 표출하기
 * */
function _getFileListDetail(_data){

	//현장사진 첨부파일 가져오기
	getSliderFileListDetail(_data);
	
	$('.fieldPhoto_info_pop').empty();

	var htmlStr="";
		htmlStr= "<h3><span class='title'>현장사진 정보</span>";
		htmlStr+= "<span class='btn'><button class='close_btn' onclick='closePop()'>닫기</button></span></h3>";

	if(_data.list.length!=0){
		htmlStr+= "<dl class='grid_contents'><dt>경찰청</dt><dd>"+stringNullCheck(_data.list[0].agency_name)+"</dd>";
		htmlStr+= "<dt>경찰서</dt><dd>"+stringNullCheck(_data.list[0].office_name)+"</dd>";
		htmlStr+= "<dt>사고 발생 일시</dt><dd>"+stringNullCheck(_data.list[0].date)+"</dd>";
		htmlStr+= "<dt>분류</dt><dd>"+stringNullCheck(_data.list[0].classification)+"</dd>";
		htmlStr+= "<dt>위치</dt><dd>"+Number(stringNullCheck(_data.list[0].lon)).toFixed(6)+", "+Number(stringNullCheck(_data.list[0].lat)).toFixed(6)+"</dd>";	
		htmlStr+= "<dt>현장명</dt><dd>"+stringNullCheck(_data.list[0].title)+"</dd>";	
		htmlStr+= "<dt>현장내용</dt><dd>"+stringNullCheck(_data.list[0].content)+"</dd>";	
		htmlStr+= "</dl>";
	}
	
	$('.fieldPhoto_info_pop').removeClass('hide');
	$('.fieldPhoto_info_pop').append(htmlStr);

	//로딩바 숨기기
	temp_cf_loadingbarHide();
}

/*
 * 현장사진 첨부파일 표출하기
 * */
function getSliderFileListDetail(_data){
	
	//슬라이더에 사용할파일 리스트 저장
	FIELDPHOTO.FILELIST=_data.detail;
	$('#photoSlider_ul').empty();
	
	var htmlStr="";
	
	for(var i=0;i<_data.detail.length;i++){
		
		htmlStr+='<li class="als-item" onclick="viewFieldPhoto(\''+_data.detail[i].photo_idx+'\',\''+_data.detail[i].photo_idx+'\','+i+')">';
		//이미지
		if(_data.detail[i].content_type.indexOf('image') != -1){
			//htmlStr+='<img class="als-img" id="filed_file_'+thisdata[i].file_no+'"src="/static_resources/gis/field_photo_temp/'+thisdata[i].file_name+'.'+thisdata[i].file_extension+'" alt="'+thisdata[i].file_name+'" title="'+thisdata[i].field_title+'"/><span class="title img">'+thisdata[i].file_name+'</span></li>';										
			htmlStr+='<img class="als-img" id="filed_file_'+_data.detail[i].photo_idx+'"src="/use/gisAnal/fileDn?p='+_data.detail[i].photo_idx+'" alt="'+_data.detail[i].org_file_nm+'" title="'+_data.detail[i].org_file_nm+'"/><span class="title img">'+textLengthOverCut(_data.detail[i].org_file_nm,20)+'</span></li>';										

		//동영상
		}else if(_data.detail[i].content_type.indexOf('video') != -1){
			//htmlStr+='<video class="als-img" id="filed_file_'+thisdata[i].file_no+'"src="/static_resources/gis/field_photo_temp/'+thisdata[i].file_name+'.'+thisdata[i].file_extension+'" alt="'+thisdata[i].file_name+'" title="'+thisdata[i].field_title+'"></video><span class="title vod">'+thisdata[i].file_name+'</span></li>';										
			htmlStr+='<video class="als-img" id="filed_file_'+_data.detail[i].photo_idx+'"src="/use/gisAnal/videoStream?p='+_data.detail[i].photo_idx+'" alt="'+_data.detail[i].org_file_nm+'" title="'+_data.detail[i].org_file_nm+'"></video><span class="title vod">'+textLengthOverCut(_data.detail[i].org_file_nm,20)+'</span></li>';										
			
		}	
	}
	$('#photoSlider_ul').append(htmlStr);
	
	//현장사진 리스트 보이게
	$('.wrap_gallery').removeClass('hide');
	
	$("#photoSlider").als({
		visible_items: _data.detail.length,
		scrolling_items:_data.detail.length/2,
		orientation: "horizontal",
		circular: "no",
		autoscroll: "no"
	});
	
	$('#photoSlider .als-viewport').css('height','100%');
}

/*
 * 현장사진 하단 슬라이더 생성하기
 * */
function createPhotoViewSlider(_fileList){
	
	$('#photoViewSlider_div').empty();

	var htmlViewStr="";
		htmlViewStr+='<div class="view_gallery slider_div hide" id="photoViewSlider" style="overflow: hidden;" >';
		htmlViewStr+='<button class="closeBTN" onclick="closeViewFieldPhoto()">닫기</button>';
		htmlViewStr+='<span class="als-prev" onclick=""></span>';
		htmlViewStr+='<div class="als-viewport">';
		htmlViewStr+='<ul class="als-wrapper" id="photoViewSlider_ul"> ';
	for(var i=0;i<_fileList.length;i++){
		
		htmlViewStr+='<li class="als-item">';
		
		//이미지
		if(_fileList[i].content_type.indexOf('image') != -1){
			//htmlViewStr+='<img class="als-img" id="filed_file_view_'+_fileList[i].file_no+'"src="/static_resources/gis/field_photo_temp/'+_fileList[i].file_name+'.'+_fileList[i].file_extension+'" alt="'+_fileList[i].file_name+'"/><span class="title img">'+_fileList[i].file_name+'</span></li>';										
			htmlViewStr+='<img class="als-img" id="filed_file_view_'+_fileList[i].photo_idx+'"src="/use/gisAnal/fileDn?p='+_fileList[i].photo_idx+'" alt="'+_fileList[i].org_file_nm+'"/><span class="title img">'+_fileList[i].org_file_nm+'</span></li>';										
			
		//동영상
		}else if(_fileList[i].content_type.indexOf('video') != -1){
			//htmlViewStr+='<video autoplay loop class="als-img" id="filed_file_view_'+_fileList[i].file_no+'"src="/static_resources/gis/field_photo_temp/'+_fileList[i].file_name+'.'+_fileList[i].file_extension+'" alt="'+_fileList[i].file_name+'""></video><span class="title vod">'+_fileList[i].file_name+'</span></li>';										
			//htmlViewStr+='<video autoplay loop class="als-img" id="filed_file_view_'+_fileList[i].photo_idx+'"src="/use/gisAnal/videoStream?p='+_fileList[i].photo_idx+'" alt="'+_fileList[i].org_file_nm+'""></video><span class="title vod">'+_fileList[i].org_file_nm+'</span></li>';										
			htmlViewStr+='<video controls class="als-img" id="filed_file_view_'+_fileList[i].photo_idx+'"src="/use/gisAnal/videoStream?p='+_fileList[i].photo_idx+'" alt="'+_fileList[i].org_file_nm+'""></video><span class="title vod">'+_fileList[i].org_file_nm+'</span></li>';										
			
		}
		
	}
	htmlViewStr+='</ul>';
	htmlViewStr+='</div>';
	htmlViewStr+='<span class="als-next" onclick=""></span>';
	htmlViewStr+='</div>';
	
	$('#photoViewSlider_div').append(htmlViewStr);

}

/*
 * 현장사진 위치로 이동하기
 * */
function moveFieldPhotoLocation(_x,_y){
	//카메라 위치 이동(lon,lat,alt,tilt,direct)
	setViewCamera(parseFloat(_x), parseFloat(_y),9000, 90, 0);
}

/*
 * 현장사진 상세정보 가져오기
 * */
function getFieldPhotoInfo(_fieldNo){
	
	var params = {
		idx : _fieldNo.fieldNo
	};

	//경찰서 poi 클릭한 정보 조회
	temp_cf_ajax( "/use/gisAnal/getFileListDetail.do", params, _getFileListDetail);
	

}

/*
 * 사진 팝업 닫기
 * */
function closeViewFieldPhoto(){
	$('.view_gallery').addClass('hide');
	$('.view_gallery').empty();
}

function viewFieldPhoto(_imgSrc,_fileNo,_fromIndex){
	
	createPhotoViewSlider(FIELDPHOTO.FILELIST);
	
	setTimeout(function() {
		$('.view_gallery').removeClass('hide');
		
		$("#photoViewSlider").als({
			visible_items: 1,
			scrolling_items: 1,
			orientation: "horizontal",
			circular: "no",
			autoscroll: "no",
			start_from: _fromIndex
		});
		$('#photoViewSlider .als-viewport').css('width','50%');
		$('#photoViewSlider .als-viewport').css('height','50%');
		$('#photoViewSlider .als-item').last().css('max-width','0px');
		$('#photoViewSlider .als-viewport').css('width',''+$('#photoViewSlider .als-img').eq(_fromIndex).width()+'px');
		
	}, 100);
	
	$(document).on("click", "#photoViewSlider .als-next", function(){
		console.log('@@@@');
		
		if($("#photoViewSlider .als-next").css('display') === 'none'){
			
			setTimeout(function() {
				
				$('#photoViewSlider .als-viewport').css('width',''+$('#photoViewSlider .als-img').eq(_fromIndex).width()+'px');
				
			}, 700);
		}
	});	
}



/*
 * 현장사진 등록 - 화면 표출
 * 
 */
function getRegisterFieldPhotoView(){
	//현장사진 등록시 발생일시 선택하는 달력에 오늘날짜로 초기 셋팅
	var today = new Date();   

	var year = today.getFullYear(); // 년도
	var month = today.getMonth() + 1;  // 월
	if (month < 10) month = '0' + month;
	var date = today.getDate();  // 날짜
	if (date < 10) date = '0' + date;
	var day = today.getDay();  // 요일
	
	//현장사진 목록 화면 숨기기.
	$('#fieldPhotoList_div').addClass('hide');
	$('.wrap_gallery').addClass('hide');
	$('.fieldPhoto_info_pop').addClass('hide');
	//현장사진 등록 버튼 숨기기
	$('#fieldPhoto_add_btn').addClass('hide');
	//현장사진 등록 버튼 숨기기
	$('#fieldPhoto_h1_text').text('현장사진 등록');
	//현장사진 등록 화면 보이기
	$('#fieldPhotoRegisger_div').removeClass('hide');
	//현장사진 등록UI 하단 버튼 보이기
	$('#fieldPhoto_register_btn').removeClass('hide');
	$('#fieldPhoto_update_btn').addClass('hide');
	
	//초기화
	$('#fieldPhotoRegister_select_office').val('');
	$('#fieldPhotoRegister_select_agency').val('');
	$('#fieldPhotoRegister_select_classification').val('');
	$('#datepicker').val(year + '-' + month + '-' + date);
	$('#field_title').val('');
	$('#field_contents').val('');
	$('#fieldPhoto_location').text('지도에서 직접 선택');
	$('.file_list').empty();
	var fileListHtmlStr="";
		fileListHtmlStr+='<li class="tip">이미지 용량은 1mb를 넘을 수 없습니다.</li>';
		fileListHtmlStr+='<li class="tip">jpg/gif/png 파일만 가능합니다.</li>';
	$('.file_list').append(fileListHtmlStr);
	
	
	getFieldPhotoPoliceAgencyList("fieldPhotoRegister_select_agency");
}

/*
 * 현장사진 등록 - 지도에서 위치 선택
 * 
 */
function getFieldPhotoLocation(){

	Module.XDSetMouseState(21);	
	$('.fieldPhoto_location_btn').addClass('active');
	Module.canvas.onclick = function(e) {
		
		var vPointList = Module.getMap().getInputPointList();
		if (vPointList.count == 0) {
			return;
		}
		var vClickPoint = vPointList.item(0);
		
		$('#fieldPhoto_location').text(vClickPoint.Longitude.toFixed(6)+', '+vClickPoint.Latitude.toFixed(6));
		$('.fieldPhoto_location_btn').removeClass('active');
		//객체 선택모드로 변경
		Module.XDSetMouseState(6);
		
		//레이어 생성(layerName, layerType, maxDistance, minDistance)
		createTrueLayer("LOCATION_ICON_MARKER", 5, 30000000.0, 1.0);

		var paramArr=[
			vClickPoint.Longitude,
			vClickPoint.Latitude,
			10,
			"현장위치",
			1];
		
		//사고 마크 그리기
		drawMark(paramArr, "/static_resources/gis/img/icon/location_icon.png","LOCATION_ICON_MARKER","location_icon_");
		
		Module.getMap().clearInputPoint();
		
	};

}


/*
 * poi 그리기
 * */
function drawLocationIcon(pArr,img_src,layer_name,mark_name){

	var img = new Image();
	img.src = img_src;
	
	// [icon, poiLayerName, thisData.ID, thisData.X,thisData.Y, infoMsg];
	// 아이콘,레이어명, 아이디, X, Y, 메세지
	img.info = pArr;
	
	img.onload = function(){
		try{
			var canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;

			var ctx = canvas.getContext('2d');
			// 이미지 data로 생성
				ctx.drawImage(img, 0, 0);
			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
				// [X,Y,Z,이름,NUM]
				Module.getAddObject().Add3DPoint(layer_name, mark_name+img.info[4], parseFloat(img.info[0]),parseFloat(img.info[1]),parseFloat(img.info[2]), imageData, img.width, img.height, img.info[3]);
																																																			
			var object = trueLayerList.nameAtLayer(layer_name).keyAtObject(mark_name+img.info[4]);
			object.setText(img.info[3]);
			var setFlag = object.setVisibleRange(true, 1,10000000);
		}catch(e){
			console.log(e.message);
		}
	}
	
	
}

/*
 * 현장사진 등록 - 첨부파일 리스트 가져오기
 * 
 */
function getSelectedFileList(){

	FIELDPHOTO.FILEINPUTLIST.push()
		
	var fileList=document.getElementById('file_input').files;
	for (var i = 0; i < fileList.length; i++) {
		FIELDPHOTO.FILEINPUTLIST.push(fileList[i]);
	}
	
	var fileListHtmlStr="";
	for(var i=0;i<fileList.length;i++){
		//선택된 파일이 이미지일경우
		if(fileList[i].type.indexOf('image') != -1){
			fileListHtmlStr+='<li class="file img" id="file_li_'+i+'">'+textLengthOverCut(fileList[i].name,100)+'<button class="del" onclick="deleteSelectedFile('+i+',\''+fileList[i].name+'\')"></button></li>';
		}else if(fileList[i].type.indexOf('video') != -1){
			fileListHtmlStr+='<li class="file vod" id="file_li_'+i+'">'+textLengthOverCut(fileList[i].name,100)+'<button class="del" onclick="deleteSelectedFile('+i+',\''+fileList[i].name+'\')"></button></li>';
		}
	}
	$('.file_list').append(fileListHtmlStr);
}

/*
 * 현장사진 등록시 선택했던 파일삭제
 * */
function deleteSelectedFile(_index,_name){

	$('#file_li_'+_index).remove();
	
	//파일리스트에서 파일 삭제
	for(var i = 0; i < FIELDPHOTO.FILEINPUTLIST.length; i++) {
		if(FIELDPHOTO.FILEINPUTLIST[i].name === _name)  {
			FIELDPHOTO.FILEINPUTLIST.splice(i, 1);
		    i--;
		}
	}
}


/*
 * 현장사진 등록하기
 * */
function registerFieldPhoto(){
	//항목 미입력시 알림메시지
	if($('#fieldPhotoRegister_select_agency option:selected').val()==''
	 ||$('#fieldPhotoRegister_select_office option:selected').val()==''
	 ||$('#datepicker').val()==''
	 ||$('#fieldPhotoRegister_select_classification option:selected').val()==''
	 ||$('#field_title').val()==''
	 ||$('#field_contents').val()==''
	 ||$('#fieldPhoto_location').text().indexOf(', ') == -1){
		mcxDialog.alert('현장사진 등록의 모든 항목을 선택/입력해주세요.');
		return;
	}
	var param = {
		agency_name:$('#fieldPhotoRegister_select_agency option:selected').val(),
		office_name:$('#fieldPhotoRegister_select_office option:selected').val(),
		date:$('#datepicker').val(),
		classification:$('#fieldPhotoRegister_select_classification option:selected').val(),
		title : $('#field_title').val(),
		content :$('#field_contents').val(),
		lon :$('#fieldPhoto_location').text().split(', ')[0],
		lat :$('#fieldPhoto_location').text().split(', ')[1],
		save_mode: "insert"
	};

	//파일 전송
	cf_ajaxWithFiles("/use/gisAnal/save.do", FIELDPHOTO.FILEINPUTLIST, param, _registerFieldPhoto);
}

function _registerFieldPhoto(_data){
	mcxDialog.alert('현장사진 등록이 완료되었습니다.');
	getFieldPhoto(1);
	FIELDPHOTO.FILEINPUTLIST=[];
}


/*
 * 현장사진 수정하기 
 * */
function editFieldPhoto(_fieldInfo){

	var params = {
		idx : _fieldInfo.fieldNo
	};
	
	//현장사진 수정하기 기존 데이터 가져오기
	temp_cf_ajax( "/use/gisAnal/getFileListDetail.do", params, _getFileListDetailForEdit);
}

function _getFileListDetailForEdit(_data){

	//현장사진 목록 화면 숨기기.
	$('#fieldPhotoList_div').addClass('hide');
	$('.wrap_gallery').addClass('hide');
	$('.fieldPhoto_info_pop').addClass('hide');
	//현장사진 등록 버튼 숨기기
	$('#fieldPhoto_add_btn').addClass('hide');
	//현장사진 등록 버튼 숨기기
	$('#fieldPhoto_h1_text').text('현장사진 수정');
	//현장사진 등록 화면 보이기
	$('#fieldPhotoRegisger_div').removeClass('hide');
	//현장사진 등록UI 하단 버튼 보이기
	$('#fieldPhoto_update_btn').removeClass('hide');
	$('#fieldPhoto_register_btn').addClass('hide');
	
	//경찰청 리스트 가져오기
	var agency_params={};
	
	temp_cf_ajax( "/use/gisAnal/getFieldPhotoPoliceAgencyList.do", agency_params, function(_agency_data){
		var thisdata=_agency_data.data.data;
		$('#fieldPhotoRegister_select_agency').empty();
		var htmlStr="";
			//htmlStr+="<option value='' >선택해주세요.</option>";
			htmlStr+="<option value='' >전체</option>";
		for(var i=0;i<thisdata.length;i++){
			htmlStr+="<option value='"+thisdata[i].name+"' > "+thisdata[i].name+"</option>";
		}
		$('#fieldPhotoRegister_select_agency').append(htmlStr);
		$('#fieldPhotoRegister_select_agency').val(_data.list[0].agency_name);
		//로딩바 숨기기
		temp_cf_loadingbarHide();
	});
	
	//경찰서 리스트 가져오기
	var office_params={
		agency_name:_data.list[0].agency_name
	};
	
	temp_cf_ajax( "/use/gisAnal/getFieldPhotoPoliceOfficeList.do", office_params, function(_office_data){
		var thisdata=_office_data.data.data;
		$('#fieldPhotoRegister_select_office').empty();
		var htmlStr="";
		if(thisdata.length==0){
			htmlStr+="<option value='' >전체</option>";
		}else{
			htmlStr+="<option value='' >전체</option>";
			for(var i=0;i<thisdata.length;i++){
				htmlStr+="<option value='"+thisdata[i].name+"' > "+thisdata[i].name+"</option>";
			}
		}
		$('#fieldPhotoRegister_select_office').append(htmlStr);
		$('#fieldPhotoRegister_select_office').val(_data.list[0].office_name);
		//로딩바 숨기기
		temp_cf_loadingbarHide();
	});

	
	$('#fieldPhotoRegister_select_classification').val(_data.list[0].classification);
	$('#datepicker').val(_data.list[0].date);
	$('#field_title').val(_data.list[0].title);
	$('#field_contents').val(_data.list[0].content);
	$('#fieldPhoto_location').text(_data.list[0].lon+", "+_data.list[0].lat);
	$('#fieldPhoto_idx').val(_data.list[0].idx);
	
	$('.file_list').empty();
	
	var fileListHtmlStr="";
		fileListHtmlStr+='<li class="tip">이미지 용량은 1mb를 넘을 수 없습니다.</li>';
		fileListHtmlStr+='<li class="tip">jpg/gif/png 파일만 가능합니다.</li>';
	for(var i=0;i<_data.detail.length;i++){
		//선택된 파일이 이미지일경우
		if(_data.detail[i].content_type.indexOf('image') != -1){
			fileListHtmlStr+='<li class="file img" id="edit_file_li_'+i+'">'+textLengthOverCut(_data.detail[i].org_file_nm,100)+'<button class="del" onclick="deleteEditSelectedFile('+i+',\''+_data.detail[i].photo_idx+'\')"></button></li>';
		}else if(_data.detail[i].content_type.indexOf('video') != -1){
			fileListHtmlStr+='<li class="file vod" id="edit_file_li_'+i+'">'+textLengthOverCut(_data.detail[i].org_file_nm,100)+'<button class="del" onclick="deleteEditSelectedFile('+i+',\''+_data.detail[i].photo_idx+'\')"></button></li>';
		}
	}
	$('.file_list').append(fileListHtmlStr);
	
	temp_cf_loadingbarHide();
}


/*
 * 현장사진 수정시 선택했던 파일삭제
 * */
function deleteEditSelectedFile(_index,_photoIdx){
	
	$('#edit_file_li_'+_index).remove();
	FIELDPHOTO.EDITDELITEFILELIST.push(_photoIdx);
	
}

/*
 * 현장사진 수정하기
 * */
function updateFieldPhoto(){
	//항목 미입력시 알림메시지
	if($('#fieldPhotoRegister_select_agency option:selected').val()==''
	 ||$('#fieldPhotoRegister_select_office option:selected').val()==''
	 ||$('#datepicker').val()==''
	 ||$('#fieldPhotoRegister_select_classification option:selected').val()==''
	 ||$('#field_title').val()==''
	 ||$('#field_contents').val()==''
	 ||$('#fieldPhoto_location').text().indexOf(', ') == -1){
		mcxDialog.alert('현장사진 수정의 모든 항목을 선택/입력해주세요.');
		return;
	}
	
	var param = {
		idx:$('#fieldPhoto_idx').val(),
		agency_name:$('#fieldPhotoRegister_select_agency option:selected').val(),
		office_name:$('#fieldPhotoRegister_select_office option:selected').val(),
		date:$('#datepicker').val(),
		classification:$('#fieldPhotoRegister_select_classification option:selected').val(),
		title : $('#field_title').val(),
		content :$('#field_contents').val(),
		lon :$('#fieldPhoto_location').text().split(', ')[0],
		lat :$('#fieldPhoto_location').text().split(', ')[1],
		save_mode: "update",
		delete_file_list:FIELDPHOTO.EDITDELITEFILELIST
	};

	//파일 전송
	cf_ajaxWithFiles("/use/gisAnal/save.do", FIELDPHOTO.FILEINPUTLIST, param, _updateFieldPhoto);
}


/*
 * 현장사진 수정 완료시 수행
 * */
function _updateFieldPhoto(_data){
	mcxDialog.alert('현장사진 수정이 완료되었습니다.');
	getFieldPhoto(1);
	FIELDPHOTO.FILEINPUTLIST=[];
	FIELDPHOTO.EDITDELITEFILELIST=[];
}



/*
 * 현장사진 삭제하기 
 * */
function deleteFieldPhoto(_fieldInfo){
	var params = {
		idx : _fieldInfo.fieldNo
	};

	mcxDialog.confirm(_fieldInfo.fieldTitle+' 현장사진을 삭제하시겠습니까?', {
	  sureBtnClick: function(){
		  temp_cf_ajax( "/use/gisAnal/deletaFile.do", params, function(){
				
			  mcxDialog.alert(_fieldInfo.fieldTitle+'현장사진 삭제가 완료되었습니다.');
				getFieldPhoto(1);
				temp_cf_loadingbarHide();
		}); 
	  }
	});

}