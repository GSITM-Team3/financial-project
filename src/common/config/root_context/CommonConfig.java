package common.config.root_context;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import common.config.provider.ApplicationContextProvider;

@Configuration
@EnableAsync
@ComponentScan(basePackages = {"common","sample","kcg","temp"},
	excludeFilters = {
			@Filter(type = FilterType.ANNOTATION, value = Controller.class),
			@Filter(type = FilterType.ANNOTATION, value = RestController.class),
			@Filter(type = FilterType.ANNOTATION, value = ControllerAdvice.class)
	}
)
@PropertySources({
	@PropertySource({"classpath:common/config/properties/setting_${action.mode}.properties"})
})
public class CommonConfig {
	
	@Bean
	public PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
		PropertySourcesPlaceholderConfigurer property = new PropertySourcesPlaceholderConfigurer();
		return property;
	}
	
	@Bean
	ApplicationContextProvider applicationContextProvider() {
		return new ApplicationContextProvider();
	}
	
	@Bean(name = "messageSource")
	public ReloadableResourceBundleMessageSource reloadableResourceBundleMessageSource() {
		ReloadableResourceBundleMessageSource reloadableResourceBundleMessageSource = 
				new ReloadableResourceBundleMessageSource();
		reloadableResourceBundleMessageSource.setDefaultEncoding("UTF-8");
		reloadableResourceBundleMessageSource.setCacheSeconds(60); // 파일이 변경되었는지 확인하는 주기지정 
		reloadableResourceBundleMessageSource.setBasenames("classpath:common/config/message/message");
		return reloadableResourceBundleMessageSource;
	}
	
	// 언어정보를 세션에 저장
	@Bean
	public SessionLocaleResolver localeResolver() {
		return new SessionLocaleResolver();
	}

}
