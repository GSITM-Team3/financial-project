package kcg.common.svc;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.CommonConfigurationKeysPublic;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.config.properties.SettingProperties;
import common.dao.CmmnDao;
import common.dao.HiveDao;
import common.utils.common.CmmnMap;
import common.utils.common.CmmnUtil;
import common.utils.json.JsonUtil;
import common.utils.string.StringUtil;
import common.utils.uuid.UuidUtil;

@Service
public class BatchSvc {
	
	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	HiveDao hiveDao;

	@Autowired
	CmmnDao cmmnDao;

	@Autowired
	SettingProperties settingProperties;
	
	public void migrateImgVideoMetaInfo() {
		
		// postgre DB에 저장된 가장 최신 업데이트 날자를 가지고 온다.
		String maxLastUpdtDt = cmmnDao.selectOne("batch.getHadoopFileInfoMaxLastUpdtDt");
		if(maxLastUpdtDt == null) maxLastUpdtDt = "";
		
		List<String> targetFileExtList = new ArrayList<String>();
		targetFileExtList.add(".png");
		targetFileExtList.add(".jpeg");
		targetFileExtList.add(".jpg");
		targetFileExtList.add(".gif");
		targetFileExtList.add(".bmp");
		targetFileExtList.add(".mp4");
		targetFileExtList.add(".avi");
		targetFileExtList.add(".mov");
		
		CmmnMap params = new CmmnMap()
				.put("maxLastUpdtDt", maxLastUpdtDt)
				.put("targetFileExtList", targetFileExtList) // 가지고 올 대상 확장자를 지정한다.
				;
		
		// postgre DB에 저장된 가장 최신 업데이트 날자 이후의 데이터를 
		// hadoop에서 가지고 온다.
		List<CmmnMap> dataList = hiveDao.selectList("batch.getHadoopFileList", params);
		CmmnMap tmp;		
		for(CmmnMap map : dataList) {
			// 가지고 온 hadoop 데이터를 postgre DB에 입력한다.	
			tmp = map.getCmmnMap("aa");
			if(tmp != null) {
//				log.debug(">>> tmp : " + tmp.toString());
				cmmnDao.insert("batch.insertImgVideoInfo", tmp);
			}
		}
	}
	
	public void pullImgVideoFileFromHdfs() {
		
		// 
		List<CmmnMap> dataList = cmmnDao.selectList("batch.getHadoopFileStorTargetList");
		for(CmmnMap data : dataList) {
			
			try {
				String hdfs_file_stre_cours_nm = data.getString("hdfs_file_stre_cours_nm");
				
				String uploadRelativePath = hdfs_file_stre_cours_nm.substring("/user/hive/filedata".length(), hdfs_file_stre_cours_nm.lastIndexOf("/")+1);
				String stor_file_nm = UuidUtil.getUuidOnlyString();
				data.put("stor_file_nm", stor_file_nm);
				String orgFileNm = data.getString("filename");
				
				String uploadPath = StringUtil.join(settingProperties.getUploadRootPath(), uploadRelativePath); // 파일저장경로
				String fileExt = orgFileNm.substring(orgFileNm.lastIndexOf(".") + 1); // 파일확장자
				
				File filePath = new File(uploadPath);
				if (!filePath.exists()) {
					filePath.mkdirs();
					if (!StringUtil.equals("local", settingProperties.getRunEnv())) {
						CmmnUtil.shellCmd("cd " + settingProperties.getUploadRootPath());
						log.debug(">>> execute shell : cd " + settingProperties.getUploadRootPath());
						CmmnUtil.shellCmd("chmod -R 774 ./");
						log.debug(">>> execute shell : chmod -R 774 ./");				
					}
				}
				String fileFullPath = StringUtil.join(uploadPath, stor_file_nm);
				
				Configuration conf = new Configuration();
				Path remotepath = new Path(hdfs_file_stre_cours_nm);
				
				try {
					conf.set(CommonConfigurationKeysPublic.FS_DEFAULT_NAME_KEY, "hdfs://10.29.10.184:8020");
					writeHdfsFile(conf, remotepath, fileFullPath);
				} catch(IOException e1) {
					try {
						conf.set(CommonConfigurationKeysPublic.FS_DEFAULT_NAME_KEY, "hdfs://10.29.10.183:8020");
						writeHdfsFile(conf, remotepath, fileFullPath);
					} catch(IOException e2) {
						log.error(CmmnUtil.getExceptionStackTrace(e1));
						log.error(CmmnUtil.getExceptionStackTrace(e2));
						continue;
					}
				}
				
				cmmnDao.update("batch.updateHadoopFileStorInfo", data);

				
				CmmnMap fileInfo = new CmmnMap();
				fileInfo.put("stor_file_nm", stor_file_nm);
				fileInfo.put("file_ext", fileExt);
				fileInfo.put("upload_path", uploadPath);
				fileInfo.put("path", uploadRelativePath);
				fileInfo.put("org_file_nm", orgFileNm);
				fileInfo.put("file_size", "");
				fileInfo.put("content_type", "");

				// 파일메타정보를 관리하는 테이블에 해당정보를 삽입
				cmmnDao.insert("common.insertFileInfo", fileInfo);
			}  catch(Exception e) {
				log.error(CmmnUtil.getExceptionStackTrace(e));
				continue;
			}
		}
	}
	
