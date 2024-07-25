package common.exception;

public class UserBizException extends RuntimeException {
	
	private static final long serialVersionUID = -1722340690745024345L;
	
	String strMsgCode = null;
	String[] arg = null;

	public UserBizException(String msg) {
		super(msg);
		this.strMsgCode = msg;
	}
	
	public UserBizException(Throwable cause) {
		super(cause);
	}
	
	public UserBizException(String strMsgCode, String[] args) {
		super(strMsgCode);
		this.strMsgCode = strMsgCode;
		this.arg = args;
	}
	
}
