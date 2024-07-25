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
			<li class="active"><strong>메뉴 관리</strong></li>
		</ol>
	
		<h2>메뉴 관리</h2>
		<br />
		
		<div class="row">
			<div id="vueapp" style="width: 910px; margin-left: 15px;">
			<template>
				<div class="panel panel-primary" data-collapsed="0">
									
					<div class="panel-body">
			
					<form class="form-horizontal form-groups-bordered">
			
						<div class="form-group">
							<label for="menu_url" class="col-sm-2 control-label">URL</label>
							<div class="col-sm-3">
								<input type="text" class="col-sm-5 form-control" id="menu_url" v-model="info.menu_url" :readonly="info.save_mode != 'insert' || is_id_chk">
							</div>
							<div class="col-sm-3" id="btn_chk_id_dupl" v-if="info.save_mode == 'insert' && !is_id_chk">
								<button class="btn btn-primary" type="button" @click="chk_id_dupl">	
									<span>중복체크</span>	
								</button>
							</div>
							<div class="col-sm-3" v-if="info.save_mode == 'insert' && is_id_chk">
								<button class="btn btn-primary" type="button" @click="change_id">	
									<span>URL변경</span>
								</button>
							</div>
						</div>
			
						<div class="form-group">
							<label for="menu_nm" class="col-sm-2 control-label">메뉴이름</label>
							
							<div class="col-sm-5">
								<input type="text" class="form-control" id="menu_nm" v-model="info.menu_nm">
							</div>
						</div>
			
						<div class="form-group">
							<label for="menu_note" class="col-sm-2 control-label">메뉴설명</label>
							
							<div class="col-sm-5">
								<input type="text" class="form-control" id="menu_note" v-model="info.menu_note">
							</div>
						</div>
			
						<div class="form-group">
							<label for="admin_yn" class="col-sm-2 control-label">어드민페이지여부</label>
							<div class="col-sm-2" v-if="info.save_mode == 'insert'">
								<select class="form-control" id="admin_yn" v-model="info.admin_yn">
									<option value="N">N</option>
									<option value="Y">Y</option>
								</select>
							</div>
							<div class="col-sm-2" v-else>
								<input type="text" class="col-sm-5 form-control" id="admin_yn" v-model="info.admin_yn" readonly>
							</div>
						</div>
						
						<div class="form-group">
							<div class="col-sm-offset-2 col-sm-5">
								<button type="button" class="btn btn-green btn-icon btn-small" @click="save">
									저장
									<i class="entypo-check"></i>
								</button>
								<button type="button" class="btn btn-red btn-icon btn-small" @click="delInfo" v-if="info.save_mode != 'insert'">
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
</body>
<script>

var vueapp = new Vue({
	el : "#vueapp",
	data : {
		info : {
			menu_url : "${menu_url}",
			menu_nm : "",
			menu_note : "",
			admin_yn : "N",
			save_mode : "insert",
		},
		is_id_chk : false,
	},
	mounted : function(){
		if(!cf_isEmpty(this.info.menu_url)){
			this.getInfo();
		}
	},
	methods : {
		getInfo : function(){
			cf_ajax("/system/menu_mng/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
			this.info.save_mode = "update";
		},
		save : function(){
			if(this.info.save_mode == "insert" && !this.is_id_chk){
				alert("URL 중복체크를 해주세요.");
				$("#btn_chk_id_dupl").focus();
				return;
			}
			if(cf_isEmpty(this.info.menu_nm)){
				alert("메뉴이름을 입력해주세요.");
				$("#menu_nm").focus();
				return;
			}
			
			if(!confirm("저장하시겠습니까?")) return;
			cf_ajax("/system/menu_mng/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.save_mode = "update";
			this.getInfo();
		},
		delInfo : function(){
			if(!confirm("삭제하시겠습니까?")) return;
			cf_ajax("/system/menu_mng/delete", this.info, this.delInfoCB);
		},
		delInfoCB : function(data){
			this.gotoList();
		},
		gotoList : function(){
			cf_movePage('/system/menu_mng/list?fromDtl=Y');
		},
		chk_id_dupl : function(){
			if(cf_isEmpty(this.info.menu_url.trim())){
				alert("URL을 입력해주세요.");
				$("#menu_url").focus();
				return;
			}
			cf_ajax("/system/menu_mng/chkExist", this.info, this.chk_id_duplCB);
		},
		chk_id_duplCB : function(data){
			if(data.cnt > 0){
				alert("입력하신 URL은 이미 존재하고 있습니다.");
			} else {
				alert("입력하신 URL은 사용이 가능합니다.");
				this.is_id_chk = true;
			}
		},
		change_id : function(){
			this.is_id_chk = false;
		},
	}
});
</script>
</html>