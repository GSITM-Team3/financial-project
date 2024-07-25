<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp"
	flush="false" />
<!-- Imported styles on this page -->
<link rel="stylesheet"
	href="/static_resources/system/js/datatables/datatables.css">
<link rel="stylesheet"
	href="/static_resources/system/js/datatables/prodlist.css">
<link rel="stylesheet"
	href="/static_resources/system/js/select2/select2.css">
<link rel="stylesheet"
	href="/static_resources/system/js/select2/select2-bootstrap.css">

<title>상품목록조회</title>
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
				<li class="active"><strong>상품목록조회</strong></li>
			</ol>

			<h2>상품관리 > 상품목록조회</h2>
			<br />

			<div class="flex-column flex-gap-10" id="vueapp">
				<template>
					<div class="flex flex-100">
						<div class="flex-wrap flex-66 flex flex-gap-10 flex-padding-10">
							<div class="form-group flex-40">
								<label class="form-control">상품명:</label> <input
									class="form-control" v-model="prod_nm" value="" />
							</div>
							<div class="form-group flex-40">
								<label class="form-control">가입대상:</label> <select
									v-model="sbstg_ty_cd" class="form-control">
									<option value="0">전체</option>
									<option value="1">일반개인</option>
									<option value="2">청년생활지원</option>
								</select>
							</div>
							<div class="form-group flex-40">
								<label class="form-control">판매시작일:</label> <input type="text"
									class="form-control" v-model="from_date"
									data-format="yyyy-mm-dd" style="width: 180px;">
							</div>
							<div class="form-group flex-40">
								<label class="form-control">납입주기:</label> <select
									v-model="pay_ty_cd" class="form-control">
									<option value="">전체</option>
									<option value="1">월납</option>
									<option value="2">년납</option>
									<option value="3">일시납</option>
								</select>
							</div>
						</div>
						<div
							class="flex-wrap flex-33 flex flex-center flex-gap-10 flex-padding-10">
							<div class="form-group" style="width: 45%;">
								<button type="button"
									class="btn btn-blue btn-icon icon-left form-control "
									@click="getListCond(true)">
									조건검색 <i class="entypo-search"></i>
								</button>

							</div>
							<div class="form-group" style="width: 45%;">
								<button type="button"
									class="btn btn-blue btn-icon icon-left form-control"
									@click="getListAll(true)">
									전체검색 <i class="entypo-search"></i>
								</button>
							</div>
						</div>
					</div>
					<div class="flex flex-100 flex-padding-10 flex-gap-10"
						style="justify-content: flex-end; border: 1px solid #999999;">
						<button type="button" class="btn btn-blue btn-icon icon-left"
							@click="popupPrint()">
							인쇄 <i class="entypo-print"></i>
						</button>
						<!-- <button type="button"
							class="btn btn-orange btn-icon icon-left btn-small"
							@click="cf_movePage('/prod_mng/dtl')">
							등록 <i class="entypo-plus"></i>
						</button> -->
					</div>
					<table class="table table-bordered datatable dataTable"
						id="grid_app" style="border: 1px solid #999999;">
						<thead>
							<tr class="replace-inputs">
								<th style="width: 4%;" class="center hidden-xs nosort"><input
									type="checkbox" id="allCheck" @click="all_check(event.target)"></th>
								<th style="width: 20%;" class="center sorting"
									@click="sortList(event.target)" sort_target="prod_nm">상품명</th>
								<th style="width: 10%;" class="center sorting"
									@click="sortList(event.target)" sort_target="sbstg_ty_cd_nm">가입대상</th>
								<th style="width: 13%;" class="center sorting"
									@click="sortList(event.target)" sort_target="ntsl_amt_min">최소가입금액</th>
								<th style="width: 13%;" class="center sorting"
									@click="sortList(event.target)" sort_target="ntsl_amt_max">최대가입금액</th>
								<th style="width: 10%;" class="center sorting"
									@click="sortList(event.target)" sort_target="pay_ty_cd_nm">납입주기</th>
								<th style="width: 10%;" class="center sorting"
									@click="sortList(event.target)" sort_target="prod_air_min">최소적용이율</th>
								<th style="width: 10%;" class="center sorting"
									@click="sortList(event.target)" sort_target="prod_air_max">최대적용이율</th>
								<th style="width: 10%;" class="center sorting"
									@click="sortList(event.target)" sort_target="int_tax_ty_cd_nm">이자과세</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in dataList" style="cursor: pointer;">
								<td class="center"><input type="checkbox"
									:data-idx="item.prod_cd" name="is_check" @click="onCheck">
								</td>
								<td class="left" @click="gotoDtl(item.prod_cd)">{{item.prod_nm}}</td>
								<td class="center" @click="gotoDtl(item.prod_cd)">{{item.sbstg_ty_cd_nm}}</td>
								<td class="right" @click="gotoDtl(item.prod_cd)"
									style="text-align: right;">{{item.ntsl_amt_min}}</td>
								<td class="right" @click="gotoDtl(item.prod_cd)"
									style="text-align: right;">{{item.ntsl_amt_max}}</td>
								<td class="center" @click="gotoDtl(item.prod_cd)">{{item.pay_ty_cd_nm}}</td>
								<td class="right" @click="gotoDtl(item.prod_cd)"
									style="text-align: right;">{{item.prod_air_min}}</td>
								<td class="right" @click="gotoDtl(item.prod_cd)"
									style="text-align: right;">{{item.prod_air_max}}</td>
								<td class="center" @click="gotoDtl(item.prod_cd)">{{item.int_tax_ty_cd_nm}}</td>
							</tr>
						</tbody>
					</table>

					<div class="dataTables_paginate paging_simple_numbers"
						id="div_paginate"></div>
					<!-- 					<div class="flex flex-100 flex-padding-10 flex-gap-10" -->
					<!-- 						style="justify-content: flex-end; border: 1px solid #999999;"> -->
					<!-- 						<button type="button" class="btn btn-blue btn-icon btn-small" -->
					<!-- 							@click="close()"> -->
					<!-- 							close -->
					<!-- 						</button> -->
					<!-- 					</div> -->



				</template>
			</div>

			<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp"
				flush="false" />

		</div>

	</div>
	<!-- 출력팝업DIV -->
	<div class="modal fade" id="popup_print">
		<template>
			<div class="modal-dialog" style="width: 80%;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"
							aria-hidden="true" id="btn_popClose">&times;</button>
						<h4 class="modal-title" id="modify_nm">상품목록 출력관리</h4>
					</div>
					<div class="modal-body">
						<form class="form-horizontal form-groups-bordered">
							<div>
								[상품목록] 를(을) 출력하시겠습니까?<br> ※판매상품정보는 대외비이므로 유의하셔야 합니다.
							</div>
							<div class="form-group">
								<div class="col-sm-10">출력대상 : {{printInfo.prodCount}}건</div>
							</div>
							<div class="form-group" id="printArea">
								<table class="table datatable dataTable">
									<thead>
										<tr class="replace-inputs">
											<th style="width: 15%;" class="center">상품코드</th>
											<th style="width: 55%;" class="center">상품명</th>
											<th style="width: 15%;" class="center">상품유형</th>
											<th style="width: 15%;" class="center">가입대상</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="item in printInfo.prodList">
											<td class="center">{{item.prod_cd}}</td>
											<td class="left">{{item.prod_nm}}</td>
											<td class="center">{{item.prod_ty_cd_nm}}</td>
											<td class="center">{{item.sbstg_ty_cd_nm}}</td>
										</tr>
									</tbody>
								</table>
							</div>

						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="print">인쇄</button>
						<button type="button" class="btn btn-secondary"
							data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</template>
	</div>

