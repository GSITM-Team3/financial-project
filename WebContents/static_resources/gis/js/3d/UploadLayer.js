var excList;

function excelExport(event) {
	excelExportCommon(event, handleExcelDataAll);
}
function excelExportCommon(event, callback) {
	var input = event.target;
	var reader = new FileReader();
	var files = input.files[0];
	/*if(files.type!="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
		alert('XLSX형식의 파일을 올려주세요.');
	      return;
	}*/
	
	reader.onload = function() {
		var fileData = reader.result;
		var wb = XLSX.read(fileData, {
			type : 'binary'
		});
		var sheetNameList = wb.SheetNames; // 시트 이름 목록 가져오기 
		var firstSheetName = sheetNameList[0]; // 첫번째 시트명
		var firstSheet = wb.Sheets[firstSheetName]; // 첫번째 시트 
		var header = handleExcelDataHeader(firstSheet);
		if(header[0]=="Name" &&header[1]=="X"&&header[2]=="Y"&&header[3]=="Z"){
			console.log(header);
		}else{
			alert('헤더형식에 맞춰 파일을 올려주세요. 헤더:Name,X,Y,Z');
			return;
		}
		callback(firstSheet);
	};
	reader.readAsBinaryString(input.files[0]);
	$('#excelName').val(files.name);
}
function handleExcelDataAll(sheet) {
	handleExcelDataHtml(sheet); // html 형태
}

function handleExcelDataHtml(sheet) {
	/*//$("#displayExcelHtml").html(XLSX.utils.sheet_to_html(sheet));
	$("#displayExcelHtml table").css('width', '100%');
	$("#displayExcelHtml").css('overflow', 'auto')
	$("#displayExcelHtml").css('width', '100%')
	$("#displayExcelHtml").css('height', '35%');
	$("#displayExcelHtml").css('border', '1px solid');*/
	excList = (XLSX.utils.sheet_to_json(sheet));
	createExcPOI();
}

function get_header_row(sheet) {
	var headers = [];
	var range = XLSX.utils.decode_range(sheet['!ref']);
	var C, R = range.s.r; /* start in the first row */
	/* walk every column in the range */
	for (C = range.s.c; C <= range.e.c; ++C) {
		var cell = sheet[XLSX.utils.encode_cell({
			c : C,
			r : R
		})] /* find the cell in the first row */

		var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
		if (cell && cell.t)
			hdr = XLSX.utils.format_cell(cell);

		headers.push(hdr);
	}
	return headers;
}

//엑셀 데이터로 POI생성
function createExcPOI() {
	$("#excel_tbody").empty();
/*	$("#displayExcelHtml").css('overflow', 'auto')
	$("#displayExcelHtml").css('width', '100%')*/


	//헤더
/*	$("#displayExcelHtmlTable").append('<tr><th>Name</th><th>X</th><th>Y</th><th>Z</th></tr>');*/
	
	var maxX = excList[0].X;
	var minX = excList[0].X;
	var maxY = excList[0].Y;
	var minY = excList[0].Y;
	var xAver = 0;
	var	yAver = 0;
	for (i = 0; i < excList.length; i++) {
		var name = excList[i].Name;
		var x = excList[i].X;
		var y = excList[i].Y;
		var z = excList[i].Z;
		var num = excList[0].__rowNum__;
		createText(x, y, z, name, num);
		/*createIcon(x, y, z, num);*/
		
			//헤더빼고 tr,td
			$("#excel_tbody").append('<tr onclick="moveLonLatAlt('+x+','+y+','+5000+')">'+'<td>'+name+'</td>'+'<td >'+x+'</td>'+'<td>'+y+'</td>'+'<td>'+z+'</td>'+'</tr>');

			
			if(excList[i].X > maxX){
				maxX = excList[i].X ;
			}
			if(excList[i].X < minX){
				minX = excList[i].X ;	
			}
			if(excList[i].Y > maxY){
				maxY = excList[i].Y ;	
			}
			if(excList[i].Y < minY){
				minY = excList[i].Y ;
			}
	          
            console.log("최대X"+maxX);
            console.log("최소X"+minX);
            console.log("최대Y"+maxY);
            console.log("최소Y"+minY);
            
			var dist = distance(maxX,maxY,minX,minY);
			console.log("거리: "+dist);
			xAver = (parseFloat(maxX) + parseFloat(minX))/2; //경도 중간 지점
			yAver = (parseFloat(maxY) + parseFloat(minY))/2; //위도 중간 지점
            console.log("중심X: "+xAver);
            console.log("중심Y: "+yAver);
			moveLonLatAlt(xAver,yAver,dist); // 구한 값으로 이동	
	
	}
}

