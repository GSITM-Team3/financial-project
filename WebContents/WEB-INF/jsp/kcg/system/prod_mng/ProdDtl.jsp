<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp"
	flush="false" />
<link rel="stylesheet"
	href="/static_resources/system/js/datatables/datatables.css">
<link rel="stylesheet"
	href="/static_resources/system/js/select2/select2-bootstrap.css">
<link rel="stylesheet"
	href="/static_resources/system/js/select2/select2.css">
<link rel="stylesheet"
	href="/static_resources/system/js/datatables/proddtl.css">

<title>상품정보관리</title>
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
				<li class="active"><strong>상품정보관리</strong></li>
			</ol>

			<h2>상품관리 > 상품정보관리</h2>
			<br />

			<div class="row">
				<div id="vueapp" style="display: flex; justify-items: center;">
					<template>
						<div class="panel-body flex-100">
							<div class="left-panel flex-66">
								<div class="form-group">
									<label for="prod_nm" class="fix-width-33">상품명:</label> <input
										type="text" class="form-control" id="prod_nm"
										v-model="info.prod_nm">
								</div>
								<div class="form-group">
									<label for="prod_cd" class="fix-width-33">상품코드:</label> <input
										type="text" class="form-control" id="prod_cd"
										v-model="info.prod_cd"
										:disabled="info.wrter_nm!=''&&info.wrter_nm!=undefined">
								</div>
								<div class="form-group">
									<label for="prod_ty_cd" class="fix-width-33">상품유형:</label> <select
										class="form-control" id="prod_ty_cd" v-model="info.prod_ty_cd"
										:disabled="info.wrter_nm!=''&&info.wrter_nm!=undefined">
										<option value="1">적금설계</option>
										<option value="2">목돈마련설계</option>
										<option value="3">예금설계</option>
										<option value="4">대출설계</option>
									</select>
								</div>

								<div class="form-group">
									<label for="sbstg_ty_cd" class="fix-width-33">가입대상:</label> <select
										class="form-control" id="sbstg_ty_cd"
										v-model="info.sbstg_ty_cd">
										<option value="1">일반개인</option>
										<option value="2">청년생활지원</option>
										<option value="3">장애자우선지원</option>
									</select>
								</div>

								<div class="form-group">
									<label for="ntsl_amt_min" class="fix-width-33">가입금액:</label>
									<div class="form-control">
										<label>(최소)</label> <input type="text" id="ntsl_amt_min"
											v-model="info.ntsl_amt_min"> <label>원 ~ (최대)</label>
										<input type="text" id="ntsl_amt_max"
											v-model="info.ntsl_amt_max"> <label>원</label>
									</div>
								</div>

								<div class="form-group">
									<label for="prod_ty_cd" class="fix-width-33">납입주기:</label> <select
										class="form-control" id="pay_ty_cd" v-model="info.pay_ty_cd">
										<option value="1">월납</option>
										<option value="2">년납</option>
										<option value="3">일시납</option>
									</select>
								</div>

								<div class="form-group">
									<label for="prod_air_min" class="fix-width-33">적용이율(최저):</label>
									<input type="text" class="form-control" id="prod_air_min"
										v-model="info.prod_air_min">
								</div>

								<div class="form-group">
									<label for="prod_air_max" class="fix-width-33">적용이율(최대):</label>
									<div class="form-control">
										<label>(최소)</label> <input type="text" id="prod_air_min"
											v-model="info.prod_air_min"> <label>% ~ (최대)</label>
										<input type="text" id="prod_air_max"
											v-model="info.prod_air_max"> <label>%</label>
									</div>
								</div>

								<div class="form-group">
									<label for="prod_air_bgng_ymd" class="fix-width-33">적용기간:</label>
									<div class="form-control">
										<input type="date" id="prod_air_bgng_ymd"
											v-model="info.prod_air_bgng_ymd"> <label>To</label> <input
											type="date" id="prod_air_end_ymd"
											v-model="info.prod_air_end_ymd"> <label>End</label>
									</div>
								</div>

								<div class="form-group">
									<label for="int_tax_ty_cd_nm" class="fix-width-33">이자과세구분:</label>
									<select class="form-control" id="int_tax_ty_cd"
										v-model="info.int_tax_ty_cd">
										<option value="1">일반과세</option>
										<option value="2">세금우대</option>
										<option value="3">비과세</option>
									</select>
								</div>

								<div class="form-group">
									<label for="curr_stcd" class="fix-width-33">판매상태:</label> <select
										class="form-control" id="curr_stcd" v-model="info.curr_stcd">
										<option value="0">정상(판매)</option>
										<option value="1">판매준비</option>
										<option value="2">판매인가</option>
										<option value="3">판매중지</option>
									</select>
								</div>

								<div class="form-group">
									<label for="ntsl_bgng_ymd" class="fix-width-33">판매기간(시작:</label>
									<div class="form-control">
										<input type="date" id="ntsl_bgng_ymd"
											v-model="info.ntsl_bgng_ymd"> <label>To</label> <input
											type="date" id="ntsl_end_ymd" v-model="info.ntsl_end_ymd">
										<label>End</label>
									</div>
								</div>

								<div class="form-group">
									<div class="">
										<button type="button" class="btn btn-green btn-icon btn-small"
											@click="save">
											저장 <i class="entypo-check"></i>
										</button>
										<button type="button" id="btn_delete"
											class="btn btn-red btn-icon btn-small" @click="delInfo">
											삭제 <i class="entypo-trash"></i>
										</button>
										<button type="button" class="btn btn-blue btn-icon btn-small"
											@click="gotoList">
											목록 <i class="entypo-list"></i>
										</button>
									</div>
								</div>
							</div>
							<div class="right-panel flex-33">
								<label>이율변동내역</label>
								<textarea type="text"
									style="width: 100%; font-size: 13px; border: 1px solid #666666;"
									rows="37" cols="33" id="field_contents">{{ info.prod_hist }}</textarea>
							</div>
						</div>
					</template>

				</div>
			</div>

			<br />

			<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp"
				flush="false" />

		</div>
	</div>
</body>
<script>
	var vueapp = new Vue({
		el : "#vueapp",
		data : {
			info : {
				prod_cd : "${prod_cd}",
				prod_hist : "",
				save_mode : "insert",
			},
		},
		mounted : function() {
			if (!cf_isEmpty(this.info.prod_cd)) {
				this.getInfo();
			}
		},
		methods : {
			getInfo : function() {
				cf_ajax("/prod_mng/getInfo", this.info, this.getInfoCB);
			},
			getInfoCB : function(data) {
				this.info = data;
				this.info.save_mode = "update";
			},
			save : function() {

				if (cf_isEmpty(this.info.prod_nm)) {
					alert("상품명을 입력하세요.");
					return;
				} else if (cf_isEmpty(this.info.prod_cd)) {
					alert("상품코드를 입력하세요.");
					return;
				} else if (cf_isEmpty(this.info.prod_ty_cd)) {
					alert("상품유형을 입력하세요.");
					return;
				}

				if (!confirm("저장하시겠습니까?"))
					return;

				cf_ajax("/prod_mng/save", this.info, this.saveCB);
			},
			saveCB : function(data) {
				alert("저장되었습니다.");
				this.info.prod_cd = data.prod_cd;
				this.getInfo();
			},
			delInfo : function() {
				if (!confirm("삭제하시겠습니까?"))
					return;
				cf_ajax("/prod_mng/delete", this.info, this.delInfoCB);
			},
			delInfoCB : function(data) {
				this.gotoList();
			},
			gotoList : function() {
				cf_movePage('/prod_mng/list');
			},
		}
	});
</script>
</html>