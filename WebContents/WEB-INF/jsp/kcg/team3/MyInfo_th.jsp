<%@ page language="java" contentType="text/html; charset=UTF-8"
   pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>내 정보</title>
    <!-- 제이쿼리 사용 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <!-- 폰트어썸 4.0 -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
    <!-- JS경로 -->
    <script src="/static_resources/login/myInfoUpdateForm.js"></script>
    <!-- CSS 경로-->
    <link rel="stylesheet" type="text/css" href="/static_resources/login/userRegistForm.css">
    <style>
        .resign-button {
            background-color: #ff0000;
        }

        .resign-button:hover {
            background-color: #cc0000;
            /* 마우스 오버 시 밝은 빨간색으로 변경 */
        }
    </style>
    <script>
        function setDeptNmValue() {
            var selectedDeptValue = document.getElementById("deptNmValue").value;
            var selectedJbpsValue = document.getElementById("jbpsTyCd").value;

            // 기존의 값들을 가져와서 변경된 값만 업데이트
            document.getElementById("deptNm").value = selectedDeptValue;
            document.getElementById("jbpsNm").value = selectedJbpsValue;
        }

        function setJbpsTyCd() {
            var selectedDeptValue = document.getElementById("deptNmValue").value;
            var selectedJbpsValue = document.getElementById("jbpsTyCd").value;

            // 기존의 값들을 가져와서 변경된 값만 업데이트
            document.getElementById("deptNm").value = selectedDeptValue;
            document.getElementById("jbpsNm").value = selectedJbpsValue;
        }
    </script>
</head>

<body style="text-align: center; margin: 0 auto; display: inline; padding-top: 100px;">
    <main class="form-signin">
        <form action="<c:url value='/login/userUpdateProc'/>" method="post" id="userUpdateForm" onsubmit="return validateForm()" encType="multipart/form-data">
            <br>

            <div class="form-group">
                <label for="userId">*사용자 아이디</label> <input type="text" class="input-radius" id="userId" name="userId" placeholder="" readonly value="${userInfoVO.userId}" style="background-color: #f0f0f0;">
            </div>
            <br>

            <!--          <div class="form-group">
            <label for="userPswd">*비밀번호 : </label> <input type="password"
               class="input-radius" id="userPswd" name="userPswd" placeholder=""
               oninput="confirmPswdVl()">
         </div>
         <br>

         <div class="form-group">
            <label for="pswdVlConfirm">*비밀번호 확인 : </label> <input
               type="password" class="input-radius" id="pswdVlConfirm"
               name="pswdVlConfirm" placeholder="" oninput="confirmPswdVl()">
            <br>
            <div id="dynamicContent"></div>
         </div>
         <br> -->

            <div class="form-group">
                <label for="userNm">*사용자명 : </label> <input type="text" class="input-radius" id="userNm" name="userNm" placeholder="" readonly value="${userInfoVO.name}" style="background-color: #f0f0f0;">
            </div>
            <br>

            <div class="form-group">
                <label for="picMblTelno">*연락처 : </label> <input type="text" class="input-radius" id="picMblTelno" name="picMblTelno" placeholder="" readonly value="${userInfoVO.picMblTelno}" style="background-color: #f0f0f0;">
            </div>
            <br>

            <div class="form-group">
                <label for="picEmlAddr">*이메일 : </label> <input type="text" class="input-radius" id="picEmlAddr" name="picEmlAddr" placeholder="" oninput="checkEmail()" required autofocus readonly value="${userInfoVO.email}" style="background-color: #f0f0f0;">
            </div>
            <br>

            <div class="form-group">
                <label for="deptNmValue">*부서명 : </label> <select id="deptNmValue" name="deptNmValue" class="form-control" onchange="setDeptNmValue()">
                    <option ${userInfoVO.dept==null ? 'selected' : '' } disabled>부서 선택</option>
                    <option value="개발" ${userInfoVO.dept=='개발' ? 'selected' : '' }>개발</option>
                    <option value="마케팅" ${userInfoVO.dept=='마케팅' ? 'selected' : '' }>마케팅</option>
                </select> <input type="hidden" class="input-radius" id="deptNm" name="deptNm" placeholder="">
            </div>
            <br>

            <div class="form-group">
                <label for="jbpsTyCd">*직위 : </label> <select id="jbpsTyCd" name="jbpsTyCd" class="form-control" onchange="setJbpsTyCd()">
                    <option ${userInfoVO.jikgubNm==null ? 'selected' : '' } disabled>직위 선택</option>
                    <option value="회장" ${userInfoVO.jikgubNm=='회장' ? 'selected' : '' }>회장</option>
                    <option value="사장" ${userInfoVO.jikgubNm=='사장' ? 'selected' : '' }>사장</option>
                    <option value="부사장" ${userInfoVO.jikgubNm=='부사장' ? 'selected' : '' }>부사장</option>
                    <option value="전무이사" ${userInfoVO.jikgubNm=='전무이사' ? 'selected' : '' }>전무이사</option>
                    <option value="상무이사" ${userInfoVO.jikgubNm=='상무이사' ? 'selected' : '' }>상무이사</option>
                    <option value="이사" ${userInfoVO.jikgubNm=='이사' ? 'selected' : '' }>이사</option>
                    <option value="전문위원" ${userInfoVO.jikgubNm=='전문위원' ? 'selected' : '' }>전문위원</option>
                    <option value="위원" ${userInfoVO.jikgubNm=='위원' ? 'selected' : '' }>위원</option>
                    <option value="부장" ${userInfoVO.jikgubNm=='부장' ? 'selected' : '' }>부장</option>
                    <option value="차장" ${userInfoVO.jikgubNm=='차장' ? 'selected' : '' }>차장</option>
                    <option value="과장" ${userInfoVO.jikgubNm=='과장' ? 'selected' : '' }>과장</option>
                    <option value="대리" ${userInfoVO.jikgubNm=='대리' ? 'selected' : '' }>대리</option>
                    <option value="주임" ${userInfoVO.jikgubNm=='주임' ? 'selected' : '' }>주임</option>
                    <option value="계장" ${userInfoVO.jikgubNm=='계장' ? 'selected' : '' }>계장</option>
                    <option value="사원" ${userInfoVO.jikgubNm=='사원' ? 'selected' : '' }>사원</option>
                    <option value="수석연구원" ${userInfoVO.jikgubNm=='수석연구원' ? 'selected' : '' }>수석연구원</option>
                    <option value="책임연구원" ${userInfoVO.jikgubNm=='책임연구원' ? 'selected' : '' }>책임연구원</option>
                    <option value="선임연구원" ${userInfoVO.jikgubNm=='선임연구원' ? 'selected' : '' }>선임연구원</option>
                    <option value="연구원" ${userInfoVO.jikgubNm=='연구원' ? 'selected' : '' }>연구원</option>
                </select> <input type="hidden" class="input-radius" id="jbpsNm" name="jbpsNm" placeholder="">
            </div>
            <br>
            <input type="hidden" id="statusCd" name="statusCd" value="AAA">
            <input type="submit" value="수정" name="submitType">
            <button type="submit" name="submitType" value="퇴사" class="resign-button">퇴사</button>
        </form>
    </main>
</body>

</html>