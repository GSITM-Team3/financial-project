<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
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

<meta charset="UTF-8">
<title>공지사항</title>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
	$(document).ready(function() {
		var userId = $("#userId").val();
		var noticeUserId = $("#noticeUserId").val();

		// userId와 noticeUserId가 같으면 수정/삭제 버튼을 보여줌
		if (userId === noticeUserId) {
			$("#title").prop("readonly", false);
			$("#content").prop("readonly", false);
			$("#editBtn").show();
			$("#deleteBtn").show();
		} else {
			$("#editBtn").hide();
			$("#deleteBtn").hide();
		}

		// 수정 버튼 클릭 시
		$("#editBtn").click(function() {
			if (confirm("정말로 수정하시겠습니까?")) {
				var gwCode = $("#gwCode").val();
				var title = $("#title").val();
				var content = $("#content").val();

				// 서버로 전송할 데이터 객체 생성
				var params = {
					gw_code : gwCode,
					gw_title : title,
					gw_content : content
				};

				$.ajax({
					type : "GET",
					url : "/share_th/updateNotice/" + gwCode,
					data : params, // 전송할 데이터
					success : function(data) {
						alert("공지사항이 수정되었습니다.");
						window.location.href = "/share_th/notice_th"; // 목록 페이지로 이동
					},
					error : function(error) {
						console.error("Error deleting notice: ", error);
						alert("공지사항 수정 중 오류가 발생했습니다.");
					}
				});
			}
		});

		// 삭제 버튼 클릭 시
		$("#deleteBtn").click(function() {
			if (confirm("정말로 삭제하시겠습니까?")) {
				var gwCode = $("#gwCode").val(); // 공지 코드 가져오기

				// 서버로 전송할 데이터 객체 생성
				var params = {
					gw_code : gwCode,
				};
				$.ajax({
					type : "GET",
					url : "/share_th/deleteNotice/" + gwCode,
					data : params, // 전송할 데이터
					success : function(data) {
						alert("공지사항이 삭제되었습니다.");
						window.location.href = "/share_th/notice_th"; // 목록 페이지로 이동
					},
					error : function(error) {
						console.error("Error deleting notice: ", error);
						alert("공지사항 삭제 중 오류가 발생했습니다.");
					}
				});
			}
		});
	});
</script>
<style>
.btn {
	border: none;
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

			<div>
				<h1>공지사항</h1>
				<form id="noticeForm">
					<input type="hidden" id="userId" value="${userId}"> <input
						type="hidden" id="noticeUserId" value="${cmmnMap.user_id}">
					<input type="hidden" id="gwCode" value="${cmmnMap.gw_code}">
					<div class="form-group">
						<label for="title">제목</label> <input type="text"
							class="form-control" id="title" name="title"
							value="${cmmnMap.gw_title}" readonly>
					</div>
					<div class="form-group">
						<label for="content">내용</label>
						<textarea class="form-control" id="content" name="content"
							rows="5" readonly style="resize: none;">${cmmnMap.gw_content}</textarea>
					</div>
					<div id="buttonGroup">
						<%-- 수정과 삭제 버튼은 userId와 notice의 userId가 같을 때만 보이게 함 --%>
						<button type="button" class="btn btn-success" id="editBtn">수정</button>
						<button type="button" class="btn btn-danger" id="deleteBtn">삭제</button>
					</div>
					<button type="button" class="btn btn-secondary"
						onclick="location.href='/share_th/notice_th'">목록</button>
				</form>
			</div>
		</div>
	</div>
</body>

</html>