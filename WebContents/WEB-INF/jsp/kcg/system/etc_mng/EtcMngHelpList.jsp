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
			<li class="active"><strong>도움말관리</strong></li>
		</ol>
	
		<h2>도움말관리 목록</h2>
		<br/>
		
		<div class="dataTables_wrapper" id="vueapp">
		<template>
			<div class="dt-buttons" style="padding-top: 15px;">
				카테고리
				<input type="text" id="cat_nm" v-model="cat_nm">
				<button type="button" class="btn btn-blue btn-icon icon-left btn-small" @click="addCat()">
					추가<i class="entypo-plus"></i>
				</button>
			</div>
			<div class="dataTables_filter">
				<button type="button" class="btn btn-orange btn-icon icon-left btn-small" @click="gotoDtl()">
					등록<i class="entypo-plus"></i>
				</button>
				<select id="search_cat" v-model="search_cat" @change="getList(true)">
					<option value="" >카테고리</option>
					<option v-for="item in categoryList" :value="item.idx">{{item.cat_nm}}</option>
				</select>
			</div>
			
			<table class="table table-bordered datatable dataTable" id="grid_app">
				<thead>
					<tr class="replace-inputs">
						<th style="width: 5%;" class="center">번호</th>
						<th style="width: 45%;" class="center sorting" @click="sortList(event.target)" sort_target="sbjt">제목</th>
						<th style="width: 35%;" class="center sorting" @click="sortList(event.target)" sort_target="cat_nm">카테고리</th>
						<th style="width: 15%;" class="center">관리</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in dataList" style="cursor: pointer;">
						<td class="center">{{item.rownum}}</td>
						<td class="center">{{item.sbjt}}</td>
						<td class="center">{{item.cat_nm}}</td>
						<td class="center">
							<button type="button" class="btn btn-gold btn-icon icon-left btn-small" @click="gotoDtl(item.idx)">
								수정<i class="entypo-plus"></i>
							</button>
							<button type="button" class="btn btn-red btn-icon icon-left btn-small" @click="delInfo(item.idx)">
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
	<div class="modal-dialog" style="width: 60%;">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="btn_popClose">&times;</button>
				<h4 class="modal-title" id="modify_nm">등록</h4>
			</div>
			<div class="modal-body">
				<form class="form-horizontal form-groups-bordered">
					<div class="form-group">
						<label for="catList" class="col-sm-2 control-label">카테고리</label>
						<div class="col-sm-10">
							<select id="cat" v-model="info.cat" class="form-control">
								<option value="" >카테고리</option>
								<option v-for="item in categoryList" :value="item.idx">{{item.cat_nm}}</option>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label for="sbjt" class="col-sm-2 control-label">Q</label>
						<div class="col-sm-10">
							<input type="text" id="sbjt" v-model="info.sbjt" class="form-control">
						</div>
					</div>
					<div class="form-group">
						<label for="ctnt" class="col-sm-2 control-label">A</label>
						<div class="col-sm-10">
							<textarea class="form-control" rows="5" id="ctnt" placeholder="내용을 입력하세요."></textarea>
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
});

var vueapp = new Vue({
	el : "#vueapp",
	data : {
		dataList : [],
		search_cat : "",
		categoryList : [],
		cat_nm : "",
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
				search_cat : this.search_cat
			}

			cf_ajax("/system/etc_mng/help/getList", params, this.getListCB);
		},
		getListCB : function(data){
			this.dataList = data.list;
			cv_pagingConfig.renderPagenation("system");
			this.getCatList();
		},
		getCatList : function(){
			cf_ajax("/system/etc_mng/help/getCatList", {cat_nm : ""}, this.getCatListCB);
		},
		getCatListCB : function(data){
			this.categoryList = data;
		},
		gotoDtl : function(idx){
			pop_info.init(idx);
			
			$('#pop_info').modal('show');
		},
		sortList : function(obj){
			cf_setSortConf(obj, "reg_dt");
			this.getList();
		},
		delInfo : function(idx){
			if(!confirm("삭제하시겠습니까?")) return;
			var params = {
				idx : idx,
			};
			cf_ajax("/system/etc_mng/help/delete", params, this.delInfoCB);
		},
		delInfoCB : function(data){
			this.getList();
		},
		addCat : function(){
			if(cf_isEmpty(this.cat_nm)){
				alert("추가할 카테고리명을 입력하세요.");
				return;
			}
			
			if(!confirm("추가하시겠습니까?")) return;
			
			var params = {
				cat_nm : this.cat_nm,
			};
			cf_ajax("/system/etc_mng/help/chkCatDpl", params, this.chkCatDplCB);
			
		},
		addCatCB : function(data){
			this.search_cat = "";
			this.cat_nm = "";
			this.getList(true);
		},
		chkCatDplCB : function(data){
			var cnt = data.cnt;
			
			if(cnt > 0){
				alert("이미 등록되어있는 카테고리입니다.");
				return;
			}
			var params = {
				cat_nm : this.cat_nm,
			};
			cf_ajax("/system/etc_mng/help/saveCat", params, this.addCatCB);
		}
	},
});


var pop_info = new Vue({
	el : "#pop_info",
	data : {
		categoryList : [],
		info : {
		},
	},
	methods : {
		init : function(idx){
			this.initInfo();
			this.info.idx = idx;
			this.categoryList = [];
			if(!cf_isEmpty(this.info.idx)){
				this.getInfo();
			}
			this.getCatList();
		},
		initInfo : function(){
			this.info = {
				idx : "",
				sbjt : "",
				cat : "",
				ctnt : "",
				save_mode : "insert",
			};
			$("#ctnt").summernote("code", this.info.ctnt);
		},
		getInfo : function(){
			var params = {
				idx : this.info.idx,
			}
			cf_ajax("/system/etc_mng/help/getInfo", params, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
			this.info.save_mode = "update";
			$("#ctnt").summernote("code", this.info.ctnt);
			$("#modify_nm").text("수정");
		},
		getCatList : function(){
			this.categoryList = vueapp.categoryList ;
		},
		getCatListCB : function(data){
		},
		save : function(){
			this.info.ctnt = $("#ctnt").summernote("code");
			
			if(cf_isEmpty(this.info.cat)){
				alert("카테고리를 선택하여 주십시오");
				return;
			}
			if(cf_isEmpty(this.info.sbjt)){
				alert("질문을 입력하여 주십시오.");
				return;
			}
			if(cf_isEmpty(this.info.ctnt)){
				alert("내용을 입력하여 주십시오.");
				return;
			}
			
			if(!confirm("저장하시겠습니까?")) return;
			cf_ajax("/system/etc_mng/help/save", this.info, this.saveCB);
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