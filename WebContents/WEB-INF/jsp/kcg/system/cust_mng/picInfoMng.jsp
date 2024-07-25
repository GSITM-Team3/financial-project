<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp"
	flush="false" />

<script src="/static_resources/system/js/bootstrap-datepicker.js"></script>
<script src="/static_resources/system/js/bootstrap-datepicker.ko.js"></script>
<!-- Imported styles on this page -->
<title>관리자시스템</title>
</head>
<body class="page-body">

	<div class="page-container">

		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp"
			flush="false" />

		<div class="main-content">

			<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp"
				flush="false" />

			<ol class="breadcrumb bc-3">
				<li><a href="#none" onclick="cf_movePage('/system')"><i
						class="fa fa-home"></i>Home</a></li>
				<li><a href="#gm">고객관리</a></li>
				<li class="active"><strong>담당자 관리</strong></li>
			</ol>

			<h2>담당자 관리</h2>
			<br />

			<div id="vueapp">
				<template>
					<div class="row">
						<div style="width: 910px; margin-left: 15px;">
							<div class="panel panel-primary">
								<div class="panel-body">
									<form class="form-horizontal form-groups-bordered">
										<div class="form-group">
											담당자명 : <input type="text" placeholder=""
												style="width: 120px;" v-model="pic_nm">
											<button type="button" class="btn btn-blue btn-icon icon-left"
												style="margin-left: 10px;" @click="picNameInfo">
												검색 <i class="entypo-search"></i>
											</button>
										</div>
										<div class="form-group">
											<label for="err_kor_nm" class="col-sm-3 control-label">담당자명
												: </label>
											<div class="col-sm-9">
												<input type="text" id="pic_nm2" v-model="pic_nm2">
											</div>
										</div>
										<div class="form-group">
											<label for="err_kor_nm" class="col-sm-3 control-label">부서명
												: </label>
											<div class="col-sm-9">
												<select id="dept_nm" v-model="dept_nm">
													<option value="1">개발</option>
													<option value="2">마케팅</option>
												</select> <input type="text" id="dept_nm" v-model="dept_nm">
											</div>
										</div>
										<div class="form-group">
											<label for="err_eng_nm" class="col-sm-3 control-label">직위
												: </label>
											<div class="col-sm-9">
												<select id="jbps_ty_cd" v-model="jbps_ty_cd">
													<option value="11">회장</option>
													<option value="12">사장</option>
													<option value="13">부사장</option>
													<option value="14">전무이사</option>
													<option value="15">상무이사</option>
													<option value="16">이사</option>
													<option value="17">전문위원</option>
													<option value="18">위원</option>
													<option value="21">부장</option>
													<option value="22">차장</option>
													<option value="23">과장</option>
													<option value="24">대리</option>
													<option value="25">주임</option>
													<option value="26">계장</option>
													<option value="27">사원</option>
													<option value="31">수석연구원</option>
													<option value="32">책임연구원</option>
													<option value="33">선임연구원</option>
													<option value="34">연구원</option>
												</select> <input type="text" id="jbps_ty_cd_nm"
													v-model="jbps_ty_cd_nm">
											</div>
										</div>
										<div class="form-group">
											<label for="err_eng_nm" class="col-sm-3 control-label">연락처
												: </label>
											<div class="col-sm-9">
												<input type="text" id="pic_mbl_telno"
													v-model="pic_mbl_telno">
											</div>
										</div>
										<div class="form-group">
											<label for="err_eng_nm" class="col-sm-3 control-label">E-mail
												: </label>
											<div class="col-sm-9">
												<input type="text" id="pic_eml_addr" v-model="pic_eml_addr">
											</div>
										</div>
										<div class="form-group">
											<label for="err_eng_nm" class="col-sm-3 control-label">입사일자
												: </label>
											<div class="col-sm-9">
												<input type="text" id="jncmp_ymd" v-model="jncmp_ymd">
											</div>
										</div>
										<div class="form-group">
											<label for="err_eng_nm" class="col-sm-3 control-label">기타
												: </label>
											<div class="col-sm-9">
												<textarea id="etc_tsk_cn" v-model="etc_tsk_cn"
													style="width: 100%;"></textarea>
											</div>
										</div>
										<button type="button" class="btn btn-blue btn-icon icon-left"
											style="margin-left: 5px;" @click="picInsert">
											등록 <i class="entypo-search"></i>
										</button>
										<button type="button" class="btn btn-blue btn-icon icon-left"
											style="margin-left: 5px;" @click="picUpdate">
											변경 <i class="entypo-search"></i>
										</button>
										<button type="button" class="btn btn-blue btn-icon icon-left"
											style="margin-left: 5px;" @click="picDelete">
											삭제 <i class="entypo-search"></i>
										</button>
										<button type="button" class="btn btn-blue btn-icon icon-left"
											style="margin-left: 5px;" @click="uiClear">
											신규 <i class="entypo-search"></i>
										</button>
										<button type="button" class="btn btn-blue btn-icon icon-left"
											style="margin-left: 5px;" @click="custInfoList">
											고객목록 <i class="entypo-search"></i>
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</template>
			</div>
			<br />
			<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp"
				flush="false" />
		</div>
	</div>
	<!-- 담당자명 팝업 -->
	<div class="modal fade" id="pop_pic_name">
		<template>
			<div class="modal-dialog" style="width: 500px;">
				<div class="modal-content">
					<div class="modal-body">
						<div style="height: 400px; overflow: auto;"
							class="dataTables_wrapper">
							<table class="table table-bordered datatable dataTable">
								<thead style="position: sticky; top: 0px;">
									<tr>
										<th class="center" style="width: 20%;">담당자명</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="item in picList" @click="selPicItem(item.pic_nm)"
										style="cursor: pointer;">
										<td class="center">{{item.pic_nm}}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
	<!-- 담당자명 팝업 -->
