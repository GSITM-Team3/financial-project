package kcg.common.ctl;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.FlashMap;
import org.springframework.web.servlet.NoHandlerFoundException;

import common.exception.ForcedLogoutException;
import common.exception.NeedAuthrizationException;
import common.exception.ResourceNotFoundException;
import common.exception.UserBizException;
import common.utils.common.CmmnMap;
import common.utils.common.CmmnUtil;

@ControllerAdvice  
@Controller
public class GlobalExceptionHandlerCtl {

	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired 
	MessageSource messageSource;

    @ExceptionHandler(value = UserBizException.class)
    @ResponseBody
    public CmmnMap handleUserException(UserBizException e){
    	log.error("UserBizException ====> ");
    	log.error(CmmnUtil.getExceptionStackTrace(e));
    	
        return new CmmnMap()
        		.put("rsltStatus", "user-error")
        		.put("errMsg", e.getMessage())
        		;
    }
    
    @ExceptionHandler(value = ResourceNotFoundException.class)
    public String handleResourceNotFoundException(ResourceNotFoundException e){
    	log.error(CmmnUtil.getExceptionStackTrace(e));
    	return "kcg/error/error-50x";
    }
    
    @ExceptionHandler(value = ForcedLogoutException.class)
    public String handleForcedLogoutException(ForcedLogoutException e, FlashMap flashMap){
    	flashMap.put("loginError", "FORCED_LOGOUT");
    	return "redirect:/login";
    }
    
    @ExceptionHandler(value = NeedAuthrizationException.class)
    public String handleNeedAuthrizationException(NeedAuthrizationException e, FlashMap flashMap){
    	return "redirect:/error/needAuthrization";
    }
    
    @RequestMapping("/error/needAuthrization")
    public String needAuthrizationExceptionPage() {
    	return "kcg/error/NeedAuthrizationExceptionPage";
    }
    
    @RequestMapping("/error/accessForbidden")
    public String accessForbiddenExceptionPage() {
    	return "kcg/error/AccessForbiddenExceptionPage";
    }
    
    @RequestMapping("/error/gotomain")
    @ResponseBody
    public String gotomain() {
    	return "gotomain";
    }
    
    @ExceptionHandler(value = NoHandlerFoundException.class)
    public String NoHandlerFoundException(NoHandlerFoundException e){
    	if(e.getMessage().contains("favicon.ico")) {
    		return null;
    	}
//    	log.error(CmmnUtil.getExceptionStackTrace(e));
    	return "kcg/error/error-40x";
    }
    
    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    public CmmnMap handleException(Exception e,HttpSession session ){
    	log.error("Exception ====> ");
    	log.error(CmmnUtil.getExceptionStackTrace(e));
    	
        return new CmmnMap()
        		.put("rsltStatus", "sys-error")
        		.put("errMsg", messageSource.getMessage("include.common_js.error", null, CmmnUtil.getLocale(session)))
        		;
    }
    
}
