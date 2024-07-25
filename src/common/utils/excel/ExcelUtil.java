package common.utils.excel;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExcelUtil {
	
	private final Logger log = LoggerFactory.getLogger(getClass());
	
//	public static final HashMap<String, Integer> coltable = new HashMap<String, Integer>(){/**
//		 * 
//		 */
//		private static final long serialVersionUID = 1L;
//
//	{
//		put("A",0);
//		put("B",1);
//		put("C",2);
//		put("D",3);
//		put("E",4);
//		put("F",5);
//		put("G",6);
//		put("H",7);
//		put("I",8);
//		put("J",9);
//		put("K",10);
//		put("L",11);
//		put("M",12);
//		put("N",13);
//		put("O",14);
//		put("P",15);
//		put("Q",16);
//		put("R",17);
//		put("S",18);
//		put("T",19);
//		put("U",20);
//		put("V",21);
//		put("W",22);
//		put("X",23);
//		put("Q",24);
//		put("R",25);
//	}};
//
//	public static Workbook getWorkbook(File excelfile) {
//
//		Workbook wb = null;
//		/*
//		 * FileInputStream은 파일의 경로에 있는 파일을 읽어서 Byte로 가져온다.
//		 * 
//		 * 파일이 존재하지 않는다면은 RuntimeException이 발생된다.
//		 */
//		try (FileInputStream fis = new FileInputStream(excelfile)) {
//			/*
//			 * 파일의 확장자를 체크해서 .XLS 라면 HSSFWorkbook에 .XLSX라면 XSSFWorkbook에 각각 초기화 한다.
//			 */
//			if (excelfile.getName().toLowerCase(Locale.KOREA).endsWith(".xls")) {
//				try {
//					wb = new HSSFWorkbook(fis);
//				} catch (IOException e) {
//					throw new RuntimeException(e.getMessage(), e);
//				}
//			} else if (excelfile.getName().toLowerCase(Locale.KOREA).endsWith(".xlsx")) {
//				try {
//					wb = new XSSFWorkbook(fis);
//				} catch (IOException e) {
//					throw new RuntimeException(e.getMessage(), e);
//				}
//			}
//		} catch (FileNotFoundException e) {
//			throw new RuntimeException(e.getMessage(), e);
//		} catch (IOException e1) {
//			log.error(CmmnUtil.getExceptionStackTrace(e1));
//		}
//
//		return wb;
//
//	}
//
//	// Excel Upload시에 데이터를 얻어옵니다.
//	public static String cellValue(Cell cell) {
//
//		
//		
//		
//		String value = "";
//		if (cell != null) {
//			switch (cell.getCellType()) { // cell 타입에 따른 데이타 저장
//			case FORMULA:
//				value = cell.getCellFormula();
//				break;
//			case NUMERIC:
//				if (DateUtil.isCellDateFormatted(cell)) {
//					// you should change this to your application date format
//					SimpleDateFormat objSimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.KOREA);
//					value = objSimpleDateFormat.format(cell.getDateCellValue());
//				} else {
//					value = String.format("%.0f", new Double(cell.getNumericCellValue()));
//				}
//				break;
//			case STRING:
//				value = cell.getStringCellValue();
//				break;
//			case BLANK:
//				value = "";
//				break;
//			default:
//				value = "";
//			}
//		}
//
//		return value.trim();
//	}
//	
//	public static int getXlsColIdx(String exlCol) {
//		
//		exlCol = exlCol.toUpperCase().trim();
//		int exlColLen = exlCol.length();
//		int rslt = 0;
//		for(int i=0; i<exlColLen; i++) {
//			rslt += 26*(exlColLen-1-i) + coltable.get(String.valueOf(exlCol.charAt(i)));
//		}
//		return rslt;
//	}
}
