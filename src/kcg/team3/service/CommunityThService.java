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
public class CommunityThService {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	HttpServletRequest request;

	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	// 주소록 리스트 가져오기
	public List<CmmnMap> getCommunityList(CmmnMap params) {
		return cmmnDao.selectList("kcg.team3.getCommunityList", params);
	}

	// 주소록 리스트 가져오기(페이징)
	public List<CmmnMap> getCommuListWithPaging(CmmnMap params) {
		return cmmnDao.selectList("kcg.team3.getCommuListWithPaging", params);
	}

	// 주소록 갯수 가져오기
	public int getTotalCommuCount() {
		List<CmmnMap> commuList = cmmnDao.selectList("kcg.team3.getCommunityList");
		int count = 0;

		for (CmmnMap commu : commuList) {
			count++;
		}

		return count;
	}

	// 필터링된 주소록 갯수 가져오기
	public int getFilteredCommuCount(CmmnMap params) {
		return cmmnDao.selectOne("kcg.team3.getFilteredCommuCount", params);
	}
}