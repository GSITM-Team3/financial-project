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
	<link rel="stylesheet" href="/static_resources/system/js/datatables/common1.css">
	
	<!-- Bilboard Chart(https://naver.github.io/billboard.js) -->
	<script src="/static_resources/system/js/datatables/billboard.js"></script>
	<link rel="stylesheet" href="/static_resources/system/js/datatables/billboard.css">
	
	<title>금융계산기</title>ㅇ
</head>
<body class="page-body">

<div class="page-container">

	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp" flush="false"/>

	<div class="main-content">

		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp" flush="false"/>
		
		<ol class="breadcrumb bc-3">
			<li><a href="#none" onclick="cf_movePage('/system')"><i class="fa fa-home"></i>Home</a></li>
			<li class="active"><strong>금융계산기</strong></li>
		</ol>
	
		<h2>상품관리 > 금융계산기</h2>
		<br/>
		
		<div class="row">
			<div class="dataTables_wrapper flex" id="vueapp">
			<template>
			
				<div class="left flex-column flex-gap-10 flex-40" v-if="info.dsg_ty_cd == '1'">
                    <label>고객정보:</label>
                    <div class="form-group">
                        <label>작성일자:</label>
                        <input class="form-control" value="2023-12-29" disabled />
                    </div>
                    <div class="form-group">
                        <label>성명:</label>
                        <input class="form-control" v-model="custInfo.cust_nm" disabled />
                        <button type="button" class="btn" @click="popupCust()">
                             <i class="fa fa-search"></i>
                         </button>
                    </div>
                    <div class="form-group">
                        <label>실명번호:</label>
                        <input class="form-control" v-model="custInfo.rrno" disabled />
                    </div>
                    <div class="form-group">
                        <label>E-mail:</label>
                        <input class="form-control" v-model="custInfo.cust_eml_addr" disabled />
                    </div>
                    <div class="form-group">
                        <label>전화번호:</label>
                        <input class="form-control" v-model="custInfo.co_telno" disabled />
                    </div>
                    <div class="form-group">
                        <label>핸드폰번호:</label>
                        <input class="form-control" v-model="custInfo.cust_mbl_telno" disabled />
                    </div>
                    <div class="form-group">
                        <label>직업:</label>
                        <input class="form-control" v-model="custInfo.occp_ty_cd_nm" disabled />
                    </div>
                    <div class="form-group">
                        <label>주소:</label>
                        <input class="form-control" v-model="custInfo.cust_addr" disabled />
                    </div>
                    <div class="form-group">
                        <label>관리담당자:</label>
                        <input class="form-control" v-model="custInfo.pic_nm" disabled />
                    </div>
                    <div class="form-group">
                        <label>부서:</label>
                        <input class="form-control" v-model="custInfo.dept_nm" disabled />
                    </div>
                    <div class="form-group">
                        <label>직위:</label>
                        <input class="form-control" v-model="custInfo.jbps_ty_cd_nm" disabled />
                    </div>
                    <div class="form-group">
                        <label>연락처:</label>
                        <input class="form-control" v-model="custInfo.pic_mbl_telno" disabled />
                    </div>
                </div>
                
                
				<div class="right flex-column flex-100">
                    <div class="right-top">
                        <ul class="nav">
                            <li class="nav-tab active">적금 설계</li>
                            <li class="nav-tab">목돈마련적금 설계</li>
                            <li class="nav-tab">예금 설계</li>
                            <li class="nav-tab">대출 설계</li>
                        </ul>
                        <div class="nav-content flex-column flex-gap-10">
                            <div class="form-group" style="justify-content: left">
                                <label>상품선택:</label>
                                <input class="form-control" id="prod_cd" v-model="info.prod_cd" disabled />
                                <input class="form-control" id="prod_nm" v-model="info.prod_nm" disabled />
                                <button type="button" class="btn" @click="popupProd()">
                                    <i class="fa fa-search"></i>
                                </button>
                            </div>
                            <div class="form-group" style="justify-content: left">
                                <label>납입주기:</label>
                                <select class="form-control" id="pay_ty_cd" v-model="info.pay_ty_cd" disabled>
									<option value="1">월납</option>
									<option value="2">년납</option>
									<option value="3">일시납</option>
								</select>
                            </div>
                            <div class="form-group" style="justify-content: left">
                                <label>불입금액 (원):</label>
                                <input class="form-control flex-100" type="text" id="circle_acml_amt" v-model="info.circle_acml_amt" />
                                <button type="button" class="btn btn-transparent flex-20" @click="setCircleAcmlAmt(10)">+10만원</button>
                                <button type="button" class="btn btn-transparent flex-20" @click="setCircleAcmlAmt(50)">+50만원</button>
                                <button type="button" class="btn btn-transparent flex-20" @click="setCircleAcmlAmt(100)">+100만원</button>
                                <button type="button" class="btn btn-navy flex-20" @click="setCircleAcmlAmt(0)">정정</button>
                            </div>
                            <div class="form-group" style="justify-content: left">
                                <label>불입기간 (개월):</label>
                                <input class="form-control flex-20" type="text" id="goal_prd" v-model="info.goal_prd" />
                                <button type="button" class="btn btn-transparent flex-20" @click="setGoalPrd(3)">+3개월</button>
                                <button type="button" class="btn btn-transparent flex-20" @click="setGoalPrd(6)">+6개월</button>
                                <button type="button" class="btn btn-transparent flex-20" @click="setGoalPrd(12)">+12개월</button>
                                <button type="button" class="btn btn-navy flex-20" @click="setGoalPrd(0)">정정</button>
                            </div>
                            <div class="form-group" style="justify-content: left">
                                <label>적용금리 (%):</label>
                                <input class="form-control" type="text" id="aply_rate" v-model="info.aply_rate" />
                            </div>
                            <div class="form-group" style="justify-content: left">
                                <label>이자과세:</label>
								<select class="form-control" id="int_tax_ty_cd" v-model="info.int_tax_ty_cd" disabled>
									<option value="1">일반과세 (15.4%)</option>
									<option value="2">세금우대 (9.5%)</option>
									<option value="3">비과세</option>
								</select>
                            </div>
                        </div>
                    </div>
                    
					<div class="dt-buttons" style="padding-top: 15px;">
						<input id="external" type="radio" v-model="info.dsg_ty_cd" value="1">
						<label class="tab_item" for="external">정상설계</label>
						<input id="internal" type="radio" v-model="info.dsg_ty_cd"  value="0" checked>
						<label class="tab_item" for="internal">간편설계</label>
					</div>
					<div class="dataTables_filter">
						<button type="button" class="btn btn-red btn-small" @click="prcCalc()">
							이자계산
						</button>
						<button type="button" class="btn btn-orange btn-small" @click="save()">
							설계저장
						</button>
					</div>
					
<!--                     <div class="button-top flex-column flex-gap-10"> -->
<!-- 	                    <button type="button" class="btn btn-red" @click="prcCalc()">이자계산</button> -->
<!-- 	                    <button type="button" class="btn btn-blue" @click="save()">설계저장</button> -->
<!-- 					</div> -->
					
                    <ul class="nav">
                        <li class="nav-tab active">계산결과</li>
                    </ul>
                    <div class="right-bottom flex-100">
                        <form class="form flex-column" method="POST" action="#">
	                        <table>
	                        	<tr>
	                        		<td class="center" style="width: 35%; vertical-align: top;">
	                        			<div class="form-wrapper flex flex-wrap flex-gap-10">
			                                <div class="form-group">
			                                    <label>불입금액합계:</label>
			                                    <input class="form-control" id="tot_dpst_amt" v-model="info.tot_dpst_amt" disabled />
			                                </div>
			                                <div class="form-group">
			                                    <label>세전이자:</label>
			                                    <input class="form-control" id="tot_dpst_int" v-model="info.tot_dpst_int" disabled />
			                                </div>
			                                <div class="form-group">
			                                    <label>세전수령액:</label>
			                                    <input class="form-control" id="bfo_rcve_amt" v-model="info.bfo_rcve_amt" disabled />
			                                </div>
			                                <div class="form-group">
			                                    <label>이자과세금:</label>
			                                    <input class="form-control" id="int_tax_amt" v-model="info.int_tax_amt" disabled />
			                                </div>
			                                <div class="form-group">
			                                    <label>세후수령액:</label>
			                                    <input class="form-control" id="atx_rcve_amt" v-model="info.atx_rcve_amt" disabled />
			                                </div>
			                            </div>	
			                            
			                            <div class="panel-heading">
											<div class="panel-title">계산결과 CHART</div>
										</div>
										<div id="chart" class="bottom-right-bottom flex-100"></div>
	                        		</td>
	                        		<td class="center" style="width: 5%;">
	                        		</td>
	                        		<td class="center" style="width: 60%; vertical-align: top;">
			                            <table class="table table-bordered datatable dataTable" id="grid_app">
											<thead>
												<tr class="replace-inputs">
													<th style="width: 10%;" class="center">회차</th>
													<th style="width: 23%;" class="center">회차불입금액</th>
													<th style="width: 23%;" class="center">누적불입금액</th>
													<th style="width: 21%;" class="center">회차이자</th>
													<th style="width: 23%;" class="center">회차원리금</th>
												</tr>
											</thead>
											<tbody id="grid_tbody">
											</tbody>
										</table>
	                        		</td>
	                        	</tr>
	                        </table>
                        </form>
                    </div>
                </div>
            </div>
			</template>
			</div>
		</div>
		
		<br />
		
		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp" flush="false"/>
		
	</div>
</div>

<!-- 상품팝업 -->
<div class="modal fade" id="pop_prod">
<template>
	<div class="modal-dialog" style="width: 500px;">
		<div class="modal-content">
			<div class="modal-body">
				<div class="dataTables_wrapper">					
					<div class="dt-buttons">
						<div>
							<label>코드:</label>
							<input type="search" id="pop_prod_cd" style="width: 80px;" v-model="pop_prod_cd">
							<label>코드명:</label>
							<input type="search" id="pop_prod_nm" style="width: 200px;" v-model="pop_prod_nm">
							<button type="button" class="btn btn-red" style="margin-left: 5px;" @click="getList">
								검색
							</button>
						</div>
					</div>
				</div>
				<div style="height: 400px;overflow: auto;" class="dataTables_wrapper">		
					<table class="table table-bordered datatable dataTable">
						<thead style="position: sticky;top: 0px;">
							<tr>
								<th class="center" style="width: 25%;">상품코드</th>
								<th class="center" style="width: 50%;">상품명</th>
								<th class="center" style="width: 25%;">가입대상</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in dataList" @click="selProd(item.prod_cd)" style="cursor: pointer;">
								<td class="center">{{item.prod_cd}}</td>
								<td class="left">{{item.prod_nm}}</td>
								<td class="left">{{item.sbstg_ty_cd_nm}}</td>
							</tr>
						</tbody>
					</table>	
				</div>				
			</div>
		</div>
	</div>
</template>
</div>

<!-- 고객팝업 -->
<div class="modal fade" id="pop_cust">
<template>
	<div class="modal-dialog" style="width: 500px;">
		<div class="modal-content">
			<div class="modal-body">
				<div class="dataTables_wrapper">					
					<div class="dt-buttons">
						<div>
							<label>고객명:</label>
							<input type="search" id="pop_cust_nm" style="width: 250px;" v-model="pop_cust_nm">
							<button type="button" class="btn btn-red" style="margin-left: 5px;" @click="getList">
								검색
							</button>
						</div>
					</div>
				</div>
				<div style="height: 400px;overflow: auto;" class="dataTables_wrapper">		
					<table class="table table-bordered datatable dataTable">
						<thead style="position: sticky;top: 0px;">
							<tr>
								<th class="center" style="width: 25%;">고객명</th>
								<th class="center" style="width: 20%;">생년월일</th>
								<th class="center" style="width: 30%;">핸드폰번호</th>
								<th class="center" style="width: 25%;">담당자</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in dataList" @click="selCust(item)" style="cursor: pointer;">
								<td class="center">{{item.cust_nm}}</td>
								<td class="center">{{item.rrno}}</td>
								<td class="center">{{item.cust_mbl_telno}}</td>
								<td class="center">{{item.pic_nm}}</td>
							</tr>
						</tbody>
					</table>
					<div class="dataTables_paginate paging_simple_numbers" id="div_paginate">
					</div>  
				</div>				
			</div>
		</div>
	</div>
</template>
</div>

</body>
<script>
var vueapp = new Vue({
	el : "#vueapp",
	data : {
		info : {
			dsg_ty_cd : "${dsg_ty_cd}",
			prod_ds_sn : "${prod_ds_sn}",
			rrno : "${rrno}",
			prod_cd : "${prod_cd}",
			prod_nm : "${prod_nm}",
			goal_prd : "${goal_prd}",
			circle_acml_amt : "${circle_acml_amt}",
			tot_dpst_amt : "${tot_dpst_amt}",
			tot_dpst_int : "${tot_dpst_int}",
			int_tax_amt : "${int_tax_amt}",
			bfo_rcve_amt : "${bfo_rcve_amt}",
			atx_rcve_amt : "${atx_rcve_amt}",
		},
		custInfo : {
			cust_mbl_telno : "",
			cust_nm : "",
			rrno : "",
			cust_eml_addr : "",
			co_telno : "",
			occp_ty_cd_nm : "",
			cust_addr : "",
			pic_nm : "",
			dept_nm : "",
			jbps_ty_cd_nm : "",
			pic_mbl_telno : "",
			tsk_dtl_cn : "",
		},
	},
	mounted : function(){
		if(!cf_isEmpty(this.info.prod_cd)){
			this.getInfo();
		}
	},
	methods : {
		getInfo : function(){
			cf_ajax("/prod_calc/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
		},
		save : function(){
			
			if(this.info.dsg_ty_cd != "1"){
				alert("정상설계만 저장할 수 있습니다.");
				return;
			}else if(cf_isEmpty(this.info.atx_rcve_amt) || this.info.atx_rcve_amt == 0){
				alert("이자계산 후 저장할 수 있습니다.");
				return;
			}else if(cf_isEmpty(this.custInfo.cust_nm)){
				alert("고객정보를 선택하세요.");
				return;
			}
			
			if(!confirm("저장하시겠습니까?")) return;
			
			cf_ajax("/prod_calc/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			alert("저장되었습니다.");
		},
		getCustInfo : function(){
			var params = {
				cust_mbl_telno : this.custInfo.cust_mbl_telno,
			}
			cf_ajax("/custMng/getCustCardInfo", params, this.getCustInfoCB);
		},
		getCustInfoCB : function(data){
			this.custInfo = data;
		},
		setCircleAcmlAmt : function(nAmt){
			if(nAmt == 0) {
				this.info.circle_acml_amt = 0;
			}else {
				this.info.circle_acml_amt += nAmt*10000;
			}
		},
		setGoalPrd : function(nPrd){
			if(nPrd == 0) {
				this.info.goal_prd = 0;
			}else {
				this.info.goal_prd += nPrd;
			}
		},
		popupProd : function(){
			$("#pop_prod").modal("show");
		},
		popupCust : function(){
			$("#pop_cust").modal("show");
		},
		prcCalc : function(){
			
			if(cf_isEmpty(this.info.prod_cd)){
				alert("상품을 선택하세요.");
				return;
			}else if(cf_isEmpty(this.info.circle_acml_amt) || this.info.circle_acml_amt == 0){
				alert("불입금액을 입력하세요.");
				return;
			}else if(cf_isEmpty(this.info.goal_prd) || this.info.goal_prd == 0){
				alert("불입기간을 입력하세요.");
				return;
			}else if(cf_isEmpty(this.info.aply_rate) || this.info.aply_rate == 0){
				alert("적용금리를 입력하세요.");
				return;
			}
			
			var nRvcy		= this.info.pay_ty_cd; // 납입주기
			var nPymAmt		= this.info.circle_acml_amt; // 불입금액
			var nPrd		= this.info.goal_prd; // 불입기간
			var nApplItr	= this.info.aply_rate; // 적용금리
				nApplItr	= nApplItr / 12 / 100;
			var nScIntLvy		= this.info.pay_ty_cd; // 이자과세
			
			var nScPayAmt	= 0;	// 붙임금액
			var nAcmPayAmt	= 0;	// 누적불입금
			var nScPniAmt	= 0;	// 말기준원리금
			var nScInt	= 0;	// 말기준이자
			var nAcmInt	= 0;	// 최종이자
			var nTax	= 0;	// 이자과세
			
			var html = '';
			for(var i=1; i<=nPrd; i++) {
				
				if(nRvcy == 1) {
					nScPayAmt = nPymAmt;
				} else if(i % nRvcy == 1) {
					nScPayAmt = nPymAmt * nRvcy;
				} else {
					nAmt = 0;
				}
				
				nAcmPayAmt += nScPayAmt;
				nScInt = nAcmPayAmt * (nApplItr / 12 / 100);
				nScPniAmt = nScPniAmt + nScPayAmt + nScInt;
				nAcmInt += nScInt;
				
				html += '<tr>';
				html += '<td class="right" style="text-align: right;">' + i + '</td>';
				html += '<td class="right" style="text-align: right;">' + numberFormat(Math.round(nScPayAmt)) + '</td>';
				html += '<td class="right" style="text-align: right;">' + numberFormat(Math.round(nAcmPayAmt)) + '</td>';
				html += '<td class="right" style="text-align: right;">' + numberFormat(Math.round(nScInt)) + '</td>';
				html += '<td class="right" style="text-align: right;">' + numberFormat(Math.round(nScPniAmt)) + '</td>';
				html += '</tr>';
			}
			
			if(this.info.int_tax_ty_cd == "1") {		// 일반과세
				nTax = Math.round(nAcmInt * 15.4 / 100);
			} else if(this.info.int_tax_ty_cd == "2") {	// 세금우대
				nTax = Math.round(nAcmInt * 9.5 / 100);
			}else {										// 비과세
				nTax = 0;
			}
			nScPniAmt = Math.round(nScPniAmt);
			
			this.info.tot_dpst_amt = nScPayAmt;
			this.info.tot_dpst_int = nAcmInt;
			this.info.int_tax_amt = nTax;
			this.info.bfo_rcve_amt = nScPniAmt;
			this.info.atx_rcve_amt = nScPniAmt - nTax;
        
			$("#grid_tbody").html(html);
			
			// 차트
			var chart = bb.generate({
                data: {
                    columns: [
                        ["불입금액합계"	, nAcmPayAmt],
                        ["세전이자"	, nAcmInt],
                        ["세전수령액"	, nScPniAmt],
                        ["이자과세금"	, nTax],
                        ["세후수령액"	, nScPniAmt - nTax],
                    ],
                    type: "bar",
                    groups: [
                        []
                    ],
                    order: null
                },
                bindto: "#chart"
            });
			
		},
	}
});

var pop_prod = new Vue({
	el : "#pop_prod",
	data : {
		dataList : [],
		pop_prod_cd : "",
		pop_prod_nm : "",
	},
	mounted : function(){
		//this.getList();
	},
	methods : {
		getList : function(){
			this.dataList = [];
			var params = {
				prod_cd : this.prod_cd,
				prod_nm : this.prod_nm,
			}
			cf_ajax("/prod_mng/getList", params, function(data){
				pop_prod.dataList = data;
			});
		},
		selProd : function(prod_cd){
			
			vueapp.info.prod_cd = prod_cd;
			vueapp.getInfo();
			
			$("#pop_prod").modal("hide");
		},
	},
});

var pop_cust = new Vue({
	el : "#pop_cust",
	data : {
		dataList : [],
		pop_cust_nm  : "",
	},
	mounted : function(){
		//this.getList();
	},
	methods : {
		getList : function(isInit){
			var params = {
				cust_nm : this.pop_cust_nm,
				cust_evt_ty_cd : "",
				dept_nm : "",
				wrt_dt : "",
			}
			cf_ajax("/prod_mng/getCustList", params, function(data){
				pop_cust.dataList = data;
			});
		},
		selCust : function(item){
			vueapp.custInfo.cust_mbl_telno = item.cust_mbl_telno;
			vueapp.getCustInfo();
			
			$("#pop_cust").modal("hide");
		},
	},
});

</script>

<script>
    // Nav 탭 클릭 이벤트 등록
    document.querySelector('.right-top .nav').addEventListener('click', (e) => {
    	e.target.closest('.nav').querySelectorAll('.nav-tab').forEach((elem) => {
            elem.classList.remove('active');
        });
        e.target.classList.add('active');
    });
    
    function numberFormat(num) {
		num = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return num;
	}
</script>
</html>