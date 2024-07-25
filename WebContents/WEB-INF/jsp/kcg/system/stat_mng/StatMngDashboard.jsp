<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="java.util.ArrayList"  %>
<%@ page import="java.util.List"  %>
<%@ page import="common.utils.common.CmmnMap"  %>
<%@ page import="common.utils.json.JsonUtil"  %>
<%
	CmmnMap statData = (CmmnMap)request.getAttribute("statData");

	String from_date = statData.getString("from_date");
	String to_date = statData.getString("to_date");

	// 방문현황, 가입자현황 데이터 셋팅
	List<CmmnMap> statisticDataList = statData.getCmmnMapList("statisticData");
	List<Integer> visit_data = new ArrayList();
	List<Integer> reg_data = new ArrayList();
	List<String> date_list = new ArrayList();
	for(CmmnMap map : statisticDataList){
		visit_data.add(map.getInt("visit_cnt"));
		reg_data.add(map.getInt("reg_cnt"));
		date_list.add(map.getString("statistic_date"));
	}
	
	// 신청현황 데이터 셋팅
	CmmnMap reqStat = statData.getCmmnMap("reqStat");
	List<Integer> req_data = new ArrayList();
	req_data.add(reqStat.getInt("req_anal_tool_cnt"));
	req_data.add(reqStat.getInt("req_data_anal_cnt"));
	req_data.add(reqStat.getInt("req_data_collect_cnt"));
	req_data.add(reqStat.getInt("req_dnld_cnt"));
	

	// 키워드현황 데이터 셋팅
	List<CmmnMap> keywordStatList = statData.getCmmnMapList("keywordStat");
	List<Integer> keyword_cnt_data = new ArrayList();
	List<String> keyword_data = new ArrayList();
	for(CmmnMap map : keywordStatList){
		keyword_cnt_data.add(map.getInt("keyword_cnt"));
		keyword_data.add(map.getString("keyword"));
	}
	
%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false"/>
	<script src="/static_resources/lib/Chart.js/2.9.4/Chart.min.js"></script>
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
			<li class="active"><strong>대시보드</strong></li>
		</ol>
	
		<h2>대시보드</h2>
		<br/>
		
		<div class="row">
			<div class="col-sm-6">
				<div class="panel panel-primary">
					<div class="panel-heading">
						<div class="panel-title">최근 7일간 방문 현황</div>
					</div>
					<div class="panel-body">
						<div style="height: 300px">
							<canvas id="visitChart" style="width:100%; height:100%;"></canvas>
							<script>
							var ctx_visitChart = document.getElementById('visitChart').getContext('2d');
							var visitChart = new Chart(ctx_visitChart, {
							    type: 'bar',
							    data: {
							        labels: <%=JsonUtil.toJsonStr(date_list)%>,
							        datasets: [{
							            data: <%=JsonUtil.toJsonStr(visit_data)%>,
							            backgroundColor: [
							                'rgba(255, 99, 132, 0.2)',
							                'rgba(54, 162, 235, 0.2)',
							                'rgba(255, 206, 86, 0.2)',
							                'rgba(75, 192, 192, 0.2)',
							                'rgba(153, 102, 255, 0.2)',
							                'rgba(255, 159, 64, 0.2)',
							                'rgba(93, 63, 211, 0.2)',
							            ],
							            borderColor: [
							                'rgba(255, 99, 132, 1)',
							                'rgba(54, 162, 235, 1)',
							                'rgba(255, 206, 86, 1)',
							                'rgba(75, 192, 192, 1)',
							                'rgba(153, 102, 255, 1)',
							                'rgba(255, 159, 64, 1)',
							                'rgba(93, 63, 211,1)',
							            ],
							            borderWidth: 1
							        }]
							    },
							    options: {
							        scales: {
							            y: {
							                beginAtZero: true
							            }
							        },
							        legend: {
							            display: false
							        },
							    }
							});
							</script>
						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-6">
				<div class="panel panel-primary">
					<div class="panel-heading">
						<div class="panel-title">최근 7일간 가입자 현황</div>
					</div>
					<div class="panel-body">
						<div style="height: 300px">
							<canvas id="myChart2" style="width:100%; height:100%;"></canvas>
							<script>
							var ctx = document.getElementById('myChart2').getContext('2d');
							var myChart = new Chart(ctx, {
							    type: 'bar',
							    data: {
							        labels: <%=JsonUtil.toJsonStr(date_list)%>,
							        datasets: [{
							            data: <%=JsonUtil.toJsonStr(reg_data)%>,
							            backgroundColor: [
							                'rgba(255, 99, 132, 0.2)',
							                'rgba(54, 162, 235, 0.2)',
							                'rgba(255, 206, 86, 0.2)',
							                'rgba(75, 192, 192, 0.2)',
							                'rgba(153, 102, 255, 0.2)',
							                'rgba(255, 159, 64, 0.2)',
							                'rgba(93, 63, 211, 0.2)',
							            ],
							            borderColor: [
							                'rgba(255, 99, 132, 1)',
							                'rgba(54, 162, 235, 1)',
							                'rgba(255, 206, 86, 1)',
							                'rgba(75, 192, 192, 1)',
							                'rgba(153, 102, 255, 1)',
							                'rgba(255, 159, 64, 1)',
							                'rgba(93, 63, 211, 1)',
							            ],
							            borderWidth: 1
							        }]
							    },
							    options: {
							        scales: {
							            y: {
							                beginAtZero: true
							            }
							        },
							        legend: {
							            display: false
							        },
							    }
							});
							</script>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="col-sm-6">
				<div class="panel panel-primary">
					<div class="panel-heading">
						<div class="panel-title">최근 7일간 신청 현황</div>
					</div>
					<div class="panel-body">
