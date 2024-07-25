package kcg.system.prod_mng.svc;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.dao.CmmnDao;
import common.utils.common.CmmnMap;
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import kcg.common.svc.CommonSvc;
import kcg.login.vo.UserInfoVO;

@Service
public class ProdMngSvc {

	@SuppressWarnings("unused")
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	HttpServletRequest request;

	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	public List<CmmnMap> getList(CmmnMap params) {
		List<CmmnMap> rslt = cmmnDao.selectList("system.prod_mng.getList", params);
		return rslt;
	}

	public PageList<CmmnMap> getListPaging(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("system.prod_mng.getList", params, pagingConfig);
		return rslt;
	}

	public CmmnMap getInfo(CmmnMap params) {

		CmmnMap rsltInfo = cmmnDao.selectOne("system.prod_mng.getList", params);
		List<CmmnMap> rsltHist = cmmnDao.selectList("system.prod_mng.getHist", params);
		String strHist = "";
		for (CmmnMap map : rsltHist) {
			strHist = strHist + map.getString("prod_air_bgng_ymd") + " ~ " + map.getString("prod_air_end_ymd")
					+ "   (최저)" + map.get("prod_air_min") + "% (최고)" + map.get("prod_air_max") + "%\n";
		}
		rsltInfo.put("prod_hist", strHist);

		return rsltInfo;
	}

//	public void getProdCalcList(CmmnMap params) {
//		cmmnDao.selectOne("system.prod_mng.ProdCalc", params);
//	}

	public CmmnMap save(CmmnMap params) {
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());

		if ("insert".equals(params.getString("save_mode"))) {
			cmmnDao.insert("system.prod_mng.insertInfo", params);
		} else {
			cmmnDao.update("system.prod_mng.updateInfo", params);
		}

		cmmnDao.insert("system.prod_mng.insertHist", params);

		return new CmmnMap().put("prod_cd", params.getString("prod_cd"));
	}

	public void delete(CmmnMap params) {
		cmmnDao.delete("system.prod_mng.deleteInfo", params);
	}

	public List<CmmnMap> getCustList(CmmnMap params) {
		List<CmmnMap> rslt = cmmnDao.selectList("system.cust_mng.getList", params);
		return rslt;
	}
}
