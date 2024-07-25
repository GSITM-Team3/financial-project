<%@ page import="java.util.List"%>
<%@ page import="kcg.team3.vo.ScheduleTh"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
   pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>활동 관리</title>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<!-- jquery -->
<script
   src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

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

<!-- fullcalendar -->
<link rel="stylesheet"
   href="https://cdn.jsdelivr.net/npm/fullcalendar@5.7.0/main.min.css">
<script type="text/javascript"
   src="https://cdn.jsdelivr.net/npm/fullcalendar@5.7.0/main.min.js"></script>

<style>
#calendarBox {
   width: 80%;
   padding-left: 15%;
}
.modal-content{
   min-width: 100px;
   min-height: 50px;
}
.modal-body .form-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.modal-body .form-group label {
    text-align: left;
    font-weight: bold;
}
.modal-body .form-group .form-control {
    width: 50%;
}
.fc-day:hover {
   cursor: pointer;
   background-color: #f0f0f0;
}
.fc-event:hover {
   background-color: #0000ff; 
}
.fc-daygrid-day.fc-day-sat, .fc-daygrid-day.fc-day-sun {
            background-color: #f0f0f0; 
}
.color-picker {
            margin: 10px 0;
}
.color-box {
            display: inline-block;
            width: 30px;
            height: 30px;
            border: 1px solid #ccc;
            cursor: pointer;
            margin: 0 5px;
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
            <h2>스케줄 관리</h2>
            <input type="hidden" id="userId" name="userId" value="${userId}" readonly>
            <div id="calendarBox">
               <div id="calendar"></div>
            </div>

            <!-- modal 추가 -->
            <div class="modal fade" id="calendarModal" tabindex="-1"
               role="dialog" aria-labelledby="exampleModalLabel"
               aria-hidden="true">
               <div class="modal-dialog" role="document">
                  <div class="modal-content">
                     <div class="modal-header">
                        <h3 class="modal-title" id="exampleModalLabel">일정을 입력하세요.</h3>
                        <button type="button" class="close" data-dismiss="modal"
                           aria-label="Close">
                           <span aria-hidden="true">&times;</span>
                        </button>
                     </div>
                     <div class="modal-body">
                        <div class="form-group">
                           <input type="hidden" id="userId" name="userId" value="${userInfoVO.userId}" readonly >
                            <label for="taskId"
                              class="col-form-label">시작 날짜</label> <input type="date"
                              class="form-control" id="calendar_start_date"
                              name="calendar_start_date"> <label for="taskId"
                              class="col-form-label">종료 날짜</label> <input type="date"
                              class="form-control" id="calendar_end_date"
                              name="calendar_end_date">
                            <label for="taskId" 
                              class="col-form-label">일정 내용</label> <input type="text" 
                              class="form-control" id="calendar_content"
                              name="calendar_content"> 
                              <input type="hidden" id="calendar_id" value="">
                        </div>
                     </div>
                     <div class="modal-footer">
                        <button type="button" class="btn btn-warning" id="addCalendar">저장</button>
                        <button type="button" class="btn btn-danger" id="deleteCalendar" style="display: none;">삭제</button>
                        <button type="button" class="btn btn-primary" id="updateCalendar" style="display: none;">수정</button>
                        <button type="button" class="btn btn-secondary"
                           data-dismiss="modal" id="sprintSettingModalClose">닫기</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
   <!-- AJAX 기능 -->
   <script type="text/javascript">
      function sc_ajax(url, params, successCallback) {
         $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            data: params,
            success: successCallback,
            error: function(xhr, status, error) {
               var errorMessage = {
                  message: "JSON 파싱 실패",
                  xhr: xhr.statusText
               };
               console.error("Error occurred:", errorMessage);
               alert("일정 추가 중 오류가 발생했습니다. 다시 시도해주세요.");
            }
         });
      }
   </script>
   <!-- 캘린더 초기화 및 설정 -->
   <script type="text/javascript">
        var calendar; // 전역 변수로 뺌

        document.addEventListener('DOMContentLoaded', function() {
            var calendarEl = document.getElementById('calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                timeZone: 'UTC',
                initialView: 'dayGridMonth', // 초기 달력 형태 설정 (월별)
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                events: [
                    // 서버에서 받아온 일정 데이터를 반복문으로 추가
                    <%for (ScheduleTh schedule : (List<ScheduleTh>) request.getAttribute("schedules")) {%>
                    {
                        title: '<%=schedule.getScheContent()%>',
                        start: '<%=schedule.getScheStartDate()%>',
                        end: '<%= new java.text.SimpleDateFormat("yyyy-MM-dd").format(java.sql.Date.valueOf(schedule.getScheEndDate().toLocalDate().plusDays(1))) %>', // 종료일에 하루 추가
                        id: '<%=schedule.getScheCode()%>', // 일정의 고유 ID
                        userId: '<%=schedule.getUserId()%>'
                    },
                    <%}%>
                ],
                selectable: true,
                displayEventTime: false,
                dateClick: function(info) { // 날짜 클릭 시 이벤트
                    var start_date = info.dateStr; // 클릭한 날짜
                    // 모달 창 열기
                    $("#calendarModal").modal("show");
            
                    // 선택한 날짜를 시작 날짜 필드에 설정
                    $("#calendar_start_date").val(start_date);

                    // 모달 초기화
                    $("#calendar_content").val('');
                    $("#calendar_end_date").val('');
                    $("#calendar_id").val(''); // 일정 ID 초기화
                    
                    // 저장 버튼만 show
                    $("#addCalendar").show();
                    $("#deleteCalendar").hide();
                    $("#updateCalendar").hide();
                },
                eventClick: function(info) { // 일정 클릭 시 이벤트
                    // 모달 창 열기
                    $("#calendarModal").modal("show");
                
                    // 클릭한 일정 정보 출력
                    console.log("ScheContent: " + info.event.title);
                    console.log("ScheStartDate: " + info.event.start.toISOString());
                    console.log("ScheEndDate: " + info.event.end.toISOString());

                    // 클릭한 일정의 정보를 모달 창에 설정
                    $("#calendar_content").val(info.event.title);
                    $("#calendar_start_date").val(info.event.startStr);
                    
                    // 종료일에서 하루를 빼는 로직
                    let endDate = new Date(info.event.endStr);
                    // 날짜에서 하루를 빼기
                    endDate.setDate(endDate.getDate() - 1);   
                    // 종료일을 'YYYY-MM-DD' 형식으로 변환
                    let adjustedEndDateStr = endDate.toISOString().split('T')[0];
                    // 모달 창에 수정된 종료일 설정
                    $("#calendar_end_date").val(adjustedEndDateStr);
                    
                    $("#calendar_id").val(info.event.id); // 일정 ID 설정
                    
                    var loggedInUserId = $("#userId").val(); // 현재 로그인한 유저 ID
                    var eventUserId = info.event.extendedProps.userId; // 일정 작성자 ID
                    
                    // 수정, 삭제 버튼 show 여부 결정 
                    if (loggedInUserId === eventUserId) {
                        $("#addCalendar").hide();
                        $("#deleteCalendar").show();
                        $("#updateCalendar").show();
                    } else {
                        $("#addCalendar").hide();
                        $("#deleteCalendar").hide();
                        $("#updateCalendar").hide();
                    }
               
                }
            });
            calendar.render();
        });
    </script>
   <!-- 일정 저장 클릭  -->
   <script type="text/javascript">
        $(document).ready(function() {
            $("#addCalendar").on('click', function() {
                var content = $("#calendar_content").val();
                var start_datetime = $("#calendar_start_date").val();
                var end_datetime = $("#calendar_end_date").val();
                var userId = $("#userId").val();
                var id = $("#calendar_id").val(); // 일정 ID

                console.log("ID: " + userId);
                console.log("Content: " + content);
                console.log("SD: " + start_datetime);
                console.log("ED: " + end_datetime);
                console.log("Event ID: " + id);
          
                if (!content) {
                    alert("내용을 입력하세요.");
                } else if (!start_datetime || !end_datetime) {
                    alert("날짜를 입력하세요.");
                } else if (new Date(end_datetime) < new Date(start_datetime)) {
                    alert("종료일이 시작일보다 먼저입니다.");
                } else {
                    var params = {
                        userId: userId,
                        scheContent: content,
                        scheStartDate: start_datetime,
                        scheEndDate: end_datetime,
                        scheCode: id // 일정 ID
                    };
                    console.log(params);
          
                    sc_ajax("/active_th/add_schedule", params, function(response) {
                        alert("일정이 성공적으로 추가되었습니다.");
                        
                        calendar.addEvent({
                                title: content,
                                start: start_datetime,
                                end: end_datetime,
                                id: response.newId // 서버에서 반환된 새로운 일정 ID
                            });

                        $("#calendarModal").modal("hide"); // 모달 창 닫기

                        // 입력 필드 초기화
                        $("#calendar_content").val('');
                        $("#calendar_start_date").val('');
                        $("#calendar_end_date").val('');
                        $("#calendar_id").val(''); // 일정 ID 초기화
                        
                        location.reload(); 
                    });
                }
            });
        });
    </script>
    <!-- 일정 삭제 클릭 -->
    <script>
       $(document).ready(function() {
           // 일정 삭제 버튼 클릭 이벤트
           $("#deleteCalendar").on('click', function() {
               var id = $("#calendar_id").val(); // 삭제할 일정의 ID            
               console.log("삭제할 일정 ID:", id);
         
               if (confirm("정말로 이 일정을 삭제하시겠습니까?")) {
                  var url = "${pageContext.request.contextPath}/active_th/delete_schedule?scheCode=" + id;
                  console.log("삭제 요청 URL:", url);
                  
                    sc_ajax(url, {}, function(response) {
                         try {
                             var jsonResponse = JSON.parse(response);
                             if (jsonResponse.body === "일정이 성공적으로 삭제되었습니다.") {
                                 alert("일정이 성공적으로 삭제되었습니다.");
                                 var event = calendar.getEventById(id);
                                 if (event) {
                                     event.remove(); // 캘린더에서 해당 이벤트 제거
                                 }
                                 $("#calendarModal").modal("hide"); // 모달 닫기
                             } else {
                                 alert(jsonResponse.body); // 삭제 실패 시 오류 메시지 출력
                             }
                         } catch (e) {
                             alert("서버 응답을 처리하는 중 오류가 발생했습니다."); // JSON 파싱 오류 처리
                         }
                   });
               }
           });
       });
   </script>
   <!-- 일정 수정 클릭 -->
   <script>
      $(document).ready(function() {
           $("#updateCalendar").on('click', function() {
               var eventId = $("#calendar_id").val();
               var content = $("#calendar_content").val();
               var start_datetime = $("#calendar_start_date").val();
               var end_datetime = $("#calendar_end_date").val();
   
               if (!content) {
                   alert("내용을 입력하세요.");
                   return;
               }
   
               if (!start_datetime || !end_datetime) {
                   alert("날짜를 입력하세요.");
                   return;
               }
   
               if (new Date(end_datetime) < new Date(start_datetime)) {
                   alert("종료일이 시작일보다 먼저입니다.");
                   return;
               }
   
               var params = {
                   scheCode: eventId,
                   scheContent: content,
                   scheStartDate: start_datetime,
                   scheEndDate: end_datetime
               };
   
               sc_ajax("/active_th/update_schedule", params, function(response) {
                   alert("일정이 성공적으로 수정되었습니다.");
   
                   var event = calendar.getEventById(eventId);
                   event.setProp("title", content);
                   event.setStart(start_datetime);
                   event.setEnd(end_datetime);
                   event.setExtendedProp('description', content);
   
                   $("#calendarModal").modal("hide"); // 모달 창 닫기
   
                   // 입력 필드 초기화
                   $("#calendar_content").val('');
                   $("#calendar_start_date").val('');
                   $("#calendar_end_date").val('');
                   $("#calendar_id").val('');
                   
                   location.reload()
               });
           }); 
       });
   </script>
</body>
</html>