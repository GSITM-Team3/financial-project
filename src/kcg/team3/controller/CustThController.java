package kcg.team3.controller;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import common.dao.CmmnDao;
import common.utils.common.CmmnMap;
import kcg.common.svc.CommonSvc;
import kcg.login.vo.UserInfoVO;
import kcg.team3.service.CustThService;

@RequestMapping("/cust_th")
@Controller
//GSITM고객관리
public class CustThController {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	CustThService custThService;

	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	// 고객 이벤트 조회
	   @GetMapping("/eventList_th")
	   public String getCustEventList(HttpServletRequest request, Model model) {
	      
	         String pageParam=request.getParameter("page");
	         int pageNum=pageParam != null ? Integer.parseInt(pageParam) :1;
	         int pageSize=10;
	         int offset=(pageNum-1)*pageSize;
	         
	         CmmnMap params=new CmmnMap();
	           
	          // 고객 정보 검색 기능
	           String eventCustInfo = request.getParameter("cust_info");
	           String custSearchInput = request.getParameter("keyword");
	           if (eventCustInfo != null && custSearchInput != null && !custSearchInput.isEmpty()) {
	               // 검색 조건에 따라 파라미터 설정
	               switch (eventCustInfo) {
	                   case "cust_code":
	                       try {
	                           int custCode = Integer.parseInt(custSearchInput);
	                           params.put("cust_code", custCode);
	                       } catch (NumberFormatException e) {
	                           // 예외 처리: 숫자로 변환할 수 없는 경우
	                       }
	                       break;
	                   case "cust_name":
	                       params.put("cust_name", custSearchInput);
	                       break;
	                   default:
	                      // 기본적으로 전체 상태로 처리
	                       break;
	               }
	           }
	           
	           // 이벤트 종류 필터링
	           String eventFilter = request.getParameter("eventFilter");
	           if (eventFilter != null && !eventFilter.isEmpty()) {
	               // 상태 필터에 따른 로직 추가
	               switch (eventFilter) {
	                   case "event1":
	                      params.put("event_type", "적금");
	                       break;
	                   case "event2":
	                      params.put("event_type", "예금");
	                       break;
	                   case "event3":
	                         params.put("event_type", "챌린지");
	                          break;
	                   case "birthday":
	                         params.put("event_type", "생일");
	                          break;
	                   default:
	                       // 기본적으로 전체 상태로 처리
	                       break;
	               }
	           }
	           
	         params.put("pageSize", pageSize);
	         params.put("offset", offset);
	         
	         List<CmmnMap> custEventList = custThService.getEventListWithPaging(params);
	         int totalEvents = custThService.getFilterEventCount(params);
	         int totalEventPages = (int) Math.ceil((double) totalEvents / pageSize);
	         
	         model.addAttribute("currentPage", pageNum);
	        model.addAttribute("totalPages", totalEventPages);
	         model.addAttribute("custEventList", custEventList);
	         return "/kcg/team3/EventList_th";
	      }

	// 고객정보관리
	@GetMapping("/custInfo_th")
	public String custInfoTh(Model model) {
		List<CmmnMap> userIds = custThService.getUserIds(new CmmnMap());
		model.addAttribute("userIds", userIds);
		return "/kcg/team3/CustInfo_th";
	}

	// 불러오기 버튼(맡은 고객 리스트)
	@GetMapping("/getAssignedCustomers")
	@ResponseBody
	public List<CmmnMap> getAssignedCustomers(HttpSession session, Model model) {

		UserInfoVO userInfoVO = (UserInfoVO) session.getAttribute("userInfoVO");
		String userId = userInfoVO.getUserId();

		// 관리자가 담당하고 있는 고객 리스트 조회
		List<CmmnMap> assignedCustomers = custThService.getAssignedCustomers(userId);

		// 모델에 고객 리스트 추가
		model.addAttribute("assignedCustomers", assignedCustomers);

		return assignedCustomers;
	}

