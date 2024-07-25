<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">
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
<title>상품 목록</title>
<style>
.pagination-container {
	display: flex;
	justify-content: center;
}
</style>
<script>
// 페이지 링크 클릭 시 페이지 이동 처리
// 페이지 링크 클릭 시 페이지 이동 처리
function navigatePage(page) {
    var url = '/prod_th/prodList_th?page=' + page;

    // 검색어 파라미터 추가
    var productName = $('#productName').val();
    var paymentCycle = $('#paymentCycle').val();
    var subscriptionType = $('#subscriptionType').val();
    var salesState = $('#salesState').val();
    if (productName) {
        url += '&productName=' + encodeURIComponent(productName);
    }
    if (paymentCycle) {
        url += '&paymentCycle=' + encodeURIComponent(paymentCycle);
    }
    if (subscriptionType) {
        url += '&subscriptionType=' + encodeURIComponent(subscriptionType);
    }
    if (salesState) {
        url += '&salesState=' + encodeURIComponent(salesState);
    }

    // 이동
    window.location.href = url;
}

$(document).ready(function() {
    // 검색 폼 제출 시
    $('#searchForm').submit(function(event) {
        event.preventDefault(); // 폼 제출 기본 동작 막기
        var productName = $('#productName').val();
        var paymentCycle = $('#paymentCycle').val();
        var subscriptionType = $('#subscriptionType').val();
        var salesState = $('#salesState').val();
        
        var url = '/prod_th/prodList_th?page=1'; // 페이지 초기화
        if (productName) {
            url += '&productName=' + encodeURIComponent(productName);
        }
        if (paymentCycle) {
            url += '&paymentCycle=' + encodeURIComponent(paymentCycle);
        }
        if (subscriptionType) {
            url += '&subscriptionType=' + encodeURIComponent(subscriptionType);
        }
        if (salesState) {
            url += '&salesState=' + encodeURIComponent(salesState);
        }
        
        window.location.href = url; // URL 변경하여 페이지 새로고침
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

			<div>
				<h1>상품 목록 조회</h1>
				<div class="card mb-4">
					<div class="card-body">
						<form action="" method="get">
							<div class="form-row">
								<div>
									<label for="productName">상품명</label> <input type="text"
										id="productName" name="productName"
										value="${param.productName}">
								</div>
								<div>
									<label for="paymentCycle">납입주기</label> <select
										id="paymentCycle" name="paymentCycle">
										<option value="">전체</option>
										<option value="1"
											${param.paymentCycle == '1' ? 'selected' : ''}>월납</option>
										<option value="7"
											${param.paymentCycle == '7' ? 'selected' : ''}>주납</option>
										<option value="9"
											${param.paymentCycle == '9' ? 'selected' : ''}>일시납</option>
									</select>
								</div>
								<%-- <div>
                           <label for="subscriptionType">가입대상</label> <select
                              id="subscriptionType" name="subscriptionType">
                              <option value="">전체</option>
                              <option value="1"
                                 ${param.subscriptionType == '1' ? 'selected' : ''}>일반</option>
                              <option value="2"
                                 ${param.subscriptionType == '2' ? 'selected' : ''}>다자녀</option>
                              <option value="3"
                                 ${param.subscriptionType == '3' ? 'selected' : ''}>청년</option>
                           </select>
                        </div> --%>
								<div>
									<label for="salesState">판매 상태</label> <select id="salesState"
										name="salesState">
										<option value="">전체</option>
										<option value="1" ${param.salesState == '1' ? 'selected' : ''}>판매준비</option>
										<option value="2" ${param.salesState == '2' ? 'selected' : ''}>판매중</option>
										<option value="3" ${param.salesState == '3' ? 'selected' : ''}>판매중지</option>
									</select>
								</div>
								<div class="align-self-end">
									<button type="submit" class="btn btn-primary w-100">검색</button>
								</div>
							</div>
						</form>
					</div>
				</div>
				<div class="card">
					<div class="card-header bg-light">
						<h4 class="mb-0">상품 정보</h4>
					</div>
					<div class="card-body p-0">
						<div class="table-responsive">
							<table class="table table-hover mb-0">
								<thead>
									<tr>
										<th>상품명</th>
										<th>상품유형</th>
										<th>가입대상</th>
										<th>최소가입금액</th>
										<th>최대가입금액</th>
										<th>납입주기</th>
										<th>이율</th>
										<th>이자 과세</th>
										<th>판매 상태</th>
									</tr>
								</thead>
								<tbody>
									<c:if test="${not empty prodList}">
										<c:forEach var="product" items="${prodList}">
											<c:set var="nameMatch"
												value="${empty param.productName or fn:contains(product.prod_name, param.productName)}" />
											<c:set var="cycleMatch"
												value="${empty param.paymentCycle or product.prod_pay_cy eq param.paymentCycle}" />
											<c:set var="subscriptionMatch"
												value="${empty param.subscriptionType or product.prod_subscrip_type eq param.subscriptionType}" />
											<c:set var="stateMatch"
												value="${empty param.salesState or product.prod_sales_state eq param.salesState}" />

											<c:if
												test="${nameMatch and cycleMatch and subscriptionMatch and stateMatch}">
												<tr>
													<td>${product.prod_name}</td>
													<td>${product.prod_type}</td>
													<td><c:choose>
															<c:when test="${product.prod_subscrip_type eq '1'}">일반</c:when>
															<c:when test="${product.prod_subscrip_type eq '2'}">다자녀</c:when>
															<c:when test="${product.prod_subscrip_type eq '3'}">청년</c:when>
														</c:choose></td>
													<td><fmt:formatNumber value="${product.prod_min_amt}"
															pattern="#,##0" /></td>
													<td><fmt:formatNumber value="${product.prod_max_amt}"
															pattern="#,##0" /></td>
													<td><c:choose>
															<c:when test="${product.prod_pay_cy eq '1'}">월납</c:when>
															<c:when test="${product.prod_pay_cy eq '7'}">주납</c:when>
															<c:when test="${product.prod_pay_cy eq '9'}">일시납</c:when>
															<c:otherwise>${product.prod_pay_cy}</c:otherwise>
														</c:choose></td>
													<td>${product.prod_air}%</td>
													<td><c:choose>
															<c:when test="${product.prod_tax_type eq '1'}">일반과세</c:when>
															<c:when test="${product.prod_tax_type eq '2'}">세금우대</c:when>
															<c:otherwise>${product.prod_tax_type}</c:otherwise>
														</c:choose></td>
													<td><c:choose>
															<c:when test="${product.prod_sales_state eq '1'}">
																<span class="badge badge-warning">판매준비</span>
															</c:when>
															<c:when test="${product.prod_sales_state eq '2'}">
																<span class="badge badge-success">판매중</span>
															</c:when>
															<c:when test="${product.prod_sales_state eq '3'}">
																<span class="badge badge-secondary">판매중지</span>
															</c:when>
															<c:otherwise>
																<span class="badge badge-info">${product.prod_sales_state}</span>
															</c:otherwise>
														</c:choose></td>
												</tr>
											</c:if>
										</c:forEach>
									</c:if>
									<c:if test="${empty prodList}">
										<tr>
											<td colspan="9" class="text-center">상품이 없습니다.</td>
										</tr>
									</c:if>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

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
</body>
</html>
