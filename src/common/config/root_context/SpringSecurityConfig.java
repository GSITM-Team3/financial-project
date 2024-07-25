package common.config.root_context;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import kcg.login.svc.LoginSvc;

//@Configuration
//@EnableWebSecurity
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	LoginSvc loginSvc;
	
    @Override
	public void configure(WebSecurity web) throws Exception {
		// 스프링시큐리티의 간섭을 받지않는 경로들
		web.ignoring().antMatchers(
								  "/static_resources/**"
								);
	}

	@Override
    protected void configure(HttpSecurity http) throws Exception {
		
        http.csrf()
        	.disable()
            .formLogin() // 로그인 페이지 및 성공 url, handler 그리고 로그인시 사용되는 id, password 파라미터 정의
	            .loginPage("/login") 
	            .loginProcessingUrl("/login/proc") // 로그인처리시 호출할 URL
	            .defaultSuccessUrl("/login/afterProc", true) // loginProcessingUrl 에서 성공한 후 이동할 URL
	            .failureUrl("/login/fail")  // 로그인 실패후 이동할 URL
	            .and()
            .authorizeRequests()
	        	.antMatchers("/login/**").permitAll()
        		.antMatchers("/system/**").hasAnyAuthority("admin")
        		.antMatchers("/**").permitAll()
            	.and()
            .exceptionHandling()
            	.accessDeniedPage("/error/accessForbidden") // 접근권한이 없는 페이지에 접근 시도시
            	.and()
            .authenticationProvider(loginSvc)
            .sessionManagement().sessionFixation().none().and() // 스프링시큐리티의 로그인처리시 세션아이디를 자동으로 변경하는 것을 막기 위해
//            .headers()
//            	.frameOptions().sameOrigin() // 동일 도메인에서만 iframe 접근이 가능하도록 설정
            	;
    }

}
