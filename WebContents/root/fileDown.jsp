<%@ page language="java" contentType="text/html; charset=UTF-8" %>

<%@ page import="java.io.*"%>
<%@ page import="java.text.*" %>
<%@ page import="java.lang.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.net.*" %>
<%@ page import="org.slf4j.Logger" %>
<%@ page import="org.slf4j.LoggerFactory" %>





<%
	Logger logger = LoggerFactory.getLogger(this.getClass());
	String fId = request.getParameter("fId") == null ? "" : request.getParameter("fId");
	request.setCharacterEncoding("UTF-8");

	// 파일 업로드된 경로
	String root = request.getSession().getServletContext().getRealPath("/");
	String savePath = root + "/static_resources/download/";
	// 서버에 실제 저장된 파일명
	String filename = null;
	// 실제 내보낼 파일명
	String orgfilename = null;

	if("chrome".equals(fId)) {
		filename = "ChromeStandaloneSetup64.exe";
		orgfilename = "ChromeStandaloneSetup64.exe";
	} else if("guide".equals(fId)) {
        filename = "_이용가이드.hwp";
        orgfilename = "이용가이드.hwp";
    }

	InputStream in = null;
	OutputStream os = null;
	File file = null;
	boolean skip = false;
	String client = "";
	
	try {
		// 파일을 읽어 스트림에 담기
		try {
			file = new File(savePath, filename);
			in = new FileInputStream(file);
		} catch (FileNotFoundException fe) {
// 			fe.printStackTrace();
            logger.error("파일 처리 오류 : " + fe.getMessage());
			skip = true;
		}
		client = request.getHeader("User-Agent");

		// 파일 다운로드 헤더 지정
//		response.reset();
		response.setContentType("application/octet-stream");
		response.setHeader("Content-Description", "JSP Generated Data");

		if(!skip) {
//			// IE
//			if(client.indexOf("MSIE") != -1){
//				orgfilename = URLEncoder.encode(orgfilename,"UTF-8").replaceAll("\\+", "%20");
//				response.setHeader("Content-Disposition", "attachment; filename=\"" + orgfilename + "\"");
//
//				orgfilename = new String(orgfilename.getBytes("utf-8"),"iso-8859-1");
//				response.setHeader ("Content-Disposition", "attachment; filename="+new String(orgfilename.getBytes("KSC5601"),"ISO8859_1"));
//			}else{
//				// 한글 파일명 처리
//				orgfilename = new String(orgfilename.getBytes("utf-8"),"iso-8859-1");
//				response.setHeader("Content-Disposition", "attachment; filename=\"" + orgfilename + "\"");
//				response.setHeader("Content-Type", "application/octet-stream; charset=utf-8");
//			}

			orgfilename = URLEncoder.encode(orgfilename, "UTF-8").replaceAll("\\+", "%20");
			response.setHeader("Content-Disposition", "attachment; filename=\"" + orgfilename + "\"");
			response.setHeader("Content-Length", "" + file.length());
			out.clear();
			pageContext.pushBody();

			os = response.getOutputStream();
			byte b[] = new byte[(int) file.length()];
			int leng = 0;

			while ((leng = in.read(b)) > 0) {
				os.write(b, 0, leng);
			}
		} else {
			response.setContentType("text/html;charset=UTF-8");
			out.println("<script language='javascript'>");
// 			out.println("	console.log('savePath', '" + savePath + "')");
			out.println("	console.log('filename', '" + filename + "')");
			out.println("	alert('파일을 찾을 수 없습니다');");
			out.println("	history.back();");
			out.println("</script>");
		}
	} catch (FileNotFoundException e) {
// 		e.printStackTrace();
		logger.error("파일 처리 오류 : " + e.getMessage());
	} finally {
		if(os != null) {
			os.close();
		}
		
		if(in != null) {
			in.close();
		}
	}
%>