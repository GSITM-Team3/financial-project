<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false"/>
	
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
			<li><a href="#gm">통계관리</a></li>
			<li class="active"><strong>검색 현황</strong></li>
		</ol>
	
		<h2>검색 현황</h2>
		<br/>
		
		<div id="vueapp">
		<template>
			<div class="row">
				<div style="width: 910px; margin-left: 15px;">
					<div class="panel panel-primary">
						<div class="panel-body">
						<form class="form-horizontal form-groups-bordered">
							<div class="form-group">
								<label class="control-label" style="width: 100px;float: left;">검색기간</label>
								<div style="width: 135px; float: left; margin-left: 15px;">
									<select class="form-control" v-model="selperiod" @change="chngperiod">
										<option value="00">기간 직접입력</option>
										<option value="01">오늘</option>
										<option value="02">어제</option>
										<option value="03">3일</option>
										<option value="04">7일</option>
										<option value="05">15일</option>
										<option value="06">1개월</option>
										<option value="07">3개월</option>
										<option value="08">6개월</option>
									</select>
								</div>
								<div style="width: 500px; float: left; margin-left: 5px;">
									<div style="width: 90px; float: left;">
										<input type="text" class="form-control" id="from_date" v-model="from_date" :readonly="selperiod != '00'">
									</div>										
									<button type="button" class="btn btn-primary btn-sm datepicker2" id="fromdtbtn" style="float: left;" v-if="selperiod == '00'">
										<i class="fa fa-calendar"></i>
									</button>										
									<div style="width: 10px; float: left; margin-left: 5px; margin-right: 5px;">
									<span style="vertical-align: middle; font-weight: bold;">~</span>
									</div>
									<div style="width: 90px; float: left;">
										<input type="text" class="form-control" id="to_date" v-model="to_date" :readonly="selperiod != '00'">
									</div>										
									<button type="button" class="btn btn-primary btn-sm datepicker2" id="todtbtn" style="float: left;" v-if="selperiod == '00'">
										<i class="fa fa-calendar"></i>
									</button>	
									<button type="button" class="btn btn-blue btn-icon btn-small" style="width: 90px; float: left; margin-left: 15px;" @click="getData">
										조회
										<i class="entypo-search"></i>
									</button>
								</div>
							</div>
						</form>
						</div>
					</div>
				</div>
			</div>
		
			<div class="row">
				<div style="width: 910px; margin-left: 15px;">
					<div class="panel panel-primary">
						<div class="panel-heading">
							<div class="panel-title">검색 기간 : <span id="fromdatespan"></span> ~ <span id="todatespan"></span></div>
						</div>
						<div class="panel-body">
							<div class="col-sm-8">
									<table class="table table-bordered" style="margin-top: 10px;">
										<thead>
											<tr>
												<th class="center" style="width: 15%;">순위</th>
												<th class="center" style="width: 25%;">검색어</th>
												<th style="width: 60%;">검색수</th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="(item, index) in datalist">
												<td class="center">{{index + 1}}</td>
												<td class="center">{{item.keyword}}</td>
												<td>{{item.keyword_cnt}}</td>
											</tr>
										</tbody>
									</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>

		</div>
		
		
		<br />
		
		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp" flush="false"/>
		
	</div>
</div>
</body>
<script>
function setDatePicker() {
	// https://bootstrap-datepicker.readthedocs.io/en/latest/options.html
	
	setTimeout(
			function(){
				if($("#fromdtbtn").length == 1 && $("#todtbtn").length == 1){

					var $this = $(".datepicker2"),
					opts = {
						format: attrDefault($this, 'format', 'mm/dd/yyyy'),
						daysOfWeekDisabled: attrDefault($this, 'disabledDays', ''),
						startView: attrDefault($this, 'startView', 0),
						rtl: rtl(),
						todayBtn: true,
						language : 'ko',
						autoclose : true,
						todayHighlight : true,
					},
					$n = $this.next(),
					$p = $this.prev();
					
					$this.datepicker(opts).on("changeDate",function(e){
						var objID = e.currentTarget.id;
						var objVal = e.currentTarget.value;
						var minDate = new Date(objVal.valueOf());
						
						if(objID == 'fromdtbtn'){	//시작일시
							vueapp.from_date = e.date.format('yyyy-MM-dd')
						}else if(objID == 'todtbtn'){	//시작일시
							vueapp.to_date = e.date.format('yyyy-MM-dd')
						}
						
					});
					
				} else {
					setDatePicker();
				}
			},
			300
		);
}

var todaystr = "${today}";							
var today = todaystr.toDate();	


var vueapp = new Vue({
	el : "#vueapp",
	data : {
		from_date : today.format('yyyy-MM-dd'),
		to_date : today.format('yyyy-MM-dd'),
		selperiod : "00",
		today : today.format('yyyy-MM-dd'),
		datalist : [],
	},
	mounted : function(){
		this.getData();
		this.chngperiod();
	},
	methods : {
		chngperiod : function(){
			if(this.selperiod == "00"){  // 직접입력
				setDatePicker();
			} else if(this.selperiod == "01"){  // 오늘
				this.from_date = this.today;
				this.to_date = this.today;
				setDatePicker();
			} else if(this.selperiod == "02"){  // 어제
				this.from_date = today.calcDate(-1).format('yyyy-MM-dd');
				this.to_date = today.calcDate(-1).format('yyyy-MM-dd');
			} else if(this.selperiod == "03"){  // 3일
				this.from_date = today.calcDate(-2).format('yyyy-MM-dd');
				this.to_date = today.format('yyyy-MM-dd');
			} else if(this.selperiod == "04"){  // 7일
				this.from_date = today.calcDate(-6).format('yyyy-MM-dd');
				this.to_date = today.format('yyyy-MM-dd');
			} else if(this.selperiod == "05"){  // 15일
				this.from_date = today.calcDate(-14).format('yyyy-MM-dd');
				this.to_date = today.format('yyyy-MM-dd');
			} else if(this.selperiod == "06"){  // 1개월
				this.from_date = today.calcMonth(-1).format('yyyy-MM-dd');
				this.to_date = today.format('yyyy-MM-dd');
			} else if(this.selperiod == "07"){  // 3개월
				this.from_date = today.calcMonth(-3).format('yyyy-MM-dd');
				this.to_date = today.format('yyyy-MM-dd');
			} else if(this.selperiod == "08"){  // 6개월
				this.from_date = today.calcMonth(-6).format('yyyy-MM-dd');
				this.to_date = today.format('yyyy-MM-dd');
			}
		},
		getData : function(){
			var params = {
					from_date : this.from_date,
					to_date : this.to_date,
				}
			cf_ajax("/system/stat_mng/keyword/getData", params, this.getDataCB);
		},
		getDataCB : function(data){
			$("#fromdatespan").text(this.from_date);
			$("#todatespan").text(this.to_date);
			this.datalist = data;
		},
	}
});
</script>
</html>