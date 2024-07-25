package kcg.common.ctl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import common.config.properties.SettingProperties;
import common.utils.common.CmmnMap;
import common.utils.mybatis_paginator.domain.PageList;
import kcg.common.svc.CommonSvc;

@RequestMapping("/common")
@Controller
public class CommonCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CommonSvc commonSvc;

	@Autowired
	SettingProperties settingProperties;
	
	@RequestMapping("/chkFileExist")
	public CmmnMap chkFileExist(CmmnMap params) {
		boolean isFileExist = commonSvc.chkFileExist(params);
		
		return new CmmnMap()
				.put("isFileExist", isFileExist)
				.put("rsltStatus", "SUCC");
	}
	
	/**
	 * 첨부파일다운로드
	 * @param stor_file_nm 실제저장된 파일명
	 * @param response
	 */
	@RequestMapping("/fileDn")
	public void fileDn(HttpServletRequest request, HttpServletResponse response) {
		String p = request.getParameter("p");
		commonSvc.attachmentDownload(p, response);
	}
	
	/**
	 * 동영상 스트리밍 처리
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping("/videoStream")
	public String videoStream(HttpServletRequest request, Model model) {
		String stor_file_nm = request.getParameter("p");
		CmmnMap fileInfo = commonSvc.getFileInfo(stor_file_nm);
		

		String upload_path = settingProperties.getUploadRootPath() + fileInfo.getString("path");

		model.addAttribute("upload_path", upload_path);
		model.addAttribute("stor_file_nm", fileInfo.getString("stor_file_nm"));
		model.addAttribute("file_ext", fileInfo.getString("file_ext"));
		
		return "mp4StreamView";
	}
	
	/**
	 * pdfObject용 
	 * @param stor_file_nm 실제저장된 파일명
	 * @param response
	 */
	@RequestMapping("/filePdf")
	public void pdfObject(HttpServletRequest request, HttpServletResponse response) {
		String p = request.getParameter("p");
		commonSvc.pdfObject(p, response);
	}
	
	/**
	 * 알림 리스트 가지고 오기
	 * @param params
	 * @return
	 */
	@RequestMapping("/getNotiList")
	public PageList<CmmnMap> getNotiList(CmmnMap params) {
		return commonSvc.getNotiList(params.getString("pageNo"));
	}
	
	@RequestMapping("/getTablarTicket")
	public CmmnMap getTablarTicket() {
		return new CmmnMap()
				.put("ticket", commonSvc.getTbleauTicket())
				;
	}
}
