package kcg.system.cust_mng.svc;

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
public class CustMngSvc {
	
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
		return cmmnDao.selectListPage("system.cust_mng.getList", params, pagingConfig);
	}
	
	public PageList<CmmnMap> getListAll(CmmnMap params, PagingConfig pagingConfig) {
		return cmmnDao.selectListPage("system.cust_mng.getListAll", params, pagingConfig);
	}
	
	public CmmnMap getInfo(CmmnMap params) {
		CmmnMap rslt = cmmnDao.selectOne("system.cust_mng.getInfo", params);
		
		return rslt;
	}
	
	public PageList<CmmnMap> getCustInfoList(CmmnMap params, PagingConfig pagingConfig) {
		return cmmnDao.selectListPage("system.cust_mng.getCustInfoList", params, pagingConfig);
	}
	
	public PageList<CmmnMap> getCustInfoListAll(CmmnMap params, PagingConfig pagingConfig) {
		return cmmnDao.selectListPage("system.cust_mng.getCustInfoListAll", params, pagingConfig);
	}
	
	public CmmnMap getCustCardInfo(CmmnMap params) {
		CmmnMap rslt = cmmnDao.selectOne("system.cust_mng.getCustCardInfo", params);
		
		return rslt;
	}
	
	public CmmnMap getInitInfo(CmmnMap params) {
		CmmnMap rslt = cmmnDao.selectOne("system.cust_mng.getInitInfo", params);
		
		return rslt;
	}
	
	public CmmnMap getPicSelInfo(CmmnMap params) {
		CmmnMap rslt = cmmnDao.selectOne("system.cust_mng.getPicSelInfo", params);
		
		return rslt;
	}
	
	public List<CmmnMap> getPicInfo(CmmnMap params) {
		List<CmmnMap> dataList = cmmnDao.selectList("system.cust_mng.getPicInfo", params);
		
		return dataList;
	}
	
	public List<CmmnMap> getCustInfo(CmmnMap params) {
		List<CmmnMap> dataList = cmmnDao.selectList("system.cust_mng.getCustInfo", params);
		
		return dataList;
	}
	
	public CmmnMap getCustOne(CmmnMap params) {
		CmmnMap rslt = cmmnDao.selectOne("system.cust_mng.getCustOne", params);
		
		return rslt;
	}
	
	public CmmnMap updatePicRoof(CmmnMap params) {
		List<CmmnMap> dateCopyList = params.getCmmnMapList("dateCopyList");
		String pic_mbl_telno = params.getString("pic_mbl_telno");
		
		for (CmmnMap map : dateCopyList) {
			String cust_mbl_telno = map.getString("cust_mbl_telno");
			map.put("cust_mbl_telno", cust_mbl_telno);
			map.put("pic_mbl_telno", pic_mbl_telno);
			System.out.print("pic_mbl_telno==>" + pic_mbl_telno);
			System.out.print("cust_mbl_telno==>" + cust_mbl_telno);
			cmmnDao.update("system.cust_mng.updatePicRoof", map);
		}
		return new CmmnMap().put("status", "OK");
	}
	
	public CmmnMap updateStcdRoof(CmmnMap params) {
		List<CmmnMap> dateCopyList = params.getCmmnMapList("dateCopyList");
		
		for (CmmnMap map : dateCopyList) {
			String cust_mbl_telno = map.getString("cust_mbl_telno");
			map.put("cust_mbl_telno", cust_mbl_telno);
			System.out.print("cust_mbl_telno==>" + cust_mbl_telno);
			cmmnDao.update("system.cust_mng.updateStcdRoof", map);
		}
		return new CmmnMap().put("status", "OK");
	}
	
	public CmmnMap updateCust(CmmnMap params) {
		
		String cust_mbl_telno = params.getString("cust_mbl_telno");
		String cust_nm = params.getString("cust_nm");
		String wrt_dt = params.getString("wrt_dt");
		String rrno = params.getString("rrno");
		String cust_eml_addr = params.getString("cust_eml_addr");
		String co_telno = params.getString("co_telno");
		String occp_ty_cd = params.getString("occp_ty_cd");
		String cust_addr = params.getString("cust_addr");
		
		params.put("cust_mbl_telno", cust_mbl_telno);
		params.put("cust_nm", cust_nm);
		params.put("wrt_dt", wrt_dt);
		params.put("rrno", rrno);
		params.put("cust_eml_addr", cust_eml_addr);
		params.put("co_telno", co_telno);
		params.put("occp_ty_cd", occp_ty_cd);
		params.put("cust_addr", cust_addr);
		
		cmmnDao.update("system.cust_mng.updateCust", params);
		
		return new CmmnMap().put("status", "OK");
	}
	
    public CmmnMap updatePic(CmmnMap params) {
		
		String pic_mbl_telno = params.getString("pic_mbl_telno");
		String pic_nm = params.getString("pic_nm");
		String dept_nm = params.getString("dept_nm");
		String jbps_ty_cd = params.getString("jbps_ty_cd");
		String pic_eml_addr = params.getString("pic_eml_addr");
		String jncmp_ymd = params.getString("jncmp_ymd");
		String etc_tsk_cn = params.getString("etc_tsk_cn");
		
		params.put("pic_mbl_telno", pic_mbl_telno);
		params.put("pic_nm", pic_nm);
		params.put("dept_nm", dept_nm);
		params.put("jbps_ty_cd", jbps_ty_cd);
		params.put("pic_eml_addr", pic_eml_addr);
		params.put("jncmp_ymd", jncmp_ymd);
		params.put("etc_tsk_cn", etc_tsk_cn);
		
		cmmnDao.update("system.cust_mng.updatePic", params);
		
		return new CmmnMap().put("status", "OK");
	}
	
    public CmmnMap updatePicTelno(CmmnMap params) {
		
		String cust_mbl_telno = params.getString("cust_mbl_telno");
		String pic_mbl_telno = params.getString("pic_mbl_telno");
		
		params.put("cust_mbl_telno", cust_mbl_telno);
		params.put("pic_mbl_telno", pic_mbl_telno);
		
		cmmnDao.update("system.cust_mng.updatePicRoof", params);
		
		return new CmmnMap().put("status", "OK");
	}
	
	public CmmnMap getPicOne(CmmnMap params) {
		CmmnMap rslt = cmmnDao.selectOne("system.cust_mng.getPicOne", params);
		
		return rslt;
	}
	
    public CmmnMap updateCustStcd(CmmnMap params) {
		
		String cust_mbl_telno = params.getString("cust_mbl_telno");
		
		params.put("cust_mbl_telno", cust_mbl_telno);
		
		cmmnDao.update("system.cust_mng.updateCustStcd", params);
		
		return new CmmnMap().put("status", "OK");
	}
    
    public CmmnMap updatePicStcd(CmmnMap params) {
		
		String pic_mbl_telno = params.getString("pic_mbl_telno");
		
		params.put("pic_mbl_telno", pic_mbl_telno);
		
		cmmnDao.update("system.cust_mng.updatePicStcd", params);
		
		return new CmmnMap().put("status", "OK");
	}
    
    public CmmnMap updatePicRelStcd(CmmnMap params) {
		
		String cust_mbl_telno = params.getString("cust_mbl_telno");
		
		params.put("cust_mbl_telno", cust_mbl_telno);
		
		cmmnDao.update("system.cust_mng.updateStcdRoof", params);
		
		return new CmmnMap().put("status", "OK");
	}
    
    public CmmnMap insertCustInfo(CmmnMap params) {
		
		String cust_mbl_telno = params.getString("cust_mbl_telno");
		String cust_nm = params.getString("cust_nm");
		String rrno = params.getString("rrno");
		String cust_eml_addr = params.getString("cust_eml_addr");
		String co_telno = params.getString("co_telno");
		String occp_ty_cd = params.getString("occp_ty_cd");
		String cust_addr = params.getString("cust_addr");
		String wrter_nm = params.getString("wrter_nm");
		String curr_stcd = params.getString("curr_stcd");
		
		params.put("cust_mbl_telno", cust_mbl_telno);
		params.put("cust_nm", cust_nm);
		params.put("rrno", rrno);
		params.put("cust_eml_addr", cust_eml_addr);
		params.put("co_telno", co_telno);
		params.put("occp_ty_cd", occp_ty_cd);
		params.put("cust_addr", cust_addr);
		params.put("wrter_nm", wrter_nm);
		params.put("curr_stcd", curr_stcd);
		
		cmmnDao.insert("system.cust_mng.insertCustInfo", params);
		
		return new CmmnMap().put("status", "OK");
	}
    
    public CmmnMap insertPicInfo(CmmnMap params) {
		
		String pic_nm = params.getString("pic_nm");
		String dept_nm = params.getString("dept_nm");
		String jbps_ty_cd = params.getString("jbps_ty_cd");
		String pic_mbl_telno = params.getString("pic_mbl_telno");
		String pic_eml_addr = params.getString("pic_eml_addr");
		String jncmp_ymd = params.getString("jncmp_ymd");
		String etc_tsk_cn = params.getString("etc_tsk_cn");
		String user_id = params.getString("user_id");
		String user_pswd = params.getString("user_pswd");
		String curr_stcd = params.getString("curr_stcd");
		String wrter_nm = params.getString("wrter_nm");
		
		params.put("pic_nm", pic_nm);
		params.put("dept_nm", dept_nm);
		params.put("jbps_ty_cd", jbps_ty_cd);
		params.put("pic_mbl_telno", pic_mbl_telno);
		params.put("pic_eml_addr", pic_eml_addr);
		params.put("jncmp_ymd", jncmp_ymd);
		params.put("etc_tsk_cn", etc_tsk_cn);
		params.put("user_id", user_id);
		params.put("user_pswd", user_pswd);
		params.put("curr_stcd", curr_stcd);
		params.put("wrter_nm", wrter_nm);
		
		cmmnDao.insert("system.cust_mng.insertPicInfo", params);
		
		return new CmmnMap().put("status", "OK");
	}

    public CmmnMap insertPicRel(CmmnMap params) {
		
		String cust_mbl_telno = params.getString("cust_mbl_telno");
		String pic_mbl_telno = params.getString("pic_mbl_telno");
		String rel_ty_cd = params.getString("rel_ty_cd");
		String wrter_nm = params.getString("wrter_nm");
		String curr_stcd = params.getString("curr_stcd");
		
		params.put("cust_mbl_telno", cust_mbl_telno);
		params.put("pic_mbl_telno", pic_mbl_telno);
		params.put("rel_ty_cd", rel_ty_cd);
		params.put("wrter_nm", wrter_nm);
		params.put("curr_stcd", curr_stcd);
		
		cmmnDao.insert("system.cust_mng.insertPicRel", params);
		
		return new CmmnMap().put("status", "OK");
	}
    
    public List<CmmnMap> getPicName(CmmnMap params) {
		List<CmmnMap> dataList = cmmnDao.selectList("system.cust_mng.getPicName", params);
		
		return dataList;
	}
    
