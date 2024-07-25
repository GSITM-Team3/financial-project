<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false"/>
	<link href="/static_resources/lib/summernote/0.8.18/summernote-lite.min.css" rel="stylesheet">
	<script src="/static_resources/lib/summernote/0.8.18/summernote-lite.min.js"></script>
	<script src="/static_resources/lib/summernote/0.8.18/lang/summernote-ko-KR.min.js"></script>
	<script src="/static_resources/system/js/bootstrap-datepicker.js"></script>
	<script src="/static_resources/system/js/bootstrap-datepicker.ko.js"></script>
	
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
			<li class="active"><strong>팝업 관리</strong></li>
		</ol>
	
		<h2>팝업 관리 > 상세보기</h2>
		<br/>
		
		<div class="row">
			<div id="vueapp" style="width: 910px; margin-left: 15px;">
			<template>
				<div class="panel panel-primary" data-collapsed="0">
									
					<div class="panel-body">
			
					<form class="form-horizontal form-groups-bordered">
			
						<div class="form-group" >
							<label for="reg_empl_nm" class="sys_label_01 control-label">진행여부</label>
							<div class="sys_col_03">
								<input type="radio" name="prcs_yn" class="form-check-input" v-model="info.prcs_yn" value="Y">진행
								&nbsp;&nbsp;
								<input type="radio" name="prcs_yn" class="form-check-input" v-model="info.prcs_yn" value="N">종료
							</div>
						</div>
			
						<div class="form-group">
							<label for="sbjt" class="sys_label_01 control-label">팝업명</label>
							<div class="sys_col_03">
								<input type="text" class="form-control" id="pup_nm" v-model="info.pup_nm">
							</div>
						</div>
			
						<div class="form-group">
							<label for="strt_dtm" class="sys_label_01 control-label">시작일시</label>
							<div class="sys_col_01">
								<div class="input-group">
									<input type="text" class="form-control datepicker2" id="strt_dtm" v-model="info.strt_dtm" data-format="yyyy-mm-dd">
								</div>
							</div>
							<button type="button" class="btn btn-primary btn-sm datepicker2" id="strt_dtm_btn" style="float: left;">
								<i class="fa fa-calendar"></i>
							</button>	
						</div>
			
						<div class="form-group">
							<label for="end_dtm" class="sys_label_01 control-label">종료일시</label>
							<div class="sys_col_01">
								<div class="input-group">
									<input type="text" class="form-control datepicker2" id="end_dtm" v-model="info.end_dtm" data-format="yyyy-mm-dd" >
								</div>
							</div>
							<button type="button" class="btn btn-primary btn-sm datepicker2" id="end_dtm_todtbtn" style="float: left;">
								<i class="fa fa-calendar"></i>
							</button>	
						</div>
						
						<div class="form-group">
							<label for="ctnt" class="sys_label_01 control-label">팝업위치</label>
							<div class="sys_col_05">
								<div class="form-group">
									<label for="ctnt" class="sys_col_01 control-label">left</label>
									<div class="sys_col_01">
										<input type="text" class="form-control" id="left_pos" v-model="info.left_pos" v-numform maxlength="3">
									</div>
									<label for="d" class="sys_col_01 control-label">top</label>
									<div class="sys_col_01">
										<input type="text" class="form-control" id="top_pos" v-model="info.top_pos" v-numform maxlength="3">
									</div>
								</div>
							</div>
						</div>
						<div class="form-group">
							<label for="ctnt" class="sys_label_01 control-label">팝업크기</label>
							<div class="sys_col_05">
								<div class="form-group">
									<label for="ctnt" class="sys_col_01 control-label">width</label>
									<div class="sys_col_01">
										<input type="text" class="form-control" id="width" v-model="info.width" v-numform maxlength="3">
									</div>
									<label for="ctnt" class="sys_col_01 control-label">height</label>
									<div class="sys_col_01">
										<input type="text" class="form-control" id="height" v-model="info.height" v-numform maxlength="3">
									</div>
								</div>
							</div>
						</div>
						
						<div class="form-group">
							<label for="req_dtl_ctnt" class="sys_label_01 control-label">팝업 내용</label>
							<div class="sys_col_05">
								<textarea class="form-control" rows="6" id="pup_ctnt" placeholder="내용을 입력하세요."></textarea>
							</div>
						</div>
						
						<div class="form-group">
							<div class="col-sm-offset-2 col-sm-5">
								<button type="button" class="btn btn-green btn-icon btn-small" @click="save">
									저장
									<i class="entypo-check"></i>
								</button>
								<button type="button" id="btn_delete" class="btn btn-red btn-icon btn-small" @click="delInfo" style="display: none;">
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

$(document).ready(function()
{
	// https://bootstrap-datepicker.readthedocs.io/en/latest/options.html
	var $this = $(".datepicker2"),
	opts = {
		format: attrDefault($this, 'format', 'mm/dd/yyyy'),
		startDate: attrDefault($this, 'startDate', ''),
		endDate: attrDefault($this, 'endDate', ''),
		daysOfWeekDisabled: attrDefault($this, 'disabledDays', ''),
		startView: attrDefault($this, 'startView', 0),
		rtl: rtl(),
		todayBtn: true,
		language : 'ko',
		autoclose : true,
		todayHighlight : true,
	},
	$n = $this.next(),
	$p = $this.prev();
	
	$this.datepicker(opts).on("changeDate",function(e){
		var objID = e.currentTarget.id;
		var objVal = e.date.format('yyyy-MM-dd');
		var minDate = new Date(objVal.valueOf());
		
		if(objID == 'strt_dtm' || objID == 'strt_dtm_btn'){	//시작일시
 			$("#end_dtm").datepicker('setStartDate',minDate);
 			$("#strt_dtm_btn").datepicker('setStartDate',minDate);
 			vueapp.info.strt_dtm = objVal;
		}else {
			vueapp.info.end_dtm = objVal;
		}
		
	});
	
	
	$('#pup_ctnt').summernote({
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
	
});

var vueapp = new Vue({
	el : "#vueapp",
	data : {
		info : {
			idx : "${idx}",
			pup_nm : "",
			pup_ctnt : "",
			strt_dtm : "",
			end_dtm : "",
			left_pos : "",
			top_pos : "",
			width : "",
			height : "",
			prcs_yn : "Y",
			save_mode : "insert"
		},
	},
	mounted : function(){
		if(!cf_isEmpty(this.info.idx)){
			this.info.save_mode = "update";
			this.getInfo();
		}
	},
	methods : {
		getInfo : function(){
			cf_ajax("/system/etc_mng/popup/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
			$("#pup_ctnt").summernote("code", this.info.pup_ctnt);
		},
		save : function(){
			this.info.pup_ctnt = $("#pup_ctnt").summernote("code");
			cf_ajax("/system/etc_mng/popup/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.save_mode = "update";
			this.info.idx = data.idx;
			this.getInfo();
		},
		gotoList : function(){
			cf_movePage('/system/etc_mng/popup/list?fromDtl=Y');
		},
		delInfo : function(){
			if(!confirm("삭제하시겠습니까?")) return;
			cf_ajax("/system/etc_mng/popup/delete", this.info, this.delInfoCB);
		},
		delInfoCB : function(data){
			this.gotoList();
		},
	}
});
</script>
</html>