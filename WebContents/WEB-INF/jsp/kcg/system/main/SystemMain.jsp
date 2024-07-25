<%@ page language="java" contentType="text/html; charset=UTF-8"
   pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.List"%>
<%@ page import="common.utils.common.CmmnMap"%>
<%@ page import="common.utils.json.JsonUtil"%>
<%
   CmmnMap statData = (CmmnMap) request.getAttribute("statData");
String today = statData.getString("today");

CmmnMap visitStat = statData.getCmmnMap("visitStat");
String visitChart_title = visitStat.getString("title");
List<CmmnMap> visitChart_dataList = visitStat.getCmmnMapList("dataList");
List<String> visitChart_labels = new ArrayList<String>();
List<Integer> visitChart_datasets_data = new ArrayList<Integer>();
for (CmmnMap map : visitChart_dataList) {
   visitChart_labels.add(map.getString("mmdd_date"));
   visitChart_datasets_data.add(map.getInt("visit_cnt"));
}
String jsn_visitChart_labels = JsonUtil.toJsonStr(visitChart_labels);
String jsn_visitChart_datasets_data = JsonUtil.toJsonStr(visitChart_datasets_data);

CmmnMap reqStat = statData.getCmmnMap("reqStat");
List<Integer> reqChart_datasets_data = new ArrayList<>();
reqChart_datasets_data.add(reqStat.getInt("req_anal_tool_cnt"));
reqChart_datasets_data.add(reqStat.getInt("req_data_anal_cnt"));
reqChart_datasets_data.add(reqStat.getInt("req_data_collect_cnt"));
reqChart_datasets_data.add(reqStat.getInt("req_dnld_cnt"));
String jsn_reqChart_datasets_data = JsonUtil.toJsonStr(reqChart_datasets_data);
%>
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
<title>관리자시스템</title>
<style>
/* 전반적인 스타일링 */
body {
   font-family: 'Noto Sans KR', Arial, sans-serif;
   line-height: 1.6;
   background-color: #f4f4f4;
   margin: 0;
   padding: 0;
}

