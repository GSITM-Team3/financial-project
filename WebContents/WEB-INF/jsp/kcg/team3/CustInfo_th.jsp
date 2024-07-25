<%@ page language="java" contentType="text/html; charset=UTF-8"
   pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
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
   background-color: rgba(0, 0, 0, 0.5); /* 반투명한 배경 */
}

.modal-content {
   background-color: #fefefe;
   position: absolute;
   left: 50%;
   top: 50%;
   transform: translate(-50%, -50%);
   padding: 20px;
   border: 1px solid #888;
   width: 80%;
   max-width: 600px;
   max-height: 65%;
   overflow-y: auto; /* 내용이 넘치면 스크롤 활성화 */
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
   color: #aaa;
   position: absolute;
   top: 10px; /* 원하는 위치로 조정 */
   right: 15px; /* 원하는 위치로 조정 */
   font-size: 28px;
   font-weight: bold;
}

/* 고객 목록 스타일링 */
#cust-modal-content-active, #cust-modal-content-inactive {
   max-height: 200px; /* 최대 높이 설정 */
   overflow-y: auto; /* 스크롤 활성화 */
   margin-bottom: 10px; /* 목록 사이 간격 설정 */
   border: 1px solid #ddd; /* 테두리 설정 */
   padding: 5px; /* 내부 여백 설정 */
}

/* 고객 이름 요소 스타일링 */
.customer-name {
   border-bottom: 1px solid #ddd; /* 아래쪽 테두리 추가 */
   padding-bottom: 5px; /* 테두리 아래 여백 */
   cursor: pointer; /* 포인터 커서 설정 */
}

/* 고객 이름 요소에 호버 효과 */
.customer-name:hover {
   background-color: #f0f0f0; /* 호버 시 배경색 변경 */
}

.btn {
    border: none;
}
</style>

