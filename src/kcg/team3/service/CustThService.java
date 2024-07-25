package kcg.team3.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.dao.CmmnDao;
import common.utils.common.CmmnMap;
import kcg.common.svc.CommonSvc;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

@Service
public class CustThService {

	@Autowired
	HttpServletRequest request;

	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	// 고객 정보 관리
	public List<CmmnMap> getUserIds(CmmnMap params) {
		List<CmmnMap> rslt = cmmnDao.selectList("kcg.team3.getUserIds", params);
		return rslt;
	}

	// 특정 관리자가 담당하는 고객들 조회
	public List<CmmnMap> getAssignedCustomers(String userId) {
		List<CmmnMap> assignedCustomers = cmmnDao.selectList("kcg.team3.getAssignedCustomers", userId);
		return assignedCustomers;
	}

	// 고객 정보 수정
	public void custModify(CmmnMap params) {
		cmmnDao.update("kcg.team3.custModify", params);
	}

	// 전화번호 중복 확인
	public boolean checkPhoneNumber(String phoneNumber) {
		CmmnMap result = cmmnDao.selectOne("kcg.team3.checkPhoneNumber", phoneNumber);
		return result != null;
	}

	// 고객 정보 등록
	public void custInsert(CmmnMap params) {
		cmmnDao.insert("kcg.team3.custInsert", params);
	}

	// 고객 정보 목록 조회
	public List<CmmnMap> getCustListWithPaging(CmmnMap params) {
		return cmmnDao.selectList("kcg.team3.getCustListWithPaging", params);
	}

	// 고객 정보 필터 목록 조회
	public int getFilteredCustCount(CmmnMap params) {
		return cmmnDao.selectOne("kcg.team3.getFilteredCustCount", params);
	}

	// 고객 상담 내용
	public List<CmmnMap> custConsult(int cust_code) {
		List<CmmnMap> rslt = cmmnDao.selectConsultList("kcg.team3.custConsult", cust_code);
		return rslt;
	}

	// 고객 상담 등록
	public void insertConsult(CmmnMap params) {
		cmmnDao.insert("kcg.team3.insertConsultation", params);
	}

	// 고객 이벤트 조회
	// 공지사항 리스트 가져오기(페이징)
	public List<CmmnMap> getEventListWithPaging(CmmnMap params) {
		List<CmmnMap> eventList = cmmnDao.selectList("kcg.team3.getEventListWithPaging", params);
		return eventList;
	}

// 고객 이벤트 필터 조회 (7월 19일 추가)
	public int getFilterEventCount(CmmnMap params) {
		return cmmnDao.selectOne("kcg.team3.getFilterEventCount", params);
	}

// 이름으로 고객 코드 가져오기
	public CmmnMap getCustByName(CmmnMap params) {
		return cmmnDao.selectOne("kcg.team3.getCustByName", params);
	}

	// 코드로 이름 가져오기
	public CmmnMap getcustNameByCode(CmmnMap params, int custCode) {
		params.put("cust_code", custCode);

		CmmnMap cmmnMap = cmmnDao.selectOne("kcg.team3.getCustNameByCustCodeOne", params);
		return cmmnMap;
	}

}