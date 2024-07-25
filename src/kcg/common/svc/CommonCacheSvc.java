package kcg.common.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import common.dao.CmmnDao;
import common.utils.common.CmmnMap;

@Service
public class CommonCacheSvc {
	
	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CmmnDao cmmnDao;
	
	@Cacheable(value = "CmmnCdCache")
	public List<CmmnMap> getAllCmmnCdCache(){
		log.debug(">> getAllCmmnCdCache !!! ");
		return cmmnDao.selectList("common.getAllCmmnCd");
	}
	
	@CacheEvict(value = "CmmnCdCache", allEntries = true)
	public void clearAllCmmnCdCach(){
		log.debug(">> clearAllCmmnCdCach !!! ");
	}

}
