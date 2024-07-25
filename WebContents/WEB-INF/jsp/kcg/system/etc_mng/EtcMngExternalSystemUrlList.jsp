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
			<li class="active"><strong>외부시스템 URL관리</strong></li>
		</ol>
	
		<h2>외부시스템 URL관리 목록</h2>
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
						<th style="width: 40%;" class="center sorting" @click="sortList(event.target)" sort_target="sys_nm">시스템명</th>
						<th style="width: 40%;" class="center sorting" @click="sortList(event.target)" sort_target="ext_url">url</th>
						<th style="width: 15%;" class="center">관리</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in dataList" >
						<td class="center">{{item.rownum}}</td>
						<td class="center">{{item.sys_nm}}</td>
						<td class="center">{{item.ext_url}}</td>
						<td class="center">
							<button type="button" class="btn btn-gold btn-icon icon-left btn-small" @click="gotoDtl(item.ext_url)" style="cursor: pointer;">
								수정<i class="entypo-plus"></i>
							</button>
							<button type="button" class="btn btn-red btn-icon icon-left btn-small" @click="delInfo(item.ext_url)" style="cursor: pointer;">
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
						<label for="sys_nm" class="col-sm-2 control-label">시스템</label>
						<div class="col-sm-10">
							<input type="text" id="sys_nm" v-model="info.sys_nm">
						</div>
					</div>
					<div class="form-group">
						<label for="ext_url" class="col-sm-2 control-label">url</label>
						<div class="col-sm-10">
							<input type="text" id="ext_url" v-model="info.ext_url">
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
			
			cf_ajax("/system/etc_mng/externalSystemUrl/getList", params, this.getListCB);
		},
		getListCB : function(data){
			this.dataList = data.list;
			cv_pagingConfig.renderPagenation("system");
		},
		gotoDtl : function(ext_url){
			pop_info.init(ext_url);
			$('#pop_info').modal('show');
		},
		sortList : function(obj){
			cf_setSortConf(obj, "reg_dt");
			this.getList();
		},
		delInfo : function(ext_url){
			if(!confirm("삭제하시겠습니까?")) return;
			var params = {
				ext_url : ext_url,
			};
			cf_ajax("/system/etc_mng/externalSystemUrl/delete", params, this.delInfoCB);
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
		init : function(ext_url){
			this.initInfo();
			this.info.ext_url = ext_url;
			if(!cf_isEmpty(this.info.ext_url)){
				this.getInfo();
			}
		},
		initInfo : function(){
			this.info = {
				ext_url : "",
				sys_nm : "",
				save_mode : "insert",
			};
			$("#modify_nm").text("등록");
			$("#sys_nm").attr("disabled", false);
		},
		getInfo : function(){
			var params = {
				ext_url : this.info.ext_url,
			}
			cf_ajax("/system/etc_mng/externalSystemUrl/getInfo", params, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
			this.info.save_mode = "update";
			$("#modify_nm").text("수정");
			$("#sys_nm").attr("disabled", true);
		},
		save : function(){
			if(cf_isEmpty(this.info.ext_url)){
				alert("URL를 입력하여 주십시오");
				return;
			}
			if(cf_isEmpty(this.info.sys_nm)){
				alert("시스템명을 입력하여 주십시오.");
				return;
			}
			
			if(!confirm("저장하시겠습니까?")) return;
			
			if( this.info.save_mode == "update"){
				cf_ajax("/system/etc_mng/externalSystemUrl/save", this.info, this.saveCB);
			}else {
				var params = {
						ext_url : this.info.ext_url,
				}
				cf_ajax("/system/etc_mng/externalSystemUrl/chkDpl", params, this.chkDplCB);
			}
			
		},
		chkDplCB : function(data){
			var cnt = data.cnt;
			
			if(cnt > 0){
				alert("이미 등록되어있는 URL입니다.");
				return;
			}
			cf_ajax("/system/etc_mng/externalSystemUrl/save", this.info, this.saveCB);
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