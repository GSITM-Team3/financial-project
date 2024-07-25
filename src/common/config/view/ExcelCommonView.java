package common.config.view;

import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.servlet.view.document.AbstractXlsView;

import common.utils.common.CmmnMap;
import common.utils.common.CmmnUtil;
import common.utils.common.ConfigExcelDn;
import common.utils.excel.ExcelDataProcess;
import common.utils.string.StringUtil;

public class ExcelCommonView extends AbstractXlsView {

	@Override
	protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		ConfigExcelDn configExcelDn = (ConfigExcelDn) model.get("configExcelDn");
		List<CmmnMap> dataList = (List<CmmnMap>) model.get("dataList");
		
		String fileName = StringUtil.join(configExcelDn.getFileName(), "_" , CmmnUtil.getTodayString(), CmmnUtil.getCurTime().substring(0,4));
		fileName = URLEncoder.encode(fileName, "UTF-8");
		
		ExcelDataProcess ExcelDataProcess = new ExcelDataProcess();
		ExcelDataProcess.process(configExcelDn, dataList, workbook);
		
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Content-Disposition", StringUtil.join("attachment;filename=", fileName, ".xls"));	
	}
}
