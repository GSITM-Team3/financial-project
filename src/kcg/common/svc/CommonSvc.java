package kcg.common.svc;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import common.config.properties.SettingProperties;
import common.dao.CmmnDao;
import common.dao.IamDao;
import common.exception.UserBizException;
import common.utils.common.CmmnMap;
import common.utils.common.CmmnUtil;
import common.utils.common.PagingConfig;
import common.utils.common.PagingConfigOrder;
import common.utils.mybatis_paginator.domain.PageList;
import common.utils.string.StringUtil;
import common.utils.uuid.UuidUtil;
import kcg.common.util.KcgConstants;
import kcg.login.vo.UserInfoVO;

@Service
public class CommonSvc {
	
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	HttpServletRequest request;

	@Autowired
	SettingProperties settingProperties;

	@Autowired
	CmmnDao cmmnDao;
	
	@Autowired
	IamDao iamDao;	
	
	@Autowired
	CommonCacheSvc commonCacheSvc;

	/**
	 * 파일을 실제로 저장하는 함수
	 * 
	 * @param multipartFile
	 * @param uploadRelativePath 업로드할 루트경로의 상대경로
	 * @return
	 */
	public CmmnMap uploadFile(MultipartFile multipartFile, String uploadRelativePath) {

		String uploadPath = StringUtil.join(settingProperties.getUploadRootPath(), uploadRelativePath); // 파일저장경로
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

		String CONTENT_TYPE = multipartFile.getContentType();
		String storFileNm = UuidUtil.getUuidOnlyString(); // 저장파일명
		String orgFileNm = multipartFile.getOriginalFilename(); // 원시파일명
		orgFileNm = orgFileNm.replaceAll(" ", "_");

		log.debug(">>> CONTENT_TYPE : " + CONTENT_TYPE);

		String fileExt = orgFileNm.substring(orgFileNm.lastIndexOf(".") + 1); // 파일확장자
		if (fileExt.length() < 3 || fileExt.length() > 4) {
			throw new UserBizException("업로드가 불가한 파일입니다.");
		}

		String[] fileExtArry = settingProperties.getUploadDenyExtList().split(",");
		for (String str : fileExtArry) {
			if (str.equalsIgnoreCase(fileExt)) {
				throw new UserBizException("확장자(" + fileExt + ")파일은 업로드가 불가합니다.");
			}
		}

		String uploadMaxSize;
		if ("mp4".equalsIgnoreCase(fileExt)) {
			uploadMaxSize = settingProperties.getUploadVideoMaxSize(); // 동영상 파일업로드 최대사이즈
		} else {
			uploadMaxSize = settingProperties.getUploadMaxSize(); // 파일업로드 최대사이즈
		}
		long fileSize = multipartFile.getSize(); // 파일크기

		if (fileSize > Long.parseLong(uploadMaxSize)) {
			throw new UserBizException(StringUtil.join("업로드 파일크기가 ",
					uploadMaxSize.substring(0, uploadMaxSize.length() - 6), "MByte를 초과할 수 없습니다."));
		}

		String fileFullPath = StringUtil.join(uploadPath, storFileNm);
		File file = new File(fileFullPath);
		try {
			multipartFile.transferTo(file);
			if (!StringUtil.equals("local", settingProperties.getRunEnv())) {
				
				CmmnUtil.shellCmd("chmod 644 " + fileFullPath);
			}
		} catch (IOException e) {
			log.error(CmmnUtil.getExceptionStackTrace(e));
			throw new UserBizException("파일업로드를 실패했습니다.");
		}

		CmmnMap fileInfo = new CmmnMap();
		fileInfo.put("stor_file_nm", storFileNm);
		fileInfo.put("file_ext", fileExt);
		fileInfo.put("upload_path", uploadPath);
		fileInfo.put("path", uploadRelativePath);
		fileInfo.put("org_file_nm", orgFileNm);
		fileInfo.put("file_size", fileSize);
		fileInfo.put("content_type", CONTENT_TYPE);

		// 파일메타정보를 관리하는 테이블에 해당정보를 삽입
		cmmnDao.insert("common.insertFileInfo", fileInfo);

		return fileInfo;
	}

