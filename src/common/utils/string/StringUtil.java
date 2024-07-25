package common.utils.string;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;


/**
 * StringUtil 클래스이다.
 */
public class StringUtil extends StringUtils {

	private static Map<String, String> untrustedStringForEncoding;
	private static Map<String, String> untrustedStringForDecoding;
	
	static {
		untrustedStringForEncoding = new HashMap<String, String>();
		untrustedStringForEncoding.put("<", "&lt;");
		untrustedStringForEncoding.put(">", "&gt;");
	    //통계 모듈 이슈로 인해 아래항목들 제거
//		untrustedStringForEncoding.put("&", "&amp;");
		untrustedStringForEncoding.put("'", "&#x27;");
//		untrustedStringForEncoding.put("/", "&#x2F;");
		
		untrustedStringForDecoding = new HashMap<String, String>();
		untrustedStringForDecoding.put("&lt;", "<");
		untrustedStringForDecoding.put("&gt;", ">");
	    //통계 모듈 이슈로 인해 아래항목들 제거
//		untrustedStringForDecoding.put("&amp;", "&");
		untrustedStringForDecoding.put("&#x27;", "'");
//		untrustedStringForDecoding.put("&#x2F;", "/");
	}
	
	public static String underscoreToCamel(String s){
	   String[] parts = s.split("_");
	   
	   StringBuilder sb = new StringBuilder();
	   int i=0;
	   for (String part : parts){
		   if(i==0) {
			   sb.append(
					   new StringBuilder()
			    		.append(part.substring(0, 1).toLowerCase())
			    		.append(part.substring(1))
			    		.toString());
		   } else {
			   sb.append(
					   new StringBuilder()
			    		.append(part.substring(0, 1).toUpperCase())
			    		.append(part.substring(1).toLowerCase())
			    		.toString()
			    		);
		   }
		   i++;
	   }
	   return sb.toString();
	}

	private static int[] getPi(final String target) {

		int n = target.length();
		int[] pi = new int[n];

		for (int i = 1, j = 0; i < n ; i++) { 
			while (j > 0) {
				if(target.charAt(i) == target.charAt(j)) {
					break;
				}
				j = pi[j - 1];
			}
			if (target.charAt(i) != target.charAt(j)) {
				continue;
			}
			pi[i] = ++j;
		}

		return pi;
	}


	/**
	 * source의 substring 중 target과 일치하는 substring 의 index들을 반환
	 * 
	 * @param source
	 * @param target
	 * @return source에서 target과 일치하는 index들을 반환, 없으면 비어있는 List<Integer> 리턴
	 */
	public static List<Integer> allIndexOf(final String source, final String target) {

		List<Integer> index = new ArrayList<Integer>();

		int n = source.length();
		int m = target.length();
		if(n < m) {
			return index;
		}

		int[] pi = getPi(target);

		for(int i = 0, j = 0; i < n ; i++) { 
			while (j > 0) {
				if(source.charAt(i) == target.charAt(j)) {
					break;
				}
				j = pi[j - 1];
			}
			if (source.charAt(i) != target.charAt(j)) {
				continue;
			}
			if (j == m - 1) { 
				index.add(i - m + 1); 
				j = pi[j];
			}
			else {
				j++; 
			}
		}

		return index;
	}

	/**
	 * source의 substring 중 target과 앞에서부터 처음 일치하는 index를 반환
	 * 
	 * @param source
	 * @param target
	 * @return source에서 target과 처음 일치하는 index를 반환, 없으면 -1
	 */
	public static int indexOf(final String source, final String target) {

		int n = source.length();
		int m = target.length();
		if(n < m) {
			return -1;
		}

		int[] pi = getPi(target);

		for (int i = 0, j = 0; i < n ; i++) { 
			while (j > 0) {
				if(source.charAt(i) == target.charAt(j)) {
					break;
				}
				j = pi[j - 1];
			}
			if (source.charAt(i) != target.charAt(j)) {
				continue;
			}
			if (j == m - 1) {
				return i - m + 1;
			}
			else {
				j++; 
			}
		}

		return -1;
	}


