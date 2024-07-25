package kcg.system.req_mng.svc;

import java.util.List;

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
public class ReqMngDnldSvc {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CmmnDao cmmnDao;
	
	@Autowired
	CommonSvc commonSvc;
	
	/** 
	* 다운로드 신청 관리 목록 조회
	* @methodName : getList 
	* @author : Irury Kang 
	* */	
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("req.mng.dnld.getList", params, pagingConfig);
		return rslt;
	}

	/** 
	* 다운로드 신청 관리 상세정보 조회
	* @methodName : getInfo 
	* @author : Irury Kang 
	* */	
	public CmmnMap getInfo(CmmnMap params) {
		CmmnMap info = cmmnDao.selectOne("req.mng.dnld.getInfo", params);
		return info;
	}

	/** 
	* 다운로드 신청 관리 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */	
	public CmmnMap save(CmmnMap params) {
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());
		
		cmmnDao.update("req.mng.dnld.updateInfo", params);
		if("1".equals(params.getString("req_sts"))) {
			commonSvc.deleteNotiInfo(params.getString("idx"));
		} else {
			commonSvc.insertNotiInfo(params.getString("idx"), "download", params.getString("reg_user_id"));
		}
		
		return new CmmnMap().put("idx", params.getString("idx"));
	}

	/** 
	* 다운로드신청 관리 상태 일괄변경
	* @methodName : updtStatus 
	* @author : Irury Kang 
	* */
	public CmmnMap updtStatus(CmmnMap params) {
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		
		List<CmmnMap> targetArr = params.getCmmnMapList("targetArr");
		String req_sts = params.getString("req_sts");
		
		for(CmmnMap map : targetArr){
			map.put("req_sts", req_sts);
			map.put("user_id", userInfoVO.getUserId());
			cmmnDao.update("req.mng.dnld.updtStatus", map);
			if("1".equals(req_sts)) {
				commonSvc.deleteNotiInfo(map.getString("idx"));
			} else {
				commonSvc.insertNotiInfo(map.getString("idx"), "download", map.getString("reg_user_id"));
			}
		}
		return new CmmnMap().put("status", "OK");
	}
	
	/** 
	* 다운로드 신청 관리 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */	
	public void delete(CmmnMap params) {
		cmmnDao.delete("req.mng.dnld.deleteInfo", params);
	}

	/** 
	* 신청 데이터 정보 조회
	* @methodName : getReqDataInfo 
	* @author : Irury Kang 
	* */
	public PageList<CmmnMap> getReqDataInfo(CmmnMap params,PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("req.mng.dnld.getReqDataInfo", params, pagingConfig);
		return rslt;
		
	}

	
}
