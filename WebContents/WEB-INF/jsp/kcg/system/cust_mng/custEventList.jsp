<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false"/>
	<!-- Imported styles on this page -->
	<link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">
	<link rel="stylesheet" href="/static_resources/system/js/datatables/proddtl.css">
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
			<li class="active"><strong>고객이벤트 조회</strong></li>
		</ol>
	
		<h2>고객이벤트 목록</h2>
		<br/>
        <div class="flex-column flex-gap-10" id="vueapp">
        <template>   
            <div class="flex flex-100">
                <div class="flex-wrap flex-80 flex flex-gap-10 flex-padding-10">   
                    <div class="form-group flex-40">
                        <label class="form-control">고객명:</label>
                        <input class="form-control" v-model="cust_nm" value="">                    
                    </div>
                    <div class="form-group flex-40">
                        <label class="form-control">고객이벤트:</label> 
                        <select class="form-control" id="search_nm" v-model="cust_evt_ty_cd" @change="getList(true)">
                            <option value="10">Birthday</option>
                            <!-- <option value="11">상령일</option>
                            <option value="12">입사기념일</option> -->
                            <option value="21">상담약속</option>
                            <option value="31">적금만기</option>
                            <option value="32">예금만기</option>
                        </select> 
                    </div>
                    <div class="form-group flex-40">
                        <label class="form-control">관리부서:</label>
                        <input type="text" class="form-control" v-model="dept_nm">
                    </div> 
                    <div class="form-group flex-40">
                        <label class="form-control">작성일자 :</label>
                        <input type="text" class="form-control" v-model="wrt_dt">
                    </div>
                </div>  
                <div class="flex-wrap flex-20 flex flex-center flex-gap-10 flex-padding-10">   
                    <div class="form-group" style="width:100%;">
                        <button 
                        type="button" class="btn btn-blue btn-icon icon-left form-control " v-model="search_val"  @click="getList(true)">
                            조건검색
                            <i class="entypo-search"></i>
                        </button>
        
                    </div>
                </div>
            </div>       
            <div class="flex flex-100 flex-padding-10 flex-gap-10" style="justify-content:flex-end;border: 1px solid #999999;">
                <button type="button" class="btn btn-blue btn-icon icon-left" style="margin-left: 5px;" @click="popCustmnglistPrint">
                    인쇄
                 <i class="entypo-print"></i>
                </button>					          
    
            </div>
            <table class="table table-bordered datatable dataTable" id="grid_app" style="border: 1px solid #999999;">
                <thead>
                    <tr class="replace-inputs">
                        <th style="width: 5%;" class="center"><input type="checkbox" id="allCheck" @click="all_check(event.target)" style="cursor: pointer;"></th>
                        <th style="width: 20%;" class="center" >성명</th>
                        <th style="width: 15%;" class="center" >생년월일</th>
                        <th style="width: 15%;" class="center" >핸드폰번호</th>
                        <th style="width: 15%;" class="center" >관리담당자</th>
                        <th style="width: 15%;" class="center">고객이벤트</th>
                        <th style="width: 15%;" class="center">기념일</th>
                    </tr>
                </thead>  
                <tbody>       
                    <tr v-for="item in dataList" @dblclick="gotoDtl(item.cust_mbl_telno)" style="cursor: pointer;">
                        <td class="center"><input type="checkbox" :data-idx="item.cust_nm" name="is_check" @click="onCheck" style="cursor: pointer;"></td>
                        <td class="center">{{item.cust_nm}}</td>
                        <td class="center">{{item.rrno}}</td>
                        <td class="center">{{item.cust_mbl_telno}}</td>
                        <td class="center">{{item.pic_nm}}</td>
                        <td class="center">{{item.cust_evt_ty_cd_nm}}</td> 
                        <td class="center">{{item.avday_ymd}}</td>  
                    </tr>
                </tbody>  
            </table> 
		                
	
 
			<div class="dataTables_paginate paging_simple_numbers" id="div_paginate">
			</div> 
<!-- 			<div class="flex flex-100 flex-padding-10 flex-gap-10" -->
<!-- 				style="justify-content: flex-end; border: 1px solid #999999;"> -->
<!-- 				<button type="button" class="btn btn-blue btn-icon btn-small" -->
<!-- 					@click="close()"> -->
<!-- 					close -->
<!-- 				</button> -->
<!-- 			</div> -->
			
		</template> 
		</div>
		
		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp" flush="false"/>
	</div>
