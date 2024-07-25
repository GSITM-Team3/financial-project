package kcg.system.reg_mng.ctl;

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
import kcg.system.reg_mng.svc.RegMngShareDocSvc;

@RequestMapping("/system/reg_mng/shareDoc")
@Controller
public class RegMngShareDocCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	RegMngShareDocSvc regMngShareDocSvc;
	
	@Autowired
	CommonSvc commonSvc;

	@RequestMapping("/list")
	public String openPageList(ModelMap model) {		
		List<CmmnMap> aprvCdList = commonSvc.getCmmnCdList("APRVCD", false);
		model.addAttribute("aprvCdList", aprvCdList);
		
		return "kcg/system/reg_mng/RegMngShareDocList";
	}

	@RequestMapping("/dtl")
	public String openPageDtl(ModelMap model, CmmnMap params) {
		
		List<CmmnMap> aprvCdList = commonSvc.getCmmnCdList("APRVCD", false);
		// 모델에다가 카테코리값을 넣으면
		List<CmmnMap> categoryList = commonSvc.getCmmnCdList("CATEGORY", true); // brm 업무체계분류
		
		model.addAttribute("aprvCdList", aprvCdList);
		model.addAttribute("categoryList", categoryList);
		model.addAttribute("dataurl", params.getString("dataurl", ""));
		
		return "kcg/system/reg_mng/RegMngShareDocDtl";
	}

	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params , PagingConfig pagingConfig){
		return regMngShareDocSvc.getList(params, pagingConfig); 
	}

	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params){
		return regMngShareDocSvc.getInfo(params); 
	}

	@RequestMapping("/save")
	public CmmnMap save(CmmnMap params){
		return regMngShareDocSvc.save(params); 
	}

	@RequestMapping("/delete")
	public void delete(CmmnMap params){
		regMngShareDocSvc.delete(params); 
	}

}