<%	if(req_data.get(0) != 0 || req_data.get(1) != 0 || req_data.get(2) != 0 || req_data.get(3) != 0 ) { %>
						<div style="height: 300px">
							<canvas id="myChart3" style="width:100%; height:100%;"></canvas>
							<script>
							var ctx = document.getElementById('myChart3').getContext('2d');
							var myChart = new Chart(ctx, {
							    type: 'doughnut',
							    data: {
							    	labels: [
							    	    '분석도구신청',
							    	    '데이터분석신청',
							    	    '데이터수집신청',
							    	    '다운로드신청',
							    	  ],
							    	  datasets: [{
							    	    data: <%=JsonUtil.toJsonStr(req_data)%>,
							    	    backgroundColor: [
							    	      'rgb(255, 99, 132)',
							    	      'rgb(54, 162, 235)',
							    	      'rgb(255, 205, 86)',
							              'rgb(93, 63, 211)',
							    	    ],
							    	    hoverOffset: 4
							    	  }]
							    },
							});
							</script>
						</div>
<%	} else { %>
						<div style="height: 100%;padding-top: 80px;text-align: center;">
							<span style="font-size: 20px;">데이터가 존재하지 않습니다.</span>
						</div>
<%	} %>
					</div>
				</div>
			</div>
			<div class="col-sm-6">
				<div class="panel panel-primary">
					<div class="panel-heading">
						<div class="panel-title">최근 7일간 인기 검색어 TOP10</div>
					</div>
					<div class="panel-body">
						<div style="height: 300px">
							<canvas id="myChart4" style="width:100%; height:100%;"></canvas>
							<script>
							var ctx = document.getElementById('myChart4').getContext('2d');
							var myChart = new Chart(ctx, {
								type: 'bar',
								data: {
								    datasets: [{
								        data: <%=JsonUtil.toJsonStr(keyword_cnt_data)%>,
								        order: 2
								    }],
								    labels: <%=JsonUtil.toJsonStr(keyword_data)%>
								},
							    options:  {
							        scales: {
							            y: {
							                beginAtZero: true
							            }
							        },
							        legend: {
							            display: false
							        },
							    }
							});
							</script>
						</div>
					</div>
				</div>
			</div>
		</div>
				
		<br />
		
		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp" flush="false"/>
		
	</div>
</div>
</body>
<script>

</script>
</html>