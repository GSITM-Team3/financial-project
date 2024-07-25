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

            <h1 class="text-center mb-4">설계 관리(제안, 가입 설정)</h1>

            <div class="tab-content" id="myTabContent">
                <c:forEach items="${tabArray}" var="tabId" varStatus="status">
                    <div class="tab-pane fade ${status.index == 0 ? 'in active' : ''}" id="${tabId}" role="tabpanel">
                        <form id="calculatorForm">
                            <div class="row mb-3">
                                <div class="col-md-6" style="display: none;">
                                    <input id="userId" name="userId" value="${userInfoVO.userId}" readonly type="hidden">
                                </div>
                                <div class="col-md-6">
                                    <label for="productName" class="form-label">상품 선택</label>
                                    <input type="text" id="productName" class="form-control" value="${designDetail.prod_name}" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label for="paymentCycle" class="form-label">납입 주기</label>
                                    <input type="text" class="form-control" id="paymentCycle" value="${designDetail.prod_pay_cy}" readonly>
                                </div>
                            </div>
                            <div class="row mb-3">
							    <div class="col-md-6">
							        <label for="amount" class="form-label">가입 금액</label>
							        <input type="text" class="form-control" id="amount" value="${designDetail.plan_amt}" readonly>
							    </div>
							    <div class="col-md-6">
							        <label for="term" class="form-label">목표 기간 <span id="termLabel">(연단위)</span></label>
							        <input type="text" class="form-control" id="term" value="${designDetail.plan_term}" readonly>
							    </div>
							</div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="interestRate" class="form-label">적용 이율</label>
                                    <input type="text" class="form-control" id="interestRate" value="${designDetail.prod_air}" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label for="prodTaxType" class="form-label">세금 유형</label>
                                    <input type="text" class="form-control" id="prodTaxType" value="${designDetail.prod_tax_type}" readonly>
	                                <input type="hidden" class="form-control" id="planCode" value="${designDetail.plan_code}">
                                </div>
                                <div class="col-md-6" style="display: none;">
                                    <label for="planCode" class="form-label"></label>
	                                <input type="hidden" class="form-control" id="planCode" value="${designDetail.plan_code}">
                                </div>
                            </div>
                        </form>

                        <div class="row mt-4">
                            <div class="col-md-6">
                                <table class="table table-bordered" id="resultsTable">
                                    <thead>
                                        <tr>
                                            <th style="width: 50%;">항목</th>
                                            <th>금액</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>원금</td>
                                            <td id="principalAmount">0 원</td>
                                        </tr>
                                        <tr>
                                            <td>세전 이자</td>
                                            <td id="preTaxInterest">0 원</td>
                                        </tr>
                                        <tr>
                                            <td>세금</td>
                                            <td id="tax">0 원</td>
                                        </tr>
                                        <tr>
                                            <td>세전 수령</td>
                                            <td id="preTaxReceivable">0 원</td>
                                        </tr>
                                        <tr>
                                            <td>세후 수령</td>
                                            <td id="postTaxReceivable">0 원</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <div id="chart_div" style="width: 100%; height: 300px;">
                                    <!-- 차트 위치 -->
                                </div>
                            </div>
                        </div>

                        <div class="row mt-4">
                            <div class="col-md-6">
                                <label for="customerName" class="form-label">고객명</label>
                                <input type="text" id="customerName" class="form-control" value="${designDetail.cust_name}" readonly>
                            </div>
                            <div class="col-md-6">
                                <label for="birthDate" class="form-label">생년월일</label>
                                <input type="text" id="birthDate" class="form-control" value="${designDetail.cust_birth}" readonly>
                            </div>
                            <div class="col-md-6">
                                <label for="phoneNumber" class="form-label">전화번호</label>
                                <input type="text" id="phoneNumber" class="form-control" value="${designDetail.cust_phonenum}" readonly>
                            </div>
                            <div class="col-md-6">
                                <label for="gender" class="form-label">성별</label>
                                <input type="text" id="gender" class="form-control" value="${designDetail.cust_gen}" readonly>
                            </div>
                            <div class="col-md-6">
                                <label for="customerType" class="form-label">고객특성</label>
                                <input type="text" id="customerType" class="form-control" value="${designDetail.cust_type}" readonly>
                            </div>
                            <div class="col-md-6">
                                <label for="managerName" class="form-label">관리자 이름</label>
                                <input type="text" id="managerName" class="form-control" value="${designDetail.manager_name}" readonly>
                            </div>
                            <div class="col-md-6">
                                <label for="status" class="form-label">진행 상태</label>
                                <select class="form-control" id="status">
                                    <option value='진행상태 선택' ${designDetail.plan_state == '진행상태 선택' ? 'selected' : ''} disabled>진행상태 선택</option>
                                    <option value='1' ${designDetail.plan_state == '1' ? 'selected' : ''}>제안 완료</option>
                                    <option value='2' ${designDetail.plan_state == '2' ? 'selected' : ''}>가입 완료</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6 mt-3">
                            <button type="button" class="btn btn-success" id="saveButton">저장</button>
                        </div>
                    </div>
                </c:forEach>
            </div>
        </div>
    </div>

    <!-- Bootstrap 3 JavaScript -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <script src="https://www.gstatic.com/charts/loader.js"></script>
    <script>
    // 차트 로더를 비동기로 로드합니다.    
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(updateCalculations); // 페이지 로드 시 계산 수행
    
    function updateCalculations() {
        const prodTaxType = document.querySelector('#prodTaxType').value;
        const amount = parseFloat(document.querySelector('#amount').value.replace(/,/g, '')) || 0;
        const interestRate = parseFloat(document.querySelector('#interestRate').value.replace(/,/g, '')) / 100 || 0;
        const term = parseFloat(document.querySelector('#term').value.replace(/,/g, '')) || 0;
        const productName = document.querySelector('#productName').value;

        // 세금유형 변환 함수
        const taxTypeText = {
            '1': '일반과세',
            '2': '세금우대'
        };

        // 납입 주기 변환 함수
        const paymentCycleText = {
            '1': '월납',
            '7': '주납',
            '9': '일시납'
        };

        // 고객 특성 변환 함수
        const customerTypeText = {
            '1': '일반',
            '2': '다자녀',
            '3': '청년'
        };

        const interestTaxRates = {
            '1': 0.154, // 일반과세: 15.4%
            '2': 0.0415  // 세금우대: 4.15%
        };

        const interestTaxRate = interestTaxRates[prodTaxType] || 0;

        let totalAmount = 0;
        let totalInterest = 0;
        let accumulatedPrincipal = 0;

        // 목표 기간 레이블 업데이트
        const termLabel = document.querySelector('#termLabel');
        if (productName.includes('적금')) {
            termLabel.textContent = '(연단위)';
        } else if (productName.includes('챌린지')) {
            termLabel.textContent = '(주단위)';
        } else {
            termLabel.textContent = '';
        }

        // 적금 계산 (월복리)
        if (productName.includes('적금')) {
            const months = term * 12;
            const monthlyRate = interestRate / 12;

            for (let i = 0; i < months; i++) {
                accumulatedPrincipal += amount;
                const monthInterest = accumulatedPrincipal * monthlyRate;
                totalInterest += monthInterest;
                accumulatedPrincipal += monthInterest;
            }
            totalAmount = amount * months; // 총 원금 합계
        }
        // 챌린지 계산 (주복리)
        else if (productName.includes('챌린지')) {
            const weeks = term; // term은 주 단위로 입력된다고 가정
            const weeklyRate = interestRate / 52; // 주 이자율

            for (let i = 0; i < weeks; i++) {
                accumulatedPrincipal += amount;
                const weekInterest = accumulatedPrincipal * weeklyRate;
                totalInterest += weekInterest;
                accumulatedPrincipal += weekInterest;
            }
            totalAmount = amount * weeks; // 총 원금 합계
        }
        // 예금 계산 (단리)
        else if (productName.includes('예금')) {
            totalInterest = amount * interestRate * term;
            totalAmount = amount;
            accumulatedPrincipal = amount + totalInterest;
        }

        const totalAmountBeforeTax = accumulatedPrincipal;
        let tax = totalInterest * interestTaxRate;
        const totalAmountAfterTax = totalAmountBeforeTax - tax;

        // 소수점 버림처리
        totalAmount = Math.floor(totalAmount);
        totalInterest = Math.floor(totalInterest);
        tax = Math.floor(tax);
        accumulatedPrincipal = Math.floor(accumulatedPrincipal);
        const totalAmountBeforeTaxFloor = Math.floor(totalAmountBeforeTax);
        const totalAmountAfterTaxFloor = Math.floor(totalAmountAfterTax);

        document.querySelector('#principalAmount').textContent = totalAmount.toLocaleString() + ' 원';
        document.querySelector('#preTaxInterest').textContent = totalInterest.toLocaleString() + ' 원';
        document.querySelector('#tax').textContent = tax.toLocaleString() + ' 원';
        document.querySelector('#preTaxReceivable').textContent = totalAmountBeforeTaxFloor.toLocaleString() + ' 원';
        document.querySelector('#postTaxReceivable').textContent = totalAmountAfterTaxFloor.toLocaleString() + ' 원';

        document.querySelector('#paymentCycle').value = paymentCycleText[document.querySelector('#paymentCycle').value] || document.querySelector('#paymentCycle').value;
        document.querySelector('#prodTaxType').value = taxTypeText[prodTaxType] || prodTaxType;

        // 고객 특성값 업데이트
        const customerType = document.querySelector('#customerType').value;
        document.querySelector('#customerType').value = customerTypeText[customerType] || customerType;

        const data = google.visualization.arrayToDataTable([
            ['항목', '금액'],
            ['원금', totalAmount],
            ['세전 이자', totalInterest],
            ['세금', tax],
            ['세전 수령', totalAmountBeforeTaxFloor],
            ['세후 수령', totalAmountAfterTaxFloor]
        ]);

        const options = {
            title: '금융 계산 결과',
            pieHole: 0.4
        };

        const chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }

	    // 이벤트 리스너 등록
    document.querySelector('#productName').addEventListener('change', updateCalculations);
    document.querySelector('#amount').addEventListener('input', updateCalculations);
    document.querySelector('#interestRate').addEventListener('input', updateCalculations);
    document.querySelector('#term').addEventListener('input', updateCalculations);
    document.querySelector('#prodTaxType').addEventListener('change', updateCalculations);
    document.querySelector('#customerType').addEventListener('change', updateCalculations);

    document.querySelector('#saveButton').addEventListener('click', function() {
        const planCode = document.querySelector('#planCode').value;
        const status = document.querySelector('#status').value;

        console.log('planCode:', planCode);
        console.log('status:', status);

        if (!planCode) {
            alert('Plan code is missing.');
            return;
        }

        $.ajax({
            url: '/promotion_th/updatedPlan',
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: {
                status: status,
                plan_code: planCode
            },
            success: function(response) {
                console.log('서버 응답:', response);
                alert('진행 상태와 수정 시간이 성공적으로 업데이트되었습니다.');
                window.location.href = '/promotion_th/designList_th';
            },
            error: function(xhr, status, error) {
                console.error('오류 세부사항:', {
                    xhr: xhr,
                    status: status,
                    error: error
                });
                alert('업데이트 중 오류가 발생했습니다.');
            }
        });
    });
</script>

    </script>
</body>
</html>
