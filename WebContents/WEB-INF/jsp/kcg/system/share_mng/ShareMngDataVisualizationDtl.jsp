<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false"/>
	<link href="/static_resources/lib/summernote/0.8.18/summernote-lite.min.css" rel="stylesheet">
	<script src="/static_resources/lib/summernote/0.8.18/summernote-lite.min.js"></script>
	<script src="/static_resources/lib/summernote/0.8.18/lang/summernote-ko-KR.min.js"></script>
	
	<script type='text/javascript' src='https://10ax.online.tableau.com/javascripts/api/viz_v1.js'></script>
	
	<!-- Imported styles on this page -->
	<title>관리자시스템</title>
</head>
<body class="page-body">

<div class="page-container">

	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp" flush="false"/>

	<div class="main-content">

		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp" flush="false"/>
		
		<ol class="breadcrumb bc-3">
			<li><a href="#none" onclick="cf_movePage('/system')"><i class="fa fa-home"></i>Home</a></li>
			<li class="active"><strong>데이터 시각화</strong></li>
		</ol>
	
		<h2>데이터 시각화 > 상세보기</h2>
		<br/>
		
		<div class="row">
			<div id="vueapp" style="width: 910px; margin-left: 15px;">
			<template>
				<div class="panel panel-primary" data-collapsed="0">
									
					<div class="panel-body">
			
					<form class="form-horizontal form-groups-bordered">
			
						<div class="form-group" v-if="info.idx != ''">
							<label for="reg_user_name" class="sys_label_01 control-label">작성자</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="reg_user_name" v-model="info.reg_user_name" readonly="readonly">
							</div>
							<label for="reg_dt_char" class="sys_label_01 control-label">작성일</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="reg_dt_char" v-model="info.reg_dt_char" readonly="readonly">
							</div>
						</div>
			
						<div class="form-group">
							<label for="sbjt" class="sys_label_01 control-label">제목</label>
							<div class="sys_col_03">
								<input type="text" class="form-control" id="sbjt" v-model="info.sbjt">
							</div>
						</div>
						<div class="form-group">
							<label for="hash_tag" class="sys_label_01 control-label">해시태그</label>
							<div class="sys_col_03">
								<input type="text" class="form-control" id="hash_tag" v-model="info.hash_tag">
							</div>
						</div>
						<div class="form-group">
							<label for="tableau_url" class="sys_label_01 control-label">태블로 URL</label>
							<div class="sys_col_05">
								<input type="text" class="form-control" id="tableau_url" v-model="info.tableau_url">
							</div>
						</div>
			
						<div class="form-group">
							<label for="ctnt" class="sys_label_01 control-label">내용</label>
							<div class="sys_col_05">
								<textarea class="form-control" rows="5" id="ctnt" placeholder="내용을 입력하세요."></textarea>
							</div>
						</div>
			
						<div class="form-group">
							<label for="ctnt" class="sys_label_01 control-label">썸네일</label>
							<div class="sys_col_05">
								<div class="form-group" v-if="info.thumbnail_file != ''">
									<div class="col-sm-11">
										<input type="hidden" id="thumbnail_file" :value="info.thumbnail_file">
										<img :src="'/common/fileDn?p=' + info.thumbnail_file" width="120" alt="">
										<button class="btn btn-black" type="button" style="margin-right: 6px;" @click="cf_fileDn(info.thumbnail_file)">
											<span class="hidden-xs">다운로드</span>
											<i class="entypo-download"></i>
										</button>
										<button class="btn btn-red" type="button" @click="del_thumbnail_file">
											<span class="hidden-xs">삭제</span>
											<i class="entypo-minus"></i>
										</button>
									</div>
								</div>
								<div class="form-group" v-else>
									<div class="col-sm-11">
										<input type="file" class="form-control" id="thumbnail_file" accept=".jpg, .jpeg, .gif, .png, .bmp">
									</div>
								</div>
							</div>
						</div>
								
						<div class="form-group">
							<label class="sys_label_01 control-label">첨부파일</label>
							<div class="sys_col_05">
								<div class="form-group" v-if="!!info.atch_file_1">
									<jsp:include page="/WEB-INF/jsp/kcg/_include/system/attach_file_01.jsp" flush="false">
										<jsp:param name="atch_file_no" value="1" />
									</jsp:include>
								</div>
								<div class="form-group" v-else>
									<div class="col-sm-11">
										<input type="file" class="form-control" id="atch_file_1">
									</div>
								</div>
								
								<div class="form-group" v-if="!!info.atch_file_2">
									<jsp:include page="/WEB-INF/jsp/kcg/_include/system/attach_file_01.jsp" flush="false">
										<jsp:param name="atch_file_no" value="2" />
									</jsp:include>
								</div>
								<div class="form-group" v-else>
									<div class="col-sm-11">
										<input type="file" class="form-control" id="atch_file_2"  >
									</div>
								</div>
								
								<div class="form-group" v-if="!!info.atch_file_3">
									<jsp:include page="/WEB-INF/jsp/kcg/_include/system/attach_file_01.jsp" flush="false">
										<jsp:param name="atch_file_no" value="3" />
									</jsp:include>
								</div>
								<div class="form-group" v-else>
									<div class="col-sm-11">
										<input type="file" class="form-control" id="atch_file_3"  >
									</div>
								</div>
								
								<div class="form-group" v-if="!!info.atch_file_4">
									<jsp:include page="/WEB-INF/jsp/kcg/_include/system/attach_file_01.jsp" flush="false">
										<jsp:param name="atch_file_no" value="4" />
									</jsp:include>
								</div>
								
								<div class="form-group" v-else>
									<div class="col-sm-11">
										<input type="file" class="form-control" id="atch_file_4"  >
									</div>
								</div>
								
								<div class="form-group" v-if="!!info.atch_file_5">
									<jsp:include page="/WEB-INF/jsp/kcg/_include/system/attach_file_01.jsp" flush="false">
										<jsp:param name="atch_file_no" value="5" />
									</jsp:include>
								</div>
								<div class="form-group" v-else>
									<div class="col-sm-11">
										<input type="file" class="form-control" id="atch_file_5"  >
									</div>
								</div>
								
							</div>
						</div>
			
						<div class="form-group">
							<div class="col-sm-offset-2 col-sm-5">
								<button type="button" class="btn btn-green btn-icon btn-small" @click="save">
									저장
									<i class="entypo-check"></i>
								</button>
								<button type="button" id="btn_delete" class="btn btn-red btn-icon btn-small" @click="delInfo">
									삭제
									<i class="entypo-trash"></i>
								</button>
								<button type="button" class="btn btn-blue btn-icon btn-small" @click="gotoList">
									목록
									<i class="entypo-list"></i>
								</button>
							</div>
						</div>
					</form>
						
					</div>
				
				</div>
			</template>
			</div>
		</div>
		
		<br />
		
		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp" flush="false"/>
		
	</div>
