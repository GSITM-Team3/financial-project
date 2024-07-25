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
	<link rel="stylesheet" href="/static_resources/system/js/datatables/prodcalc.css">
	
	<!-- Bilboard Chart(https://naver.github.io/billboard.js) -->
	<script src="https://d3js.org/d3.v6.min.js"></script>
	<script src="/static_resources/system/js/datatables/billboard.js"></script>
	<link rel="stylesheet" href="/static_resources/system/js/datatables/billboard.css">
	
	<title>금융계산기</title> 
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
	
		<h2>>상품관리 > 금융계산기</h2>
		<br/>
		
		<div class="row">
			<div id="vueapp" class="right flex-column flex-100">
				<template>
				<div class="right-top flex-100">
					<ul class="nav">
                        <li class="nav-tab active">적금 설계</li>
                        <li class="nav-tab">목돈마련적금 설계</li>
                        <li class="nav-tab">예금 설계</li>
                        <li class="nav-tab">대출 설계</li>
                </ul>
					<div class="column-group flex-column flex-gap-10">
						<div class="form-group flex-gap-10" style="justify-content: left">
							<label class="width-100">상품선택:</label>
							<input class="width-100" id="prod_cd" value="1" v-model="info.prod_cd" disabled/>
							<input class="width-100" id="prod_nm" value = "2" v-model="info.prod_nm" disabled/>
							<button type="button" class="btn" @click="popupProd()">
								<i class="fa fa-search"></i>
							</button>
						</div>
						<div class="form-group flex-gap-10" style="justify-content:left">
							<label class="width-100">납입주기:</label>
							<input type="number" min="0" placeholder="10" class="width-100" id="circle_acml_amt" v-model="info.circle_acml_amt" />
							<button type="button" class="btn btn-transparent flex-10" @click="setCircleAcmlAmt(10)">+10</button>
							<button type="button" class="btn btn-transparent flex-10" @click="setCircleAcmlAmt(50)">+50</button>
							<button type="button" class="btn btn-transparent flex-10" @click="setCircleAcmlAmt(100)">+100</button>
							<button type="button" class="btn btn-navy flex-10" @click="setCircleAcmlAmt(0)">clear</button>
						</div>
						<div class="form-group flex-gap-10" style="justify-content: left">
							<label class="width-100">불입금액 (원):</label>
							<input class="width-100" value="3" min="0" type="number" id="goal_prd" v-model="info.goal_prd" />
							<button type="button" class="btn btn-transparent flex-10" @click="setGoalPrd(3)">+3</button>
							<button type="button" class="btn btn-transparent flex-10" @click="setGoalPrd(6)">+6</button>
							<button type="button" class="btn btn-transparent flex-10" @click="setGoalPrd(12)">+12</button>
							<button type="button" class="btn btn-navy flex-10" @click="setGoalPrd(0)">clear</button>
						</div>
						<div class="form-group flex-gap-10" style="justify-content: left">
							<label class="width-100">적용금리 (%):</label>
							<input class="width-100" type="number" id="aply_rate" value="3" placeholder="0.035"  min ="0"v-model="info.aply_rate" />
						</div>
						<div class="form-group" style="justify-content: left">
							<label class="width-100">이자과세:</label>
							<select class="width-100" id="pay_ty_cd" v-model="info.pay_ty_cd">
                                <option value="1">일반과세 (15.4%)</option>
                                <option value="2">세금우대 (9.5%)</option>
                                <option value="3">비과세</option>
                        </select>
						</div>
						
						<div class="form-group flex-gap-10" style="justify-content: left;position: relative;">
							<label class="width-100">today:</label>
							<input type="date" value="2024-01-01" class="width-200" id="date" v-model="info.date" disabled />
							<button type="button" style="position:absolute;right: 0;bottom:10px;height: 50px;" class="btn btn-red" @click="prcCalc()">이자계산</button>
						</div>
					</div>
				</div>
				<div class="right-middle">
					<ul class="nav">
						<li class="nav-tab active">계산결과</li>
					</ul>		
				</div>
				<div class="right-bottom flex-100 flex">
					<div class="column-group  data-display ">
						<div class="column-group flex-column flex-33 flex-gap-10" style="margin-bottom:30px ;" >
							<div class="form-group">
								<label class="width-100">원금합계:</label>
								<input class="form-control" id="tot_dpst_amt" v-model="info.tot_dpst_amt" disabled />
							</div>
							<div class="form-group gap">
								<label class="width-100">세전이자:</label>
								<input class="form-control" id="tot_dpst_int" v-model="info.tot_dpst_int" disabled />
							</div>
							<div class="form-group">
								<label class="width-100">이자과세:</label>
								<input class="form-control" id="int_tax_amt" v-model="info.int_tax_amt" disabled />
							</div>
							<div class="form-group">
								<label class="width-100">세후수령액:</label>
								<input class="form-control" id="atx_rcve_amt" v-model="info.atx_rcve_amt" disabled />
							</div>
			
						</div>
					</div>	
					<div class="column-group flex-33">
						<div style="top: -40px; right: 10px; position: absolute;">
							<button type="button"  class="btn btn-blue" @click="save()">설계저장</button>
							<button type="button"  class="btn btn-blue" @click="close()">close</button>
						</div>
						<div style="border: 1px solid #CCCCCC;">
							<table class="table table-bordered datatable dataTable" id="grid_app">
								<thead>
									<tr class="replace-inputs">
                                        <th style="width: 10%;" class="center">회차</th>
                                        <th style="width: 23%;" class="center">붙임금액</th>
                                        <th style="width: 23%;" class="center">총불입금</th>
                                        <th style="width: 21%;" class="center">말기준이자</th>
                                        <th style="width: 23%;" class="center">말기준원리금</th>
                        </tr>
								</thead>
								<tbody id="grid_tbody"></tbody>
							</table>			
	
						</div>
					</div>
					<div class="flex-33">
						<div class="chart-display" id="chart">
						</div>

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

<!-- 占싯억옙 -->
<div class="modal fade" id="pop_code">
<template>
	<div class="modal-dialog" style="width: 500px;">
		<div class="modal-content">
			<div class="modal-body">
				<div class="dataTables_wrapper">					
					<div class="dt-buttons">
						<div>
							<input type="search" id="prod_cd" style="width: 100px;" v-model="prod_cd">
							<input type="search" id="prod_nm" style="width: 250px;" v-model="prod_nm">
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
								<th class="center" style="width: 15%;">상품코드</th>
								<th class="center" style="width: 55%;">상품명</th>
								<th class="center" style="width: 30%;">가입대상</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in dataList" @click="selItem(item.prod_cd)" style="cursor: pointer;">
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

</body>
<script>
var vueapp = new Vue({
	el : "#vueapp",
	data : {
		info : {
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
			
			if(!confirm("占쏙옙占쏙옙占싹시겠쏙옙占싹깍옙?")) return;
			
			cf_ajax("/prod_calc/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			alert("占쏙옙占쏙옙퓸占쏙옙占쏙옙求占�.");
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
			$("#pop_code").modal("show");
		},
		prcCalc : function(){
			
			var nRvcy		= this.info.pay_ty_cd; // 납입주기
			var nPymAmt		= this.info.circle_acml_amt; // 불입금액
			var nRvpd		= this.info.goal_prd; // 불입기간
			var nApplItr	= this.info.aply_rate; // 적용금리
			var nIntLvy		= this.info.pay_ty_cd; // 이자과세
			
			var nAmt1	= 0;	// 붙임금액
			var nAmt2	= 0;	// 총불입금
			var nAmt3	= 0;	// 말기준원리금
			var nInt	= 0;	// 말기준이자
			var nTotInt	= 0;	// 최종이자
			var nTax	= 0;	// 이자과세
			
			var html = '';
			for(var i=1; i<=nRvpd; i++) {
				
				nAmt1 = nPymAmt;
				
				nAmt2 += nAmt1;
				nInt = nAmt2 * (nApplItr / 12 / 100);
				nAmt3 = nAmt3 + nAmt1 + nInt;
				nTotInt += nInt;
				
				html += '<tr>';
				html += '<td class="right" style="text-align: right;">' + i + '</td>';
				html += '<td class="right" style="text-align: right;">' + numberFormat(Math.round(nAmt1)) + '</td>';
				html += '<td class="right" style="text-align: right;">' + numberFormat(Math.round(nAmt2)) + '</td>';
				html += '<td class="right" style="text-align: right;">' + numberFormat(Math.round(nInt)) + '</td>';
				html += '<td class="right" style="text-align: right;">' + numberFormat(Math.round(nAmt3)) + '</td>';
				html += '</tr>';
			}
			
			if(this.info.pay_ty_cd == "1") {		// 일반과세
				nTax = Math.round(nTotInt * 15.4 / 100);
			} else if(this.info.pay_ty_cd == "2") {	// 세금우대
				nTax = Math.round(nTotInt * 1.4 / 100);
			}else {										// 비과세
				nTax = 0;
			}
			nAmt3 = Math.round(nAmt3);
			
			this.info.tot_dpst_amt = nAmt2;
			this.info.tot_dpst_int = nTotInt;
			this.info.int_tax_amt = nTax;
			this.info.bfo_rcve_amt = nAmt3;
			this.info.atx_rcve_amt = nAmt3 - nTax;
			$("#grid_tbody").html(html);
			
			// 占쏙옙트
			var chart = bb.generate({
                data: {
                    columns: [
                        ["占쏙옙占쏙옙占쌌곤옙"	, nAmt2],
                        ["占쏙옙占쏙옙占쏙옙占심억옙"	, nTotInt],
                        ["占쏙옙占쌘곤옙占쏙옙"	, nTax],
                        ["占쏙옙占식쇽옙占심억옙"	, nAmt3 - nTax],
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

var pop_code = new Vue({
	el : "#pop_code",
	data : {
		dataList : [],
		prod_cd : "",
	},
	mounted : function(){
		this.getList();
	},
	methods : {
		getList : function(){
			this.dataList = [];
			var params = {
				prod_cd : this.prod_cd,
				prod_nm : this.prod_nm,
			}
			
			cf_ajax("/prod_mng/getList", params, function(data){
				pop_code.dataList = data;
			});
		},
		selItem : function(prod_cd){
			
			vueapp.info.prod_cd = prod_cd;
			vueapp.getInfo();
			
			$("#pop_code").modal("hide");
		},
	},
});

</script>

<script>
    //  Nav 탭 클릭 이벤트 등록
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