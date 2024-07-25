package kcg.system.promion_mng.ctl;

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
import kcg.system.promion_mng.svc.PromionMngSvc;

@RequestMapping("/promion_mng")
@Controller
public class PromionMngCtl {
	
	@SuppressWarnings("unused")
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	PromionMngSvc promionMngSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	@RequestMapping("/list")
	public String openPageCalc(Model model, CmmnMap params) {
		return "kcg/system/promion_mng/PromionList";
	}
	
	@RequestMapping("/dtl")
	public String openPageDtl(Model model, CmmnMap params) {
		
		String sProdTyCd = params.getString("prod_ty_cd", "1");
		model.addAttribute("prod_ds_sn", params.getString("prod_ds_sn", ""));			// 설계설계번호
		model.addAttribute("cust_mbl_telno", params.getString("cust_mbl_telno", ""));	// 고객KEY
		model.addAttribute("prod_ty_cd", sProdTyCd);										// 설계타입코드 : 1.적금설계, 2.목돈마련설계, 3.예금설계, 4.대출설계
		
		String sRsltUrl = "";
		if("1".equals(sProdTyCd)) {
			sRsltUrl = "kcg/system/promion_mng/PromionDtl";
		}else if("2".equals(sProdTyCd)) {
			sRsltUrl = "kcg/system/promion_mng/PromionAcmlplDtl";
		}else if("3".equals(sProdTyCd)) {
			sRsltUrl = "kcg/system/promion_mng/PromionDpstplDtl";
		}else if("4".equals(sProdTyCd)) {
			sRsltUrl = "kcg/system/promion_mng/PromionLoanplDtl";
		}
		
		return sRsltUrl;
	}
	
	@RequestMapping("/getListPaging")
	public PageList<CmmnMap> getListPaging(CmmnMap params, PagingConfig pagingConfig) {
		return promionMngSvc.getListPaging(params, pagingConfig);
	}
	
	@RequestMapping("/getDsgInfo")
	public CmmnMap getDsgInfo(CmmnMap params) {
		return promionMngSvc.getDsgInfo(params);
	}
	
	@RequestMapping("/getProdInfo")
	public CmmnMap getProdInfo(CmmnMap params) {
		
		CmmnMap rsltMap = new CmmnMap();
		rsltMap = promionMngSvc.getProdInfo(params);
		rsltMap.put("simpl_ty_cd", params.getString("simpl_ty_cd", "0"));
		
		return rsltMap;
	}
	
	@RequestMapping("/save")
	public void save(CmmnMap params) {
		promionMngSvc.save(params);
	}
}
