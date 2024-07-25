<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp"
	flush="false" />
<!-- Imported styles on this page -->
<link rel="stylesheet"
	href="/static_resources/system/js/datatables/datatables.css">
<link rel="stylesheet"
	href="/static_resources/system/js/datatables/proddtl.css">
<link rel="stylesheet"
	href="/static_resources/system/js/select2/select2-bootstrap.css">
<link rel="stylesheet"
	href="/static_resources/system/js/select2/select2.css">

<script
	src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

<style>
/* 모달 스타일링 */
.modal {
	display: none;
	position: fixed;
	z-index: 1000;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: rgba(0, 0, 0, 0.5); /* 반투명한 배경 */
}

.modal-content {
	background-color: #fefefe;
	margin: 15% auto; /* 화면 중앙에 위치 */
	padding: 20px;
	border: 1px solid #888;
	width: 80%;
	max-width: 600px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	height: 50%; /* 모달 최대 높이 설정 */
	overflow-y: auto; /* 세로 스크롤 설정 */
}

.close {
	color: #aaa;
	position: absolute;
	top: 10px; /* 원하는 위치로 조정 */
	right: 15px; /* 원하는 위치로 조정 */
	font-size: 28px;
	font-weight: bold;
}

.close:hover, .close:focus {
	color: black;
	text-decoration: none;
	cursor: pointer;
}

.cust-row {
	cursor: pointer; /* 마우스를 올리면 포인터 모양으로 변경 */
}

.cust-row:hover {
	background-color: #f0f0f0; /* hover 시 배경색 변경 */
}

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

<script>
// 페이지 링크 클릭 시 페이지 이동 처리
function navigatePage(page) {
    var url = '/cust_th/custList_th?page=' + page;

    // 검색어 파라미터 추가
    var searchBy = $('#searchBy').val();
    var searchInput = $('#searchInput').val();
    if (searchBy && searchInput) {
        url += '&searchBy=' + searchBy + '&searchInput=' + searchInput;
    }
    
    //달력 파라미터 추가
    var birthDate = $('#birthDatePicker').val();
    if (birthDate) {
        url += '&birthDatePicker=' + birthDate;
    }

    // 상태 필터링 파라미터 추가
    var statusFilter = $('#statusFilter').val();
    if (statusFilter && statusFilter !== 'all') {
        url += '&statusFilter=' + statusFilter;
    }

    // 이동
    window.location.href = url;
}

    $(document).ready(function() {
       
       // 검색 폼 제출 시
        $('#searchForm').submit(function(event) {
            event.preventDefault(); // 폼 제출 기본 동작 막기
            var searchBy = $('#searchBy').val();
            var searchInput = $('#searchInput').val();
            var url = '/cust_th/custList_th?page=1'; // 페이지 초기화
            if (searchBy && searchInput) {
                url += '&searchBy=' + searchBy + '&searchInput=' + searchInput;
            }
            window.location.href = url; // URL 변경하여 페이지 새로고침
        });
       
       //달력 필터링 폼 제출 시
    $('#birthSearchForm').submit(function(event) {
        event.preventDefault(); // 폼 제출 기본 동작 막기
        var birthDate = $('#birthDatePicker').val();
        var url = '/cust_th/custList_th?page=1'; // 페이지 초기화
        if (birthDate) {
            url += '&birthDatePicker=' + birthDate;
        }
        window.location.href = url; // URL 변경하여 페이지 새로고침
    });

        // 상태 필터링 폼 제출 시
        $('#stateSearchForm').submit(function(event) {
            event.preventDefault(); // 폼 제출 기본 동작 막기
            var statusFilter = $('#statusFilter').val();
            var url = '/cust_th/custList_th?page=1'; // 페이지 초기화
            if (statusFilter && statusFilter !== 'all') {
                url += '&statusFilter=' + statusFilter;
            }
            window.location.href = url; // URL 변경하여 페이지 새로고침
        });
       
        
        // 고객 행 클릭 이벤트 처리
        $('.cust-row').click(function() {
            // 클릭된 고객의 코드 가져오기
            var custCode = $(this).find('td:first').text();
            
            // Ajax를 통해 고객의 상담 내역 가져오기
            $.ajax({
                url: '/cust_th/custConsult_th',
                type: 'GET',
                data: {
                    cust_code: custCode
                },
                contentType: 'application/json; charset=utf-8',
                success: function(data) {
                    // 모달 내용 설정
                    $('#modal-content').html(data);
                    // 모달 보이기
                    $('#myModal').css('display', 'block');
                    $('.modal-content').scrollTop($('.modal-content')[0].scrollHeight);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching consultation data:', error);
                    alert('상담 내역을 가져오는 중 오류가 발생했습니다.');
                }
            });
        });
        
        // 모달 닫기 버튼 처리
        $('.close').click(function() {
            $('#myModal').css('display', 'none');
            //화면 리로드
            location.reload();
        });
    });
    </script>

