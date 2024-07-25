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
			<li class="active"><strong>관리 그룹 관리</strong></li>
		</ol>
	
		<h2>관리 그룹 관리</h2>
		<br />
		
		<div class="row">
			<div id="vueapp" style="width: 910px; margin-left: 15px;">
			<template>
				
				<div class="panel panel-primary" data-collapsed="0">
									
					<div class="panel-body">
			
					<form class="form-horizontal form-groups-bordered">
			
						<div class="form-group">
							<label for="auth_nm" class="col-sm-2 control-label">계정명</label>
							<div class="col-sm-3">
								<input type="text" class="col-sm-5 form-control" id="auth_nm" v-model="info.auth_nm" :readonly="is_id_chk">
							</div>
							<div class="col-sm-3" id="btn_chk_id_dupl" v-if="info.save_mode == 'insert' && !is_id_chk">
								<button class="btn btn-primary" type="button" @click="chk_id_dupl">	
									<span>중복체크</span>	
								</button>
							</div>
							<div class="col-sm-3" v-if="info.save_mode == 'insert' && is_id_chk">
								<button class="btn btn-primary" type="button" @click="change_id">	
									<span>어드민계정명 변경</span>
								</button>
							</div>
						</div>
						

			
						<div class="form-group" v-if="info.save_mode == 'insert'">
							<label for="user_pw" class="col-sm-2 control-label">비밀번호</label>
							
							<div class="col-sm-5">
								<input type="password" class="form-control" id="user_pw" v-model="info.user_pw">
							</div>
						</div>
			
						<div class="form-group" v-if="info.save_mode == 'insert'">
							<label for="user_pw_confirm" class="col-sm-2 control-label">비밀번호 확인</label>
							
							<div class="col-sm-5">
								<input type="password" class="form-control" id="user_pw_confirm" v-model="info.user_pw_confirm">
							</div>
						</div>
			
						<div class="form-group" v-if="info.save_mode != 'insert'">
							<label for="btn_initpw" class="col-sm-2 control-label">비밀번호</label>
							<div class="col-sm-5">
								<button class="btn btn-primary" type="button" id="btn_initpw" @click="openPopInitPw">	
									<span>초기화</span>	
									<i class="entypo-ccw"></i>
								</button>
							</div>
						</div>
			
						<div class="form-group">
							<label for="role_nm" class="col-sm-2 control-label">메뉴목록</label>
							<div class="col-sm-7" style="width: 750px;">
								<table class="table table-bordered">
									<thead>
										<tr>
											<th class="center" width="5%"></th>
											<th class="center" width="45%">URL</th>
											<th class="center" width="50%">메뉴명</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="menu in info.authMenuMappingList">
											<td class="center"><input type="checkbox" name="use_yn" v-model="menu.use_yn == 'Y'" @change="menuUseYnChng(menu, event.target)"></td>
											<td>{{menu.menu_url}}</td>
											<td>{{menu.menu_nm}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						
						<div class="form-group">
							<div class="col-sm-offset-2 col-sm-5">
								<button type="button" class="btn btn-green btn-icon btn-small" @click="save">
									저장
									<i class="entypo-check"></i>
								</button>
								<button type="button" id="btn_delete" class="btn btn-red btn-icon btn-small" @click="delInfo" v-if="info.save_mode == 'update'">
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
			auth_nm : "${auth_nm}",
		},
		is_id_chk : false,
	},
	mounted : function(){
		this.getInfo();
	},
	methods : {
		getInfo : function(){
			cf_ajax("/system/admin_auth_mng/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
			
			if(!cf_isEmpty(this.info.auth_nm)){
				this.is_id_chk = true;
			}
		},
		save : function(){
			if(this.info.save_mode === "insert"){
				if(cf_isEmpty(this.info.auth_nm.trim())){
					alert("어드민계정명을 입력해주세요.");
					$("#auth_nm").focus();
					return;
				}
				if(!this.is_id_chk){
					alert("어드민계정명 중복체크를 해주세요.");
					$("#btn_chk_id_dupl").focus();
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
			}
			if(!confirm("저장하시겠습니까?")) return;
			cf_ajax("/system/admin_auth_mng/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.auth_nm = data.auth_nm;
			this.getInfo();
		},
		delInfo : function(){
			if(!confirm("삭제하시겠습니까?")) return;
			cf_ajax("/system/admin_auth_mng/delete", this.info, this.delInfoCB);
		},
		delInfoCB : function(data){
			this.gotoList();
		},
		gotoList : function(){
			cf_movePage('/system/admin_auth_mng/list');
		},
		change_id : function(){
			this.is_id_chk = false;
		},
		chk_id_dupl : function(){
			if(cf_isEmpty(this.info.auth_nm.trim())){
				alert("어드민권한명을 입력해주세요.");
				$("#auth_nm").focus();
				return;
			}
			cf_ajax("/system/admin_auth_mng/chkExist", this.info, this.chk_id_duplCB);
		},
		chk_id_duplCB : function(data){
			if(data.cnt > 0){
				alert("입력하신 어드민권한명은 이미 존재하고 있습니다.");
				$("#auth_nm").focus();
			} else {
				alert("입력하신 어드민권한명은 사용이 가능합니다.");
				this.is_id_chk = true;
			}
		},
		menuUseYnChng : function(menu, el){
			menu.use_yn = $(el).is(":checked") ? 'Y' : 'N';
		},
		openPopInitPw : function(){
			pop_initpw.user_pw = "";
			$('#pop_initpw').modal('show');
		},
	}
});

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
					auth_nm : vueapp.info.auth_nm,
					user_pw : this.user_pw,
				}
			cf_ajax("/system/admin_auth_mng/initPw", params, this.initPwCB);
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