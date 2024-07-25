package kcg.system.user_auth_mng.svc;

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
import common.utils.string.StringUtil;
import common.utils.uuid.UuidUtil;
import kcg.common.svc.CommonSvc;
import kcg.login.vo.UserInfoVO;

@Service
public class PortalAuthMngSvc {
	
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	HttpServletRequest request;
	
	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		return cmmnDao.selectListPage("system.portal_auth_mng.getList", params, pagingConfig);
	}

	public CmmnMap getInfo(CmmnMap params) {
		CmmnMap rslt;
		String auth_cd = params.getString("auth_cd");
		if(StringUtil.isEmpty(auth_cd)) {
			rslt = new CmmnMap()
					.put("save_mode", "insert")
					.put("auth_cd", auth_cd)
					.put("auth_nm", "");
		} else {
			rslt = cmmnDao.selectOne("system.portal_auth_mng.getInfo", params);
			rslt.put("save_mode", "update");
		}
		
		List<CmmnMap> authMenuMappingList = cmmnDao.selectList("system.portal_auth_mng.getAuthMenuMappingList", params);
		rslt.put("authMenuMappingList", authMenuMappingList);
		return rslt;
	}

	public CmmnMap save(CmmnMap params) {

		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		String user_id = userInfoVO.getUserId();
		params.put("user_id", user_id);
		
		String save_mode = params.getString("save_mode");
		
		if("insert".equals(save_mode)) {
			params.put("auth_cd", UuidUtil.getUuidOnlyString());
			cmmnDao.insert("system.portal_auth_mng.insertInfo", params);
		} else {
			cmmnDao.update("system.portal_auth_mng.updateInfo", params);
		}
		
		List<CmmnMap> authMenuMappingList = params.getCmmnMapList("authMenuMappingList");
		cmmnDao.delete("system.portal_auth_mng.deleteAuthMenuMappingInfo", params);
		String auth_cd = params.getString("auth_cd");
		for(CmmnMap map : authMenuMappingList) {
			map.put("auth_cd", auth_cd);
			cmmnDao.insert("system.portal_auth_mng.insertAuthMenuMappingInfo", map);
		}
		
		return params;
	}

	public void delete(CmmnMap params) {
		cmmnDao.delete("system.portal_auth_mng.deleteAuthMenuMappingInfo", params);
		cmmnDao.delete("system.portal_auth_mng.delete", params);
	}

	public CmmnMap chkExist(CmmnMap params) {
		return cmmnDao.selectOne("system.portal_auth_mng.chkExist", params);
	}
}
