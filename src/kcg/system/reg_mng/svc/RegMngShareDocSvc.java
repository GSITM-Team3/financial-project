package kcg.system.reg_mng.svc;

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
public class RegMngShareDocSvc {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("reg.mng.share.doc.getList", params, pagingConfig);
		return rslt;
	}

	public CmmnMap getInfo(CmmnMap params) {
		CmmnMap info = cmmnDao.selectOne("reg.mng.share.doc.getInfo", params);
		return info;
	}

	public CmmnMap save(CmmnMap params) {
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());
		cmmnDao.update("reg.mng.share.doc.updateInfo", params);
		cmmnDao.update("reg.mng.share.doc.updateInfo2", params);
		return new CmmnMap().put("idx", params.getString("idx"));
	}

	public void delete(CmmnMap params) {
		cmmnDao.delete("reg.mng.share.doc.deleteInfo", params);
	}

}
