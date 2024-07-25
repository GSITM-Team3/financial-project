$( document ).ready(function() {
	getFileList();
});

//파일저장
function fileSave(){
	var file1  = $("#mynameisfile1");
	var file2 = $("#mynameisfile2");
	var file3  = $("#mynameisfile3");
	
	var _title  = $("#file_title").val();
	var _content  = $("#file_content").val();
	var _lon  = $("#file_lon").val();
	var _lat  = $("#file_lat").val();
	
	//인풋 파일 리스트
	var fileList =[];
	if(file1[0].files.length!=0){fileList.push(file1[0].files[0]);};
	if(file2[0].files.length!=0){fileList.push(file2[0].files[0]);};
	if(file3[0].files.length!=0){fileList.push(file3[0].files[0]);};
	
	console.log(fileList);
	
	var param = {
			title : _title, 
			content :_content,
			lon :_lon,
			lat :_lat,
			save_mode: "insert"
	};

	//파일 전송
	cf_ajaxWithFiles("/use/gisAnal/save.do", fileList, param, saveCallback);
}

//저장 콜백
function saveCallback(data){
	alert("저장되었습니다.");
	getFileList();
	temp_cf_loadingbarHide();
}

//목록 가져오기 -게시물 목록
function getFileList(){
	param = {
	};
temp_cf_ajax( "/use/gisAnal/getFileList.do", param, getFileListCallback);
}

//게시물 목록 생성
function getFileListCallback(data){
	var data =data.data;
    console.log(data);
    $('#getFileList').empty();
	var str = '';
    for(var i=0; i<data.length; i++){
    	str += '<li id="files" onclick=openfile("'+data[i].idx+'") style="margin-top:5px;cursor: pointer;">'+data[i].title+'</li>';
    }
    $('#getFileList').html(str);
    temp_cf_loadingbarHide();
}

//게시물내용과  첨부 파일 가져오기 
function openfile(_idx){
	console.log(_idx);
	param = {idx : _idx };
	temp_cf_ajax( "/use/gisAnal/getFileListDetail.do", param, openfileCallback);
}

//추가 
function openfileCallback(data){
	console.log(data);
	$('#ftitle').empty();
	$('#fcontent').empty();
	$('#fuser').empty();
	$('#fdate').empty();
	$('#flonlat').empty();
	$('#view').empty();
	$('#list').empty();
	
	
	$('#ftitle').append("제목 : "+data.list[0].title);
	$('#fcontent').append("내용 :"+ data.list[0].content);
	$('#fuser').append("작성자 : "+data.list[0].reg_user);
	$('#flonlat').append("경위도 : " +data.list[0].lon+","+data.list[0].lat);

	//동영상 일시
	if(data.detail[0].file_ext=='mp4'){
		$('#view').append('<video id="video_box" muted="" playsinline=""  src="/use/gisAnal/videoStream?p='+data.detail[0].photo_idx+'" style="width:400px; height:400px" controls></video>')
		$('#list').append('<button class="type_2"  style="width: 50%;" onclick=deleteimg("'+data.list[0].idx+'")>게시물삭제</button>');
		$('#list').append('<button class="type_3"  style="width: 50%;height: 32px;" onclick=updateOpen("'+data.list[0].idx+'")>게시물수정</button>');
		for(i=0;i<data.detail.length;i++){
			var num =i+1;
			if(data.detail[i].file_ext=='mp4'){
				$('#list').append('<button style="width:130px; margin:1px;" class="type_1" onclick=nextvideo("'+data.detail[i].photo_idx+'")>'+num+'</button>');
			}else{
				$('#list').append('<button style="width:130px; margin:1px;" class="type_1" onclick=nextimg("'+data.detail[i].photo_idx+'")>'+num+'</button>');
			}
		}
	//사진일 떄 
	}else{
		$('#view').append('<img id="photo_box" src="/use/gisAnal/fileDn?p='+data.detail[0].photo_idx+'" style="width:400px; height:400px" >');
		$('#list').append('<button class="type_2"  style="width: 50%;" onclick=deleteimg("'+data.list[0].idx+'")>게시물삭제</button>');
		$('#list').append('<button class="type_3"  style="width: 50%;height: 32px;" onclick=updateOpen("'+data.list[0].idx+'")>게시물수정</button>');
		for(i=1;i<data.detail.length;i++){
			var num =i+1;
			if(data.detail[i].file_ext=='mp4'){
				$('#list').append('<button class="type_1" style="width:130px; margin:1px;"  onclick=nextvideo("'+data.detail[i].photo_idx+'")>'+num+'</button>');
			}else{
				$('#list').append('<button class="type_1" style="width:130px; margin:1px;"  onclick=nextimg("'+data.detail[i].photo_idx+'")>'+num+'</button>');
			}	
		}
	}
	temp_cf_loadingbarHide();
}

