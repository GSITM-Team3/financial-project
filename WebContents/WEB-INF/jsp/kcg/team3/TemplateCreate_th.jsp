<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>템플릿 등록</title>
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
<link rel="stylesheet"
	href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
<link rel="stylesheet"
	href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script>
	function submitForm() {
		//alert("저장 버튼 클릭됨");

		// 입력된 데이터를 가져오기
		var userId = $("#userId").val();
		var title = $("#title").val();
		var content = $("#content").val();

		// 유효성 검사
		if (title.trim() === "") {
			alert("제목을 입력해주세요");
			return;
		}
		if (content.trim() === "") {
			alert("내용을 입력해주세요");
			return;
		}

		// 서버로 전송할 데이터 객체 생성
		var params = {
			user_id : userId,
			gw_title : title,
			gw_content : content
		};

		// jQuery의 $.ajax()를 사용하여 요청 보내기
		$.ajax({
			type : "GET",
			url : "/share_th/createTemplate_th", // 요청 보낼 URL
			data : params, // 전송할 데이터
			success : function(data) { // 요청 성공 시 처리할 콜백 함수
				alert("템플릿이 성공적으로 저장되었습니다.");
				window.location.href = "/share_th/template_th"; // 목록 페이지로 이동
			},
			error : function(error) { // 요청 실패 시 처리할 콜백 함수
				console.error(error);
				alert("템플릿 등록 중 오류가 발생했습니다.");
			}
		});
	}
</script>
</head>

<body class="page-body">
	<div class="page-container">
		<jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp"
			flush="false" />
		<div class="main-content">

			<jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp"
				flush="false" />
			<div>
				<h1>템플릿 글 작성</h1>
				<form>
					<input type="hidden" id="userId" name="userId" value="${userId}">
					<div class="form-group">
						<label for="title">제목</label> <input type="text"
							class="form-control" id="title" name="title" required>
					</div>
					<div class="form-group">
						<label for="content">내용</label>
						<textarea class="form-control" id="content" name="content"
							rows="5" required style="resize: none;"></textarea>
					</div>
					<button type="button" class="btn btn-primary"
						onclick="submitForm()">저장</button>
				</form>
			</div>
		</div>
	</div>
</body>

</html>