</body>
<script>
	var vueapp = new Vue({
		el : "#vueapp",
		data : {
			pic_nm : "",
			pic_nm2 : "",
			dept_nm : "",
			jbps_ty_cd_nm : "",
			jbps_ty_cd : "",
			pic_mbl_telno : "",
			pic_eml_addr : "",
			jncmp_ymd : "",
			etc_tsk_cn : "",
		},
		mounted : function() {
			var params = cv_sessionStorage.getItem("params");
			this.pic_nm = params.pic_nm;
		},
		methods : {
			picNameInfo : function(isInit) {
				pic_nm = this.pic_nm;
				pop_pic_name.init(pic_nm);
				$('#pop_pic_name').modal('show');
			},
			getPicSelName : function(pic_nm) {
				var params = {
					pic_nm : pic_nm,
				}
				cf_ajax("/custMng/getPicSelInfo", params, this.getInfoCB);
			},
			getInfoCB : function(data) {
				this.pic_nm = data.pic_nm2;
				this.pic_nm2 = data.pic_nm2;
				this.dept_nm = data.dept_nm;
				this.jbps_ty_cd_nm = data.jbps_ty_cd_nm;
				this.pic_mbl_telno = data.pic_mbl_telno;
				this.pic_eml_addr = data.pic_eml_addr;
				this.jncmp_ymd = data.jncmp_ymd;
				this.etc_tsk_cn = data.etc_tsk_cn;
			},
			picUpdate : function() {

				var pic_nm = vueapp.pic_nm2;
				var dept_nm = vueapp.dept_nm;
				var jbps_ty_cd = vueapp.jbps_ty_cd;
				var pic_mbl_telno = vueapp.pic_mbl_telno;
				var pic_eml_addr = vueapp.pic_eml_addr;
				var jncmp_ymd = vueapp.jncmp_ymd;
				var etc_tsk_cn = vueapp.etc_tsk_cn;

				var params = {
					pic_nm : pic_nm,
					dept_nm : dept_nm,
					jbps_ty_cd : jbps_ty_cd,
					pic_mbl_telno : pic_mbl_telno,
					pic_eml_addr : pic_eml_addr,
					jncmp_ymd : jncmp_ymd,
					etc_tsk_cn : etc_tsk_cn,
				}
				cf_ajax("/custMng/updatePic", params, this.changeStsCB);
			},
			changeStsCB : function(data) {
				if (data.status == "OK") {
					alert("담당자정보 변경 완료");
				}
			},
			picDelete : function() {

				var pic_mbl_telno = vueapp.pic_mbl_telno;

				var params = {
					pic_mbl_telno : pic_mbl_telno,
				}
				cf_ajax("/custMng/updatePicStcd", params, this.deleteStsCB);
			},
			deleteStsCB : function(data) {
				if (data.status == "OK") {
					alert("담당자정보 삭제 완료");
				}
			},
			picInsert : function() {

				var pic_nm = vueapp.pic_nm2;
				var dept_nm = vueapp.dept_nm;
				var jbps_ty_cd = vueapp.jbps_ty_cd;
				var pic_mbl_telno = vueapp.pic_mbl_telno;
				var pic_eml_addr = vueapp.pic_eml_addr;
				var jncmp_ymd = vueapp.jncmp_ymd;
				var etc_tsk_cn = vueapp.etc_tsk_cn;
				var user_id = "ddja01a";
				var user_pswd = "ddja01a123";
				var wrter_nm = "정약용";
				var curr_stcd = "0";

				var params = {
					pic_nm : pic_nm,
					dept_nm : dept_nm,
					jbps_ty_cd : jbps_ty_cd,
					pic_mbl_telno : pic_mbl_telno,
					pic_eml_addr : pic_eml_addr,
					jncmp_ymd : jncmp_ymd,
					etc_tsk_cn : etc_tsk_cn,
					user_id : user_id,
					user_pswd : user_pswd,
					wrter_nm : wrter_nm,
					curr_stcd : curr_stcd,
				}
				cf_ajax("/custMng/insertPicInfo", params, this.insertStsCB);
			},
			insertStsCB : function(data) {
				if (data.status == "OK") {
					alert("담당자정보 입력 완료");
				}
			},
			uiClear : function() {
				cf_movePage('/custMng/picInfoMng');
			},
			custInfoList : function() {
				cf_movePage('/custMng/custInfoList');
			},
		},
	});

	var pop_pic_name = new Vue({
		el : "#pop_pic_name",
		data : {
			picList : [],
		},
		methods : {
			init : function(pic_nm) {
				this.getPicName(pic_nm);
			},
			getPicName : function(pic_nm) {
				this.picList = [];
				var params = {
					pic_nm : pic_nm,
				}

				cf_ajax("/custMng/getPicName", params, function(data) {
					pop_pic_name.picList = data;
				});
			},
			selPicItem : function(pic_nm) {

				$('#pop_pic_name').modal('hide');
				vueapp.getPicSelName(pic_nm);
			},
		},
	});
</script>
</html>