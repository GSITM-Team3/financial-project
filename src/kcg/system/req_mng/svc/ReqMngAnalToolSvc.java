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
public class ReqMngAnalToolSvc {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;
	/** 
	* 분석 도구 신청 관리관리 목록 조회
	* @methodName : getList 
	* @author : Irury Kang 
	* */	
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("req.mng.anal.tool.getList", params, pagingConfig);
		return rslt;
	}

	/** 
	* 분석 도구 신청 관리관리 상세정보 조회
	* @methodName : getInfo 
	* @author : Irury Kang 
	* */	
	public CmmnMap getInfo(CmmnMap params) {
		CmmnMap info = cmmnDao.selectOne("req.mng.anal.tool.getInfo", params);
		return info;
	}

	/** 
	* 분석 도구 신청 관리관리 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */	
	public CmmnMap save(CmmnMap params) {
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());
		
		
		
		String idx = params.getString("idx");
		List<CmmnMap> toolInfoList = params.getCmmnMapList("toolInfoList");
		for (int i = 0; i < toolInfoList.size(); i++) {
			CmmnMap toolInfo = toolInfoList.get(i);
			cmmnDao.update("req.mng.anal.tool.updateToolInfo", toolInfo);
		}
		cmmnDao.update("req.mng.anal.tool.updateInfo", params);
		
		if("1".equals(params.getString("req_sts"))) {
			commonSvc.deleteNotiInfo(idx);
		} else {
			commonSvc.insertNotiInfo(idx, "anal_tool", params.getString("reg_user_id"));
		}
		
		return new CmmnMap().put("idx", params.getString("idx"));
	}

	/** 
	* 분석 도구 신청 관리관리 상태 일괄변경
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
			cmmnDao.update("req.mng.anal.tool.updtStatus", map);
			if("1".equals(req_sts)) {
				commonSvc.deleteNotiInfo(map.getString("idx"));
			} else {
				commonSvc.insertNotiInfo(map.getString("idx"), "anal_tool", map.getString("reg_user_id"));
			}
		}
		return new CmmnMap().put("status", "OK");
	}
	
	/** 
	* 분석 도구 신청 관리관리 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */	
	public void delete(CmmnMap params) {
		cmmnDao.delete("req.mng.anal.tool.deleteInfo", params);
	}

	/** 
	* 도구접속정보
	* @methodName : getToolInfoList 
	* @author : Irury Kang 
	* */
	public List<CmmnMap> getToolInfoList() {
		return cmmnDao.selectList("req.mng.anal.tool.getToolInfoList");
	}
}
