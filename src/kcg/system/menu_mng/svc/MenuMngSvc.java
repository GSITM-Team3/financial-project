package kcg.system.menu_mng.svc;

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
public class MenuMngSvc {
	
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	HttpServletRequest request;
	
	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("system.menu_mng.getList", params, pagingConfig);
		return rslt;
	}

	public CmmnMap getInfo(CmmnMap params) {
		return cmmnDao.selectOne("system.menu_mng.getInfo", params);
	}

	public CmmnMap chkExist(CmmnMap params) {
		return cmmnDao.selectOne("system.menu_mng.chkExist", params);
	}

	public CmmnMap save(CmmnMap params) {
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		
		String user_id = userInfoVO.getUserId();
		params.put("user_id", user_id);
		
		String save_mode = params.getString("save_mode");
		
		if("insert".equals(save_mode)) {
			cmmnDao.insert("system.menu_mng.insertInfo", params);
		} else {
			cmmnDao.update("system.menu_mng.updateInfo", params);
		}
		return new CmmnMap().put("menu_url", params.getString("menu_url"));
	}

	public void delete(CmmnMap params) {
		cmmnDao.delete("system.menu_mng.delete", params);
		cmmnDao.delete("system.menu_mng.deleteAuthMapping", params);
	}

}
