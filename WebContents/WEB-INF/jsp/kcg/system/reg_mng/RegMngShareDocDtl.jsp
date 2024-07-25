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
			<li class="active"><strong>공유문서 등록관리</strong></li>
		</ol>
	
		<h2>공유문서 등록관리 > 상세보기</h2>
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
								<input type="text" class="form-control" id="regist_user_name" v-model="info.regist_user_name" readonly="readonly">
							</div>
							<label for="reg_dt_char" class="sys_label_01 control-label">신청일</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="regist_form_dt_char" v-model="info.regist_form_dt_char" readonly="readonly">
							</div>
						</div>
			
						<div class="form-group">
							<label for="doctitle" class="sys_label_01 control-label">문서명</label>
							<div class="sys_col_03">
								<input type="text" class="form-control" id="doctitle" v-model="info.doctitle" readonly="readonly">
							</div>
						</div>
			
						<div class="form-group">
						<select id="brmncd" v-model="info.brmncd" :disabled="false">
																	<option value="">- 선택 -</option>
																	<c:forEach var="item" items="${categoryList }">
																		<option value="${item.code_id }">${item.code_nm
																			}</option>
																	</c:forEach>
																</select>
							<label for="brmncdnm" class="sys_label_01 control-label">등록부서</label>
							<div class="sys_col_03">
								<input type="text" class="form-control" id="brmncdnm" v-model="info.brmncdnm">
							</div>
						</div>
			
						<div class="form-group">
							<label for="searchkeyword" class="sys_label_01 control-label">키워드</label>
							<div class="sys_col_03">
								<input type="text" class="form-control" id="searchkeyword" v-model="info.searchkeyword">
							</div>
						</div>
			
						<div class="form-group">
							<label for="doccontent" class="sys_label_01 control-label">데이터 설명</label>
							<div class="sys_col_03">
								<textarea type="text" rows="5" class="form-control" id="doccontent" v-model="info.doccontent"></textarea>
							</div>
						</div>
			
						<div class="form-group">
							<label for="datastdt_char" class="sys_label_01 control-label">정보등록일</label>
							<div class="sys_col_03">
								<input type="text" class="form-control" id="datastdt_char" v-model="info.datastdt_char" readonly="readonly">
							</div>
						</div>
						
						<div class="form-group">
							<label for="datastdt_char" class="sys_label_01 control-label">첨부파일명</label>
							<div class="sys_col_03">
								<a href="#none" @click="cf_fileDn(info.dataurl)">
									{{info.atch_file_nm}}
								</a>
							</div>
						</div>
			
						<div class="form-group">
							<label for="nextregistprarnde_char" class="sys_label_01 control-label">파일등록일</label>
							<div class="sys_col_03">
								<input type="text" class="form-control" id="nextregistprarnde_char" v-model="info.nextregistprarnde_char" readonly="readonly">
							</div>
						</div>
			
						<div class="form-group">
							<label for="datatynm_nm" class="sys_label_01 control-label">파일 유형</label>
							<div class="sys_col_03">
								<input type="text" class="form-control" id="datatynm_nm" v-model="info.datatynm_nm" readonly="readonly">
							</div>
						</div>
			
						<div class="form-group">
							<label for="atchfileextsn" class="sys_label_01 control-label">확장자</label>
							<div class="sys_col_03">
								<input type="text" class="form-control" id="atchfileextsn" v-model="info.atchfileextsn" readonly="readonly">
							</div>
						</div>
						
						<div class="form-group">
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
							<div class="col-sm-offset-2 col-sm-5">
								<button type="button" class="btn btn-green btn-icon btn-small" @click="save">
									저장
									<i class="entypo-check"></i>
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
			dataurl : "${dataurl}",
		},
	},
	mounted : function(){
		this.getInfo();
	},
	methods : {
		getInfo : function(){
			cf_ajax("/system/reg_mng/shareDoc/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
		},
		save : function(){
			if(!confirm("저장하시겠습니까?")) return;
			cf_ajax("/system/reg_mng/shareDoc/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.idx = data.idx;
			this.getInfo();
		},
		gotoList : function(){
			cf_movePage('/system/reg_mng/shareDoc/list?fromDtl=Y');
		},
	}
});

</script>