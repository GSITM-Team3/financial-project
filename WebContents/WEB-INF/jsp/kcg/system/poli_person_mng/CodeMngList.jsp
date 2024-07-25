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
	<title>관리자시스템</title>
</head>
<body class="page-body">

<div class="page-container"><!-- add class "sidebar-collapsed" to close sidebar by default, "chat-visible" to make chat appear always -->

	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp" flush="false"/>

	<div class="main-content">

		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp" flush="false"/>
		
		<ol class="breadcrumb bc-3">
			<li><a href="#none" onclick="cf_movePage('/system')"><i class="fa fa-home"></i>Home</a></li>
			<li class="active"><strong>코드관리</strong></li>
		</ol>
	
		<h2>코드관리</h2>
		<br />
		
		<div class="dataTables_wrapper" id="vueapp">
		<template>
			<div class="row">
				<div style="width: 1200px; margin-left: 15px;">
					<div class="panel panel-primary">
						<div class="panel-body">
						<form class="form-horizontal form-groups-bordered">
							<div class="form-group">
								<label class="control-label" style="float: left;margin-left: 30px;width: 150px;">1차분류</label>
								<div style="float: left; margin-left: 20px;">
									<button type="button" class="btn btn-blue btn-small" style="width: 100px; float: right; margin-left: 20px;" @click="openPop('CAT1')">
										1차분류 관리
									</button>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label" style="float: left;margin-left: 30px;width: 150px;">2차분류</label>
								<div style="float: left; margin-left: 20px;">
									<select class="form-control col-sm-1" v-model="cat_cd_1" name="cat_cd_1" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 1차분류 -</option>
										<option :value="item.code" v-for="item in catList1" >{{item.code_nm}}</option>
									</select>
									<button type="button" class="btn btn-blue btn-small" style="width: 100px; float: right; margin-left: 20px;" @click="openPop('CAT2')">
										2차분류 관리
									</button>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label" style="float: left;margin-left: 30px;width: 150px;">3차분류</label>
								<div style="float: left; margin-left: 20px;">
									<select class="form-control col-sm-1" v-model="cat_cd_1" name="cat_cd_1" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 1차분류 -</option>
										<option :value="item.code" v-for="item in catList1" >{{item.code_nm}}</option>
									</select>
									<select class="form-control col-sm-1" v-model="cat_cd_2" name="cat_cd_2" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 2차분류 -</option>
										<option :value="item.code" v-for="item in catList2" >{{item.code_nm}}</option>
									</select>
									<button type="button" class="btn btn-blue btn-small" style="width: 100px; float: right; margin-left: 20px;" @click="openPop('CAT3')">
										3차분류 관리
									</button>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label" style="float: left;margin-left: 30px;width: 150px;">4차분류</label>
								<div style="float: left; margin-left: 20px;">
									<select class="form-control col-sm-1" v-model="cat_cd_1" name="cat_cd_1" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 1차분류 -</option>
										<option :value="item.code" v-for="item in catList1" >{{item.code_nm}}</option>
									</select>
									<select class="form-control col-sm-1" v-model="cat_cd_2" name="cat_cd_2" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 2차분류 -</option>
										<option :value="item.code" v-for="item in catList2" >{{item.code_nm}}</option>
									</select>
									<select class="form-control col-sm-1" v-model="cat_cd_3" name="cat_cd_3" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 3차분류 -</option>
										<option :value="item.code" v-for="item in catList3" >{{item.code_nm}}</option>
									</select>
									<button type="button" class="btn btn-blue btn-small" style="width: 100px; float: right; margin-left: 20px;" @click="openPop('CAT4')">
										4차분류 관리
									</button>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label" style="float: left;margin-left: 30px;width: 150px;">5차분류</label>
								<div style="float: left; margin-left: 20px;">
									<select class="form-control col-sm-1" v-model="cat_cd_1" name="cat_cd_1" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 1차분류 -</option>
										<option :value="item.code" v-for="item in catList1" >{{item.code_nm}}</option>
									</select>
									<select class="form-control col-sm-1" v-model="cat_cd_2" name="cat_cd_2" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 2차분류 -</option>
										<option :value="item.code" v-for="item in catList2" >{{item.code_nm}}</option>
									</select>
									<select class="form-control col-sm-1" v-model="cat_cd_3" name="cat_cd_3" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 3차분류 -</option>
										<option :value="item.code" v-for="item in catList3" >{{item.code_nm}}</option>
									</select>
									<select class="form-control col-sm-1" v-model="cat_cd_4" name="cat_cd_4" style="width: 150px;">
										<option value="">- 4차분류 -</option>
										<option :value="item.code" v-for="item in catList4" >{{item.code_nm}}</option>
									</select>
									<button type="button" class="btn btn-blue btn-small" style="width: 100px; float: right; margin-left: 20px;" @click="openPop('CAT5')">
										5차분류 관리
									</button>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label" style="float: left;margin-left: 30px;width: 150px;">6차분류</label>
								<div style="float: left; margin-left: 20px;">
									<select class="form-control col-sm-1" v-model="cat_cd_1" name="cat_cd_1" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 1차분류 -</option>
										<option :value="item.code" v-for="item in catList1" >{{item.code_nm}}</option>
									</select>
									<select class="form-control col-sm-1" v-model="cat_cd_2" name="cat_cd_2" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 2차분류 -</option>
										<option :value="item.code" v-for="item in catList2" >{{item.code_nm}}</option>
									</select>
									<select class="form-control col-sm-1" v-model="cat_cd_3" name="cat_cd_3" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 3차분류 -</option>
										<option :value="item.code" v-for="item in catList3" >{{item.code_nm}}</option>
									</select>
									<select class="form-control col-sm-1" v-model="cat_cd_4" name="cat_cd_4" style="width: 150px;" @change="changeGbn(event.target)">
										<option value="">- 4차분류 -</option>
										<option :value="item.code" v-for="item in catList4" >{{item.code_nm}}</option>
									</select>
									<select class="form-control col-sm-1" v-model="cat_cd_5" name="cat_cd_5" style="width: 150px;">
										<option value="">- 5차분류 -</option>
										<option :value="item.code" v-for="item in catList5" >{{item.code_nm}}</option>
									</select>
									<button type="button" class="btn btn-blue btn-small" style="width: 100px; float: right; margin-left: 20px;" @click="openPop('CAT6')">
										6차분류 관리
									</button>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label" style="float: left;margin-left: 30px;width: 150px;">직종</label>
								<div style="float: left; margin-left: 20px;">
									<button type="button" class="btn btn-blue btn-small" style="width: 100px; float: right; margin-left: 20px;" @click="openPop('JIKGUN')">
										직종 관리
									</button>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label" style="float: left;margin-left: 30px;width: 150px;">직급</label>
								<div style="float: left; margin-left: 20px;">
									<select class="form-control col-sm-1" v-model="jikgun_cd" name="jikgun_cd" style="width: 150px;">
										<option value="">- 직종 -</option>
										<option :value="item.code" v-for="item in jikgunList" >{{item.code_nm}}</option>
									</select>
									<button type="button" class="btn btn-blue btn-small" style="width: 100px; float: right; margin-left: 20px;" @click="openPop('JIKGUB')">
										직급 관리
									</button>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label" style="float: left;margin-left: 30px;width: 150px;">직렬</label>
								<div style="float: left; margin-left: 20px;">
									<button type="button" class="btn btn-blue btn-small" style="width: 100px; float: right; margin-left: 20px;" @click="openPop('POS')">
										직렬 관리
									</button>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label" style="float: left;margin-left: 30px;width: 150px;">경과</label>
								<div style="float: left; margin-left: 20px;">
									<button type="button" class="btn btn-blue btn-small" style="width: 100px; float: right; margin-left: 20px;" @click="openPop('FDEPT')">
										경과 관리
									</button>
								</div>
							</div>
						</form>
						</div>
					</div>
				</div>
			</div>
		</template>
		</div>
		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp" flush="false"/>
	</div>
