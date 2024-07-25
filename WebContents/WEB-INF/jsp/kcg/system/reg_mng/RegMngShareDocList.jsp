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
			<li class="active"><strong>공유문서 등록관리 목록</strong></li>
		</ol>
	
		<h2>공유문서 등록관리 목록</h2>
		<br/>
		
		<div class="dataTables_wrapper" id="vueapp">
		<template>
			<div class="dataTables_filter">
				<select v-model="search_nm">
					<option value="doctitle">문서명</option>
					<option value="doccontent">데이터 설명</option>
				</select>
				<input type="search" placeholder="" style="width: 120px;" v-model="search_val" @keyup.enter="getList(true)">
				<button type="button" class="btn btn-blue btn-icon icon-left" style="margin-left: 5px;" @click="getList(true)">
					검색
					<i class="entypo-search"></i>
				</button>
			</div>
			
			<table class="table table-bordered datatable dataTable">
				<thead>
					<tr class="replace-inputs">
						<th style="width: 5%;" class="center hidden-xs nosort">번호</th>
						<th style="width: 20%;" class="center sorting" @click="sortList(event.target)" sort_target="doctitle">문서명</th>
						<th style="width: 50%;" class="center sorting" @click="sortList(event.target)" sort_target="org_file_nm">파일명</th>
						<th style="width: 10%;" class="center sorting" @click="sortList(event.target)" sort_target="req_sts_nm">진행상태</th>
						<th style="width: 15%;" class="center sorting" @click="sortList(event.target)" sort_target="regist_form_dt">첨부파일 등록일</th>
					</tr>
				</thead>
				<tbody id="tbody_list">
					<tr v-for="item in dataList">
						<td class="center" @click="gotoDtl(item.dataurl)" style="cursor: pointer;">{{item.rownum}}</td>
						<td class="center" @click="gotoDtl(item.dataurl)" style="cursor: pointer;">{{item.doctitle}}</td>
						<td class="center" @click="gotoDtl(item.dataurl)" style="cursor: pointer;">{{item.org_file_nm}}</td>
						<td class="center" @click="gotoDtl(item.dataurl)" style="cursor: pointer;">{{item.req_sts_nm}}</td>
						<td class="center" @click="gotoDtl(item.dataurl)" style="cursor: pointer;">{{item.regist_form_dt_char}}</td>
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
		search_nm : "doctitle",
		search_val : "",
	},
	mounted : function(){
		var fromDtl = cf_getUrlParam("fromDtl");
		var pagingConfig = cv_sessionStorage.getItem("pagingConfig");		
		if("Y" === fromDtl && !cf_isEmpty(pagingConfig)){
			cv_pagingConfig.pageNo = pagingConfig.pageNo;
			cv_pagingConfig.orders = pagingConfig.orders;
			
	 		var params = cv_sessionStorage.getItem("params");
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
				cv_pagingConfig.orders = [{target : "regist_form_dt", isAsc : false}];
			}
			
			var params = {
					search_nm : this.search_nm,
					search_val : this.search_val,
				}
			
			cv_sessionStorage
				.setItem('pagingConfig', cv_pagingConfig)
				.setItem('params', params);

			cf_ajax("/system/reg_mng/shareDoc/getList", params, this.getListCB);
		},
		getListCB : function(data){
			this.dataList = data.list;
			cv_pagingConfig.renderPagenation("system");
		},
		gotoDtl : function(dataurl){
			var params = {
					dataurl : cf_defaultIfEmpty(dataurl, ""),
				}
			cf_movePage("/system/reg_mng/shareDoc/dtl", params);
		},
		sortList : function(obj){
			cf_setSortConf(obj, "regist_form_dt");
			this.getList();
		},
	},
})
</script>
</html>