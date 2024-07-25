/**
 * 
 */
package common.utils.smry;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import common.utils.common.CmmnMap;
import common.utils.string.StringUtil;
import kr.co.shineware.nlp.komoran.constant.DEFAULT_MODEL;
import kr.co.shineware.nlp.komoran.core.Komoran;

/** 
* 코사도 유사도 : 두 벡터 간의 코사인 각도를 이용하여 구할 수 있는 두 벡터의 유사도
* */

public class SimilarityCtl {
	
	/*Komoran : 한글 형태소 분석기
	 * DEFAULT_MODEL.FULL : Wikipedia 기반
	 * DEFAULT_MODEL.LIGHT : 일반
	 */
	static Komoran komoran = new Komoran(DEFAULT_MODEL.FULL);
	
//	public static void main(String[] args) {
//		
//		List<CmmnMap> result = Arrays.asList(
//				new CmmnMap().put("B", "AAA").put("C", "우리나라는 참 좋은 나라입니다.")
//				,new CmmnMap().put("B", "BBB").put("C", "우리나라 이름은 대한민국입니다.")
//				,new CmmnMap().put("B", "AAA").put("C", "당신 나라의 이름은 무엇입니까?")
//				,new CmmnMap().put("B", "CCC").put("C", "우리나라의 이름이 궁굼하세요?")
//				);
//		
//		Map<String, String> concatResult = new HashMap<String, String>();
//		List<String> tableList = new ArrayList<String>();
//        for(CmmnMap map : result) {
//        	String tableNm = map.getString("B");
//			if( tableNm.equals("TABLE_KOREAN_NM") ) {
//			     continue;   		
//        	}
//
//        	String concatStr = "";
//        	if(concatResult.containsKey(tableNm)) {
//        		concatStr += concatResult.get(tableNm) + " "+ map.get("C");
//        	}else {
//        		concatStr += map.get("C");
//        		tableList.add(tableNm);
//        	}
//        	concatResult.put(tableNm, concatStr);
//        }
//        
//        
//        JsonObject jsonRst = new JsonObject();
//        for (int i = 0; i < tableList.size(); i++) {
//        	JsonObject jObj = new JsonObject();
//        	JsonArray jArr = new JsonArray();
//        	String key = tableList.get(i);
//			for (int j = 0; j < tableList.size(); j++) {
//				String key2 = tableList.get(j);
//				double similarityPcnt = cosineSimilarity( concatResult.get(key) , concatResult.get(key2));
//				
//				jObj.addProperty(key2, similarityPcnt);
//			}
//			jArr.add(jObj);
//			jsonRst.add(key, jArr);
//		}
//
//        int d = 1;
//
//	}
	
	public static void main(String[] args) {
//		System.out.print("'대한민국' 과 '대한 나라'의 유사도 : ");
//		System.out.println(cosineSimilarity("대한민국","대한 나라"));
//		
//		System.out.print("'우리나라 만세' 과 '아름다운 우리나라는 대한민국입니다.'의 유사도 : ");
//		System.out.println(cosineSimilarity("우리나라 만세","아름다운 우리나라는 대한민국입니다."));
//		
//		System.out.print("'우리나라 만세' 과 '아름다운 우리나라는 만세입니다.'의 유사도 : ");
//		System.out.println(cosineSimilarity("우리나라 만세","아름다운 우리나라는 만세입니다."));
		
		

		System.out.println(cosineSimilarity("우정사업본부 변경","우정사업본부에서는 도로명주소 체계로 변경되는 오픈API 서비스를 제공합니다."));
		
		
		
//		String tmp = "가나다	마자  다바";
//		String tmp = "  ";
//		String[] tmp2 = tmp.split("\\s+");
//		
//		int s = 1;
	}
	
	/** 
	* Text를 명사로 나눠진 Array로 리턴
	* */
	public static String[] getNonusArray(String text) {
		
		List<String> nonusList = komoran.analyze(text).getNouns();
		String[] nonusArr = nonusList.toArray(new String[nonusList.size()]);
		return nonusArr;
		
	}
	
	
    /** 
    * Cosine 유사도
    * */
    public static double cosineSimilarity(String str0, String str1) {
    	
    	String[] tkn0 = getNonusArray(str0);
    	String[] tkn1 = getNonusArray(str1);
    	
    	double result = 0;
        
    	HashMap<String, int[]> map = new HashMap<String, int[]>();
        
    	//단어가 키, 빈도수를 2차원적 배열로 만든다
    	for (int i = 0; i < tkn0.length; i++) {
            String t = tkn0[i].toLowerCase();
            if (!map.containsKey(t)) {
                map.put(t, new int[2]);
            }
            map.get(t)[0]++;
        }
        for (int i = 0; i < tkn1.length; i++) {
            String t = tkn1[i].toLowerCase();
            if (!map.containsKey(t)) {
                map.put(t, new int[2]);
            }
            map.get(t)[1]++;
        }
        
        double dot = 0;
        double norma = 0;
        double normb = 0;
        //빈도수 계산
        for (Entry<String, int[]> e : map.entrySet()) {
            int[] v = e.getValue();
            dot += v[0] * v[1];
            norma += v[0] * v[0];
            normb += v[1] * v[1];
        }
        norma = Math.sqrt(norma);	//제곱근 반환
        normb = Math.sqrt(normb);	//제곱근 반환
        
        if (dot != 0) {
        	result = dot / (norma * normb);
        	result = Math.round(result*1000*100)/1000.0;
        }
        
        return result;
    }
	
}
