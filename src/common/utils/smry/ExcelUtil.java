/**
 * 
 */
package common.utils.smry;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/** 
* 
* @packageName : sample.ctl 
* @author : Irury Kang 
* @description : 
* 엑셀 관련 유틸
* =========================================================== 
* DATE AUTHOR NOTE 
* ----------------------------------------------------------- 
* 2021.09.08 irury Kang 최초 생성 */

public class ExcelUtil {
	public static  List<Map<String, String>> readExcel(String filePath,int sheetIdx){
		Workbook wb = getWorkbook(filePath);
		if(wb.getNumberOfSheets() < sheetIdx) {
			sheetIdx = 0; 
		}
		//첫번째 시트
		Sheet sheet = wb.getSheetAt(sheetIdx);
		
		/**
         * sheet에서 유효한(데이터가 있는) 행의 개수를 가져온다.
         */
        int numOfRows = sheet.getPhysicalNumberOfRows();
        int numOfCells = 0;

        Row row = null;
        Cell cell = null;
        
        String cellName = "";

        /**
         * 각 row마다의 값을 저장할 맵 객체
         * 저장되는 형식은 다음과 같다.
         * put("A", "이름");
         * put("B", "게임명");
         */
        Map<String, String> map = null;
        /*
         * 각 Row를 리스트에 담는다.
         * 하나의 Row를 하나의 Map으로 표현되며 List에는 모든 Row가 포함될 것이다.
         */
        List<Map<String, String>> result = new ArrayList<Map<String, String>>(); 
        /**
         * 각 Row만큼 반복을 한다.
         */
        for(int rowIndex = sheet.getFirstRowNum(); rowIndex < numOfRows; rowIndex++) {
            /*
             * 워크북에서 가져온 시트에서 rowIndex에 해당하는 Row를 가져온다.
             * 하나의 Row는 여러개의 Cell을 가진다.
             */
            row = sheet.getRow(rowIndex);
            
            if(row != null) {
                /*
                 * 가져온 Row의 Cell의 개수를 구한다.
                 */
                numOfCells = row.getPhysicalNumberOfCells();
                /*
                 * 데이터를 담을 맵 객체 초기화
                 */
                map = new HashMap<String, String>();
                /*
                 * cell의 수 만큼 반복한다.
                 */
                for(int cellIndex = 0; cellIndex < numOfCells; cellIndex++) {
                    /*
                     * Row에서 CellIndex에 해당하는 Cell을 가져온다.
                     */
                    cell = row.getCell(cellIndex);
                    /*
                     * 현재 Cell의 이름을 가져온다
                     * 이름의 예 : A,B,C,D,......
                     */
                    cellName = getCellName(cell, cellIndex);
                    /*
                     * map객체의 Cell의 이름을 키(Key)로 데이터를 담는다.
                     */
                    map.put(cellName, getCellValue(cell));
                }
                /*
                 * 만들어진 Map객체를 List로 넣는다.
                 */
                result.add(map);
                
            }
            
        }
        return result;
	}
	
   /** 
    * 엑셀파일을 읽어서Workbook객체를 리턴한다
	* XLS와 XLSX확장자를 비교한다.
	* @methodName : getWorkbook 
	* @author : Irury Kang 
	* */
	public static Workbook getWorkbook(String filePath) {
       /*
        * FileInputStream은 파일의 경로에 있는 파일을 읽어서 Byte로 가져온다.
        * 
        * 파일이 존재하지 않는다면 RutimeException이 발생한다.
        */
       FileInputStream fis = null;
       try {
           fis = new FileInputStream(filePath);
       } catch (FileNotFoundException e) {
           throw new RuntimeException(e.getMessage(), e);
       }
       
       /*
        * 파일의 확장자를 체크해서XLS라면 HSSWorkbook에 XLSX라면 XSSWorkbookr에 각각 초기화 한다
        */
       try {
           if(filePath.toUpperCase().endsWith(".XLS")) {
               try(Workbook wb = new HSSFWorkbook(fis)) {
            	   return wb;
               }
           }
           else if(filePath.toUpperCase().endsWith(".XLSX")) {
               try(Workbook wb = new XSSFWorkbook(fis)) {
            	   return wb;
               }
           } else {
        	   throw new RuntimeException("엑셀타입이 아닙니다.");
           }
       } catch (IOException e) {
           throw new RuntimeException(e.getMessage(), e);
       }
   }
	
	/** 
	* 셀 내 데이터값을 가져온다.
	* @methodName : getCellValue 
	* @author : Irury Kang 
	* */
	public static String getCellValue(Cell cell) {
        String value = "";
        
        if(cell == null) {
            value = "";
        }
        else {
            if( cell.getCellType() == CellType.FORMULA ) {
                value = cell.getCellFormula();
            }
            else if( cell.getCellType() == CellType.NUMERIC ) {
                value = cell.getNumericCellValue() + "";
            }
            else if( cell.getCellType() == CellType.STRING ) {
                value = cell.getStringCellValue();
            }
            else if( cell.getCellType() == CellType.BOOLEAN ) {
                value = cell.getBooleanCellValue() + "";
            }
            else if( cell.getCellType() == CellType.ERROR ) {
                value = cell.getErrorCellValue() + "";
            }
            else if( cell.getCellType() == CellType.BLANK ) {
                value = "";
            }
            else {
                value = cell.getStringCellValue();
            }
        }
        
        return value;
    }

	/**
     * Cell에 해당하는 Column Name을 가젼온다(A,B,C..)
     * 만약 Cell이 Null이라면 int cellIndex의 값으로 Column Name을 가져온다.
     * @param cell
     * @param cellIndex
     * @return
     */
    public static String getCellName(Cell cell, int cellIndex) {
        int cellNum = 0;
        if(cell != null) {
            cellNum = cell.getColumnIndex();
        }
        else {
            cellNum = cellIndex;
        }
        
        return CellReference.convertNumToColString(cellNum);
    }



	
}
