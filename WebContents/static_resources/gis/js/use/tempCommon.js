
/**
 * ajax 통신함수
 * 
 * @param url
 * @param params
 * @param arg1
 * @param arg2
 * @returns
 */
var rsltFailArr = ['error', 'user-error', 'FAIL', 'sys-error'];
function temp_cf_ajax(url, params, arg1, arg2) {
	
	var callback_func;
	let headers;
	
	if(arg1 === undefined && arg2 === undefined){
		callback_func = null;
		headers = {
				'Content-Type': 'application/json;charset=UTF-8',
				"Access-Control-Allow-Origin": "*",
			}
	} else if(arg2 === undefined){
		headers = {
				'Content-Type': 'application/json;charset=UTF-8',
				"Access-Control-Allow-Origin": "*",
			}
		callback_func = arg1;
	} else {
		headers = arg1;
		callback_func = arg2;
	}
	
	var arguments = {};
	
	var options = {
			headers: headers,
		}
	
	if(params == null) {
		arguments.params = {}
	} else {
		arguments.params = params;
	}
	
	if(!cf_isEmpty(cv_pagingConfig.func)){
		arguments.pagingConfig = {
			pageNo : cv_pagingConfig.pageNo,
			orders : cv_pagingConfig.orders,
			limit : cv_pagingConfig.limit,
		};
	}

	if(!cf_isEmpty(cv_logConfig.LOG_SVC_CD)){
		arguments.logConfig = {
			LOG_SVC_CD : cv_logConfig.LOG_SVC_CD,
			LOG_SVC_LEVEL : cv_logConfig.LOG_SVC_LEVEL,
		}
	}

	if (isloadingbar !== false) {
		temp_cf_loadingbarShow();
	}

	axios.post(url, arguments, options)
		.then(function(response) {
			
			cv_logConfig.init();
			
			if (rsltFailArr.includes(response.data.rsltStatus)) {
				if (response.data.rsltStatus == "user-error" && !cf_isEmpty(response.data.errMsg)) {
					mcxDialog.alert(response.data.errMsg);
				} else {
					mcxDialog.alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
				}
			} else {
				
				
				if (!cf_isEmpty(callback_func)) {
					if (cf_whatIsIt(response.data) === "string" && response.data.indexOf("<!DOCTYPE html>") != -1) {
						mcxDialog.alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
					} else {
						if(!cf_isEmpty(cv_pagingConfig.func)){
							cv_pagingConfig.setInfo(response.data.pageInfo);
							cv_pagingConfig.func_back = cv_pagingConfig.func;
							cv_pagingConfig.func = null;
						}
						
						callback_func(response.data);
					}
				}
			}
		})
		.catch(function(error) {
			cf_loadingbarHide();
			console.log(error.message);
			if (error.message == "Network Error") {
				mcxDialog.alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
			} else {
				mcxDialog.alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
			}
			console.log(error);
		});
}


function temp_cf_loadingbarShow() {
	mcxDialog.loading({
		src: "/static_resources/gis/img", // 이미지 주소
		hint: "\n 로딩중\n 잠시만 기다려 주세요 \n"  //프롬프트 내용 지정					
	});	
}
function temp_cf_loadingbarShow2(msg) {
	mcxDialog.loadingWth({
		src: "/static_resources/gis/img", // 이미지 주소
		hint: msg , //프롬프트 내용 지정
							
	});

		
}


function temp_cf_loadingbarHide() {
	mcxDialog.closeLoading();
}