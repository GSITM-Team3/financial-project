package common.config.logger;

import org.slf4j.MDC;

import common.utils.string.StringUtil;

import ch.qos.logback.classic.Level;

public class LoggerMDCMng {

	/**
	 * 로거정보 초기화 종료
	 */
	public static void clear() {
    	// 로거 스레드 객체 초기화
		MDC.clear();
    }

	/**
	 * 로거정보 입력
	 * @param LOG_SVC_CD
	 * @param LOG_SVC_LEVEL
	 * @param userId
	 * @param userYn
	 */
    public static void setInfo(String LOG_SVC_CD, String LOG_SVC_LEVEL, String userId) {
    	
    	// LOG_SVC_CD 값이 없으면 MDC 설정을 하지 않는다.
    	if(StringUtil.isNotEmpty(LOG_SVC_CD)) {
    		MDC.put("LOG_SVC_CD", LOG_SVC_CD);
    	} else {
    		MDC.clear();
    		return;
    	}

    	// 사용자 아이디정보가 존재하지 않으면 기본으로 NO_USER 으로 셋팅한다.
    	if(StringUtil.isNotEmpty(userId)) {
    		MDC.put("USER_ID", userId);
    	} else {
    		MDC.put("USER_ID", "NO_USER");
    	}

    	// 기준 로그레벨을 넘겨받은 값으로 설정하되, 해당하는 로그레벨이 존재하지 않으면 기본으로 WARN 레벨로 설정한다.
    	if("TRACE".equals(LOG_SVC_LEVEL)) {
    		MDC.put("LOG_SVC_LEVEL", Integer.toString(Level.TRACE_INT));
    	} else if("DEBUG".equals(LOG_SVC_LEVEL)) {
    		MDC.put("LOG_SVC_LEVEL", Integer.toString(Level.DEBUG_INT));
    	} else if("INFO".equals(LOG_SVC_LEVEL)) {
    		MDC.put("LOG_SVC_LEVEL", Integer.toString(Level.INFO_INT));
    	} else if("WARN".equals(LOG_SVC_LEVEL)) {
    		MDC.put("LOG_SVC_LEVEL", Integer.toString(Level.WARN_INT));
    	} else if("ERROR".equals(LOG_SVC_LEVEL)) {
    		MDC.put("LOG_SVC_LEVEL", Integer.toString(Level.ERROR_INT));  
    	} 
    	// 해당하는 레벨값이 들어오지 않을경우 기본레벨은 WARN으로 한다.
    	else {
    		MDC.put("LOG_SVC_LEVEL", Integer.toString(Level.WARN_INT));  
    	}
    }
}