	// 수정 버튼(고객 정보 update)
// 수정 버튼(고객 정보 update)
	@PostMapping("custModify_th")
	public String custModify(HttpServletRequest request, Model model) {
		try {
			String cust_name = request.getParameter("cust_name");
			String cust_birth = request.getParameter("cust_birth");
			String cust_phonenum = request.getParameter("cust_phonenum");
			String cust_gen = request.getParameter("cust_gen");
			String cust_type = request.getParameter("cust_type");
			String user_id = request.getParameter("user_id");
			String cust_state = request.getParameter("cust_state");

			long epochTime = Long.parseLong(request.getParameter("cust_created_at"));
			Date cust_created_at = new Date(epochTime);

			String cust_code_str = request.getParameter("cust_code"); // 문자열로부터 받아옴
			int cust_code = Integer.parseInt(cust_code_str); // 문자열을 정수형으로 변환

			CmmnMap params = new CmmnMap();
			CmmnMap existingCustomer = custThService.getcustNameByCode(params, cust_code);
			String existingPhoneNumber = (String) existingCustomer.get("cust_phonenum");

			if (!existingPhoneNumber.equals(cust_phonenum)) {
				// 전화번호 중복 확인
				boolean phoneNumberExists = custThService.checkPhoneNumber(cust_phonenum);
				if (phoneNumberExists) {
					model.addAttribute("message", "입력하신 전화번호는 이미 등록된 전화번호입니다.");
					List<CmmnMap> userIds = custThService.getUserIds(new CmmnMap());
					model.addAttribute("userIds", userIds);
					return "/kcg/team3/CustInfo_th";
				}
			}

			// 고객 수정 처리
			params.put("cust_code", cust_code);
			params.put("cust_name", cust_name);
			params.put("cust_birth", cust_birth);
			params.put("cust_phonenum", cust_phonenum);
			params.put("cust_gen", cust_gen);
			params.put("cust_type", cust_type);
			params.put("user_id", user_id);
			params.put("cust_state", cust_state);
			params.put("cust_created_at", cust_created_at);
			// 현재 시간으로 updated_at 설정
			LocalDateTime now = LocalDateTime.now();
			params.put("cust_updated_at", now);

			custThService.custModify(params);

		} catch (Exception e) {
			log.error("Error registering consultation:", e);
		}

		return "redirect:/cust_th/custList_th";
	}

	// 등록 버튼(고객 정보 insert)
	@PostMapping("/custInsert_th")
	public String custInsert(HttpServletRequest request, Model model) {
		try {

			String user_id = request.getParameter("user_id");
			String cust_name = request.getParameter("cust_name");
			String cust_birth = request.getParameter("cust_birth");
			String cust_phonenum = request.getParameter("cust_phonenum");
			String cust_gen = request.getParameter("cust_gen");
			String cust_type = request.getParameter("cust_type");
			String cust_state = request.getParameter("cust_state");

			// 전화번호 중복 확인
			boolean phoneNumberExists = custThService.checkPhoneNumber(cust_phonenum);
			if (phoneNumberExists) {
				model.addAttribute("message", "입력하신 전화번호는 이미 등록된 전화번호입니다.");
				List<CmmnMap> userIds = custThService.getUserIds(new CmmnMap());
				model.addAttribute("userIds", userIds);
				return "/kcg/team3/CustInfo_th";
			}

			// 현재 시간 설정
			LocalDateTime now = LocalDateTime.now();

			// 고객 등록 처리
			CmmnMap params = new CmmnMap();
			params.put("user_id", user_id);
			params.put("cust_name", cust_name);
			params.put("cust_birth", cust_birth);
			params.put("cust_phonenum", cust_phonenum);
			params.put("cust_gen", cust_gen);
			params.put("cust_type", cust_type);
			params.put("cust_created_at", now);
			params.put("cust_updated_at", now);
			params.put("cust_state", cust_state);

			custThService.custInsert(params);

		} catch (Exception e) {
			log.error("Error registering consultation:", e);
		}

		return "redirect:/cust_th/custList_th";
	}

