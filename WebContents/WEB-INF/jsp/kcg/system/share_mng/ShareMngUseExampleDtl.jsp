<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false"/>
	<link href="/static_resources/lib/summernote/0.8.18/summernote-lite.min.css" rel="stylesheet">
	<script src="/static_resources/lib/summernote/0.8.18/summernote-lite.min.js"></script>
	<script src="/static_resources/lib/summernote/0.8.18/lang/summernote-ko-KR.min.js"></script>
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
			<li class="active"><strong>활용 사례</strong></li>
		</ol>
	
		<h2>활용 사례 > 상세보기</h2>
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
							<label for="ctnt" class="sys_label_01 control-label">내용</label>
							<div class="sys_col_05">
								<textarea class="form-control" rows="5" id="ctnt" placeholder="내용을 입력하세요."></textarea>
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
						
						
						
						
<!-- 						<div class="form-group"> -->
<!-- 							<label class="col-sm-1 control-label"> -->
<!-- 								활용데이터 -->
<!-- 							</label> -->
<!-- 							<div class="col-sm-11" id="usedataList"> -->
<!-- 								<div class="col-sm-12" v-if="info.cat == 'inD' "> -->
<!-- 									<div class="col-sm-1"> -->
<!-- 										<button type="button" class="btn btn-blue btn-icon btn-small" @click="openPopUseData"> -->
<!-- 											선택 -->
<!-- 											<i class="entypo-check"></i> -->
<!-- 										</button> -->
<!-- 									</div> -->
<!-- 									<div class="col-sm-7"> -->
<!-- 										<input type="hidden" :value="info.usedata.cnnc_manage_no + '|' + info.usedata.table_korean_nm"> -->
<!-- 										<input type="hidden" value="inD" id="cat"> -->
<!-- 										<span class="form-control" :title="info.usedata.table_korean_nm"> -->
<!-- 										내부 : ( {{info.usedata.sys_nm}} )&nbsp;&nbsp;&nbsp;{{info.usedata.table_korean_nm_abbr}} -->
<!-- 										</span> -->
<!-- 									</div> -->
<!-- 								</div> -->
<!-- 								<div class="col-sm-12" v-else-if=" info.cat == 'exD' "> -->
<!-- 									<div class="col-sm-1"> -->
<!-- 										<button type="button" class="btn btn-blue btn-icon btn-small" @click="openPopUseData"> -->
<!-- 											선택 -->
<!-- 											<i class="entypo-check"></i> -->
<!-- 										</button> -->
<!-- 									</div> -->
<!-- 									<div class="col-sm-5"> -->
<!-- 										<input type="hidden" :value="info.usedata.docid"> -->
<!-- 										<input type="hidden" value="exD" id="cat"> -->
<!-- 										<span class="form-control" :title="info.usedata.datanm"> -->
<!-- 										외부 : {{info.usedata.datanm_abbr}} -->
<!-- 										</span> -->
<!-- 									</div> -->
<!-- 								</div> -->
								
<!-- 								<div class="col-sm-12" v-else > -->
<!-- 									<div class="col-sm-5"> -->
<!-- 										<button type="button" class="btn btn-blue btn-icon btn-small" @click="openPopUseData"> -->
<!-- 											활용데이터 선택 -->
<!-- 											<i class="entypo-check"></i> -->
<!-- 										</button> -->
<!-- 									</div> -->
<!-- 								</div> -->
<!-- 							</div> -->
<!-- 						</div> -->
			
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
<!-- 활용데이터 목록 팝업 -->
<div class="modal fade" id="pop_usedataList">
<template>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="btn_popClose">&times;</button>
				<h4 class="modal-title">검색 데이터</h4>
			</div>
			<div class="modal-body">
				<div style="height: 550px;overflow: auto;" class="dataTables_wrapper">
					<div class="dataTables_filter">
						<select v-model="search_gb" @change="init">
							<option value="inD">내부</option>
							<option value="exD">외부</option>
						</select>
						<input type="search" placeholder="" style="width: 120px;" v-model="search_val" @keyup.enter="getList(true)">
						<button type="button" class="btn btn-blue btn-icon icon-left" style="margin-left: 5px;" @click="getList(true)">
							검색
							<i class="entypo-search"></i>
						</button>
					</div>
			
					<table class="table table-bordered datatable dataTable">
						<thead style="position: sticky;top: 0px;">
							<tr>
								<th class="center" width="40%">{{th_header1}}</th>
								<th class="center" width="40%">{{th_header2}}</th>
								<th class="center" width="10%">선택</th>
							</tr>
						</thead>
						<tbody v-if="search_gb == 'inD'">
							<tr v-for="item in dataList" >
								<td style="vertical-align: middle;">{{item.table_korean_nm}}</td>
								<td style="vertical-align: middle;">{{item.sys_nm}}</td>
								<td class="center">
									<button type="button" class="btn btn-blue btn-small" @click="add_usedata(item)">
									선택
									</button>
								</td>
							</tr>
						</tbody>
						<tbody v-else>
							<tr v-for="item in dataList" >
								<td style="vertical-align: middle;">{{item.datanm}}</td>
								<td style="vertical-align: middle;">{{item.doctitle}}</td>
								<td class="center">
									<button type="button" class="btn btn-blue btn-small" @click="add_usedata(item)">
									선택
									</button>
								</td>
							</tr>
						</tbody>
					</table>	
					<div class="dataTables_paginate paging_simple_numbers" id="div_paginate" style="text-align: center;">
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
			</div>
		</div>
	</div>
