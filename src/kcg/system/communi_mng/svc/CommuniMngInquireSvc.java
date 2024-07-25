package kcg.system.communi_mng.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.dao.CmmnDao;
import common.utils.common.CmmnMap;
import common.utils.common.CmmnUtil;
import common.utils.common.MultipartFileList;
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import common.utils.string.StringUtil;
import common.utils.uuid.UuidUtil;
import kcg.common.svc.CommonSvc;
import kcg.login.vo.UserInfoVO;

@Service
public class CommuniMngInquireSvc {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CmmnDao cmmnDao;
	
	@Autowired
	CommonSvc commonSvc;
	
	/** 
	* 문의하기 목록 조회
	* @methodName : getList 
	* @author : Irury Kang 
	* */	
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("communi.mng.inquire.getList", params, pagingConfig);
		return rslt;
	}

	/** 
	* 문의하기 상세정보 조회
	* @methodName : getInfo 
	* @author : Irury Kang 
	* */	
	public CmmnMap getInfo(CmmnMap params) {
		CmmnMap info = cmmnDao.selectOne("communi.mng.inquire.getInfo", params);
		if(info != null) {
			info.put("ctnt", StringUtil.simpleDecodeXSS(info.getString("ctnt","")));
		}
		
		return info;
	}

	/** 
	* 문의하기 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */	
	public CmmnMap save(MultipartFileList fileList,CmmnMap params) {
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());
		
		String save_mode = params.getString("save_mode");
		
		String uploadRelativePath = StringUtil.join("/communiInquire/", CmmnUtil.getTodayString().substring(0,6), '/');
		
		List<String> fileMappingInfo = (List) params.get("fileMappingInfo");
		for (int i = 0; i < fileList.size(); i++) {
			CmmnMap fileInfo = commonSvc.uploadFile(fileList.get(i), uploadRelativePath);
			String stor_file_nm = fileInfo.getString("stor_file_nm");
			params.put(fileMappingInfo.get(i), stor_file_nm);
		}
		
		// 답변이 존재할 경우 문의하기상태는 '답변' 아니면 '문의'
		String repl = params.getString("repl", "");
		if(StringUtil.isEmpty(repl.trim())) {
			params.put("ask_sts", "1");
		} else {
			params.put("ask_sts", "2");
		}
		
		if("insert".equals(save_mode)) {
			String idx = UuidUtil.getUuidOnlyString();
			params.put("idx", idx);
			
			cmmnDao.insert("communi.mng.inquire.insertInfo", params);
		} else {
			cmmnDao.update("communi.mng.inquire.updateInfo", params);
		}
		
		return new CmmnMap().put("idx", params.getString("idx"));
	}

	/** 
	* 문의하기 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */	
	public void delete(CmmnMap params) {
		cmmnDao.delete("communi.mng.inquire.deleteInfo", params);
	}
}
