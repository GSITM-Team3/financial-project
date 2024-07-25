package kcg.system.user_auth_mng.ctl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;
import common.utils.common.ConfigExcelDn;
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import kcg.common.svc.CommonSvc;
import kcg.system.user_auth_mng.svc.UserMngSvc;

@RequestMapping("/system/user_mng")
@Controller
public class UserMngCtl {
	
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	UserMngSvc userMngSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	@RequestMapping("/list")
	public String openPageList(Model model) {
		log.debug(">>> open page list");
		
		return "kcg/system/user_auth_mng/UserMngList";
	}
	
	@RequestMapping("/dtl")
	public String openPageDtl(Model model, CmmnMap params) {
		List<CmmnMap> authList = userMngSvc.getAuthList();
		model.addAttribute("authList",authList);
		model.addAttribute("user_id", params.getString("user_id", ""));
		
		return "kcg/system/user_auth_mng/UserMngDtl";
	}
	
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		return userMngSvc.getList(params, pagingConfig);
	}
	
	@RequestMapping("/getInternalSystemList")
	public PageList<CmmnMap> getInternalSystemList(CmmnMap params, PagingConfig pagingConfig) {
		return userMngSvc.getInternalSystemList(params, pagingConfig);
	}
	
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params) {
		return userMngSvc.getInfo(params);
	}
	
	@RequestMapping("/chkExist")
	public CmmnMap chkExist(CmmnMap params) {
		CmmnMap rslt = userMngSvc.chkExist(params);
		return rslt;
	}
	
	@RequestMapping("/save")
	public CmmnMap save(CmmnMap params) {
		return userMngSvc.save(params);
	}
	
	@RequestMapping("/delete")
	public void delete(CmmnMap params) {
		userMngSvc.delete(params);
	}
	
	@RequestMapping("/initPw")
	public CmmnMap initPw(CmmnMap params) {
		return userMngSvc.initPw(params);
	}
	
	@RequestMapping("/excelDn")
	public String excelDnTest(Model model, CmmnMap params, ConfigExcelDn configExcelDn) {

		List<CmmnMap> dataList = userMngSvc.excelDn(params);
		model.addAttribute("dataList", dataList);
		model.addAttribute("configExcelDn", configExcelDn);
		
		return "excel2007View";
	}
}
