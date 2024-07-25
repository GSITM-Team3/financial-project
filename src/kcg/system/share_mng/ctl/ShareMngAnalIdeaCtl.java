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
import kcg.system.share_mng.svc.ShareMngAnalIdeaSvc;

@RequestMapping("/system/share_mng/analIdea")
@Controller
public class ShareMngAnalIdeaCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	ShareMngAnalIdeaSvc shareMngAnalIdeaSvc;
	
	@Autowired
	CommonSvc commonSvc;
	
	/**
	 * 분석 아이디어 공유 페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/list")
	public String openPageList(ModelMap model) {
		return "kcg/system/share_mng/ShareMngAnalIdeaList";
	}
	
	/**
	 * 분석 아이디어 공유 상세페이지를 호출한다.
	 * @param model
	 * @return
	 */
	@RequestMapping("/dtl")
	public String openPageDtl(ModelMap model, CmmnMap params) {
		model.addAttribute("idx", params.getString("idx", ""));
		return "kcg/system/share_mng/ShareMngAnalIdeaDtl";
	}
	
	/** 
	* 분석 아이디어 공유 목록 조회한다.
	* @methodName : getList 
	* @author : Irury Kang 
	* */
	@RequestMapping("/getList")
	public PageList<CmmnMap> getList(CmmnMap params , PagingConfig pagingConfig){
		return shareMngAnalIdeaSvc.getList(params, pagingConfig); 
	}
	
	/** 
	* 분석 아이디어 공유 상세정보조회 한다.
	* @methodName : getInfo 
	* @author : Irury Kang
	* */
	@RequestMapping("/getInfo")
	public CmmnMap getInfo(CmmnMap params){
		return shareMngAnalIdeaSvc.getInfo(params); 
	}
	
	/** 
	* 분석 아이디어 공유 상세정보 저장
	* @methodName : save 
	* @author : Irury Kang 
	* */
	@RequestMapping("/save")
	public CmmnMap save(MultipartFileList fileList , CmmnMap params){
		return shareMngAnalIdeaSvc.save(fileList , params); 
	}
	
	
	/** 
	* 분석 아이디어 공유 상세정보 삭제
	* @methodName : delete 
	* @author : Irury Kang 
	* */
	@RequestMapping("/delete")
	public void delete(CmmnMap params){
		shareMngAnalIdeaSvc.delete(params); 
	}
}
