package kcg.team3.service;

import java.util.List;

import javax.jdo.annotations.Transactional;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.dao.CmmnDao;
import common.utils.common.CmmnMap;
import kcg.common.svc.CommonSvc;

@Service
public class ProdThService {

	@Autowired
	HttpServletRequest request;

	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	// 상품 목록 리스트 가져오기
	public List<CmmnMap> getList(CmmnMap params) {
		List<CmmnMap> rslt = cmmnDao.selectList("kcg.team3.getList", params);
		return rslt;
	}

	// 상품 정보 업데이트 및 추가
	@Transactional
	public CmmnMap save(CmmnMap params) {
		String prod_code = getString(params, "prod_code");
		String prod_name = getString(params, "prod_name");
		String prod_type = getString(params, "prod_type");
		String prod_subscrip_type = getString(params, "prod_subscrip_type");
		String prod_min_amt = getStringFromNumber(params, "prod_min_amt");
		String prod_max_amt = getStringFromNumber(params, "prod_max_amt");
		String prod_pay_cy = getString(params, "prod_pay_cy");
		String prod_air = getString(params, "prod_air");
		String prod_tax_type = getString(params, "prod_tax_type");
		String prod_sales_state = getString(params, "prod_sales_state");

		params.put("prod_name", prod_name);
		params.put("prod_type", prod_type);
		params.put("prod_subscrip_type", prod_subscrip_type);
		params.put("prod_min_amt", prod_min_amt);
		params.put("prod_max_amt", prod_max_amt);
		params.put("prod_pay_cy", prod_pay_cy);
		params.put("prod_air", prod_air);
		params.put("prod_tax_type", prod_tax_type);
		params.put("prod_sales_state", prod_sales_state);
		params.put("prod_code", prod_code);
		System.out.println(prod_name + prod_type + prod_min_amt);

		if ("insert".equals(getString(params, "save_mode"))) {
			cmmnDao.insert("kcg.team3.insertProdInfo", params);
		} else {
			cmmnDao.update("kcg.team3.updateProdInfo", params);
		}

		return new CmmnMap().put("prod_code", getString(params, "prod_code"));
	}

	/* cast 에러 해결 코드 */
	private String getString(CmmnMap map, String key) {
		Object value = map.get(key);
		return (value != null) ? String.valueOf(value) : null;
	}

	/* cast 에러 해결 코드 */
	private String getStringFromNumber(CmmnMap map, String key) {
		Object value = map.get(key);
		if (value instanceof Number) {
			return String.valueOf(value);
		} else if (value instanceof String) {
			return (String) value;
		}
		return null;
	}

	public CmmnMap getInfo(CmmnMap params) {
		return cmmnDao.selectOne("kcg.team3.getList", params);
	}

	// 공지사항 리스트 가져오기(페이징)
	public List<CmmnMap> getProdListWithPaging(CmmnMap params) {
		List<CmmnMap> prodList = cmmnDao.selectList("kcg.team3.getProdListWithPaging", params);
		return prodList;
	}

	// 공지사항 갯수 가져오기
	public int getTotalProdCount() {
		List<CmmnMap> prodList = cmmnDao.selectList("kcg.team3.getList");
		int count = 0;

		for (CmmnMap prod : prodList) {
			count++;
		}
		return count;
	}

	// 메인용 공지사항 3개
	public List<CmmnMap> getProdForMain() {
		return cmmnDao.selectList("kcg.team3.getProdForMainLimit3");
	}

	// 필터링된 상품 갯수 가져오기
	public int getFilteredProdCount(CmmnMap params) {
		return cmmnDao.selectOne("kcg.team3.getFilteredProdCount", params);
	}

// 필터링 상품리스트 가져오기 (페이징)240719
	public List<CmmnMap> getProdListWithFilterAndPaging(CmmnMap params) {
		List<CmmnMap> prodList = cmmnDao.selectList("kcg.team3.getProdListWithFilterAndPaging", params);
		return prodList;
	}

	// 상품 코드로 이름 가져오기
	public CmmnMap getProductNameByProdCode(CmmnMap params, int prodCode) {
		params.put("prod_code", prodCode);

		CmmnMap cmmnMap = cmmnDao.selectOne("kcg.team3.getProductNameByProdCodeOne", params);
		return cmmnMap;
	}

	// 상품 이름으로 상품코드 가져오기
	public CmmnMap getProductByName(CmmnMap params) {

		return cmmnDao.selectOne("kcg.team3.getProductByName", params);
	}

}