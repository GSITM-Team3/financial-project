package kcg.system.user_auth_mng.svc;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.dao.CmmnDao;
import common.dao.IamDao;
import common.utils.common.CmmnMap;
import common.utils.common.PagingConfig;
import common.utils.crypt.CryptUtil;
import common.utils.mybatis_paginator.domain.PageList;
import kcg.common.svc.CommonSvc;
import kcg.login.vo.UserInfoVO;

@Service
public class UserMngSvc {
	
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	HttpServletRequest request;
	
	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;
	
	@Autowired
	IamDao iamDao;

	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		return cmmnDao.selectListPage("system.user_mng.getList", params, pagingConfig);
	}

	public CmmnMap getInfo(CmmnMap params) {
		CmmnMap rslt = cmmnDao.selectOne("system.user_mng.getInfo", params);
		List<CmmnMap> userSystemMappingList = cmmnDao.selectList("system.user_mng.getUserSystemMappingList", params);
		rslt.put("userSystemMappingList", userSystemMappingList);
		
		return rslt;
	}

	public CmmnMap chkExist(CmmnMap params) {
		
		CmmnMap rslt = cmmnDao.selectOne("system.user_mng.chkExist", params);
		if(rslt.getInt("cnt") > 0) {
			return rslt;
		} 
		else {
			return rslt;
//			return iamDao.selectOne("system.user_mng.chkExistFromIam", params);
		}
	}

	public CmmnMap save(CmmnMap params) {
		
		String save_mode = params.getString("save_mode");
		String auth_cd = params.getString("auth_cd");
		String user_id = params.getString("user_id");
		
		if("insert".equals(save_mode)) {
			String user_pw = params.getString("user_pw");
			params.put("user_pw", CryptUtil.hashSHA512HexString(user_pw));
			
			cmmnDao.insert("system.user_mng.insertInfo", params);
		} else {
			cmmnDao.update("system.user_mng.updateInfo", params);
		}
		
		// 관리시스템을 리셋.
		cmmnDao.delete("system.user_mng.deleteUserSystemMappingList", params);
		
		// 일반사용자가 아닐경우만 관리시스템을 입력한다.
		if(!"normal".equals(auth_cd)) {
			List<CmmnMap> userSystemMappingList = params.getCmmnMapList("userSystemMappingList");
			for(CmmnMap map : userSystemMappingList) {
				map.put("user_id", user_id);
				cmmnDao.insert("system.user_mng.insertSystemMapping", map);
			}
		}
		return new CmmnMap().put("user_id", params.getString("user_id"));
	}

	public void delete(CmmnMap params) {
		cmmnDao.delete("system.user_mng.deleteUserSystemMappingList", params);
		cmmnDao.update("system.user_mng.delete", params);
	}

	public CmmnMap initPw(CmmnMap params) {
		String user_pw = params.getString("user_pw");
		params.put("user_pw", CryptUtil.hashSHA512HexString(user_pw));
		
		cmmnDao.update("system.user_mng.initPw", params);
		
		return new CmmnMap().put("rslt", "SUCC");
	}

	public List<CmmnMap> getAuthList() {
		return cmmnDao.selectList("system.user_mng.getAuthList");
	}

	public PageList<CmmnMap> getInternalSystemList(CmmnMap params, PagingConfig pagingConfig) {
		return cmmnDao.selectListPage("system.user_mng.getInternalSystemList", params, pagingConfig);
	}

	public List<CmmnMap> excelDn(CmmnMap params) {
		return cmmnDao.selectList("system.user_mng.getList", params);
	}

}
