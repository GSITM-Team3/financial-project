// 메인화면 이동
function goMainPage() {
   //console.log("메인화면으로 이동");
   location.href = "/login"
}
   
// 등록
function userRegistProc() {
   //console.log("회원정보 등록");
   location.href = "/login/userRegistProc"
}
   
// 히든인풋에 부서명 기입
function setValueDeptNm() {
   //console.log($("#deptNmValue option:selected").val());
   $('#deptNm').attr('value', $("#deptNmValue option:selected").val());
}   

// 히든인풋에 직위명 기입
function setValueJbpsNm() {
   //console.log($("#jbpsTyCd option:selected").val());
   $('#jbpsNm').attr('value', $("#jbpsTyCd option:selected").val());
}

// 아이디 형식
function checkUserId() {
    var userId = document.getElementById("userId").value;
    var regExp = /^[a-z0-9]{4,20}$/;
    var userIdErrorDiv = document.getElementById("checkidtext");

    if (!regExp.test(userId)) {
        userIdErrorDiv.innerHTML = "알파벳 소문자와 숫자로만 구성되어야 하며, 4자 이상 20자 이하여야 합니다.";
        userIdErrorDiv.style.color = "red";
        return false;
    } else {
        userIdErrorDiv.innerHTML = ""; // 오류 메시지 초기화
        return true;
    }
}      
   
// 비밀번호 확인
function confirmPswdVl() {
   var pw1   = document.getElementById("userPswd").value;
   var pw2 = document.getElementById("pswdVlConfirm").value;
      
   var num = pw1.search(/[0-9]/g);
   var eng = pw1.search(/[a-z]/ig);
   var spe = pw1.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
      
   if(pw1.length < 8 || pw1.length > 20){
      
   //alert("8자리 ~ 20자리 이내로 입력해주세요.");
        
   var dynamicString = "8자리 ~ 20자리 이내로 입력해주세요.";
   var dynamicContentDiv = document.getElementById("dynamicContent");
      dynamicContentDiv.innerHTML = dynamicString;
      dynamicContentDiv.style.color = "red";        
   }else if(pw1.search(/\s/) != -1){          
      alert("비밀번호는 공백 없이 입력해주세요.");
      var dynamicString = "비밀번호는 공백 없이 입력해주세요.";
       var dynamicContentDiv = document.getElementById("dynamicContent");
          dynamicContentDiv.innerHTML = dynamicString;
          dynamicContentDiv.style.color = "red"        
   }else if(num < 0 || eng < 0 || spe < 0 ){          
      //alert("영문,숫자, 특수문자를 혼합하여 입력해주세요.");
      var dynamicString = "영문,숫자, 특수문자를 혼합하여 입력해주세요.";
       var dynamicContentDiv = document.getElementById("dynamicContent");
           dynamicContentDiv.innerHTML = dynamicString;
           dynamicContentDiv.style.color = "red";        
   }else {          
      console.log("유효성 검사 통과"); 
      var dynamicString = "사용 가능한 비밀번호 입니다.";
       var dynamicContentDiv = document.getElementById("dynamicContent");
          dynamicContentDiv.innerHTML = dynamicString;
           dynamicContentDiv.style.color = "blue";
         
         if (pw1 == pw2) {
         var dynamicString = "비밀번호가 일치합니다.";
           var dynamicContentDiv = document.getElementById("dynamicContent");
           dynamicContentDiv.innerHTML = dynamicString;
           dynamicContentDiv.style.color = "green";
         //$('#pswdVlConfirmResult').attr('value', "패스워드 일치");
         return "true";                  
         } else {
         var dynamicString = "비밀번호가 일치하지 않습니다.";
           var dynamicContentDiv = document.getElementById("dynamicContent");
           dynamicContentDiv.innerHTML = dynamicString;
           dynamicContentDiv.style.color = "red";
         //$('#pswdVlConfirmResult').attr('value', "패스워드 불일치");
         return "false";
         }          
      }
   }
   
// 사용자명 형식
function checkUserName() {
    var userName = document.getElementById("userNm").value;
    var regExp = /^[가-힣]{2,4}$/;

    var userNameErrorDiv = document.getElementById("checknametext"); 

    if (!regExp.test(userName)) {
        userNameErrorDiv.innerHTML = "한글로 2자 이상 4자 이하이어야 합니다.";
        userNameErrorDiv.style.color = "red";
        return false;
    } else {
        userNameErrorDiv.innerHTML = ""; // 오류 메시지 초기화
        return true;
    }
}

