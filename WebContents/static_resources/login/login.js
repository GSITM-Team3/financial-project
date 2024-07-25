function login(){
    
    var params = {
         usr_id : $("#usr_id").val(),
         usr_pw : $("#usr_pw").val(),
         ubi : "",
    }
    
    cf_ajax("/login/proc", params, function(data){
       var rslt = data.rslt;
       if("SUCC_ADMIN" === rslt){
          auth_menulist = data.auth_menulist;
          cf_movePage('/system')
       } else if("SUCC_CLIENT" === rslt){
          auth_menulist = data.auth_menulist;
          cf_movePage('/')
       } else if("NO_USER" === rslt){
          alert("입력하신 아이디는 존재하지 않습니다.");
       } else if("FAIL_PW_ERR" === rslt){
          alert("비밀번호 오류입니다.");
       }else if (rslt === "RESIGNED") {
            alert("퇴사한 회원은 로그인 할 수 없습니다.");
        }
    });
}


window.onload = function(){
   if("${errMsg}" === "FAIL_ID_ERR"){
      alert("입력하신 아이디가 존재하지 않습니다.");
   } else if("${errMsg}" === "FAIL_PW_ERR"){
      alert("비밀번호 오류입니다.");
   }
}

function findUserInfo() {
    // TODO: 정규식, 유효성 검사

    // 입력값 검증
    var userNm = document.getElementById("userNm").value;
    var picMblTelno = document.getElementById("picMblTelno").value;
    //var jncmpYmd = document.getElementById("jncmpYmd").value;

    if (userNm == "") {
        alert('사용자명을 입력하세요');
        return false;
    }

    if (picMblTelno == "") {
        alert('휴대폰 번호를 입력하세요');
        return false;
    }
    /*
    if (jncmpYmd == "") {
        alert('입사일자를 입력하세요');
        return false;
    }
   */
    // Ajax 요청
    $.ajax({
        async: false, // 값 반환 시 해당 코드를 추가하여 동기로 변경 false: 동기, true: 비동기
        url: '/login/ajaxFindUserIdProc',
        type: "GET",
        dataType: "json", // 서버에서 보내주는 데이터를 어떤 타입으로 받을지 (예: "json", "string")
        data: {
            userNm: userNm,
            picMblTelno: picMblTelno
        },
        headers: {
            "Accept-Language": "ko-KR" // 한글을 지원하는 언어 코드로 설정
        },
        success: function(response) {
            console.log("Ajax 통신 성공");
            console.log("서버 응답:", response.message);
            document.getElementById("emlAddr").value = response.message;
            // console.log("서버 응답:", response);
        },
        error: function(xhr, status, error) {
            console.log("Ajax 통신 실패");
            console.error("에러 발생:", xhr, status, error);
            console.log("서버 응답 상세:", xhr.responseText);
        },
        complete: function(response) {
            console.log("완료 후 로직 실행");
            console.log(response.message);
        },
        // 추가: charset 옵션 설정
        beforeSend: function(xhr) {
            xhr.overrideMimeType("text/plain; charset=utf-8");
        }
    });
}

   function findPw() {
    
        //TODO 정규식, 유효성검사 
    
        // ajax로 전달할 값 세팅
       var emlAddr = document.getElementById("emlAddr").value;
        var userNm = document.getElementById("findPwForm-userNm").value;
       var picMblTelno = document.getElementById("picMblTelno").value;
  
    
            $.ajax({
                async: false, //값을 리턴시 해당코드를 추가하여 동기로 변경 false : 동기, true : 비동기
                url: '/login/ajaxFindUserPwProc',
                type: "GET",
                dataType: "json", // 서버에서 보내주는 데이터를 어떤 타입으로 받을건지 EX) "json", "String" 
                data : {
                    emlAddr: emlAddr,
                    userNm: userNm,
                    picMblTelno: picMblTelno
                },
                headers: {
                    "Accept-Language": "ko-KR" // 한글을 지원하는 언어 코드로 설정
                },                
                success: function(response) {
                   console.log("Ajax 통신 성공");
                  console.log("서버 응답:", response.message);
                    document.getElementById("pw").value = response.message;
                },  
                error: function(xhr, status, error) {
                    console.log("ajax 통신 실패");
                    console.error("에러 발생:", xhr, status, error);
                    console.log("서버 응답 상세:", xhr.responseText);
                },                
                complete : function(response) {
                    console.log("완료후 로직 실행되는 로직");
                    console.log(response.message);    
                },
                 // 추가: charset 옵션을 설정
                beforeSend: function(xhr) {
                  xhr.overrideMimeType("text/plain; charset=utf-8");
              }
            });          
      }
    
function getCodeDeptList() {
      $.ajax({
         async: true,
         url: '/login/ajaxGetCodeDeptList',
         type: "GET",
         dataType: "json",
         data: {},
         headers: {
            "Accept-Language": "ko-KR"
         },
         success: function(response) {
            console.log("ajax 통신 성공");
            if (response && response.body.list) {
               console.log("서버 응답 list:", response.body.list2); // JSON 데이터에서 리스트 출력
   
               // select 요소 선택
               var $select = $('#deptNm');
               
               // 기존 옵션 초기화
               $select.find('option:not(:first)').remove();
               
               // 새로운 옵션 추가
               response.body.list.forEach(function(item) {
                  var option = $('<option></option>').attr('value', item.codeNm).text(item.codeNm);
                  $select.append(option);
               });
            } else {
               console.log("서버 응답에 list 필드가 없습니다.");
            }
         },
         error: function(xhr, status, error) {
            console.log("ajax 통신 실패");
            console.error("에러 발생:", xhr, status, error);
            console.log("서버 응답 상세:", xhr.responseText);
         },
         complete: function(response) {
            console.log("완료후 로직 실행되는 로직");
         },
         beforeSend: function(xhr) {
            xhr.overrideMimeType("text/plain; charset=utf-8");
         }
      });
   }

   function getCodeJbpsTyCdList() {
      $.ajax({
         async: true,
         url: '/login/ajaxGetCodeJbpsTyCdList',
         type: "GET",
         dataType: "json",
         data: {},
         headers: {
            "Accept-Language": "ko-KR"
         },
         success: function(response) {
            console.log("ajax 통신 성공");
            if (response && response.body.list2) {
               console.log("서버 응답 list2:", response.body.list2); // JSON 데이터에서 리스트 출력
   
               // select 요소 선택
               var $select = $('#jbpsTyCd');
               
               // 기존 옵션 초기화
               $select.find('option:not(:first)').remove();
               
               // 새로운 옵션 추가
               response.body.list2.forEach(function(item) {
                  var option = $('<option></option>').attr('value', item.codeNm).text(item.codeNm);
                  $select.append(option);
               });
            } else {
               console.log("서버 응답에 list2 필드가 없습니다.");
            }
         },
         error: function(xhr, status, error) {
            console.log("ajax 통신 실패");
            console.error("에러 발생:", xhr, status, error);
            console.log("서버 응답 상세:", xhr.responseText);
         },
         complete: function(response) {
            console.log("완료후 로직 실행되는 로직");
         },
         beforeSend: function(xhr) {
            xhr.overrideMimeType("text/plain; charset=utf-8");
         }
      });
   }
   