	/**
	 * 실제파일저장함수. (확장자와 함께 저장한다.)
	 * @param multipartFile
	 * @param uploadRelativePath
	 * @return
	 */
	public CmmnMap uploadFileWithExt(MultipartFile multipartFile, String uploadRelativePath) {

		String uploadPath = StringUtil.join(settingProperties.getUploadRootPath(), uploadRelativePath); // 파일저장경로
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

		String CONTENT_TYPE = multipartFile.getContentType();
//		String storFileNm = UuidUtil.getUuidOnlyString(); // 저장파일명
		String orgFileNm = multipartFile.getOriginalFilename(); // 원시파일명
		orgFileNm = orgFileNm.replaceAll(" ", "_");

		log.debug(">>> CONTENT_TYPE : " + CONTENT_TYPE);

		String fileExt = orgFileNm.substring(orgFileNm.lastIndexOf(".") + 1); // 파일확장자
		
		
		String storFileNm = new StringBuilder().append(UuidUtil.getUuidOnlyString()).append('.').append(fileExt).toString(); // 저장파일명
		
		
		if (fileExt.length() < 3 || fileExt.length() > 4) {
			throw new UserBizException("업로드가 불가한 파일입니다.");
		}

		String[] fileExtArry = settingProperties.getUploadDenyExtList().split(",");
		for (String str : fileExtArry) {
			if (str.equalsIgnoreCase(fileExt)) {
				throw new UserBizException("확장자(" + fileExt + ")파일은 업로드가 불가합니다.");
			}
		}

		String uploadMaxSize;
		if ("mp4".equalsIgnoreCase(fileExt)) {
			uploadMaxSize = settingProperties.getUploadVideoMaxSize(); // 동영상 파일업로드 최대사이즈
		} else {
			uploadMaxSize = settingProperties.getUploadMaxSize(); // 파일업로드 최대사이즈
		}
		long fileSize = multipartFile.getSize(); // 파일크기

		if (fileSize > Long.parseLong(uploadMaxSize)) {
			if("mp4".equalsIgnoreCase(fileExt)) {
				throw new UserBizException("업로드 파일크기가 150MB를 초과할 수 없습니다.");
			}else {
				throw new UserBizException("업로드 파일크기가 10MB를 초과할 수 없습니다.");
			}
			/*throw new UserBizException(StringUtil.join("업로드 파일크기가 ",
					uploadMaxSize.substring(0, uploadMaxSize.length() - 6), "MByte를 초과할 수 없습니다."));*/
		}

		String fileFullPath = StringUtil.join(uploadPath, storFileNm);
		File file = new File(fileFullPath);
		try {
			multipartFile.transferTo(file);
			if (!StringUtil.equals("local", settingProperties.getRunEnv())) {
				
				CmmnUtil.shellCmd("chmod 644 " + fileFullPath);
			}
		} catch (IOException e) {
			log.error(CmmnUtil.getExceptionStackTrace(e));
			throw new UserBizException("파일업로드를 실패했습니다.");
		}

		CmmnMap fileInfo = new CmmnMap();
		fileInfo.put("stor_file_nm", storFileNm);
		fileInfo.put("file_ext", fileExt);
		fileInfo.put("upload_path", uploadPath);
		fileInfo.put("path", uploadRelativePath);
		fileInfo.put("org_file_nm", orgFileNm);
		fileInfo.put("file_size", fileSize);
		fileInfo.put("content_type", CONTENT_TYPE);

		// 파일메타정보를 관리하는 테이블에 해당정보를 삽입
		cmmnDao.insert("common.insertFileInfo", fileInfo);

		return fileInfo;
	}
	
	/**
	 * 이미지파일을 base64 코드로 변환
	 * @param stor_file_nm
	 * @return
	 */
	public CmmnMap convertImg2Base64(String stor_file_nm) {
    	
    	String retStr = "";

		CmmnMap fileInfo = cmmnDao.selectOne("common.selectFileInfo", stor_file_nm);

		String upload_path = fileInfo.getString("upload_path");
		String fileFullPath = new StringBuilder()
				.append(upload_path)
				.append(stor_file_nm)
				.toString();
    	    	
		try(FileInputStream fis = new FileInputStream(fileFullPath)) {
			ByteArrayOutputStream bao = new ByteArrayOutputStream(); 
			
			int len = 0;
			byte[] buf = new byte[1024];
			
			while((len=fis.read(buf)) != -1) {
				
				bao.write(buf, 0, len);;
				
			}
			
			byte[] fileArry = bao.toByteArray();
			
			retStr = new String(Base64.encodeBase64(fileArry));
			
		}catch (IOException e) {
			retStr = "";
			log.debug("error"+ e.getStackTrace());
		}
    	
        return new CmmnMap()
        		.put("data", retStr)
        		.put("file_ext", fileInfo.getString("file_ext"));
	}

