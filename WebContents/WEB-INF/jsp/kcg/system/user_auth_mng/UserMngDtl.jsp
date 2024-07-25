<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false"/>
	<!-- Imported styles on this page -->
	<link rel="stylesheet" href="/static_resources/system/js/datatables/proddtl.css">
	
	<title>관리자시스템</title>
</head>
<body class="page-body">

<div class="page-container">

	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp" flush="false"/>

	<div class="main-content">

		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp" flush="false"/>
		
		<ol class="breadcrumb bc-3">
			<li><a href="#none" onclick="cf_movePage('/system')"><i class="fa fa-home"></i>Home</a></li>
			<li class="active"><strong>사용자 관리</strong></li>
		</ol>
	
		<h2>사용자 상세</h2>
		<br />
		
		<div class="flex-wrap">
		    <div id="vueapp" style="width: 100%; margin-left: 15px;">
		    <template>
		        <div class="panel-body">
		            <div class="left-panel flex-50">
		                <div class="form-group">
		                    <label id ="user_id">아이디</label>
		
		                    <input class = "form-control" type="text" id="user_id" v-model="info.user_id" :readonly="info.save_mode != 'insert' || is_id_chk">
		
		                    <div class="form-control" id="btn_chk_id_dupl" v-if="info.save_mode == 'insert' && !is_id_chk">
		                        <button class="btn btn-primary" type="button" @click="chk_id_dupl">	
		                            <span>중복체크</span>	
		                        </button>
		                    </div>
		                    <div  class="form-control"  v-if="info.save_mode == 'insert' && is_id_chk">
		                        <button class="btn btn-primary" type="button" @click="change_id">	
		                            <span>아이디변경</span>
		                        </button>
		                    </div>
		                </div>
		                <div class="form-group">
		                    <label for="name" >사용자명</label>		
		                    <input type="text" class="form-control" id="name" v-model="info.name" :readonly="info.iam_yn == 'Y'">
						</div>
						<div class="form-group">
		                    <label v-if="info.save_mode != 'insert'">가입일</label>
		                    <div v-if="info.save_mode != 'insert'" class="form-control">
		                        <input type="text" class="form-control" id="reg_dt_char" v-model="info.reg_dt_char" readonly>
		                    </div>
		                </div>
		    
		                <div class="form-group">
		                    <label for="jikgub_nm" >직책</label>		
		                    <input type="text" class="form-control" id="jikgub_nm" v-model="info.jikgub_nm" :readonly="info.iam_yn == 'Y'">
		                </div>
		                <div class="form-group">
		                    <label for="tdept_nm">부서</label>		
		                    <input type="text" class="form-control" id="tdept_nm" v-model="info.tdept_nm" :readonly="info.iam_yn == 'Y'">		
		                </div>
		    
		                <div class="form-group">
		                    <label>재직상태</label>
		
		                    <input type="text" class="form-control" id="statusnm" v-model="info.statusnm" readonly>
		                </div>
		                <div class="form-group">
		                    <label for="email">이메일</label>              
		                    <input type="text" class="form-control" id="email" v-model="info.email" :readonly="info.iam_yn == 'Y'">                    
		                </div>
		    
		                <div class="form-group" v-if="info.save_mode == 'insert'">
		                    <label for="user_pw">비밀번호</label>
		                    <input type="password" class="form-control" id="user_pw" v-model="info.user_pw">                       
		                </div>
		    
