package common.utils.common;

import java.util.List;

public class ConfigExcelDn {

	String fileName;
	
	String sheetName;
	
	List<String> columnsInfo;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getSheetName() {
		return sheetName;
	}

	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}

	public List<String> getColumnsInfo() {
		return columnsInfo;
	}

	public void setColumnsInfo(List<String> columnsInfo) {
		this.columnsInfo = columnsInfo;
	}

	@Override
	public String toString() {
		return "ConfigExcelDn [fileName=" + fileName + ", sheetName=" + sheetName + ", columnsInfo=" + columnsInfo
				+ "]";
	}
	
}
