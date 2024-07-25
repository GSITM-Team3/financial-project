package kcg.system.etc_mng.ctl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import kcg.common.svc.CommonSvc;
import kcg.system.etc_mng.svc.EtcMngErrCdSvc;

@RequestMapping("/system/etc_mng/errCd")
@Controller
public class EtcMngErrCdCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	EtcMngErrCdSvc etcMngErrCdSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	/**
	 * 에러코드 관리 페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/list")
	public String openPageList(ModelMap model) {
		return "kcg/system/etc_mng/EtcMngErrCdList";
	}
	
	/** 
	* 에러코드 관리 목록 조회한다.
	* @methodName : getList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params , PagingConfig pagingConfig){	
		return etcMngErrCdSvc.getList(params, pagingConfig); 
	}
	
	/** 
	* 에러코드 관리 상세정보조회 한다.
	* @methodName : getInfo 
	* @author : Irury Kang
	* */
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params){
		return etcMngErrCdSvc.getInfo(params); 
	}
	
	/** 
	* 에러코드 관리 상세정보 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */
	@RequestMapping("/save")
	public CmmnMap save( CmmnMap params){
		return etcMngErrCdSvc.save(params); 
	}
	
	
	/** 
	* 에러코드 관리 상세정보 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */
	@RequestMapping("/delete")
	public void delete(CmmnMap params){
		etcMngErrCdSvc.delete(params); 
	}
	
	/** 
	* 에러코드 중복체크
	* @methodName : chkDpl 
	* @author : Irury Kang 
	* */
	@RequestMapping("/chkDpl")
	public CmmnMap chkDpl(CmmnMap params){
		return etcMngErrCdSvc.chkDpl(params); 
	}
}
