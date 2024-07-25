<%@ page language="java" contentType="text/html; charset=UTF-8"
   pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

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

<title>상품 등록 조회</title>

<script src="/static_resources/lib/vue/2.6.12/vue.min.js"></script>
<script src="/static_resources/js/commonLib.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<style>
.form-group {
   display: flex;
   align-items: flex-start;
   margin-bottom: 1rem;
}

.form-group label {
   width: 120px;
   margin-bottom: 0;
   text-align: right;
   padding-right: 10px;
   padding-top: 0.375rem;
}

.form-group .form-control, .form-group .form-select {
   flex: 1;
}

.amount-group {
   display: flex;
   align-items: center;
   flex: 1;
}

.amount-group input {
   flex: 1;
}

.amount-group span {
   margin: 0 10px;
}

.modal-body {
   max-height: 70vh;
   overflow-y: auto;
}

.table td, .table th {
   white-space: normal;
   word-wrap: break-word;
}

.modal {
   display: none;
   /* 기본적으로 모달 숨김 */
   position: fixed;
   z-index: 1050;
   left: 0;
   top: 0;
   width: 100%;
   height: 100%;
   overflow: auto;
   background-color: rgba(0, 0, 0, 0.4);
   /* 배경은 반투명한 검은색 */
}

.modal-dialog {
   position: relative;
   margin: auto;
   width: auto;
   max-width: 90%;
}

