package kcg.system.poli_person_mng.ctl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;
import kcg.common.svc.CommonSvc;
import kcg.system.poli_person_mng.svc.CodeMngSvc;

@RequestMapping("/system/poli_person_mng/code")
@Controller
public class CodeMngCtl {
	
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	CodeMngSvc poliPersonCodeMngSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	@RequestMapping("/list")
	public String openPageList(Model model) {
		return "kcg/system/poli_person_mng/CodeMngList";
	}


	@RequestMapping("/getCdMngList")
	public List<CmmnMap> getCdMngList(CmmnMap params) {
		return poliPersonCodeMngSvc.getCdMngList(params);
	}
	
	
	@RequestMapping("/saveList")
	public void saveList(CmmnMap params) {
		poliPersonCodeMngSvc.saveList(params);
	}
	
	
	@RequestMapping("/chkChildExist")
	public CmmnMap chkChildExist(CmmnMap params) {
		return poliPersonCodeMngSvc.chkChildExist(params);
	}
	
	
	@RequestMapping("/deleteInfo")
	public void deleteCd(CmmnMap params) {
		poliPersonCodeMngSvc.deleteInfo(params);
	}
}
