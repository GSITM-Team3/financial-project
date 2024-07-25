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
import common.utils.crypt.CryptUtil;
import common.utils.mybatis_paginator.domain.PageList;
import common.utils.string.StringUtil;
import common.utils.uuid.UuidUtil;
import kcg.common.svc.CommonSvc;
import kcg.login.vo.UserInfoVO;

@Service
public class AdminAuthMngSvc {
	
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	HttpServletRequest request;
	
	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		return cmmnDao.selectListPage("system.admin_auth_mng.getList", params, pagingConfig);
	}

	public CmmnMap getInfo(CmmnMap params) {
		CmmnMap rslt;
		String auth_nm = params.getString("auth_nm");
		if(StringUtil.isEmpty(auth_nm)) {
			rslt = new CmmnMap()
					.put("save_mode", "insert")
					.put("user_pw", "")
					.put("user_pw_confirm", "")
					.put("auth_nm", "");
		} else {
			rslt = cmmnDao.selectOne("system.admin_auth_mng.getInfo", params);
			rslt.put("save_mode", "update");
		}
		
		List<CmmnMap> authMenuMappingList = cmmnDao.selectList("system.admin_auth_mng.getAuthMenuMappingList", params);
		rslt.put("authMenuMappingList", authMenuMappingList);
		return rslt;
	}

	public CmmnMap save(CmmnMap params) {

		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		String user_id = userInfoVO.getUserId();
		params.put("user_id", user_id);
		
		String save_mode = params.getString("save_mode");
		
		if("insert".equals(save_mode)) {
			String user_pw = params.getString("user_pw");
			params.put("user_pw", CryptUtil.hashSHA512HexString(user_pw));
			cmmnDao.insert("system.admin_auth_mng.insertInfo_user", params);
			cmmnDao.insert("system.admin_auth_mng.insertInfo_auth", params);
		}
		
		List<CmmnMap> authMenuMappingList = params.getCmmnMapList("authMenuMappingList");
		cmmnDao.delete("system.admin_auth_mng.deleteAuthMenuMappingInfo", params);
		String auth_nm = params.getString("auth_nm");
		for(CmmnMap map : authMenuMappingList) {
			map.put("auth_nm", auth_nm);
			cmmnDao.insert("system.admin_auth_mng.insertAuthMenuMappingInfo", map);
		}
		
		return params;
	}

	public void delete(CmmnMap params) {
		cmmnDao.delete("system.admin_auth_mng.deleteAuthMenuMappingInfo", params);
		cmmnDao.update("system.admin_auth_mng.delete_user", params);
		cmmnDao.delete("system.admin_auth_mng.delete_auth", params);
	}

	public CmmnMap chkExist(CmmnMap params) {
		return cmmnDao.selectOne("system.admin_auth_mng.chkExist", params);
	}

	public CmmnMap initPw(CmmnMap params) {
		String user_pw = params.getString("user_pw");
		params.put("user_pw", CryptUtil.hashSHA512HexString(user_pw));
		
		cmmnDao.update("system.admin_auth_mng.initPw", params);
		
		return new CmmnMap().put("rslt", "SUCC");
	}
}