	/**
	 * @param source
	 * @param MAXLEN
	 * @return str의 길이가 MAXLEN를 넘어가는 경우 자름. 
	 */
	public static String ellipsis(final String source, final int MAXLEN) {

		int sourceLength = source.length();
		if(sourceLength <= MAXLEN) {
			return source;
		}

		return source.substring(0, MAXLEN);
	}

	/**
	 * @param source
	 * @param MAXLEN
	 * @param limit
	 * @return str의 길이가 MAXLEN 을 넘어가는 경우 limit 으로 치환
	 */
	public static String ellipsis(final String source, final int MAXLEN, final String limit) {
		String str = ellipsis(source, MAXLEN);
		if(source.length() <= str.length()) {
			return str;
		}
		return str + limit;
	}

	/**
	 * @param source
	 * @return XSS Encoding
	 */
	public static String encodeXSS(String source) {
		
		// 우리FIS 기준 XSS 필터 적용
		source = filterXSSForWoori(source);

		// untrustedStringForEncoding 필터 적용
		int sourceLength = source.length();
		StringBuilder sb = new StringBuilder();

		for(int i=0; i<sourceLength; i++) {
			Character c = source.charAt(i);
			String untrustedData = simpleEcodeXSS(c.toString());
			if(untrustedData == null) sb.append(c);
			else sb.append(untrustedData);
		}

		return sb.toString();
	}
	
	public static String simpleEcodeXSS(String source) {

		int sourceLength = source.length();
		StringBuilder sb = new StringBuilder();

		for(int i=0; i<sourceLength; i++) {
			Character c = source.charAt(i);
			String untrustedData = untrustedStringForEncoding.get(c.toString());
			if(untrustedData == null) sb.append(c);
			else sb.append(untrustedData);
		}

		return sb.toString();
	}
	
	public static String simpleDecodeXSS(String source) {

		int sourceLength = source.length();
		StringBuffer sb = new StringBuffer();
		int i = 0;
		Set<String> set = untrustedStringForDecoding.keySet();
		for(; i<sourceLength; i++) {
			char c = source.charAt(i);
			if(c == ' ') {
				 sb.append(c);
				continue;
			}
			
			boolean searched = false;
			Iterator<String> it = set.iterator();
			
			while(it.hasNext()) {
				String str = it.next(); // &lt;
				int len = str.length();
				if(sourceLength > i + len - 1) {
					String substr = source.substring(i, i + len);
					if(substr.equals(str)) {
						String value = untrustedStringForDecoding.get(str);
						sb.append(value);
						i += len - 1;
						searched = true;
						break;
					}
				}
			}
			if(!searched) sb.append(c);
		}

		while(i < sourceLength) sb.append(source.charAt(i++));

		return sb.toString();
	}

	/**
	 * camel 양식의 문자열을 underscore(_) 양식으로 변환.</br>
	 *
	 * <br>
	 * 예)
	 *    <pre> 
	 *    String str = "camelToUnderscore_test";
	 *    <br>
	 *    
	 *    StringUtil.camelToUnderscore(str); // "camel_to_underscore_test"
	 *    </pre>
	 *    
	 * @param str camel 양식의 문자열
	 * @return underscore(_) 양식의 문자열
	 */
	public static String camelToUnderscore(final String str) {

		String underScoreValue = "";
		String regexp = "([a-z])([A-Z])";
		String replacement = "$1_$2";
		underScoreValue = str.replaceAll(regexp, replacement).toUpperCase();

		return underScoreValue;
	}


	/**
	 * 주어진 문자열을 지정된 길이 만큼 잘라서 List로 반환한다.
	 *
	 * <br><br>
	 * 예)
	 *    <pre> 
	 *    String  str         = "ABCDEFGHIJKLMN";
	 *    <br>
	 *    
	 *    StringUtil.splitByLength(str, 2); // "[AB, CD, EF, GH, IJ, KL, MN]"
	 *    StringUtil.splitByLength(str, 3); // "[ABC, DEF, GHI, JKL, MN]"
	 *    
	 *    </pre>
	 *
	 * @param str 문자열
	 * @param cutLength 문자열을 자를 길이
	 * @return 지정된 길이 만큼 잘라진 문자열의 List
	 */
	public static List<String> splitByLength (final String str, final int cutLength) {

		List<String> list = new LinkedList<String>();
		if (str == null || cutLength < 1) {
			return list;
		}

		int length = str.length();
		for (int i = 0; i < length; i += cutLength) {
			list.add(str.substring(i, Math.min(length, i + cutLength)));
		}

		return list;
	}

