<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<title>설계 관리(금융 계산기)</title>
<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false" />
<!-- Custom CSS -->
<link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">
<link rel="stylesheet" href="/static_resources/system/js/datatables/proddtl.css">
<link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">
<link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">
<style>
.nav-tabs {
   justify-content: center;
}

.nav-tabs .nav-item {
   margin: 0 15px;
}

.customer-list-item {
   cursor: pointer;
}

.customer-list-item:hover {
   background-color: #f1f1f1;
}
</style>
<!-- Bootstrap 3 CSS -->
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="page-body">
   <%
      String[] tabArray = {"deposit", "savings", "challenge"};
      request.setAttribute("tabArray", tabArray);
   %>
   <div class="page-container">
      <jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp" flush="false" />
      <div class="main-content">

         <jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp" flush="false" />

         <h1 class="text-center mb-4">설계 관리(금융 계산기)</h1>

         <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
               <button class="nav-link active" id="deposit-tab" data-toggle="tab" data-target="#deposit" type="button" role="tab">예금</button>
            </li>
            <li class="nav-item" role="presentation">
               <button class="nav-link" id="savings-tab" data-toggle="tab" data-target="#savings" type="button" role="tab">적금</button>
            </li>
            <li class="nav-item" role="presentation">
               <button class="nav-link" id="challenge-tab" data-toggle="tab" data-target="#challenge" type="button" role="tab">챌린지</button>
            </li>
         </ul>

         <div class="tab-content" id="myTabContent">
            <c:forEach items="${tabArray}" var="tabId" varStatus="status">
               <div class="tab-pane fade ${status.index == 0 ? 'in active' : ''}" id="${tabId}" role="tabpanel">
                  <form id="${tabId}-form">
                     <div class="row mb-3">
                        <div class="col-md-6" style="display: none;">
                           <input id="userId" name="userId" value="${userInfoVO.userId}" readonly type="hidden">
                        </div>
                        <div class="col-md-6">
                           <label for="${tabId}-product" class="form-label">상품 선택</label>
                           <select id="${tabId}-product" class="form-control" onchange="fetchProductDetails('${tabId}')">
                              <option selected disabled>상품 선택</option>
                              <c:forEach items="${promotionProdList}" var="product">
                                 <c:if test="${product.prod_type == tabId}">
                                    <option value="${product.prod_name}"
                                       data-interest="${product.prod_air}"
                                       data-code="${product.prod_code}"
                                       data-period="${product.prod_pay_cy}"
                                       data-tax-type="${product.prod_tax_type}">
                                       ${product.prod_name}</option>
                                 </c:if>
                              </c:forEach>
                           </select>
                        </div>
                        <div class="col-md-6">
                           <label for="${tabId}-period" class="form-label">납입 주기</label> 
                           <input type="text" class="form-control" id="${tabId}-period" readonly>
                        </div>
                     </div>
                     <div class="row mb-3">
                        <div class="col-md-6">
                           <label for="${tabId}-amount" class="form-label">가입 금액</label> 
                           <input type="number" class="form-control" id="${tabId}-amount" required>
                        </div>
                        <div class="col-md-6">
                           <label for="${tabId}-target-period" class="form-label">목표 기간</label> 
                              <input type="number" class="form-control" id="${tabId}-target-period" required>
                        </div>
                     </div>
                     <div class="row mb-3">
                        <div class="col-md-6">
                           <label for="${tabId}-interest" class="form-label">적용 이율</label>
                           <input type="number" class="form-control" id="${tabId}-interest" readonly>
                        </div>
                        <div class="col-md-6 d-flex align-items-end">
                           <button type="button" class="btn btn-primary w-100" onclick="calculateInterest('${tabId}')">이자 계산</button>
                        </div>
                     </div>
                  </form>

                  <div class="row mt-4">
                     <div class="col-md-6">
                        <table class="table table-bordered">
                           <thead>
                              <tr>
                                 <th style="width: 50%;">항목</th>
                                 <th>금액</th>
                              </tr>
                           </thead>
                           <tbody id="${tabId}-table-body">
                              <tr>
                                 <td>원금</td>
                                 <td id="${tabId}-principal">0 원</td>
                              </tr>
                              <tr>
                                 <td>세전 이자</td>
                                 <td id="${tabId}-interest-before-tax">0 원</td>
                              </tr>
                              <tr>
                                 <td>세금</td>
                                 <td id="${tabId}-tax">0 원</td>
                              </tr>
                              <tr>
                                 <td>세전 수령</td>
                                 <td id="${tabId}-total-before-tax">0 원</td>
                              </tr>
                              <tr>
                                 <td>세후 수령</td>
                                 <td id="${tabId}-total-after-tax">0 원</td>
                              </tr>
                           </tbody>
                        </table>
                        <button type="button" class="btn btn-default"
                           onclick="openCustomerModal('${tabId}')">고객 조회</button>
                     </div>
                     <div class="col-md-6">
                        <div id="${tabId}-chart" style="width: 100%; height: 300px;"></div>
                     </div>
                  </div>

                  <div class="row mt-4" id="${tabId}-customer-info"
                     style="display: none;">
                     <div class="col-md-6">
                        <label for="${tabId}-cust-code" class="form-label">고객 코드</label>
                        <input type="text" id="${tabId}-cust-code" class="form-control" readonly>
                     </div>
                     <div class="col-md-6">
                        <label for="${tabId}-cust-name" class="form-label">고객 이름</label>
                        <input type="text" id="${tabId}-cust-name" class="form-control" readonly>
                     </div>
                  </div>
                  <div class="row mt-2" id="${tabId}-customer-details"
                     style="display: none;">
                     <div class="col-md-6">
                        <label for="${tabId}-cust-phonenumber" class="form-label">전화번호</label>
                        <input type="text" id="${tabId}-cust-phonenumber" class="form-control" readonly>
                     </div>
                     <div class="col-md-6">
                        <label for="${tabId}-cust-birth" class="form-label">생년월일</label>
                        <input type="text" id="${tabId}-cust-birth" class="form-control" readonly>
                     </div>
                     <div class="col-md-6">
                        <label for="${tabId}-cust-gen" class="form-label">성별</label> <input
                           type="text" id="${tabId}-cust-gen" class="form-control" readonly>
                     </div>
                     <div class="col-md-6">
                        <label for="${tabId}-cust-type" class="form-label">고객 타입</label>
                        <input type="text" id="${tabId}-cust-type" class="form-control" readonly>
                     </div>
                     <div class="col-md-6">
                        <label for="${tabId}-user-id" class="form-label">사용자 ID</label>
                        <input type="text" id="${tabId}-user-id" class="form-control" readonly>
                     </div>
                  </div>

                  <div class="col-md-6 mt-3">
                     <button type="button" class="btn btn-success" onclick="savePlan('${tabId}')">저장</button>
                  </div>
               </div>
            </c:forEach>
         </div>

         <!-- Customer Modal -->
         <div class="modal fade" id="customerModal" tabindex="-1"
            role="dialog" aria-labelledby="customerModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
               <div class="modal-content">
                  <div class="modal-header">
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                     </button>
                     <h4 class="modal-title" id="customerModalLabel">고객 목록</h4>
                  </div>
                  <div class="modal-body">
                     <table class="table">
                        <thead>
                           <tr>
                              <th>고객 코드</th>
                              <th>고객 이름</th>
                              <th>전화번호</th>
                           </tr>
                        </thead>
                        <tbody id="customer-list">
                           <!-- 고객 목록 데이터가 여기에 동적으로 추가됩니다 -->
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>

   <!-- Bootstrap 3 JavaScript -->
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
   <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
   <script src="https://www.gstatic.com/charts/loader.js"></script>
   <script>
       // Google Charts 라이브러리 로드 및 초기화
       google.charts.load('current', {
           packages: ['corechart']
       });
       google.charts.setOnLoadCallback(initializeCharts);
   
       // 차트 초기화 함수
       function initializeCharts() {
           // 각 탭별로 초기 차트를 빈 데이터로 설정
           ['deposit', 'savings', 'challenge'].forEach(tabId => {
               updateChart(tabId, 0, 0, 0, 0, 0);
           });
       }
   
       // 상품 세부 정보 가져오기
       window.fetchProductDetails = function (tabId) {
           const productSelect = document.getElementById(tabId + '-product');
           const selectedOption = productSelect.options[productSelect.selectedIndex];
   
           if (selectedOption.value !== '상품 선택') {
               // 선택된 상품의 이자율과 납입 주기 정보 가져오기
               const interest = selectedOption.getAttribute('data-interest');
               const period = selectedOption.getAttribute('data-period');
   
               // 화면에 세팅
               document.getElementById(tabId + '-interest').value = interest;
               document.getElementById(tabId + '-period').value = mapPeriodToLabel(period);
           } else {
               // 상품을 선택하지 않은 경우 필드 초기화
               document.getElementById(tabId + '-interest').value = '';
               document.getElementById(tabId + '-period').value = '';
           }
       }
   
       // 납입 주기를 라벨로 변환하는 함수
       function mapPeriodToLabel(period) {
           switch (period) {
               case '7':
                   return '주납';
               case '1':
                   return '월납';
               case '9':
                   return '일시납';
               default:
                   return '';
           }
       }
   
       window.calculateInterest = function (tabId) {
           // 입력된 값 가져오기
           const principalInput = document.getElementById(tabId + '-amount');
           const interestInput = document.getElementById(tabId + '-interest');
           const targetPeriodInput = document.getElementById(tabId + '-target-period');
           const productSelect = document.getElementById(tabId + '-product');

           // 입력된 값 파싱
           const principal = parseFloat(principalInput.value) || 0;
           const interestRate = parseFloat(interestInput.value) / 100 || 0;
           const targetPeriod = parseInt(targetPeriodInput.value) || 0;

           // 유효성 검사
           if (principal <= 0 || interestRate <= 0 || targetPeriod <= 0) {
               alert('모든 필드를 올바르게 입력하세요.');
               return;
           }

           // 선택된 상품 정보 가져오기
           const selectedOption = productSelect.options[productSelect.selectedIndex];
           const taxType = selectedOption.getAttribute('data-tax-type');
           const interestTaxRate = taxType === "1" ? 0.154 : 0.0415;

           let totalAmountBeforeTax = 0;
           let totalInterest = 0;
           let totalAmount = 0;
           let accumulatedPrincipal = 0;

           // 적금 계산 (월복리)
           if (tabId === 'savings') {
               const months = targetPeriod * 12;
               const monthlyRate = interestRate / 12;

               for (let i = 0; i < months; i++) {
                   accumulatedPrincipal += principal;
                   const monthInterest = accumulatedPrincipal * monthlyRate;
                   totalInterest += monthInterest;
                   accumulatedPrincipal += monthInterest;
               }
               totalAmountBeforeTax = accumulatedPrincipal;
               totalAmount = principal * months;  // 총 원금 합계
           }
           // 챌린지 계산 (주 복리)
           else if (tabId === 'challenge') {
               const weeks = targetPeriod; // targetPeriod는 주 단위로 입력된다고 가정
               const weeklyRate = interestRate / 52; // 주 이자율

               for (let i = 0; i < weeks; i++) {
                   accumulatedPrincipal += principal;
                   const weekInterest = accumulatedPrincipal * weeklyRate;
                   totalInterest += weekInterest;
                   accumulatedPrincipal += weekInterest;
               }
               totalAmountBeforeTax = accumulatedPrincipal;
               totalAmount = principal * weeks;  // 총 원금 합계
           }
           // 예금 계산 (단리)
           else if (tabId === 'deposit') {
               totalInterest = principal * interestRate * targetPeriod;
               totalAmountBeforeTax = principal + totalInterest;
               totalAmount = totalAmountBeforeTax;
           }

           // 세후 금액 계산
           const tax = Math.round(totalInterest * interestTaxRate);
           const totalAmountAfterTax = totalAmountBeforeTax - tax;

           // 소수점 버림 처리
           const totalAmountFloor = Math.floor(totalAmount);
           const totalInterestFloor = Math.floor(totalInterest);
           const taxFloor = Math.floor(tax);
           const totalAmountBeforeTaxFloor = Math.floor(totalAmountBeforeTax);
           const totalAmountAfterTaxFloor = Math.floor(totalAmountAfterTax);

           // 화면 업데이트 및 차트 그리기
           updateChart(tabId, totalAmountFloor, totalInterestFloor, taxFloor, totalAmountBeforeTaxFloor, totalAmountAfterTaxFloor);
       };


       // 차트 업데이트 함수
       function updateChart(tabId, principal, interestBeforeTax, tax, totalBeforeTax, totalAfterTax) {
           // 차트 데이터 준비
           const data = google.visualization.arrayToDataTable([
               ['항목', '금액'],
               ['원금', principal],
               ['세전 이자', interestBeforeTax],
               ['세금', tax],
               ['세전 수령', totalBeforeTax],
               ['세후 수령', totalAfterTax]
           ]);
   
           // 차트 옵션 설정
           const options = {
               title: '이자 추이',
               curveType: 'function',
               legend: {
                   position: 'bottom'
               }
           };
   
           // 차트 생성 및 화면에 표시
           const chart = new google.visualization.BarChart(document.getElementById(tabId + '-chart'));
           chart.draw(data, options);
   
           // 화면에 계산 결과 표시
           document.getElementById(tabId + '-principal').innerText = principal.toLocaleString() + ' 원';
           document.getElementById(tabId + '-interest-before-tax').innerText = interestBeforeTax.toLocaleString() + ' 원';
           document.getElementById(tabId + '-tax').innerText = tax.toLocaleString() + ' 원';
           document.getElementById(tabId + '-total-before-tax').innerText = totalBeforeTax.toLocaleString() + ' 원';
           document.getElementById(tabId + '-total-after-tax').innerText = totalAfterTax.toLocaleString() + ' 원';
       }
   
       // 고객 모달 열기 함수
       window.openCustomerModal = function (tabId) {
           // Bootstrap 모달 열기
           $('#customerModal').modal('show');
           window.currentTabId = tabId; // 현재 탭 ID 설정
           fetchCustomerList(); // 고객 리스트 가져오기
       }
   
       // 고객 리스트 가져오기 함수
       function fetchCustomerList() {
           fetch('/promotion_th/getCustomerList') // 고객 리스트 API 호출
               .then(response => {
                   if (!response.ok) {
                       throw new Error(`네트워크 응답이 실패했습니다: ${response.statusText}`);
                   }
                   return response.json();
               })
               .then(data => {
                   // 데이터 유효성 검사
                   if (!Array.isArray(data)) {
                       throw new Error('잘못된 데이터 형식입니다: 배열을 기대했습니다');
                   }
   
                   const customerList = document.getElementById('customer-list');
                   customerList.innerHTML = '';
   
                   // 고객 데이터를 테이블에 추가
                   data.forEach(cust => {
                       if (!cust.cust_code || !cust.cust_name || !cust.cust_phonenum) {
                           console.warn('잘못된 고객 데이터:', cust);
                           return;
                       }
   
                       const listItem = document.createElement('tr');
                       const listItemCode = document.createElement('td');
                       const listItemName = document.createElement('td');
                       const listItemPhone = document.createElement('td');
   
                       // 클릭 이벤트 설정
                       listItem.className = 'customer-list-item';
                       listItem.onclick = () => selectCustomer(
                           window.currentTabId,
                           cust.cust_code,
                           cust.cust_name,
                           cust.cust_phonenum,
                           cust.cust_birth,
                           cust.cust_gen,
                           cust.cust_type,
                           cust.user_id
                       );
   
                       // 텍스트 노드 추가
                       listItemCode.appendChild(document.createTextNode(cust.cust_code));
                       listItemName.appendChild(document.createTextNode(cust.cust_name));
                       listItemPhone.appendChild(document.createTextNode(cust.cust_phonenum));
   
                       // 테이블에 아이템 추가
                       listItem.appendChild(listItemCode);
                       listItem.appendChild(listItemName);
                       listItem.appendChild(listItemPhone);
                       customerList.appendChild(listItem);
                   });
               })
               .catch(error => {
                   console.error('고객 리스트 가져오기 오류:', error);
               });
       }
   
       // 선택된 고객 설정 함수
       window.selectCustomer = function (tabId, custCode, custName, custPhonenum, custBirth, custGen, custType, userId) {
           // 화면에 고객 정보 표시
           document.getElementById(tabId + '-cust-code').value = custCode;
           document.getElementById(tabId + '-cust-name').value = custName;
           document.getElementById(tabId + '-cust-phonenumber').value = custPhonenum;
           document.getElementById(tabId + '-cust-birth').value = custBirth;
           document.getElementById(tabId + '-cust-gen').value = custGen;
           document.getElementById(tabId + '-cust-type').value = mapCustomerType(custType);
           document.getElementById(tabId + '-user-id').value = userId;
         
           // 고객 정보 영역 표시
           document.getElementById(tabId + '-customer-info').style.display = 'block';
           document.getElementById(tabId + '-customer-details').style.display = 'block';
   
           // 모달 닫기
           $('#customerModal').modal('hide');
       }
   
       // 고객 타입 매핑 함수
       function mapCustomerType(custType) {
           switch (custType) {
               case '1':
                   return '일반';
               case '2':
                   return '다자녀';
               case '3':
                   return '청년';
               default:
                   return '';
           }
       }
   
       // 계획 저장 함수
       window.savePlan = function(tabId) {
          // 폼 데이터 가져오기
          const form = document.getElementById(tabId + '-form');
          const formData = new FormData(form);
      
          // 상품 코드, 계획 금액, 계획 기간 가져오기
          const productSelect = document.getElementById(tabId + '-product');
          const selectedOption = productSelect.options[productSelect.selectedIndex];
          const prodCode = selectedOption.getAttribute('data-code'); // prod_code는 data-code 속성에 저장
         
          // 이율, 기간, 고객 코드 가져오기
          const planAmt = document.getElementById(tabId + '-amount').value;
          const planTerm = document.getElementById(tabId + '-target-period').value;
          const custCode = document.getElementById(tabId + '-cust-code').value;
      
          // 추가 필드 FormData에 추가
          formData.append('prod_code', selectedOption.getAttribute('data-code'));
          formData.append('plan_amt', document.getElementById(tabId + '-amount').value);
          formData.append('plan_term', document.getElementById(tabId + '-target-period').value);
          formData.append('user_id', userId);
          formData.append('cust_code', document.getElementById(tabId + '-cust-code').value);
          formData.append('plan_state', '1');

          // fetch API를 사용하여 서버로 데이터 전송 (POST 메서드 사용)
          fetch('/promotion_th/savePlan', {
              method: 'POST',
              body: formData
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error('네트워크 응답이 실패했습니다');
              }
              return response.json();
          })
          .then(data => {
              alert('금융상품 제안 완료되었습니다'); // 성공 메시지 표시
              window.location.href = '/promotion_th/designList_th';
          })
          .catch(error => {
              console.error('계획 저장 오류:', error);
              alert('저장 실패: ' + error.message); // 오류 메시지 표시
          });
      }
   </script>
</body>
</html>
