package common.config.interceptor;

import java.net.URLEncoder;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.AsyncHandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import common.config.logger.LoggerMDCMng;
import common.config.properties.SettingProperties;
import common.dao.CmmnDao;
import common.utils.common.CmmnUtil;
import common.utils.json.JsonUtil;
import common.utils.string.StringUtil;
import kcg.common.svc.CommonSvc;
import kcg.common.util.KcgCryptUtil;
import kcg.login.vo.UserInfoVO;

@Component
public class CustomInterceptor implements AsyncHandlerInterceptor {
	
	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	CommonSvc commonSvc;

	@Autowired
	CmmnDao cmmnDao;

	@Autowired
	SettingProperties settingProperties;
	
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		
		boolean lineDebugYn = false;
		HttpSession session = request.getSession();
		session.setAttribute("properties", settingProperties);

		LoggerMDCMng.setInfo("KCG_PORTAL", "DEBUG", "");
		
		if(lineDebugYn)log.debug("=======================>>> line 46");
		String ubi_ori = StringUtil.defaultIfEmpty(request.getParameter("ubi"), "") ;

		if(lineDebugYn)log.debug("=======================>>> line 49" + " ubi_ori["+ubi_ori+"]");
		String requestURI = request.getRequestURI();

		if(lineDebugYn)log.debug("=======================>>> line 52" + " requestURI["+requestURI+"]");
		if( !CmmnUtil.checkRequestUri_isExcept(requestURI)){
			
			UserInfoVO userInfoVO = (UserInfoVO) session.getAttribute("userInfoVO");

			if(lineDebugYn)log.debug("=======================>>> line 57" + " userInfoVO["+userInfoVO+"]");
			// 로그인 상태가 아닌경우
			if(userInfoVO == null) {
				if(StringUtil.isEmpty(ubi_ori)) {
					
					String callfunc = request.getHeader("callfunc");
					if(lineDebugYn)log.debug("=======================>>> line 63" + " callfunc["+userInfoVO+"]");
					if("cf_ajax".equals(callfunc)) {
						response.sendRedirect("/error/gotomain");
					} else {
						response.sendRedirect("/login");
					}
					
				} else {
					if(lineDebugYn)log.debug("=======================>>> line 71" );
//					String ubi = KcgCryptUtil.decrypt(ubi_ori);
//					session.setAttribute("ubi", ubi);
					response.sendRedirect("/login/loginByIam?ubi=" + URLEncoder.encode(ubi_ori, "UTF-8"));
				}
				return false;
			} 
			// 로그인 상태인 경우
			else {
				if(lineDebugYn)log.debug("=======================>>> line 80" + " userInfoVO.getAdminYn()["+userInfoVO.getAdminYn()+"]");
				// 어드민이 아닌 사용자가 어드민페이지 접근 시도시...
				if(requestURI.startsWith("/system") && !"Y".equals(userInfoVO.getAdminYn())  ) {
					response.sendRedirect("/login");
					return false;
				}
				commonSvc.setNotiCnt();
			}
		}
		// 메뉴접근권한을 체크한다.
		if(!CmmnUtil.checkMenuAuth(request)) {
			response.sendRedirect("/?errmsg=AUTH_ERR");
			return false;
		}
		
		return true;
	}

	
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		
		// Logger MDC 초기화
		LoggerMDCMng.clear();

//		log.debug("Interceptor ===> postHandle");
	}

	
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
	}


	@Override
	public void afterConcurrentHandlingStarted(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		// TODO Auto-generated method stub
		
	}
	
}
