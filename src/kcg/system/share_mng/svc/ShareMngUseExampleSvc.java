package kcg.system.share_mng.svc;

import java.util.ArrayList;
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
import common.utils.crypt.CryptUtil;
import common.utils.mybatis_paginator.domain.PageList;
import common.utils.string.StringUtil;
import common.utils.uuid.UuidUtil;
import kcg.common.svc.CommonSvc;
import kcg.login.vo.UserInfoVO;

@Service
public class ShareMngUseExampleSvc {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CmmnDao cmmnDao;
	
	@Autowired
	CommonSvc commonSvc;
	
	private String useTgtStr = "\\|";
	
	/** 
	* 활용 사례 목록 조회
	* @methodName : getList 
	* @author : Irury Kang 
	* */	
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("share.mng.use.example.getList", params, pagingConfig);
		return rslt;
	}

	/** 
	* 활용 사례 상세정보 조회
	* @methodName : getInfo 
	* @author : Irury Kang 
	* */	
	public CmmnMap getInfo(CmmnMap params) {
		CmmnMap info = cmmnDao.selectOne("share.mng.use.example.getInfo", params);
		if(info != null) {
			info.put("ctnt", StringUtil.simpleDecodeXSS(info.getString("ctnt","")));
		}
		
		return info;
	}

	/** 
	* 활용 사례 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */	
	public CmmnMap save(MultipartFileList fileList, CmmnMap params) {
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());
		
		String save_mode = params.getString("save_mode");
		
		String uploadRelativePath = StringUtil.join("/shareUseExample/", CmmnUtil.getTodayString().substring(0,6), '/');
		
		List<String> fileMappingInfo = (List) params.get("fileMappingInfo");
		for (int i = 0; i < fileList.size(); i++) {
			CmmnMap fileInfo = commonSvc.uploadFile(fileList.get(i), uploadRelativePath);
			String stor_file_nm = fileInfo.getString("stor_file_nm");
			params.put(fileMappingInfo.get(i), stor_file_nm);
		}
		if("insert".equals(save_mode)) {
			String idx = UuidUtil.getUuidOnlyString();
			params.put("idx", idx);
			
			cmmnDao.insert("share.mng.use.example.insertInfo", params);
		} else {
			cmmnDao.update("share.mng.use.example.updateInfo", params);
		}
		
		return new CmmnMap().put("idx", params.getString("idx"));
	}

	/** 
	* 활용 사례 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */	
	public void delete(CmmnMap params) {
		cmmnDao.delete("share.mng.use.example.deleteInfo", params);
	}

	/** 
	* 활용데이터 내부데이터 목록 조회
	* @methodName : getInUseDataList 
	* @author : Irury Kang 
	 * @param pagingConfig 
	* */
	public PageList<CmmnMap> getInUseDataList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("share.mng.use.example.getInUseDataList", params, pagingConfig);
		return rslt;
	}

	/** 
	* 활용데이터 외부데이터 목록 조회
	* @methodName : getExtUseDataList 
	* @author : Irury Kang 
	 * @param pagingConfig 
	* */
	public PageList<CmmnMap> getExtUseDataList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("share.mng.use.example.getExtUseDataList", params, pagingConfig);
		return rslt;
	}
}
