package common.config.listener;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import common.utils.string.StringUtil;

public class CustomSessionListener implements HttpSessionListener {
	
	private final Logger log = LoggerFactory.getLogger(getClass());
	
	private static final Map<String, HttpSession> sessions = new HashMap<>();
    
    public static Map<String, HttpSession> getActiveSessions(){
    	return sessions;
    }
	
	@Override
	public void sessionCreated(HttpSessionEvent se) {
		log.debug(StringUtil.join("session created!!!", se.getSession().getId()));
//		sessions.put(se.getSession().getId(), se.getSession());
	}
	
	@Override
	public void sessionDestroyed(HttpSessionEvent se) {
		log.debug(StringUtil.join("session destroyed!!!", se.getSession().getId()));
//        sessions.remove(se.getSession().getId());
	}
}