// 연락처 형식
function checkPhoneNumber() {
    var picMblTelno = document.getElementById("picMblTelno").value;
    var regExp = /^\d{3}\d{3,4}\d{4}$/;
    var telnoErrorDiv = document.getElementById("checkPhoneNumtext");

    if (!regExp.test(picMblTelno)) {
        telnoErrorDiv.innerHTML = "연락처 형식이 올바르지 않습니다.";
        telnoErrorDiv.style.color = "red";
        return false;
    } else {
        telnoErrorDiv.innerHTML = "";
        return true;
    }
}
   
// 이메일 형식
function checkEmail() {
    var picEmlAddr = document.getElementById("picEmlAddr").value;
    var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}(.[가-힣]{2,3})?$/i;
    var checkEmailtextDiv = document.getElementById("checkEmailtext");

    if (!picEmlAddr.match(regExp)) {
        checkEmailtextDiv.innerHTML = "이메일 형식이 올바르지 않습니다.";
        checkEmailtextDiv.style.color = "red";
        return false;
    } else {
        checkEmailtextDiv.innerHTML = "";
        checkEmailtextDiv.style.color = "green";
        return true;
    }
}

/*
function checkEmail() {
    var picEmlAddr = document.getElementById("picEmlAddr").value;
    var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}(.[가-힣]{2,3})?$/i;
    var checkEmailtextDiv = document.getElementById("checkEmailtext");

    if (!picEmlAddr.match(regExp)) {
        checkEmailtextDiv.innerHTML = "이메일 형식이 올바르지 않습니다.";
        checkEmailtextDiv.style.color = "red";
        return false;
    }

    // AJAX 요청으로 서버에 이메일 중복 확인 요청
    $.ajax({
        url: '/ajaxEmailcheck.do',
        type: "GET",
        dataType: "json",
        data: {
            picEmlAddr: picEmlAddr
        },
        headers: {
            "Accept-Language": "ko-KR"
        },
        success: function(response) {
            console.log("ajax 통신 성공");
            console.log("서버 응답:", response.message);

            if (response.message === "not allowed") {
                checkEmailtextDiv.innerHTML = "사용불가능한 이메일입니다.";
                checkEmailtextDiv.style.color = "red";
                return false;
            } else if (response.message === "allowed") {
                checkEmailtextDiv.innerHTML = "사용가능한 이메일입니다.";
                checkEmailtextDiv.style.color = "green";
                return true;
            }
        },
        error: function(xhr, status, error) {
            console.log("ajax 통신 실패");
            console.error("에러 발생:", xhr, status, error);
            checkEmailtextDiv.innerHTML = "서버 통신 오류가 발생했습니다.";
            checkEmailtextDiv.style.color = "red";
            return false;
        }
    });
    return false;
}
*/

// form 데이터 보내기전 최종 검사
function validateForm() {
    var pwsdVlCheckState = confirmPswdVl();
    var emlAddrCheckState = checkEmail();

    if (pwsdVlCheckState && emlAddrCheckState) {
        console.log("유효성 검사 통과, 데이터를 서버로 전송할 수 있습니다.");
        return true;
    } else {
        console.log("유효성 검사 실패, 데이터 전송을 중지합니다.");
        return false;
    }
}




// 입사일자 담기
function setValueJncmpYmd() {
   var jncmpYmd = document.getElementById("jncmpYmd_date").value;
   // document.getElementById('jncmpYmd').value = jncmpYmd.toISOString().substring(0, 10)
   // console.log(jncmpYmd);
   $('#jncmpYmd').attr('value', jncmpYmd);
}
// 입력창 초기화
function cleanRegistForm() {
   if(confirm("입력하신 정보가 초기화 됩니다.")) {
      console.log("clean form");
      $("#userForm")[0].reset();
   }
   else {

   }
}
// 테스트를 위한 값 세팅
function setValue() {
   $('#picNm').attr('value', "테스터박");

   $('#jbpsNm').attr('value', "사원");
   $('#picMblTelno').attr('value', "01012341234");
   $('#picEmlAddr').attr('value', "testPark@naver.com");

   $('#etcTskCn').attr('value', "기타 내용");
   $('#userPswd').attr('value', "1q2w3e4r@");
   $('#pswdVlConfirm').attr('value', "1q2w3e4r@");      
}
function setThumbnail(event) {
   // 기존 이미지 제거
   var imageContainer = document.querySelector("div#image_container");
   imageContainer.innerHTML = ''; // 이 부분을 변경합니다.
   
   var reader = new FileReader();

   reader.onload = function(event) {
      var img = document.createElement("img");
      img.setAttribute("src", event.target.result);
   
      // 이미지 크기 조절
      img.style.maxWidth = "50px"; // 'px' 추가
      img.style.maxHeight = "40px";
   
      document.querySelector("div#image_container").appendChild(img);
   };
   
   reader.readAsDataURL(event.target.files[0]);
}