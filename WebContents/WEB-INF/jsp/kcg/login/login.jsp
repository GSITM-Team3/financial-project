<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<jsp:include page="/WEB-INF/jsp/kcg/_include/portal/header_meta.jsp"
	flush="false" />
<title>관리자 로그인</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />

<!--===============================================================================================-->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/gsap.min.js"></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.16.1/TweenMax.min.js"></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>


<link rel="stylesheet" type="text/css"
	href="/static_resources/lib/bootstrap/4.3.1/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css"
	href="/static_resources/lib/fonts/font-awesome-4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css"
	href="/static_resources/login/login.css">
<script src="/static_resources/login/login.js"></script>
<!--===============================================================================================-->

</head>
<body>

	<div id="login-button">
		<img src="/static_resources/login/images/loginBox.png">
	</div>
	<div id="container">
		<h1>환영합니다!</h1>
		<span class="close-btn"> <img
			src="/static_resources/login/images/deletBtn.png">
		</span>

		<form>
			<input type="text" id="usr_id" name="usr_id" placeholder="아이디를 입력하세요">
			<input type="password" id="usr_pw" name="usr_pw"
				placeholder="비밀번호를 입력하세요"> <a href="#" onclick="login()">Log
				in</a>
			<div class="account-container">
				<span class="findId" id="findId">아이디 찾기</span>
				<!-- <span class="findPw" id="findPw">비밀번호 찾기</span> -->
			</div>
			<br>
			<!-- <span class="regist" id="regist">회원 등록</span> -->
			<input type="button" class="regist"
				onClick="location.href = '/login/getRegistUserForm'" value="회원 등록" />

			<!--     <div id="remember-container">
      <input type="checkbox" id="checkbox-2-1" class="checkbox" checked="checked"/>
      <span id="remember">Remember me</span>
    </div> -->

		</form>
	</div>

	<!-- 아이디 찾기 -->
	<div id="forgotten-id-container">
		<h1>ID 찾기</h1>
		<span class="close-btn-inform"> <img
			src="/static_resources/login/images/deletBtn.png">
		</span>

		<form class="findIdForm">
			*사용자명 : <input type="text" class="findIdForm-input" id="userNm"
				name="userNm" placeholder="" required autofocus> *연락처 : <input
				type="text" class="findIdForm-input" id="picMblTelno"
				name="picMblTelno" placeholder="-를 제외한 번호를 입력" required autofocus>

			<!--  *입사일자 :
        <input type="date" class="findIdForm-input" id="jncmpYmd" name="jncmpYmd" required pattern="\d{4}-\d{2}-\d{2}" placeholder="" required autofocus> -->

			<input type="button" class="submitButton" onClick="findUserInfo()"
				value="확인" /> 사용자ID : <input type="text" class="findIdForm-input"
				id="emlAddr" name="emlAddr" placeholder="" readonly>
		</form>
	</div>



	<!-- Forgotten Password Container -->
	<div id="forgotten-pw-container">
		<h1>PW 찾기</h1>
		<span class="close-btn-inform"> <img
			src="/static_resources/login/images/deletBtn.png">
		</span>

		<form class="findPwForm">
			*사용자ID : <input type="text" class="findIdForm-input" id="emlAddr"
				name="emlAddr" placeholder=""> *사용자명 : <input type="text"
				class="findIdForm-input" id="findPwForm-userNm"
				name="findPwForm-userNm" placeholder="" required autofocus>

			*연락처 : <input type="text" class="findIdForm-input" id="picMblTelno"
				name="picMblTelno" placeholder="-를 제외한 번호를 입력" required autofocus>

			<!-- *입사일자 :
        <input type="date" class="findIdForm-input" id="jncmpYmd" name="jncmpYmd" required pattern="\d{4}-\d{2}-\d{2}" placeholder="" required autofocus> -->

			<input type="button" class="submitButton" onClick="findPw()"
				value="확인" /> 비밀번호: <input type="text" class="findIdForm-input"
				id="pw" name="pw" placeholder="" readonly>

		</form>
	</div>


	<!-- 회원 등록 -->
	<!-- <div id="">
   <h1> 회원 등록 </h1>
  <span class="close-btn-inform">
    <img src="/static_resources/login/images/deletBtn.png">
  </span>

    <form class="findPwForm">
        사용자ID
        <input type="text" class = "input-radius" id="userId" name="userId" placeholder="" required autofocus>
        
        *Password :
        <input type="password" class = "input-radius" id="userPswd" name="userPswd" placeholder="" oninput="confirmPswdVl()">

        *PW Confirm :
        <input type="password" class = "input-radius" id="pswdVlConfirm" name="pswdVlConfirm" placeholder=""  oninput="confirmPswdVl()">
        <div id="dynamicContent"></div>


        입사일자       
        <input type="date" class = "input-radius" id="jncmpYmd_date" name="jncmpYmd_date" required pattern="\d{4}\d{2}-\d{2}" placeholder="" oninput="setValueJncmpYmd()" required autofocus>      
        <input type="hidden" class = "input-radius" id="jncmpYmd" name="jncmpYmd">


        이메일
        <input type="text" class = "input-radius" id="picEmlAddr" name="picEmlAddr" placeholder="" oninput="checkEmail()" required autofocus>

        연락처
        <input type="text" class = "input-radius" id="picMblTelno" name="picMblTelno" placeholder="">


        *사용자명 :
        <input type="text" class="findIdForm-input" id="userNm" name="userNm" placeholder="" required autofocus>
    
        직위 : 
        <select id="jbpsTyCd" name="jbpsTyCd" class="form-control" oninput="setValueJbpsNm()" required autofocus>
          <option disabled selected hidden>선택</option>
        </select>
        <input type="hidden" class = "input-radius" id="jbpsNm" name="jbpsNm" placeholder="" required autofocus>

        *기 타 :
        <input type="text" class = "input-radius" id="etcTskCn" name="etcTskCn" placeholder="" >
    

    </form>
</div> -->




	<script>
		$('#login-button').click(function() {
			$('#login-button').fadeOut("slow", function() {
				$("#container").fadeIn();
				TweenMax.from("#container", .4, {
					scale : 0,
					ease : Sine.easeInOut
				});
				TweenMax.to("#container", .4, {
					scale : 1,
					ease : Sine.easeInOut
				});
			});
		});

		$(".close-btn")
				.click(
						function() {
							TweenMax.from("#container", .4, {
								scale : 1,
								ease : Sine.easeInOut
							});
							TweenMax.to("#container", .4, {
								left : "0px",
								scale : 0,
								ease : Sine.easeInOut
							});
							$(
									"#container, #forgotten-pw-container, #forgotten-id-container")
									.fadeOut(800, function() {
										$("#login-button").fadeIn(800);
									});
						});

		$(".close-btn-inform").click(
				function() {
					$("#forgotten-pw-container, #forgotten-id-container")
							.fadeOut(800, function() {
								$("#container").fadeIn(800);
							});
				});

		/* ID 찾기 FORM 띄우기 */
		$('#findId').click(function() {
			$("#container").fadeOut(function() {
				$("#forgotten-id-container").fadeIn();
			});
		});

		/* PW 찾기 FORM 띄우기 */
		$('#findPw').click(function() {
			$("#container").fadeOut(function() {
				$("#forgotten-pw-container").fadeIn();
			});
		});

		/* 회원등록 FORM 띄우기 */
		$('#regist').click(function() {
			$("#container").fadeOut(function() {
				$("#").fadeIn(function() {
					getCodeJbpsTyCdList();
				});
			});
		});
	</script>

</body>
</html>