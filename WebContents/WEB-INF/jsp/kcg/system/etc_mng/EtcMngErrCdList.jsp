<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false"/>
	<!-- Imported styles on this page -->
	<link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">
	<link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">
	<link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">
	<title>관리자시스템</title>
</head>
<body class="page-body">

<div class="page-container">

	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp" flush="false"/>

	<div class="main-content">

		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp" flush="false"/>
		
		<ol class="breadcrumb bc-3">
			<li><a href="#none" onclick="cf_movePage('/system')"><i class="fa fa-home"></i>Home</a></li>
			<li class="active"><strong>에러코드관리</strong></li>
		</ol>
	
		<h2>에러코드관리 목록</h2>
		<br/>
		
		<div class="dataTables_wrapper" id="vueapp">
		<template>
			<div class="dt-buttons" style="padding-top: 15px;">
				<button type="button" class="btn btn-orange btn-icon icon-left btn-small" @click="gotoDtl()">
					추가<i class="entypo-plus"></i>
				</button>
			</div>
			<div class="dataTables_filter">
			</div>
			
			<table class="table table-bordered datatable dataTable" id="grid_app">
				<thead>
					<tr class="replace-inputs">
						<th style="width: 5%;" class="center">번호</th>
						<th style="width: 20%;" class="center sorting" @click="sortList(event.target)" sort_target="err_cd">코드</th>
						<th style="width: 30%;" class="center sorting" @click="sortList(event.target)" sort_target="err_kor_nm">국문</th>
						<th style="width: 30%;" class="center sorting" @click="sortList(event.target)" sort_target="err_eng_nm">영문</th>
						<th style="width: 05%;" class="center">관리</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in dataList">
						<td class="center">{{item.rownum}}</td>
						<td class="center">{{item.err_cd}}</td>
						<td class="center">{{item.err_kor_nm}}</td>
						<td class="center">{{item.err_eng_nm}}</td>
						<td class="center">
							<button type="button" class="btn btn-gold btn-icon icon-left btn-small" @click="gotoDtl(item.err_cd)"  style="cursor: pointer;">
								수정<i class="entypo-plus"></i>
							</button>
							<button type="button" class="btn btn-red btn-icon icon-left btn-small" @click="delInfo(item.err_cd)" style="cursor: pointer;">
								삭제<i class="entypo-minus"></i>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
			<div class="dataTables_paginate paging_simple_numbers" id="div_paginate">
			</div>
		</template>
		</div>
		
		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp" flush="false"/>
	</div>
</div>

<!-- 수정/등록 팝업 -->
<div class="modal fade" id="pop_info">
<template>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="btn_popClose">&times;</button>
				<h4 class="modal-title" id="modify_nm">등록</h4>
			</div>
			<div class="modal-body">
				<form class="form-horizontal form-groups-bordered">
					<div class="form-group">
						<label for="err_cd" class="col-sm-2 control-label">코드</label>
						<div class="col-sm-10">
							<input type="text" id="err_cd" v-model="info.err_cd">
						</div>
					</div>
					<div class="form-group">
						<label for="err_kor_nm" class="col-sm-2 control-label">국문</label>
						<div class="col-sm-10">
							<input type="text" id="err_kor_nm" v-model="info.err_kor_nm">
						</div>
					</div>
					<div class="form-group">
						<label for="err_eng_nm" class="col-sm-2 control-label">영문</label>
						<div class="col-sm-10">
							<input type="text" id="err_eng_nm" v-model="info.err_eng_nm">
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" @click="save()">저장</button>
       			<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</template>
</div>
<!--// 수정/등록 팝업 -->

</body>
<script>
var vueapp = new Vue({
	el : "#vueapp",
	data : {
		dataList : [],
	},
	mounted : function(){
		this.getList(true);
	},
	methods : {
		getList : function(isInit){

			cv_pagingConfig.func = this.getList;
			if(isInit === true){
				cv_pagingConfig.pageNo = 1;
				cv_pagingConfig.orders = [{target : "reg_dt", isAsc : false}];
			}
			
			var params = {
			}
			cf_ajax("/system/etc_mng/errCd/getList", params, this.getListCB);
		},
		getListCB : function(data){
			this.dataList = data.list;
			cv_pagingConfig.renderPagenation("system");
		},
		gotoDtl : function(err_cd){
			pop_info.init(err_cd);
			$('#pop_info').modal('show');
		},
		sortList : function(obj){
			cf_setSortConf(obj, "reg_dt");
			this.getList();
		},
		delInfo : function(err_cd){
			if(!confirm("삭제하시겠습니까?")) return;
			var params = {
				err_cd : err_cd,
			};
			cf_ajax("/system/etc_mng/errCd/delete", params, this.delInfoCB);
		},
		delInfoCB : function(data){
			this.getList();
		},
	},
});


var pop_info = new Vue({
	el : "#pop_info",
	data : {
		info : {
		},
	},
	methods : {
		init : function(err_cd){
			this.initInfo();
			this.info.err_cd = err_cd;
			if(!cf_isEmpty(this.info.err_cd)){
				this.getInfo();
			}
		},
		initInfo : function(){
			this.info = {
				err_cd : "",
				err_kor_nm : "",
				err_eng_nm : "",
				save_mode : "insert",
			};
		},
		getInfo : function(){
			var params = {
				err_cd : this.info.err_cd,
			}
			cf_ajax("/system/etc_mng/errCd/getInfo", params, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
			this.info.save_mode = "update";
			$("#modify_nm").text("수정");
			$("#err_cd").attr("disabled", true);
		},
		save : function(){
			if(cf_isEmpty(this.info.err_cd)){
				alert("코드를 입력하여 주십시오");
				return;
			}
			if(cf_isEmpty(this.info.err_kor_nm)){
				alert("국문명을 입력하여 주십시오.");
				return;
			}
			if(cf_isEmpty(this.info.err_eng_nm)){
				alert("영문명을 입력하여 주십시오.");
				return;
			}
			
			if(!confirm("저장하시겠습니까?")) return;
			
			if( this.info.save_mode == "update"){
				cf_ajax("/system/etc_mng/errCd/save", this.info, this.saveCB);
			}else {
				var params = {
					err_cd : this.info.err_cd,
				}
				cf_ajax("/system/etc_mng/errCd/chkDpl", params, this.chkDplCB);
			}
			
		},
		chkDplCB : function(data){
			var cnt = data.cnt;
			
			if(cnt > 0){
				alert("이미 등록되어있는 에러코드입니다.");
				return;
			}
			cf_ajax("/system/etc_mng/errCd/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.save_mode = "insert";
			vueapp.getList(true);
			$("#btn_popClose").click();
		},
	}
});

</script>
</html>