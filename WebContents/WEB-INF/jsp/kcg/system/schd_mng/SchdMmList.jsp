<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false"/>
	<!-- Imported styles on this page -->
	<link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">
    <script src='/static_resources/system/js/index.global.js'></script>
    
    
	<title>스케쥴관리</title>
</head>
<body class="page-body">

<div class="page-container">

	<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp" flush="false"/>

	<div class="main-content">

		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp" flush="false"/>
		
		<ol class="breadcrumb bc-3">
			<li><a href="#none" onclick="cf_movePage('/system')"><i class="fa fa-home"></i>Home</a></li>
			<li class="active"><strong>스케쥴관리</strong></li>
		</ol>
	
		<h2>활동관리 > 스케쥴관리</h2>
		<br/>
		
		<div class="row">
			<div id="vueapp" margin-left: 15px;">
			<template>
				<div class="panel panel-primary" data-collapsed="0">
					<div class="panel-body">
						<form class="form-horizontal">
						
							<div class="sub-desc-status flex">
		                        <span class="status"></span>
		                        <span class="status status-gray"></span>
		                        <span class="status status-blue"></span>
		                        <span class="status status-green"></span>
		                        <span class="status status-red"></span>
		                    </div>
		                    <div class="button flex-right">
		                        <button class="btn btn-red">일정추가</button>
		                    </div>
	                    	<br/>
	                    
							<div id='calendar'></div>
						</form>
					</div>
				</div>
			</template>
			</div>
		</div>
		
		<br />
		
		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp" flush="false"/>
		
	</div>
</div>
</body>
<script>

