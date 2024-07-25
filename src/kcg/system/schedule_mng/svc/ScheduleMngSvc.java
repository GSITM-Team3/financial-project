package kcg.system.schedule_mng.svc;

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
public class ScheduleMngSvc {
	
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	HttpServletRequest request;
	
	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;
	
	@Autowired
	IamDao iamDao;

	public List<CmmnMap> getList(CmmnMap params) {
		String year = params.getString("year");
		String month = params.getString("month");
		params.put("year", year);
		params.put("month", month);
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());
		
        List<CmmnMap> dataList = cmmnDao.selectList("system.schedule_mng.getList", params);
		
		return dataList;
	}
	
	public List<CmmnMap> getDayList(CmmnMap params) {
		String year = params.getString("year");
		String mon = params.getString("mon");
		String day = params.getString("day");
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());
		params.put("year", year);
		params.put("mon", mon);
		params.put("day", day);
		
        List<CmmnMap> dataList = cmmnDao.selectList("system.schedule_mng.getDayList", params);
		
		return dataList;
	}
	
	public List<CmmnMap> getCustInfo(CmmnMap params) {
		List<CmmnMap> dataList = cmmnDao.selectList("system.schedule_mng.getCustInfo", params);
		
		return dataList;
	}
	
	public CmmnMap getInfo(CmmnMap params) {
		String year = params.getString("year");
		String mon = params.getString("mon");
		String day = params.getString("day");
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());
		params.put("year", year);
		params.put("mon", mon);
		params.put("day", day);
		
		CmmnMap rslt = cmmnDao.selectOne("system.schedule_mng.getInfo", params);
		
		return rslt;
	}
	
    public CmmnMap insertTaskInfo(CmmnMap params) {
		
		String tsk_sj = params.getString("TSK_SJ");
		String tsk_ty_cd = params.getString("TSK_TY_CD");
		String tsk_bgng_dt_year = params.getString("TSK_BGNG_DT_YEAR");
		String tsk_bang_dt_mon = params.getString("TSK_BGNG_DT_MON");
		String tsk_bgng_dt_dd = params.getString("TSK_BGNG_DT_DD");
		String tsk_bgng_dt_hh = params.getString("TSK_BGNG_DT_HH");
		String tsk_bgng_dt_mm = params.getString("TSK_BGNG_DT_MM");
		String tsk_end_dt_mon = params.getString("TSK_END_DT_MON");
		String tsk_end_dt_dd = params.getString("TSK_END_DT_DD");
		String tsk_end_dt_hh = params.getString("TSK_END_DT_HH");
		String tsk_end_dt_mm = params.getString("TSK_END_DT_MM");
		String tsk_dtl_cn = params.getString("TSK_DTL_CN");
		String tsk_cust_nm = params.getString("TSK_CUST_NM");
		
		UserInfoVO userInfoVO = commonSvc.getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());
		
		params.put("tsk_sj", tsk_sj);
		params.put("tsk_ty_cd", tsk_ty_cd);
		params.put("tsk_bgng_dt_year", tsk_bgng_dt_year);
		params.put("tsk_bang_dt_mon", tsk_bang_dt_mon);
		params.put("tsk_bgng_dt_dd", tsk_bgng_dt_dd);
		params.put("tsk_bgng_dt_hh", tsk_bgng_dt_hh);
		params.put("tsk_bgng_dt_mm", tsk_bgng_dt_mm);
		params.put("tsk_end_dt_mon", tsk_end_dt_mon);
		params.put("tsk_end_dt_dd", tsk_end_dt_dd);
		params.put("tsk_end_dt_hh", tsk_end_dt_hh);
		params.put("tsk_end_dt_mm", tsk_end_dt_mm);
		params.put("tsk_dtl_cn", tsk_dtl_cn);
		params.put("tsk_cust_nm", tsk_cust_nm);
		
		cmmnDao.insert("system.schedule_mng.insertTaskInfo", params);
		
		return new CmmnMap().put("status", "OK");
	}
	
    public void deleteTaskInfo(CmmnMap params) {
    	Integer tsk_sn = params.getInteger("TSK_SN");
    	params.put("tsk_sn", tsk_sn);
		cmmnDao.delete("system.schedule_mng.deleteTaskInfo", params);
	}
    
}
