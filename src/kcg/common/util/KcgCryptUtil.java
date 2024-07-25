package kcg.common.util;

import java.net.URLDecoder;
import java.security.Key;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/**
 * 해양경찰청 업무포탈 사용자아이디 복호화 
 * @author hsw46
 *
 */
public class KcgCryptUtil {
	
	private static final Logger log = LoggerFactory.getLogger(KcgCryptUtil.class);

    /**
     * 16byte : DES
     * 24byte : TripleDES
     * 
     * 문자열이 해당 byte의 크기만 되면 어떤 내용이든 상관 없음.
     * @return String 키값 
     */
	private static String key() {
		// return "ab_booktv_abcd09"; //DES
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHH");
		Date today = new Date();
		String date = formatter.format(today);
		return date; // DES
		// return "ab_booktv_abcd0912345678"; //TripleDES
	}

    /**
     * 24바이트인 경우 TripleDES 아니면 DES
     * @return Key
     * @throws Exception 
     */
	private static Key getKey() throws Exception {
		return (key().length() == 24) ? getKey2(key()) : getKey1(key());
	}

    /**
     * Cipher의 instance 생성시 사용될 값
     * @return String DES, TripleDES 구분
     * @throws Exception 
     */
	private static String getInstance() throws Exception {
		return (key().length() == 24) ? "DESede/ECB/PKCS5Padding" : "DES/ECB/PKCS5Padding";
	}

    /**
     * 지정된 비밀키를 가지고 오는 메서드(DES) 
     * require Key Size : 16bytes
     * 
     * @param keyValue
     * @return Key
     * @throws Exception 
     */
	private static Key getKey1(String keyValue) throws Exception {
		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
		DESKeySpec desKeySpec = new DESKeySpec(keyValue.getBytes());
		return keyFactory.generateSecret(desKeySpec);
	}

    /**
     * 지정된 비밀키를 가지고 오는 메서드(TripleDES) 
     * require Key Size : 24bytes
     * 
     * @param keyValue
     * @return Key
     * @throws Exception 
     */
	private static Key getKey2(String keyValue) throws Exception {
		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DESede");
		DESKeySpec desKeySpec = new DESKeySpec(keyValue.getBytes());
		return keyFactory.generateSecret(desKeySpec);
	}
    

    /**
     * 문자열 대칭 암호화
     * return String 암호화된 문자열
     */
	public static String encrypt(String input) throws Exception {
		if (input == null || input.length() == 0) return "";
		Cipher cipher = Cipher.getInstance(getInstance());
		cipher.init(Cipher.ENCRYPT_MODE, getKey());
		byte[] inputBytes = input.getBytes("UTF8");
		byte[] outputBytes = cipher.doFinal(inputBytes);
		return new BASE64Encoder().encode(outputBytes);
	}

    /**
     * 문자열 대칭 복호화
     * return String 복호화된 문자열 
     */
	public static String decrypt(String input) throws Exception {
		
		input = URLDecoder.decode(input, "UTF-8");
		
		if (input == null || input.length() == 0) return "";
		Cipher cipher = Cipher.getInstance(getInstance());
		cipher.init(Cipher.DECRYPT_MODE, getKey());
		byte[] inputBytes = new BASE64Decoder().decodeBuffer(input);
		byte[] outputBytes = cipher.doFinal(inputBytes);
		return new String(outputBytes, "UTF8");
	}
}
