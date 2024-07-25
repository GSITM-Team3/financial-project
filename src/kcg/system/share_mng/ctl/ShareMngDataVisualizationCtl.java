package kcg.system.share_mng.ctl;

import java.io.UnsupportedEncodingException;

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
import kcg.system.share_mng.svc.ShareMngDataVisualizationSvc;

@RequestMapping("/system/share_mng/dataVisualization")
@Controller
public class ShareMngDataVisualizationCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	ShareMngDataVisualizationSvc shareMngDataVisualizationSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	/**
	 * 데이터 시각화 페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/list")
	public String openPageList(ModelMap model) {
		return "kcg/system/share_mng/ShareMngDataVisualizationList";
	}
	
	/**
	 * 데이터 시각화 상세페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/dtl")
	public String openPageDtl(ModelMap model, CmmnMap params) {
		model.addAttribute("idx", params.getString("idx", ""));
		return "kcg/system/share_mng/ShareMngDataVisualizationDtl";
	}
	
	/** 
	* 데이터 시각화 목록 조회한다.
	* @methodName : getList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params , PagingConfig pagingConfig){
		return shareMngDataVisualizationSvc.getList(params, pagingConfig); 
	}
	
	/** 
	* 데이터 시각화 상세정보조회 한다.
	* @methodName : getInfo 
	* @author : Irury Kang
	 * @throws UnsupportedEncodingException 
	* */
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params) throws UnsupportedEncodingException{
		return shareMngDataVisualizationSvc.getInfo(params); 
	}
	
	/** 
	* 데이터 시각화 상세정보 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */
	@RequestMapping("/save")
	public CmmnMap save(MultipartFileList fileList , CmmnMap params){
		return shareMngDataVisualizationSvc.save(fileList , params); 
	}
	
	
	/** 
	* 데이터 시각화 상세정보 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */
	@RequestMapping("/delete")
	public void delete(CmmnMap params){
		shareMngDataVisualizationSvc.delete(params); 
	}
}
