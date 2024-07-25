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
import kcg.system.etc_mng.svc.EtcMngPopupSvc;

@RequestMapping("/system/etc_mng/popup")
@Controller
public class EtcMngPopupCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	EtcMngPopupSvc etcMngPopupSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	/**
	 * 팝업 관리 페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/list")
	public String openPageList(ModelMap model) {
		return "kcg/system/etc_mng/EtcMngPopupList";
	}
	
	/**
	 * 팝업 관리 상세페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/dtl")
	public String openPageDtl(ModelMap model, CmmnMap params) {
		model.addAttribute("idx", params.getString("idx", ""));
		return "kcg/system/etc_mng/EtcMngPopupDtl";
	}
	
	/** 
	* 팝업 관리 목록 조회한다.
	* @methodName : getList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params , PagingConfig pagingConfig){
		return etcMngPopupSvc.getList(params, pagingConfig); 
	}
	
	/** 
	* 팝업 관리 상세정보조회 한다.
	* @methodName : getInfo 
	* @author : Irury Kang
	* */
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params){
		return etcMngPopupSvc.getInfo(params); 
	}
	
	/** 
	* 팝업 관리 상세정보 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */
	@RequestMapping("/save")
	public CmmnMap save( CmmnMap params){
		return etcMngPopupSvc.save(params); 
	}
	
	
	/** 
	* 팝업 관리 상세정보 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */
	@RequestMapping("/delete")
	public void delete(CmmnMap params){
		etcMngPopupSvc.delete(params); 
	}

}
