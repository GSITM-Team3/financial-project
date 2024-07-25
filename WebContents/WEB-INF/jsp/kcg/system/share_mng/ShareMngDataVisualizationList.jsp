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
			<li class="active"><strong>데이터 시각화</strong></li>
		</ol>
	
		<h2>데이터 시각화 목록</h2>
		<br/>
		
		<div class="dataTables_wrapper" id="vueapp">
		<template>
			<div class="dt-buttons" style="padding-top: 15px;">
				<button type="button" class="btn btn-orange btn-icon icon-left btn-small" @click="gotoDtl()">
					추가<i class="entypo-plus"></i>
				</button>
			</div>
			<div class="dataTables_filter">
				<select v-model="search_nm">
					<option value="sbjt">제목</option>
					<option value="reg_user_name">작성자</option>
				</select>
				<input type="search" placeholder="" style="width: 120px;" v-model="search_val" @keyup.enter="getList(true)">
				<button type="button" class="btn btn-blue btn-icon icon-left" style="margin-left: 5px;" @click="getList(true)">
					검색
					<i class="entypo-search"></i>
				</button>
			</div>
			
			<table class="table table-bordered datatable dataTable" id="grid_app">
				<thead>
					<tr class="replace-inputs">
						<th style="width: 10%;" class="center nosort">No.</th>
						<th style="width: 50%;" class="center sorting" @click="sortList(event.target)" sort_target="sbjt">제목</th>
						<th style="width: 15%;" class="center sorting" @click="sortList(event.target)" sort_target="reg_user_name">작성자</th>
						<th style="width: 15%;" class="center sorting" @click="sortList(event.target)" sort_target="reg_dt">작성일</th>
						<th style="width: 10%;" class="center sorting" @click="sortList(event.target)" sort_target="read_cnt">조회</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in dataList" @click="gotoDtl(item.idx)" style="cursor: pointer;">
						<td class="center">{{item.rownum}}</td>
						<td class="center">{{item.sbjt}}</td>
						<td class="center">{{item.reg_user_name}}</td>
						<td class="center">{{item.reg_dt_char}}</td>
						<td class="center">{{item.read_cnt}}</td>
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
		search_nm : "sbjt",
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
				cv_pagingConfig.orders = [{target : "reg_dt", isAsc : false}];
			}
			
			var params = {
					search_nm : this.search_nm,
					search_val : this.search_val,
				}
			
			cv_sessionStorage
				.setItem('pagingConfig', cv_pagingConfig)
				.setItem('params', params);

			cf_ajax("/system/share_mng/dataVisualization/getList", params, this.getListCB);
		},
		getListCB : function(data){
			this.dataList = data.list;
			for(var i=0; i<this.dataList.length; i++){
				this.dataList[i].read_cnt = this.dataList[i].read_cnt.numformat();
			}
			
			cv_pagingConfig.renderPagenation("system");
		},
		gotoDtl : function(idx){
			var params = {
					idx : cf_defaultIfEmpty(idx, ""),
				}
			cf_movePage("/system/share_mng/dataVisualization/dtl", params);
		},
		sortList : function(obj){
			cf_setSortConf(obj, "reg_dt");
			this.getList();
		},
	},
})
</script>
</html>