</template>
</div>
<!--// 활용데이터목록 팝업 -->
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
			reg_dt : "",
			sbjt : "",
			cat : "",
			svc_desc : "",
			ctnt : "",
			use_tgt : "",
			save_mode : "insert",
			usedata : {},
			atch_file_1 : "",
			atch_file_2 : "",
			atch_file_3 : "",
			atch_file_4 : "",
			atch_file_5 : "",
		},
	},
	mounted : function(){
		if(!cf_isEmpty(this.info.idx)){
			this.getInfo();
		}
	},
	methods : {
		getInfo : function(){
			cf_ajax("/system/share_mng/useExample/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info.save_mode = "update";
			
			this.info = data;
			$("#ctnt").summernote("code", this.info.ctnt);
			
		},
		save : function(){
			this.info.ctnt = $("#ctnt").summernote("code");
			var atch_file_1 = $("#atch_file_1").attr("type") === "file" ? $("#atch_file_1")[0].files[0] :  $("#atch_file_1").val();
			var atch_file_2 = $("#atch_file_2").attr("type") === "file" ? $("#atch_file_2")[0].files[0] :  $("#atch_file_2").val();
			var atch_file_3 = $("#atch_file_3").attr("type") === "file" ? $("#atch_file_3")[0].files[0] :  $("#atch_file_3").val();
			var atch_file_4 = $("#atch_file_4").attr("type") === "file" ? $("#atch_file_4")[0].files[0] :  $("#atch_file_4").val();
			var atch_file_5 = $("#atch_file_5").attr("type") === "file" ? $("#atch_file_5")[0].files[0] :  $("#atch_file_5").val();
						
			if(!confirm("저장하시겠습니까?")) return;
			
			var fileList = [];
			var fileMappingInfo = [];
			
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
			
			cf_ajaxWithFiles("/system/share_mng/useExample/save", fileList, this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.idx = data.idx;
			this.getInfo();
		},
		delInfo : function(){
			if(!confirm("삭제하시겠습니까?")) return;
			cf_ajax("/system/share_mng/useExample/delete", this.info, this.delInfoCB);
		},
		delInfoCB : function(data){
			this.gotoList();
		},
		gotoList : function(){
			cf_movePage('/system/share_mng/useExample/list?fromDtl=Y');
		},
		openPopUseData : function(){
			pop_usedataList.init();
			pop_usedataList.search_gb = "inD";
			$('#pop_usedataList').modal('show');
		},
		delUsedata:function(){
			this.info.usedata = {};
			this.info.cat = "";
		}
	}
});

var pop_usedataList = new Vue({
	el : "#pop_usedataList",
	data : {
		dataList : [],
		search_gb : "inD",
		search_val : "",
		th_header1 : "테이블명",
		th_header2 : "시스템명",
	},
	methods : {
		init : function(){
			this.dataList = [];
			this.search_val = "";
			$('#div_paginate').html('');
			this.getList(true);
		},
		getList : function(isInit){
			var params = {
				keyword : this.search_val,
			}
			
			if(isInit === true){
				cv_pagingConfig.pageNo = 1;
			}
			cv_pagingConfig.limit = 7;
			cv_pagingConfig.func = this.getList;
			
			if( this.search_gb === "inD" ){
				cv_pagingConfig.orders = [
					{target : "table_korean_nm", isAsc : true},
				];
				cf_ajax("/system/share_mng/useExample/getInUseDataList", params, this.getListCB);
			} else {
				cv_pagingConfig.orders = [
					{target : "datanm", isAsc : true},
				];
				cf_ajax("/system/share_mng/useExample/getExtUseDataList", params, this.getListCB);
			}
		},
		getListCB : function(data){
			this.dataList = data.list;

			if( this.search_gb === "inD" ){
				this.th_header1 = "테이블명";
				this.th_header2 = "시스템명";
				
				for(var i=0; i<this.dataList.length; i++){
					this.dataList[i].table_korean_nm_abbr = this.dataList[i].table_korean_nm.abbreviate(35);
				}
				
			} else {
				this.th_header1 = "데이터명";
				this.th_header2 = "데이터설명";
				
				for(var i=0; i<this.dataList.length; i++){
					this.dataList[i].datanm_abbr = cf_defaultIfEmpty(this.dataList[i].datanm, "").abbreviate(35);
				}
			}
			
			cv_pagingConfig.renderPagenation("system_pup01");
		},
		add_usedata : function(item){
			vueapp.info.cat = this.search_gb;
			vueapp.info.usedata = item;
			
			$("#btn_popClose").click();
		},
	}
});
</script>
</html>