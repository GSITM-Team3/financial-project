<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false" />
    <!-- Imported styles on this page -->
    <link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">
    <link rel="stylesheet" href="/static_resources/system/js/datatables/proddtl.css">
    <link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">
    <link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <style>
        #consultFoot {
            position: sticky;
            bottom: 0;
            background-color: #fff;
            /* 선택사항: 배경색을 밝게 설정하여 내용이 잘 보이도록 */
            z-index: 1;
            /* 다른 콘텐츠 위에 나타나도록 설정 */
        }

        #characterCount {
            color: red;
            /* 초과 안내 메시지 글자색 */
        }

        #closeButton {
            //margin-bottom: 10px;
        }
    </style>

    <script>
        $(document).ready(function() {
            var maxCharacters = 200; // 최대 입력 글자 수

            $('#closeButton').click(function() {
                $('#myModal').css('display', 'none');
                location.reload();
            });

            $('#consultTextarea').on('input', function() {
                var textareaContent = $(this).val();
                var currentLength = textareaContent.length;

                // 200자를 초과할 경우
                if (currentLength > maxCharacters) {
                    $(this).val(textareaContent.substring(0, maxCharacters)); // 200자까지 잘라내기
                    $('#characterCount').text('200자 이내로 작성해주세요.'); // 안내 메시지 표시
                } else {
                    $('#characterCount').text(''); // 안내 메시지 숨기기
                }
            });

            $('#consultForm').submit(function(e) {
                var textareaContent = $('#consultTextarea').val().trim();
                if (textareaContent === '') {
                    alert('상담 내용을 입력해주세요.');
                    e.preventDefault(); // 폼 제출을 막음
                } else if ($('#consultTextarea').hasClass('exceed-limit')) {
                    alert('상담 내용은 200자 이내로 작성해주세요.');
                    e.preventDefault(); // 폼 제출을 막음
                }
            });
        });
    </script>

</head>

<body>
    <table class="table">
        <thead>
            <tr class="replace-inputs">
                <th class="center">상담 내용</th>
            </tr>
        </thead>
        <tbody>
            <c:if test="${empty custConsultList}">
                <tr>
                    <td>상담 내용이 없습니다.</td>
                </tr>
            </c:if>
            <c:forEach items="${custConsultList}" var="consult">
                <tr>
                    <td>${consult.consult_content}<br>
                        <small>${consult.consult_created_at}</small></td>
                </tr>
            </c:forEach>
        </tbody>
    </table>

    <div id="consultFoot">
        <form id="consultForm" action="/cust_th/consultInsert_th" method="POST" accept-charset="UTF-8">
            <input type="hidden" id="cust_code" name="cust_code" value="${param.cust_code}">
            <textarea id="consultTextarea" name="consult_content" rows="4" cols="74" style="resize: none;"></textarea>
            <br> <span id="characterCount"></span><br>
            <!-- 글자 수 초과 안내 메시지 -->
            <button type="submit" class="btn btn-info">저장</button>
            <button type="button" id="closeButton" class="btn btn-primary">닫기</button>
        </form>
    </div>
</body>

</html>