//퇴사
function resign() {
    if (confirm('정말로 퇴사하시는게 맞으신가요?')) {
        document.getElementById('statusCd').value = 'BBB'; // statusCd 값을 BBB로 변경
        document.getElementById('userUpdateForm').submit(); // 폼 제출
    }
}