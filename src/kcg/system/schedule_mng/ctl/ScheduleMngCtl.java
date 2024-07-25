package kcg.system.schedule_mng.ctl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;
import common.utils.common.ConfigExcelDn;
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import kcg.common.svc.CommonSvc;
import kcg.system.schedule_mng.svc.ScheduleMngSvc;

@RequestMapping("/scheduleMng")
@Controller
public class ScheduleMngCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	ScheduleMngSvc scheduleMngSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	/**
	 * 관리 페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/scheduleList")
	public String openPageList(ModelMap model) {		
		return "kcg/system/schedule_mng/scheduleList";
	}
	
	/** 
	* 관리 목록 조회한다.
	* @methodName : getList 
	* @author : Irury Kang 
	* */
//	@RequestMapping("/getList")
//	public ArrayList<CmmnMap> getList(CmmnMap params , PagingConfig pagingConfig){	
//		//return etcMngErrCdSvc.getList(params, pagingConfig); 
//		log.debug("{}",params);
//		ArrayList pageList = new ArrayList();
//		
//	@RequestMapping("/getList")
//	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
//		PageList<CmmnMap> pageList = scheduleMngSvc.getList(params, pagingConfig); 
//		log.debug("{}",pageList);
//		return pageList;
//	}
	
	@RequestMapping("/getList")
	public List<CmmnMap> getList(CmmnMap params){
		return scheduleMngSvc.getList(params); 
	}
	
	@RequestMapping("/getDayList")
	public List<CmmnMap> getDayList(CmmnMap params){
		return scheduleMngSvc.getDayList(params); 
	}
	
	@RequestMapping("/getCustInfo")
	public List<CmmnMap> getCustInfo(CmmnMap params){
		return scheduleMngSvc.getCustInfo(params); 
	}
	
	@RequestMapping("/getInfo")
	public CmmnMap getInitInfo(CmmnMap params) {
		return scheduleMngSvc.getInfo(params);
	}
	
	
	@RequestMapping("/save")
	public CmmnMap insertTaskInfo(CmmnMap params) {
		return scheduleMngSvc.insertTaskInfo(params);
	}
	
	@RequestMapping("/delete")
	public void deleteTaskInfo(CmmnMap params){
		scheduleMngSvc.deleteTaskInfo(params); 
	}
	
}
