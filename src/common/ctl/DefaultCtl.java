package common.ctl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;

@Controller
public class DefaultCtl {

	@RequestMapping("/")
	public String home() {
		return "kcg/login/login";
	}
	
}
