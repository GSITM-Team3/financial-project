package kcg.system.share_mng.ctl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;
import common.utils.common.MultipartFileList;
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import kcg.common.svc.CommonSvc;
import kcg.system.share_mng.svc.ShareMngUseExampleSvc;

@RequestMapping("/system/share_mng/useExample")
@Controller
public class ShareMngUseExampleCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	ShareMngUseExampleSvc shareMngUseExampleSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	/**
	 * 활용 사례페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/list")
	public String openPageList(ModelMap model) {
		return "kcg/system/share_mng/ShareMngUseExampleList";
	}
	
	/**
	 * 활용 사례상세페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/dtl")
	public String openPageDtl(ModelMap model, CmmnMap params) {
		model.addAttribute("idx", params.getString("idx", ""));
		return "kcg/system/share_mng/ShareMngUseExampleDtl";
	}
	
	/** 
	* 활용 사례목록 조회한다.
	* @methodName : getList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params , PagingConfig pagingConfig){
		return shareMngUseExampleSvc.getList(params, pagingConfig); 
	}
	
	/** 
	* 활용 사례상세정보조회 한다.
	* @methodName : getInfo 
	* @author : Irury Kang
	* */
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params){
		return shareMngUseExampleSvc.getInfo(params); 
	}
	
	/** 
	* 활용 사례상세정보 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */
	@RequestMapping("/save")
	public CmmnMap save(MultipartFileList fileList , CmmnMap params){
		return shareMngUseExampleSvc.save(fileList , params); 
	}
	
	
	/** 
	* 활용 사례상세정보 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */
	@RequestMapping("/delete")
	public void delete(CmmnMap params){
		shareMngUseExampleSvc.delete(params); 
	}
	
	/** 
	* 활용데이터 내부데이터 목록 조회
	* @methodName : getInUseDataList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getInUseDataList")
	public PageList<CmmnMap> getInUseDataList(CmmnMap params , PagingConfig pagingConfig){
		return shareMngUseExampleSvc.getInUseDataList(params , pagingConfig); 
	}
	
	/** 
	* 활용데이터 외부데이터 목록 조회
	* @methodName : getExtUseDataList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getExtUseDataList")
	public PageList<CmmnMap> getExtUseDataList(CmmnMap params , PagingConfig pagingConfig){
		return shareMngUseExampleSvc.getExtUseDataList(params , pagingConfig); 
	}
	
}