<!-- 		                <div class="form-group" v-if="info.save_mode == 'insert'"> -->
<!-- 		                    <label for="user_pw_confirm" class="col-sm-1 control-label">비밀번호 확인</label>		                    		 -->
<!-- 		                    <input type="password" class="form-control" id="user_pw_confirm" v-model="info.user_pw_confirm">		 -->
<!-- 		                </div>		     -->

										<div class="form-group" v-if="info.save_mode == 'insert'">
											<label for="user_pw_confirm">비밀번호 확인</label>
											<input type="password" class="form-control" id="user_pw_confirm"
												v-model="info.user_pw_confirm">
										</div>


		                <div class="form-group" v-if="info.save_mode != 'insert' && info.iam_yn != 'Y'">
		                    <label for="btn_initpw">비밀번호</label>	                    
	                        <button class="btn btn-primary" type="button" id="btn_initpw" @click="openPopInitPw">	
	                            <span>초기화</span>	
	                            <i class="entypo-ccw"></i>
	                        </button>
		                </div>		               
		           </div>
		            <div class="right-panel flex-50" style="position: relative;">
		                <div class="form-group">
		                    <label for="gis_auth">GIS권한</label>		
		                    <select class="form-control" id="gis_auth" v-model="info.gis_auth">
		                            <option value="1">1 (기본값)</option>
		                            <option value="2">2</option>
		                            <option value="3">3</option>
		                    </select>		
		                </div>		    
		                <div class="form-group">
		                    <label for="auth_cd" >메뉴권한</label>
		                    
		                        <select class="form-control" id="auth_cd" v-model="info.auth_cd">
		                            <c:forEach var="item" items="${authList}">
		                                <option value="${item.auth_cd}">${item.auth_nm}</option>
		                            </c:forEach>
		                        </select>
		                    
		                </div>
		                		               		                
		                <div class="form-group">
		                    <label for="auth_cd" >
		                        관리시스템
		                    </label>
		                </div>      
	                    <table class="table table-bordered" style="margin-top: 10px;">
	                        <thead>
	                            <tr>
	                                <th class="center" style="width: 5%;"><input type="checkbox" @change="allCheckChng(event.target)"/></th>
	                                <th class="center" style="width: 30%;">시스템명</th>
	                                <th class="center" style="width: 10%;">HIVE DB명</th>
	                                <th class="center" style="width: 30%;">테이블영문명</th>
	                                <th class="center" style="width: 25%;">테이블한글명</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                            <tr v-for="item in info.userSystemMappingList">
	                                <td class="center"><input type="checkbox" name="itemchk" v-model="item.chk" /></td>
	                                <td class="center">{{item.sys_nm}}</td>
	                                <td class="center">{{item.hive_db_nm}}</td>
	                                <td class="center">{{item.table_eng_nm}}</td>
	                                <td class="center">{{item.table_korean_nm}}</td>
	                            </tr>
	                        </tbody>
                        </table>	
		                <div class="form-group" v-if="info.auth_cd != 'normal'"  style="position: absolute;bottom: 5px;">

	                        <button type="button" class="btn btn-black btn-icon btn-small" @click="openPopSystemList">
	                            추가
	                            <i class="entypo-plus"></i>
	                        </button>
	                        <button type="button" class="btn btn-red btn-icon btn-small" @click="delSystem">
	                            선택삭제
	                            <i class="entypo-minus"></i>
	                        </button>

		                </div>
	                        	                		    
		                 
		            </div>     
		        </div> 
		        
             <div class="form-group">
	             <div >
	                 <button type="button" class="btn btn-green btn-icon btn-small" @click="save">
	                     저장
	                     <i class="entypo-check"></i>
	                 </button>
	                 <button type="button" class="btn btn-red btn-icon btn-small" @click="delInfo" v-if="info.save_mode != 'insert' && info.iam_yn != 'Y'">
	                     삭제
	                     <i class="entypo-trash"></i>
	                 </button>
	                 <button type="button" class="btn btn-blue btn-icon btn-small" @click="gotoList">
	                     목록
	                     <i class="entypo-list"></i>
	                 </button>
	             </div>
		    </div>		        
		    </div>	


		    
		    </template>	
		    </div>
		
		<br />
		
		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp" flush="false"/>
		
	</div>
</div>
<!-- 관리시스템목록 팝업 -->
<div class="modal fade" id="pop_systemList">
<template>
	<div class="modal-dialog" style="width: 50%;">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="btn_popClose">&times;</button>
				<h4 class="modal-title">시스템 목록</h4>
			</div>
			<div class="modal-body">
				<div style="height: 550px;overflow: auto;" class="dataTables_wrapper">
					<div class="dataTables_filter">
						<div>
							<select v-model="search_nm">
								<option value="sys_nm">시스템명</option>
								<option value="table_eng_nm">테이블영문명</option>
								<option value="table_korean_nm">테이블한글명</option>
							</select>
							<input type="text" placeholder="" style="width: 120px;" id="search_val_pop1" v-model="search_val" @keyup.enter="getList(true)">
							<button type="button" class="btn btn-blue btn-icon" style="margin-left: 5px;" @click="getList(true)">
								검색
								<i class="entypo-search"></i>
							</button>
							<button type="button" class="btn btn-black btn-icon" style="float: right;" @click="add_systemData">
								선택추가
								<i class="entypo-plus"></i>
							</button>
						</div>
						<div>
						</div>
					</div>
			
					<table class="table table-bordered datatable dataTable">
						<thead style="position: sticky;top: 0px;">
							<tr>
								<th class="center" style="width: 5%;">
									<input type="checkbox" v-model="chkall" @click="all_check(event.target)"/>
								</th>
								<th class="center" style="width: 30%;">시스템명</th>
								<th class="center" style="width: 10%;">HIVE DB명</th>
								<th class="center" style="width: 25%;">테이블영문명</th>
								<th class="center" style="width: 30%;">테이블한글명</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in dataList">
								<td class="center"><input type="checkbox" v-model="item.chkpop1" name="chkpop1" :value="item.cnnc_manage_no"/></td>
								<td class="center">{{item.sys_nm}}</td>
								<td class="center">{{item.hive_db_nm}}</td>
								<td class="center">{{item.table_eng_nm}}</td>
								<td class="center">{{item.table_korean_nm}}</td>
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
<!--// 관리시스템목록 팝업 -->