.container {
   max-width: 1200px;
   margin: 20px auto;
   padding: 20px;
   background-color: #fff;
   border-radius: 5px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 패널 스타일링 */
.panel {
   border: 1px solid #ddd;
   border-radius: 5px;
   margin-bottom: 20px;
}

.panel-primary>.panel-heading {
   background-color: #303641;
   color: white;
   padding: 10px 20px;
   border-radius: 5px 5px 0 0;
   border-bottom: 1px solid #303641;
}

.panel>.panel-heading .panel-title {
   font-size: 24px;
   text-align: center;
}

.panel-body {
   padding: 20px;
}

/* 리스트 스타일링 */
.list-group {
   list-style: none;
   padding-left: 0;
   margin-top: 0;
   display: flex;
   align-items: flex-start;
}

.list-group-item {
   border: 1px solid #ddd;
   border-radius: 5px;
   padding: 10px 15px;
   margin-bottom: 10px;
   background-color: #f9f9f9;
   margin-left: 15px;
}

.list-group-item:hover {
   background-color: #f0f0f0;
}

.list-group-item a {
   color: #333;
   text-decoration: none;
}

.list-group-item a:hover {
   text-decoration: underline;
}

.notice-container {
   width: 100%;
}
.list-group-notice{
   padding: 0;
   margin-left: 0;
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

         <div class="row">
            <div class="col-sm-6">
               <div class="panel panel-primary">
                  <div class="panel-heading">
                     <div class="panel-title">
                        <label class="control-label">공지사항</label>
                     </div>
                  </div>
                  <div class="panel-body">
                     <div class="notice-container">
                        <!-- 공지사항 내용 -->
                        <c:if test="${not empty notices}">
                           <ul class="list-group-notice">
                              <c:forEach var="notice" items="${notices}">
                                 <li class="list-group-item"><a
                                    href="/share_th/noticeOne/${notice.gw_code}"
                                    style="display: flex; justify-content: space-between; align-items: center;">
                                       <div>
                                          <h4 style="margin: 0;">${notice.gw_title}</h4>
                                          <small>작성일: ${notice.gw_updated_at}</small>
                                       </div>
                                 </a>
                              </c:forEach>
                           </ul>
                        </c:if>
                        <c:if test="${empty notices}">
                           <p>공지사항이 없습니다.</p>
                        </c:if>
                     </div>
                  </div>
               </div>
            </div>
            <div class="col-sm-6">
               <div class="panel panel-primary">
                  <div class="panel-heading">
                     <div class="panel-title">
                        <label class="control-label">금융 뉴스</label>
                     </div>
                  </div>
                  <div class="panel-body" style="height: 395px;">
                     <div class="news-container">
                        <!-- 네이버 경제 뉴스 -->
                        <div id="naverEconomicNews"></div>
                        <!-- 네이버 경제 뉴스 종료 -->
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <!-- 이달의 상품과 이달의 사원 -->
         <div class="row">
            <div class="col-sm-6">
               <div class="panel panel-primary">
                  <div class="panel-heading">
                     <div class="panel-title">
                        <label class="control-label">이달의 상품</label>
                     </div>
                  </div>
                  <div class="panel-body">
                     <!-- 이달의 상품 내용 -->
                     <div class="prod-container">
                        <c:if test="${not empty prod}">
                           <ul class="list-group">
                              <c:forEach var="prod" items="${prod}">
                                 <li class="list-group-item">
                                    <div class="prod-info">
                                       <div class="prod-name">상품명:${prod.prod_name}</div>
                                       <div class="prod-air">적용 이율: ${prod.prod_air}</div>
                                    </div>
                                 </li>
                              </c:forEach>
                           </ul>
                        </c:if>
                     </div>
                  </div>
               </div>
            </div>
            <div class="col-sm-6">
               <div class="panel panel-primary">
                  <div class="panel-heading">
                     <div class="panel-title">
                        <label class="control-label">이달의 사원</label>
                     </div>
                  </div>
                  <div class="panel-body">
                     <!-- 이달의 사원 내용 -->
                     <div class="user-container">
                        <c:if test="${not empty user}">
                           <ul class="list-group">
                              <c:forEach var="user" items="${user}">
                                 <li class="list-group-item">
                                    <div class="user-info">
                                       <div class="user-id">직원ID ${user.user_id}</div>
                                       <div class="plan-count">계약 건수
                                          :${user.plan_state_2_count}</div>
                                    </div>
                                 </li>
                              </c:forEach>
                           </ul>
                        </c:if>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp"
            flush="false" />
      </div>
   </div>
   <script>
        function fetchNaverEconomicNews() {
            fetch('/system/naverNews?query=금융')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    displayNews(data.items);
                })
                .catch(error => {
                    console.error('Error:', error);
                    displayError('뉴스를 가져오는데 실패했습니다: ' + error.message);
                });
        }

        function displayNews(newsItems) {
            var newsContainer = document.getElementById('naverEconomicNews');
            if (Array.isArray(newsItems) && newsItems.length > 0) {
                var newsHTML = '<ul>';
                for (var i = 0; i < newsItems.length; i++) {
                    var item = newsItems[i];
                    newsHTML += '<li><a href="' + item.link + '" target="_blank">' + item.title + '</a></li>';
                }
                newsHTML += '</ul>';
                newsContainer.innerHTML = newsHTML;
            } else {
                displayError('표시할 뉴스 항목이 없습니다.');
            }
        }

        function displayError(message) {
            var newsContainer = document.getElementById('naverEconomicNews');
            newsContainer.innerHTML = '<p style="color: red;">오류: ' + message + '</p>';
        }

        // 페이지 로드 시 네이버 경제 뉴스를 가져오도록 설정
        window.onload = function() {
            fetchNaverEconomicNews();
        };
    </script>
</body>
</html>