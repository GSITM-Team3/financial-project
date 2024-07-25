<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false"/>
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
			<li class="active"><strong>분석 도구 신청 관리</strong></li>
		</ol>
	
		<h2>분석 도구 신청 관리 > 상세보기</h2>
		<br />
		
		<div class="row">
			<div id="vueapp" style="width: 910px; margin-left: 15px;">
			<template>
				<div class="panel panel-primary" data-collapsed="0">
									
					<div class="panel-body">
			
					<form class="form-horizontal form-groups-bordered">
			
						<div class="form-group">
							<label for="reg_user_name" class="sys_label_01 control-label">신청자명</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="reg_user_name" v-model="info.reg_user_name" readonly="readonly">
							</div>
							<label for="reg_dt_char" class="sys_label_01 control-label">신청일</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="reg_dt_char" v-model="info.reg_dt_char" readonly="readonly">
							</div>
						</div>
			
						<div class="form-group">
							<label for="sbjt" class="sys_label_01 control-label">제목</label>
							<div class="sys_col_03">
								<input type="text" class="form-control" id="sbjt" v-model="info.sbjt" readonly="readonly">
							</div>
						</div>
			
						<div class="form-group">
							<label class="sys_label_01 control-label">신청기간</label>
							<div class="sys_col_01">
								<input type="text" class="form-control" id="req_perd_strt_dtm" v-model="info.req_perd_strt_dtm" readonly="readonly">
							</div>
							<span class="sys_span_01">
								<strong>~</strong>
							</span>
							<div class="sys_col_01">
								<input type="text" class="form-control" id="req_perd_end_dtm" v-model="info.req_perd_end_dtm" readonly="readonly">
							</div>
						</div>
						<div class="form-group">
							<label for="anal_tool_gbn_nm" class="sys_label_01 control-label">분석도구</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="anal_tool_gbn_nm" v-model="info.anal_tool_gbn_nm" readonly="readonly">
							</div>
							<label for="req_sts" class="sys_label_01 control-label">진행상태</label>
							<div class="sys_col_01">
								<select class="form-control" id="req_sts" v-model="info.req_sts">
								<c:forEach var="item" items="${aprvCdList}">
									<option value="${item.code_id}">${item.code_nm}</option>
								</c:forEach>
								</select>
							</div>
						</div>
						<div class="form-group">
							<label for="req_resn" class="sys_label_01 control-label">신청사유</label>
							
							<div class="sys_col_05">
								<textarea class="form-control" rows="5" id="req_resn" placeholder="내용을 입력하세요." v-model="info.req_resn" readonly="readonly"></textarea>
							</div>
						</div>
						<div class="form-group">
							<label for="use_purp" class="sys_label_01 control-label">사용목적</label>
							
							<div class="sys_col_05">
								<textarea class="form-control" rows="5" id="use_purp" placeholder="내용을 입력하세요." v-model="info.use_purp" readonly="readonly"></textarea>
							</div>
						</div>
						<div class="form-group">
							<label for="cmnt" class="sys_label_01 control-label">시스템 담당자<br>코멘트</label>
							
							<div class="sys_col_05">
								<textarea class="form-control" rows="5" id="cmnt" placeholder="내용을 입력하세요." v-model="info.cmnt"></textarea>
							</div>
						</div>
						<div class="form-group" v-if="info.anal_tool_gbn =='1' && info.req_sts =='2'">
							<label for="cmnt" class="sys_label_01 control-label">태블로 정보</label>
							<div class="col-sm-7">
								<input type="text" class="form-control" readonly id="tool_url" v-model="info.tool_url">
							</div>
							<div class="col-sm-3">
								<button type="button" class="btn btn-black btn-icon btn-small" @click="openToolInfoList">
									조회
									<i class="entypo-search"></i>
								</button>
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


<!-- 관리도구 팝업 -->
<div class="modal fade" id="pop_tool">
<template>
	<div class="modal-dialog" style="width: 50%;">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="btn_popClose">&times;</button>
				<h4 class="modal-title">시스템 목록</h4>
			</div>
			<div class="modal-body">
				<div style="height: 550px;overflow: auto;" class="dataTables_wrapper">
					<div class="dt-buttons" style="padding-top: 15px;">
					</div>
					<table class="table table-bordered datatable dataTable">
						<thead style="position: sticky;top: 0px;">
							<tr>
								<th class="center" style="width: 80%;">태블로 주소</th>
								<th class="center" style="width: 10%;">사용여부</th>
								<th class="center" style="width: 10%;">선택</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in dataList">
								<td class="center">{{item.tool_url}}</td>								
								<td class="center">{{item.use_yn}}</td>
								<td class="center">
									<button type="button" class="btn btn-blue btn-icon icon-left btn-small" style="margin-left: 5px;cursor: pointer;" 
									@click="add_data(item.use_yn,item.tool_url)" v-if="vueapp.info.tool_url != item.tool_url">
										선택
										<i class="entypo-eye"></i>
									</button>
									<span v-else>선택됨</span>
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
<!--// 관리도구 팝업 -->

</body>
<script>
var vueapp = new Vue({
	el : "#vueapp",
	data : {
		info : {
			idx : "${idx}",
			save_mode : "insert",
			toolInfoList : [],
		},
		
	},
	mounted : function(){
		if(!cf_isEmpty(this.info.idx)){
			this.getInfo();
		}
	},
	methods : {
		getInfo : function(){
			cf_ajax("/system/req_mng/analTool/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
			this.info.save_mode = "update";
		},
		save : function(){
			if(!confirm("저장하시겠습니까?")) return;
			cf_ajax("/system/req_mng/analTool/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.idx = data.idx;
			this.getInfo();
		},
		delInfo : function(){
			if(!confirm("삭제하시겠습니까?")) return;
			cf_ajax("/system/req_mng/analTool/delete", this.info, this.delInfoCB);
		},
		delInfoCB : function(data){
			this.gotoList();
		},
		gotoList : function(){
			cf_movePage('/system/req_mng/analTool/list?fromDtl=Y');
		},
		openToolInfoList : function(){
			pop_tool.req_tool_idx = this.info.idx;
			pop_tool.init();
			$('#pop_tool').modal('show');
		},
	}
});


var pop_tool = new Vue({
	el : "#pop_tool",
	data : {
		dataList : [],
		req_tool_idx : "",
	},
	methods : {
		init : function(){
			if(this.dataList.length == 0){
				this.getList();
			}
			
		},
		getList : function(){
			var params = {
			}
			cf_ajax("/system/req_mng/analTool/getToolInfoList", params, this.getListCB);
		},
		getListCB : function(data){
			this.dataList = data;		
		},
		add_data : function(use_yn,tool_url){
			var item = this.dataList.getElementFirst("tool_url", tool_url);
			
			if(use_yn == 'Y'){
				if(!confirm("이미 사용되고 있는 라이센스입니다.덮어씌우시겠습니까?")) return;
				item.use_yn = "Y";
				item.req_tool_idx = vueapp.info.idx;
			}else {
				if(!confirm("라이센스 할당하시겠습니까?")) return;
				item.use_yn = "Y";
				item.req_tool_idx = vueapp.info.idx;
			}
			
			for(var i=0; i<this.dataList.length; i++){
				if(this.dataList[i].req_tool_idx == vueapp.info.idx){
					if(this.dataList[i].tool_url != tool_url){
						this.dataList[i].use_yn = "N";
						this.dataList[i].req_tool_idx = '';
					}
				}
			}
			vueapp.info.tool_url = tool_url;
			vueapp.info.toolInfoList = this.dataList;
			$('#pop_tool').modal('hide');
		},
	},
});

</script>