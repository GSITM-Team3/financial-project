package kcg.system.prod_mng.ctl;

import java.util.List;

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
import kcg.system.prod_mng.svc.ProdMngSvc;

@RequestMapping("/prod_mng")
@Controller
public class ProdMngCtl {
	
	@SuppressWarnings("unused")
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	ProdMngSvc prodMngSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	@RequestMapping("/list")
	public String openPageList(Model model) {
		return "kcg/system/prod_mng/ProdList";
	}
	
	@RequestMapping("/dtl")
	public String openPageDtl(Model model, CmmnMap params) {
		model.addAttribute("prod_cd", params.getString("prod_cd", ""));
		return "kcg/system/prod_mng/ProdDtl";
	}
	
	@RequestMapping("/calc")
	public String openPageCalc(Model model, CmmnMap params) {
		return "kcg/system/prod_mng/ProdCalc";
	}
	
	@RequestMapping("/getList")
	public List<CmmnMap> getList(CmmnMap params) {
		return prodMngSvc.getList(params);
	}
	
	@RequestMapping("/getListPaging")
	public PageList<CmmnMap> getListPaging(CmmnMap params, PagingConfig pagingConfig) {
		return prodMngSvc.getListPaging(params, pagingConfig);
	}
	
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params) {
		return prodMngSvc.getInfo(params);
	}
	
	@RequestMapping("/save")
	public CmmnMap save(CmmnMap params) {
		return prodMngSvc.save(params);
	}
	
	@RequestMapping("/delete")
	public void delete(CmmnMap params) {
		prodMngSvc.delete(params);
	}
	
	@RequestMapping("/getCustList")
	public List<CmmnMap> getCustList(CmmnMap params) {
		return prodMngSvc.getCustList(params);
	}
}