</div>

<!-- 관리시스템목록 팝업 -->
<div class="modal fade" id="pop_code">
<template>
	<div class="modal-dialog" style="width: 500px;">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="btn_popClose">&times;</button>
				<h3 class="modal-title" style="margin-top: 10px;margin-bottom: 10px;text-align: center;">{{title}}</h3>
				<h4 class="modal-title" v-if="cat_nav1 != ''">{{cat_nav1}}</h4>
				<h4 class="modal-title" v-if="cat_nav2 != ''">{{cat_nav2}}</h4>
				<h4 class="modal-title" v-if="cat_nav3 != ''">{{cat_nav3}}</h4>
				<h4 class="modal-title" v-if="cat_nav4 != ''">{{cat_nav4}}</h4>
				<h4 class="modal-title" v-if="cat_nav5 != ''">{{cat_nav5}}</h4>
			</div>
			<div class="modal-body">
				<div class="dataTables_wrapper">					
					<div class="dt-buttons">
						<div>
							<input type="search" :placeholder="placeholder" id="code_nm" style="width: 250px;" v-model="code_nm">
							<button type="button" class="btn btn-red" style="margin-left: 5px;" @click="addItem">
								등록
							</button>
						</div>
					</div>
				</div>
				<div style="height: 400px;overflow: auto;" class="dataTables_wrapper">		
					<table class="table table-bordered datatable dataTable">
						<thead style="position: sticky;top: 0px;">
							<tr>
								<th class="center" style="width: 64%;">명칭</th>
								<th class="center" style="width: 18%;">활성화</th>
								<th class="center" style="width: 18%;">삭제</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in dataList">
								<td class="center"><input type="text" class="form-control" v-model="item.code_nm"></td>
								<td class="center"><input type="checkbox" v-model="item.use_yn == 'Y'" @change="changeChk(item.code_idx, event.target)"/></td>
								<td class="center">
									<button type="button" class="btn btn-blue" style="margin-left: 5px;" @click="delInfo(item.code_idx);">
										삭제
									</button>
								</td>
							</tr>
						</tbody>
					</table>	
				</div>				
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-dismiss="modal" @click="saveList">저장</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">취소</button>
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
		catList1 : [],
		catList2 : [],
		catList3 : [],
		catList4 : [],
		catList5 : [],
		jikgunList : [],
		
		cat_cd_1 : "",
		cat_cd_2 : "",
		cat_cd_3 : "",
		cat_cd_4 : "",
		cat_cd_5 : "",
		
		jikgun_cd : "",
	},
	mounted : function(){
		this.init();
	},
	methods : {
		init : function(){
			cf_ajax("/system/poli_person_mng/code/getCdMngList", {code_grp_id : "CAT1"}, function(data){
				vueapp.catList1 = data;
			});
			
			cf_ajax("/system/poli_person_mng/code/getCdMngList", {code_grp_id : "JIKGUN"}, function(data){
				vueapp.jikgunList = data;
			});
		},
		openPop : function(code_grp_id){
			if(code_grp_id === "CAT2" && this.cat_cd_1 === ""){
				alert("1차분류를 선택해주세요.");
				return;
			}
			if(code_grp_id === "CAT3" && this.cat_cd_2 === ""){
				alert("2차분류를 선택해주세요.");
				return;
			}
			if(code_grp_id === "CAT4" && this.cat_cd_3 === ""){
				alert("3차분류를 선택해주세요.");
				return;
			}
			if(code_grp_id === "CAT5" && this.cat_cd_4 === ""){
				alert("4차분류를 선택해주세요.");
				return;
			}
			if(code_grp_id === "CAT6" && this.cat_cd_5 === ""){
				alert("5차분류를 선택해주세요.");
				return;
			}
			if(code_grp_id === "JIKGUB" && this.jikgun_cd === ""){
				alert("직종을 선택해주세요.");
				return;
			}
			pop_code.getList(code_grp_id);
		},
		changeGbn : function(obj){
			var name = obj.name;
			if( name == 'cat_cd_1' ){
				if(this.cat_cd_1 == ""){
					this.catList2 = [];
				} else {
					var params = {
							code_grp_id : "CAT2",
							cat1 : this.cat_cd_1,
					}
					cf_ajax("/system/poli_person_mng/code/getCdMngList", params, function(data){
						vueapp.catList2 = data;
					});
				}
				this.cat_cd_2 = "";
				this.cat_cd_3 = "";
				this.catList3 = [];
				this.cat_cd_4 = "";
				this.catList4 = [];
				this.cat_cd_5 = "";
				this.catList5 = [];
			} else if( name == 'cat_cd_2' ){
				if(this.cat_cd_2 == ""){
					this.catList3 = [];
				} else {
					var params = {
							code_grp_id : "CAT3",
							cat1 : this.cat_cd_1,
							cat2 : this.cat_cd_2,
					}
					cf_ajax("/system/poli_person_mng/code/getCdMngList", params, function(data){
						vueapp.catList3 = data;
					});
				}
				this.cat_cd_3 = "";
				this.cat_cd_4 = "";
				this.catList4 = [];
				this.cat_cd_5 = "";
				this.catList5 = [];
			} else if( name == 'cat_cd_3' ){
				if(this.cat_cd_3 == ""){
					this.catList4 = [];
				} else {
					var params = {
							code_grp_id : "CAT4",
							cat1 : this.cat_cd_1,
							cat2 : this.cat_cd_2,
							cat3 : this.cat_cd_3,
					}
					cf_ajax("/system/poli_person_mng/code/getCdMngList", params, function(data){
						vueapp.catList4 = data;
					});
				}
				this.cat_cd_4 = "";
				this.catList4 = [];
				this.cat_cd_5 = "";
				this.catList5 = [];
			} else if ( name == 'cat_cd_4' ){
			if(this.cat_cd_4 == ""){
				this.catList5 = [];
			} else {
				var params = {
						code_grp_id : "CAT5",
						cat1 : this.cat_cd_1,
						cat2 : this.cat_cd_2,
						cat3 : this.cat_cd_3,
						cat4 : this.cat_cd_4,
				}
				cf_ajax("/system/poli_person_mng/code/getCdMngList", params, function(data){
					vueapp.catList5 = data;
				});
			}
			this.cat_cd_5 = "";
		} 
		},
	}
});
</script>


