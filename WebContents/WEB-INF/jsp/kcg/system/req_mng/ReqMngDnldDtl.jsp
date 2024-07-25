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
			<li class="active"><strong>다운로드신청관리</strong></li>
		</ol>
	
		<h2>다운로드신청관리 > 상세보기</h2>
		<br />
		
		<div class="row">
			<div id="vueapp" style="width: 910px; margin-left: 15px;">
			<template>
				<div class="panel panel-primary" data-collapsed="0">
					<div class="panel-body">
					<form class="form-horizontal form-groups-bordered">
						<div class="form-group">
							<label for="req_empl_nm" class="sys_label_01 control-label">신청자명</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="req_empl_nm" v-model="info.reg_user_name" readonly="readonly">
							</div>
							<label for="reg_dt" class="sys_label_01 control-label">신청일시</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="reg_dt" v-model="info.reg_dt_char" readonly="readonly">
							</div>
						</div>
			
						<div class="form-group">
							<label for="sys_nm" class="sys_label_01 control-label">시스템명</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="sys_nm" v-model="info.sys_nm" readonly="readonly">
							</div>
							<label for="db_ty_nm" class="sys_label_01 control-label">DBMS명</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="table_korean_nm" v-model="info.table_korean_nm" readonly="readonly">
							</div>
							
						</div>
			
						<div class="form-group">
							<label for="accumulated_records" class="sys_label_01 control-label">적재 건 수</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="accumulated_records" v-model="info.accumulated_records" readonly="readonly">
							</div>
							<label for="planned_dt" class="sys_label_01 control-label">적재 기준일</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="planned_dt" v-model="info.planned_dt" readonly="readonly">
							</div>
						</div>
			
						<div class="form-group">
							<label for="column_cnt" class="sys_label_01 control-label">신청 컬럼 수</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="column_cnt" v-model="info.req_col_cnt" readonly="readonly">
							</div>
							
							<div class="sys_col_02">
								<button type="button" class="btn btn-blue btn-icon icon-left btn-small" style="margin-left: 5px;" @click="openPopDataInfo()" style="cursor: pointer;">
									신청컬럼정보보기
								<i class="entypo-eye"></i>
								</button>
							</div>
						</div>
						
						<div class="form-group">
							<label for="table_eng_nm" class="sys_label_01 control-label">테이블 영문명</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="table_eng_nm" v-model="info.table_eng_nm" readonly="readonly">
							</div>
							<label for="table_korean_nm" class="sys_label_01 control-label">테이블 한글명</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="table_korean_nm" v-model="info.table_korean_nm" readonly="readonly">
							</div>
						</div>
						
						<div class="form-group">
							<label for="table_dc" class="sys_label_01 control-label">테이블 설명</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="table_dc" v-model="info.table_dc" readonly="readonly">
							</div>
							<label for="where_info_nm" class="sys_label_01 control-label">자료출처</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="where_info_nm" v-model="info.where_info_nm" readonly="readonly">
							</div>
						</div>
						
						<div class="form-group">
							<label for="hashtag_cn" class="sys_label_01 control-label">해시태그</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="hashtag_cn" v-model="info.hashtag_cn" readonly="readonly">
							</div>
							<label for="mngr_nm" class="sys_label_01 control-label">관리자명</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="mngr_nm" v-model="info.mngr_nm" readonly="readonly">
							</div>
						</div>
						<div class="form-group">
							<label for="hive_table_nm" class="sys_label_01 control-label">하이브적재테이블<br>영문명</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="hive_table_nm" v-model="info.hive_table_nm" readonly="readonly">
							</div>
							<label for="bigdata_gtrn_at" class="sys_label_01 control-label">빅데이터 수집여부</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="bigdata_gtrn_at" v-model="info.bigdata_gtrn_at" readonly="readonly">
							</div>
						</div>
						<div class="form-group">
							<label for="schdul_applc_at" class="sys_label_01 control-label">스케줄 적용여부</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="schdul_applc_at" v-model="info.schdul_applc_at" readonly="readonly">
							</div>
							<label for="gthnldn_mth_code" class="sys_label_01 control-label">수집적재 방법 코드</label>
							<div class="sys_col_02">
								<input type="text" class="form-control" id="gthnldn_mth_code" v-model="info.gthnldn_mth_code" readonly="readonly">
							</div>
						</div>
						
						<div class="form-group">
							<label for="gthnldn_mth_nm" class="sys_label_01 control-label">수집적재 방법명</label>
							<div class="sys_col_03">
								<input type="text" class="form-control" id="gthnldn_mth_nm" v-model="info.gthnldn_mth_nm" readonly="readonly">
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

<!-- 테이블정보 팝업 -->
<div class="modal fade" id="pop_dataInfo">
<template>
	<div class="modal-dialog" style="width: 85%;">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="btn_popClose">&times;</button>
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
					<div class="dataTables_paginate paging_simple_numbers" id="div_paginate" style="text-align: center;">
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
		info : {
			idx : "${idx}",
			reg_user_name : "",
			reg_dt_char : "",
			sys_nm : "",
			req_col_cnt : "",
			accumulated_records : "",
			planned_dt : "",
			req_sts : "1",
			cmnt : "",
			
			db_ty_nm  : "",
			table_eng_nm : "",
			table_korean_nm : "",
			table_dc : "",
			where_info_nm: "",
			hashtag_cn : "",
			mngr_nm : "",
			hive_table_nm : "",
			bigdata_gtrn_at : "",
			schdul_applc_at : "",
			gthnldn_mth_code : "",
			gthnldn_mth_nm : "",
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
			cf_ajax("/system/req_mng/dnld/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
			this.info.save_mode = "update";
			this.info.accumulated_records = this.info.accumulated_records.numformat();
			this.info.planned_dt = this.info.planned_dt.toDateformat();
		},
		save : function(){
			if(!confirm("저장하시겠습니까?")) return;
			cf_ajax("/system/req_mng/dnld/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.idx = data.idx;
			this.getInfo();
		},
		delInfo : function(){
			if(!confirm("삭제하시겠습니까?")) return;
			cf_ajax("/system/req_mng/dnld/delete", this.info, this.delInfoCB);
		},
		delInfoCB : function(data){
			this.gotoList();
		},
		gotoList : function(){
			cf_movePage('/system/req_mng/dnld/list?fromDtl=Y');
		},
		openPopDataInfo : function(idx){
			pop_dataInfo.init(idx);
			$('#pop_dataInfo').modal('show');
		},
	}
});


var pop_dataInfo = new Vue({
	el : "#pop_dataInfo",
	data : {
		dataList : [],
		download_req_idx : "",
	},
	methods : {
		init : function(){
			this.download_req_idx = vueapp.info.idx;
			this.getReqDataInfo();
		},
		getReqDataInfo : function(){
			cv_pagingConfig.pageNo = 1;
			cv_pagingConfig.limit = 10;
			cv_pagingConfig.func = this.getReqDataInfo;
			cv_pagingConfig.orders = [
				{target : "db_table_atrb_sn", isAsc : true},
			];
			
			var params = {
				download_req_idx : this.download_req_idx,
			};
			cf_ajax("/system/req_mng/dnld/getReqDataInfo", params, this.getReqDataInfoCB);
			
		},
		getReqDataInfoCB : function(data){
			this.dataList = data.list;		
			cv_pagingConfig.renderPagenation('system_pup01');
		}
	},
});

</script>
</html>