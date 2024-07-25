<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false"/>
	<!-- Imported styles on this page -->
	<link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">
	<link rel="stylesheet" href="/static_resources/system/js/datatables/prodlist.css">
	<link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">
	<link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">
	<title>관리자시스템</title>
</head>
<body class="page-body">

<div class="page-container"><!-- add class "sidebar-collapsed" to close sidebar by default, "chat-visible" to make chat appear always -->

	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp" flush="false"/>

	<div class="main-content">

		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp" flush="false"/>
		
		<ol class="breadcrumb bc-3">
			<li><a href="#none" onclick="cf_movePage('/system')"><i class="fa fa-home"></i>Home</a></li>
			<li class="active"><strong>사용자 관리</strong></li>
		</ol>
	
		<h2>사용자 목록</h2>
		<br />
		
    <div class="flex-column" id="vueapp">
	<template>
        <div class="form-group-right flex-padding-10 flex-100" style="position: relative;">
            <div style="position: absolute;left: 10px;bottom: 2px;">
                <button type="button" class="btn btn-orange btn-icon icon-left btn-small" @click="gotoDtl()">
                    추가<i class="entypo-plus"></i>
                </button>
                <button type="button" class="btn btn-primary btn-icon icon-left btn-small" @click="excelDn">
                    EXCEL<i class="entypo-download"></i>
                </button>
    
            </div>
            <div>
                <select id="search_nm" v-model="search_nm">
                    <option value="name">사용자명</option>
                    <option value="user_id">아이디</option>
                </select>	
                <input type="search" placeholder="" style="width: 120px;" v-model="search_val" @keyup.enter="getList(true)">
                <button type="button" class="btn btn-blue btn-icon icon-left" style="margin-left: 5px;" @click="getList(true)">
                    검색
                    <i class="entypo-search"></i>
                </button>

            </div>

        </div>
	
	        
	        <table class="table table-bordered datatable dataTable">
	            <thead>
	                <tr class="replace-inputs">
	                    <th style="width: 5%;" class="center">번호</th>
	                    <th style="width: 18%;" class="center sorting" @click="sortList(event.target)" sort_target="name">사용자명</th>
	                    <th style="width: 23%;" class="center sorting" @click="sortList(event.target)" sort_target="jikgub_nm">직책</th>
	                    <th style="width: 18%;" class="center sorting" @click="sortList(event.target)" sort_target="user_id">아이디</th>
	                    <th style="width: 8%;" class="center sorting" @click="sortList(event.target)" sort_target="statusnm">현재상태</th>
	                    <th style="width: 18%;" class="center sorting" @click="sortList(event.target)" sort_target="auth_nm">권한</th>
	                    <th style="width: 10%;" class="center sorting" @click="sortList(event.target)" sort_target="reg_dt">가입일</th>
	                </tr>
	            </thead>
	            <tbody id="tbody_list">
	                <tr v-for="item in dataList"  @click="gotoDtl(item.user_id)" style="cursor: pointer;">
	                    <td class="center">{{item.rownum}}</td>
	                    <td class="center">{{item.name}}</td>
	                    <td class="center">{{item.jikgub_nm}}</td>
	                    <td class="center">{{item.user_id}}</td>
	                    <td class="center">{{item.statusnm}}</td>
	                    <td class="center">{{item.auth_nm}}</td>
	                    <td class="center">{{item.reg_dt_char}}</td>
	                </tr>
	            </tbody>
	        </table>
	        <div class="dataTables_paginate paging_simple_numbers" id="div_paginate">
	        </div>
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
		search_nm : "name",
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

			cf_ajax("/system/user_mng/getList", params, this.getListCB);
		},
		getListCB : function(data){			
			this.dataList = data.list;
			cv_pagingConfig.renderPagenation("system");
		},
		gotoDtl : function(user_id){
			var params = {
					user_id : cf_defaultIfEmpty(user_id, ""),
				}
			cf_movePage("/system/user_mng/dtl", params);
		},
		sortList : function(obj){
			cf_setSortConf(obj, "reg_dt");
			this.getList();
		},
		excelDn : function(){
			
			var configExcelDn = {
					fileName : "사용자목록",
					sheetName : "사용자목록",
					columnsInfo : [
						"user_id|사용자ID|4000",
						"name|이름|4000",
						"jikgub_nm|직급|4000",
						"tdept_nm|부서|15000",
						"email|이메일|7000",
						"auth_nm|권한명|4000",
						"iam_yn|포탈회원여부|3000",
						"statusnm|현재상태|3000",
					],
				}
			
			var params = {
					search_nm : this.search_nm,
					search_val : this.search_val,
				}

			cf_excelDn("/system/user_mng/excelDn", params, configExcelDn);
		},
	},
})
</script>
</html>