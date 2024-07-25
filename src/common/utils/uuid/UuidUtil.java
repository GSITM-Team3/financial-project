package common.utils.uuid;

import java.util.UUID;

public class UuidUtil {
	
//	static public String getUuid() {
//		return UUID.randomUUID().toString();
//	}
	
	/**
	 * 32비트의 랜덤한 값을 생성
	 * @return
	 */
	static public String getUuidOnlyString() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
	
//	static public String getUuid(String input) {
//		return UUID.nameUUIDFromBytes(input.getBytes()).toString();
//	}
//	
//	static public String getUuidOnlyString(String input) {
//		return getUuid(input).replaceAll("-", "");
//	}
}
