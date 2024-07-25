<%@ page language="java" contentType="text/html; charset=UTF-8"
   pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>설계 리스트</title>
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
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script>
// 페이지 링크 클릭 시 페이지 이동 처리
function navigatePage(page) {
    var url = '/promotion_th/designList_th?page=' + page;

    // 검색어 파라미터 추가
    var searchCategory = $('#searchCategory').val();
    var searchKeyword = $('#searchKeyword').val();
    if (searchCategory && searchKeyword) {
        url += '&searchCategory=' + searchCategory + '&searchKeyword=' + searchKeyword;
    }
    
    // 이동
    window.location.href = url;
}

$(document).ready(function() {
    // 검색 폼 제출 시
    $('#searchForm').submit(function(event) {
        event.preventDefault(); // 폼 제출 기본 동작 막기
        var searchCategory = $('#searchCategory').val();
        var searchKeyword = $('#searchKeyword').val();
        var url = '/promotion_th/designList_th?page=1'; // 페이지 초기화
        if (searchCategory && searchKeyword) {
            url += '&searchCategory=' + searchCategory + '&searchKeyword=' + searchKeyword;
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
            <h1>설계 이력 조회</h1>
            <div class="card mb-4">
               <div class="card-body">
                  <form id="searchForm" action="/promotion_th/designList_th" method="get">
                     
                        <div >
                           <label for="searchCategory">검색 조건</label> 
                           <select id="searchCategory" name="searchCategory">
                              <option value="user_id" ${param.searchCategory == 'user_id' ? 'selected' : ''}>담당자ID</option>
                              <option value="cust_name" ${param.searchCategory == 'cust_name' ? 'selected' : ''}>고객명</option>
                              <option value="prod_name" ${param.searchCategory == 'prod_name' ? 'selected' : ''}>상품명</option>
                           </select>
                           <input type="text" id="searchKeyword" name="searchKeyword" value="${param.searchKeyword}">
                        	<button type="submit" class="btn btn-custom">검색</button>
                        </div>                     
                  </form>
               </div>
            </div>

            <!-- 테이블 -->
            <div class="card">
               <div class="card-header bg-light">
                  <h4 class="mb-0">상품 정보</h4>
               </div>
               <div class="card-body p-0">
                  <div class="table-responsive">
                     <table id="proposalTable" class="table table-hover mb-0">
                        <thead>
                           <tr>
                              <th>고객명</th>
                              <th>상품 유형</th>
                              <th>상품명</th>
                              <th>제안일</th>
                              <th>제안금액</th>
                              <th>담당자</th>
                              <th>진행상태</th>
                           </tr>
                        </thead>
                        <tbody>
                           <c:choose>
                              <c:when test="${not empty designList}">
                                 <c:set var="hasMatches" value="false" />
                                 <c:forEach var="design" items="${designList}">
                                    <c:set var="matches" value="true" />

                                    <c:choose>
                                       <c:when test="${param.searchCategory == 'user_id' and not empty param.searchKeyword}">
                                          <c:if test="${not fn:contains(design.user_id, param.searchKeyword)}">
                                             <c:set var="matches" value="false" />
                                          </c:if>
                                       </c:when>
                                       <c:when test="${param.searchCategory == 'cust_name' and not empty param.searchKeyword}">
                                          <c:if test="${not fn:contains(design.cust_name, param.searchKeyword)}">
                                             <c:set var="matches" value="false" />
                                          </c:if>
                                       </c:when>
                                       <c:when test="${param.searchCategory == 'prod_name' and not empty param.searchKeyword}">
                                          <c:if test="${not fn:contains(design.prod_name, param.searchKeyword)}">
                                             <c:set var="matches" value="false" />
                                          </c:if>
                                       </c:when>
                                    </c:choose>

                                    <c:if test="${matches}">
                                       <tr>
                                          <td>${design.cust_name}</td>
                                          <td>${design.prod_type}</td>
                                          <td><a href="designDetail?plan_code=${design.plan_code}">${design.prod_name}</a></td>
                                          <td>${design.plan_created_at}</td>
                                          <td><fmt:formatNumber type="number" value="${design.plan_amt}" maxFractionDigits="0" /></td>
                                          <td>${design.user_id}</td>
                                          <td><c:choose>
                                                <c:when test="${design.plan_state eq '1'}">제안완료</c:when>
                                                <c:when test="${design.plan_state eq '2'}">가입완료</c:when>
                                             </c:choose></td>
                                       </tr>
                                       <c:set var="hasMatches" value="true" />
                                    </c:if>
                                 </c:forEach>
                                 <c:if test="${not hasMatches}">
                                    <tr>
                                       <td colspan="7" class="text-center">검색결과가 없습니다.</td>
                                    </tr>
                                 </c:if>
                              </c:when>
                              <c:otherwise>
                                 <tr>
                                    <td colspan="7" class="text-center">설계 이력이 없습니다.</td>
                                 </tr>
                              </c:otherwise>
                           </c:choose>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>

         <!-- 페이징 처리 -->
         <nav aria-label="Page navigation">
            <div class="pagination-container">
               <ul class="pagination">
                  <c:if test="${currentPage > 1}">
                     <li class="page-item"><a class="page-link" href="#" onclick="navigatePage(${currentPage - 1})" aria-label="Previous"> <span aria-hidden="true">&laquo;</span>
                     </a></li>
                  </c:if>

                  <c:set var="startPage" value="${currentPage - 2 > 0 ? currentPage - 2 : 1}" />
                  <c:set var="endPage" value="${currentPage + 2 > totalPages ? totalPages : currentPage + 2}" />

                  <c:if test="${endPage - startPage < 4 && totalPages > 5}">
                     <c:set var="startPage" value="${endPage - 4 > 0 ? endPage - 4 : 1}" />
                  </c:if>

                  <c:forEach var="i" begin="${startPage}" end="${endPage}">
                     <li class="page-item ${i == currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="navigatePage(${i})">${i}</a>
                     </li>
                  </c:forEach>

                  <c:if test="${currentPage < totalPages}">
                     <li class="page-item"><a class="page-link" href="#" onclick="navigatePage(${currentPage + 1})" aria-label="Next"> <span aria-hidden="true">&raquo;</span>
                     </a></li>
                  </c:if>
               </ul>
            </div>
         </nav>

      </div>
   </div>
</body>
</html>
