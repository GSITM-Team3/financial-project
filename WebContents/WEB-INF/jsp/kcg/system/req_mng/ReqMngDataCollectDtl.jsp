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
			<li class="active"><strong>데이터 수집신청관리</strong></li>
		</ol>
	
		<h2>데이터 수집신청관리 > 상세보기</h2>
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
							<label for="reg_user_name" class="sys_label_01 control-label">신청자 부서</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="reg_user_name" v-model="info.reg_user_tdept_nm" readonly="readonly">
							</div>
							<label for="reg_dt_char" class="sys_label_01 control-label">신청자 이메일</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="reg_dt_char" v-model="info.reg_user_email" readonly="readonly">
							</div>
						</div>
			
						<div class="form-group">
							<label for="sbjt" class="sys_label_01 control-label">진행상태</label>
							<div class="sys_col_01">
								<select class="form-control" id="req_sts" v-model="info.req_sts">
								<c:forEach var="item" items="${aprvCdList}">
									<option value="${item.code_id}">${item.code_nm}</option>
								</c:forEach>
								</select>
							</div>
						</div>
			
						<div class="form-group">
							<label for="req_resn" class="sys_label_01 control-label">활용DB</label>
							
							<div class="sys_col_05">
								<ul class="form-control" style="background: #eee;padding:6px 12px;list-style: none;">
                                <li>중앙부처 및 공공기관 공개 DB (보유기관명) : <strong>{{info.gov_open_db_org}}</strong></li>
								<li>중앙부처 및 공공기관 공개 DB (DB명) : <strong>{{info.gov_open_db_nm}}</strong></li>
								</ul>
								<ul class="form-control" style="background: #eee;padding:6px 12px;list-style: none;">							
								<li>그 외 활용DB (보유기관명) : <strong>{{info.etc_act_db_org}}</strong></li>
								<li>그 외 활용DB (DB명) : <strong>{{info.etc_act_db_nm}}</strong></li>
								</ul>
							</div>
						</div>
			
						<div class="form-group">
							<label for="req_resn" class="sys_label_01 control-label">데이터 요청사유</label>
							
							<div class="sys_col_05">
								<textarea class="form-control" rows="5" id="req_resn" placeholder="내용을 입력하세요." v-model="info.req_resn" readonly="readonly"></textarea>
							</div>
						</div>
						<div class="form-group">
							<label for="req_dtl_ctnt" class="sys_label_01 control-label">요청데이터 상세항목</label>
							<div class="sys_col_05">
								<textarea class="form-control" rows="5" id="req_dtl_ctnt" placeholder="내용을 입력하세요." v-model="info.req_dtl_ctnt" readonly="readonly"></textarea>
							</div>
						</div>
						<div class="form-group">
							<label for="use_purp" class="sys_label_01 control-label">활용방안</label>
							
							<div class="sys_col_05">
								<textarea class="form-control" rows="5" id="use_purp" placeholder="내용을 입력하세요." v-model="info.use_purp" readonly="readonly"></textarea>
							</div>
						</div>
						<div class="form-group">
							<label for="etc_note" class="sys_label_01 control-label">기타</label>
							
							<div class="sys_col_05">
								<textarea class="form-control" rows="5" id="etc_note" placeholder="내용을 입력하세요." v-model="info.etc_note" readonly="readonly"></textarea>
							</div>
						</div>
						
						
						<div class="form-group" v-if="!!info.atch_file_1 || !!info.atch_file_2 || !!info.atch_file_3 || !!info.atch_file_4 || !!info.atch_file_5">
							<label class="sys_label_01 control-label">첨부파일</label>
							<div class="col-sm-8">
								<div class="form-group" v-if="!!info.atch_file_1">
									<div class="col-sm-11">
										<a href="#none" @click="cf_fileDn(info.atch_file_1)">
											{{info.atch_file_1_nm}}
										</a>
									</div>
								</div>
								<div class="form-group" v-if="!!info.atch_file_2">
									<div class="col-sm-11">
										<a href="#none" @click="cf_fileDn(info.atch_file_2)">
											{{info.atch_file_2_nm}}
										</a>
									</div>
								</div>
								<div class="form-group" v-if="!!info.atch_file_3">
									<div class="col-sm-11">
										<a href="#none" @click="cf_fileDn(info.atch_file_3)">
											{{info.atch_file_3_nm}}
										</a>
									</div>
								</div>
								<div class="form-group" v-if="!!info.atch_file_4">
									<div class="col-sm-11">
										<a href="#none" @click="cf_fileDn(info.atch_file_4)">
											{{info.atch_file_4_nm}}
										</a>
									</div>
								</div>
								<div class="form-group" v-if="!!info.atch_file_5">
									<div class="col-sm-11">
										<a href="#none" @click="cf_fileDn(info.atch_file_5)">
											{{info.atch_file_5_nm}}
										</a>
									</div>
								</div>
							</div>
						</div>
						
						
						
						
						<div class="form-group">
							<label for="cmnt" class="sys_label_01 control-label">시스템 담당자<br>코멘트</label>
							
							<div class="sys_col_05">
								<textarea class="form-control" rows="5" id="cmnt" placeholder="내용을 입력하세요." v-model="info.cmnt"></textarea>
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
var vueapp = new Vue({
	el : "#vueapp",
	data : {
		info : {
			idx : "${idx}",
			save_mode : "insert",
		},
	},
	mounted : function(){
		if(!cf_isEmpty(this.info.idx)){
			this.getInfo();
		}
	},
	methods : {
		getInfo : function(){
			cf_ajax("/system/req_mng/dataCollect/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
			this.info.save_mode = "update";
		},
		save : function(){
			if(!confirm("저장하시겠습니까?")) return;
			cf_ajax("/system/req_mng/dataCollect/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.idx = data.idx;
			this.getInfo();
		},
		delInfo : function(){
			if(!confirm("삭제하시겠습니까?")) return;
			cf_ajax("/system/req_mng/dataCollect/delete", this.info, this.delInfoCB);
		},
		delInfoCB : function(data){
			this.gotoList();
		},
		gotoList : function(){
			cf_movePage('/system/req_mng/dataCollect/list?fromDtl=Y');
		},
	}
});
</script>
</html>