package common.config.servlet_context;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;
import org.springframework.web.servlet.view.BeanNameViewResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import common.config.handler.CustomReturnValueHandler;
import common.config.interceptor.CustomInterceptor;
import common.config.resolver.CustomArgumentResolver;
import common.config.resolver.CustomPathVariableMethodArgumentResolver;
import common.config.view.Excel2007CommonView;
import common.config.view.ExcelCommonView;
import common.config.view.Mp4StreamView;

@Configuration
@ComponentScan(basePackages = {"common","sample","kcg","temp"},
	includeFilters = {
			@Filter(type = FilterType.ANNOTATION, value = Controller.class),
			@Filter(type = FilterType.ANNOTATION, value = RestController.class),
			@Filter(type = FilterType.ANNOTATION, value = ControllerAdvice.class)
	},
	excludeFilters = {
			@Filter(type = FilterType.ANNOTATION, value = Service.class),
			@Filter(type = FilterType.ANNOTATION, value = Repository.class),
	}
)
public class WebMvcConfig extends WebMvcConfigurationSupport {

	@Autowired
	CustomInterceptor customInterceptor;
	
	// redis 의 글로벌캐시를 사용하고 싶을때 사용
//	@Autowired
//	RedisTemplate redisTemplate;
	
	@Override
	protected void addInterceptors(InterceptorRegistry registry) {
		registry
			.addInterceptor(customInterceptor)
			.addPathPatterns("/**")
			.excludePathPatterns("/static_resources/**") // interceptor 예외처리대상
			;
	}
	
	// redis 의 글로벌캐시를 사용하고 싶을때 사용
//	@Bean
//	public RedisCacheManager cacheManager() {
//		RedisCacheManager redisCacheManager = new RedisCacheManager(redisTemplate);
//		Map<String, Long> map = new HashMap();
//		map.put("sessionData", Long.parseLong("7200"));
//		map.put("portalData", Long.parseLong("7200"));
//		map.put("referenceData", Long.parseLong("86400"));
//		redisCacheManager.setExpires(map);
//		return redisCacheManager;
//	}
	
	@Override
	protected void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry
			.addResourceHandler("/static_resources/**")
			.addResourceLocations("/static_resources/");
	}
	
	@Override
	public RequestMappingHandlerAdapter requestMappingHandlerAdapter() {
		
		RequestMappingHandlerAdapter adapter = super.requestMappingHandlerAdapter();
		List<HandlerMethodArgumentResolver> argumentResolvers = adapter.getCustomArgumentResolvers();
		argumentResolvers.add(0, new CustomArgumentResolver());
		argumentResolvers.add(1, new CustomPathVariableMethodArgumentResolver());
		
		
		// Annotation-based argument resolution 
//		argumentResolvers.add(new RequestParamMethodArgumentResolver(getBeanFactory(), false)); 
//		argumentResolvers.add(new RequestParamMapMethodArgumentResolver()); 
//		argumentResolvers.add(new PathVariableMethodArgumentResolver()); 
//		argumentResolvers.add(new PathVariableMapMethodArgumentResolver()); 
//		argumentResolvers.add(new MatrixVariableMethodArgumentResolver()); 
//		argumentResolvers.add(new MatrixVariableMapMethodArgumentResolver()); 
//		argumentResolvers.add(new ServletModelAttributeMethodProcessor(false)); 
//		argumentResolvers.add(new RequestResponseBodyMethodProcessor(getMessageConverters(), this.requestResponseBodyAdvice)); 
//		argumentResolvers.add(new RequestPartMethodArgumentResolver(getMessageConverters(), this.requestResponseBodyAdvice)); 
//		argumentResolvers.add(new RequestHeaderMethodArgumentResolver(getBeanFactory())); 
//		argumentResolvers.add(new RequestHeaderMapMethodArgumentResolver()); 
//		argumentResolvers.add(new ServletCookieValueMethodArgumentResolver(getBeanFactory())); 
//		argumentResolvers.add(new ExpressionValueMethodArgumentResolver(getBeanFactory())); 
//		argumentResolvers.add(new SessionAttributeMethodArgumentResolver()); 
//		argumentResolvers.add(new RequestAttributeMethodArgumentResolver()); 
		
		// Type-based argument resolution 
//		argumentResolvers.add(new ServletRequestMethodArgumentResolver()); 
//		argumentResolvers.add(new ServletResponseMethodArgumentResolver()); 
//		argumentResolvers.add(new HttpEntityMethodProcessor(getMessageConverters(), this.requestResponseBodyAdvice)); 
//		argumentResolvers.add(new RedirectAttributesMethodArgumentResolver()); 
//		argumentResolvers.add(new ModelMethodProcessor()); 
//		argumentResolvers.add(new MapMethodProcessor());
//		argumentResolvers.add(new ErrorsMethodArgumentResolver()); 
//		argumentResolvers.add(new SessionStatusMethodArgumentResolver()); 
//		argumentResolvers.add(new UriComponentsBuilderMethodArgumentResolver());
		
		adapter.setArgumentResolvers(argumentResolvers);
		
		List<HandlerMethodReturnValueHandler> returnValueHandlers = adapter.getCustomReturnValueHandlers();
		returnValueHandlers.add(0, new CustomReturnValueHandler());
		adapter.setReturnValueHandlers(returnValueHandlers);
		
		return adapter;
	}
		
	@Bean
	public CommonsMultipartResolver multipartResolver() {
		CommonsMultipartResolver bean = new CommonsMultipartResolver();
		bean.setDefaultEncoding("UTF-8");
		return bean;
	}
	
	@Bean(name = "excelView")
	public ExcelCommonView excelCommonViewModule() {
		return new ExcelCommonView();
	}
	
	@Bean(name = "excel2007View")
	public Excel2007CommonView excel2007CommonViewModule() {
		return new Excel2007CommonView();
	}
	
	@Bean(name = "mp4StreamView")
	public Mp4StreamView streamViewModule() {
		return new Mp4StreamView();
	}
	
	@Bean
	public BeanNameViewResolver beanNameViewResolver() {
		BeanNameViewResolver beanNameViewResolver = new BeanNameViewResolver();
		beanNameViewResolver.setOrder(0);
		return beanNameViewResolver;
	}
	
	@Bean
	public InternalResourceViewResolver viewResolver() {
		InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
		viewResolver.setRedirectHttp10Compatible(false);
		viewResolver.setPrefix("/WEB-INF/jsp/");
		viewResolver.setSuffix(".jsp");
		viewResolver.setContentType("text/html; charset=UTF-8");
		viewResolver.setOrder(1);
		return viewResolver;
	}
	
	
}