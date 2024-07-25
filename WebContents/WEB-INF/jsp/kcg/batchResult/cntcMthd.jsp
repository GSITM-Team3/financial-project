<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c"      uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form"   uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="wilih=device-wilih, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
	<title>해양경찰 통합 Data-Hub</title>
	  
	<link rel="shortcut icon" href="/static_resources/asset/images/favicon.png"/>
	
	<link rel="stylesheet" href="/static_resources/asset/css/font.css"/>
	<link rel="stylesheet" href="/static_resources/asset/css/style.css"/>
	<link rel="stylesheet" href="/static_resources/asset/css/bootstrap/bootstrap.min.css"/>    
	<link rel="stylesheet" href="/static_resources/asset/css/bootstrap/bootstrap-datepicker.css"/>  
	<link rel="stylesheet" href="/static_resources/asset/css/bootstrap/bootstrap-datetimepicker.min.css"/>  
	<link rel="stylesheet" href="/static_resources/asset/css/bootstrap/jquery-ui.css"/>
		
	<script src="/static_resources/asset/js/jQuery/jquery-3.4.0.js"></script>
	<script src="/static_resources/asset/js/bootstrap/bootstrap.min.js"></script>

	<link  href="/static_resources/asset/css/datepicker/datepicker.css" rel="stylesheet">
	<script src="/static_resources/asset/js/datepicker/datepicker.js"></script>
	<script src="/static_resources/asset/js/datepicker/datepicker.ko-KR.js"></script>
	
	<script src="/static_resources/asset/js/jQuery/jquery-3.4.0.min.js" type="text/javascript"></script>

	<style type="text/css">
	.inline {
	    display: inline-block;
	    vertical-align: middle;
        font-size: 14px;
	}
	.list-top {
	    position: relative;
	    overflow: inherit;
	}
	</style>
</head>
<body>
    <div class="wrap">

		<!-- /서브이미지 및 서브타이틀 -->
		<div class="subSection01 video">
			<h2>수집/적재 결과 기록</h2>
			<h3>Batch History</h3>
		</div>
		<!-- /서브이미지 및 서브타이틀 -->
		
		<div class="cduTab">
			<ul>
				<li><a href="javascript:void(0);" onclick="fn_cntcMthd();" class="active">수집유형</a></li>
				<li><a href="javascript:void(0);" onclick="fn_system();">시스템</a></li>
				<li><a href="javascript:void(0);" onclick="fn_table();">테이블</a></li>
			</ul>
		</div>
		
		<!-- /검색 설정 -->
		<form id="searchFrm">
			<div class="inline bg_gray dateSearch">
				<span class="dateIcon">
					<input type="text" name="startDate" id="startDate" placeholder="Start date" aria-label="First name" class="date start-date" readonly="readonly">
					<i class="datepicker" target="fromDt"></i>
				</span>
				<span class="wave">~</span>
	 			<span class="dateIcon">
	 				<input type="text" name="endDate" id="endDate" placeholder="End date" aria-label="Last name" class="date end-date"  readonly="readonly">
	 				<i class="datepicker" target="toDt"></i>
				</span>
				<div class="inline selectTerm">
					<input type="button" value="전체" onclick="setSearchOptDate(this)">
					<input type="button" value="1주" onclick="setSearchOptDate(this, 'd', 7)" class="active">
					<input type="button" value="1개월" onclick="setSearchOptDate(this, 'm', 1)">
					<input type="button" value="3개월" onclick="setSearchOptDate(this, 'm', 3)">
				</div>
				<button onclick="fn_searchExt()" id="searchBtn" class="search" type="button">검색</button>
			</div>
		</form>
		<!-- //검색 설정 -->

		<!-- /목록 -->
		<div class="subSection03">			
			<div class="box resultList">
				<div class="boxTitle">
					<h4>Result List</h4>					
				</div>
				<div class="boxContents resultTable">
					<div class="list-top">
						<span class="count float-l"></span>
						<div class="selectChoice">
							<select name="status" id="status" onchange="fn_searchExt()">
								<option value="">전체</option>
								<option value="SUCCESS">Success</option>
								<option value="FAILURE" selected>Failure</option>
							</select>
						</div>
					</div>
					<div class="resultTableList">
						<table>
							<colgroup>
								<col width="10%"/>
								<col width="10%"/>
								<col width="10%"/>
								<col width="10%"/>
								<col width="10%"/>
								<col width="10%"/>
								<col width="10%"/>
								<col width="10%"/>
								<col width="10%"/>
								<col width="10%"/>
							</colgroup>
							<thead>
								<tr>
									<th>날짜</th>
									<th>수집유형</th>
									<th>수집결과</th>
									<th>시작시간</th>
									<th>종료시간</th>
									<th>소요시간</th>
									<th>수집레코드</th>
									<th>누적수집레코드</th>
									<th>레코드증감</th>
									<th>검증결과</th>
								</tr>
							</thead>
							<tbody class="resultTbody">
								<!-- 표 데이터 -->
							</tbody>
						</table>
						<div class="paging">
							<!-- 페이징 -->
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- /시스템 & 테이블목록 -->
	</div>
	
