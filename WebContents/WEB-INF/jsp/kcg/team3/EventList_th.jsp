<%@ page language="java" contentType="text/html; charset=UTF-8"
   pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html lang="ko">


<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script
   src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<!-- Bootstrap CSS -->
<!-- <link
   href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
   rel="stylesheet"
   integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
   crossorigin="anonymous"> -->
<!-- jquery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script
   src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<title>관리자 시스템</title>
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
.message-popup {
   width: 500px;
   background-color: white;
   border: 1px solid black;
   padding: 20px;
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   display: none;
   z-index: 10;
}

#smsForm>div {
   margin: 20px 0;
}

#smsForm>div label {
   width: 120px;
   margin-right: 8px;
}

#smsForm>div input {
   width: 200px;
   padding: 0 8px;
}

#smsForm>div textarea {
   width: 200px;
   height: 100px;
   resize: none;
   vertical-align: top;
}

.btn{
   border: none;
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
</head>


<body class="page-body">


   <div class="page-container">
      <jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp"
         flush="false" />

      <div class="main-content">

         <jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp"
            flush="false" />

         <div class="event-container">

            <h1>고객 이벤트 조회</h1>

            <div>
               <!-- 고객정보 필터 -->
               <form id="custSearch">
                  <label for="cust_info">고객 정보</label> <select
                     id="cust_info" name="cust_info">
                     <option value="all">전체</option>
                     <option value="cust_name">고객명</option>
                     <option value="cust_code">고객코드</option>
                  </select> <input type="text" id="keyword" placeholder="검색어를 입력하세요">
                  <button id="searchBtn" class="btn btn-custom type="submit">검색</button>
               </form>
               <!-- 이벤트 종류 필터-->
               <form id="eventSearch"action="/cust_th/eventList_th" method="GET">
                  <label for="eventFilter">이벤트 종류</label> <select id="eventFilter"
                     name="eventFilter">
                     <option value="all" ${param.eventFilter == 'all' ? 'selected' : ''}>전체</option>
                     <option value="event1"
                        ${param.eventFilter == 'event1' ? 'selected' : ''}>적금
                        만기</option>
                     <option value="event2"
                        ${param.eventFilter == 'event2' ? 'selected' : ''}>예금
                        만기</option>
                        <option value="event3"
                        ${param.eventFilter == 'event3' ? 'selected' : ''}>챌린지
                        만기</option>
                     <option value="birthday"
                        ${param.eventFilter == 'birthday' ? 'selected' : ''}>생일</option>
                  </select>
                  <button class="btn btn-custom" type="submit">검색</button>
               </form>
            </div>

            <table class="table" id="event-table">
               <thead>
                  <tr>
                     <th>고객코드</th>
                     <th>고객명</th>
                     <th>생년월일</th>
                     <th>전화번호</th>
                     <th>이벤트 종류</th>
                     <th>이벤트 날짜</th>
                     <th>전송</th>
                  </tr>
               </thead>
               <tbody class="table-group-divider">
                  <c:if test="${not empty custEventList}">
                     <c:forEach items="${custEventList}" var="item">
                        <c:set var="eventTypeMatch"
                           value="${empty param.eventFilter or item.event_type eq param.eventFilter}" />
                        <c:if test="${eventTypeMatch}">
                           <tr class="cust-event-row">
                              <td data-cust-code="${item.cust_code}">${item.cust_code}</td>
                              <td data-cust-name="${item.cust_name}"
                                 data-cust-code="${custList.cust_code}">${item.cust_name}</td>
                              <td>${item.cust_birth}</td>
                              <td>${item.cust_phonenum}</td>
                              <td><c:choose>
                                    <c:when test="${item.event_type eq 'event1'}">${item.prod_name} 만기</c:when>
                                    <c:when test="${item.event_type eq 'event2'}">${item.prod_name} 만기</c:when>
                                    <c:when test="${item.event_type eq 'event3'}">${item.prod_name} 만기</c:when>
                                    <c:when test="${item.event_type eq 'birthday'}">생일</c:when>
                                 </c:choose></td>
                              <td>${item.event_date}</td>
                              <td style="cursor: pointer"><svg
                                    onclick="openMessagePop('${item.cust_phonenum}')"
                                    xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                    fill="currentColor" class="bi bi-envelope"
                                    viewBox="0 0 16 16">
                                <path
                                       d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                              </svg></td>
                           </tr>
                        </c:if>
                     </c:forEach>
                  </c:if>
                  <c:if test="${empty custEventList}">
                     <tr>
                        <td colspan="9" class="text-center">이벤트가 없습니다.</td>
                     </tr>
                  </c:if>
               </tbody>
            </table>

            <!-- 페이징 처리 -->
            <nav aria-label="Page navigation">
            <div id="event-pagination" class="pagination-container">
               <ul class="pagination">
                  <c:if test="${currentPage > 1}">
                     <li class="page-item"><a class="page-link"
                        href="?page=${currentPage - 1}" aria-label="Previous"> <span
                           aria-hidden="true">&laquo;</span>
                     </a></li>
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
                        class="page-link" href="?page=${i}">${i}</a></li>
                  </c:forEach>

                  <c:if test="${currentPage < totalPages}">
                     <li class="page-item"><a class="page-link"
                        href="?page=${currentPage + 1}" aria-label="Next"> <span
                           aria-hidden="true">&raquo;</span>
                     </a></li>
                  </c:if>
               </ul>
            </div>
         </nav>

         </div>

         <div class="message-popup" style="display: none">
            <form id="smsForm">
               <div>
                  <label for="from">보내는 사람 번호:</label> <input type="text"
                     id="message-from" name="from"/>
               </div>
               <div>
                  <label for="to">받는 사람 번호:</label> <input type="text"
                     id="message-to" name="to" readonly />
               </div>
               <div>
                  <label for="text">내용:</label>
                  <textarea id="message-text" name="text" placeholder="내용을 입력하세요."></textarea>
               </div>
               <div>
                  <button type="button" onclick="sendSMS()" class="btn btn-info">전송하기</button>
                  <button type="button" onclick="cancelMessage()" class="btn btn-success">취소</button>
               </div>
            </form>
         </div>

      </div>
   </div>

   <script>
   $(document).ready(
           function() {
              
           // 페이지 로드 시 select 박스 기본값 설정
               var defaultCustInfo = '${empty param.cust_info ? "all" : fn:escapeXml(param.cust_info)}'; // 고객 정보 초기 값
               var defaultKeyword = '${fn:escapeXml(param.keyword)}'; // 검색어 초기 값
               
               // 검색어 입력란과 select 박스에 초기 값 설정
               $('#keyword').val(defaultKeyword);
               $('#cust_info').val(defaultCustInfo);
               
              // 검색 조건 포함해서 페이지 이동 처리
              function navigateToPage(pageNum){
                 var searchBy = $('#cust_info').val(); // 선택된 검색 조건
                   var searchText = $('#keyword').val().trim().toLowerCase(); // 검색어
                   var eventFilter = $('#eventFilter').val(); // 이벤트 종류 필터
                   
                   var url = '/cust_th/eventList_th?page=' + pageNum;
                   
                   // 검색 조건이 있는 경우에만 URL에 추가
                   if (searchBy && searchText) {
                      eventFilter = '';
                       url += '&cust_info=' + searchBy + '&keyword=' + searchText;
                   }
                   
                // 이벤트 종류 필터가 있는 경우에도 URL에 추가
                   if (eventFilter && eventFilter !== 'all') {
                       url += '&eventFilter=' + eventFilter;
                   }
                
                // 페이지 이동
                   window.location.href = url;
              }
              
           // 페이지 링크 클릭 이벤트 핸들러
              $('#event-pagination').on('click', '.page-link', function(event) {
                  event.preventDefault();
                  var pageNum = $(this).attr('href').split('=')[1]; // 페이지 번호 가져오기
                  navigateToPage(pageNum); // 페이지 이동 처리 함수 호출
              });
           
           // 고객 정보 검색 이벤트 핸들러
              $('#custSearch').submit(function(event) {
                  event.preventDefault();
                  navigateToPage(1); // 검색 시 페이지를 1로 초기화하여 검색 결과 첫 페이지로 이동
              });
           
           // 이벤트 종류 필터링 이벤트 핸들러
              $('#eventSearch').submit(function(event) {
                  event.preventDefault();
                  navigateToPage(1); // 검색 시 페이지를 1로 초기화하여 검색 결과 첫 페이지로 이동
              });
           
           // 이벤트 종류가 변경될 때 고객 정보 select 박스와 keyword input 초기화
               $('#eventFilter').change(function() {
                   $('#cust_info').val('all'); // select 박스 초기화
                   $('#keyword').val(''); // input 값 초기화
               });
                
  });//ready end


      //메시지 팝업 열기
      function openMessagePop(custPhonenum) {
         // 팝업 열기 로직 추가
         document.querySelector('.message-popup').style.display = 'block';
         // 전화번호 설정
         document.getElementById('message-to').value = custPhonenum;
         var phonenumber = custPhonenum;
      }

      // 취소 버튼 클릭 시 입력값 초기화
      function cancelMessage() {
         // 입력 필드 초기화
         var fromInput = document.getElementById('from');
         var textInput = document.getElementById('text');

         if (fromInput) {
            fromInput.value = '';
         }
         if (textInput) {
            textInput.value = '';
         }
         document.querySelector('.message-popup').style.display = 'none';
      }

      // 메세지 전송
      function sendSMS() {

         var from = document.getElementById("message-from").value;
         var to = document.getElementById("message-to").value.replaceAll( "-", "");
         var text = document.getElementById("message-text").value;
         
      // 보내는 사람 번호와 내용이 비어 있을 경우 전송하지 않음
         if (from.trim() === '' || text.trim() === '') {
             alert("보내는 사람 번호와 내용을 모두 입력해야 합니다.");
             return;
         }
      
         // 전화번호 유효성 검사
           // 숫자와 길이를 체크하는 정규식
           var regex = /^[0-9]{10,11}$/;
        // 정규식을 이용해 유효성 검사
           if (!regex.test(from)) {
              alert("전화번호는 하이픈(-) 없이 11개의 숫자만 입력 가능합니다.");
               return; // 유효하지 않은 전화번호
           }

         var params = {
            from : from,
            to : to,
            text : text
         }

         cf_ajax("/send-sms", params);

         alert("메시지 전송이 완료되었습니다.");
         cancelMessage();
      }
   </script>

</body>


</html>