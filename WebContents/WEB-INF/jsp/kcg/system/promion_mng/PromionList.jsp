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
	
	<title>설계이력조회</title>
</head>
<body class="page-body">

<div class="page-container">

	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp" flush="false"/>

	<div class="main-content">

		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp" flush="false"/>
		
		<ol class="breadcrumb bc-3">
			<li><a href="#none" onclick="cf_movePage('/system')"><i class="fa fa-home"></i>Home</a></li>
			<li class="active"><strong>설계이력조회</strong></li>
		</ol>
	
		<h2>프로모션 > 설계이력조회</h2>
		<br/>
		
		<div class="dataTables_wrapper" id="vueapp">
		<template>
			<div class="dataTables_filter" style="float: none;">
				
				<table style="width: 100%;">
					<tr>
						<td class="left">
							<label class="sys_label_01 control-label">고객명:</label>
							<div class="sys_col_02" style="width: 246px;">
								<input class="form-control" v-model="cust_nm" value="" />
							</div>
							
							<label class="sys_label_01 control-label">관리담당자:</label>
							<div class="sys_col_02" style="width: 246px;">
								<input class="form-control" v-model="pic_nm" value="" />
							</div>
						</td>
						<td class="right" style="width: 200px;">
							<button type="button" class="btn btn-blue btn-icon icon-left" @click="getListCond(true)">
								조건검색
								<i class="entypo-search"></i>
							</button>
						</td>
					</tr>
					<tr>
						<td class="left">
							
							<label class="sys_label_01 control-label">제안일자</label>
							<div class="sys_col_02" style="width: 210px;">
								<div class="input-group">
									<input type="text" class="form-control datepicker2" v-model="wrt_dt" data-format="yyyy-mm-dd" style="width: 180px;">
								</div>
							</div>
							<button type="button" class="btn btn-primary btn-sm datepicker2" id="wrdtbtn" style="float: left;">
								<i class="fa fa-calendar"></i>
							</button>
							<label class="sys_label_01 control-label">상품명:</label>
							<div class="sys_col_02" style="width: 246px;">
								<input class="form-control" v-model="prod_nm" value="" />
							</div>
						</td>
						<td class="right" style="width: 200px;">
							<button type="button" class="btn btn-blue btn-icon icon-left" @click="getListAll(true)">
								전체검색
								<i class="entypo-search"></i>
							</button>
						</td>
					</tr>
				</table>
			</div>
			
			<div class="dataTables_filter" style="float: none;">
			<div class="sub flex flex-90">
                <span class="sub-button flex-center flex-10 flex-wrap">
<!--                     <button type="button" class="btn btn-blue btn-icon icon-left" style="margin-left: 5px;" @click="popupPrint()"> -->
<!-- 						인쇄 -->
<!-- 						<i class="entypo-print"></i> -->
<!-- 					</button> -->
					<button type="button" class="btn btn-orange btn-icon icon-left btn-small" @click="cf_movePage('/promion_mng/dtl')">
						등록
						<i class="entypo-plus"></i>
					</button>
                </span>
            </div>
            </div>
            
            
			<table class="table table-bordered datatable dataTable" id="grid_app">
				<thead>
					<tr class="replace-inputs">
						<th style="width: 5%;" class="center hidden-xs nosort"><input type="checkbox" id="allCheck" @click="all_check(event.target)"></th>
						<th style="width: 10%;" class="center sorting" @click="sortList(event.target)" sort_target="cust_nm">성명</th>
						<th style="width: 10%;" class="center sorting" @click="sortList(event.target)" sort_target="wrt_dt">제안일자</th>
						<th style="width: 15%;" class="center sorting" @click="sortList(event.target)" sort_target="cust_eml_addr">이메일ID</th>
						<th style="width: 10%;" class="center sorting" @click="sortList(event.target)" sort_target="prod_ty_cd_nm">상품유형</th>						
						<th style="width: 25%;" class="center sorting" @click="sortList(event.target)" sort_target="prod_nm">상품명</th>			
						<th style="width: 15%;" class="center sorting" @click="sortList(event.target)" sort_target="suggest_amt">제안금액</th>	
						<th style="width: 10%;" class="center">진행상태</th>							
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in dataList" style="cursor: pointer;">
						<td class="center">
							<input type="checkbox" :data-idx="item.prod_cd" name="is_check" @click="onCheck">
						</td>
						<td class="left" @click="gotoDtl(item)">{{item.cust_nm}}</td>
						<td class="center" @click="gotoDtl(item)">{{item.wrt_dt}}</td>
						<td class="left" @click="gotoDtl(item)">{{item.cust_eml_addr}}</td>
						<td class="center" @click="gotoDtl(item)">{{item.prod_ty_cd_nm}}</td>
						<td class="left" @click="gotoDtl(item)">{{item.prod_nm}}</td>
						<td class="right" @click="gotoDtl(item)" style="text-align: right;">{{item.suggest_amt}}</td>
						<td class="left" @click="gotoDtl(item)"></td>
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