	/**
	 * 첨부파일 다운로드 함수
	 * 
	 * @param stor_file_nm 실제저장된 파일명
	 * @param response
	 */
	public void attachmentDownload(String stor_file_nm, HttpServletResponse response) {
		
		if(stor_file_nm.indexOf("/") != -1 || stor_file_nm.indexOf("\\") != -1) {
			throw new UserBizException("경로조작문자 확인");
		}
		
		CmmnUtil.getBrowser(request);

		CmmnMap fileInfo = cmmnDao.selectOne("common.selectFileInfo", stor_file_nm);

		
		
		String upload_path = settingProperties.getUploadRootPath() + fileInfo.getString("path");
		String fileFullPath = new StringBuilder()
				.append(upload_path)
				.append(stor_file_nm)
				.toString();

		File file = new File(fileFullPath);

		String org_file_nm = fileInfo.getString("org_file_nm");
		try {
			org_file_nm = URLEncoder.encode(org_file_nm, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			log.error(CmmnUtil.getExceptionStackTrace(e));
			throw new UserBizException("파일다운로드중 오류가 발생했습니다.");
		}

		String contentDisposition;
		// 아이폰 사파리에서 다운로드 파일명 깨짐현상 이슈 해결
		if("Safari".equals(CmmnUtil.getBrowser(request))) {
			contentDisposition = StringUtil.join("attachment; filename=\"", org_file_nm, "\"; filename*=UTF-8''", org_file_nm);
		} else {
			contentDisposition = StringUtil.join("attachment; filename=\"", org_file_nm, "\";");
		}

		response.setHeader("Pragma", "no-cache");
		response.setHeader("Expires", "0");
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition", contentDisposition);

		String fileExt = org_file_nm.substring(org_file_nm.lastIndexOf(".") + 1); // 파일확장자
		if ("gif".equalsIgnoreCase(fileExt)) {
			response.setContentType("image/gif");
		} else if ("png".equalsIgnoreCase(fileExt)) {
			response.setContentType("image/png");
		} else if ("jpeg".equalsIgnoreCase(fileExt) || "jpg".equalsIgnoreCase(fileExt)) {
			response.setContentType("image/jpeg");
		} else if ("bmp".equalsIgnoreCase(fileExt)) {
			response.setContentType("image/bmp");
		} else if ("pdf".equalsIgnoreCase(fileExt)) {
			response.setContentType("application/pdf");
		} else {
			response.setContentType("application/octet-stream");
		}

		byte[] b = new byte[1000000];
		try (BufferedInputStream fin = new BufferedInputStream(new FileInputStream(file));
				BufferedOutputStream outs = new BufferedOutputStream(response.getOutputStream())) {
			int read = 0;

			while (true) {
				read = fin.read(b);
				if (read == -1) {
					break;
				}
				outs.write(b, 0, read);
			}
		} catch (IOException e) {
			log.error(CmmnUtil.getExceptionStackTrace(e));

			try (BufferedOutputStream outs = new BufferedOutputStream(response.getOutputStream());) {
				outs.write(Base64.decodeBase64(KcgConstants.NOIMAGE));
			} catch (IOException e1) {
				log.error(CmmnUtil.getExceptionStackTrace(e1));
			}
			;
		}
	}
	
	
	public void csvDownload(List<CmmnMap> dataList, CmmnMap csvConfig, HttpServletResponse response){
		
		// 예시 : {"NO.", "컬럼 영문명", "컬럼 한글명", "비식별대상여부", "데이터 타입", "데이터 길이", "하이브적재 컬럼 영문명", "하이브 데이터 타입", "Null 여부", "PK여부", "비고"}
		String[] headerAry = (String[]) csvConfig.get("headerAry");
		// 예시 : {"rownum", "table_atrb_eng_nm", "table_korean_atrb_nm", "dstng_trget_at", "table_atrb_ty_nm", "table_atrb_lt_value", "hive_col_nm", "hive_atrb_ty_nm", "table_atrb_null_posbl_at", "table_atrb_pk_at", "table_atrb_dc"}
		String[] columnAry = (String[]) csvConfig.get("columnAry");	
		try {		
			log.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			log.debug(">>>>>>>>>>>>>>>>>>>>  headerAry");
			String str;
			for(int i=0; i< headerAry.length;i++) {
				 str =  headerAry[i];
				log.debug(">>> " + str);
				
				//headerAry[i] = new String(str.getBytes(),"MS949");
			}
				
			log.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			log.debug(">>>>>>>>>>>>>>>>>>>>  columnAry");
//			for(String str1 : columnAry) {
//				log.debug(">>> " + str1);
//			}
			
			for(int i=0; i< columnAry.length;i++) {
				 str =  columnAry[i];
				log.debug(">>> " + str);
				
				//columnAry[i] = new String(str.getBytes(),"MS949");
			}
		} catch (Exception e) {
			log.error(CmmnUtil.getExceptionStackTrace(e));
			throw new UserBizException("CSV 파일 다운로드중 오류가 발생했습니다.");
		}
		
		// 예시 : "mm_iem_001-SIM_YEAR_MAINT_PLAN_INFO_20210823162312.csv"
		String filename = csvConfig.getString("filename");

		StringWriter sw = new StringWriter();
		try (CSVPrinter csvPrinter = new CSVPrinter(sw, CSVFormat.DEFAULT.withHeader(headerAry))) {
			for (CmmnMap data : dataList) {
				List<String> list = new ArrayList<>();
				for (String column : columnAry) {
					//list.add(new String(data.getString(column).getBytes(),"MS949"));
					list.add(new String(data.getString(column)));
				}
				csvPrinter.printRecord(list);
			}
			sw.flush();
			byte[] b = sw.toString().getBytes("MS949");

			String contentDisposition;			
 
			 String browserTyp = CmmnUtil.getBrowser(request);
			 if("MSIE".equals(browserTyp)) {
				 String fileNameOrg = URLEncoder.encode(filename,"UTF-8").replaceAll("\\+", "%20");
				 contentDisposition = StringUtil.join("attachment; filename=\"", fileNameOrg, "\";");
			 } else if("Safari".equals(browserTyp)) {	// 아이폰 사파리에서 다운로드 파일명 깨짐현상 이슈 해결			
				contentDisposition = StringUtil.join("attachment; filename=\"", filename, "\"; filename*=UTF-8''", filename);				
			} else {					
				String fileNameOrg = new String(filename.getBytes("UTF-8"), "ISO-8859-1");
            	contentDisposition = StringUtil.join("attachment; filename=\"", fileNameOrg, "\";");				
			}			
			response.setContentLength(b.length);
			response.setHeader("Content-Disposition", contentDisposition);
			//response.setContentType("plain/text");
			response.setContentType("text/csv; charset=MS949");
			
			try (BufferedInputStream fin = new BufferedInputStream(new ByteArrayInputStream(b));
					BufferedOutputStream outs = new BufferedOutputStream(response.getOutputStream())) {
				int read = 0;

				while (true) {
					read = fin.read(b);
					if (read == -1) {
						break;
					}
					outs.write(b, 0, read);
				}
				fin.close();
				outs.flush();
				outs.close();
			}
			
		} catch (IOException e) {
			log.error(CmmnUtil.getExceptionStackTrace(e));
			throw new UserBizException("CSV 파일 다운로드중 오류가 발생했습니다.");
		}
	}
	
	

	/**
	 * 업로드된 파일을 삭제하는 함수
	 * 
	 * @param stor_file_nm
	 */
	public void deleteFile(String stor_file_nm) {
		CmmnMap fileInfo = cmmnDao.selectOne("common.selectFileInfo", stor_file_nm);

		String upload_path = fileInfo.getString("upload_path");
		String fileFullPath = new StringBuilder()
				.append(upload_path)
				.append(stor_file_nm)
				.toString();

		File file = new File(fileFullPath);
		if (!file.exists() || !file.isFile()) {
			throw new UserBizException("파일이 존재하지 않습니다.");
		}
		file.delete();

		HttpSession session = request.getSession();
		String usr_id = StringUtil.defaultString((String) session.getAttribute("usr_id"), "NO_USER");

		// 파일메타정보를 관리하는 테이블에 해당정보를 업데이트
		CmmnMap params = new CmmnMap().put("usr_id", usr_id).put("stor_file_nm", stor_file_nm);

		cmmnDao.update("common.deleteFileInfo", params);
	}

	public boolean chkFileExist(CmmnMap params) {
		String stor_file_nm = params.getString("stor_file_nm");
		CmmnMap fileInfo = cmmnDao.selectOne("common.selectFileInfo", stor_file_nm);
		if (fileInfo == null) {
			return false;
		}

		String upload_path = fileInfo.getString("upload_path");
		String fileFullPath = new StringBuilder()
				.append(upload_path)
				.append(stor_file_nm)
				.toString();

		File file = new File(fileFullPath);
		if (!file.exists() || !file.isFile()) {
			return false;
		}

		return true;
	}

	public CmmnMap getFileInfo(String stor_file_nm) {
		return cmmnDao.selectOne("common.selectFileInfo", stor_file_nm);
	}

	public void pdfObject(String stor_file_nm, HttpServletResponse response) {

		if(stor_file_nm.indexOf("/") != -1 || stor_file_nm.indexOf("\\") != -1) {
			throw new UserBizException("경로조작문자 확인");
		}
		
		CmmnMap fileInfo = cmmnDao.selectOne("common.selectFileInfo", stor_file_nm);
		String upload_path = fileInfo.getString("upload_path");
		String fileFullPath = new StringBuilder()
				.append(upload_path)
				.append(stor_file_nm)
				.toString();

		File file = new File(fileFullPath);

		String org_file_nm = fileInfo.getString("org_file_nm");
		try {
			org_file_nm = URLEncoder.encode(org_file_nm, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			log.error(CmmnUtil.getExceptionStackTrace(e));
			throw new UserBizException("파일다운로드중 오류가 발생했습니다.");
		}

		response.setHeader("Pragma", "no-cache");
		response.setHeader("Expires", "0");
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition", "JSP Generated Data");
		response.setContentType("application/pdf");
		
		byte[] b = new byte[1000000];
		try (BufferedInputStream fin = new BufferedInputStream(new FileInputStream(file));
				BufferedOutputStream outs = new BufferedOutputStream(response.getOutputStream())) {
			int read = 0;

			while (true) {
				read = fin.read(b);
				if (read == -1) {
					break;
				}
				outs.write(b, 0, read);
			}
		} catch (IOException e) {
			log.error(CmmnUtil.getExceptionStackTrace(e));

			try (BufferedOutputStream outs = new BufferedOutputStream(response.getOutputStream());) {
				outs.write(Base64.decodeBase64(KcgConstants.NOIMAGE));
			} catch (IOException e1) {
				log.error(CmmnUtil.getExceptionStackTrace(e1));
			};
		}
	}

	public UserInfoVO getLoginInfo() {
		
		return (UserInfoVO) request.getSession().getAttribute("userInfoVO");
	}
	
	/**
	 * 공통코드 가지고 오기
	 * @param mstCd 가지고 올 마스터코드
	 * @param isSortByName 이름순으로 정렬할지 여부
	 * @return
	 */
	public List<CmmnMap> getCmmnCdList(String code_grp_id, boolean isSortByName) {
		
		List<CmmnMap> allCmmnCd = commonCacheSvc.getAllCmmnCdCache();
		
		List<CmmnMap> rslt = allCmmnCd.stream().filter(a -> code_grp_id.equals(a.getString("code_grp_id"))).collect(Collectors.toList());
		if(isSortByName) {
			return rslt.stream().sorted((a, b) -> a.getString("code_nm").compareTo(b.getString("code_nm"))).collect(Collectors.toList());
		} else {
			return rslt.stream().sorted((a, b) -> a.getString("code_id").compareTo(b.getString("code_id"))).collect(Collectors.toList());
		}
	}
	
	/**
	 * 모든 캐시 지우기
	 */
	public void clearAllCache() {
		commonCacheSvc.clearAllCmmnCdCach();
	}

	public CmmnMap getPagingInfoContinue() {
		HttpSession session = request.getSession();
		
		String fromDtl = request.getParameter("fromDtl");
		CmmnMap pagingInfo;
		if("Y".equals(fromDtl)) {
			pagingInfo = (CmmnMap) session.getAttribute("pagingInfo");
		} else {
			pagingInfo = null;
		}
		session.removeAttribute("pagingInfo");
		return pagingInfo;
	}

	public void setPagingInfoContinue(CmmnMap params, PagingConfig pagingConfig) {
		HttpSession session = request.getSession();
		
		CmmnMap pagingInfo = new CmmnMap().put("params", params).put("pagingConfig", pagingConfig);
		session.setAttribute("pagingInfo", pagingInfo);
	}
	
	public void addStatisticCnt(String col_nm) {
		UserInfoVO userInfoVO = getLoginInfo();
		
		CmmnMap params = new CmmnMap()
				.put("col_nm", col_nm)
				.put("statistic_date", CmmnUtil.getTodayFormedString())
				.put("user_id", userInfoVO.getUserId());
				;
		
		CmmnMap info = cmmnDao.selectOne("common.getStatisticCnt", params);
		int cnt;
		if(info == null) {
			cnt = 1;
			params.put("col_nm_cnt", cnt);
			cmmnDao.insert("common.insertStatisticCnt", params);
		} else {
			cnt = info.getInt("cnt") + 1;
			params.put("col_nm_cnt", cnt);
			cmmnDao.update("common.updateStatisticCnt", params);
		}
		
		
	}

	/** 
	* 유저권한 정보 조회
	* @methodName : getUserAuthInfo 
	* @author : Irury Kang 
	* */
	public CmmnMap getUserAuthInfo() {
		CmmnMap params = new CmmnMap();
		UserInfoVO userInfoVO = getLoginInfo();
		params.put("user_id", userInfoVO.getUserId());
		
		CmmnMap info = cmmnDao.selectOne("common.getUserAuthInfo",params);
		
		return info;
	}	
	
	
	public void addKeywordCnt(String keyword) {
		
		CmmnMap params = new CmmnMap()
				.put("keyword", keyword.trim())
				.put("reg_date", CmmnUtil.getTodayFormedString())
				;
		
		CmmnMap tmp = cmmnDao.selectOne("common.getKeywordCnt", params);
		if(tmp == null) {
			cmmnDao.insert("common.insertKeywordCnt", params);
		} else {
			params.put("keyword_cnt", tmp.getInt("keyword_cnt") + 1);
			cmmnDao.update("common.updateKeywordCnt", params);
		}
	}	
	
	public void addReadCntBigdataTrend(String idx) {
		cmmnDao.update("common.addReadCntBigdataTrend", idx);
	}
	
	public void addReadCntInquire(String idx) {
		cmmnDao.update("common.addReadCntInquire", idx);
	}
	
	public void addReadCntLibrary(String idx) {
		cmmnDao.update("common.addReadCntLibrary", idx);
	}
	
	public void addReadCntNews(String idx) {
		cmmnDao.update("common.addReadCntNews", idx);
	}
	
	public void addReadCntAnalIdea(String idx) {
		cmmnDao.update("common.addReadCntAnalIdea", idx);
	}
	
	public void addReadCntDataVisualization(String idx) {
		cmmnDao.update("common.addReadCntDataVisualization", idx);
	}
	
	public void addReadCntUseExample(String idx) {
		cmmnDao.update("common.addReadCntUseExample", idx);
	}
	
	
	public int getNotiCnt() {
		return cmmnDao.selectOne("common.getNotiCnt", getLoginInfo().getUserId());
	}
	
	
	public PageList<CmmnMap> getNotiList(String pageNo){
		
		PagingConfigOrder order = new PagingConfigOrder();
		order.setIsAsc(false);
		order.setTarget("reg_dt");
		
		List<PagingConfigOrder> orders = Arrays.asList(order);
		
		PagingConfig pagingConfig = new PagingConfig();
		pagingConfig.setPageNo(pageNo);
		pagingConfig.setOrders(orders);
		pagingConfig.setLimit("5");
		
		
		String user_id = getLoginInfo().getUserId();
		CmmnMap params = new CmmnMap()
				.put("user_id", user_id)
				;
		PageList<CmmnMap> notiList = cmmnDao.selectListPage("common.getNotiList", params, pagingConfig);
		String req_cat, target_idx;
		for(CmmnMap noti : notiList) {
			target_idx = noti.getString("target_idx");
			req_cat = noti.getString("target_cat");
			if("download".equals(req_cat)) {
				CmmnMap info = cmmnDao.selectOne("common.getDownloadReqInfo", target_idx);
				noti.putAll(info);
				noti.put("url", "/mypage/reqDnldStatus/dtl?idx=" + target_idx);
			} else if("anal_tool".equals(req_cat)) {
				CmmnMap info = cmmnDao.selectOne("common.getAnalToolReqInfo", target_idx);
				noti.putAll(info);
				noti.put("url", "/mypage/reqAnalToolStatus/dtl?idx=" + target_idx);
			} else if("data_anal".equals(req_cat)) {
				CmmnMap info = cmmnDao.selectOne("common.getDataAnalReqInfo", target_idx);
				noti.putAll(info);
				noti.put("url", "/mypage/reqDataAnalStatus/dtl?idx=" + target_idx);
			} else if("data_collect".equals(req_cat)) {
				CmmnMap info = cmmnDao.selectOne("common.getDataCollectReqInfo", target_idx);
				noti.putAll(info);
				noti.put("url", "/mypage/reqDataCollectStatus/dtl?idx=" + target_idx);
			}
		}
		
		return notiList;
	}
	
	public void insertNotiInfo(String target_idx, String target_cat, String target_user_id) {
		
		deleteNotiInfo(target_idx);
		
		CmmnMap params = new CmmnMap()
				.put("target_idx", target_idx)
				.put("target_cat", target_cat)
				.put("target_user_id", target_user_id)
				;
		cmmnDao.insert("common.insertReqNoti", params);
	}
	
	public void deleteNotiInfo(String target_idx) {
		cmmnDao.delete("common.deleteNotiInfo", target_idx);
	}

	public void setNotiCnt() {
		request.getSession().setAttribute("notiCnt", getNotiCnt());
	}
	
	public List<CmmnMap> getSearchWordList(){
		return cmmnDao.selectList("common.getSearchWordList");
	}


	public String getTbleauTicket() {

		String tableauUrl = settingProperties.getTableauUrl();
		String username = settingProperties.getTableauUsername();

        OutputStreamWriter out = null;
        BufferedReader in = null;
        try {
        	log.debug(">>> tableauUrl : " + tableauUrl);
        	log.debug(">>> username : " + username);
            // Encode the parameters
            StringBuffer data = new StringBuffer();
            data.append(URLEncoder.encode("username", "UTF-8"));
            data.append("=");
            data.append(URLEncoder.encode(username, "UTF-8"));
            
            // Send the request
            URL url = new URL(tableauUrl + "/trusted");
            URLConnection conn = url.openConnection();
            conn.setDoOutput(true);
            out = new OutputStreamWriter(conn.getOutputStream());
            out.write(data.toString());
            out.flush();
            
            // Read the response
            StringBuffer rsp = new StringBuffer();
            in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line;
            while ( (line = in.readLine()) != null) {
                rsp.append(line);
            }
            
            String ticket = rsp.toString();
            
            log.debug(">>> result : " + ticket);
            
            if("-1".equals(ticket)) {
            	log.error(">>> 티켓취득실패!!! ");
            	throw new UserBizException("티켓취득실패!!!");
            }
            return ticket;
            
        } catch (IOException e) {
        	log.error(CmmnUtil.getExceptionStackTrace(e));
            throw new UserBizException("태블로 통신에러");
        }
        finally {
            try {
                if (in != null) in.close();
                if (out != null) out.close();
            }
            catch (IOException e) {
            	log.error(CmmnUtil.getExceptionStackTrace(e));
            }
        }
	}
}
