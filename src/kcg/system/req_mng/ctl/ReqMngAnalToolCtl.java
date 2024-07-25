package kcg.system.req_mng.ctl;

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
import kcg.system.req_mng.svc.ReqMngAnalToolSvc;

@RequestMapping("/system/req_mng/analTool")
@Controller
public class ReqMngAnalToolCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	ReqMngAnalToolSvc reqAnalToolSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	/**
	 * 분석 도구 신청 관리 페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/list")
	public String openPageList(ModelMap model) {		
		List<CmmnMap> aprvCdList = commonSvc.getCmmnCdList("APRVCD", false);
		model.addAttribute("aprvCdList", aprvCdList);
		
		return "kcg/system/req_mng/ReqMngAnalToolList";
	}
	
	/**
	 * 분석 도구 신청 관리 상세페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/dtl")
	public String openPageDtl(ModelMap model, CmmnMap params) {
		List<CmmnMap> aprvCdList = commonSvc.getCmmnCdList("APRVCD", false);
		model.addAttribute("aprvCdList", aprvCdList);
		model.addAttribute("idx", params.getString("idx", ""));
		return "kcg/system/req_mng/ReqMngAnalToolDtl";
	}
	
	/** 
	* 분석 도구 신청 관리 목록 조회한다.
	* @methodName : getList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params , PagingConfig pagingConfig){
		return reqAnalToolSvc.getList(params, pagingConfig); 
	}
	
	/** 
	* 분석 도구 신청 관리 상세정보조회 한다.
	* @methodName : getInfo 
	* @author : Irury Kang
	* */
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params){
		return reqAnalToolSvc.getInfo(params); 
	}
	
	/** 
	* 분석 도구 신청 관리 상세정보 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */
	@RequestMapping("/save")
	public CmmnMap save(CmmnMap params){
		return reqAnalToolSvc.save(params); 
	}
	
	/** 
	* 분석 도구 신청 관리 상태 일괄변경
	* @methodName : updtStatus 
	* @author : Irury Kang 
	* */
	@RequestMapping("/updtStatus")
	public CmmnMap updtStatus(CmmnMap params){
		return reqAnalToolSvc.updtStatus(params); 
	}
	
	
	/** 
	* 분석 도구 신청 관리 상세정보 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */
	@RequestMapping("/delete")
	public void delete(CmmnMap params){
		reqAnalToolSvc.delete(params); 
	}
	
	@RequestMapping("/getToolInfoList")
	public List<CmmnMap> getToolInfoList(CmmnMap params) {		
		return reqAnalToolSvc.getToolInfoList(); 
	}
}