//텍스트 POI생성
function createText(x, y, z, name, num) {

	var longitude = x;
	var latitude = y;
	var altitude = z + 0.1;
	var name = name;
	// Point 오브젝트 생성
	var object = Module.createPoint('pointObject' + num);
	var icon = GLOBAL.Symbol.getIcon("Icon1");
	// Symbol에서 iconName으로 Icon 객체 반환
	// 오브젝트 위치 지정
	var poiposition = new Module.JSVector3D(parseFloat(longitude),
			parseFloat(latitude), parseFloat(altitude));
	object.setPosition(poiposition);
	object.setIcon(icon);
	// Point 텍스트 스타일 설정
	object.setText(name);
	var fillColor = new Module.JSColor(255, 255, 255, 255);
	var lineColor = new Module.JSColor(255, 0, 0, 0);
	object.setFontStyle('맑은 고딕', 15, 600, fillColor, lineColor);
	object.setVisibleRange(true, 10, 1000000);
	// 생성한 오브젝트를 레이어에 추가
	GLOBAL.LayerText.addObject(object, 0);
	Module.XDRenderData();
	
};

/*function createIcon(x, y, z, num) {

	var longitude = x;
	var latitude = y;
	var altitude = z;
	// Point 오브젝트 생성
	var object = Module.createPoint('IconObject' + num);

	// Symbol에서 iconName으로 Icon 객체 반환
	var icon = GLOBAL.Symbol.getIcon("Icon1");
	// 오브젝트 위치 지정
	var poiposition = new Module.JSVector3D(parseFloat(longitude),
			parseFloat(latitude), parseFloat(altitude));
	object.setPosition(poiposition);
	object.setVisibleRange(true, 10, 50000);
	object.setIcon(icon);
	// 생성한 오브젝트를 레이어에 추가
	GLOBAL.LayerIcon.addObject(object, 0);

	Module.XDRenderData();

};*/

function poiRe() {
	GLOBAL.LayerText.removeAll();
	GLOBAL.LayerIcon.removeAll();
	$("#excel_tbody").empty();
}

/*//샘플 모달창

$("#sampleButton").click(function() {
	$("#modal").css("display", "block");
});

$("#modal_close_btn").click(function() {
	$("#modal").css("display", "none");
});
*/
//텍스트 컸다 키기
function TextPoi() {
	if ($("input:checkbox[id=TextPoi]").is(":checked")) {
		GLOBAL.LayerText.setVisible(true);
	} else {
		GLOBAL.LayerText.setVisible(false);
	}
}
//아이콘 컸다 키기
/*function IconPoi() {
	if ($("input:checkbox[id=IconPoi]").is(":checked")) {
		GLOBAL.LayerIcon.setVisible(true);
	} else {
		GLOBAL.LayerIcon.setVisible(false);
	}
}*/

function dragOver(e) {
	e.stopPropagation();
	e.preventDefault();
	  if (e.type == "dragover") {
	        $(e.target).css({
	            "opacity": "0.5"
	        });
	    } else {
	        $(e.target).css({
	        	"opacity": "1"
	        });
	    }
	
}
//드래그 앤 드랍시 
function uploadFiles(e) {
	e.stopPropagation();
	e.preventDefault();
	dragOver(e); //1
	 
	if (e.type == "dragover") {
	        $(e.target).css({
	            "background-color": "black",
	            "outline-offset": "-20px"
	        });
	    } else {
	        $(e.target).css({
	            "background-color": "gray",
	            "outline-offset": "-10px"
	        });
	    }
	
	e.dataTransfer = e.originalEvent.dataTransfer; //2
	var files = e.target.files || e.dataTransfer.files;
	/*if(files[0].type!="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
		alert('XLSX형식의 파일을 올려주세요.');
	      return;
	}*/
	var reader = new FileReader();

	reader.onload = function() {
		var fileData = reader.result;
		var wb = XLSX.read(fileData, {
			type : 'binary'
		});
		var sheetNameList = wb.SheetNames; // 시트 이름 목록 가져오기 
		var firstSheetName = sheetNameList[0]; // 첫번째 시트명
		var firstSheet = wb.Sheets[firstSheetName]; // 첫번째 시트 
		var header = handleExcelDataHeader(firstSheet);
		if(header[0]=="Name" &&header[1]=="X"&&header[2]=="Y"&&header[3]=="Z"){
			console.log(header);
		}else{
			alert('헤더형식에 맞춰 파일을 올려주세요. 헤더:Name,X,Y,Z');
			return;
		}
		handleExcelDataAll(firstSheet);
	};
	reader.readAsBinaryString(files[0]);
	$('#excelName').val(files[0].name);


}


function handleExcelDataHeader(sheet){
    var headers = get_header_row(sheet);
    return headers;
}
	

function distance( lon1,lat1,lon2, lat2) {

var theta = lon1 - lon2;
var dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));

dist = Math.acos(dist);
dist = rad2deg(dist);
dist = dist * 60 * 1.1515;

dist = dist * 1609.344;

return dist;
}

//This function converts decimal degrees to radians
function deg2rad( deg) {
return (deg * Math.PI / 180.0);
}

//This function converts radians to decimal degrees
function rad2deg( rad) {
return (rad * 180 / Math.PI);
}

//다운로드 엑셀샘플
function downloadSample(){
	location.href="./resources/sample/sample.xlsx";
}

/**
* 경위고도로 이동 (현재는 사용안함)
* @param x 경도
* @param y 위도
* @param z 고도
*/
function moveLonLatAlt(x,y,z){
Module.getViewCamera().moveLonLat(x, y);
Module.getViewCamera().setAltitude(z);
Module.getViewCamera().setDirect(0);
Module.getViewCamera().setTilt(90);
}


