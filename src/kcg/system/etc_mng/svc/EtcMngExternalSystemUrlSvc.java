package kcg.system.etc_mng.svc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.dao.CmmnDao;
import common.utils.common.CmmnMap;
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import common.utils.uuid.UuidUtil;
import kcg.common.svc.CommonSvc;
import kcg.login.vo.UserInfoVO;

@Service
public class EtcMngExternalSystemUrlSvc {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CmmnDao cmmnDao;
	
	@Autowired
	CommonSvc commonSvc;
	
	/** 
	* 외부시스템 URL 관리 목록 조회
	* @methodName : getList 
	* @author : Irury Kang 
	* */	
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("etc.mng.external.system.url.getList", params, pagingConfig);
		return rslt;
	}

	/** 
	* 외부시스템 URL 관리 상세정보 조회
	* @methodName : getInfo 
	* @author : Irury Kang 
	* */	
	public CmmnMap getInfo(CmmnMap params) {
		CmmnMap info = cmmnDao.selectOne("etc.mng.external.system.url.getInfo", params);
		return info;
	}

	/** 
	* 외부시스템 URL 관리 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */	
	public CmmnMap save(CmmnMap params) {
		
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		
		String user_id = userInfoVO.getUserId();
		params.put("user_id", user_id);
		
		String save_mode = params.getString("save_mode");

		if("insert".equals(save_mode)) {
			String idx = UuidUtil.getUuidOnlyString();
			params.put("idx", idx);
			
			cmmnDao.insert("etc.mng.external.system.url.insertInfo", params);
		} else {
			cmmnDao.update("etc.mng.external.system.url.updateInfo", params);
		}
		
		return new CmmnMap().put("idx", params.getString("idx"));
	}

	/** 
	* 외부시스템 URL 관리 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */	
	public void delete(CmmnMap params) {
		cmmnDao.delete("etc.mng.external.system.url.deleteInfo", params);
	}

	/** 
	* 
	* @methodName : chkDpl 
	* @author : Irury Kang 
	* */
	
	public CmmnMap chkDpl(CmmnMap params) {
		CmmnMap info = cmmnDao.selectOne("etc.mng.external.system.url.chkDpl", params);
		
		return info;
	}
}
