<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp"
	flush="false" />
<!-- Custom CSS -->
<link rel="stylesheet"
	href="/static_resources/system/js/datatables/datatables.css">
<link rel="stylesheet"
	href="/static_resources/system/js/datatables/proddtl.css">
<link rel="stylesheet"
	href="/static_resources/system/js/select2/select2-bootstrap.css">
<link rel="stylesheet"
	href="/static_resources/system/js/select2/select2.css">
<title>직원 주소록</title>
<script>
	function formatPhoneNumbers() {
		$('.phoneNumber').each(
				function() {
					var phoneNumber = $(this).text();
					var formattedPhoneNumber = phoneNumber.replace(
							/(\d{3})(\d{4})(\d{3,4})/, '$1-$2-$3');
					$(this).text(formattedPhoneNumber);
				});
	}
	function navigatePage(page) {
	    var url = '/community_th/directoryList_th?page=' + page;

	    // 상태 필터링 파라미터 추가
	    var statusFilter = $('#statusFilter').val();
	    if (statusFilter && statusFilter !== 'all') {
	        url += '&statusFilter=' + statusFilter;
	    }

	    // 이동
	    window.location.href = url;
	}
</script>
<style>
.btn-custom {
	color: #ffffff;
	background-color: #000000;
	border-color: #000000;
}

.btn-custom:hover {
	color: #ffffff;
}

.pagination-container {
	display: flex;
	justify-content: center;
}
</style>
</head>
<body class="page-body">

	<div class="page-container">
		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp"
			flush="false" />
		<div class="main-content">
			<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp"
				flush="false" />

			<div>
				<h1>직원 주소록</h1>

				<div class="statusDiv">
					<form id="stateSearchForm" action="/cust_th/custList_th"
						method="GET">
						<label for="statusFilter">부서명</label> <select id="statusFilter"
							name="statusFilter">
							<option value="all"
								${param.statusFilter == 'all' ? 'selected' : ''}>전체</option>
							<option value="개발"
								${param.statusFilter == '개발' ? 'selected' : ''}>개발</option>
							<option value="마케팅"
								${param.statusFilter == '마케팅' ? 'selected' : ''}>마케팅</option>
						</select>

						<button type="submit" class="btn btn-custom">검색</button>
					</form>
				</div>
				<%-- 				<div>
					<div class="card mb-4">
						<div class="statusDiv">
							<form id="stateSearchForm" action="/community_th/directory_th"
								method="GET">
								<label for="deptValue">부서명</label> <select id="deptValue"
									name="deptValue">
									<option value="">전체</option>
											<option value="개발"
												${param.deptValue == '개발' ? 'selected' : ''}>개발</option>
											<option value="마케팅"
												${param.deptValue == '마케팅' ? 'selected' : ''}>마케팅</option>
								</select>

								<button type="submit" class="btn btn-custom">검색</button>
							</form>
						</div>
					</div>
				</div> --%>
				<hr>

				<table class="table" id="grid_app">
					<thead>
						<tr class="replace-inputs">
							<th>직원아이디</th>
							<th>직원명</th>
							<th>이메일</th>
							<th>연락처</th>
							<th>부서</th>
							<th>직위</th>
						</tr>
					</thead>
					<tbody>
						<c:if test="${not empty commuList}">
							<c:forEach var="commu" items="${commuList}">
								<tr>
									<td>${commu.user_id}</td>
									<td>${commu.name}</td>
									<td>${commu.email}</td>
									<td><span class="phoneNumber">${commu.pic_mbl_telno}</span></td>
									<td>${commu.dept}</td>
									<td>${commu.jikgub_nm}</td>
								</tr>
							</c:forEach>
						</c:if>
						<c:if test="${empty commuList}">
							<tr>
								<td colspan="6" class="text-center">직원 주소록 데이터가 없습니다.</td>
							</tr>
						</c:if>
					</tbody>
				</table>


				<!-- 페이징 처리 -->
				<nav aria-label="Page navigation">
					<div class="pagination-container">
						<ul class="pagination">
							<c:if test="${currentPage > 1}">
								<li class="page-item"><a class="page-link" href="#"
									onclick="navigatePage(${currentPage - 1})"
									aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
							</c:if>

							<!-- 페이지 링크는 현재 페이지를 가운데로 하여 5개까지만 표시 -->
							<c:set var="startPage"
								value="${currentPage - 2 > 0 ? currentPage - 2 : 1}" />
							<c:set var="endPage"
								value="${startPage + 4 > totalPages ? totalPages : startPage + 4}" />
							<c:if test="${endPage - startPage < 4}">
								<c:set var="startPage"
									value="${endPage - 4 > 0 ? endPage - 4 : 1}" />
							</c:if>

							<c:forEach var="i" begin="${startPage}" end="${endPage}">
								<li class="page-item ${i == currentPage ? 'active' : ''}"><a
									class="page-link" href="#" onclick="navigatePage(${i})">${i}</a>
								</li>
							</c:forEach>

							<c:if test="${currentPage < totalPages}">
								<li class="page-item"><a class="page-link" href="#"
									onclick="navigatePage(${currentPage + 1})" aria-label="Next"><span
										aria-hidden="true">&raquo;</span></a></li>
							</c:if>
						</ul>
					</div>
				</nav>


			</div>
		</div>
	</div>

	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<script>
		$(document).ready(function() {
			// 페이지 로드 후 실행될 스크립트
			formatPhoneNumbers();
		});
		// 상태 필터링 폼 제출 시
		$('#stateSearchForm').submit(function(event) {
			event.preventDefault(); // 폼 제출 기본 동작 막기
			var statusFilter = $('#statusFilter').val();
			var url = '/community_th/directoryList_th?page=1'; // 페이지 초기화
			if (statusFilter && statusFilter !== 'all') {
				url += '&statusFilter=' + statusFilter;
			}
			window.location.href = url; // URL 변경하여 페이지 새로고침
		});
	</script>
</body>
</html>
