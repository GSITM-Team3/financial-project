package kcg.system.schd_mng;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import kcg.common.svc.CommonSvc;

@RequestMapping("/schd_mng")
@Controller
public class SchdMngCtl {
	
	@SuppressWarnings("unused")
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	CommonSvc commonSvc;
	
	@RequestMapping("/SchdMmList")
	public String openPageList(Model model) {
		return "kcg/system/schd_mng/SchdMmList";
	}
}
