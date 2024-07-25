<%@ page language="java" contentType="text/html; charset=UTF-8"
   pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>회원 등록</title>
<!-- 제이쿼리 사용 -->
<script
   src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<!-- 폰트어썸 4.0 -->
<link rel="stylesheet"
   href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
<!-- JS경로 -->
<script src="/static_resources/login/userRegistForm.js"></script>
<!-- CSS 경로-->
<link rel="stylesheet" type="text/css"
   href="/static_resources/login/userRegistForm.css">
<script>
   function validateForm() {
     
      var deptNmValue = document.getElementById("deptNmValue");
      var selectedDept = deptNmValue.options[deptNmValue.selectedIndex].text;
      var jbpsTyCd = document.getElementById("jbpsTyCd");
      var selectedJbps = jbpsTyCd.options[jbpsTyCd.selectedIndex].text;
              
      if (selectedDept === "선택") {
         alert("부서명을 선택해주세요.");
         return false; // 폼 제출 방지
      }

      if (selectedJbps === "선택") {
         alert("직위를 선택해주세요.");
         return false;
      }
      
      return true; // 폼 제출 허용
   }
</script>
</head>
<body
   style="text-align: center; margin: 0 auto; display: inline; padding-top: 100px;">
   <main class="form-signin">
      <form action="<c:url value='/login/userRegistProc'/>" method="post"
         id="userForm" onsubmit="return validateForm()"
         encType="multipart/form-data">
         <br>
         
         <div class="form-group">
            <label for="userId">*사용자 아이디</label> <input type="text"
               class="input-radius" id="userId" name="userId" placeholder=""
               oninput=checkUserId()
               required autofocus>
            <div id="checkidtext"></div>
         </div>
         <br>

         <div class="form-group">
            <label for="userPswd">*비밀번호 : </label> <input type="password"
               class="input-radius" id="userPswd" name="userPswd" placeholder=""
               oninput="confirmPswdVl()" required autofocus>
         </div>
         <br>

         <div class="form-group">
            <label for="pswdVlConfirm">*비밀번호 확인 : </label> <input
               type="password" class="input-radius" id="pswdVlConfirm"
               name="pswdVlConfirm" placeholder="" oninput="confirmPswdVl()"
               required autofocus> <br>
            <div id="dynamicContent"></div>
         </div>
         <br>

         <div class="form-group">
            <label for="userNm">*사용자명 : </label> <input type="text"
               class="input-radius" id="userNm" name="userNm" placeholder=""
               oninput=checkUserName()
               required autofocus>
            <div id="checknametext"></div>
         </div>
         <br>

         <div class="form-group">
            <label for="picMblTelno">*연락처 : </label> <input type="text"
               class="input-radius" id="picMblTelno" name="picMblTelno"
               placeholder="" oninput="checkPhoneNumber()" required autofocus>
            <div id="checkPhoneNumtext"></div>
         </div>
         <br>

         <div class="form-group">
            <label for="picEmlAddr">*이메일 : </label> <input type="text"
               class="input-radius" id="picEmlAddr" name="picEmlAddr"
               placeholder="" oninput="checkEmail()" required autofocus> <br>
            <div id="checkEmailtext"></div>
         </div>
         <br>

         <div class="form-group">
            <label for="deptNmValue">*부서명 : </label> <select id="deptNmValue"
               name="deptNmValue" class="form-control" oninput="setValueDeptNm()">
               <option disabled selected hidden>선택</option>
               <c:forEach items="${list}" var="list">
                  <option><c:out value="${list.codeNm}" /></option>
               </c:forEach>
               <input type="hidden" class="input-radius" id="deptNm" name="deptNm"
               placeholder="">
            </select>
         </div>
         <br>

         <div class="form-group">
            <label for="jbpsTyCd">*직위 : </label> <select id="jbpsTyCd"
               name="jbpsTyCd" class="form-control" oninput="setValueJbpsNm()"
               required autofocus>
               <option disabled selected hidden>선택</option>
               <c:forEach items="${list2}" var="list2">
                  <option><c:out value="${list2.codeNm}" /></option>
               </c:forEach>
            </select> <input type="hidden" class="input-radius" id="jbpsNm" name="jbpsNm"
               placeholder="" required autofocus>
         </div>
         <br> <input type="submit" value="가입하기">
         <button type="button" onClick="goMainPage()">뒤로가기</button>
      </form>
   </main>
</body>
</html>