</div>    

<!-- 고객기본정보조회 팝업 -->
<div class="modal fade" id="pop_cust_info">
<template>
	<div class="modal-dialog" style="width: 80%;">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="btn_popClose">&times;</button>
				<h4 class="modal-title" id="modify_nm">고객기본정보</h4>
			</div>
			<div class="modal-body">
                <div class="panel-body" style="display: flex;border: 1px solid #FF0000;width: 100%;">			
                    <div class="left-panel" style="width: 50%;">
                        <div class="form-group">
                            <label for="err_eng_nm" class="fix-width-33">작성일자:</label>
                            <input type="text" class="form-control" id="wrt_dt" v-model="info.wrt_dt">
                        </div>
      
                        <div class="form-group">
                            <label for="err_eng_nm" class="fix-width-33">성명:</label>
                            <input type="text" class="form-control" id="cust_nm" v-model="info.cust_nm">
                        </div>
    
    
                        <div class="form-group">
                            <label for="err_eng_nm" class="fix-width-33">실명번호:</label>
                            <input type="text" class="form-control" id="rrno" v-model="info.rrno">
                        </div>
      
    
                        <div class="form-group">
                            <label for="err_eng_nm" class="fix-width-33">E-mail:</label>
                            <input type="text" class="form-control" id="cust_eml_addr" v-model="info.cust_eml_addr">
                        </div>
      
                        <div class="form-group">
                            <label for="err_eng_nm" class="fix-width-33">전화번호:</label>
                            <input type="text" class="form-control" id="co_telno" v-model="info.co_telno">
                        </div>
    
                        <div class="form-group">
                            <label for="err_eng_nm" class="fix-width-33">핸드폰번호:</label>
                            <input type="text" class="form-control" id="cust_mbl_telno" v-model="info.cust_mbl_telno">
                        </div>
    
                        <div class="form-group">
                            <label for="err_eng_nm" class="fix-width-33">직업:</label>
                            <input type="text" class="form-control" id="occp_ty_cd_nm" v-model="info.occp_ty_cd_nm">
                        </div>
      
                        <div class="form-group">
                            <label for="err_eng_nm" class="fix-width-33">주소:</label>
                            <input type="text" class="form-control" id="cust_addr" v-model="info.cust_addr">
                        </div>
      
                    </div>
                    <div class="right-panel"  style="width: 50%;">
                        <div class="form-group">
                            <label for="err_eng_nm">상담내역:</label>
                        </div>	
                    <div>
                        <textarea  id="tsk_dtl_cn" v-model="info.tsk_dtl_cn"style="width:100%;" ></textarea>               
                    </div>
                    </div>
                </div>          
    
			</div>
			<div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
         </div>

		</div>
	</div>
</template>
</div>
<!--// 고객기본정보조회 팝업  -->

