package kcg.common.svc;

import java.security.SignatureException;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import common.config.properties.SettingProperties;
import common.dao.CmmnDao;
import common.exception.UserBizException;
import common.utils.common.CmmnUtil;
import common.utils.json.JsonUtil;
import common.utils.string.StringUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import kcg.login.vo.UserInfoVO;

@Service
public class JwtSvc {
	
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	CmmnDao cmmnDao;
	
	@Autowired
	HttpServletRequest request;
	
	@Autowired
	SettingProperties settingProperties;
	
	/**
	 * jwt access 토큰 생성함수
	 * @param userInfoVO
	 * @return
	 */
	public String gen_access_token(String user_id) {
		return gen_jwt(Long.parseLong("1010101010"), "access", user_id);
	}
	
	/**
	 * jwt refresh 토큰 생성함수
	 * @param userInfoVO
	 * @return
	 */
	public String gen_refresh_token(String user_id){
		return gen_jwt(Long.parseLong("1010101010"), "refresh", user_id);
	}
	

	/**
	 * jwt 생성함수
	 * @return
	 */
	private String gen_jwt(long period, String tktyp, String user_id) {
		
		long currentTime = System.currentTimeMillis();

	    return Jwts.builder()
	    	// 헤더의 타입(typ)을 지정할 수 있습니다. jwt를 사용하기 때문에 Header.JWT_TYPE로 사용해줍니다.
	        .setHeaderParam(Header.TYPE, Header.JWT_TYPE) 
	        // 등록된 클레임 중, 토큰 발급자(iss)를 설정할 수 있습니다.
	        .setIssuer("shinhan") 
	        // 등록된 클레임 중, 발급 시간(iat)를 설정할 수 있습니다. Date 타입만 추가가 가능합니다.
	        .setIssuedAt(new Date(currentTime)) 
	        // 등록된 클레임 중, 만료 시간(exp)을 설정할 수 있습니다. 마찬가지로 Date 타입만 추가가 가능합니다.
	        .setExpiration(new Date(currentTime + (period*1000))) 
	        // 비공개 클레임을 설정할 수 있습니다. (key-value)
	        .claim("user_id", user_id)
	        .claim("tktyp", tktyp)
	        // 해싱 알고리즘과 검증용 시크릿 키를 설정할 수 있습니다.
	        .signWith(SignatureAlgorithm.HS256, "1234567890") 
	        .compact();
	}

	/**
	 * access jwt 검증함수
	 * 검증이 완료되면 thread local에 사용자정보를 저장한다.
	 */
	public void chk_access_jwt() {
		
		String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		// Authorization 헤더에 다음과 같은 문자열을 보냈는지 확인
		// 예) Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmcmVzaCIsImlhdCI6MTYyMjkwNjg0NSwiZXhwIjoxNjIyOTA4NjQ1LCJpZCI6IuyVhOydtOuUlCIsImVtYWlsIjoiYWp1ZnJlc2hAZ21haWwuY29tIn0.ucTS9OgA7Z751a6aNzttcEXRfEhG_hsZPzZZTHhbUrA
	    if (StringUtil.isEmpty(authorizationHeader) || !authorizationHeader.startsWith("Bearer ")) {
	    	throw new UserBizException("TOKEN_NO_EXIST");
	    }
		String access_token = authorizationHeader.substring("Bearer ".length());
		
		// 무조건 통과시킬 테스트용 토큰
		if("c4f3812d3fe04f5e96bca05d4f2f8505"
				.equals(access_token)) {
			UserInfoVO userInfoVO = new UserInfoVO();
			userInfoVO.setUserId("test001");
			userInfoVO.setAuth("normal");

			return;
		}
		
		Jws<Claims> claimsJws;
		try {
			claimsJws = Jwts.parser()
			    	// 시크릿 키를 넣어주어 토큰을 검증할 수 있습니다.
			        .setSigningKey("1234567890")
			        // 해석할 토큰을 문자열(String) 형태로 넣어줍니다.
			        .parseClaimsJws(access_token);
		} catch(ExpiredJwtException e) {
			log.error(CmmnUtil.getExceptionStackTrace(e));
			throw new UserBizException("AUTH_EXPIRED");
		} catch(Exception e) {
			log.error(CmmnUtil.getExceptionStackTrace(e));
			throw new UserBizException("TOKEN_ERROR");
		}
		
		log.debug(JsonUtil.toJsonStr(claimsJws.getHeader()));
		
		Claims claims = claimsJws.getBody();
		log.debug(JsonUtil.toJsonStr(claims));
		
		if(!"access".equals(claims.get("tktyp", String.class))) {
			throw new UserBizException("NO_ACCESS");
		}
		
		String user_id = claims.get("user_id", String.class);
		
		UserInfoVO userInfoVO = cmmnDao.selectOne("login.getUserInfo", user_id);
		if(userInfoVO == null) {
			throw new UserBizException("NO_USER");
		}

	}
	
	/**
	 * refresh 토큰검증후 access 토큰 갱신값을 반환합니다.
	 * @param refresh_token
	 * @return 갱신된 access 토큰값
	 */
	public String renew_access_token(String refresh_token) {
		Jws<Claims> claimsJws;
		try {
			claimsJws = Jwts.parser()
			    	// 시크릿 키를 넣어주어 토큰을 검증할 수 있습니다.
			        .setSigningKey("1234567890")
			        // 해석할 토큰을 문자열(String) 형태로 넣어줍니다.
			        .parseClaimsJws(refresh_token);
		} catch(ExpiredJwtException e) {
			log.error(CmmnUtil.getExceptionStackTrace(e));
			throw new UserBizException("AUTH_EXPIRED");
		} catch(Exception e) {
			log.error(CmmnUtil.getExceptionStackTrace(e));
			throw new UserBizException("TOKEN_ERROR");
		}
		
		Claims claims = claimsJws.getBody();
		log.debug(JsonUtil.toJsonStr(claims));
		
		if(!"refresh".equals(claims.get("tktyp", String.class))) {
			throw new UserBizException("NO_REFRESH");
		}
		String user_id = claims.get("user_id", String.class);
		
		return gen_access_token(user_id);
	}

	/**
	 * 요청 URI가 JWT 검증대상인지 확인
	 * @param requestURI
	 * @return
	 */
	public boolean isChkJwtTarget(String requestURI) {

		if(requestURI.startsWith("/api/")) {
			return true;
		}
		return false;
	}
}
