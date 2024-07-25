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

<div class="page-container"><!-- add class "sidebar-collapsed" to close sidebar by default, "chat-visible" to make chat appear always -->

	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp" flush="false"/>

	<div class="main-content">

		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp" flush="false"/>
		
		<ol class="breadcrumb bc-3">
			<li><a href="#none" onclick="cf_movePage('/system')"><i class="fa fa-home"></i>Home</a></li>
			<li class="active"><strong>메뉴관리</strong></li>
		</ol>
	
		<h2>메뉴관리 목록</h2>
		<br />
		
		<div class="dataTables_wrapper" id="vueapp">
		<template>
			<div class="dt-buttons" style="padding-top: 15px;">
				<button type="button" class="btn btn-orange btn-icon icon-left btn-small" @click="gotoDtl()">
					추가<i class="entypo-plus"></i>
				</button>
<!-- 				<button type="button" class="btn btn-primary btn-icon icon-left btn-small" @click="excelDn"> -->
<!-- 					EXCEL<i class="entypo-download"></i> -->
<!-- 				</button> -->
			</div>
			<div class="dataTables_filter">
				<select id="search_nm" v-model="admin_yn" @change="getList(true)">
					<option value="">페이지구분</option>
					<option value="N">일반사용자페이지</option>
					<option value="Y">어드민페이지</option>
				</select>	
				<select id="search_nm" v-model="search_nm">
					<option value="menu_url">URL</option>
					<option value="menu_nm">메뉴이름</option>
				</select>	
				<input type="search" placeholder="" style="width: 120px;" id="search_val" v-model="search_val" @keyup.enter="getList(true)">
				<button type="button" class="btn btn-blue btn-icon icon-left" style="margin-left: 5px;" @click="getList(true)">
					검색
					<i class="entypo-search"></i>
				</button>
			</div>
			
			<table class="table table-bordered datatable dataTable">
				<thead>
					<tr class="replace-inputs">
						<th style="width: 5%;" class="center nosort">번호</th>
						<th style="width: 20%;" class="center sorting" @click="sortList(event.target)" sort_target="menu_url">URL</th>
						<th style="width: 20%;" class="center sorting" @click="sortList(event.target)" sort_target="menu_nm">메뉴이름</th>
						<th style="width: 45%;" class="center sorting" @click="sortList(event.target)" sort_target="menu_note">메뉴설명</th>
						<th style="width: 10%;" class="center sorting" @click="sortList(event.target)" sort_target="menu_nm">어드민여부</th>
					</tr>
				</thead>
				<tbody id="tbody_list">
					<tr v-for="item in dataList"  @click="gotoDtl(item.menu_url)" style="cursor: pointer;">
						<td class="center">{{item.rownum}}</td>
						<td class="center">{{item.menu_url}}</td>
						<td class="center">{{item.menu_nm}}</td>
						<td class="center">{{item.menu_note}}</td>
						<td class="center">{{item.admin_yn}}</td>
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
</body>
<script>
var vueapp = new Vue({
	el : "#vueapp",
	data : {
		dataList : [],
		search_nm : "menu_url",
		search_val : "",
		admin_yn : "",
	},
	mounted : function(){
		var fromDtl = cf_getUrlParam("fromDtl");
		var pagingConfig = cv_sessionStorage.getItem("pagingConfig");		
		if("Y" === fromDtl && !cf_isEmpty(pagingConfig)){
			cv_pagingConfig.pageNo = pagingConfig.pageNo;
			cv_pagingConfig.orders = pagingConfig.orders;
			
	 		var params = cv_sessionStorage.getItem("params");
	 		this.admin_yn = params.admin_yn;
	 		this.search_nm = params.search_nm;
	 		this.search_val = params.search_val;

			this.getList();
		} else {
			cv_sessionStorage
				.removeItem("pagingConfig")
				.removeItem("params");
			this.getList(true);
		}
	},
	methods : {
		getList : function(isInit){

			cv_pagingConfig.func = this.getList;
			if(isInit === true){
				cv_pagingConfig.pageNo = 1;
				cv_pagingConfig.orders = [{target : "reg_dt", isAsc : false}];
			}
			
			var params = {
					admin_yn : this.admin_yn,
					search_nm : this.search_nm,
					search_val : this.search_val,
				}
			
			cv_sessionStorage
				.setItem('pagingConfig', cv_pagingConfig)
				.setItem('params', params);

			cf_ajax("/system/menu_mng/getList", params, this.getListCB);
		},
		getListCB : function(data){			
			this.dataList = data.list;
			cv_pagingConfig.renderPagenation("system");
		},
		gotoDtl : function(menu_url){
			var params = {
					menu_url : cf_defaultIfEmpty(menu_url, ""),
				}
			cf_movePage("/system/menu_mng/dtl", params);
		},
		sortList : function(obj){
			cf_setSortConf(obj, "reg_dt");
			this.getList();
		},
		excelDn : function(){
			alert("구현준비중입니다.");
		},
	},
})
</script>
</html>