.modal-content {
   position: relative;
   background-color: #fefefe;
   margin: auto;
   padding: 20px;
   border: 1px solid #888;
   border-radius: 10px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
   outline: 0;
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

         <div id="app">
            <h1 class="mb-4">상품 등록 조회</h1>
            <hr>
            <form id="productForm" onsubmit="return submitForm(event)">
               <input type="hidden" id="prod_code" name="prod_code">
               <div class="form-group">
                  <label for="prod_name">상품명</label> <input type="text"
                     id="prod_name" class="form-control" placeholder="상품명을 입력하세요"
                     required>
               </div>
               <div class="form-group">
                  <label for="prod_type">상품유형</label> <select id="prod_type"
                     class="form-select" required onchange="changeProductType()">
                     <option value="" selected disabled>상품 유형</option>
                     <option value="적금">적금</option>
                     <option value="예금">예금</option>
                     <option value="챌린지">챌린지</option>
                  </select>
               </div>
               <div class="form-group">
                  <label for="prod_subscrip_type">가입유형</label> <select
                     id="prod_subscrip_type" class="form-select" required>
                     <option value="" selected disabled>가입 유형</option>
                     <option value="1">일반</option>
                     <option value="2">다자녀</option>
                     <option value="3">청년</option>
                  </select>
               </div>
               <div class="form-group">
                  <label>가입금액기준</label>
                  <div class="amount-group">
                     <input type="number" id="prod_min_amt" placeholder="최소금액을 입력하세요"
                        class="form-control" required> <span>~</span> <input
                        type="number" id="prod_max_amt" placeholder="최대금액을 입력하세요"
                        class="form-control" required>
                  </div>
               </div>
               <div class="form-group">
                  <label for="prod_pay_cy">납입주기</label> <input type="text"
                     id="prod_pay_cy" class="form-control" placeholder="납입 주기를 입력하세요"
                     required>
               </div>
               <div class="form-group">
                  <label for="prod_air">적용이율</label> <input type="number"
                     step="0.01" id="prod_air" class="form-control"
                     placeholder="적용이율을 입력하세요" required>
               </div>
               <div class="form-group">
                  <label for="prod_tax_type">과세 유형</label> <select
                     id="prod_tax_type" class="form-select" required>
                     <option value="" selected disabled>과세 유형</option>
                     <option value="1">일반과세</option>
                     <option value="2">세금우대</option>
                  </select>
               </div>
               <div class="form-group">
                  <label for="prod_sales_state">판매상태</label> <select
                     id="prod_sales_state" class="form-select" required>
                     <option value="" selected disabled>판매 상태</option>
                     <option value="1">판매준비</option>
                     <option value="2">판매중</option>
                     <option value="3">판매중지</option>
                  </select>
               </div>
               <div class="form-group">
                  <div class="mt-4">
                     <button type="button" id="loadButton"
                        class="btn btn-primary me-2" onclick="openProductList()">불러오기</button>
                     <button type="button" id="updateButton"
                        class="btn btn-success me-2"
                        onclick="submitForm(event, 'update')">수정</button>
                     <button type="button" id="submitButton" class="btn btn-info me-2"
                        onclick="submitForm(event, 'insert')">저장</button>
                  </div>
               </div>
            </form>
            <div class="modal" id="productListModal">
               <div class="modal-dialog modal-xl">
                  <div class="modal-content">
                     <div class="modal-header">
                        <h5 class="modal-title" id="productListModalLabel">상품 목록</h5>
                        <span class="close" onclick="closeModal()">&times;</span>
                     </div>
                     <div class="modal-body">
                        <div id="loadingIndicator" style="display: none;">로딩 중...</div>
                        <table class="table">
                           <thead>
                              <tr>
                                 <th>상품명</th>
                                 <th>상품유형</th>
                                 <th>가입대상</th>
                                 <th>최소금액</th>
                                 <th>최대금액</th>
                                 <th>납입주기</th>
                                 <th>적용이율</th>
                                 <th>과세유형</th>
                                 <th>판매상태</th>
                                 <th>선택</th>
                              </tr>
                           </thead>
                           <tbody id="productList"></tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
   <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
   <script>
       let currentMode = 'insert';
   
       function openProductList() {
           loadProductList();
           const modal = document.getElementById('productListModal');
           modal.style.display = 'block';
       }
   
       function closeModal() {
           var modal = document.getElementById("productListModal");
           modal.style.display = "none";
           document.body.style.overflow = "auto"; // 모달이 닫히면 스크롤을 다시 허용
       }
       
       function changeProductType() {
           var productType = document.getElementById("prod_type").value;
           var paymentCycleSelect = document.getElementById("prod_pay_cy");
   
           // 상품유형에 따라 납입 주기 입력란의 기본값 설정
           if (productType === "적금") {
               paymentCycleSelect.value = "월납"; 
           } else if (productType === "예금") {
               paymentCycleSelect.value = "일시납"; 
           } else if (productType === "챌린지") {
               paymentCycleSelect.value = "주납"; 
           } else {
               paymentCycleSelect.value = "";
           }
       }
   
       async function loadProductList() {
           const loadingIndicator = document.getElementById('loadingIndicator');
           loadingIndicator.style.display = 'block'; // Show loading indicator
   
           try {
               const response = await fetch('/prod_th/getList', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   }
               });
   
               if (!response.ok) {
                   throw new Error('Network response was not ok');
               }
   
               const data = await response.json();
               const productList = document.getElementById('productList');
   
               productList.innerHTML = data.map(product => {
                   const payCycle = getPayCycleText(product.prod_pay_cy);
                   return '<tr>' + 
                       '<td>' + product.prod_name + '</td>' +
                       '<td>' + product.prod_type + '</td>' +
                       '<td>' + getProdSubscriptTypeName(product.prod_subscrip_type) + '</td>' +
                       '<td>' + product.prod_min_amt + '</td>' +
                       '<td>' + product.prod_max_amt + '</td>' +
                       '<td>' + payCycle + '</td>' +
                       '<td>' + product.prod_air + '</td>' +
                       '<td>' + getTaxTypeName(product.prod_tax_type) + '</td>' +
                       '<td>' + getSalesStateName(product.prod_sales_state) + '</td>' +
                       '<td>' +
                       '<button type="button" onclick="selectProduct(' +
                       JSON.stringify(product).replace(/"/g, '&quot;') + ')" class="btn btn-sm btn-primary">선택</button>' + '</td>' +
                   '</tr>';
               }).join('');
           } catch (error) {
               console.error('Error loading product list:', error);
           } finally {
               loadingIndicator.style.display = 'none'; // Hide loading indicator
           }
       }
   
       function selectProduct(product) {
           document.getElementById('prod_code').value = product.prod_code || '';
           document.getElementById('prod_name').value = product.prod_name || '';
           document.getElementById('prod_type').value = product.prod_type || '';
           document.getElementById('prod_subscrip_type').value = product.prod_subscrip_type || '';
           document.getElementById('prod_min_amt').value = product.prod_min_amt || '';
           document.getElementById('prod_max_amt').value = product.prod_max_amt || '';
           document.getElementById('prod_pay_cy').value = getPayCycleText(product.prod_pay_cy) || '';
           document.getElementById('prod_air').value = product.prod_air || '';
           document.getElementById('prod_tax_type').value = product.prod_tax_type || '';
           document.getElementById('prod_sales_state').value = product.prod_sales_state || '';
   
           currentMode = 'update'; // 모드를 업데이트로 설정
   
           const modal = document.getElementById('productListModal');
           modal.style.display = 'none';
       }
   
       function submitForm(event, mode) {
           event.preventDefault();
           const prodCode = document.getElementById('prod_code').value;
           const params = {
               prod_code: prodCode ? Number(prodCode) : null,
               prod_name: $("#prod_name").val().trim(),
               prod_type: $("#prod_type").val(),
               prod_subscrip_type: $("#prod_subscrip_type").val(),
               prod_min_amt: parseFloat($("#prod_min_amt").val()),
               prod_max_amt: parseFloat($("#prod_max_amt").val()),
               prod_pay_cy: getPayCycleValue($("#prod_pay_cy").val()), // 서버에 숫자로 전송
               prod_air: parseFloat($("#prod_air").val()),
               prod_tax_type: $("#prod_tax_type").val(),
               prod_sales_state: $("#prod_sales_state").val(),
               save_mode: currentMode
           };
   
           if (!params.prod_name || !params.prod_type || !params.prod_min_amt ||
               !params.prod_subscrip_type || !params.prod_max_amt ||
               !params.prod_pay_cy || !params.prod_air ||
               !params.prod_tax_type || !params.prod_sales_state) {
               alert("모든 필드를 입력해 주세요.");
               return;
           }
   
           if (!confirm("저장하시겠습니까?"))
               return;
   
           cf_ajax("/prod_th/save", params, function(response) {
               alert("상품 정보가 성공적으로 저장되었습니다.");
               clearForm(); // 성공적으로 저장 후 폼을 초기화
               window.location.href = "/prod_th/prodList_th";
           });
       }
   
       function clearForm() {
           document.getElementById('prod_code').value = '';
           document.getElementById('prod_name').value = '';
           document.getElementById('prod_type').value = '';
           document.getElementById('prod_subscrip_type').value = '';
           document.getElementById('prod_min_amt').value = '';
           document.getElementById('prod_max_amt').value = '';
           document.getElementById('prod_pay_cy').value = '';
           document.getElementById('prod_air').value = '';
           document.getElementById('prod_tax_type').value = '';
           document.getElementById('prod_sales_state').value = '';
           currentMode = 'insert'; // Reset mode to insert
       }
   
       function getProdSubscriptTypeName(type) {
           const types = {
               '1': '일반',
               '2': '다자녀',
               '3': '청년'
           };
           return types[type] || '';
       }
   
       function getPayCycleText(cycle) {
           const cycles = {
               '1': '월납',
               '7': '주납',
               '9': '일시납'
           };
           return cycles[cycle] || '';
       }
   
       function getPayCycleValue(cycleText) {
           const cycles = {
               '월납': '1',
               '주납': '7',
               '일시납': '9'
           };
           return cycles[cycleText] || '';
       }
   
       function getTaxTypeName(type) {
           const types = {
               '1': '일반과세',
               '2': '세금우대'
           };
           return types[type] || '';
       }
   
       function getSalesStateName(state) {
           const states = {
               '1': '판매준비',
               '2': '판매중',
               '3': '판매중지'
           };
           return states[state] || '';
       }
   </script>

</body>

</html>
