package kcg.system.stat_mng.ctl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;
import common.utils.common.CmmnUtil;
import kcg.system.stat_mng.svc.StatMngSvc;

@RequestMapping("/system/stat_mng")
@Controller
public class StatMngCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	StatMngSvc statMngSvc;

	@RequestMapping("/dashboard")
	public String openPageDashboard(ModelMap model) {
		
		CmmnMap statData = statMngSvc.getDashboardStatData();
		model.addAttribute("statData", statData);
		
		return "kcg/system/stat_mng/StatMngDashboard";
	}

	@RequestMapping("/keyword")
	public String openPageKeyword(ModelMap model) {
		model.addAttribute("today", CmmnUtil.getTodayFormedString());
		return "kcg/system/stat_mng/StatMngKeyword";
	}
	
	@RequestMapping("/keyword/getData")
	public List<CmmnMap> keyword_getData(CmmnMap params){
		return statMngSvc.getKeywordStat(params);
	}

	@RequestMapping("/req")
	public String openPageReq(ModelMap model) {
		model.addAttribute("today", CmmnUtil.getTodayFormedString());
		return "kcg/system/stat_mng/StatMngReq";
	}
	
	@RequestMapping("/req/getData")
	public CmmnMap req_getData(CmmnMap params){
		return statMngSvc.getReqStat(params);
	}

	@RequestMapping("/visitReg")
	public String openPageVisitReg(ModelMap model) {
		model.addAttribute("today", CmmnUtil.getTodayFormedString());	
		return "kcg/system/stat_mng/StatMngVisitReg";
	}
	
	@RequestMapping("/visitReg/getData")
	public CmmnMap visitReg_getData(CmmnMap params){
		return statMngSvc.getStatisticDataTotal(params);
	}

}