<!-- 비밀번호초기화 팝업 -->
<div class="modal fade" id="pop_initpw">
<template>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="btn_pop_initpw" >&times;</button>
				<h4 class="modal-title">비밀번호 초기화</h4>
			</div>
			<div class="modal-body">
			
				<div class="row">
					<div class="col-md-12">
						<div class="form-group">
							<input type="password" class="form-control" id="user_pw_init" placeholder="초기화할 비밀번호를 입력하세요." v-model="user_pw">
						</div>	
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-info" @click="initPw">초기화</button>
				<button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
			</div>
		</div>
	</div>
</template>
</div>
<!--// 비밀번호초기화 팝업 -->
</body>
<script>
var vueapp = new Vue({
	el : "#vueapp",
	data : {
		info : {
			user_id : "${user_id}",
			auth_cd : "normal",
			iam_yn : "N",
			status_cd : "AAA",
			statusnm : "재직",
			name : "",
			jikgub_cd : "",
			jikgub_nm : "",
			dept : "",
			tdept_nm : "",
			email : "",
			gis_auth : "1",
			reg_dt_char : "",
			user_pw : "",
			user_pw_confirm : "",
			userSystemMappingList : [],
			save_mode : "insert",
		},
		is_id_chk : false,
	},
	mounted : function(){
		if(!cf_isEmpty(this.info.user_id)){
			this.getInfo();
		}
	},
	methods : {
		getInfo : function(){
			cf_ajax("/system/user_mng/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
			this.info.save_mode = "update";
		},
		save : function(){
			if(this.info.iam_yn === 'N'){
				if(this.info.save_mode === 'insert'){
					if(!this.is_id_chk){
						alert("아이디 중복체크를 해주세요.");
						$("#btn_chk_id_dupl").focus();
						return;
					}
					if(cf_isEmpty(this.info.name)){
						alert("사용자명을 입력하세요.");
						$("#name").focus();
						return;
					}
					if(cf_isEmpty(this.info.user_pw)){
						alert("비밀번호를 입력하세요.");
						$("#user_pw").focus();
						return;
					}
					if(cf_isEmpty(this.info.user_pw_confirm)){
						alert("비밀번호확인을 입력하세요.");
						$("#user_pw_confirm").focus();
						return;
					}
					if(this.info.user_pw !== this.info.user_pw_confirm){
						alert("비밀번호확인이 일치하지 않습니다.");
						$("#user_pw_confirm").focus();
						return;
					}
				} else {
					if(cf_isEmpty(this.info.name)){
						alert("사용자명을 입력하세요.");
						$("#name").focus();
						return;
					}
				}
			}
			
			if(!confirm("저장하시겠습니까?")) return;
			cf_ajax("/system/user_mng/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.save_mode = "update";
			this.getInfo();
		},
		delInfo : function(){
			if(!confirm("삭제하시겠습니까?")) return;
			cf_ajax("/system/user_mng/delete", this.info, this.delInfoCB);
		},
		delInfoCB : function(data){
			this.gotoList();
		},
		gotoList : function(){
			cf_movePage('/system/user_mng/list?fromDtl=Y');
		},
		change_id : function(){
			this.is_id_chk = false;
		},
		chk_id_dupl : function(){
			if(cf_isEmpty(this.info.user_id.trim())){
				alert("아이디를 입력해주세요.");
				$("#user_id").focus();
				return;
			}
			cf_ajax("/system/user_mng/chkExist", this.info, this.chk_id_duplCB);
		},
		chk_id_duplCB : function(data){
			if(data.cnt > 0){
				alert("입력하신 아이디는 이미 존재하고 있습니다.");
			} else {
				alert("입력하신 아이디는 사용이 가능합니다.");
				this.is_id_chk = true;
			}
		},
		openPopSystemList : function(){
			pop_systemList.init();
			$('#pop_systemList').modal('show');
		},
		delSystem : function(system){
			var userSystemMappingList = this.info.userSystemMappingList;
			for(var i=userSystemMappingList.length-1; i>=0; i--){
				if(userSystemMappingList[i].chk){
					userSystemMappingList.removeElement(userSystemMappingList[i]);
				}
			}
		},
		openPopInitPw : function(){
			pop_initpw.user_pw = "";
			$('#pop_initpw').modal('show');
		},
		allCheckChng : function(obj){
			for(var i=0; i<this.info.userSystemMappingList.length; i++){
				this.info.userSystemMappingList[i].chk = $(obj).is(":checked");
			}
			$('[name=itemchk]').prop('checked', $(obj).is(":checked"));
		},
	}
});
</script>
<script>
var pop_systemList = new Vue({
	el : "#pop_systemList",
	data : {
		dataList : [],
		search_nm : "sys_nm",
		search_val : "",
		chkall : false,
	},
	methods : {
		all_check : function(obj){
			
			var chkpop1List = $('[name=chkpop1]');
			for(var i=0; i<chkpop1List.length; i++){
				chkpop1List.eq(i).prop('checked', obj.checked);
				
				this.dataList[i].chkpop1 = obj.checked;
			}
		},
		init : function(){
			this.search_nm = "sys_nm";
			this.search_val = "";
			this.getList(true);
		},
		getList : function(isInit){
			var params = {
					search_nm : this.search_nm,
					search_val : this.search_val.trim(),
				}
			
			if(isInit === true){
				cv_pagingConfig.pageNo = 1;
			}
			cv_pagingConfig.limit = 100;
			cv_pagingConfig.func = this.getList;
			cv_pagingConfig.orders = [
				{target : "sys_nm", isAsc : true},
				{target : "table_korean_nm", isAsc : true},
			];
			
			cf_ajax("/system/user_mng/getInternalSystemList", params, this.getListCB);
		},
		getListCB : function(data){
			this.dataList = data.list;		
			cv_pagingConfig.renderPagenation('system_pup01');
			this.chkall = false;
		},
		add_systemData : function(){
			
			var target = [];
			for(var i=0; i<this.dataList.length; i++){
				if(this.dataList[i].chkpop1){
					target.push(this.dataList[i]);
				}
			}
			
			if(target.length == 0){
				alert("추가할 시스템을 선택해주세요.");
				return;
			}
			
			var userSystemMappingList = vueapp.info.userSystemMappingList;
			for(var i=0; i<userSystemMappingList.length; i++){
				for(var j=0; j<target.length; j++){
					if(userSystemMappingList[i].cnnc_manage_no === target[j].cnnc_manage_no 
							&& userSystemMappingList[i].table_eng_nm === target[j].table_eng_nm){
						alert("선택한 시스템 ( " + userSystemMappingList[i].sys_nm + " : " + target[j].table_eng_nm +" )이 이미 존재합니다.");
						return;
					}
				}
			}

			for(var i=0; i<target.length; i++){
				userSystemMappingList.push(target[i]);
			}
			$("#btn_popClose").click();
		},
	},
});
</script>
<script>
var pop_initpw = new Vue({
	el : "#pop_initpw",
	data : {
		user_pw : "",
	},
	methods : {
		initPw : function(){
			if(cf_isEmpty(this.user_pw)){
				alert("초기화할 비밀번호를 입력하세요.");
				$("#user_pw_init").focus();
				return;
			}

			if(!confirm("비밀번호를 초기화 하시겠습니까?")) return;
			
			var params = {
					user_id : vueapp.info.user_id,
					user_pw : this.user_pw,
				}
			cf_ajax("/system/user_mng/initPw", params, this.initPwCB);
		},
		initPwCB : function(data){
			if(data.rslt === "SUCC"){
				alert("지정된 비밀번호로 초기화 되었습니다.");
				$("#btn_pop_initpw").click();
			}
		},
	},
});

</script>
</html>