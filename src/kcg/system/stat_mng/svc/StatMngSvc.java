package kcg.system.stat_mng.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.dao.CmmnDao;
import common.utils.common.CmmnMap;
import common.utils.common.CmmnUtil;
import kcg.common.svc.CommonSvc;

@Service
public class StatMngSvc {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CmmnDao cmmnDao;
	
	@Autowired
	CommonSvc commonSvc;

	public CmmnMap getDashboardStatData() {

		String to_date = CmmnUtil.getTodayFormedString();
		String from_date = CmmnUtil.calcDate(to_date, -6);
		
		CmmnMap params = new CmmnMap()
				.put("from_date", from_date)
				.put("to_date", to_date)
				;

		List<CmmnMap> statisticData = getStatisticData(params);
		CmmnMap reqStat = getReqStat(params);
		List<CmmnMap> keywordStat = getKeywordStat(params);
		
		return new CmmnMap()
				.put("statisticData", statisticData)
				.put("reqStat", reqStat)
				.put("keywordStat", keywordStat)
				.put("from_date", from_date)
				.put("to_date", to_date)
				;
	}

	public List<CmmnMap> getStatisticData(CmmnMap params) {
		return cmmnDao.selectList("stat.mng.dashboard.getStatisticData", params);
	}

	public CmmnMap getReqStat(CmmnMap params) {
		return cmmnDao.selectOne("stat.mng.dashboard.getReqStat", params);
	}

	public List<CmmnMap> getKeywordStat(CmmnMap params) {
		return cmmnDao.selectList("stat.mng.dashboard.getKeywordStat", params);
	}

	public CmmnMap getStatisticDataTotal(CmmnMap params) {
		return cmmnDao.selectOne("stat.mng.dashboard.getStatisticDataTotal", params);
	}
	

}
