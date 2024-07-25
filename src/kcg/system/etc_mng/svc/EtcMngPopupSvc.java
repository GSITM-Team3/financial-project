package kcg.system.etc_mng.svc;

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
public class EtcMngPopupSvc {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CmmnDao cmmnDao;
	
	@Autowired
	CommonSvc commonSvc;
	
	/** 
	* 팝업 관리 목록 조회
	* @methodName : getList 
	* @author : Irury Kang 
	* */	
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("etc.mng.popup.getList", params, pagingConfig);
		return rslt;
	}

	/** 
	* 팝업 관리 상세정보 조회
	* @methodName : getInfo 
	* @author : Irury Kang 
	* */	
	public CmmnMap getInfo(CmmnMap params) {
		CmmnMap info = cmmnDao.selectOne("etc.mng.popup.getInfo", params);
		if(info != null) {
			info.put("ctnt", StringUtil.simpleDecodeXSS(info.getString("pup_ctnt","")));
		}
		return info;
	}

	/** 
	* 팝업 관리 저장
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
			
			cmmnDao.insert("etc.mng.popup.insertInfo", params);
		} else {
			cmmnDao.update("etc.mng.popup.updateInfo", params);
		}
		
		return new CmmnMap().put("idx", params.getString("idx"));
	}

	/** 
	* 팝업 관리 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */	
	public void delete(CmmnMap params) {
		cmmnDao.delete("etc.mng.popup.deleteInfo", params);
	}

}
