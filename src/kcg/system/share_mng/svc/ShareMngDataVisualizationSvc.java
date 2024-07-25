package kcg.system.share_mng.svc;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
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
public class ShareMngDataVisualizationSvc {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CmmnDao cmmnDao;
	
	@Autowired
	CommonSvc commonSvc;
	
	/** 
	* 데이터 시각화 목록 조회
	* @methodName : getList 
	* @author : Irury Kang 
	* */	
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> rslt = cmmnDao.selectListPage("share.mng.data.visualization.getList", params, pagingConfig);
		return rslt;
	}

	/** 
	* 데이터 시각화 상세정보 조회
	* @methodName : getInfo 
	* @author : Irury Kang 
	 * @throws UnsupportedEncodingException 
	* */	
	public CmmnMap getInfo(CmmnMap params) throws UnsupportedEncodingException {
		CmmnMap info = cmmnDao.selectOne("share.mng.data.visualization.getInfo", params);
		if(info != null) {
			info.put("ctnt", StringUtil.simpleDecodeXSS(info.getString("ctnt","")));
			
			String tableau_url = URLDecoder.decode(info.getString("tableau_url",""), "UTF-8");
			
			info.put("tableau_url", tableau_url);
		}
		
		return info;
	}

	/** 
	* 데이터 시각화 저장
	* @methodName : save 
	* @author : Irury Kang 
	 * @param  
	* */	
	public CmmnMap save(MultipartFileList fileList, CmmnMap params) {
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());
		
		String save_mode = params.getString("save_mode");
		
		String uploadRelativePath = StringUtil.join("/shareDataVisualization/", CmmnUtil.getTodayString().substring(0,6), '/');
		
		List<String> fileMappingInfo = (List) params.get("fileMappingInfo");
		for (int i = 0; i < fileList.size(); i++) {
			CmmnMap fileInfo = commonSvc.uploadFile(fileList.get(i), uploadRelativePath);
			String stor_file_nm = fileInfo.getString("stor_file_nm");
			params.put(fileMappingInfo.get(i), stor_file_nm);
		}

		if("insert".equals(save_mode)) {
			String idx = UuidUtil.getUuidOnlyString();
			params.put("idx", idx);
			
			cmmnDao.insert("share.mng.data.visualization.insertInfo", params);
		} else {
			cmmnDao.update("share.mng.data.visualization.updateInfo", params);
		}
		
		return new CmmnMap().put("idx", params.getString("idx"));
	}

	/** 
	* 데이터 시각화 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */	
	public void delete(CmmnMap params) {
		cmmnDao.delete("share.mng.data.visualization.deleteInfo", params);
	}
}