</body>
<script>
	function setDatePicker() {
		setTimeout(
				function() {
					if ($("#fromdtbtn").length == 1) {
						var $this = $(".datepicker2"), opts = {
							format : attrDefault($this, 'format', 'mm/dd/yyyy'),
							daysOfWeekDisabled : attrDefault($this,
									'disabledDays', ''),
							startView : attrDefault($this, 'startView', 0),
							rtl : rtl(),
							todayBtn : true,
							language : 'ko',
							autoclose : true,
							todayHighlight : true,
						}, $n = $this.next(), $p = $this.prev();
						$this.datepicker(opts).on("changeDate", function(e) {
							var objID = e.currentTarget.id;
							if (objID == 'fromdtbtn') { //시작일시
								vueapp.from_date = e.date.format('yyyy-MM-dd')
							}
						});
					}
				}, 300);
	}
	setDatePicker();

	var todaystr = "${today}";
	var today = todaystr.toDate();

	var vueapp = new Vue(
			{
				el : "#vueapp",
				data : {
					dataList : [],
					prod_nm : "",
					sbstg_ty_cd : "",
					pay_ty_cd : "",
					from_date : "",
					all_srch : "N",
				},
				mounted : function() {
					var fromDtl = cf_getUrlParam("fromDtl");
					var pagingConfig = cv_sessionStorage
							.getItem("pagingConfig");
					if ("Y" === fromDtl && !cf_isEmpty(pagingConfig)) {
						cv_pagingConfig.pageNo = pagingConfig.pageNo;
						cv_pagingConfig.orders = pagingConfig.orders;

						this.getList();
					} else {
						cv_sessionStorage.removeItem("pagingConfig")
								.removeItem("params");
						this.getList(true);
					}
				},
				methods : {
					getListAll : function(isInit) {
						this.all_srch = "Y";
						this.getList(isInit);
					},
					getListCond : function(isInit) {
						this.all_srch = "N";
						this.getList(isInit);
					},
					getList : function(isInit) {

						cv_pagingConfig.func = this.getList;

						if (isInit === true) {
							cv_pagingConfig.pageNo = 1;
						}

						var params = {}
						if (this.all_srch != "Y") {
							params = {
								prod_nm : this.prod_nm,
								sbstg_ty_cd : this.sbstg_ty_cd,
								pay_ty_cd : this.pay_ty_cd,
								from_date : this.from_date,
							}
						}
						cv_sessionStorage.setItem('pagingConfig',
								cv_pagingConfig).setItem('params', params);

						cf_ajax("/prod_mng/getListPaging", params,
								this.getListCB);
					},
					getListCB : function(data) {
						this.dataList = data.list;
						for (var i = 0; i < this.dataList.length; i++) {
							this.dataList[i].ntsl_amt_min = this.dataList[i].ntsl_amt_min
									.numformat();
							this.dataList[i].ntsl_amt_max = this.dataList[i].ntsl_amt_max
									.numformat();
						}

						cv_pagingConfig.renderPagenation("system");
					},
					gotoDtl : function(prod_cd) {
						var params = {
							prod_cd : cf_defaultIfEmpty(prod_cd, ""),
						}
						cf_movePage("/prod_mng/dtl", params);
					},
					sortList : function(obj) {
						cf_setSortConf(obj, "prod_nm");
						this.getList();
					},
					all_check : function(obj) {
						$('[name=is_check]').prop('checked', obj.checked);
					},
					onCheck : function() {
						$("#allCheck")
								.prop(
										'checked',
										$("[name=is_check]:checked").length === $("[name=is_check]").length);
					},
					popupPrint : function(prod_cd) {
						var chkedList = $("[name=is_check]:checked");
						if (chkedList.length == 0) {
							alert("출력할 대상을 선택하여 주십시오.");
							return;
						}
						//check list 가져오기..
						var dateCopyList = [];
						var idx;
						chkedList.each(function(i) {
							idx = $(this).attr("data-idx");
							dateCopyList.push(vueapp.dataList.getElementFirst(
									"prod_cd", idx));
						});

						console.log(dateCopyList);

						//출력팝업 띄우기
						popup_print.init(dateCopyList);
						$('#popup_print').modal('show');
					},
				},
			})

	var popup_print = new Vue(
			{
				el : "#popup_print",
				data : {
					printInfo : {
						prodCount : 0,
						prodList : [],
					}
				},
				methods : {
					init : function(dateCopyList) {
						this.initInfo(dateCopyList);
					},
					initInfo : function(dateCopyList) {
						this.printInfo = {
							prodCount : dateCopyList.length,
							prodList : dateCopyList,
						};
					},
					print : function() {
						const printArea = document.getElementById('printArea').innerHTML;
						console.log(printArea);

						win = window.open();
						self.focus();
						win.document.open();

						/*
						1. div 안의 모든 태그들을 innerHTML을 사용하여 매개변수로 받는다.
						2. window.open() 을 사용하여 새 팝업창을 띄운다.
						3. 열린 새 팝업창에 기본 <html><head><body>를 추가한다.
						4. <body> 안에 매개변수로 받은 printArea를 추가한다.
						5. window.print() 로 인쇄
						6. 인쇄 확인이 되면 팝업창은 자동으로 window.close()를 호출하여 닫힘
						 */
						win.document.write('<html><head>');

						win.document
								.write('<link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">');
						win.document
								.write('<link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">');
						win.document
								.write('<link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">');

						win.document.write('<title></title><style>');
						win.document.write('td.center {text-align: center;}');
						win.document.write('th.center {text-align: center;}');
						win.document.write('body {font-size: 14px;}');
						win.document.write('</style></head><body>');
						win.document.write(printArea);
						win.document.write('</body></html>');
						win.document.close();
						win.print();
						win.close();
					},
				}
			});
</script>
</html>