//1,2,3 첨부파일 버튼-이미지
function nextimg(idx){
	$('#view').empty();
	//사진 보여주기_파일 메타 인덱스
	$('#view').append('<img id="photo_box" src="/use/gisAnal/fileDn?p='+idx+'" style="width:400px; height:400px" >');
}

//1,2,3 첨부파일 버튼-동영상
function nextvideo(idx){
	$('#view').empty();
	//동영상 보여주기_파일 메타 인덱스
	$('#view').append('<video id="video_box" muted="" playsinline=""  src="/use/gisAnal/videoStream?p='+idx+'" style="width:400px; height:400px" controls></video>');
}

//게시물 삭제 
function deleteimg(_idx){
	param = {idx : _idx };
	temp_cf_ajax( "/use/gisAnal/deletaFile.do", param, function(){
		$('#ftitle').empty();
		$('#fcontent').empty();
		$('#fuser').empty();
		$('#fdate').empty();
		$('#flonlat').empty();
		$('#fimg').empty();

		getFileList();
		alert("삭제완료.");
		temp_cf_loadingbarHide();
	});
}

//수정하기 열기 
function updateOpen(_idx){
	console.log(_idx);
	param = {idx : _idx };
	temp_cf_ajax( "/use/gisAnal/getFileListDetail.do", param, updateOpenCallback);
}

function updateOpenCallback(data){
	$(".updateDiv").show();
	console.log(data);
	$('#update_title').empty();
	$('#update_content').empty();
	$('#update_lon').empty();
	$('#update_lat').empty();
	$('#updatefile1').empty();
	$('#updatefile2').empty();
	$('#updatefile3').empty();
	
	$('#update_title').val(data.list[0].title);
	$('#update_content').val(data.list[0].content);
	$('#update_lat').val(data.list[0].lon);
	$('#update_lon').val(data.list[0].lat);

	$('#updatebtn').removeAttr("onclick");
	$('#updatebtn').attr("onclick",'updateFileList("'+data.list[0].idx+'")');
	
	temp_cf_loadingbarHide();
}

//파일 수정하기 
function updateFileList(_idx){
	var file1  = $("#updatefile1");
	var file2 = $("#updatefile2");
	var file3  = $("#updatefile3");
	
	var _title  = $("#update_title").val();
	var _content  = $("#update_content").val();
	var _lon  = $("#update_lon").val();
	var _lat  = $("#update_lat").val();
		
	var fileList =[];
	if(file1[0].files.length!=0){fileList.push(file1[0].files[0]);};
	if(file2[0].files.length!=0){fileList.push(file2[0].files[0]);};
	if(file3[0].files.length!=0){fileList.push(file3[0].files[0]);};
	
	console.log(fileList);

	var param = {
			idx : _idx,
			title : _title, 
			content :_content,
			lon :_lon,
			lat :_lat,
			save_mode: "update"
	};
	
	cf_ajaxWithFiles("/use/gisAnal/save.do", fileList, param, updateCallback);

	$(".updateDiv").hide();
	
}

function updateCallback(data){

	alert("수정완료.");
	temp_cf_loadingbarHide();
}
