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
			<li class="active"><strong>그룹 관리</strong></li>
		</ol>
	
		<h2>그룹 관리</h2>
		<br />
		
		<div class="row">
			<div id="vueapp" style="width: 910px; margin-left: 15px;">
			<template>
				
				<div class="panel panel-primary" data-collapsed="0">
									
					<div class="panel-body">
			
					<form class="form-horizontal form-groups-bordered">
			
						<div class="form-group">
							<label for="auth_nm" class="col-sm-2 control-label">권한명</label>
							<div class="col-sm-3">
								<input type="text" class="col-sm-5 form-control" id="auth_nm" v-model="info.auth_nm" :readonly="is_id_chk">
							</div>
							<div class="col-sm-3" id="btn_chk_id_dupl" v-if="!is_id_chk">
								<button class="btn btn-primary" type="button" @click="chk_id_dupl">	
									<span>중복체크</span>	
								</button>
							</div>
							<div class="col-sm-3" v-if="is_id_chk">
								<button class="btn btn-primary" type="button" @click="change_id">	
									<span>권한명 변경</span>
								</button>
							</div>
						</div>
			
						<div class="form-group">
							<label for="role_nm" class="col-sm-2 control-label">메뉴목록</label>
							<div class="col-sm-7" style="width: 750px;">
								<table class="table table-bordered">
									<thead>
										<tr>
											<th class="center" width="4%"></th>
											<th class="center" width="40%">URL</th>
											<th class="center" width="40%">메뉴명</th>
											<th class="center" width="4%">C</th>
											<th class="center" width="4%">R</th>
											<th class="center" width="4%">U</th>
											<th class="center" width="4%">D</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="menu in info.authMenuMappingList">
											<td class="center"><input type="checkbox" name="use_yn" v-model="menu.use_yn == 'Y'" @change="menuUseYnChng(menu, event.target)"></td>
											<td>{{menu.menu_url}}</td>
											<td>{{menu.menu_nm}}</td>
											<td class="center"><input type="checkbox" name="c_yn" v-model="menu.c_yn == 'Y'" :disabled="menu.use_yn != 'Y'" @change="menuCYnChng(menu, event.target)"></td>
											<td class="center"><input type="checkbox" name="r_yn" v-model="menu.r_yn == 'Y'" :disabled="menu.use_yn != 'Y'" @change="menuRYnChng(menu, event.target)"></td>
											<td class="center"><input type="checkbox" name="u_yn" v-model="menu.u_yn == 'Y'" :disabled="menu.use_yn != 'Y'" @change="menuUYnChng(menu, event.target)"></td>
											<td class="center"><input type="checkbox" name="d_yn" v-model="menu.d_yn == 'Y'" :disabled="menu.use_yn != 'Y'" @change="menuDYnChng(menu, event.target)"></td>
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
</body>
<script>
var vueapp = new Vue({
	el : "#vueapp",
	data : {
		info : {
			auth_cd : "${auth_cd}",
			auth_nm : "",
		},
		is_id_chk : false,
	},
	mounted : function(){
		this.getInfo();
	},
	methods : {
		getInfo : function(){
			cf_ajax("/system/portal_auth_mng/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
			
			if(!cf_isEmpty(this.info.auth_cd)){
				this.is_id_chk = true;
			}
		},
		save : function(){
			if(cf_isEmpty(this.info.auth_nm.trim())){
				alert("메뉴권한명을 입력해주세요.");
				$("#auth_nm").focus();
				return;
			}
			if(!this.is_id_chk){
				alert("메뉴권한명 중복체크를 해주세요.");
				$("#btn_chk_id_dupl").focus();
				return;
			}
			if(!confirm("저장하시겠습니까?")) return;
			cf_ajax("/system/portal_auth_mng/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.auth_cd = data.auth_cd;
			this.getInfo();
		},
		gotoList : function(){
			cf_movePage('/system/portal_auth_mng/list?fromDtl=Y');
		},
		change_id : function(){
			this.is_id_chk = false;
		},
		chk_id_dupl : function(){
			if(cf_isEmpty(this.info.auth_nm.trim())){
				alert("포탈권한명을 입력해주세요.");
				$("#auth_nm").focus();
				return;
			}
			cf_ajax("/system/portal_auth_mng/chkExist", this.info, this.chk_id_duplCB);
		},
		chk_id_duplCB : function(data){
			if(data.cnt > 0){
				alert("입력하신 포탈권한명은 이미 존재하고 있습니다.");
			} else {
				alert("입력하신 포탈권한명은 사용이 가능합니다.");
				this.is_id_chk = true;
			}
		},
		menuUseYnChng : function(menu, el){
			menu.use_yn = $(el).is(":checked") ? 'Y' : 'N';
			menu.c_yn = menu.use_yn;
			menu.r_yn = menu.use_yn;
			menu.u_yn = menu.use_yn;
			menu.d_yn = menu.use_yn;
		},
		menuCYnChng : function(menu, el){
			menu.c_yn = $(el).is(":checked") ? 'Y' : 'N';
		},
		menuRYnChng : function(menu, el){
			menu.r_yn = $(el).is(":checked") ? 'Y' : 'N';
		},
		menuUYnChng : function(menu, el){
			menu.u_yn = $(el).is(":checked") ? 'Y' : 'N';
		},
		menuDYnChng : function(menu, el){
			menu.d_yn = $(el).is(":checked") ? 'Y' : 'N';
		},
	}
});
</script>
</html>