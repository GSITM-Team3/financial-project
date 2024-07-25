package kcg.system.user_auth_mng.ctl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import kcg.common.svc.CommonSvc;
import kcg.system.user_auth_mng.svc.AdminAuthMngSvc;

@RequestMapping("/system/admin_auth_mng")
@Controller
public class AdminAuthMngCtl {
	
	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	AdminAuthMngSvc adminAuthMngSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	@RequestMapping("/list")
	public String openPageList(Model model) {
		return "kcg/system/user_auth_mng/AdminAuthMngList";
	}
	
	@RequestMapping("/dtl")
	public String openPageDtl(Model model, CmmnMap params) {
		model.addAttribute("auth_nm", params.getString("auth_nm", ""));
		
		return "kcg/system/user_auth_mng/AdminAuthMngDtl";
	}
	
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		return adminAuthMngSvc.getList(params, pagingConfig);
	}
	
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params) {
		return adminAuthMngSvc.getInfo(params);
	}
	
	@RequestMapping("/save")
	public CmmnMap save(CmmnMap params) {
		return adminAuthMngSvc.save(params);
	}
	
	@RequestMapping("/delete")
	public void delete(CmmnMap params) {
		adminAuthMngSvc.delete(params);
	}
	
	@RequestMapping("/chkExist")
	public CmmnMap chkExist(CmmnMap params) {
		return adminAuthMngSvc.chkExist(params);
	}
	
	@RequestMapping("/initPw")
	public CmmnMap initPw(CmmnMap params) {
		return adminAuthMngSvc.initPw(params);
	}
	
}
