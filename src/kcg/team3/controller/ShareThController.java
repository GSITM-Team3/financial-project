package kcg.team3.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import common.utils.common.CmmnMap;
import kcg.login.vo.UserInfoVO;
import kcg.team3.service.ShareThService;

@RequestMapping("/share_th")
@Controller
//공유 관리
public class ShareThController {
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	ShareThService shareThService;

	// 공지사항 리스트
	/*
	 * @GetMapping("/notice_th") public String noticeList(Model model) {
	 * List<CmmnMap> noticeList = shareThService.getNoticeList(new CmmnMap());
	 * model.addAttribute("noticeList", noticeList); return "/kcg/team3/Notice_th";
	 * }
	 */

	// 공지사항 리스트 페이지추가
	@GetMapping("/notice_th")
	public String noticeList(HttpServletRequest request, Model model) {
		// page 파라미터 추출
		String pageParam = request.getParameter("page");
		int pageNum = pageParam != null ? Integer.parseInt(pageParam) : 1; // 기본값은 1

		int pageSize = 10; // 한 페이지에 표시할 데이터 개수
		int offset = (pageNum - 1) * pageSize; // 페이지 번호에 따른 오프셋 계산

		CmmnMap params = new CmmnMap();
		params.put("pageSize", pageSize);
		params.put("offset", offset);

		// 서비스를 통해 공지사항 목록 가져오기 (페이징 처리)
		List<CmmnMap> noticeList = shareThService.getNoticeListWithPaging(params);

		// 총 공지사항 수 가져오기 (페이징 처리를 위해 필요)
		int totalNotices = shareThService.getTotalNoticeCount();
		int totalPages = (int) Math.ceil((double) totalNotices / pageSize);

		// 모델에 데이터 추가
		model.addAttribute("noticeList", noticeList);
		model.addAttribute("currentPage", pageNum);
		model.addAttribute("totalPages", totalPages);

		return "/kcg/team3/Notice_th";
	}

	// 공지사항 등록화면
	@GetMapping("/createNoticeView_th")
	public String createNoticeView(HttpServletRequest request, HttpSession session, Model model) {

		UserInfoVO userInfoVO = (UserInfoVO) request.getSession().getAttribute("userInfoVO");
		String userId = userInfoVO.getUserId();
		model.addAttribute("userId", userId);
		return "/kcg/team3/NoticeCreate_th";
	}

	// 공지사항 등록
	@GetMapping("/createNotice_th")
	public CmmnMap createNotice(CmmnMap params) {
		log.debug("디버그");
		log.debug("디버그" + params);
		return shareThService.insertNotice(params);
	}

	// 공지사항 하나 가져오는 화면
	@GetMapping("/noticeOne/{gw_code}")
	public String getNotice(@PathVariable("gw_code") String gwCode, Model model, HttpServletRequest request,
			HttpSession session) {
		CmmnMap cmmnMap = shareThService.getNoticeOne(new CmmnMap(), gwCode);
		model.addAttribute("cmmnMap", cmmnMap);
		UserInfoVO userInfoVO = (UserInfoVO) request.getSession().getAttribute("userInfoVO");

		String userId = userInfoVO.getUserId();
		model.addAttribute("userId", userId);
		return "/kcg/team3/NoticeDetail_th";
	}

	// 공지사항 수정
	@GetMapping("/updateNotice/{gw_code}")
	public CmmnMap updateNotice(CmmnMap params) {

		return shareThService.updateNotice(params);
	}

	// 공지사항 삭제
	@GetMapping("/deleteNotice/{gw_code}")
	public CmmnMap deleteNotice(CmmnMap params) {

		return shareThService.deleteNotice(params);
	}

	// 템플릿 게시판

	// 템플릿 리스트
	/*
	 * @GetMapping("/template_th") public String templateTh(Model model) {
	 * List<CmmnMap> templateList = shareThService.getTemplateList(new CmmnMap());
	 * model.addAttribute("templateList", templateList); return
	 * "/kcg/team3/Template_th"; }
	 */

	// 템플릿 리스트 페이지추가
	@GetMapping("/template_th")
	public String templateList(HttpServletRequest request, Model model) {
		// page 파라미터 추출
		String pageParam = request.getParameter("page");
		int pageNum = pageParam != null ? Integer.parseInt(pageParam) : 1; // 기본값은 1

		int pageSize = 10; // 한 페이지에 표시할 데이터 개수
		int offset = (pageNum - 1) * pageSize; // 페이지 번호에 따른 오프셋 계산

		CmmnMap params = new CmmnMap();
		params.put("pageSize", pageSize);
		params.put("offset", offset);

		// 서비스를 통해 공지사항 목록 가져오기 (페이징 처리)
		List<CmmnMap> templateList = shareThService.getTemplateListWithPaging(params);

		// 총 공지사항 수 가져오기 (페이징 처리를 위해 필요)
		int totalTemplates = shareThService.getTotalTemplateCount();
		int totalPages = (int) Math.ceil((double) totalTemplates / pageSize);

		// 모델에 데이터 추가
		model.addAttribute("templateList", templateList);
		model.addAttribute("currentPage", pageNum);
		model.addAttribute("totalPages", totalPages);

		return "/kcg/team3/Template_th";
	}

	// 템플릿 등록화면
	@GetMapping("/createTemplateView_th")
	public String createTemplateView(HttpServletRequest request, HttpSession session, Model model) {

		UserInfoVO userInfoVO = (UserInfoVO) request.getSession().getAttribute("userInfoVO");
		String userId = userInfoVO.getUserId();
		model.addAttribute("userId", userId);
		return "/kcg/team3/TemplateCreate_th";
	}

	// 템플릿 등록
	@GetMapping("/createTemplate_th")
	public CmmnMap createTemplate(CmmnMap params) {
		log.debug("디버그");
		log.debug("디버그" + params);
		return shareThService.insertTemplate(params);
	}

	// 템플릿 하나 가져오는 화면
	@GetMapping("/templateOne/{gw_code}")
	public String getTemplate(@PathVariable("gw_code") String gwCode, Model model, HttpServletRequest request,
			HttpSession session) {
		CmmnMap cmmnMap = shareThService.getTemplateOne(new CmmnMap(), gwCode);
		model.addAttribute("cmmnMap", cmmnMap);
		UserInfoVO userInfoVO = (UserInfoVO) request.getSession().getAttribute("userInfoVO");

		String userId = userInfoVO.getUserId();
		model.addAttribute("userId", userId);
		return "/kcg/team3/TemplateDetail_th";
	}

	// 템플릿 수정
	@GetMapping("/updateTemplate/{gw_code}")
	public CmmnMap updateTemplate(CmmnMap params) {

		return shareThService.updateNotice(params);
	}

	// 템플릿 삭제
	@GetMapping("/deleteTemplate/{gw_code}")
	public CmmnMap deleteTemplate(CmmnMap params) {

		return shareThService.deleteNotice(params);
	}
}