</div>
</body>
<script>
$(function(){	
	$('#ctnt').summernote({
		lang: 'ko-KR',
		tabsize: 2,
		height: 200,
		width: 700,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']],
            ['view', ['codeview']],
            ['height', ['height']],
          ],
          styleTags: ['p','h1','h2','h3', 'h4','h5','h6',],
	});
})

var vueapp = new Vue({
	el : "#vueapp",
	data : {
		info : {
			idx : "${idx}",
			reg_user_name : "",
			reg_dt_char : "",
			sbjt : "",
			tableau_url : "",
			desc : "",
			ctnt : "",
			save_mode : "insert",
			atch_file_1 : "",
			atch_file_2 : "",
			atch_file_3 : "",
			atch_file_4 : "",
			atch_file_5 : "",
			thumbnail_file : "",
			hash_tag : "",
		},
	},
	mounted : function(){
		if(!cf_isEmpty(this.info.idx)){
			this.getInfo();
		}
	},
	methods : {
		del_thumbnail_file : function(){
			this.info.thumbnail_file = "";
		},
		getInfo : function(){
			cf_ajax("/system/share_mng/dataVisualization/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info.save_mode = "update";
			this.info = data;
			$("#ctnt").summernote("code", this.info.ctnt);
		},
		save : function(){
			this.info.ctnt = $("#ctnt").summernote("code");
			var thumbnail_file = $("#thumbnail_file").attr("type") === "file" ? $("#thumbnail_file")[0].files[0] :  $("#thumbnail_file").val();
			var atch_file_1 = $("#atch_file_1").attr("type") === "file" ? $("#atch_file_1")[0].files[0] :  $("#atch_file_1").val();
			var atch_file_2 = $("#atch_file_2").attr("type") === "file" ? $("#atch_file_2")[0].files[0] :  $("#atch_file_2").val();
			var atch_file_3 = $("#atch_file_3").attr("type") === "file" ? $("#atch_file_3")[0].files[0] :  $("#atch_file_3").val();
			var atch_file_4 = $("#atch_file_4").attr("type") === "file" ? $("#atch_file_4")[0].files[0] :  $("#atch_file_4").val();
			var atch_file_5 = $("#atch_file_5").attr("type") === "file" ? $("#atch_file_5")[0].files[0] :  $("#atch_file_5").val();
						
			
			var fileList = [];
			var fileMappingInfo = [];

			if(cf_isEmpty(this.info.sbjt)){
				alert("제목은 필수입니다.");
				$("#sbjt").focus();
				return;
			}
			if(cf_isEmpty($("#ctnt").val().trim())){
				alert("내용은 필수입니다.");
				$("#ctnt").focus();
				return;
			}
			if(cf_isEmpty(thumbnail_file)){
				alert("썸네일은 필수입니다.");
				$("#thumbnail_file").focus();
				return;
			}
			if(!confirm("저장하시겠습니까?")) return;
			
			if(cf_whatIsIt(thumbnail_file) === "file") {
				fileList.push(thumbnail_file);
				fileMappingInfo.push("thumbnail_file");
				this.info.thumbnail_file = "";
			}
			
			if(cf_isEmpty(atch_file_1)){
				this.info.atch_file_1 = "";
			} else if(cf_whatIsIt(atch_file_1) === "file") {
				fileList.push(atch_file_1);
				fileMappingInfo.push("atch_file_1");
			}
			
			if(cf_isEmpty(atch_file_2)){
				this.info.atch_file_2 = "";
			} else if(cf_whatIsIt(atch_file_2) === "file") {
				fileList.push(atch_file_2);
				fileMappingInfo.push("atch_file_2");
			}
			
			if(cf_isEmpty(atch_file_3)){
				this.info.atch_file_3 = "";
			} else if(cf_whatIsIt(atch_file_3) === "file") {
				fileList.push(atch_file_3);
				fileMappingInfo.push("atch_file_3");
			}
			
			if(cf_isEmpty(atch_file_4)){
				this.info.atch_file_4 = "";
			} else if(cf_whatIsIt(atch_file_4) === "file") {
				fileList.push(atch_file_4);
				fileMappingInfo.push("atch_file_4");
			}
			
			if(cf_isEmpty(atch_file_5)){
				this.info.atch_file_5 = "";
			} else if(cf_whatIsIt(atch_file_5) === "file") {
				fileList.push(atch_file_5);
				fileMappingInfo.push("atch_file_5");
			}
			
			this.info.fileMappingInfo = fileMappingInfo;
			
			this.info.tableau_url = encodeURIComponent(this.info.tableau_url);
			
			cf_ajaxWithFiles("/system/share_mng/dataVisualization/save", fileList, this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.idx = data.idx;
			this.getInfo();
		},
		delInfo : function(){
			if(!confirm("삭제하시겠습니까?")) return;
			cf_ajax("/system/share_mng/dataVisualization/delete", this.info, this.delInfoCB);
		},
		delInfoCB : function(data){
			this.gotoList();
		},
		gotoList : function(){
			cf_movePage('/system/share_mng/dataVisualization/list?fromDtl=Y');
		},
	}
});
</script>
</html>