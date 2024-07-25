package kcg.team3.controller;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import common.utils.common.CmmnMap;
import kcg.team3.service.CommunityThService;

@Controller
@RequestMapping("/community_th")
public class CommunityThController {

	private static final Logger log = LoggerFactory.getLogger(CommunityThController.class);

	@Autowired
	private CommunityThService communityThService;

	// 직원 주소록 목록 조회(페이징)
	@GetMapping("/directory_th")
	public String commuListTh(HttpServletRequest request, Model model) {
		String pageParam = request.getParameter("page");
		int pageNum = pageParam != null ? Integer.parseInt(pageParam) : 1;
		int pageSize = 10; // 한 페이지당 보여줄 데이터 수
		int offset = (pageNum - 1) * pageSize;

		CmmnMap params = new CmmnMap();
		params.put("pageSize", pageSize);
		params.put("offset", offset);

		List<CmmnMap> commuList = communityThService.getCommuListWithPaging(params);

		int totalProds = communityThService.getTotalCommuCount();
		int totalPages = (int) Math.ceil((double) totalProds / pageSize);

		model.addAttribute("commuList", commuList);
		model.addAttribute("currentPage", pageNum);
		model.addAttribute("totalPages", totalPages);

		return "/kcg/team3/Directory_th";
	}

	@PostMapping("/getCommunityList")
	public List<CmmnMap> getCommunityList(CmmnMap params) {
		return communityThService.getCommunityList(params);
	}

	// 고객정보 목록 조회
	@GetMapping("/directoryList_th")
	public String directoryListTh(HttpServletRequest request, Model model) {
		String pageParam = request.getParameter("page");
		int pageNum = pageParam != null ? Integer.parseInt(pageParam) : 1;
		int pageSize = 10;
		int offset = (pageNum - 1) * pageSize;

		CmmnMap params = new CmmnMap();

		// 상태 필터링 처리
		String statusFilter = request.getParameter("statusFilter");
		if (statusFilter != null && !statusFilter.isEmpty()) {
			// 상태 필터에 따른 로직 추가
			switch (statusFilter) {
			case "개발":
				params.put("dept", "개발");
				break;
			case "마케팅":
				params.put("dept", "마케팅");
				break;
			default:
				break;
			}
		}

		params.put("pageSize", pageSize);
		params.put("offset", offset);

		List<CmmnMap> commuList = communityThService.getCommuListWithPaging(params);
		int totalProds = communityThService.getFilteredCommuCount(params);
		int totalPages = (int) Math.ceil((double) totalProds / pageSize);

		model.addAttribute("commuList", commuList);
		model.addAttribute("currentPage", pageNum);
		model.addAttribute("totalPages", totalPages);
		return "/kcg/team3/Directory_th";
	}
}
