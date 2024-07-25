package kcg.system.promion_mng.svc;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.dao.CmmnDao;
import common.utils.common.CmmnMap;
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import common.utils.string.StringUtil;
import kcg.common.svc.CommonSvc;
import kcg.login.vo.UserInfoVO;

@Service
public class PromionMngSvc {
	
	@SuppressWarnings("unused")
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	HttpServletRequest request;
	
	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	public PageList<CmmnMap> getListPaging(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("system.promion_mng.getList", params, pagingConfig);
		return rslt;
	}
	
	public CmmnMap getDsgInfo(CmmnMap params) {
		CmmnMap rsltMap = new CmmnMap();
		if("1".equals(params.getString("prod_ty_cd"))) {
			rsltMap = cmmnDao.selectOne("system.promion_mng.getDsgnSavgpl", params);
		}else if("2".equals(params.getString("prod_ty_cd"))) {
			rsltMap = cmmnDao.selectOne("system.promion_mng.getDsgnAcmlpl", params);
		}else if("3".equals(params.getString("prod_ty_cd"))) {
			rsltMap = cmmnDao.selectOne("system.promion_mng.getDsgnDpstpl", params);
		}else if("4".equals(params.getString("prod_ty_cd"))) {
			rsltMap = cmmnDao.selectOne("system.promion_mng.getDsgnLoanpl", params);
		}
		return rsltMap;
	}
	
	public CmmnMap getProdInfo(CmmnMap params) {
		return cmmnDao.selectOne("system.promion_mng.getProdInfo", params);
	}

	public void save(CmmnMap params) {
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());
		
		if(StringUtil.isEmpty(params.getString("prod_ds_sn"))) {
			if("1".equals(params.getString("prod_ty_cd"))) {
				cmmnDao.insert("system.promion_mng.insertDsgnSavgpl", params);
			}else if("2".equals(params.getString("prod_ty_cd"))) {
				cmmnDao.insert("system.promion_mng.insertDsgnAcmlpl", params);
			}else if("3".equals(params.getString("prod_ty_cd"))) {
				cmmnDao.insert("system.promion_mng.insertDsgnDpstpl", params);
			}else if("4".equals(params.getString("prod_ty_cd"))) {
				cmmnDao.insert("system.promion_mng.insertDsgnLoanpl", params);
			}
		} else {
			if("1".equals(params.getString("prod_ty_cd"))) {
				cmmnDao.update("system.promion_mng.updateDsgnSavgpl", params);
			}else if("2".equals(params.getString("prod_ty_cd"))) {
				cmmnDao.update("system.promion_mng.updateDsgnAcmlpl", params);
			}else if("3".equals(params.getString("prod_ty_cd"))) {
				cmmnDao.update("system.promion_mng.updateDsgnDpstpl", params);
			}else if("4".equals(params.getString("prod_ty_cd"))) {
				cmmnDao.update("system.promion_mng.updateDsgnLoanpl", params);
			}
		}
	}
}
