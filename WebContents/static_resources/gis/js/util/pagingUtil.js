var pageUnit	 = 10;	//화면에 표시할 자료 갯수(페이지당 레코드 수)
var pageCount 	 = 5;	//화면에 표시할 페이지 번호 갯수(블럭당 페이지 수)

/**
 * 검색 페이징 함수
 * @param current	현재 페이지 번호
 * @param total		전체 조회 건수
 * @param pnfc		페이지 이동함수
 * @param pzoneid 	페이징 삽입할 노드 아이디
 */
function makePaging(current, total, pfnc, pzoneid, _pUnit) {
	$('#'+pzoneid).empty();	
	if(_pUnit != undefined)pageUnit = _pUnit; else pageUnit = 10;
	var currentPageNo = current;							//현재 선택된 페이지 번호
	var totalRecordCount = total;							//전체 레코드 수
	var totalPage = Math.ceil(totalRecordCount / pageUnit);	//전체 페이지 수
	var totalBlock = Math.ceil(totalPage / pageCount);		//전체 블럭 수
	var nowBlock = Math.ceil(currentPageNo / pageCount);	//현재 페이지 블럭
	var startPage = ((nowBlock - 1) * pageCount) + 1;		//가져올 페이지 시작 번호
	var endPage = ((totalPage-startPage) >= pageCount)?(startPage + pageCount - 1):totalPage;	//출력할 마지막 페이지 번호
	var content = "";
	if(nowBlock > 0) {	//이전
		content +='<li onclick="'+pfnc+'(\'' + (nowBlock-1)*pageCount + '\')"; class="before" >◀</li>';
	}
	for(var i=startPage;i<=endPage;i++) {
		if(i == currentPageNo) {
			content +='<li class="active">' + i + '</li>';
		}else {
			content +='<li onclick="'+pfnc+'(\'' + i + '\');">' + i + '</li>';
		}
	}
	if((totalBlock - nowBlock)+1 > 0) {
		content +='<li onclick="'+pfnc+'(\'' + (nowBlock*pageCount+1) + '\');" class="next">▶</li>';
	}
	
	$('#'+pzoneid).append(content);

	if((nowBlock-1)*pageCount == 0){	// < 이전 표시 숨기기
		$(".before").hide();
	}
	
	if(totalBlock - nowBlock == 0){ // > 다음 페이지 숨기기
		$(".next").hide();
	}
	
	
}

function makePagingPram(current, total, pfnc, pzoneid, _pUnit,functionPram) {
	$('#'+pzoneid).empty();	
	if(_pUnit != undefined)pageUnit = _pUnit; else pageUnit = 10;
	var currentPageNo = current;							//현재 선택된 페이지 번호
	var totalRecordCount = total;							//전체 레코드 수
	var totalPage = Math.ceil(totalRecordCount / pageUnit);	//전체 페이지 수
	var totalBlock = Math.ceil(totalPage / pageCount);		//전체 블럭 수
	var nowBlock = Math.ceil(currentPageNo / pageCount);	//현재 페이지 블럭
	var startPage = ((nowBlock - 1) * pageCount) + 1;		//가져올 페이지 시작 번호
	var endPage = ((totalPage-startPage) >= pageCount)?(startPage + pageCount - 1):totalPage;	//출력할 마지막 페이지 번호
	var content = "";
	if(nowBlock > 0) {	//이전
		content +='<li onclick="'+pfnc+'(\'' + (nowBlock-1)*pageCount + '\,\''+functionPram+'\')"; class="before" >◀</li>';
	}
	for(var i=startPage;i<=endPage;i++) {
		if(i == currentPageNo) {
			content +='<li class="active">' + i + '</li>';
		}else {
			content +='<li onclick="'+pfnc+'(\'' + i + '\,\''+functionPram+'\');">' + i + '</li>';
		}
	}
	if((totalBlock - nowBlock)+1 > 0) {
		content +='<li onclick="'+pfnc+'(\'' + (nowBlock*pageCount+1) + '\,\''+functionPram+'\');" class="next">▶</li>';
	}
	
	$('#'+pzoneid).append(content);

	if((nowBlock-1)*pageCount == 0){	// < 이전 표시 숨기기
		$(".before").hide();
	}
	
	if(totalBlock - nowBlock == 0){ // > 다음 페이지 숨기기
		$(".next").hide();
	}
	
	
}


