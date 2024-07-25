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
			<li class="active"><strong>데이터분석 신청관리</strong></li>
		</ol>
	
		<h2>데이터분석 신청관리 목록</h2>
		<br/>
		
		<div class="dataTables_wrapper" id="vueapp">
		<template>
			<div class="dt-buttons" style="padding-top: 15px;">
				<select style="vertical-align: middle;" v-model="req_sts">
				<c:forEach var="item" items="${aprvCdList}">
					<option value="${item.code_id}">${item.code_nm}</option>
				</c:forEach>
				</select>
				<button type="button" class="btn btn-primary btn-icon icon-left btn-small" @click="changeSts">
					변경<i class="entypo-check"></i>
				</button>
			</div>
			<div class="dataTables_filter">
				<select v-model="search_nm">
					<option value="sbjt">제목</option>
					<option value="reg_user_name">신청자</option>
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
						<th style="width: 5%;" class="center nosort"><input type="checkbox" id="allCheck" @click="allCheck"></th>
						<th style="width: 5%;" class="center hidden-xs nosort">번호</th>
						<th style="width: 21%;" class="center sorting" @click="sortList(event.target)" sort_target="sbjt">제목</th>
						<th style="width: 21%;" class="center sorting" @click="sortList(event.target)" sort_target="reg_user_name">신청자</th>
						<th style="width: 15%;" class="center sorting" @click="sortList(event.target)" sort_target="reg_dt">신청일</th>
						<th style="width: 10%;" class="center sorting" @click="sortList(event.target)" sort_target="req_sts">진행상태</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in dataList">
						<td class="center">
							<input type="checkbox" :data-idx="item.idx" name="is_check" @click="onCheck">
						</td>
						<td class="center" @click="gotoDtl(item.idx)" style="cursor: pointer;">{{item.rownum}}</td>
						<td class="center" @click="gotoDtl(item.idx)" style="cursor: pointer;">{{item.sbjt}}</td>
						<td class="center" @click="gotoDtl(item.idx)" style="cursor: pointer;">{{item.reg_user_name}}</td>
						<td class="center" @click="gotoDtl(item.idx)" style="cursor: pointer;">{{item.reg_dt_char}}</td>
						<td class="center" @click="gotoDtl(item.idx)" style="cursor: pointer;">{{item.req_sts_nm}}</td>
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
		req_sts : "1",
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

			cf_ajax("/system/req_mng/dataAnal/getList", params, this.getListCB);
		},
		getListCB : function(data){
			$("#allCheck").prop('checked',false);
			this.allCheck();
			
			this.dataList = data.list;
			cv_pagingConfig.renderPagenation("system");
		},
		gotoDtl : function(idx){
			var params = {
					idx : cf_defaultIfEmpty(idx, ""),
				}
			cf_movePage("/system/req_mng/dataAnal/dtl", params);
		},
		sortList : function(obj){
			cf_setSortConf(obj, "reg_dt");
			this.getList();
		},
		changeSts : function(){
			var chkedList = $("[name=is_check]:checked");
			
			if(chkedList.length == 0){
				alert("변경할 신청내역을 선택하여 주십시오.");
				return;
			}
			
			if(!confirm("선택된 신청내역을 변경하시겠습니까?")) return;
			
			var targetArr = [];
			var idx;
			chkedList.each(function(i) {
				idx = $(this).attr("data-idx");
				targetArr.push(vueapp.dataList.getElementFirst("idx", idx));
			});

			var params = {
					targetArr : targetArr,
					req_sts : this.req_sts,
				}
			
			cf_ajax("/system/req_mng/dataAnal/updtStatus", params, this.changeStsCB);
		},
		changeStsCB : function(data){
			if(data.status === "OK"){
				this.getList();
			}
			$("[name=is_check]").prop('checked',false);
			$("#allCheck").prop('checked',false);
		},
		allCheck : function(){
			$('[name=is_check]').prop('checked', $("#allCheck").is(":checked"));
		},
		onCheck : function(){
			$("#allCheck").prop('checked',
					$("[name=is_check]:checked").length === $("[name=is_check]").length
			);
		},
	},
})
</script>
</html>