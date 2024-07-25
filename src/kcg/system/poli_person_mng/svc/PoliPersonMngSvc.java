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
import common.utils.common.PagingConfig;
import common.utils.mybatis_paginator.domain.PageList;
import common.utils.string.StringUtil;
import common.utils.uuid.UuidUtil;
import kcg.common.svc.CommonSvc;

/** 
* 현/정원 리스트
* @packageName : kcg.system.poli_person_mng.ctl 
* @author : Irury Kang 
* @description : 
* =========================================================== 
* DATE AUTHOR NOTE 
* ----------------------------------------------------------- 
* 2021.11.17 irury Kang 최초 생성 */
@Service
public class PoliPersonMngSvc {
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	HttpServletRequest request;
	
	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	/** 
	* 목록조회
	* @methodName : getList 
	* @author : Irury Kang 
	* */
	public PageList<CmmnMap> getList(CmmnMap params, PagingConfig pagingConfig) {
		return cmmnDao.selectListPage("system.poli_person_mng.getList", params,pagingConfig);
	}
	
	/** 
	* 상세정보 등록/수정
	* @methodName : save 
	* */
	public void insertInfo(CmmnMap params) {
		params.put("idx", UuidUtil.getUuidOnlyString());
		params.put("code", genCode(params));
		cmmnDao.insert("system.poli_person_mng.insertInfo", params);
	}

	public List<CmmnMap> getCdMngList(CmmnMap params) {
		
		return cmmnDao.selectList("system.poli_person_mng.getCdMngList", params);
	}

	/** 
	* 중복체크
	* @methodName : getCheckDupli 
	* @author : Irury Kang 
	* */
	public CmmnMap getCheckDupl(CmmnMap params) {
		String code = genCode(params);
		
		return cmmnDao.selectOne("system.poli_person_mng.getInfo", code);
	}

	
	/** 
	* 코드생성
	* @methodName : genCode 
	* @author : Irury Kang 
	* */
	private String genCode(CmmnMap params) {
		String cat_cd_1 = params.getString("cat_cd_1","");
		String cat_cd_2 = params.getString("cat_cd_2","");
		String cat_cd_3 = params.getString("cat_cd_3","");
		String cat_cd_4 = params.getString("cat_cd_4","");
		String cat_cd_5 = params.getString("cat_cd_5","");
		String cat_cd_6 = params.getString("cat_cd_6","");
//		String jikgun_cd = params.getString("jikgun_cd","");
		String jikgub_cd = params.getString("jikgub_cd","");
		String pos_cd = params.getString("pos_cd","");
		String fdept_cd = params.getString("fdept_cd","");
		
		String temp00;
		if( !"".equals(cat_cd_6) ) {
			temp00 = cat_cd_6;
		} else if( !"".equals(cat_cd_5) ) {
			temp00 = cat_cd_5;
		} else if( !"".equals(cat_cd_4) ) {
			temp00 = cat_cd_4;
		} else if( !"".equals(cat_cd_3) ) {
			temp00 = cat_cd_3;
		} else if( !"".equals(cat_cd_2) ) {
			temp00 = cat_cd_2;
		} else {
			temp00 = cat_cd_1;
		}
		
		return new StringBuilder()
				.append(temp00)
				.append(jikgub_cd)
				.append(pos_cd)
				.append(fdept_cd)
				.toString();
	}

	public void deleteList(CmmnMap params) {
		List<CmmnMap> targetArr = params.getCmmnMapList("targetArr");
		for(CmmnMap target : targetArr) {
			cmmnDao.delete("system.poli_person_mng.deleteInfo", target);
		}
	}

	public void saveList(CmmnMap params) {
		List<CmmnMap> targetArr = params.getCmmnMapList("targetArr");
		for(CmmnMap target : targetArr) {
			cmmnDao.update("system.poli_person_mng.updateInfo", target);
		}
	}

}
