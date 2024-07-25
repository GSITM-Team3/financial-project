<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false"/>
	<link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">
	<link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">
	<link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">
	<script src="/static_resources/system/js/bootstrap-datepicker.js"></script>
	<script src="/static_resources/system/js/bootstrap-datepicker.ko.js"></script>
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
			<li><a href="#gm">현/정원관리</a></li>
			<li class="active"><strong>현/정원관리</strong></li>
		</ol>
	
		<h2>현/정원관리</h2>
		<br/>
		
		
		<div class="dataTables_wrapper" id="vueapp">
		<template>
			<div class="row">
				<div style="width: 1000px; margin-left: 15px;">
					<div class="panel panel-primary">
						<div class="panel-body">
							<c:if test="${properties.runEnv == 'prod'}">
								<iframe src="${properties.tableauUrl}/trusted/${ticket}/authoring/_16430032170530/Sheet1?:embed=y" style="width:100%;height:900px"></iframe>
							</c:if>
						</div>
					</div>
				</div>
			</div>
			
			
			<div class="dataTables_paginate paging_simple_numbers" id="div_paginate">
			</div>
		</template>
		</div>
		
		<br />
		
		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp" flush="false"/>
		
	</div>
</div>
</body>

<!-- 수정/등록 팝업 -->
<div class="modal fade" id="pop_info">
<template>
	<div class="modal-dialog" style="width: 850px;">
		<div class="modal-content" style="padding: 30px;">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="btn_popClose">&times;</button>
				<h4 class="modal-title">현/정원 등록</h4>
			</div>
			<div class="modal-body">
				<form class="form-horizontal form-groups-bordered">
					<div class="form-group" style="padding-left:5px;">
						<select class="form-control col-sm-2" name="cat_cd_1" v-model="cat_cd_1" style="width: 150px;" @change="changeGbn(event.target)">
							<option value="">- 1차분류 -</option>
							<option :value="item.code" v-for="item in catList1" >{{item.code_nm}}</option>
						</select>
						<select class="form-control col-sm-2" name="cat_cd_2" v-model="cat_cd_2" style="width: 150px;" @change="changeGbn(event.target)">
							<option value="">- 2차분류 -</option>
							<option :value="item.code" v-for="item in catList2">{{item.code_nm}}</option>
						</select>
						<select class="form-control col-sm-2" name="cat_cd_3" v-model="cat_cd_3" style="width: 150px;" @change="changeGbn(event.target)">
							<option value="">- 3차분류 -</option>
							<option :value="item.code" v-for="item in catList3">{{item.code_nm}}</option>
						</select>
						<select class="form-control col-sm-2" name="cat_cd_4" v-model="cat_cd_4" style="width: 150px;" @change="changeGbn(event.target)">
							<option value="">- 4차분류 -</option>
							<option :value="item.code" v-for="item in catList4">{{item.code_nm}}</option>
						</select>
						<select class="form-control col-sm-2" name="cat_cd_5" v-model="cat_cd_5" style="width: 150px;" @change="changeGbn(event.target)">
							<option value="">- 5차분류 -</option>
							<option :value="item.code" v-for="item in catList5">{{item.code_nm}}</option>
						</select>
						<select class="form-control col-sm-2" name="cat_cd_6" v-model="cat_cd_6" style="width: 150px;" @change="changeGbn(event.target)">
							<option value="">- 6차분류 -</option>
							<option :value="item.code" v-for="item in catList6">{{item.code_nm}}</option>
						</select>
					</div>
					<div class="form-group" style="padding-left:5px;">
						<select class="form-control col-sm-2" name="jikgun_cd" v-model="jikgun_cd" style="width: 150px;" @change="changeGbn(event.target)">
							<option value="">- 직종 -</option>
							<option :value="item.code" v-for="item in jikgunList" >{{item.code_nm}}</option>
						</select>
						<select class="form-control col-sm-2" name="jikgub_cd" v-model="jikgub_cd" style="width: 150px;" @change="changeGbn(event.target)">
							<option value="">- 직급 -</option>
							<option :value="item.code" v-for="item in jikgubList">{{item.code_nm}}</option>
						</select>
						<select class="form-control col-sm-2" name="pos_cd" v-model="pos_cd" style="width: 150px;" @change="changeGbn(event.target)">
							<option value="">- 직렬 -</option>
							<option :value="item.code" v-for="item in posList">{{item.code_nm}}</option>
						</select>
						<select class="form-control col-sm-2" name="fdept_cd" v-model="fdept_cd" style="width: 150px;" @change="changeGbn(event.target)">
							<option value="">- 경과 -</option>
							<option :value="item.code" v-for="item in fdeptList">{{item.code_nm}}</option>
						</select>
					</div>
					<div class="form-group" style="padding-left:5px;">
						<label for="sbjt" class="col-sm-1 control-label" style="width:90px;" >기준정원</label>
						<div class="col-sm-4" style="width: 150px;">
							<input type="text" id="tot_psn" v-model="tot_psn" class="form-control" maxlength="7" v-numform>
						</div>
						<label for="sbjt" class="col-sm-1 control-label" style="width:90px;">운영정원</label>
						<div class="col-sm-4" style="width: 150px;">
							<input type="text" id="now_psn" v-model="now_psn" class="form-control" maxlength="7" v-numform>
						</div>
						<label for="sbjt" class="col-sm-1 control-label" style="width:90px;">배정정원</label>
						<div class="col-sm-4" style="width: 150px;">
							<input type="text" id="now_psn" v-model="assn_psn" class="form-control" maxlength="7" v-numform>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" @click="insertInfo">저장</button>
       			<button type="button" class="btn btn-secondary" data-dismiss="modal">취소</button>
			</div>
		</div>
	</div>