</head>
<body class="page-body">

	<div class="page-container">

		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp"
			flush="false" />

		<div class="main-content">

			<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp"
				flush="false" />
			<h1>고객 정보 목록</h1>

			<!-- 검색 기능 -->
			<div class="searchDiv">
				<form id="searchForm" action="/cust_th/custList_th" method="GET">
					<select id="searchBy" name="searchBy">
						<option value="cust_code"
							${param.searchBy == 'cust_code' ? 'selected' : ''}>고객코드</option>
						<option value="cust_name"
							${param.searchBy == 'cust_name' ? 'selected' : ''}>고객명</option>
						<option value="cust_phonenum"
							${param.searchBy == 'cust_phonenum' ? 'selected' : ''}>전화번호</option>
						<option value="user_id"
							${param.searchBy == 'user_id' ? 'selected' : ''}>담당자명</option>
					</select> <input type="text" id="searchInput" name="searchInput"
						placeholder="검색어를 입력하세요" value="${param.searchInput}">
					<button type="submit" class="btn btn-custom">검색</button>
				</form>
			</div>

			<!-- 달력 기능 -->
			<div class="birthDiv">
				<form id="birthSearchForm" action="/cust_th/custList_th"
					method="GET">
					<input type="date" id="birthDatePicker" name="birthDatePicker"
						value="${param.birthDatePicker}">
					<button type="submit" id="calendarSearchBtn" class="btn btn-custom">검색</button>
				</form>
			</div>

			<!-- 상태 필터링 -->
			<div class="statusDiv">
				<form id="stateSearchForm" action="/cust_th/custList_th"
					method="GET">
					<select id="statusFilter" name="statusFilter">
						<option value="all"
							${param.statusFilter == 'all' ? 'selected' : ''}>전체 상태</option>
						<option value="1" ${param.statusFilter == '1' ? 'selected' : ''}>가입상태</option>
						<option value="2" ${param.statusFilter == '2' ? 'selected' : ''}>탈퇴상태</option>
					</select>

					<button type="submit" class="btn btn-custom">검색</button>
				</form>
			</div>

			<table class="table" id="grid_app">
				<thead>
					<tr class="replace-inputs">
						<th class="center">고객코드</th>
						<th class="center">고객명</th>
						<th class="center">생년월일</th>
						<th class="center">전화번호</th>
						<th class="center">성별</th>
						<th class="center">고객특성</th>
						<th class="center">담당자</th>
					</tr>
				</thead>
				<tbody>
					<c:if test="${empty custList}">
						<tr>
							<td colspan="6" class="center">데이터가 없습니다.</td>
						</tr>
					</c:if>
					<c:forEach items="${custList}" var="custList">

						<tr style="text-align: center;" class="cust-row"
							data-cust-state="${custList.cust_state}">
							<td data-cust-code="${custList.cust_code}">${custList.cust_code}</td>
							<td data-cust-name="${custList.cust_name}"
								data-cust-code="${custList.cust_code}">${custList.cust_name}</td>
							<td data-cust-birth="${custList.cust_birth}">${custList.cust_birth}</td>
							<td data-cust-phonenum="${custList.cust_phonenum}">${custList.cust_phonenum}</td>
							<td>${custList.cust_gen}</td>
							<td><c:if test="${custList.cust_type == '1'}">일반</c:if> <c:if
									test="${custList.cust_type == '2'}">다자녀</c:if> <c:if
									test="${custList.cust_type == '3'}">청년</c:if></td>
							<td data-user-id="${custList.user_id}">${custList.user_id}</td>
						</tr>

					</c:forEach>
				</tbody>
			</table>
			<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp"
				flush="false" />

			<!-- 페이징 처리 -->
			<nav aria-label="Page navigation">
				<div class="pagination-container">
					<ul class="pagination justify-content-center">
						<c:if test="${currentPage > 1}">
							<li class="page-item"><a class="page-link" href="#"
								onclick="navigatePage(${currentPage - 1})" aria-label="Previous"><span
									aria-hidden="true">&laquo;</span></a></li>
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

	<!-- 모달 -->
	<div id="myModal" class="modal">
		<div class="modal-content" style="padding-bottom: 0px;">
			<span class="close">&times;</span>
			<!-- 모달 내용 -->
			<div id="modal-content"></div>
		</div>
	</div>

</body>
</html>
