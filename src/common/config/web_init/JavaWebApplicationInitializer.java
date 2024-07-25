package common.config.web_init;

import javax.servlet.FilterRegistration;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.multipart.support.MultipartFilter;
import org.springframework.web.servlet.DispatcherServlet;

import common.config.filter.XSSFilter;
import common.config.listener.CustomSessionListener;
import common.config.servlet_context.WebMvcConfig;

public class JavaWebApplicationInitializer implements WebApplicationInitializer {
	
	@Override
	public void onStartup(ServletContext servletContext) throws ServletException {
		
		// 실행모드 확인
		StringBuffer buff = new StringBuffer();
		if( System.getProperty("action.mode") == null ) {
			buff.append("||**********************************************************************************||").append("\n");
			buff.append("실행모드(action.mode)가 null 입니다. %CATALINA_HOME%/conf/catalina.properties 파일에 아래의 내용을 세팅해 주세요.").append("\n");
			buff.append("로컬서버환경일 경우 : action.mode=local").append("\n");
			buff.append("개발서버환경일 경우 : action.mode=dev").append("\n");
			buff.append("운영서버환경일 경우 : action.mode=prod").append("\n");
			buff.append("||**********************************************************************************||").append("\n");
		}else {
			buff.append("||************************* 실행모드(action.mode)-["+System.getProperty("action.mode")+"] *************************||").append("\n");
		}
		System.out.println(buff);
		
		// root context 설정 
		AnnotationConfigWebApplicationContext rootAppContext = new AnnotationConfigWebApplicationContext();
		rootAppContext.scan("common.config.root_context");
		servletContext.addListener(new ContextLoaderListener(rootAppContext));
		servletContext.addListener(new CustomSessionListener()); // 세션 생성 및 소멸 리스너
		servletContext.addListener(new RequestContextListener()); // spring security 의 AuthenticationProvider 구현체 에서도 request 를 가져올수 있게 하기 위해
		
		// servlet context 설정
		AnnotationConfigWebApplicationContext servletAppContext = new AnnotationConfigWebApplicationContext();
		servletAppContext.register(WebMvcConfig.class);
		DispatcherServlet dispatcherServlet = new DispatcherServlet(servletAppContext);
		dispatcherServlet.setThrowExceptionIfNoHandlerFound(true); // 등록되지 않은 url로 접근할 시 NoHandlerFoundException 을 발생
		ServletRegistration.Dynamic servlet = servletContext.addServlet("dispatcher", dispatcherServlet);
		servlet.setLoadOnStartup(1);
		servlet.addMapping("/");
		
		// encodingFilter 설정 - post 방식등으로 파라메타를 한글로 보낼때 깨지지 않게하기 위해
		FilterRegistration.Dynamic encodingFilter = servletContext.addFilter("encodingFilter", CharacterEncodingFilter.class);
		encodingFilter.setInitParameter("encoding", "UTF-8");
		encodingFilter.setInitParameter("forceEncoding", "true");
		encodingFilter.addMappingForServletNames(null, false, "/*");
		
//		// 스프링시큐리티용 설정
//		FilterRegistration.Dynamic securityFilter = servletContext.addFilter("springSecurityFilterChain", DelegatingFilterProxy.class);
//		securityFilter.addMappingForUrlPatterns(null, false, "/*");
		
		// 멀티파트 필터
		FilterRegistration.Dynamic multipartFilter = servletContext.addFilter("multipartFilter", MultipartFilter.class);
		multipartFilter.setInitParameter("multipartResolverBeanName", "multipartResolver");
		multipartFilter.addMappingForUrlPatterns(null, false, "/*");
		
		// Cross-Site Scripting 필터
		FilterRegistration.Dynamic xssFilter = servletContext.addFilter("xssFilter", XSSFilter.class);
		xssFilter.addMappingForUrlPatterns(null, false, "/*");
		
	}

}