	private void writeHdfsFile(Configuration conf, Path remotepath, String fileFullPath) throws IOException {
		File file = new File(fileFullPath);
		try(FileSystem fs = FileSystem.get(conf);
				FSDataInputStream is = fs.open(remotepath);
				FileOutputStream fo = new FileOutputStream(file);
				){
			int read;
			byte[] bytes = new byte[1024];
			while((read = is.read(bytes)) != -1) {
				fo.write(bytes, 0, read);
			}
			CmmnUtil.shellCmd("chmod 644 " + fileFullPath);
		}
	}

	public void hdfs_test() {
		String uploadPath = "/NAS/file/sht/hdfs_test/";

		File filePath = new File(uploadPath);
		if (!filePath.exists()) {
			filePath.mkdirs();
			if (!StringUtil.equals("local", settingProperties.getRunEnv())) {
				CmmnUtil.shellCmd("cd " + settingProperties.getUploadRootPath());
				log.debug(">>> execute shell : cd " + settingProperties.getUploadRootPath());
				CmmnUtil.shellCmd("chmod -R 774 ./");
				log.debug(">>> execute shell : chmod -R 774 ./");				
			}
		}
		
		String fileFullPath = uploadPath + "hdfs_test_file";
		
		Configuration conf = new Configuration();
		String hdfs_file_stre_cours_nm = "/user/hive/filedata/file_cs_ism_002/20211025/20191218000000000015_3598";
		Path remotepath = new Path(hdfs_file_stre_cours_nm);
		
		try {
			conf.set(CommonConfigurationKeysPublic.FS_DEFAULT_NAME_KEY, "hdfs://10.29.10.184:8020");
			writeHdfsFile(conf, remotepath, fileFullPath);
		} catch(IOException e1) {
			try {
				conf.set(CommonConfigurationKeysPublic.FS_DEFAULT_NAME_KEY, "hdfs://10.29.10.183:8020");
				writeHdfsFile(conf, remotepath, fileFullPath);
			} catch(IOException e2) {
				log.error(CmmnUtil.getExceptionStackTrace(e1));
				log.error(CmmnUtil.getExceptionStackTrace(e2));
			}
		}
	}

	public String hive_max_test() {
		
		// postgre DB에 저장된 가장 최신 업데이트 날자를 가지고 온다.
		String maxLastUpdtDt = cmmnDao.selectOne("batch.getHadoopFileInfoMaxLastUpdtDt");
		if(maxLastUpdtDt == null) maxLastUpdtDt = "";
		
		// postgre DB에 저장된 가장 최신 업데이트 날자를 가지고 온다.
		String maxLastUpdtDt_2 = cmmnDao.selectOne("batch.getHadoopFileInfoMaxLastUpdtDt_2");
		if(maxLastUpdtDt_2 == null) maxLastUpdtDt_2 = "";
		
		List<String> targetFileExtList = new ArrayList<String>();
		targetFileExtList.add(".png");
		targetFileExtList.add(".jpeg");
		targetFileExtList.add(".jpg");
		targetFileExtList.add(".gif");
		targetFileExtList.add(".bmp");
		targetFileExtList.add(".mp4");
		targetFileExtList.add(".avi");
		targetFileExtList.add(".mov");
		
		CmmnMap params = new CmmnMap()
				.put("maxLastUpdtDt", maxLastUpdtDt)
				.put("targetFileExtList", targetFileExtList) // 가지고 올 대상 확장자를 지정한다.
				;
		
		// postgre DB에 저장된 가장 최신 업데이트 날자 이후의 데이터를 
		// hadoop에서 가지고 온다.
		List<CmmnMap> dataList = hiveDao.selectList("batch.getHadoopFileList", params);
		
		params.put("maxLastUpdtDt", maxLastUpdtDt_2);
		List<CmmnMap> dataList2 = hiveDao.selectList("batch.getHadoopFileList", params);
		
		CmmnMap rslt = new CmmnMap()
				.put("rslt_cnt_1", dataList.size())
				.put("rslt_cnt_2", dataList2.size())
				;
		
		return JsonUtil.toJsonStr(rslt);
	}
	
}