//	public CmmnMap getInfo(CmmnMap params) {
//		CmmnMap rslt = cmmnDao.selectOne("system.user_mng.getInfo", params);
//		List<CmmnMap> userSystemMappingList = cmmnDao.selectList("system.user_mng.getUserSystemMappingList", params);
//		rslt.put("userSystemMappingList", userSystemMappingList);
//		
//		return rslt;
//	}
//
//	public CmmnMap chkExist(CmmnMap params) {
//		
//		CmmnMap rslt = cmmnDao.selectOne("system.user_mng.chkExist", params);
//		if(rslt.getInt("cnt") > 0) {
//			return rslt;
//		} else {
//			return iamDao.selectOne("system.user_mng.chkExistFromIam", params);
//		}
//	}
//
//	public CmmnMap save(CmmnMap params) {
//		
//		String save_mode = params.getString("save_mode");
//		String auth_cd = params.getString("auth_cd");
//		String user_id = params.getString("user_id");
//		
//		if("insert".equals(save_mode)) {
//			String user_pw = params.getString("user_pw");
//			params.put("user_pw", CryptUtil.hashSHA512HexString(user_pw));
//			
//			cmmnDao.insert("system.user_mng.insertInfo", params);
//		} else {
//			cmmnDao.update("system.user_mng.updateInfo", params);
//		}
//		
//		// 관리시스템을 리셋.
//		cmmnDao.delete("system.user_mng.deleteUserSystemMappingList", params);
//		
//		// 일반사용자가 아닐경우만 관리시스템을 입력한다.
//		if(!"normal".equals(auth_cd)) {
//			List<CmmnMap> userSystemMappingList = params.getCmmnMapList("userSystemMappingList");
//			for(CmmnMap map : userSystemMappingList) {
//				map.put("user_id", user_id);
//				cmmnDao.insert("system.user_mng.insertSystemMapping", map);
//			}
//		}
//		return new CmmnMap().put("user_id", params.getString("user_id"));
//	}
//
//	public void delete(CmmnMap params) {
//		cmmnDao.delete("system.user_mng.deleteUserSystemMappingList", params);
//		cmmnDao.update("system.user_mng.delete", params);
//	}
//
//	public CmmnMap initPw(CmmnMap params) {
//		String user_pw = params.getString("user_pw");
//		params.put("user_pw", CryptUtil.hashSHA512HexString(user_pw));
//		
//		cmmnDao.update("system.user_mng.initPw", params);
//		
//		return new CmmnMap().put("rslt", "SUCC");
//	}
//
//	public List<CmmnMap> getAuthList() {
//		return cmmnDao.selectList("system.user_mng.getAuthList");
//	}
//
//	public PageList<CmmnMap> getInternalSystemList(CmmnMap params, PagingConfig pagingConfig) {
//		return cmmnDao.selectListPage("system.user_mng.getInternalSystemList", params, pagingConfig);
//	}
//
//	public List<CmmnMap> excelDn(CmmnMap params) {
//		return cmmnDao.selectList("system.user_mng.getList", params);
//	}

}