function setDatePicker() {
	setTimeout(
			function(){
				if($("#wrdtbtn").length == 1){
					var $this = $(".datepicker2"),
					opts = {
						format: attrDefault($this, 'format', 'mm/dd/yyyy'),
						daysOfWeekDisabled: attrDefault($this, 'disabledDays', ''),
						startView: attrDefault($this, 'startView', 0),
						rtl: rtl(),
						todayBtn: true,
						language : 'ko',
						autoclose : true,
						todayHighlight : true,
					},
					$n = $this.next(),
					$p = $this.prev();
					$this.datepicker(opts).on("changeDate",function(e){
						var objID = e.currentTarget.id;
						if(objID == 'wrdtbtn'){	//시작일시
							vueapp.wrt_dt = e.date.format('yyyy-MM-dd')
						}
					});
				} 
			},
			300
		);
}
setDatePicker();

var todaystr = "${today}";							
var today = todaystr.toDate();	

var vueapp = new Vue({
	el : "#vueapp",
	data : {
		dataList : [],
		prod_nm : "",
		cust_nm  : "",
		pic_nm : "",
		wrt_dt : "",
		all_srch : "N",
	},
	mounted : function(){
		var fromDtl = cf_getUrlParam("fromDtl");
		var pagingConfig = cv_sessionStorage.getItem("pagingConfig");		
		if("Y" === fromDtl && !cf_isEmpty(pagingConfig)){
			cv_pagingConfig.pageNo = pagingConfig.pageNo;
			cv_pagingConfig.orders = pagingConfig.orders;
	 		
			this.getList();
		} else {
			cv_sessionStorage
				.removeItem("pagingConfig")
				.removeItem("params");
			this.getList(true);
		}
	},
	methods : {
		getListAll : function(isInit){
			this.all_srch = "Y";
			this.getList(isInit);
		},
		getListCond : function(isInit){
			this.all_srch = "N";
			this.getList(isInit);
		},
		getList : function(isInit){

			cv_pagingConfig.func = this.getList;
			
			if(isInit === true){
				cv_pagingConfig.pageNo = 1;
			}
			
			var params = {};
			if(this.all_srch != "Y") {
				params = {
					cust_nm : this.cust_nm,
					pic_nm : this.pic_nm,
					wrt_dt : this.wrt_dt,
					prod_nm : this.prod_nm,
				}
			}
			
			cv_sessionStorage
				.setItem('pagingConfig', cv_pagingConfig)
				.setItem('params', params);

			cf_ajax("/promion_mng/getListPaging", params, this.getListCB);
		},
		getListCB : function(data){
 			this.dataList = data.list;
			for(var i=0; i<this.dataList.length; i++){
				this.dataList[i].suggest_amt = this.dataList[i].suggest_amt.numformat();
			}
			
			cv_pagingConfig.renderPagenation("system");
		},
		gotoDtl : function(item){
			var params = {
					prod_ds_sn : cf_defaultIfEmpty(item.prod_ds_sn, ""),
					cust_mbl_telno : cf_defaultIfEmpty(item.cust_mbl_telno, ""),
					prod_ty_cd : cf_defaultIfEmpty(item.prod_ty_cd, ""),
				}
			cf_movePage("/promion_mng/dtl", params);
		},
		sortList : function(obj){
			cf_setSortConf(obj, "prod_nm");
			this.getList();
		},
		all_check : function(obj){
			$('[name=is_check]').prop('checked',obj.checked);
		},
		onCheck : function(){
			$("#allCheck").prop('checked',
					$("[name=is_check]:checked").length === $("[name=is_check]").length
			);
		},
		popupPrint : function(prod_cd){
			var chkedList = $("[name=is_check]:checked");			 
			if(chkedList.length == 0){
				alert("출력할 대상을 선택하여 주십시오.");
				return;
			}
			//check list 가져오기..
			var dateCopyList = [];
			var idx;
			chkedList.each(function(i) {
				idx = $(this).attr("data-idx");
				dateCopyList.push(vueapp.dataList.getElementFirst("prod_cd", idx));
			});			
			
			console.log(dateCopyList);		
			
			//출력팝업 띄우기
			popup_print.init(dateCopyList);
			$('#popup_print').modal('show');
		},
	},
})
</script>
</html>