	/**
	 * String들을 하나의 String으로 반환한다.
	 * @param args String 배열
	 * @return args를 하나의 String으로 반환
	 */
	public static String appendToString(String... args) {
		StringBuilder stringBuilder = new StringBuilder();
		for(String str : args) {
			stringBuilder.append(str);
		}
		return stringBuilder.toString();
	}

	public static boolean match(final String src, final String regex) {
		return src.matches(regex);
	}

	
	/**
	 * String을 원하는 크기(byte 단위)로 줄여 마지막 접미사를 붙여 반환한다. (접미사도 length에 포함)<br/>
     * 
     * MS949 인코딩을 기준으로 byte[]를 얻은 후 이를 byte 단위로 나누면서 2바이트를 차지하는 글자에 대한 조정을 수행한다.
     * 입력 문자열이 null일 경우 ""을 리턴한다. 원하는 길이가 원본 문자열의 길이보다 짧을 경우에는 원본 문자열을 반환한다.
	 * @param src
	 * @param byteLen
	 * @param suffix
	 * @return byteLen보다 길 경우 suffix를 붙인 String
	 */
	public static String ellipsisByByte(String src, int byteLen, String suffix) {
		if(StringUtil.isEmpty(src)) {
			return "";
		}

		if(src.getBytes().length <= byteLen) {
			return src;
		}

		int slen = 0;
		int blen = 0;
		int realLen = byteLen - suffix.getBytes().length;
		while(blen < realLen) {
			blen++;
			slen++;
			if(src.charAt(slen) <= '\u00FF') {
				continue;
			}
			blen++;
		}
		return src.substring(0, slen) + suffix;

	}

	/**
	 * 우리FIS 기준 XSS 필터
	 * @param value
	 * @return
	 */
	public static String filterXSSForWoori(String value) {
		if (value != null && !"".equals(value)) {
			
			// sql injection 방지
			value = value.replaceAll("'", "&#x27;");
			
			//remove <script>...</script>
			Pattern pattern = Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE);
			value = pattern.matcher(value).replaceAll("");

			//remove src='....'
//			pattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
//			value = pattern.matcher(value).replaceAll("");

			//remove </script>
			pattern = Pattern.compile("</script>", Pattern.CASE_INSENSITIVE);
			value = pattern.matcher(value).replaceAll("");

			//remove <script...>
			pattern = Pattern.compile("<script(.*?)>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
			value = pattern.matcher(value).replaceAll("");

			//remove eval(...)
			pattern = Pattern.compile("eval[\\s]*\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
			value = pattern.matcher(value).replaceAll("");

			//remove expression(...)
			pattern = Pattern.compile("expression[\\s]*\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
			value = pattern.matcher(value).replaceAll("");

			//remove javascript:
			pattern = Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE);
			value = pattern.matcher(value).replaceAll("");

			//remove vbscript:
			pattern = Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE);
			value = pattern.matcher(value).replaceAll("");

//			//remove <body> , <embed> , <frame> ... <div>
//			pattern = Pattern.compile("<(body|embed|frame|script|link|iframe|object|style|frameset|meta|img|div)[\\s]*[^>]*[\\s]*>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
//			value = pattern.matcher(value).replaceAll("");
			
			//remove <body> , <embed> , <frame> ... <div>
			pattern = Pattern.compile("<(body|embed|frame|script|link|iframe|object|style|frameset|meta)[\\s]*[^>]*[\\s]*>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
			value = pattern.matcher(value).replaceAll("");

			//remove html event handler
			//remove on...=...
			pattern = Pattern.compile("on[a-z]+[^\\S\n]*=", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
			value = pattern.matcher(value).replaceAll("");
		} else {
			value = "";
		}
		return value;
	}
}
