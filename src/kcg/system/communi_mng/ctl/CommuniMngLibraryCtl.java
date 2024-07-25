package kcg.system.communi_mng.ctl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;
import common.utils.common.MultipartFileList;
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import kcg.common.svc.CommonSvc;
import kcg.system.communi_mng.svc.CommuniMngLibrarySvc;

@RequestMapping("/system/communi_mng/library")
@Controller
public class CommuniMngLibraryCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CommuniMngLibrarySvc communiMngLibrarySvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	/**
	 * 자료실 페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/list")
	public String openPageList(ModelMap model) {
		return "kcg/system/communi/CommuniMngLibraryList";
	}
	
	/**
	 * 자료실 상세페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/dtl")
	public String openPageDtl(ModelMap model, CmmnMap params) {
		model.addAttribute("idx", params.getString("idx", ""));
		return "kcg/system/communi/CommuniMngLibraryDtl";
	}
	
	/** 
	* 자료실 목록 조회한다.
	* @methodName : getList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params , PagingConfig pagingConfig){
		return communiMngLibrarySvc.getList(params, pagingConfig); 
	}
	
	/** 
	* 자료실 상세정보조회 한다.
	* @methodName : getInfo 
	* @author : Irury Kang
	* */
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params){
		return communiMngLibrarySvc.getInfo(params); 
	}
	
	/** 
	* 자료실 상세정보 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */
	@RequestMapping("/save")
	public CmmnMap save(MultipartFileList fileList,CmmnMap params){
		return communiMngLibrarySvc.save(fileList, params); 
	}

	@RequestMapping("/delete")
	public void delete(CmmnMap params){
		communiMngLibrarySvc.delete(params); 
	}
}
