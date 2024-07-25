package kcg.system.menu_mng.ctl;

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
import kcg.system.menu_mng.svc.MenuMngSvc;

@RequestMapping("/system/menu_mng")
@Controller
public class MenuMngCtl {
	
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	MenuMngSvc programMngSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	@RequestMapping("/list")
	public String openPageList(Model model) {
		return "kcg/system/menu_mng/MenuMngList";
	}
	
	@RequestMapping("/dtl")
	public String openPageDtl(Model model, CmmnMap params) {
		model.addAttribute("menu_url", params.getString("menu_url", ""));
		return "kcg/system/menu_mng/MenuMngDtl";
	}
	
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		return programMngSvc.getList(params, pagingConfig);
	}
	
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params) {
		return programMngSvc.getInfo(params);
	}
	
	@RequestMapping("/chkExist")
	public CmmnMap chkExist(CmmnMap params) {
		return programMngSvc.chkExist(params);
	}
	
	@RequestMapping("/save")
	public CmmnMap save(CmmnMap params) {
		return programMngSvc.save(params);
	}
	
	@RequestMapping("/delete")
	public void delete(CmmnMap params) {
		programMngSvc.delete(params);
	}

}
