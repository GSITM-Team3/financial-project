package kcg.team3.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.dao.CmmnDao;
import common.utils.common.CmmnMap;
import kcg.common.svc.CommonSvc;

@Service
public class ShareThService {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	HttpServletRequest request;

	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	// 공지사항 리스트 가져오기
	/*
	 * public List<CmmnMap> getNoticeList(CmmnMap params) { List<CmmnMap> noticeList
	 * = cmmnDao.selectList("kcg.team3.getNoticeList", params); return noticeList; }
	 */

	// 공지사항 리스트 가져오기(페이징)
	public List<CmmnMap> getNoticeListWithPaging(CmmnMap params) {
		List<CmmnMap> noticeList = cmmnDao.selectList("kcg.team3.getNoticeListWithPaging", params);
		return noticeList;
	}

	// 공지사항 갯수 가져오기
	public int getTotalNoticeCount() {
		List<CmmnMap> noticeList = cmmnDao.selectList("kcg.team3.getNoticeList");
		int count = 0;

		for (CmmnMap notice : noticeList) {
			count++;
		}
		return count;
	}

	// 공지사항 등록하기
	public CmmnMap insertNotice(CmmnMap params) {
		String user_id = params.getString("user_id");
		String gw_title = params.getString("gw_title");
		String gw_content = params.getString("gw_content");

		params.put("user_id", user_id);
		params.put("gw_title", gw_title);
		params.put("gw_content", gw_content);

		cmmnDao.insert("kcg.team3.insertNotice", params);

		return new CmmnMap().put("status", "OK");

	}

	// 공지사항 하나 가져오기
	public CmmnMap getNoticeOne(CmmnMap params, String gw_Code) {

		int gw_code = Integer.parseInt(gw_Code);
		params.put("gw_code", gw_code);

		CmmnMap cmmnMap = cmmnDao.selectOne("kcg.team3.getNoticeOne", params);
		return cmmnMap;

	}

	// 공지사항 수정하기
	public CmmnMap updateNotice(CmmnMap params) {
		int gw_code = Integer.valueOf(params.getString("gw_code"));
		String gw_title = params.getString("gw_title");
		String gw_content = params.getString("gw_content");

		params.put("gw_code", gw_code);
		params.put("gw_title", gw_title);
		params.put("gw_content", gw_content);

		cmmnDao.update("kcg.team3.updateNotice", params);

		return new CmmnMap().put("status", "OK");
	}

	// 공지사항 삭제
	public CmmnMap deleteNotice(CmmnMap params) {
		int gw_code = Integer.valueOf(params.getString("gw_code"));

		params.put("gw_code", gw_code);

		cmmnDao.delete("kcg.team3.deleteNotice", params);

		return new CmmnMap().put("status", "OK");
	}

	/*
	 * // 템플릿 리스트 가져오기 public List<CmmnMap> getTemplateList(CmmnMap params) {
	 * List<CmmnMap> templateList = cmmnDao.selectList("kcg.team3.getTemplateList",
	 * params); return templateList; }
	 */

	// 템플릿 리스트 가져오기(페이징)
	public List<CmmnMap> getTemplateListWithPaging(CmmnMap params) {
		List<CmmnMap> templateList = cmmnDao.selectList("kcg.team3.getTemplateListWithPaging", params);
		return templateList;
	}

	// 템플릿 갯수 가져오기
	public int getTotalTemplateCount() {
		List<CmmnMap> templateList = cmmnDao.selectList("kcg.team3.getTemplateList");
		int count = 0;

		for (CmmnMap template : templateList) {
			count++;
		}
		return count;
	}

	// 템플릿 등록하기
	public CmmnMap insertTemplate(CmmnMap params) {
		String user_id = params.getString("user_id");
		String gw_title = params.getString("gw_title");
		String gw_content = params.getString("gw_content");

		params.put("user_id", user_id);
		params.put("gw_title", gw_title);
		params.put("gw_content", gw_content);

		cmmnDao.insert("kcg.team3.insertTemplate", params);

		return new CmmnMap().put("status", "OK");

	}

	// 템플릿 하나 가져오기
	public CmmnMap getTemplateOne(CmmnMap params, String gw_Code) {

		int gw_code = Integer.parseInt(gw_Code);
		params.put("gw_code", gw_code);

		CmmnMap cmmnMap = cmmnDao.selectOne("kcg.team3.getTemplateOne", params);
		return cmmnMap;

	}

	// 메인용 공지사항 5개
	public List<CmmnMap> getNoticeForMain() {
		return cmmnDao.selectList("kcg.team3.getNoticeForMainLimit5");
	}
}
