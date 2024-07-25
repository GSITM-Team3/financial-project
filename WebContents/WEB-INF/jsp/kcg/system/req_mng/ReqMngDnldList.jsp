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
			<li class="active"><strong>다운로드 신청관리</strong></li>
		</ol>
	
		<h2>다운로드 신청관리 목록</h2>
		<br />
		
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
					<option value="reg_user_name">신청자명</option>
					<option value="sys_nm">시스템명</option>
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
						<th style="width: 5%;" class="center hidden-xs nosort"><input type="checkbox" id="allCheck" @click="all_check(event.target)"></th>
						<th style="width: 5%;" class="center hidden-xs nosort">번호</th>
						<th style="width: 10%;" class="center sorting" @click="sortList(event.target)" sort_target="reg_user_name">신청자명</th>
						<th style="width: 10%;" class="center sorting" @click="sortList(event.target)" sort_target="sys_nm">시스템명</th>
						<th style="width: 10%;" class="center sorting" @click="sortList(event.target)" sort_target="table_eng_nm">테이블명</th>
						<th style="width: 10%;" class="center nosort">전체컬럼수</th>
						<th style="width: 10%;" class="center nosort">신청컬럼수</th>
						<th style="width: 10%;" class="center nosort">적재건수</th>
						<th style="width: 10%;" class="center nosort">적재기준일</th>
						<th style="width: 15%;" class="center sorting" @click="sortList(event.target)" sort_target="reg_dt">신청일</th>
						<th style="width: 15%;" class="center sorting" @click="sortList(event.target)" sort_target="req_sts">현재상태</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in dataList">
						<td class="center">
							<input type="checkbox" :data-idx="item.idx" name="is_check" @click="onCheck">
						</td>
						<td class="center" @click="gotoDtl(item.idx)" style="cursor: pointer;">{{item.rownum}}</td>
						<td class="center" @click="gotoDtl(item.idx)" style="cursor: pointer;">{{item.reg_user_name}}</td>
						<td class="center" @click="gotoDtl(item.idx)" style="cursor: pointer;">{{item.sys_nm}}</td>
						<td class="center" @click="gotoDtl(item.idx)" style="cursor: pointer;">{{item.table_eng_nm}}</td>
						<td class="center" @click="gotoDtl(item.idx)" style="cursor: pointer;">{{item.tot_col_cnt}}</td>
						<td class="center">
							{{item.req_col_cnt}}
							<button type="button" class="btn btn-blue btn-icon icon-left btn-small" style="margin-left: 5px;" @click="openPopDataInfo(item.idx)" style="cursor: pointer;">
								보기
								<i class="entypo-eye"></i>
							</button>
						</td>
						<td class="center" @click="gotoDtl(item.idx)" style="cursor: pointer;">{{item.accumulated_records}}</td>
						<td class="center" @click="gotoDtl(item.idx)" style="cursor: pointer;">{{item.planned_dt}}</td>
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

<!-- 테이블정보 팝업 -->
<div class="modal fade" id="pop_dataInfo">
<template>
	<div class="modal-dialog" style="width: 85%;">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="btn_popClose" @click="closet">&times;</button>
				<h4 class="modal-title">테이블정보</h4>
			</div>
			<div class="modal-body">
				<div style="height: 550px;overflow: auto;" class="dataTables_wrapper">
					<table class="table table-bordered datatable dataTable">
						<thead style="position: sticky;top: 0px;">
							<tr>
								<th class="center" style="width: 5%;">번호</th>
								<th class="center" style="width: 20%;">컬럼영문명</th>
								<th class="center" style="width: 20%;">컬럼한글명</th>
								<th class="center" style="width: 10%;">비식별여부</th>
								<th class="center" style="width: 10%;">데이터타입</th>
								<th class="center" style="width: 10%;">데이터길이</th>
								<th class="center" style="width: 15%;">HIVE적재컬럼명</th>
								<th class="center" style="width: 8%;">HIVE데이터타입</th>
								<th class="center" style="width: 7%;">Null여부</th>
								<th class="center" style="width: 7%;">PK여부</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in dataList">
								<td class="center">{{item.rownum}}</td>
								<td class="center">{{item.table_atrb_eng_nm}}</td>
								<td class="center">{{item.table_korean_atrb_nm}}</td>
								<td class="center">{{item.dstng_trget_at}}</td>
								<td class="center">{{item.table_atrb_ty_nm}}</td>
								<td class="center">{{item.table_atrb_lt_value}}</td>
								<td class="center">{{item.hive_col_nm}}</td>
								<td class="center">{{item.hive_atrb_ty_nm}}</td>
								<td class="center">{{item.table_atrb_null_posbl_at}}</td>
								<td class="center">{{item.table_atrb_pk_at}}</td>
							</tr>
						</tbody>
					</table>	
					<div class="dataTables_paginate paging_simple_numbers" id="div_paginate_pup02" style="text-align: center;">
					
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
<!--// 테이블정보 팝업 -->

<script>
var vueapp = new Vue({
	el : "#vueapp",
	data : {
		dataList : [],
		search_nm : "reg_user_name",
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

			cf_ajax("/system/req_mng/dnld/getList", params, this.getListCB);
		},
		getListCB : function(data){
			this.dataList = data.list;
			for(var i=0; i<this.dataList.length; i++){
				this.dataList[i].tot_col_cnt = this.dataList[i].tot_col_cnt.numformat();
				this.dataList[i].req_col_cnt = this.dataList[i].req_col_cnt.numformat();
				this.dataList[i].accumulated_records = this.dataList[i].accumulated_records.numformat();
			}
			cv_pagingConfig.renderPagenation("system");
		},
		gotoDtl : function(idx){
			var params = {
					idx : cf_defaultIfEmpty(idx, ""),
				}
			cf_movePage("/system/req_mng/dnld/dtl", params);
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
			
			cf_ajax("/system/req_mng/dnld/updtStatus", params, this.changeStsCB);
		},
		changeStsCB : function(data){
			if(data.status == "OK"){
				this.getList();
			}
			$("[name=is_check]").prop('checked',false);
			$("#allCheck").prop('checked',false);
		},
		all_check : function(obj){
			$('[name=is_check]').prop('checked',obj.checked);
		},
		onCheck : function(){
			$("#allCheck").prop('checked',
					$("[name=is_check]:checked").length === $("[name=is_check]").length
			);
		},
		openPopDataInfo : function(idx){
			pop_dataInfo.init(idx);
			$('#pop_dataInfo').modal('show');
		},
	},
});


var pop_dataInfo = new Vue({
	el : "#pop_dataInfo",
	data : {
		dataList : [],
		download_req_idx : "",
	},
	methods : {
		init : function(idx){
			this.download_req_idx = idx;
			this.getReqDataInfo(true);
		},
		getReqDataInfo : function(isInit){
			if(isInit === true){
				cv_pagingConfig.pageNo = 1;
				cv_pagingConfig.orders = [{target : "download_req_idx", isAsc : false}];
			}
			cv_pagingConfig.limit = 10;
			cv_pagingConfig.func = this.getReqDataInfo;
			
			var params = {
				download_req_idx : this.download_req_idx,
			};
			cf_ajax("/system/req_mng/dnld/getReqDataInfo", params, this.getReqDataInfoCB);
			
		},
		getReqDataInfoCB : function(data){
			this.dataList = data.list;	
			cv_pagingConfig.renderPagenation('system_pup02');
		},
		closet : function(){
			cv_pagingConfig.setInfo(cv_sessionStorage.getItem('pagingConfig'));
		}
	},
});
</script>
</html>