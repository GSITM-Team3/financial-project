package kcg.system.poli_person_mng.ctl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;
import common.utils.common.CmmnUtil;
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import kcg.common.svc.CommonSvc;
import kcg.system.poli_person_mng.svc.CodeMngSvc;
import kcg.system.poli_person_mng.svc.PoliPersonMngSvc;

@RequestMapping("/system/poli_person_mng")
@Controller
public class PoliPersonMngCtl {
	
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	PoliPersonMngSvc poliPersonMngSvc;
	
	@Autowired
	CodeMngSvc poliPersonCodeMngSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	/** 
	* 페이지호출
	* @methodName : openPageList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/list")
	public String openPageList(Model model) {
		model.addAttribute("today", CmmnUtil.getTodayFormedString());
		
		return "kcg/system/poli_person_mng/PoliPersonList";
	}


	@RequestMapping("/getCdMngList")
	public List<CmmnMap> getCdMngList(CmmnMap params) {
		return poliPersonMngSvc.getCdMngList(params);
	}
	
	/** 
	* 페이지호출
	* @methodName : openPageList 2
	* @author : Irury Kang 
	* */
	@RequestMapping("/list2")
	public String openPageList2(Model model) {
		model.addAttribute("today", CmmnUtil.getTodayFormedString());
		return "kcg/system/poli_person_mng/PoliPersonList2";
	}
	
	/** 
	* 목록조회
	* @methodName : getList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		return poliPersonMngSvc.getList(params, pagingConfig);
	}
	
	@RequestMapping("/deleteList")
	public void deleteList(CmmnMap params) {
		poliPersonMngSvc.deleteList(params);
	}
	
	
	@RequestMapping("/saveList")
	public void saveList(CmmnMap params) {
		poliPersonMngSvc.saveList(params);
	}
	
	@RequestMapping("/insertInfo")
	public void save(CmmnMap params) {
		poliPersonMngSvc.insertInfo(params);
	}
	
	/** 
	* 중복체크
	* @methodName : getCheckDupl 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getCheckDupl")
	public CmmnMap getCheckDupl(CmmnMap params) {
		return poliPersonMngSvc.getCheckDupl(params);
	}

}
