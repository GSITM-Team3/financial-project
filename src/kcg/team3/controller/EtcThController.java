package kcg.team3.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/etc_th")
@Controller
//기타 관리
public class EtcThController {

	@GetMapping("/guide_th")
	public String GuideTh() {
		return"/kcg/team3/Guide_th";
	}
}