<script>

var pop_code = new Vue({
	el : "#pop_code",
	data : {
		cat_cd_1 : "",
		cat_cd_2 : "",
		cat_cd_3 : "",
		cat_cd_4 : "",
		cat_cd_5 : "",
		
		jikgun_cd : "",
		
		code : "",
		code_nm : "",
		dataList : [],
		title : "",
		
		cat_nav1 : "",
		cat_nav2 : "",
		cat_nav3 : "",
		cat_nav4 : "",
		cat_nav5 : "",
		
		placeholder : "",
		code_grp_id : "",
		max_codenum : "",
	},
	methods : {
		addItem : function(){
			if(this.code_nm.trim() == ""){
				alert("등록할 이름을 입력해 주세요.");
				$("#code_nm").focus();
				return;
			}
			
			if(this.dataList.getElementFirst("code_nm", this.code_nm.trim()) != null){
				alert("이미 존재하고 있는 명칭입니다.");
				$("#code_nm").focus();
				return;
			}
			
			var cat1 = ""; 
			var cat_nm_1 = "";
			var cat2 = ""; 
			var cat_nm_2 = ""; 
			var cat3 = ""; 
			var cat_nm_3 = ""; 
			var cat4 = ""; 
			var cat_nm_4 = ""; 
			var cat5 = ""; 
			var cat_nm_5 = "";
			var cat6 = ""; 
			var cat_nm_6 = "";
			
			if(this.code_grp_id === "CAT1"){
				cat1 = ""; 
				cat_nm_1 = this.code_nm.trim();
			} else if(this.code_grp_id === "CAT2"){
				cat1 = this.cat_cd_1; 
				cat_nm_1 = vueapp.catList1.getElementFirst("code", this.cat_cd_1).code_nm;
				cat2 = ""; 
				cat_nm_2 = this.code_nm.trim(); 
			} else if(this.code_grp_id === "CAT3"){
				cat1 = this.cat_cd_1; 
				cat_nm_1 = vueapp.catList1.getElementFirst("code", this.cat_cd_1).code_nm;
				cat2 = this.cat_cd_2; 
				cat_nm_2 = vueapp.catList2.getElementFirst("code", this.cat_cd_2).code_nm;
				cat3 = ""; 
				cat_nm_3 = this.code_nm.trim(); 
			} else if(this.code_grp_id === "CAT4"){
				cat1 = this.cat_cd_1; 
				cat_nm_1 = vueapp.catList1.getElementFirst("code", this.cat_cd_1).code_nm;
				cat2 = this.cat_cd_2; 
				cat_nm_2 = vueapp.catList2.getElementFirst("code", this.cat_cd_2).code_nm;
				cat3 = this.cat_cd_3; 
				cat_nm_3 = vueapp.catList3.getElementFirst("code", this.cat_cd_3).code_nm;
				cat4 = ""; 
				cat_nm_4 = this.code_nm.trim(); 
			} else if(this.code_grp_id === "CAT5"){
				cat1 = this.cat_cd_1; 
				cat_nm_1 = vueapp.catList1.getElementFirst("code", this.cat_cd_1).code_nm;
				cat2 = this.cat_cd_2; 
				cat_nm_2 = vueapp.catList2.getElementFirst("code", this.cat_cd_2).code_nm;
				cat3 = this.cat_cd_3; 
				cat_nm_3 = vueapp.catList3.getElementFirst("code", this.cat_cd_3).code_nm;
				cat4 = this.cat_cd_4; 
				cat_nm_4 = vueapp.catList4.getElementFirst("code", this.cat_cd_4).code_nm;
				cat5 = ""; 
				cat_nm_5 = this.code_nm.trim();
			} else if(this.code_grp_id === "CAT6"){
				cat1 = this.cat_cd_1; 
				cat_nm_1 = vueapp.catList1.getElementFirst("code", this.cat_cd_1).code_nm;
				cat2 = this.cat_cd_2; 
				cat_nm_2 = vueapp.catList2.getElementFirst("code", this.cat_cd_2).code_nm;
				cat3 = this.cat_cd_3; 
				cat_nm_3 = vueapp.catList3.getElementFirst("code", this.cat_cd_3).code_nm;
				cat4 = this.cat_cd_4; 
				cat_nm_4 = vueapp.catList4.getElementFirst("code", this.cat_cd_4).code_nm;
				cat5 = this.cat_cd_5; 
				cat_nm_5 = vueapp.catList5.getElementFirst("code", this.cat_cd_5).code_nm;
				cat6 = ""; 
				cat_nm_6 = this.code_nm.trim();
			} else if(this.code_grp_id === "JIKGUN"){
				cat1 = ""; 
				cat_nm_1 = this.code_nm.trim();
			} else if(this.code_grp_id === "JIKGUB"){
				cat1 = this.cat_cd_1; 
				cat_nm_1 = vueapp.jikgunList.getElementFirst("code", this.cat_cd_1).code_nm;
				cat2 = ""; 
				cat_nm_2 = this.code_nm.trim(); 
			} else if(this.code_grp_id === "POS"){
				cat1 = ""; 
				cat_nm_1 = this.code_nm.trim();
			} else if(this.code_grp_id === "FDEPT"){
				cat1 = ""; 
				cat_nm_1 = this.code_nm.trim();
			}		
			var item = {
					code_grp_id : this.code_grp_id,
					code_idx : cf_genUUID(),
					code : "",
					code_nm : this.code_nm.trim(),
					use_yn : "Y",
					cat1 : cat1,
					cat_nm_1 : cat_nm_1,
					cat2 : cat2,
					cat_nm_2 : cat_nm_2,
					cat3 : cat3,
					cat_nm_3 : cat_nm_3,
					cat4 : cat4,
					cat_nm_4 : cat_nm_4,
					cat5 : cat5,
					cat_nm_5 : cat_nm_5,
					cat6 : cat6,
					cat_nm_6 : cat_nm_6,
				}
			this.dataList.addElementByIdx(0, item);
			this.code_nm = "";
		},
		changeChk : function(code_idx, obj){
			if($(obj).is(":checked")){
				this.dataList.getElementFirst("code_idx", code_idx).use_yn = "Y";
			} else {
				this.dataList.getElementFirst("code_idx", code_idx).use_yn = "N";
			}
		},
		delInfo : function(code_idx){
			var target = this.dataList.getElementFirst("code_idx", code_idx);
			
			if(target.code != ""){
				cf_ajax("/system/poli_person_mng/code/chkChildExist", target, function(data){
					if(data.cnt > 0){
						alert("(" + target.code_nm + ")는 하위요소가 존재하므로 삭제가 불가합니다.");
						return;
					} else {
						if(!confirm("(" + target.code_nm + ") 요소를 삭제하실 경우 이에 등록된 현정원의 데이터에 영향이 있을 수 있습니다.\n(" + target.code_nm + ") 요소를 삭제하시겠습니까?")) return;
						
						cf_ajax("/system/poli_person_mng/code/deleteInfo", target, function(data){
							pop_code.getList(pop_code.code_grp_id);
						});
					}
				});
			} else {
				pop_code.dataList.removeElement(target);
			}
		},
		saveList : function(){
			
			if(!confirm("변경내용을 저장하시겠습니까?")) return;
			
			for(var i=0; i<this.dataList.length; i++){
				if(this.code_grp_id === "CAT1"){
					this.dataList[i].cat_nm_1 = this.dataList[i].code_nm.trim();
				} else if(this.code_grp_id === "CAT2"){
					this.dataList[i].cat_nm_2 = this.dataList[i].code_nm.trim();
				} else if(this.code_grp_id === "CAT3"){
					this.dataList[i].cat_nm_3 = this.dataList[i].code_nm.trim();
				} else if(this.code_grp_id === "CAT4"){
					this.dataList[i].cat_nm_4 = this.dataList[i].code_nm.trim();
				} else if(this.code_grp_id === "CAT5"){
					this.dataList[i].cat_nm_5 = this.dataList[i].code_nm.trim();
				} else if(this.code_grp_id === "CAT6"){
					this.dataList[i].cat_nm_6 = this.dataList[i].code_nm.trim();
				} else if(this.code_grp_id === "JIKGUN"){
					this.dataList[i].cat_nm_1 = this.dataList[i].code_nm.trim();
				} else if(this.code_grp_id === "JIKGUB"){
					this.dataList[i].cat_nm_2 = this.dataList[i].code_nm.trim();
				} else if(this.code_grp_id === "POS"){
					this.dataList[i].cat_nm_1 = this.dataList[i].code_nm.trim();
				} else if(this.code_grp_id === "FDEPT"){
					this.dataList[i].cat_nm_1 = this.dataList[i].code_nm.trim();
				}		
			}
			
			var params = {
					cat1 : this.cat_cd_1,
					cat2 : this.cat_cd_2,
					cat3 : this.cat_cd_3,
					cat4 : this.cat_cd_4,
					cat5 : this.cat_cd_5,
					code_grp_id : this.code_grp_id,
					dataList : this.dataList,
					max_codenum : this.max_codenum,
			}
			
			cf_ajax("/system/poli_person_mng/code/saveList", params, function(data){
				
				if(pop_code.code_grp_id === "CAT1" || pop_code.code_grp_id === "JIKGUN" ){
					vueapp.init();
				}
				
				$("#pop_code").modal("hide");
			});
		},
		getList : function(code_grp_id){
			
			this.code_grp_id = code_grp_id;
			this.cat_cd_1 = "";
			this.cat_cd_2 = "";
			this.cat_cd_3 = "";
			this.cat_cd_4 = "";
			this.cat_cd_5 = "";
			this.cat_nav1 = "";
			this.cat_nav2 = "";
			this.cat_nav3 = "";
			this.cat_nav4 = "";
			this.cat_nav5 = "";
			
			this.dataList = [];
			
			if(this.code_grp_id === "CAT1"){
				this.title = "1차분류 관리입니다.";
			} else if(this.code_grp_id === "CAT2"){
				this.cat_cd_1 = vueapp.cat_cd_1;
				this.title = "2차분류 관리입니다.";
				var cat_1_nm = vueapp.catList1.getElementFirst("code", this.cat_cd_1).code_nm;
				this.cat_nav1 = "* 1차 분류 : " + cat_1_nm;
			} else if(this.code_grp_id === "CAT3"){
				this.cat_cd_1 = vueapp.cat_cd_1;
				this.cat_cd_2 = vueapp.cat_cd_2;
				this.title = "3차분류 관리입니다.";
				var cat_1_nm = vueapp.catList1.getElementFirst("code", this.cat_cd_1).code_nm;
				this.cat_nav1 = "* 1차 분류 : " + cat_1_nm;
				var cat_2_nm = vueapp.catList2.getElementFirst("code", this.cat_cd_2).code_nm;
				this.cat_nav2 = "* 2차 분류 : " + cat_2_nm;
			} else if(this.code_grp_id === "CAT4"){
				this.cat_cd_1 = vueapp.cat_cd_1;
				this.cat_cd_2 = vueapp.cat_cd_2;
				this.cat_cd_3 = vueapp.cat_cd_3;
				this.title = "4차분류 관리입니다.";
				var cat_1_nm = vueapp.catList1.getElementFirst("code", this.cat_cd_1).code_nm;
				this.cat_nav1 = "* 1차 분류 : " + cat_1_nm;
				var cat_2_nm = vueapp.catList2.getElementFirst("code", this.cat_cd_2).code_nm;
				this.cat_nav2 = "* 2차 분류 : " + cat_2_nm;
				var cat_3_nm = vueapp.catList3.getElementFirst("code", this.cat_cd_3).code_nm;
				this.cat_nav3 = "* 3차 분류 : " + cat_3_nm;
			} else if(this.code_grp_id === "CAT5"){
				this.cat_cd_1 = vueapp.cat_cd_1;
				this.cat_cd_2 = vueapp.cat_cd_2;
				this.cat_cd_3 = vueapp.cat_cd_3;
				this.cat_cd_4 = vueapp.cat_cd_4;
				this.title = "5차분류 관리입니다.";
				var cat_1_nm = vueapp.catList1.getElementFirst("code", this.cat_cd_1).code_nm;
				this.cat_nav1 = "* 1차 분류 : " + cat_1_nm;
				var cat_2_nm = vueapp.catList2.getElementFirst("code", this.cat_cd_2).code_nm;
				this.cat_nav2 = "* 2차 분류 : " + cat_2_nm;
				var cat_3_nm = vueapp.catList3.getElementFirst("code", this.cat_cd_3).code_nm;
				this.cat_nav3 = "* 3차 분류 : " + cat_3_nm;
				var cat_4_nm = vueapp.catList4.getElementFirst("code", this.cat_cd_4).code_nm;
				this.cat_nav4 = "* 4차 분류 : " + cat_4_nm;
			} else if(this.code_grp_id === "CAT6"){
				this.cat_cd_1 = vueapp.cat_cd_1;
				this.cat_cd_2 = vueapp.cat_cd_2;
				this.cat_cd_3 = vueapp.cat_cd_3;
				this.cat_cd_4 = vueapp.cat_cd_4;
				this.cat_cd_5 = vueapp.cat_cd_5;
				this.title = "6차분류 관리입니다.";
				var cat_1_nm = vueapp.catList1.getElementFirst("code", this.cat_cd_1).code_nm;
				this.cat_nav1 = "* 1차 분류 : " + cat_1_nm;
				var cat_2_nm = vueapp.catList2.getElementFirst("code", this.cat_cd_2).code_nm;
				this.cat_nav2 = "* 2차 분류 : " + cat_2_nm;
				var cat_3_nm = vueapp.catList3.getElementFirst("code", this.cat_cd_3).code_nm;
				this.cat_nav3 = "* 3차 분류 : " + cat_3_nm;
				var cat_4_nm = vueapp.catList4.getElementFirst("code", this.cat_cd_4).code_nm;
				this.cat_nav4 = "* 4차 분류 : " + cat_4_nm;
				var cat_5_nm = vueapp.catList5.getElementFirst("code", this.cat_cd_5).code_nm;
				this.cat_nav5 = "* 5차 분류 : " + cat_5_nm;
			} else if(this.code_grp_id === "JIKGUN"){
				this.title = "직종 관리입니다.";
			} else if(this.code_grp_id === "JIKGUB"){
				this.cat_cd_1 = vueapp.jikgun_cd;
				this.title = "직급 관리입니다.";
				var cat_1_nm = vueapp.jikgunList.getElementFirst("code", this.cat_cd_1).code_nm;
				this.cat_nav1 = "* 직종 : " + cat_1_nm;
			} else if(this.code_grp_id === "POS"){
				this.title = "직렬 관리입니다.";
			} else if(this.code_grp_id === "FDEPT"){
				this.title = "경과 관리입니다.";
			}
			
			var params = {
					cat1 : this.cat_cd_1,
					cat2 : this.cat_cd_2,
					cat3 : this.cat_cd_3,
					cat4 : this.cat_cd_4,
					cat5 : this.cat_cd_5,
					code_grp_id : this.code_grp_id,
			}
			
			cf_ajax("/system/poli_person_mng/code/getCdMngList", params, function(data){
				pop_code.dataList = data;
				
				if(pop_code.dataList.length > 1){
					var tmp = pop_code.dataList.getMax("code");
					pop_code.max_codenum = Number(tmp.substr(tmp.length-3));
				} else if(pop_code.dataList.length == 1){
					var tmp = pop_code.dataList[0].code;
					pop_code.max_codenum = Number(tmp.substr(tmp.length-3));
				} else {
					pop_code.max_codenum = 0;
				}
				
				
				$("#pop_code").modal("show");
			});
		},
		
		
	},
});
</script>
</html>