<script>
$(document).ready(function() {
   //각 버튼에 대한 내용
    $('button[type="button"]').click(function() {
       
       //수정 버튼 클릭 시
       if($(this).text() === '수정'){
          
            // 수정 폼 데이터 유효성 검사
            var custName = $('#cust_name').val().trim();
            var custBirth = $('#cust_birth').val().trim();
            var custPhoneNum = $('#cust_phonenum').val().trim();
            var custGender = $('input[name="cust_gen"]:checked').val();
            var custTypes = $('input[name="cust_type"]:checked').length > 0;
            var userId = $('#user_id').val();
            var custState = $('input[name="cust_state"]:checked').val();

            // 필수 입력 항목 체크
            if (custName === '' || custBirth === '' || custPhoneNum === '' || !custGender || !custTypes || userId === '' || !custState) {
                alert('내용을 입력하세요.');
                return;
            }

         $('#custInsert').attr('action', '/cust_th/custModify_th');
         $('#custInsert').attr('method', 'POST');
         $('#custInsert').submit();
       }
       
       // 등록 버튼 클릭 시
       if($(this).text() === '등록'){
          
            // 등록 폼 데이터 유효성 검사
            var custName = $('#cust_name').val().trim();
            var custBirth = $('#cust_birth').val().trim();
            var custPhoneNum = $('#cust_phonenum').val().trim();
            var custGender = $('input[name="cust_gen"]:checked').val();
            var custTypes = $('input[name="cust_type"]:checked').length > 0;
            var userId = $('#user_id').val();
            var custState = $('input[name="cust_state"]:checked').val();

            // 필수 입력 항목 체크
            if (custName === '' || custBirth === '' || custPhoneNum === '' || !custGender || !custTypes || userId === '' || !custState) {
                alert('내용을 입력하세요.');
                return;
            }
          
             // 등록 폼 제출
          $('#custInsert').attr('action', '/cust_th/custInsert_th');
          $('#custInsert').attr('method', 'POST');
          $('#custInsert').submit();
       }
       //불러오기 버튼 클릭 시
       else if ($(this).text() === '불러오기') {
            $.ajax({
                url: '/cust_th/getAssignedCustomers', // Spring MVC 컨트롤러 매핑 주소
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    var modalContentActive = '';
                    var modalContentInactive = '';

                    // 데이터 순회하며 이름을 리스트 형태로 추가
                    $.each(data, function(index, customer) {
                        var customerName = '<p class="customer-name" data-code="' + customer.cust_code + '">' + customer.cust_name + '</p>';
                        if (customer.cust_state === '1') {
                            modalContentActive += customerName;
                        } else if (customer.cust_state === '2') {
                            modalContentInactive += customerName;
                        }
                    });

                    // 모달 창에 데이터 삽입
                    $('#cust-modal-content-active').html(modalContentActive);
                    $('#cust-modal-content-inactive').html(modalContentInactive);
                    
                    // 모달 창 열기
                    $('#customerModal').css('display', 'block');
                    
                    // 고객 이름 클릭 시 데이터 채우기
                    $('.customer-name').click(function() {
                        var custCode = $(this).data('code');
                        // 선택된 고객 정보 찾기
                        var selectedCustomer = data.find(function(c) {
                            return c.cust_code === custCode;
                        });
                        
                        $('#cust_created_at').val(selectedCustomer.cust_created_at);
                        $('#cust_code').val(selectedCustomer.cust_code);
                        
                        // 고객 정보 입력 폼에 채우기
                        $('#cust_name').val(selectedCustomer.cust_name);
                        $('#cust_birth').val(selectedCustomer.cust_birth);
                        $('#cust_phonenum').val(selectedCustomer.cust_phonenum);
                        
                        // 성별 설정
                        if (selectedCustomer.cust_gen === '남') {
                            $('#cust_gen_male').prop('checked', true);
                        } else {
                            $('#cust_gen_female').prop('checked', true);
                        }
                        
                        // 고객 특성 설정
                        $('input[name="cust_type"]').each(function() {
                            $(this).prop('checked', selectedCustomer.cust_type.includes($(this).val()));
                        });
                        
                        // 관리자 선택
                        $('#user_id').val(selectedCustomer.user_id);
                        
                        //가입 상태 설정
                        if(selectedCustomer.cust_state === '1'){
                           $('#cust_state_1').prop('checked', true);
                        } else {
                           $('#cust_state_2').prop('checked', true);
                        }
                        
                        // 모달 닫기
                        $('#customerModal').css('display', 'none');
                    });
                },
                error: function() {
                    alert('고객 정보를 불러오는 중에 오류가 발생했습니다.');
                }
            });
        }
    });
   
    // custType 체크박스 클릭 시 다른 체크박스 상태 초기화
    $('input[name="cust_type"]').click(function() {
        var isChecked = $(this).prop('checked');
        $('input[name="cust_type"]').prop('checked', false);
        if (isChecked) {
            $(this).prop('checked', true);
        }
    });

    // 모달 닫기 버튼 클릭 시
    $('.close').click(function() {
        $('#customerModal').css('display', 'none');
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
         <h1>고객 정보 관리</h1>

         <form id="custInsert" accept-charset="UTF-8">
            <input type="hidden" name="cust_created_at" id="cust_created_at">
            <input type="hidden" name="cust_code" id="cust_code">
            <table class="table">
               <tr>
                  <th>고객명</th>
                  <td><input type="text" name="cust_name" id="cust_name"></td>
               </tr>
               <tr>
                  <th>생년월일</th>
                  <td><input type="date" name="cust_birth" id="cust_birth"></td>
               </tr>
               <tr>
                  <th>전화번호</th>
                  <td><input type="text" name="cust_phonenum" id="cust_phonenum"></td>
               </tr>
               <tr>
                  <th>성별</th>
                  <td><input type="radio" value="남" name="cust_gen"
                     id="cust_gen_male">남 <input type="radio" value="여"
                     name="cust_gen" id="cust_gen_female">여</td>
               </tr>
               <tr>
                  <th>고객 특성</th>
                  <td><input type="checkbox" value="1" name="cust_type"
                     id="cust_type">일반 <input type="checkbox" value="2"
                     name="cust_type" id="cust_type">다자녀 <input
                     type="checkbox" value="3" name="cust_type" id="cust_type">청년
                  </td>
               </tr>
               <tr>
                  <th>관리자명</th>
                  <td><select name="user_id" id="user_id">
                        <option value="">관리자 선택</option>
                        <c:forEach items="${userIds}" var="userId">
                           <option value="${userId.user_id}">${userId.user_id}</option>
                        </c:forEach>
                  </select></td>
               </tr>
               <tr>
                  <th>가입상태</th>
                  <td><input type="radio" value="1" name="cust_state"
                     id="cust_state_1">가입 <input type="radio" value="2"
                     name="cust_state" id="cust_state_2">탈퇴</td>
               </tr>
            </table>

            <button type="button" class="btn btn-primary">불러오기</button>
            <button type="button" class="btn btn-success">수정</button>
            <button type="reset" class="btn btn-warning">초기화</button>
            <button type="button" class="btn btn-info">등록</button>
         </form>

      </div>
   </div>

   <!-- 모달 -->
   <div id="customerModal" class="modal">
      <div class="modal-content">
         <span class="close">&times;</span>
         <h2 style="text-align: center;">담당 고객 리스트</h2>
         <h3>가입 중인 고객</h3>
         <div id="cust-modal-content-active"></div>
         <h3>탈퇴 중인 고객</h3>
         <div id="cust-modal-content-inactive"></div>
      </div>
   </div>
<c:if test="${not empty message}">
    <script>
        alert("${message}");
    </script>
</c:if>
</body>
</html>
