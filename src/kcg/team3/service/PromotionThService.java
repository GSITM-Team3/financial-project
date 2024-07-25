package kcg.team3.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import common.dao.CmmnDao;
import common.utils.common.CmmnMap;
import kcg.common.svc.CommonSvc;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jdo.annotations.Transactional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Service
public class PromotionThService {

	private static final Logger log = LoggerFactory.getLogger(PromotionThService.class);

	@Autowired
	HttpServletRequest request;

	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	@Autowired
	CustThService custThService;

	@Autowired
	ProdThService prodThService;

	// 설계 리스트 가져오기
	public List<CmmnMap> getDesignList(CmmnMap params) {
		List<CmmnMap> designList = cmmnDao.selectList("kcg.team3.getDesignList", params);
		return designList;
	}

	// 설계 리스트 가져오기(페이징)
	public List<CmmnMap> getDesignListWithPaging(CmmnMap params) {
		List<CmmnMap> designList = cmmnDao.selectList("kcg.team3.getDesignListWithPaging", params);
		return designList;
	}

	// 설계 갯수 가져오기
	public int getTotalDesignCount() {
		List<CmmnMap> designList = cmmnDao.selectList("kcg.team3.getDesignList");
		int count = 0;

		for (CmmnMap design : designList) {
			count++;
		}
		return count;
	}

	// 설계 필터 리스트 가겨오기(페이징) 240719
	public List<CmmnMap> getDesignListWithFilterAndPaging(CmmnMap params) {
		// 고객 코드 조회
		if (params.containsKey("cust_name")) {
			CmmnMap mapCust = custThService.getCustByName(params);
			if (mapCust != null && mapCust.containsKey("cust_code")) {
				int cust_code = (int) mapCust.get("cust_code");
				params.put("cust_code", cust_code);
			} else {
				// 고객 이름이 제공되었지만 일치하는 고객이 없는 경우 예외 처리
				params.put("cust_code", -1); // 존재하지 않는 코드로 설정
			}
		}

		// 제품 코드 조회
		if (params.containsKey("prod_name")) {
			CmmnMap mapProd = prodThService.getProductByName(params);
			log.debug(mapProd + " : mapProd");

			if (mapProd != null && mapProd.containsKey("prod_code")) {
				int prod_code = (int) mapProd.get("prod_code");
				log.debug(prod_code + " : prod_code");
				params.put("prod_code", prod_code);
			} else {
				// 제품 이름이 제공되었지만 일치하는 제품이 없는 경우 예외 처리
				params.put("prod_code", -1); // 존재하지 않는 코드로 설정
			}
		}

		List<CmmnMap> designList = cmmnDao.selectList("kcg.team3.getDesignListWithFilterAndPaging", params);

		return designList;
	}

	// 설계 필터 목록 조회
	public int getFilteredDesignCount(CmmnMap params) {
		// 고객 코드 조회
		if (params.containsKey("cust_name")) {
			CmmnMap mapCust = custThService.getCustByName(params);
			if (mapCust != null && mapCust.containsKey("cust_code")) {
				int cust_code = (int) mapCust.get("cust_code");
				params.put("cust_code", cust_code);
			} else {
				// 고객 이름이 제공되었지만 일치하는 고객이 없는 경우 예외 처리
				params.put("cust_code", -1); // 존재하지 않는 코드로 설정
			}
		}

		// 제품 코드 조회
		if (params.containsKey("prod_name")) {
			CmmnMap mapProd = prodThService.getProductByName(params);
			log.debug(mapProd + " : mapProd");

			if (mapProd != null && mapProd.containsKey("prod_code")) {
				int prod_code = (int) mapProd.get("prod_code");
				log.debug(prod_code + " : prod_code");
				params.put("prod_code", prod_code);
			} else {
				// 제품 이름이 제공되었지만 일치하는 제품이 없는 경우 예외 처리
				params.put("prod_code", -1); // 존재하지 않는 코드로 설정
			}
		}

		return cmmnDao.selectOne("kcg.team3.getFilteredDesignCount", params);
	}

	public Map<String, Object> getProductDetails(String productName) {
		String queryId = "kcg.team3.getProductDetails";
		return cmmnDao.selectOne(queryId, productName);
	}

	public List<Map<String, Object>> getPromotionProdList() {
		String queryId = "kcg.team3.getPromotionProdList";
		return cmmnDao.selectList(queryId);
	}

	public List<Map<String, Object>> getCustomerList() {
		String queryId = "kcg.team3.getCustomerList"; // SQL 쿼리 ID
		return cmmnDao.selectList(queryId);
	}

	public CmmnMap savePlan(CmmnMap params, HttpSession session) {
		String userId = (String) session.getAttribute("userId");

		String prod_code = params.getString("prod_code");
		String cust_code = params.getString("cust_code");
		String plan_amt = params.getString("plan_amt");
		String plan_term = params.getString("plan_term");
		String plan_state = params.getString("plan_state");

		params.put("prod_code", prod_code);
		params.put("userId", userId);
		params.put("cust_code", cust_code);
		params.put("plan_amt", plan_amt);
		params.put("plan_term", plan_term);
		params.put("plan_state", plan_state);

		cmmnDao.insert("kcg.team3.savePlan", params);

		return new CmmnMap().put("prod_code", params.getString("prod_code"));
	}

	// 메인용 Top3
	public List<CmmnMap> getUserForMain() {
		return cmmnDao.selectList("kcg.team3.getUserForMainLimit3");
	}

	public int savePlan(CmmnMap params) {
		return cmmnDao.insert("kcg.team3.savePlan", params);
	}
	
	// 설계 수정
	public CmmnMap getDesignDetailByPlanCode(int planCode) {
	    String queryId = "kcg.team3.getDesignDetailByPlanCode";
	    CmmnMap result = cmmnDao.selectOne(queryId, planCode);
	    log.debug("Design Detail: " + result);
	    return result;
	}
	
	public CmmnMap updatedPlan(CmmnMap params) {
	    // 파라미터에서 Timestamp를 직접 가져오는 부분 수정
	    String plan_code = params.getString("plan_code");
	    String plan_state = params.getString("plan_state");
	    Timestamp plan_updated_at = (Timestamp) params.get("plan_updated_at"); // Timestamp로 가져오기

	    params.put("plan_code", plan_code);
	    params.put("plan_state", plan_state);
	    params.put("plan_updated_at", plan_updated_at); // Timestamp를 그대로 저장
	    cmmnDao.update("kcg.team3.updatedPlan", params);

	    return new CmmnMap().put("plan_code", params.getString("plan_code"));
	}

}
