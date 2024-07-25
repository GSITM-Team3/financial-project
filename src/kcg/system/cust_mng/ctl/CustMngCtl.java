package kcg.system.cust_mng.ctl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;
import common.utils.common.ConfigExcelDn;
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import kcg.common.svc.CommonSvc;
import kcg.system.cust_mng.svc.CustMngSvc;

@RequestMapping("/custMng")
@Controller
public class CustMngCtl {


	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CustMngSvc custMngSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	/**
	 * 관리 페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/custEventList")
	public String openCustEventlist(ModelMap model) {
		log.debug(">>> open page list");
		
		return "kcg/system/cust_mng/custEventList";
	}
	
	@RequestMapping("/custInfoMng")
	public String openCustInfoMng(ModelMap model) {
		log.debug(">>> open page list");
		
		return "kcg/system/cust_mng/custInfoMng";
	}
	
	@RequestMapping("/custInfoList")
	public String openCustInfolist(ModelMap model) {
		log.debug(">>> open page list");
		
		return "kcg/system/cust_mng/custInfoList";
	}
	
	@RequestMapping("/picInfoMng")
	public String openpicInfoMng(ModelMap model) {
		log.debug(">>> open page list");
		
		return "kcg/system/cust_mng/picInfoMng";
	}
	
	/**
	 * 관리 페이지를 호출한다.
	 * @param model
	 * @return
	 */
	
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> pageList = custMngSvc.getList(params, pagingConfig); 
		log.debug("{}",pageList);
		return pageList;
		//return custMngSvc.getList(params, pagingConfig);
	}
	
	@RequestMapping("/getListAll")
	public PageList<CmmnMap> getListAll(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> pageList = custMngSvc.getListAll(params, pagingConfig); 
		log.debug("{}",pageList);
		return pageList;
		//return custMngSvc.getListAll(params, pagingConfig);
	}
	
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params) {
		return custMngSvc.getInfo(params);
	}
	
	@RequestMapping("/getCustInfoList")
	public PageList<CmmnMap> getCustInfoList(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> pageList = custMngSvc.getCustInfoList(params, pagingConfig); 
		log.debug("{}",pageList);
		return pageList;
		//return custMngSvc.getList(params, pagingConfig);
	}
	
	@RequestMapping("/getCustInfoListAll")
	public PageList<CmmnMap> getCustInfoListAll(CmmnMap params, PagingConfig pagingConfig) {
		PageList<CmmnMap> pageList = custMngSvc.getCustInfoListAll(params, pagingConfig); 
		log.debug("{}",pageList);
		return pageList;
		//return custMngSvc.getListAll(params, pagingConfig);
	}
	
	@RequestMapping("/getCustCardInfo")
	public CmmnMap getCustCardInfo(CmmnMap params) {
		return custMngSvc.getCustCardInfo(params);
	}
	
	@RequestMapping("/getInitInfo")
	public CmmnMap getInitInfo(CmmnMap params) {
		return custMngSvc.getInitInfo(params);
	}
	
	@RequestMapping("/getPicSelInfo")
	public CmmnMap getPicSelInfo(CmmnMap params) {
		return custMngSvc.getPicSelInfo(params);
	}
	
	@RequestMapping("/getPicInfo")
	public List<CmmnMap> getPicInfo(CmmnMap params){
		return custMngSvc.getPicInfo(params); 
	}
	
	@RequestMapping("/getCustInfo")
	public List<CmmnMap> getCustInfo(CmmnMap params){
		return custMngSvc.getCustInfo(params); 
	}
	
	@RequestMapping("/getCustOne")
	public CmmnMap getCustOne(CmmnMap params) {
		return custMngSvc.getCustOne(params);
	}
	
	@RequestMapping("/updatePicRoof")
	public CmmnMap updatePicRoof(CmmnMap params){
		return custMngSvc.updatePicRoof(params); 
	}
	
	@RequestMapping("/updateStcdRoof")
	public CmmnMap updateStcdRoof(CmmnMap params){
		return custMngSvc.updateStcdRoof(params); 
	}
	
	@RequestMapping("/updateCust")
	public CmmnMap updateCust(CmmnMap params){
		return custMngSvc.updateCust(params); 
	}
	
	@RequestMapping("/updatePic")
	public CmmnMap updatePic(CmmnMap params){
		return custMngSvc.updatePic(params); 
	}
	
	@RequestMapping("/getPicOne")
	public CmmnMap getPicOne(CmmnMap params) {
		return custMngSvc.getPicOne(params);
	}
	
	@RequestMapping("/updatePicTelno")
	public CmmnMap updatePicTelno(CmmnMap params) {
		return custMngSvc.updatePicTelno(params);
	}
	
	@RequestMapping("/updateCustStcd")
	public CmmnMap updateCustStcd(CmmnMap params) {
		return custMngSvc.updateCustStcd(params);
	}
	
	@RequestMapping("/updatePicStcd")
	public CmmnMap updatePicStcd(CmmnMap params) {
		return custMngSvc.updatePicStcd(params);
	}
	
	@RequestMapping("/updatePicRelStcd")
	public CmmnMap updatePicRelStcd(CmmnMap params) {
		return custMngSvc.updatePicRelStcd(params);
	}
	
	@RequestMapping("/insertCustInfo")
	public CmmnMap insertCustInfo(CmmnMap params) {
		return custMngSvc.insertCustInfo(params);
	}
	
	@RequestMapping("/insertPicInfo")
	public CmmnMap insertPicInfo(CmmnMap params) {
		return custMngSvc.insertPicInfo(params);
	}
	
	@RequestMapping("/insertPicRel")
	public CmmnMap insertPicRel(CmmnMap params) {
		return custMngSvc.insertPicRel(params);
	}
	
	@RequestMapping("/getPicName")
	public List<CmmnMap> getPicName(CmmnMap params){
		return custMngSvc.getPicName(params); 
	}
	
	/** 
	* 관리 상세정보 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */
	@RequestMapping("/save")
	public CmmnMap save( CmmnMap params){
		
		log.debug("save     {}",params);
//		return etcMngErrCdSvc.save(params); 
		return new CmmnMap();
	}
	
	
	/** 
	* 관리 상세정보 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */
	@RequestMapping("/delete")
	public void delete(CmmnMap params){
		log.debug("delete     {}",params);
	}

}
