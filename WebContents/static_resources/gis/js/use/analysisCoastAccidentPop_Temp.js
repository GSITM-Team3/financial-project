
function getPop(){
	var params= {

		//"search_month": $('#analysis_select_year option:selected').val()+'-'+$('#analysis_select_month option:selected').val()
	};
	
	//경찰청별 말풍선 데이터 조회
	temp_cf_ajax( "/use/gisAnal/getDfResultPolice.do", params, _getPop);
}

var tempArr = []

function _getPop(_data){

	console.log(_data);
	// 말풍선 팝업 레이어 있으면 삭제
	if(trueLayerList.nameAtLayer("BOX_COUNT_POP_2021") != null){		
		trueLayerList.nameAtLayer("BOX_COUNT_POP_2021").removeAll();
	}
	
	// 말풍선 팝업 레이어 추가
	var layer = trueLayerList.createLayer("BOX_COUNT_POP_2021", 5);
		layer.setMaxDistance(200000.0);
		layer.setMinDistance(1.0);
	
	trueLayerList.nameAtLayer("BOX_COUNT_POP_2021").setVisible(false);
	
	var thisdata=_data.data.data;
	for(var i=0;i<thisdata.length;i++){
		
		//if(thisdata[i].orgnzt_nm=='안면파출소'||thisdata[i].orgnzt_nm=='신항광역파출소'||thisdata[i].orgnzt_nm=='신안파출소'){
			
			// 말풍선 팝업에 들어갈 내용
			var tempStr = "<div class='float_win' id='float_win_"+i+"'><h1>"+thisdata[i].orgnzt_nm+"</h1>"
			tempStr += "<dl><dt>"+Number.parseFloat(thisdata[i].workload).toFixed(2)+"</dt>";
			tempStr += "<dd>치안수요</dd></dl>";
			tempStr += "<dl><dt>"+thisdata[i].new_psncpa_police+"</dt>";
			tempStr += "<dd>필요정원</dd></dl>";
			tempStr += "<dl><dt>"+thisdata[i].workloadrate4+"</dt>";
			tempStr += "<dd>등급</dd></dl></div>";
			
			
			// 말풍선 팝업에 내용 붙이기
			$("#float_win_area").append(tempStr);
			$('#float_win_area').removeClass('hide');
			
			//var wd = $('#temp_pop'+i).width(); //팝업창 사이즈 구하기
			//var hi = $('#temp_pop'+i).height();
			
			var wd = $('#float_win_'+i).width()+20; //팝업창 사이즈 구하기
			var hi = $('#float_win_'+i).height()+105;
			
			var geom = JSON.parse(thisdata[i].the_geom_point);
			
			var lon = geom.coordinates[0];
			var lat = geom.coordinates[1];
			
			var tempIdx = 0;
			// 말풍선 팝업 좌표
			tempArr.push(lon+"_"+lat);
			
			// 말풍선 그리기
			html2canvas(document.getElementById("float_win_"+i), {
				backgroundColor: "rgba(0,0,0,0)"

			}).then(function(canvas) {
				
				var imgData = canvas.getContext('2d').getImageData(0, 0, wd, hi); 
				console.log( imgData.width+' '+imgData.height)
				var lon_lat = tempArr[tempIdx].split("_");
				var img_lon = lon_lat[0];
				var img_lat = lon_lat[1];
				var img_alt = 2000;
				
				
				Module.getAddObject().Add3DPoint( "BOX_COUNT_POP_2021", 'areaOne'+i, parseFloat(img_lon), parseFloat(img_lat), parseFloat(img_alt)+20, imgData.data, imgData.width, imgData.height, '' );//신규 말풍선 생성
				tempIdx++; 
				
			});
		//}
	
	}
}

function getPopImgDraw(){
	for(var i=0;i<tempArr.length;i++){
		var lon_lat = tempArr[i].split("_");
		var img_lon = lon_lat[0];
		var img_lat = lon_lat[1];
		console.log(lon_lat);
		getPopImg(i,img_lon,img_lat);
		
	}
}

function getPopImg(_i,_lon,_lat){
	html2canvas(document.getElementById("float_win_"+_i), {
		backgroundColor: null,
		width:$('#float_win_'+_i).width()+2,
        height:$('#float_win_'+_i).height()+20
	}).then(function(canvas) {

		var myImage = canvas.toDataURL('image/png');
		
		//myImg = myImg.replace("data:image/png;base64,", "");
		
	    var blobBin = atob(myImage.split(',')[1]);	// base64 데이터 디코딩
	    var array = [];
	    for (var i = 0; i < blobBin.length; i++) {
	        array.push(blobBin.charCodeAt(i));
	    }
	    var fileList=[];
	    var file = new Blob([new Uint8Array(array)], {type: 'image/png'});	// Blob 생성
	    fileList.push(file);
	    var formdata = new FormData();	// formData 생성
	    formdata.append("file", file, 'box_'+_lon+'_'+_lat+'.png');	// file data 추가
	    
		
		
		var params= {

			"imgName" : 'box_'+_lon+'_'+_lat+'.png'
		};
		
		
		cf_ajaxWithFiles("/use/gisAnal/saveImg.do", fileList, params, _uploadImg);
		
	});
}

function _uploadImg(_data){
	console.log(_data);
}

//이미지(png)로 다운로드
/*
function downloadURI(uri, name){
    var link = document.createElement("a")
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
}*/