<!-- 고객이벤트출력 팝업 -->
<div class="modal fade" id="pop_cust_mnglist_print">
<template>
	<div  class="modal-dialog" style="width: 80%;">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="btn_popClose">&times;</button>
				<h4 class="modal-title" id="modify_nm">고객이벤트목록 출력관리</h4>
			</div>
			<div class="modal-body">
				<form class="form-horizontal form-groups-bordered">
				<div >
					[고객이벤트목록] 를(을) 출력하시겠습니까?<br>
					※고객정보는 개인정보관리 대상이므로 유의하셔야 합니다.
				</div>
				<div class="form-group">
					<div class="col-sm-10">
					출력인원 : {{printInfo.custCount}}명
					</div>
				</div>
			    <div class="form-group"> 
					<table class="table datatable dataTable">	
						<thead>
							<tr class="replace-inputs">
								<th style="width: 20%;" class="center" >성명</th>
								<th style="width: 15%;" class="center" >생년월일</th>
								<th style="width: 15%;" class="center" >핸드폰번호</th>
								<th style="width: 15%;" class="center" >관리담당자</th>
								<th style="width: 15%;" class="center">고객이벤트</th>
								<th style="width: 15%;" class="center">기념일</th>
							</tr>
						</thead>						
						<tbody>   
							<tr v-for="item in printInfo.custList">										
								<td class="center">{{item.cust_nm}}</td>
								<td class="center">{{item.rrno}}</td>
								<td class="center">{{item.cust_mbl_telno}}</td>
								<td class="center">{{item.pic_nm}}</td>
								<td class="center">{{item.cust_evt_ty_cd_nm}}</td> 
								<td class="center">{{item.avday_ymd}}</td>  
							</tr>									
						</tbody>  
					</table>
				</div>   
				
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" @click="print" >인쇄</button>
       			<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
	<div id="cust_mnglist_printArea" style="height:0px;display:none;"> 
		<table class="table datatable dataTable">	
			<thead> 
				<tr class="replace-inputs">
					<th style="width: 20%;" class="center" >성명</th>
					<th style="width: 15%;" class="center" >생년월일</th>
					<th style="width: 15%;" class="center" >핸드폰번호</th>
					<th style="width: 15%;" class="center" >관리담당자</th>
					<th style="width: 15%;" class="center">고객이벤트</th>
					<th style="width: 15%;" class="center">기념일</th>
				</tr> 
			</thead>						  
			<tbody>    
				<tr v-for="item in printInfo.custList">										
					<td class="center">{{item.cust_nm}}</td>
					<td class="center">{{item.rrno}}</td>
					<td class="center">{{item.cust_mbl_telno}}</td>
					<td class="center">{{item.pic_nm}}</td>
					<td class="center">{{item.cust_evt_ty_cd_nm}}</td> 
					<td class="center">{{item.avday_ymd}}</td>  
				</tr>									
			</tbody>  
		</table>
		
	</div>
</template>
</div>
<!--// 고객이벤트출력 팝업  -->
</body>
<script>
var vueapp = new Vue({
	el : "#vueapp",
	data : {
		dataList : [],
		search_nm : "",
		cust_evt_ty_cd : "",
		dept_nm : "",
		cust_nm : "",
		wrt_dt  : "",
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
	 		this.cust_evt_ty_cd = params.cust_evt_ty_cd;
	 		this.dept_nm = params.dept_nm;
	 		this.cust_nm = params.cust_nm;
	 		this.wrt_dt = params.wrt_dt;
	 		this.search_val = params.search_val;

	 		this.getList(true);
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
				cv_pagingConfig.orders = [{target : "AVDAY_YMD", isAsc : false}];
			}
			
			var params = {
					search_nm : this.search_nm,
					search_val : this.search_val,
					cust_evt_ty_cd : this.cust_evt_ty_cd,
					dept_nm : this.dept_nm,
					cust_nm : this.cust_nm,
					wrt_dt : this.wrt_dt,
				}
			
			cv_sessionStorage
				.setItem('pagingConfig', cv_pagingConfig)
				.setItem('params', params);

			cf_ajax("/custMng/getList", params, this.getListCB);
		},
		getListAll : function(isInit){

			cv_pagingConfig.func = this.getList;
			if(isInit === true){
				cv_pagingConfig.pageNo = 1;
				cv_pagingConfig.orders = [{target : "AVDAY_YMD", isAsc : false}];
			}
			
			var params = {
					search_nm : this.search_nm,
					search_val : this.search_val,
				}
			
			cv_sessionStorage
				.setItem('pagingConfig', cv_pagingConfig)
				.setItem('params', params);

			cf_ajax("/custMng/getListAll", params, this.getListCB);
		},
		getListCB : function(data){			
			//console.log(data);
			this.dataList = data.list;
			cv_pagingConfig.renderPagenation("system");
		},
		gotoDtl : function(cust_mbl_telno){	
			console.log(cust_mbl_telno);
			pop_cust_info.init(cust_mbl_telno);
			$('#pop_cust_info').modal('show');
		},
		sortList : function(obj){
			cf_setSortConf(obj, "AVDAY_YMD");
			this.getList();
		},
		sortListAll : function(obj){
			cf_setSortConf(obj, "AVDAY_YMD");
			this.getListAll();
		},
		all_check : function(obj){
			$('[name=is_check]').prop('checked',obj.checked);
		},
		onCheck : function(){
			$("#allCheck").prop('checked',
					$("[name=is_check]:checked").length === $("[name=is_check]").length
			);
		},  
		popCustmnglistPrint : function(){			
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
				dateCopyList.push(vueapp.dataList.getElementFirst("cust_nm", idx));
			});
