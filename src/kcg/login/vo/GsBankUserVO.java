package kcg.login.vo;

import java.math.BigDecimal;

public class GsBankUserVO {

	  // 사용자 일련번호
  private Integer userSn;

  // 그냥 String 사용
  private String userPhotoPathNm;

  // 사용자 명
  private String userNm;

  // 부서 명
  private String deptNm;

  // 직위 명
  private String jbpsNm;

  // 휴대 전화번호
  private String mblTelno;

  // 이메일 주소 얘로 로그인할것임
  private String emlAddr;

  // 입사 일자
  private String jncmpYmd;

  // 기타 내용
  private String etcCn;

  // 비밀번호 값 암호화 필요
  private String pswdVl;

  // 최초 등록 일시 CURRENT_DATE
  private String frstRegDt;

  // 최초 등록자 일련번호
  private BigDecimal frstRgtrSn;

  // 최종 수정 일시
  private String lastMdfcnDt;

  // 사용 여부
  private String useYn;

	public Integer getUserSn() {
		return userSn;
	}

	public void setUserSn(Integer userSn) {
		this.userSn = userSn;
	}

	public String getUserPhotoPathNm() {
		return userPhotoPathNm;
	}

	public void setUserPhotoPathNm(String userPhotoPathNm) {
		this.userPhotoPathNm = userPhotoPathNm;
	}

	public String getUserNm() {
		return userNm;
	}

	public void setUserNm(String userNm) {
		this.userNm = userNm;
	}

	public String getDeptNm() {
		return deptNm;
	}

	public void setDeptNm(String deptNm) {
		this.deptNm = deptNm;
	}

	public String getJbpsNm() {
		return jbpsNm;
	}

	public void setJbpsNm(String jbpsNm) {
		this.jbpsNm = jbpsNm;
	}

	public String getMblTelno() {
		return mblTelno;
	}

	public void setMblTelno(String mblTelno) {
		this.mblTelno = mblTelno;
	}

	public String getEmlAddr() {
		return emlAddr;
	}

	public void setEmlAddr(String emlAddr) {
		this.emlAddr = emlAddr;
	}

	public String getJncmpYmd() {
		return jncmpYmd;
	}

	public void setJncmpYmd(String jncmpYmd) {
		this.jncmpYmd = jncmpYmd;
	}

	public String getEtcCn() {
		return etcCn;
	}

	public void setEtcCn(String etcCn) {
		this.etcCn = etcCn;
	}

	public String getPswdVl() {
		return pswdVl;
	}

	public void setPswdVl(String pswdVl) {
		this.pswdVl = pswdVl;
	}

	public String getFrstRegDt() {
		return frstRegDt;
	}

	public void setFrstRegDt(String frstRegDt) {
		this.frstRegDt = frstRegDt;
	}

	public BigDecimal getFrstRgtrSn() {
		return frstRgtrSn;
	}

	public void setFrstRgtrSn(BigDecimal frstRgtrSn) {
		this.frstRgtrSn = frstRgtrSn;
	}

	public String getLastMdfcnDt() {
		return lastMdfcnDt;
	}

	public void setLastMdfcnDt(String lastMdfcnDt) {
		this.lastMdfcnDt = lastMdfcnDt;
	}

	public String getUseYn() {
		return useYn;
	}

	public void setUseYn(String useYn) {
		this.useYn = useYn;
	}

}
