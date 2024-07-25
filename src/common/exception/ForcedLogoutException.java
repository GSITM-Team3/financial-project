package common.exception;

public class ForcedLogoutException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6050843113910778010L;
	
	String lang;
	
	public void setLang(String lang) {
		this.lang = lang;
	}
	
	public String getLang() {
		return lang;
	}

}
