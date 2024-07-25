package kcg.login.vo;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserInfoVO implements UserDetails {

	private static final long serialVersionUID = -4995442413856256404L;

	private String userId; // 사용자 아이디
	private String userPw; // 저장된 비밀번호
	private String userPwInput; // 입력한 비밀번호
	private String name; // 성명
	private String sexcd; // 성별
	private String handphone; // 핸드폰
	private String admintel; // 행정전화번호
	private String officetel; // 사무실전화번호
	private String dept; // 부서코드
	private String deptMogahacd; // 부서코드
	private String rdeptMogahacd; // 부서코드(계사용안할시)
	private String fdeptnm; // 말단부서명
	private String tdeptNm; // 부서명총칭
	private String ldeptnm; // 부서명약칭1
	private String sdeptnm; // 부서명약칭2
	private String jikgubCd; // 직급코드
	private String jikgubNm; // 직급명
	private String positioncd; // 직위코드
	private String positionnm; // 직위코드
	private String statusCd; // 재직상태코드
	private String statusnm; // 재직상태명
	private String email; // 이메일
	private String auth; // 권한
	private String fromIamYn; // 업무포탈을 통한 로그인여부
	private String adminYn; // 관리자여부
	private String firstYn; // 최초접속여부
	private String gisAuth; // GIS권한
	private List<MenuVO> menuList; //
	private String prodName;

	private String picMblTelno; // 전화번호

	private Collection<SimpleGrantedAuthority> authorities; // 계정이 가지고 있는 권한 목록
	
	public String getProdName() {
		return prodName;
	}

	public void setProdName(String prodName) {
		this.prodName = prodName;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserPw() {
		return userPw;
	}

	public void setUserPw(String userPw) {
		System.out.println("===============");
		this.userPw = userPw;
	}

	public String getUserPwInput() {
		return userPwInput;
	}

	public void setUserPwInput(String userPwInput) {
		this.userPwInput = userPwInput;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSexcd() {
		return sexcd;
	}

	public void setSexcd(String sexcd) {
		this.sexcd = sexcd;
	}

	public String getHandphone() {
		return handphone;
	}

	public void setHandphone(String handphone) {
		this.handphone = handphone;
	}

	public String getAdmintel() {
		return admintel;
	}

	public void setAdmintel(String admintel) {
		this.admintel = admintel;
	}

	public String getOfficetel() {
		return officetel;
	}

	public void setOfficetel(String officetel) {
		this.officetel = officetel;
	}

	public String getDept() {
		return dept;
	}

	public void setDept(String dept) {
		this.dept = dept;
	}

	public String getDeptMogahacd() {
		return deptMogahacd;
	}

	public void setDeptMogahacd(String deptMogahacd) {
		this.deptMogahacd = deptMogahacd;
	}

	public String getRdeptMogahacd() {
		return rdeptMogahacd;
	}

	public void setRdeptMogahacd(String rdeptMogahacd) {
		this.rdeptMogahacd = rdeptMogahacd;
	}

	public String getFdeptnm() {
		return fdeptnm;
	}

	public void setFdeptnm(String fdeptnm) {
		this.fdeptnm = fdeptnm;
	}

	public String getTdeptNm() {
		return tdeptNm;
	}

	public void setTdeptNm(String tdeptNm) {
		this.tdeptNm = tdeptNm;
	}

	public String getLdeptnm() {
		return ldeptnm;
	}

	public void setLdeptnm(String ldeptnm) {
		this.ldeptnm = ldeptnm;
	}

	public String getSdeptnm() {
		return sdeptnm;
	}

	public void setSdeptnm(String sdeptnm) {
		this.sdeptnm = sdeptnm;
	}

	public String getJikgubCd() {
		return jikgubCd;
	}

	public void setJikgubCd(String jikgubCd) {
		this.jikgubCd = jikgubCd;
	}

	public String getJikgubNm() {
		return jikgubNm;
	}

	public void setJikgubNm(String jikgubNm) {
		this.jikgubNm = jikgubNm;
	}

	public String getPositioncd() {
		return positioncd;
	}

	public void setPositioncd(String positioncd) {
		this.positioncd = positioncd;
	}

	public String getPositionnm() {
		return positionnm;
	}

	public void setPositionnm(String positionnm) {
		this.positionnm = positionnm;
	}

	public String getStatusCd() {
		return statusCd;
	}

	public void setStatusCd(String statusCd) {
		this.statusCd = statusCd;
	}

	public String getStatusnm() {
		return statusnm;
	}

	public void setStatusnm(String statusnm) {
		this.statusnm = statusnm;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAuth() {
		return auth;
	}

	public void setAuth(String auth) {
		this.auth = auth;
	}

	public void setAuthorities(Collection<SimpleGrantedAuthority> authorities) {
		this.authorities = authorities;
	}

	public String getFromIamYn() {
		return fromIamYn;
	}

	public void setFromIamYn(String fromIamYn) {
		this.fromIamYn = fromIamYn;
	}

	public String getAdminYn() {
		return adminYn;
	}

	public void setAdminYn(String adminYn) {
		this.adminYn = adminYn;
	}

	public String getFirstYn() {
		return firstYn;
	}

	public void setFirstYn(String firstYn) {
		this.firstYn = firstYn;
	}

	public String getGisAuth() {
		return gisAuth;
	}

	public void setGisAuth(String gisAuth) {
		this.gisAuth = gisAuth;
	}

	public List<MenuVO> getMenuList() {
		return menuList;
	}

	public void setMenuList(List<MenuVO> menuList) {
		this.menuList = menuList;
	}

	public String getPicMblTelno() {
		System.out.println("***********************************************");
		return picMblTelno;
	}

	public void setPicMblTelno(String picMblTelno) {
		System.out.println("---------------------------------------------");
		this.picMblTelno = picMblTelno;
	}

	@Override
	public String getPassword() {
		return getUserPw();
	}

	@Override
	public String getUsername() {
		return getUserId();
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() { // 계정이 갖고있는 권한목록을 리턴한다.
		return authorities;
	}

	@Override
	public boolean isAccountNonExpired() { // 계정이 만료되지 않았는지를 리턴(true를 리턴하면 만료되지 않음을 의미)
		return true; // 체크를 하지 않겠다는 의미
	}

	@Override
	public boolean isAccountNonLocked() { // 계정이 잠겨있지 않은지를 리턴(true를 리턴하면 계정이 잠겨있지 않음을 의미)
		return true; // 체크를 하지 않겠다는 의미
	}

	@Override
	public boolean isCredentialsNonExpired() { // 계정의 패스워드가 만료되지 않았는지를 리턴(true를 리턴하면 패스워드가 만료되지 않음을 의미)
		return true; // 체크를 하지 않겠다는 의미
	}

	@Override
	public boolean isEnabled() { // 계정이 사용가능한 계정인지를 리턴한다(true를 리턴하면 사용가능한 계정인지를 의미)
		return true; // 체크를 하지 않겠다는 의미
	}

}
