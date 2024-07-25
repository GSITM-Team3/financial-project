package kcg.system.etc_mng.ctl;

import java.util.List;

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
import kcg.system.etc_mng.svc.EtcMngHelpSvc;

@RequestMapping("/system/etc_mng/help")
@Controller
public class EtcMngHelpCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	EtcMngHelpSvc etcMngHelpSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	/**
	 * 도움말 관리 페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/list")
	public String openPageList(ModelMap model) {
		return "kcg/system/etc_mng/EtcMngHelpList";
	}
	
	/**
	 * 도움말 관리 상세페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/dtl")
	public String openPageDtl(ModelMap model, CmmnMap params) {
		model.addAttribute("idx", params.getString("idx", ""));
		return "kcg/system/etc_mng/EtcMngHelpDtl";
	}
	
	/** 
	* 도움말 관리 목록 조회한다.
	* @methodName : getList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params , PagingConfig pagingConfig){	
		return etcMngHelpSvc.getList(params, pagingConfig); 
	}
	
	/** 
	* 도움말 관리 상세정보조회 한다.
	* @methodName : getInfo 
	* @author : Irury Kang
	* */
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params){
		return etcMngHelpSvc.getInfo(params); 
	}
	
	/** 
	* 도움말 관리 상세정보 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */
	@RequestMapping("/save")
	public CmmnMap save( CmmnMap params){
		return etcMngHelpSvc.save(params); 
	}
	
	
	/** 
	* 도움말 관리 상세정보 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */
	@RequestMapping("/delete")
	public void delete(CmmnMap params){
		etcMngHelpSvc.delete(params); 
	}
	
	/** 
	* 카테고리 저장
	* @methodName : saveCat 
	* @author : Irury Kang 
	* */
	@RequestMapping("/saveCat")
	public CmmnMap saveCat( CmmnMap params){
		return etcMngHelpSvc.saveCat(params); 
	}
	
	/** 
	* 카테고리 리스트 목록 조회
	* @methodName : getCatList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getCatList")
	public List<CmmnMap> getCatList(CmmnMap params){
		return etcMngHelpSvc.getCatList(params); 
	}
	
	/** 
	* 카테고리 중복 체크
	* @methodName : chkCatDpl 
	* @author : Irury Kang 
	* */
	@RequestMapping("/chkCatDpl")
	public CmmnMap chkCatDpl(CmmnMap params){
		return etcMngHelpSvc.chkCatDpl(params); 
	}
}