//             for (var i = 0; i < chkedList.length; i++) {
//             	dateCopyList.push(vueapp.dataList[idx]);	
// 		    	alert(+ dateCopyList);
// 		      }	
			
			console.log(dateCopyList);		
			
			//출력팝업 띄우기
			pop_cust_mnglist_print.init(dateCopyList);
			$('#pop_cust_mnglist_print').modal('show');
			
		},
	},
});

var pop_cust_info = new Vue({
	el : "#pop_cust_info",
	data : {
		info : {
		cust_mbl_telno : "${cust_mbl_telno}",
		wrt_dt : "",
		cust_nm : "",
		rrno : "",
		cust_eml_addr : "",
		co_telno : "",
		occp_ty_cd_nm : "",
		cust_addr : "",
		tsk_dtl_cn : "",
		}
	},
	methods : {
		init : function(cust_mbl_telno){
			this.initInfo();
			this.info.cust_mbl_telno = cust_mbl_telno;
			if(!cf_isEmpty(this.info.cust_mbl_telno)){
				this.getInfo();
			}
		},
		initInfo : function(){
			this.info = {
				cust_mbl_telno : "",
				wrt_dt : "",
				cust_nm : "",
				rrno : "",
				cust_eml_addr : "",
				co_telno : "",
				occp_ty_cd_nm : "",
				cust_addr : "",
				tsk_dtl_cn : "",
			}
		},
		getInfo : function(){
			var params = {
					cust_mbl_telno : this.info.cust_mbl_telno,
				}
			cf_ajax("/custMng/getInfo", params, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
		},
	},
});

var pop_cust_mnglist_print = new Vue({
	el : "#pop_cust_mnglist_print",
	data : {
		printInfo : {
			custCount : 0,
			custList : [],
		}
	},
	methods : {
		init : function(dateCopyList){
			this.initInfo(dateCopyList);
		},
		initInfo : function(dateCopyList){
			this.printInfo = {	
				custCount : dateCopyList.length,
				custList : dateCopyList,
			}
		},
		print : function(){
			const printArea = document.getElementById('cust_mnglist_printArea').innerHTML;
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
			  
			 win.document.write('<link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">');
			 win.document.write('<link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">');
			 win.document.write('<link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">');
				
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
			
			
			
			
			
// 			const printArea = document.getElementById('cust_mnglist_printArea').innerHTML;
// 			console.log(printArea);
			
// 			 win = window.open(); 
// 			 self.focus();  
// 			 win.document.open();
// 			   
// 			 /*
// 			 1. div 안의 모든 태그들을 innerHTML을 사용하여 매개변수로 받는다.
// 			 2. window.open() 을 사용하여 새 팝업창을 띄운다.
// 			 3. 열린 새 팝업창에 기본 <html><head><body>를 추가한다.
// 			 4. <body> 안에 매개변수로 받은 printArea를 추가한다.
// 			 5. window.print() 로 인쇄
// 			 6. 인쇄 확인이 되면 팝업창은 자동으로 window.close()를 호출하여 닫힘
// 			 */
// 			 win.document.write('<html><head>');
			  
// 			 /*
// 			 win.document.write('<link rel="icon" href="/static_resources/system/images/favicon.ico">');
// 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/js/jquery-ui/css/no-theme/jquery-ui-1.10.3.custom.min.css">');
// 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/css/font-icons/entypo/css/entypo.css">');
// 			 win.document.write('<link rel="stylesheet" href="/static_resources/lib/fonts/font-awesome-4.7.0/css/font-awesome.css">');
// 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/css/bootstrap.css">');
// 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/css/neon-core.css">');
// 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/css/neon-theme.css">');
// 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/css/neon-forms.css">');
// 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/css/custom.css">');
// 			 */
			 
// 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">');
// 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">');
// 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">');
				
// 			 win.document.write('<title></title><style>');	
// 			 win.document.write('td.center {text-align: center;}');
// 			 win.document.write('th.center {text-align: center;}');
// 			 win.document.write('body {font-size: 14px;}');
// 			 //win.document.write('body, td {font-falmily: Verdana; font-size: 10pt;}');
// 			 win.document.write('</style></head><body>');
// 			 win.document.write(printArea);
// 			 win.document.write('</body></html>');
// 			 win.document.close();  
// 			 win.print();
// 			 win.close();

		},        
	},
});
</script>
</html>