package common.config.properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.stereotype.Component;

import common.dao.CmmnDao;

@Component
@PropertySources({
	@PropertySource({"classpath:common/config/properties/setting_${action.mode}.properties"})
})
public class SettingProperties {

	@Autowired
	CmmnDao cmmnDao;
	
	@Value("${run.env}")
	private String runEnv;
	
	@Value("${rsc.ver}")
	private String rscVer;
	
	@Value("${upload.root.path}")
	private String uploadRootPath;
	
	@Value("${upload.max.size}")
	private String uploadMaxSize;
	
	@Value("${upload.deny.ext.list}")
	private String uploadDenyExtList;
	
	@Value("${upload.video.max.size}")
	private String uploadVideoMaxSize;
	
	@Value("${hivedb.url}")
	private String hivedbUrl;
	
	@Value("${tableau.url}")
	private String tableauUrl;
	
	@Value("${tableau.username}")
	private String tableauUsername;
	
	@Value("${gis.server1}")
	private String gisServer1;

	public String getTableauUsername() {
		return tableauUsername;
	}

	public void setTableauUsername(String tableauUsername) {
		this.tableauUsername = tableauUsername;
	}

	public String getRunEnv() {
		return runEnv;
	}

	public void setRunEnv(String runEnv) {
		this.runEnv = runEnv;
	}

	public String getRscVer() {
		return rscVer;
	}

	public void setRscVer(String rscVer) {
		this.rscVer = rscVer;
	}

	public String getUploadRootPath() {
		return uploadRootPath;
	}

	public void setUploadRootPath(String uploadRootPath) {
		this.uploadRootPath = uploadRootPath;
	}

	public String getUploadMaxSize() {
		return uploadMaxSize;
	}

	public void setUploadMaxSize(String uploadMaxSize) {
		this.uploadMaxSize = uploadMaxSize;
	}

	public String getUploadDenyExtList() {
		return uploadDenyExtList;
	}

	public void setUploadDenyExtList(String uploadDenyExtList) {
		this.uploadDenyExtList = uploadDenyExtList;
	}

	public String getUploadVideoMaxSize() {
		return uploadVideoMaxSize;
	}

	public void setUploadVideoMaxSize(String uploadVideoMaxSize) {
		this.uploadVideoMaxSize = uploadVideoMaxSize;
	}

	public String getHivedbUrl() {
		return hivedbUrl;
	}

	public void setHivedbUrl(String hivedbUrl) {
		this.hivedbUrl = hivedbUrl;
	}

	public String getTableauUrl() {
		return tableauUrl;
	}

	public void setTableauUrl(String tableauUrl) {
		this.tableauUrl = tableauUrl;
	}

	public String getGisServer1() {
		return gisServer1;
	}

	public void setGisServer1(String gisServer1) {
		this.gisServer1 = gisServer1;
	}

	
}
