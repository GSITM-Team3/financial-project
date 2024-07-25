/**
 * 
 */
package kcg.system.poli_person_mng.svc;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.dao.CmmnDao;
import common.utils.common.CmmnMap;
import common.utils.string.StringUtil;
import common.utils.uuid.UuidUtil;
import kcg.common.svc.CommonSvc;

@Service
public class CodeMngSvc {
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	HttpServletRequest request;
	
	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	public List<CmmnMap> getCdMngList(CmmnMap params) {
		
		return cmmnDao.selectList("system.poli_person_mng.code.getCdMngList", params);
	}

	public void saveList(CmmnMap params) {
		String cat1 = params.getString("cat1");
		String cat2 = params.getString("cat2");
		String cat3 = params.getString("cat3");
		String cat4 = params.getString("cat4");
		String cat5 = params.getString("cat5");
		String cat6 = params.getString("cat6");
		String code_grp_id = params.getString("code_grp_id");
		
//		cmmnDao.delete("system.poli_person_mng.code.deleteCd", params);
		
		
		int max_codenum = params.getInt("max_codenum");
		
		List<CmmnMap> dataList = params.getCmmnMapList("dataList");		
		
		String code;
		for(CmmnMap map : dataList) {

			code = map.getString("code");
			if(StringUtil.isEmpty(code)) {
				++max_codenum;
				map.put("code_idx", UuidUtil.getUuidOnlyString());
				
				if("CAT1".equals(code_grp_id)) {
					code = new StringBuilder()
							.append("CT")
							.append(StringUtil.leftPad(Integer.toString(max_codenum), 3, "0"))
							.toString();
					map.put("code", code);
					map.put("cat1", code);
				} else if("CAT2".equals(code_grp_id)) {
					code = new StringBuilder()
							.append(cat1)
							.append(StringUtil.leftPad(Integer.toString(max_codenum), 3, "0"))
							.toString();
					map.put("code", code);
					map.put("cat2", code);
				} else if("CAT3".equals(code_grp_id)) {
					code = new StringBuilder()
							.append(cat2)
							.append(StringUtil.leftPad(Integer.toString(max_codenum), 3, "0"))
							.toString();
					map.put("code", code);
					map.put("cat3", code);
				} else if("CAT4".equals(code_grp_id)) {
					code = new StringBuilder()
							.append(cat3)
							.append(StringUtil.leftPad(Integer.toString(max_codenum), 3, "0"))
							.toString();
					map.put("code", code);
					map.put("cat4", code);
				} else if("CAT5".equals(code_grp_id)) {
					code = new StringBuilder()
							.append(cat4)
							.append(StringUtil.leftPad(Integer.toString(max_codenum), 3, "0"))
							.toString();
					map.put("code", code);
					map.put("cat5", code);
				} else if("CAT6".equals(code_grp_id)) {
					code = new StringBuilder()
							.append(cat5)
							.append(StringUtil.leftPad(Integer.toString(max_codenum), 3, "0"))
							.toString();
					map.put("code", code);
					map.put("cat6", code);
				} else if("JIKGUN".equals(code_grp_id)) {
					code = new StringBuilder()
							.append("JN")
							.append(StringUtil.leftPad(Integer.toString(max_codenum), 3, "0"))
							.toString();
					map.put("code", code);
					map.put("cat1", code);
				} else if("JIKGUB".equals(code_grp_id)) {
					code = new StringBuilder()
							.append(cat1)
							.append(StringUtil.leftPad(Integer.toString(max_codenum), 3, "0"))
							.toString();
					map.put("code", code);
					map.put("cat2", code);
				} else if("POS".equals(code_grp_id)) {
					code = new StringBuilder()
							.append("PS")
							.append(StringUtil.leftPad(Integer.toString(max_codenum), 3, "0"))
							.toString();
					map.put("code", code);
					map.put("cat1", code);
				} else if("FDEPT".equals(code_grp_id)) {
					code = new StringBuilder()
							.append("FT")
							.append(StringUtil.leftPad(Integer.toString(max_codenum), 3, "0"))
							.toString();
					map.put("code", code);
					map.put("cat1", code);
				}
				cmmnDao.insert("system.poli_person_mng.code.insertCmmnCodeInfo", map);
			} else {
				cmmnDao.update("system.poli_person_mng.code.updateCmmnCodeInfo", map);
				
				if("CAT1".equals(code_grp_id)) {
					map.put("target_cd", "cat_cd_1");
					map.put("target_cd_nm", "cat_nm_1");
				} else if("CAT2".equals(code_grp_id)) {
					map.put("target_cd", "cat_cd_2");
					map.put("target_cd_nm", "cat_nm_2");
				} else if("CAT3".equals(code_grp_id)) {
					map.put("target_cd", "cat_cd_3");
					map.put("target_cd_nm", "cat_nm_3");
				} else if("CAT4".equals(code_grp_id)) {
					map.put("target_cd", "cat_cd_4");
					map.put("target_cd_nm", "cat_nm_4");
				} else if("CAT5".equals(code_grp_id)) {
					map.put("target_cd", "cat_cd_5");
					map.put("target_cd_nm", "cat_nm_5");
				} else if("CAT6".equals(code_grp_id)) {
					map.put("target_cd", "cat_cd_6");
					map.put("target_cd_nm", "cat_nm_6");
				} else if("JIKGUN".equals(code_grp_id)) {
					map.put("target_cd", "jikgun_cd");
					map.put("target_cd_nm", "jikgun_nm");
				} else if("JIKGUB".equals(code_grp_id)) {
					map.put("target_cd", "jikgub_cd");
					map.put("target_cd_nm", "jikgub_nm");
				} else if("POS".equals(code_grp_id)) {
					map.put("target_cd", "pos_cd");
					map.put("target_cd_nm", "pos_nm");
				} else if("FDEPT".equals(code_grp_id)) {
					map.put("target_cd", "fdept_cd");
					map.put("target_cd_nm", "fdept_nm");
				}
				cmmnDao.update("system.poli_person_mng.code.updateReportInfo", map);
				
			}
			
		}
	}

	public CmmnMap chkChildExist(CmmnMap params) {
		return cmmnDao.selectOne("system.poli_person_mng.code.chkChildExist", params);
	}

	public void deleteInfo(CmmnMap params) {
		cmmnDao.delete("system.poli_person_mng.code.deleteInfo", params);
	}
}
