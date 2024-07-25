package kcg.team3.controller;

import java.util.List;
import java.util.Map;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import common.utils.common.CmmnMap;
import kcg.login.vo.UserInfoVO;

import kcg.team3.service.CustThService;
import kcg.team3.service.ProdThService;
import kcg.team3.service.PromotionThService;

@RequestMapping("/promotion_th")
@Controller
public class PromotionThController {

	private static final Logger log = LoggerFactory.getLogger(PromotionThController.class);

	@Autowired
	private PromotionThService promotionThService;

	@Autowired
	ProdThService prodThService;

	@Autowired
	CustThService custThService;

	// 설계이력 조회 240719
	@GetMapping("/designList_th")
	public String DesignListTh(HttpServletRequest request, Model model) {
		// page 파라미터 추출
		String pageParam = request.getParameter("page");
		int pageNum = pageParam != null ? Integer.parseInt(pageParam) : 1; // 기본값은 1

		int pageSize = 10; // 한 페이지에 표시할 데이터 개수
		int offset = (pageNum - 1) * pageSize; // 페이지 번호에 따른 오프셋 계산

		CmmnMap params = new CmmnMap();
		params.put("pageSize", pageSize);
		params.put("offset", offset);

		// 검색 기능 처리
		String searchCategory = request.getParameter("searchCategory");
		String searchKeyword = request.getParameter("searchKeyword");
		boolean isSearch = false;
		if (searchCategory != null && searchKeyword != null && !searchKeyword.isEmpty()) {
			// 검색 조건에 따라 파라미터 설정
			isSearch = true;
			switch (searchCategory) {
			case "user_id":
				params.put("user_id", searchKeyword);
				break;
			case "cust_name":
				params.put("cust_name", searchKeyword);
				break;
			case "prod_name":
				params.put("prod_name", searchKeyword);
				break;
			default:
				// 기본적으로는 검색 조건을 설정하지 않음
				break;
			}
		}

		// 서비스 호출
		List<CmmnMap> designList;
		int totalDeisign;
		if (isSearch) {
			designList = promotionThService.getDesignListWithFilterAndPaging(params);
			totalDeisign = promotionThService.getFilteredDesignCount(params);
			log.debug(totalDeisign + " : totalDeisign 필터링");
		} else {
			designList = promotionThService.getDesignListWithPaging(params);
			totalDeisign = promotionThService.getTotalDesignCount();
			log.debug(totalDeisign + " : totalDeisign 필터링 없이");
		}

		int totalPages = (int) Math.ceil((double) totalDeisign / pageSize);

		// 각 설계에 대해 prod_code를 기반으로 prod_name 조회하여 추가
		for (CmmnMap design : designList) {
			int prodCode = (int) design.get("prod_code"); // designList에 있는 prod_code 가져오기

			// tb3_product에서 prod_code에 해당하는 prod_name 조회
			CmmnMap cmmnMap = prodThService.getProductNameByProdCode(new CmmnMap(), prodCode);
			String prodName = cmmnMap.getString("prod_name");
			String prodType = cmmnMap.getString("prod_type");

			// 조회한 prod_name을 designList에 추가
			design.put("prod_name", prodName);
			design.put("prod_type", prodType);

			int custCode = (int) design.get("cust_code");

			// tb3_cust에서 cust_code에 해당하는 cust_name 조회
			CmmnMap cmmnMapCust = custThService.getcustNameByCode(new CmmnMap(), custCode);
			String custName = cmmnMapCust.getString("cust_name");
			design.put("cust_name", custName);
		}

		model.addAttribute("designList", designList);
		model.addAttribute("currentPage", pageNum);
		model.addAttribute("totalPages", totalPages);

		return "/kcg/team3/DesignList_th";
	}

	@GetMapping("/getPromotionProdList")
	public List<Map<String, Object>> getPromotionProdList() {
		return promotionThService.getPromotionProdList();
	}

	@GetMapping("/getProductDetails")
	@ResponseBody
	public Map<String, Object> getProductDetails(@RequestParam String productName) {
		return promotionThService.getProductDetails(productName);
	}

	// 고객 목록 조회
	@GetMapping("/getCustomerList")
	@ResponseBody
	public List<Map<String, Object>> getCustomerList() {
		return promotionThService.getCustomerList();
	}

	// 금융계산기
	@GetMapping("/calculator_th")
	public String CalculatorTh(Model model) {
		List<Map<String, Object>> promotionProdList = promotionThService.getPromotionProdList();
		model.addAttribute("promotionProdList", promotionProdList);
		return "/kcg/team3/Calculator_th";
	}

	// 상품 저장
	@PostMapping("/savePlan")
	@ResponseBody
	public ResponseEntity<Map<String, String>> savePlan(CmmnMap params, HttpSession session,
			HttpServletRequest request) {
		UserInfoVO userInfoVO = (UserInfoVO) request.getSession().getAttribute("userInfoVO");
		String userId = userInfoVO.getUserId();
		String prodCode = request.getParameter("prod_code");
		String custCode = request.getParameter("cust_code");
		String planAmt = request.getParameter("plan_amt");
		String planTerm = request.getParameter("plan_term");
		String planState = request.getParameter("plan_state");

		params.put("prod_code", prodCode);
		params.put("user_id", userId);
		params.put("cust_code", custCode);
		params.put("plan_amt", planAmt);
		params.put("plan_term", planTerm);
		params.put("plan_state", planState);
		params.put("plan_created_at", LocalDateTime.now());
		params.put("plan_updated_at", LocalDateTime.now());

		int rowsAffected = promotionThService.savePlan(params);

		Map<String, String> response = new HashMap<>();
		if (rowsAffected > 0) {
			response.put("message", "계획이 성공적으로 저장되었습니다");
			return ResponseEntity.ok(response);
		} else {
			response.put("message", "계획 저장 중 오류가 발생하였습니다");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
	
	// 상품 수정
	@PostMapping("/updatedPlan")
	@ResponseBody
	public ResponseEntity<Map<String, String>> updatedPlan(CmmnMap params, HttpServletRequest request) {
        // 파라미터 가져오기
        String status = request.getParameter("status");
        String plan_code = request.getParameter("plan_code");

        // 업데이트 파라미터 구성
        params.put("plan_code", plan_code);
        params.put("plan_state", status);
        params.put("plan_updated_at", Timestamp.valueOf(LocalDateTime.now()));  // Timestamp로 변환

        Map<String, String> response = new HashMap<>();
        CmmnMap a = promotionThService.updatedPlan(params);
		response.put("message", "계획이 성공적으로 저장되었습니다");
		return ResponseEntity.ok(response);
	}

	
	@GetMapping("/designDetail")
	public String DesignDetailTh(HttpServletRequest request, Model model) {
	    String planCodeParam = request.getParameter("plan_code");
	    int planCode = Integer.parseInt(planCodeParam); // 문자열을 int로 변환

	    // planCode를 사용하여 디자인 세부 정보를 조회하고, 모델에 추가
	    CmmnMap designDetail = promotionThService.getDesignDetailByPlanCode(planCode);
	    model.addAttribute("designDetail", designDetail);
	    return "/kcg/team3/DesignDetail_th";
	}

}
