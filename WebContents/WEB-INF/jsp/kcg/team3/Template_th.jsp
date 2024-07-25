<%@ page language="java" contentType="text/html; charset=UTF-8"
   pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>템플릿 목록</title>
    <jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false" />
    <!-- Custom CSS -->
    <link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">
    <link rel="stylesheet" href="/static_resources/system/js/datatables/proddtl.css">
    <link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">
    <link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">
    <style>
        .pagination-container {
            display: flex;
            justify-content: center;
        }
    </style>
</head>

<body class="page-body">
    <div class="page-container">
        <jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp" flush="false" />

        <div class="main-content">

            <jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp" flush="false" />

            <div>
                <h1>템플릿 목록</h1>
                <a href="/share_th/createTemplateView_th" class="btn btn-primary">템플릿
                    등록</a>
                <hr>

                <table class="table" id="grid_app">
                    <thead>
                        <tr class="replace-inputs">
                            <th>글번호</th>
                            <th>제목</th>
                            <th>작성일</th>
                            <th>작성자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="template" items="${templateList}">
                            <tr>
                                <td>${template.gw_code}</td>
                                <td><a href="/share_th/templateOne/${template.gw_code}">${template.gw_title}</a></td>
                                <td>${template.gw_created_at}</td>
                                <td>${template.user_id}</td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>

                <!-- 페이징 처리 -->
                <nav aria-label="Page navigation">
                    <div class="pagination-container">
                        <ul class="pagination">
                            <c:if test="${currentPage > 1}">
                                <li class="page-item"><a class="page-link" href="?page=${currentPage - 1}" aria-label="Previous"> <span aria-hidden="true">&laquo;</span>
                                    </a></li>
                            </c:if>

                            <!-- 페이지 링크는 현재 페이지를 가운데로 하여 5개까지만 표시 -->
                            <c:set var="startPage" value="${currentPage - 2 > 0 ? currentPage - 2 : 1}" />
                            <c:set var="endPage" value="${startPage + 4 > totalPages ? totalPages : startPage + 4}" />
                            <c:if test="${endPage - startPage < 4}">
                                <c:set var="startPage" value="${endPage - 4 > 0 ? endPage - 4 : 1}" />
                            </c:if>

                            <c:forEach var="i" begin="${startPage}" end="${endPage}">
                                <li class="page-item ${i == currentPage ? 'active' : ''}"><a class="page-link" href="?page=${i}">${i}</a></li>
                            </c:forEach>

                            <c:if test="${currentPage < totalPages}">
                                <li class="page-item"><a class="page-link" href="?page=${currentPage + 1}" aria-label="Next"> <span aria-hidden="true">&raquo;</span>
                                    </a></li>
                            </c:if>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    </div>
</body>

</html>