	// 고객정보 목록 조회
	@GetMapping("/custList_th")
	public String custListTh(HttpServletRequest request, Model model) {
		String pageParam = request.getParameter("page");
		int pageNum = pageParam != null ? Integer.parseInt(pageParam) : 1;
		int pageSize = 10;
		int offset = (pageNum - 1) * pageSize;

		CmmnMap params = new CmmnMap();

		// 검색 기능 처리
		String searchBy = request.getParameter("searchBy");
		String searchInput = request.getParameter("searchInput");
		if (searchBy != null && searchInput != null && !searchInput.isEmpty()) {
			// 검색 조건에 따라 파라미터 설정
			switch (searchBy) {
			case "cust_code":
				try {
					int custCode = Integer.parseInt(searchInput);
					params.put("cust_code", custCode);
				} catch (NumberFormatException e) {
					// 예외 처리: 숫자로 변환할 수 없는 경우
				}
				break;
			case "cust_name":
				params.put("cust_name", searchInput);
				break;
			case "cust_phonenum":
				params.put("cust_phonenum", searchInput);
				break;
			case "user_id":
				params.put("user_id", searchInput);
				break;
			default:
				// 기본적으로는 고객 코드로 검색
				params.put("cust_code", searchInput);
				break;
			}
		}

		// 달력 기능 처리
		String birthDatePicker = request.getParameter("birthDatePicker");
		if (birthDatePicker != null && !birthDatePicker.isEmpty()) {
			params.put("cust_birth", birthDatePicker);
		}

		// 상태 필터링 처리
		String statusFilter = request.getParameter("statusFilter");
		if (statusFilter != null && !statusFilter.isEmpty()) {
			// 상태 필터에 따른 로직 추가
			switch (statusFilter) {
			case "1":
				params.put("cust_state", "가입상태");
				break;
			case "2":
				params.put("cust_state", "탈퇴상태");
				break;
			default:
				// 기본적으로 전체 상태로 처리
				break;
			}
		}

		params.put("pageSize", pageSize);
		params.put("offset", offset);

		List<CmmnMap> custList = custThService.getCustListWithPaging(params);
		int totalProds = custThService.getFilteredCustCount(params);
		int totalPages = (int) Math.ceil((double) totalProds / pageSize);

		model.addAttribute("currentPage", pageNum);
		model.addAttribute("totalPages", totalPages);
		model.addAttribute("custList", custList);
		return "/kcg/team3/CustList_th";
	}

	// 고객 상담 내용
	@GetMapping("/custConsult_th")
	public String custConsult(HttpServletRequest request, Model model) {

		String cust_code = request.getParameter("cust_code");

		List<CmmnMap> custConsultList = custThService.custConsult(Integer.parseInt(cust_code));
		model.addAttribute("custConsultList", custConsultList);

		return "/kcg/team3/CustConsultList_th";
	}

	// 고객 상담 등록
	@PostMapping("/consultInsert_th")
	public String consultInsert(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		try {
			int custCode = Integer.parseInt(request.getParameter("cust_code"));
			String consultContent = request.getParameter("consult_content");

			UserInfoVO userInfoVO = (UserInfoVO) session.getAttribute("userInfoVO");
			String userId = userInfoVO.getUserId(); // userInfoVO에서 userId 가져오기

			// 현재 시간 설정
			LocalDateTime now = LocalDateTime.now();

			// 상담 등록 처리
			CmmnMap params = new CmmnMap();
			params.put("cust_code", custCode);
			params.put("user_id", userId);
			params.put("consult_created_at", now);
			params.put("consult_updated_at", now);
			params.put("consult_content", consultContent);

			custThService.insertConsult(params);

			return "redirect:/cust_th/custList_th";
		} catch (Exception e) {
			log.error("Error registering consultation:", e);
			// 에러 처리 로직 추가
			return "error-page"; // 에러 페이지 경로로 변경 필요
		}
	}

}
