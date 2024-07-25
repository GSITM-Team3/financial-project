package kcg.system.cmmn_cd_mng.ctl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;
import common.utils.common.MultipartFileList;
import common.utils.common.PagingConfig;
import kcg.common.svc.CommonSvc;
import kcg.system.cmmn_cd_mng.svc.CmmnCdMngSvc;

@RequestMapping("/system/cmmn_cd")
@Controller
public class CmmnCdMngCtl {
	
	@Autowired
	CmmnCdMngSvc cmmnCdMngSvc;
	
	@Autowired
	CommonSvc commonSvc;
	@RequestMapping("/list")
	public String openPageList(ModelMap model) {
		return "kcg/system/cmmn_cd_mng/CmmnCdMngList";
	}
	
	@RequestMapping("/dtl")
	public String openPageDtl(ModelMap model, CmmnMap params) {
		model.addAttribute("idx", params.getString("idx", ""));
		return "kcg/system/cmmn_cd_mng/CmmnCdMngDtl";
	}
}