</template>
</div><script>

var vueapp = new Vue({
	el : "#vueapp",
	data : {
		catList1 : [],
		catList2 : [],
		catList3 : [],
		catList4 : [],
		catList5 : [],
		catList6 : [],
		jikgunList : [],
		jikgubList : [],
		posList : [],
		fdeptList : [],
		dataList :[],

		cat_cd_1 : "", cat_cd_2 : "", cat_cd_3 : "", cat_cd_4 : "", cat_cd_5 : "", cat_cd_6 : "",
		cat_nm_1 : "", cat_nm_2 : "", cat_nm_3 : "", cat_nm_4 : "", cat_nm_5 : "", cat_nm_6 : "",
		
		jikgun_cd : "", jikgun_nm : "",
		jikgub_cd : "", jikgub_nm : "",
		pos_cd : "", pos_nm : "",
		fdept_cd : "", fdept_nm : "",
		
		now_psn : "",
		tot_psn : "",
		assn_psn : "",
		
		search_val : "",
	},
	mounted : function(){
		cf_ajax("/system/poli_person_mng/getCdMngList", {code_grp_id : "CAT1"}, function(data){
			vueapp.catList1 = data;
			
			cf_ajax("/system/poli_person_mng/getCdMngList", {code_grp_id : "JIKGUN"}, function(data){
				vueapp.jikgunList = data;

				cf_ajax("/system/poli_person_mng/getCdMngList", {code_grp_id : "POS"}, function(data){
					vueapp.posList = data;

					cf_ajax("/system/poli_person_mng/getCdMngList", {code_grp_id : "FDEPT"}, function(data){
						vueapp.fdeptList = data;
						vueapp.getList(true);
					});
				});
			});
		});
	},
	methods : {
		init : function(){
			this.catList2 = []; this.catList3 = []; this.catList4 = []; this.catList5 = []; this.jikgubList = [];
			this.cat_cd_1 = ""; this.cat_cd_2 = ""; this.cat_cd_3 = ""; this.cat_cd_4 = ""; this.cat_cd_5 = ""; this.cat_cd_6 = "";
			this.cat_nm_1 = ""; this.cat_nm_2 = ""; this.cat_nm_3 = ""; this.cat_nm_4 = ""; this.cat_nm_5 = ""; this.cat_nm_6 = "";
			this.jikgun_cd = ""; this.jikgun_nm = ""; 
			this.jikgub_cd = ""; this.jikgub_nm = "";
			this.pos_cd = ""; this.pos_nm = "";
			this.fdept_cd = ""; this.fdept_nm = "";
		},
		allCheck : function(){
			$('[name=is_check]').prop('checked', $("#allCheck").is(":checked"));
		},
		onCheck : function(){
			if($("[name=is_check]:checked").length === $("[name=is_check]").length){
				$("#allCheck").prop('checked',true);
			} else {
				$("#allCheck").prop('checked',false);
			}
		},
		deleteList : function(){
			var chkedList = $("[name=is_check]:checked");
			
			if(chkedList.length == 0){
				alert("삭제할 대상을 선택하여 주십시오.");
				return;
			}
			
			if(!confirm("선택된 대상을 삭제하시겠습니까?")) return;
			
			var targetArr = [];
			var idx;
			chkedList.each(function(i) {
				idx = $(this).attr("data-idx");
				targetArr.push(vueapp.dataList.getElementFirst("idx", idx));
			});

			var params = {
					targetArr : targetArr,
				}
			
			cf_ajax("/system/poli_person_mng/deleteList", params, function(data){
				$('[name=is_check]').prop('checked', false);
				$("#allCheck").prop('checked', false);
				vueapp.getList(true);
			});
		},
		saveList : function(){
			var chkedList = $("[name=is_check]:checked");
			
			if(chkedList.length == 0){
				alert("저장할 대상을 선택하여 주십시오.");
				return;
			}
			
			if(!confirm("선택된 대상을 저장하시겠습니까?")) return;
			
			var targetArr = [];
			var target = {};
			var idx;
			chkedList.each(function(i) {
				idx = $(this).attr("data-idx");
				target = vueapp.dataList.getElementFirst("idx", idx);
				target.tot_psn = target.tot_psn.replaceAll(",","");
				target.now_psn = target.now_psn.replaceAll(",","");
				target.assn_psn = target.assn_psn.replaceAll(",","");
				targetArr.push(target);
			});

			var params = {
					targetArr : targetArr,
				}
			
			cf_ajax("/system/poli_person_mng/saveList", params, function(data){
				$('[name=is_check]').prop('checked', false);
				$("#allCheck").prop('checked', false);
				vueapp.getList(true);
			});
		},
		getList : function(isInit){
			
			cv_pagingConfig.func = this.getList;
			if(isInit === true){
				cv_pagingConfig.pageNo = 1;
			}
			cv_pagingConfig.orders = [{target : "reg_dt", isAsc : false}];
			cv_pagingConfig.limit = 30;
			
			var params = {
				cat_cd_1 : this.cat_cd_1,
				cat_cd_2 : this.cat_cd_2,
				cat_cd_3 : this.cat_cd_3,
				cat_cd_4 : this.cat_cd_4,
				cat_cd_5 : this.cat_cd_5,
				cat_cd_6 : this.cat_cd_6,
				jikgun_cd : this.jikgun_cd,
				jikgub_cd : this.jikgub_cd,
				pos_cd : this.pos_cd,
				fdept_cd : this.fdept_cd,
				search_val : this.search_val,
			};	
			
			cf_ajax("/system/poli_person_mng/getList", params, this.getListCB);
		},
		getListCB : function(data){
			$("#fromdatespan").text(this.from_date);
			$("#todatespan").text(this.to_date);
			
			this.dataList = data.list;
			cv_pagingConfig.renderPagenation("system");
		},
		changeGbn : function(obj,idx){
			var id = obj.id;
			if( id == 'cat_cd_1' ){
				this.cat_cd_2 = "";
				this.cat_cd_3 = "";
				this.catList3 = [];
				this.cat_cd_4 = "";
				this.catList4 = [];
				this.cat_cd_5 = "";
				this.catList5 = [];
				this.cat_cd_6 = "";
				this.catList6 = [];
				
				if(this.cat_cd_1 == ""){
					this.catList2 = [];
					vueapp.getList(true);
				} else {
					var params = {
							code_grp_id : "CAT2",
							cat1 : this.cat_cd_1,
					}
					cf_ajax("/system/poli_person_mng/getCdMngList", params, function(data){
						vueapp.catList2 = data;
						vueapp.getList(true);
					});
				}
				
			} else if( id == 'cat_cd_2' ){
				this.cat_cd_3 = "";
				this.cat_cd_4 = "";
				this.catList4 = [];
				this.cat_cd_5 = "";
				this.catList5 = [];
				this.cat_cd_6 = "";
				this.catList6 = [];
				
				if(this.cat_cd_2 == ""){
					this.catList3 = [];
					vueapp.getList(true);
				} else {
					var params = {
							code_grp_id : "CAT3",
							cat1 : this.cat_cd_1,
							cat2 : this.cat_cd_2,
					}
					cf_ajax("/system/poli_person_mng/getCdMngList", params, function(data){
						vueapp.catList3 = data;
						vueapp.getList(true);
					});
				}
				
			} else if( id == 'cat_cd_3' ){
				this.cat_cd_4 = "";
				this.cat_cd_5 = "";
				this.catList5 = [];
				this.cat_cd_6 = "";
				this.catList6 = [];
				
				if(this.cat_cd_3 == ""){
					this.catList4 = [];
					vueapp.getList(true);
				} else {
					var params = {
							code_grp_id : "CAT4",
							cat1 : this.cat_cd_1,
							cat2 : this.cat_cd_2,
							cat3 : this.cat_cd_3,
					}
					cf_ajax("/system/poli_person_mng/getCdMngList", params, function(data){
						vueapp.catList4 = data;
						vueapp.getList(true);
					});
				}
				
			} else if( id == 'cat_cd_4' ){
				this.cat_cd_5 = "";
				this.cat_cd_6 = "";
				this.catList6 = [];
				
				if(this.cat_cd_4 == ""){
					this.catList5 = [];
					vueapp.getList(true);
				} else {
					var params = {
							code_grp_id : "CAT5",
							cat1 : this.cat_cd_1,
							cat2 : this.cat_cd_2,
							cat3 : this.cat_cd_3,
							cat4 : this.cat_cd_4,
					}
					cf_ajax("/system/poli_person_mng/getCdMngList", params, function(data){
						vueapp.catList5 = data;
						vueapp.getList(true);
					});
				} 
			} else if( id == 'cat_cd_5' ){
					this.cat_cd_6 = "";
					
					if(this.cat_cd_5 == ""){
						this.catList6 = [];
						vueapp.getList(true);
					} else {
						var params = {
								code_grp_id : "CAT6",
								cat1 : this.cat_cd_1,
								cat2 : this.cat_cd_2,
								cat3 : this.cat_cd_3,
								cat4 : this.cat_cd_4,
								cat5 : this.cat_cd_5,
						}
						cf_ajax("/system/poli_person_mng/getCdMngList", params, function(data){
							vueapp.catList6 = data;
							vueapp.getList(true);
						});
					}	
			} else if( id == 'cat_cd_6' ){
				vueapp.getList(true);
			} else if( id == 'jikgun_cd' ){
				this.jikgub_cd = "";
				
				if(this.jikgun_cd == ""){
					this.jikgubList = [];
					vueapp.getList(true);
				} else {
					var params = {
							code_grp_id : "JIKGUB",
							cat1 : this.jikgun_cd,
					}
					cf_ajax("/system/poli_person_mng/getCdMngList", params, function(data){
						vueapp.jikgubList = data;
						vueapp.getList(true);
					});
				}
				
			} else if( id == 'jikgub_cd' ){
				vueapp.getList(true);
			} else if( id == 'pos_cd' ){
				vueapp.getList(true);
			} else if( id == 'fdept_cd' ){
				vueapp.getList(true);
			}
		},
		addItem : function(){
			pop_info.init();
			$('#pop_info').modal('show');
		},
		
	}
});
</script>

