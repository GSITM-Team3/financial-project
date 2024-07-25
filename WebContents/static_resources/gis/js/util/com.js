﻿/**
 * ajax 호출 함수
 * @param param - 전송 파라메터(json)
 */
function ajaxUtil(){
	this.getListAjax = function (params,success,url,type){
							$.ajax ({
								url: url,
								type: type,
								dataType: "json",
								contentType : "application/json; charset=UTF-8",
								data: params,
								async: false,
							    success: success,
							    error: function(xhr, status, error) {
							    	console.log("err : " + error);
							    }
							}
						);
					  }
	this.getListAjaxNonRes = function (params,success,url,type){
		$.ajax ({
			url: url,
			type: type,
			//dataType: "json",
			contentType : "application/json; charset=UTF-8",
			data: params,
			async: false,
		    success: success,
		    error: function(xhr, status, error) {
		    	console.log("err : " + error);
		    }
		}
	);
  }

	
	this.getWfsAjax= function(url, getResultWfsSuccess) {
		$.ajax({
	 			url: url,
	 			type: "GET",
				dataType: "jsonp",
				jsonpCallback: 'jsonpCallback',	
				jsonp: "callback",
				async: true,
				success: getResultWfsSuccess
	 		}
		);
	}
	
	this.getWfsAjaxs= function(url, getResultWfsSuccess) {
		$.ajax({
	 			url: url,
	 			type: "GET",
				dataType: "json",
				async: true,
				success: getResultWfsSuccess
	 		}
		);
	}
	
	function getWFSAjaxType(success, url, typ){
	    if(typ == "undifined"){
	        typ = "get";
	    }
	    $.ajax ({
	            url: url,
	            type: typ,
	            dataType : "json",
	            contentType : "application/json; charset=UTF-8",
	            async : false,
	            success: success,
	            error: function(xhr, status, error) {
	                console.log("요청에 실패하였습니다\n다시 시도해주세요 " + error);
	            }
	        }
	    );
	}
	
	
}

