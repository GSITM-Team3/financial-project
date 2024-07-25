var csvIndex=0;
function fileArea(input){
	if($("#"+input.id).val().length == 0){
	}else {
	    var fileName = $("#"+input.id).val().split('/').pop().split('\\').pop();
	    $("#"+input.id).parent('div').find('input:text').val(fileName);
	    
	    var reader = new FileReader();
	    
	  	var csv = input.files[0];
	  	reader.readAsText(csv, "UTF-8");
	  	reader.onload = function (e) {
	  		var text = e.target.result;
	  		var data = csvCustom(text);
	  		$('#csv_tbody_header').removeClass("hide");
	  		$('#csv_tbody').empty();
	  		var str="";
	  		for(i=0;i<data.length;i++){
	  			str+="<tr><th>"+data[i][0]+"</th><td>"+data[i][1]+"</td><td>"+data[i][2]+"</td><td>"+data[i][3]+"</td></tr>";
	  		}
	  		$('#csv_tbody').append(str);
	  	}
	}
}

function csvCustom(data) {
	var temp= data.split("\r\n");
	var arr = [];
	for(i=0;i<temp.length;i++){
		var inarr = temp[i].split(",");
		arr.push(inarr);
	}
	return arr;
}

function craetePointCSV(){
		var reader = new FileReader();
	    var input =document.getElementById('csvFile');
	  	var csv = input.files[0];
	  	reader.readAsText(csv, "UTF-8");
	  	reader.onload = function (e) {
	  		var text = e.target.result;
	  		var data = csvCustom(text);
	  		
	  		for(i=0;i<data.length;i++){
	  			var pointTitle = data[i][0];      
	  		    var pointX = Number(data[i][1]); //x 좌표
	  		    var pointY = Number(data[i][2]); //y 좌표
	  		    var alt = Module.getMap().getTerrHeight(pointX,pointY);
	  		  createCSVpoint(pointX,pointY,alt,pointTitle);
	  		}
	  	}
}
function createCSVpoint(lon,lat,alt,gid) {
	// POI 오브젝트를 추가 할 레이어 생성
	var layer = trueLayerList.createLayer("pointCSV", Module.ELT_3DPOINT);	
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
		var poi_with_text_n_image = Module.createPoint("coordinatePoint_"+csvIndex);
		poi_with_text_n_image.setPosition(new Module.JSVector3D(lon, lat,alt));
		poi_with_text_n_image.setImage(ctx.getImageData(0, 0, this.width, this.height).data, this.width,this.height);
		// 텍스트 설정
		poi_with_text_n_image.setText(gid);
		
		this.layer.addObject(poi_with_text_n_image, 0);
    };
    img.layer = layer;
    img.src = "/static_resources/gis/data/select_icon2.png";
    csvIndex++;
}

function clearCSV(){
	 $("#csvFile").val("");
	 $("#csvFile").parent('div').find('input:text').val("선택된 파일 없음");
	trueLayerList.nameAtLayer("pointCSV").removeAll();
	$('#csv_tbody').empty();
	$('#csv_tbody_header').addClass("hide");
	csvIndex=0;
}