<script type="text/javascript">
	/* 스크롤시 헤더 영역 색상 변경 */
	$(window).scroll(function(event){
		// 스크롤 발생시
		if($(window).scrollTop() > 0){
			$(".topmenu").css("background-color", "#242a35");
		// 스크롤이 최상단인 경우
		}else{
			$(".topmenu").css("background-color", "rgba(0,0,0,.5)");
		}
	});
	
	// 수집 유형 버튼
	function fn_cntcMthd() {
		location.href = "cntcMthd";
	}
	
	// 시스템 버튼
	function fn_system() {
		location.href = "system";
	}
	
	// 테이블 버튼
	function fn_table() {
		location.href = "table";
	}

	var $startDate = $('.start-date');
	var $endDate = $('.end-date');
	var pageNo = 1;
	var step = 1;
	
	// 초기 날짜 설정()
	$(function(){
	    $.ajax({
	        type : "GET",
	        url : "<c:url value='/batchResult/ajax/selectBatchResultList?step=" + step + "&pageIndex=" + pageNo + "'/>",
	        success : function(returnData, status) {
	            if(status == "success") {
	            	var endDate = str_to_date(returnData.list[0].plannedDt);
	            	var startDate = str_to_date(returnData.list[0].plannedDt).setDate(endDate.getDate() - 7);
	            	console.log(endDate.getDate() -7);
	        	    
	        	    $startDate.datepicker({
	        			date: startDate,
	        	    	format: 'yyyy.mm.dd',
	        	    	language: 'ko-KR',
	        	    	autoHide: true,
	        	        endDate: endDate,
	        	        autoPick : true
	        	    });
	        	
	        	    $endDate.datepicker({
	        	    	date: endDate,
	        	    	format: 'yyyy.mm.dd',
	        	    	language: 'ko-KR',
	        	        autoHide: true,
	        	        startDate: $startDate.datepicker('getDate'),
	        	        endDate: new Date(),
	        	        autoPick : true
	        	    });
	        	    
	        	    fn_batchresult(step, pageNo);

	        		$('.dateSearch .txtinput').keydown(function(e) {
	        			if (e.keyCode == '13') {
	        				event.preventDefault();
	        				fn_searchExt();
	        			}
	        		});
	            }
	        },
	        error: function (xhr, ajaxOptions, thrownError) {
	            
	            alert(xhr.status);
	        }
	    });
		
	});
	
	// convert string to date
	function str_to_date(date_str) {
	    var yyyyMMdd = String(date_str);
	    var sYear = yyyyMMdd.substring(0,4);
	    var sMonth = yyyyMMdd.substring(5,7);
	    var sDate = yyyyMMdd.substring(8,10);

	    return new Date(Number(sYear), Number(sMonth)-1, Number(sDate));
	}
	
	// 배치 결과 검색 버튼
	function fn_searchExt() {
		fn_batchresult(step, pageNo);
	}
	
	// datepicker 설정
	function setSearchOptDate(e, format, term) {
		$.ajax({
	        type : "GET",
	        url : "<c:url value='/batchResult/ajax/selectBatchResultList?step=" + step + "&pageIndex=" + pageNo + "'/>",
	        success : function(returnData, status) {
	            if(status == "success") {
	            	if(term != null) {
	            		var endDate = str_to_date(returnData.list[0].plannedDt);
	        			var startDate = new Date();
	        			if (format == 'd'){
	        				startDate = str_to_date(returnData.list[0].plannedDt).setDate(endDate.getDate() - term);
	        			} else if (format == 'm') {
	        				startDate = str_to_date(returnData.list[0].plannedDt).setMonth(endDate.getMonth() - term);
	        			}

	        			$startDate.datepicker('setDate', new Date(startDate));
	        		    $endDate.datepicker('setDate', endDate);
	        	       	
	        	      	$startDate.on('change', function () { 
	        	        	$endDate.datepicker('setStartDate', $startDate.datepicker('getDate'));
	        	        });
	        			$startDate.attr('disabled', false);
	        			$endDate.attr('disabled', false);
	        		} else {
	        			$startDate.attr('disabled', true);
	        			$endDate.attr('disabled', true);
	        		}
	              	
	              	$(".dateSearch #selectTerm").removeClass();
	              	$(e).addClass("active");
	              	
	              	fn_batchresult(step, pageNo)
	            }
	        },
	        error: function (xhr, ajaxOptions, thrownError) {
	            
	            alert(xhr.status);
	        }
	    });
	}
	
	// null 판별
	function fn_isEmpty(value){
	    if(value == null || value.length === 0) {
	           return "-";
	     } else{
	            return value;
	     }
	}
	
	// 배치결과 테이블
	function fn_batchresult(step, pageNo) {
		var data = $('#searchFrm').serialize();
		
		var batchstatus = document.getElementById("status").options[document.getElementById("status").selectedIndex].value;
		
	    $.ajax({
	        type : "GET",
	        url : "<c:url value='/batchResult/ajax/selectBatchResultList?step=" + step + "&pageIndex=" + pageNo + "&status=" + batchstatus + "'/>",
	        data: data,
	        success : function(returnData, status) {
	            if(status == "success") {
	            	var count = returnData.count;
	                var list = returnData.list;
	                var paginationInfo = returnData.paginationInfo;
	                
					$(".count").empty();
					$(".resultTbody").empty();
					$(".paging").empty();
	                
					// 건 수
					var str_count = '전체&nbsp;<strong>' + count + '</strong>건'
					$(".count").append(str_count);
					
					// 테이블
	                if(list.length > 0){
	                	/* 표 생성 */
	                	var str = '';
	                	$.each(list, function(i, value){
							str += '<tr>'
							str += '<td>' + value.plannedDt + '</td>'
							str += '<td>' + value.cntcMthdNm + '</td>'
							str += '<td>' + fn_isEmpty(value.status) + '</td>'
							str += '<td>' + fn_isEmpty(value.actualBeginDt) + '</td>'
							str += '<td>' + fn_isEmpty(value.actualEndDt) + '</td>'
							str += '<td>' + fn_isEmpty(value.strElapsed) + '</td>'
							str += '<td>' + fn_isEmpty(value.records) + '</td>'
							str += '<td>' + fn_isEmpty(value.accumulatedRecords) + '</td>'
							str += '<td>' + fn_isEmpty(value.increasedAccumulatedRecords) + '</td>'
							str += '<td>' + fn_isEmpty(value.verify) + '</td>'
							str += '</tr>'
	                	});
	                	$(".resultTbody").append(str);
	                		
	                		
	                	// 페이징
                		var page_str = "";
						page_str += '<ol>';
						var prev = 1
						if(paginationInfo.currentPageNo <= paginationInfo.pageSize) {
							prev = 1
						} else {
							prev = paginationInfo.firstPageNoOnPageList - 1
						}
						page_str += '<li class="first" onclick="fn_egov_link_page(' + prev + '); return false;">〈</li>'
						for(var i=0; i < (paginationInfo.lastPageNoOnPageList - paginationInfo.firstPageNoOnPageList + 1); i++){
							var pageNoOnPageList = paginationInfo.firstPageNoOnPageList + i;
							if (paginationInfo.currentPageNo == pageNoOnPageList) {
								page_str += '<li class="active">' + pageNoOnPageList + '</li>'
							} else {
								page_str += '<li onclick="fn_egov_link_page(' + pageNoOnPageList + '); return false;">' + pageNoOnPageList + '</li>'
							}
						}
						var next = 1
						if(paginationInfo.firstPageNoOnPageList + paginationInfo.pageSize - 1 != paginationInfo.lastPageNoOnPageList) {
							next = paginationInfo.lastPageNoOnPageList
						} else {
							next = paginationInfo.lastPageNoOnPageList + 1
						}
						page_str += '<li class="last" onclick="fn_egov_link_page(' + next + '); return false;">〉</li>'
		                page_str += '</ol>';
		                $(".paging").append(page_str);
	                	
	                	
	                } else {
						$(".count").empty();
						$(".resultTbody").empty();
						$(".paging").empty();
		                
						// 건 수
						var str_count = '전체&nbsp;<strong>' + count + '</strong>건'
						$(".count").append(str_count);
	                	var str = $("<p/>").text("데이터가 없습니다.");
	                	$(".paging").append(str);
	                }
	            }
	        },
	        error: function (xhr, ajaxOptions, thrownError) {
	            
	            alert(xhr.status);
	        }
	    });
	}
	
	/* pagination 페이지 링크 function */
    function fn_egov_link_page(pageNo){
    	fn_batchresult(step, pageNo);
    }
</script>

</body>
</html>