var vueapp = new Vue({
	el : "#vueapp",
	data : {
		info : {
			prod_cd : "${prod_cd}",
		},
	},
	mounted : function(){
// 		if(!cf_isEmpty(this.info.prod_cd)){
// 			this.getInfo();
// 		}
	},
	methods : {
		getInfo : function(){
			cf_ajax("/prod_mng/getInfo", this.info, this.getInfoCB);
		},
		getInfoCB : function(data){
			this.info = data;
		},
		save : function(){
			
			if(!confirm("저장하시겠습니까?")) return;
			
			cf_ajax("/prod_mng/save", this.info, this.saveCB);
		},
		saveCB : function(data){
			this.info.prod_cd = data.prod_cd;
			this.getInfo();
		},
		delInfo : function(){
			if(!confirm("삭제하시겠습니까?")) return;
			cf_ajax("/prod_mng/delete", this.info, this.delInfoCB);
		},
		delInfoCB : function(data){
			this.gotoList();
		},
		gotoList : function(){
			cf_movePage('/prod_mng/list');
		},
	}
});
</script>

    <script>
        const YrModal = document.querySelector("#yrModal");
        const calendarEl = document.querySelector('#calendar');
        const mySchStart = document.querySelector("#schStart");
        const mySchEnd = document.querySelector("#schEnd");
        const mySchTitle = document.querySelector("#schTitle");
        const mySchAllday = document.querySelector("#allDay");
        const mySchBColor = document.querySelector("#schBColor");
        const mySchFColor = document.querySelector("#schFColor");

        //캘린더 헤더 옵션
        const headerToolbar = {
            left: 'prevYear,prev,next,nextYear today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        }

        // 캘린더 생성 옵션(참공)
        const calendarOption = {
            height: '700px', // calendar 높이 설정
            expandRows: true, // 화면에 맞게 높이 재설정
            slotMinTime: '06:00', // Day 캘린더 시작 시간
            slotMaxTime: '24:00', // Day 캘린더 종료 시간
            // 맨 위 헤더 지정
            headerToolbar: headerToolbar,
            initialView: 'dayGridMonth',  // default: dayGridMonth 'dayGridWeek', 'timeGridDay', 'listWeek'
            locale: 'kr',        // 언어 설정
            selectable: true,    // 영역 선택
            selectMirror: true,  // 오직 TimeGrid view에만 적용됨, default false
            navLinks: true,      // 날짜,WeekNumber 클릭 여부, default false
            weekNumbers: true,   // WeekNumber 출력여부, default false
            editable: true,      // event(일정) 
            /* 시작일 및 기간 수정가능여부
            eventStartEditable: false,
            eventDurationEditable: true,
            */
            dayMaxEventRows: true,  // Row 높이보다 많으면 +숫자 more 링크 보임!
            /*
            views: {
                dayGridMonth: {
                    dayMaxEventRows: 3
                }
            },
            */
            nowIndicator: true,
            events: [],
            eventSources: [{
           		events: function(info, successCallback, failureCallback) {
           			alert(info.startStr + " : " + info.endStr);
//            			$.ajax({
//            				url: '<c:url value="/test/selectEventList"/>',
//            				type: 'POST',
//            				dataType: 'json',
//            				data: {
//            					start : info.startStr,
//            					end : info.endStr
//            				},
//            				success: function(data) {
//            					successCallback(data);
//            				}
//            			});
					// https://illysamsa.tistory.com/entry/fullcalendar-ajax%EB%A1%9C-event-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0
					event = [
		                {
		                    title: 'Business Lunch',
		                    start: '2024-05-03T13:00:00',
		                    constraint: 'businessHours'
		                  },
		                  {
		                    title: 'Meeting',
		                    start: '2024-05-13T11:00:00',
		                    constraint: 'availableForMeeting', // defined below
		                    color: '#257e4a'
		                  },
		                  {
		                    title: 'Conference',
		                    start: '2024-05-18',
		                    end: '2024-05-20'
		                  },
		                  {
		                    title: 'Party',
		                    start: '2024-05-29T20:00:00'
		                  },

		                  // areas where "Meeting" must be dropped
		                  {
		                    groupId: 'availableForMeeting',
		                    start: '2024-05-11T10:00:00',
		                    end: '2024-05-11T16:00:00',
		                    display: 'background'
		                  },
		                  {
		                    groupId: 'availableForMeeting',
		                    start: '2024-05-13T10:00:00',
		                    end: '2024-05-13T16:00:00',
		                    display: 'background'
		                  },

		                  // red areas where no events can be dropped
		                  {
		                    start: '2024-05-24',
		                    end: '2024-05-28',
		                    overlap: false,
		                    display: 'background',
		                    color: '#ff9f89'
		                  },
		                  {
		                    start: '2024-05-06',
		                    end: '2024-05-08',
		                    overlap: false,
		                    display: 'background',
		                    color: '#ff9f89'
		                  }
		                ]
					
					successCallback(event);
           		}
           	}],
           	eventClick:function(e) {                
      			alert(e.event.title + " : " + e.event.startStr);         
           	}
            
        }

        // 캘린더 생성
        const calendar = new FullCalendar.Calendar(calendarEl, calendarOption);
        
        // 캘린더 그리깅
        calendar.render();

        // 캘린더 이벤트 등록
        calendar.on("eventAdd", info => console.log("Add:", info));
        calendar.on("eventChange", info => console.log("Change:", info));
        calendar.on("eventRemove", info => console.log("Remove:", info));
        calendar.on("eventClick", info => {
            console.log("eClick:", info);
            console.log('Event: ', info.event.extendedProps);
            console.log('Coordinates: ', info.jsEvent);
            console.log('View: ', info.view);
            // 재미로 그냥 보더색 바꾸깅
            info.el.style.borderColor = 'red';
        });
        calendar.on("eventMouseEnter", info => console.log("eEnter:", info));
        calendar.on("eventMouseLeave", info => console.log("eLeave:", info));
        calendar.on("dateClick", info => console.log("dateClick:", info));
        calendar.on("dateClick", info => console.log("dateClick:", info));
        calendar.on("select", info => {
            console.log("체킁:", info);

//             mySchStart.value = info.startStr;
//             mySchEnd.value = info.endStr;

           // YrModal.style.display = "block";
        });

        // 일정(이벤트) 추가하깅
        function fCalAdd() {
            if (!mySchTitle.value) {
                alert("제모게 머라도 써주삼")
                mySchTitle.focus();
                return;
            }
            let bColor = mySchBColor.value;
            let fColor = mySchFColor.value;
            if (fColor == bColor) {
                bColor = "black";
                fColor = "yellow";
            }

            let event = {
                start: mySchStart.value,
                end: mySchEnd.value,
                title: mySchTitle.value,
                allDay: mySchAllday.checked,
                backgroundColor: bColor,
                textColor: fColor
            };

            calendar.addEvent(event);
            fMClose();
        }

        // 모달 닫기
        function fMClose() {
            YrModal.style.display = "none";
        }
    </script>

<style>

      #calendar {
            width: 80vw;
            height: 80vh;
        }

        #yrModal {
            position: fixed;
            width: 100%;
            height: 100%;
            background-color: rgba(50, 150, 150, 0.7);
            display: none;
            z-index: 1000;
        }

        #cont {
            margin: 50px auto;
            width: 50%;
            height: 70%;
            background-color: darkblue;
            color: yellow;
        }
</style>
</html>