<script>
var pop_info = new Vue({
	el : "#pop_info",
	data : {
		catList1 : [],
		catList2 : [],
		catList3 : [],
		catList4 : [],
		catList5 : [],
		catList6 : [],
		jikgunList : [],
		jikgubList : [],
		posList : [],
		fdeptList : [],
		
		cat_cd_1 : "", cat_cd_2 : "", cat_cd_3 : "", cat_cd_4 : "", cat_cd_5 : "", cat_cd_6 : "",
		cat_nm_1 : "", cat_nm_2 : "", cat_nm_3 : "", cat_nm_4 : "", cat_nm_5 : "", cat_nm_6 : "",
		
		jikgun_cd : "", jikgun_nm : "", jikgub_cd : "", jikgub_nm : "",
		pos_cd : "", pos_nm : "",
		fdept_cd : "", fdept_nm : "",
		
		now_psn : "",
		tot_psn : "",
		assn_psn : "",
	},
	methods : {
		init : function(){
			
			this.catList1 = vueapp.catList1;
			this.jikgunList = vueapp.jikgunList;
			this.posList = vueapp.posList;
			this.fdeptList = vueapp.fdeptList;
			
			this.catList2 = []; this.catList3 = []; this.catList4 = []; this.catList5 = []; this.jikgubList = [];
			this.cat_cd_1 = ""; this.cat_cd_2 = ""; this.cat_cd_3 = ""; this.cat_cd_4 = ""; this.cat_cd_5 = ""; this.cat_cd_6 = "";
			this.cat_nm_1 = ""; this.cat_nm_2 = ""; this.cat_nm_3 = ""; this.cat_nm_4 = ""; this.cat_nm_5 = ""; this.cat_nm_6 = "";
			this.jikgun_cd = ""; this.jikgun_nm = ""; 
			this.jikgub_cd = ""; this.jikgub_nm = "";
			this.pos_cd = ""; this.pos_nm = "";
			this.fdept_cd = ""; this.fdept_nm = "";
			this.now_psn = ""; this.tot_psn = "";
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
					cf_ajax("/system/poli_person_mng/getCdMngList", params, function(data){
						pop_info.catList2 = data;
					});
				}
				this.cat_cd_2 = "";
				this.cat_cd_3 = "";
				this.catList3 = [];
				this.cat_cd_4 = "";
				this.catList4 = [];
				this.cat_cd_5 = "";
				this.catList5 = [];
				this.cat_cd_6 = "";
				this.catList6 = [];
				
				var temp_el = this.catList1.getElementFirst("code", this.cat_cd_1);
				if(cf_isEmpty(temp_el)){
					this.cat_nm_1 = "";
				} else {
					this.cat_nm_1 = temp_el.code_nm;
				}
			} else if( name == 'cat_cd_2' ){
				if(this.cat_cd_2 == ""){
					this.catList3 = [];
				} else {
					var params = {
							code_grp_id : "CAT3",
							cat1 : this.cat_cd_1,
							cat2 : this.cat_cd_2,
					}
					cf_ajax("/system/poli_person_mng/getCdMngList", params, function(data){
						pop_info.catList3 = data;
					});
				}
				this.cat_cd_3 = "";
				this.cat_cd_4 = "";
				this.catList4 = [];
				this.cat_cd_5 = "";
				this.catList5 = [];
				
				var temp_el = this.catList2.getElementFirst("code", this.cat_cd_2);
				if(cf_isEmpty(temp_el)){
					this.cat_nm_2 = "";
				} else {
					this.cat_nm_2 = temp_el.code_nm;
				}
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
					cf_ajax("/system/poli_person_mng/getCdMngList", params, function(data){
						pop_info.catList4 = data;
					});
				}
				this.cat_cd_4 = "";
				this.cat_cd_5 = "";
				this.catList5 = [];
				
				var temp_el = this.catList3.getElementFirst("code", this.cat_cd_3);
				if(cf_isEmpty(temp_el)){
					this.cat_nm_3 = "";
				} else {
					this.cat_nm_3 = temp_el.code_nm;
				}
			} else if( name == 'cat_cd_4' ){
				if(this.cat_cd_4 == ""){
					this.cat_cd_5 = "";
					this.catList5 = [];
				} else {
					var params = {
							code_grp_id : "CAT5",
							cat1 : this.cat_cd_1,
							cat2 : this.cat_cd_2,
							cat3 : this.cat_cd_3,
							cat4 : this.cat_cd_4,
					}
					cf_ajax("/system/poli_person_mng/getCdMngList", params, function(data){
						pop_info.catList5 = data;
					});
				}
				this.cat_cd_5 = "";
				
				var temp_el = this.catList4.getElementFirst("code", this.cat_cd_4);
				if(cf_isEmpty(temp_el)){
					this.cat_nm_4 = "";
				} else {
					this.cat_nm_4 = temp_el.code_nm;
				}
			} else if( name == 'cat_cd_5' ){
				if(this.cat_cd_5 == ""){
					this.catList6 = [];
				} else {
					var params = {
							code_grp_id : "CAT6",
							cat1 : this.cat_cd_1,
							cat2 : this.cat_cd_2,
							cat3 : this.cat_cd_3,
							cat4 : this.cat_cd_4,
							cat5 : this.cat_cd_5,
					}
					cf_ajax("/system/poli_person_mng/getCdMngList", params, function(data){
						pop_info.catList6 = data;
					});
				}
				this.cat_cd_6 = "";
				
				var temp_el = this.catList5.getElementFirst("code", this.cat_cd_5);
				if(cf_isEmpty(temp_el)){
					this.cat_nm_5 = "";
				} else {
					this.cat_nm_5 = temp_el.code_nm;
				}
			} else if( name == 'cat_cd_6' ){		
				
				var temp_el = this.catList6.getElementFirst("code", this.cat_cd_6);
				if(cf_isEmpty(temp_el)){
					this.cat_nm_6 = "";
				} else {
					this.cat_nm_6 = temp_el.code_nm;
				}
			} else if( name == 'jikgun_cd' ){

				
				if(this.jikgun_cd == ""){
					this.jikgubList = [];
				} else {
					var params = {
							code_grp_id : "JIKGUB",
							cat1 : this.jikgun_cd,
					}
					cf_ajax("/system/poli_person_mng/getCdMngList", params, function(data){
						pop_info.jikgubList = data;
					});
				}
				this.jikgub_cd = "";
				
				var temp_el = this.jikgunList.getElementFirst("code", this.jikgun_cd);
				if(cf_isEmpty(temp_el)){
					this.jikgun_nm = "";
				} else {
					this.jikgun_nm = temp_el.code_nm;
				}
			} else if( name == 'jikgub_cd' ){
				
				var temp_el = this.jikgubList.getElementFirst("code", this.jikgub_cd);
				if(cf_isEmpty(temp_el)){
					this.jikgub_nm = "";
				} else {
					this.jikgub_nm = temp_el.code_nm;
				}
			} else if( name == 'pos_cd' ){
				
				var temp_el = this.posList.getElementFirst("code", this.pos_cd);
				if(cf_isEmpty(temp_el)){
					this.pos_nm = "";
				} else {
					this.pos_nm = temp_el.code_nm;
				}
			} else if( name == 'fdept_cd' ){
				
				var temp_el = this.fdeptList.getElementFirst("code", this.fdept_cd);
				if(cf_isEmpty(temp_el)){
					this.fdept_nm = "";
				} else {
					this.fdept_nm = temp_el.code_nm;
				}
			}
		},
		insertInfo : function(){
			
			if(cf_isEmpty(this.cat_cd_1)){
				alert("카테고리를 선택하여 주십시오");
				return;
			}
			if(cf_isEmpty(this.jikgun_cd)){
				alert("직종을 선택하여 주십시오.");
				return;
			}
			if(cf_isEmpty(this.jikgub_cd)){
				alert("직급을 선택하여 주십시오.");
				return;
			}
			
			var params = {
					cat_cd_1 : this.cat_cd_1, cat_cd_2 : this.cat_cd_2, cat_cd_3 : this.cat_cd_3, cat_cd_4 : this.cat_cd_4, cat_cd_5 : this.cat_cd_5, cat_cd_6 : this.cat_cd_6,
					cat_nm_1 : this.cat_nm_1, cat_nm_2 : this.cat_nm_2, cat_nm_3 : this.cat_nm_3, cat_nm_4 : this.cat_nm_4, cat_nm_5 : this.cat_nm_5, cat_nm_6 : this.cat_nm_6,
					
					jikgun_cd : this.jikgun_cd, jikgun_nm : this.jikgun_nm, 
					jikgub_cd : this.jikgub_cd, jikgub_nm : this.jikgub_nm,
					
					pos_cd : this.pos_cd, pos_nm : this.pos_nm,
					fdept_cd : this.fdept_cd, fdept_nm : this.fdept_nm,
					
					now_psn : this.now_psn.replaceAll(",",""),
					tot_psn : this.tot_psn.replaceAll(",",""),
					assn_psn : this.assn_psn.replaceAll(",",""),
			}

			if(!confirm("저장하시겠습니까?")) return;

			cf_ajax("/system/poli_person_mng/getCheckDupl", params, function(data){
				if(cf_isEmpty(data.code)){
					cf_ajax("/system/poli_person_mng/insertInfo", params, function(data){
						$('#pop_info').modal('hide');
						vueapp.init();
						vueapp.getList(true);
					});
				} else {
					alert("중복된 내역입니다.");
				}
			});
		},
	}
});

</script>
</html>