package common.config.resolver;

import java.net.URLDecoder;
import java.security.Principal;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.ui.Model;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;
import org.springframework.web.servlet.FlashMap;
import org.springframework.web.servlet.support.RequestContextUtils;

import common.exception.NeedAuthrizationException;
import common.utils.common.CmmnMap;
import common.utils.common.CmmnUtil;
import common.utils.common.ConfigExcelDn;
import common.utils.common.Device;
import common.utils.common.ExcelUpInfo;
import common.utils.common.MultipartFileList;
import common.utils.common.PagingConfig;
import common.utils.json.JsonUtil;
import common.utils.string.StringUtil;

@Component
public class CustomArgumentResolver implements HandlerMethodArgumentResolver {
	
	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		Class<?> parameterType = parameter.getParameterType();
		if(MultipartFileList.class.isAssignableFrom(parameterType) 
				|| ExcelUpInfo.class.isAssignableFrom(parameterType)
				|| PagingConfig.class.isAssignableFrom(parameterType)
				|| ConfigExcelDn.class.isAssignableFrom(parameterType)
				|| Map.class.isAssignableFrom(parameterType)
				|| Model.class.isAssignableFrom(parameterType)
				|| HttpServletRequest.class.isAssignableFrom(parameterType)
				|| HttpServletResponse.class.isAssignableFrom(parameterType)
				|| Principal.class.isAssignableFrom(parameterType)
				|| Device.class.isAssignableFrom(parameterType)
				|| HttpSession.class.isAssignableFrom(parameterType)
				) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
		
		Class<?> parameterType = parameter.getParameterType();
		
		HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
		
		if(MultipartFileList.class.isAssignableFrom(parameterType)) {	
			List<MultipartFile> fileList = webRequest.getNativeRequest(MultipartRequest.class).getFiles("fileList");
			MultipartFileList multipartFileList = new MultipartFileList();
			for(MultipartFile file : fileList) {
				multipartFileList.add(file);
			}
			return multipartFileList;
		} else if(PagingConfig.class.isAssignableFrom(parameterType)) {
			String pagingConfig_req = request.getParameter("pagingConfig");
			PagingConfig pagingConfig;
			if(pagingConfig_req != null) {
//				pagingConfig_req = StringUtil.encodeXSS(URLDecoder.decode(pagingConfig_req,"UTF-8"));
				pagingConfig = JsonUtil.fromJsonStr(PagingConfig.class, pagingConfig_req);
			} else {
				String requestBody = CmmnUtil.getRequestBody(request);
				if(StringUtil.isNotEmpty(requestBody)) {
//					requestBody = StringUtil.encodeXSS(requestBody);
					Map map = (Map) JsonUtil.fromJsonStr(Map.class, requestBody).get("pagingConfig");
					if(map == null) {
						pagingConfig = null;
					} else {
						pagingConfig = JsonUtil.fromJsonStr(PagingConfig.class, JsonUtil.toJsonStr(map));
					}
				} else {
					pagingConfig = null;
				}
			}
			return pagingConfig;
		} else if(ConfigExcelDn.class.isAssignableFrom(parameterType)) {
			String configExcelDn_req = request.getParameter("configExcelDn");
			ConfigExcelDn configExcelDn;
			if(StringUtil.isNotEmpty(configExcelDn_req)) {
//				configExcelDn_req = StringUtil.encodeXSS(URLDecoder.decode(configExcelDn_req,"UTF-8"));
				configExcelDn = JsonUtil.fromJsonStr(ConfigExcelDn.class, configExcelDn_req);
			} else {
				configExcelDn = new ConfigExcelDn();
			}
			return configExcelDn;
		} else if(Map.class.isAssignableFrom(parameterType)) {
			
			if(CmmnMap.class.isAssignableFrom(parameterType)) {
				
				
				CmmnMap cmmnMap = CmmnUtil.requestQuery2CmmnMap(request);
				
				String contentType = request.getHeader("content-type");

				if(StringUtil.contains(contentType, "multipart/form-data")) {
					String params_req = request.getParameter("params");					
					if(StringUtil.isNotEmpty(params_req)) {
//						params_req = StringUtil.encodeXSS(params_req);
						cmmnMap = JsonUtil.fromJsonStr(CmmnMap.class, params_req);
					}
				} else {
					if(StringUtil.isNotEmpty(contentType)) {
						String requestBody = CmmnUtil.getRequestBody(request);
						if(StringUtil.isNotEmpty(requestBody)) {
//							requestBody = StringUtil.encodeXSS(requestBody);
							Map map = (Map) JsonUtil.fromJsonStr(Map.class, requestBody).get("params");
							if(map != null) {
								cmmnMap.putAll(JsonUtil.fromJsonStr(CmmnMap.class, JsonUtil.toJsonStr(map)));
							}
						}
					}
				}
				
				return cmmnMap;
			} else if(FlashMap.class.isAssignableFrom(parameterType)) {
				return RequestContextUtils.getOutputFlashMap(request);
			} else {
				return mavContainer.getModel();
			}
		} else if(ExcelUpInfo.class.isAssignableFrom(parameterType)) {
			MultipartRequest mr = webRequest.getNativeRequest(MultipartRequest.class);
			MultipartFile excelFile = mr.getFiles("excelFile").get(0);
			return CmmnUtil.getExcelContents(excelFile);
		} else if(Model.class.isAssignableFrom(parameterType)) {
			return mavContainer.getModel();
		} else if(HttpServletRequest.class.isAssignableFrom(parameterType)) {
			return webRequest.getNativeRequest(HttpServletRequest.class);
		} else if(HttpServletResponse.class.isAssignableFrom(parameterType)) {
			return webRequest.getNativeResponse(HttpServletResponse.class);
		} else if(Principal.class.isAssignableFrom(parameterType)) {
			return webRequest.getUserPrincipal();
		} else if(Device.class.isAssignableFrom(parameterType)) {
			String deviceType = StringUtil.defaultString((String) request.getSession().getAttribute("deviceType"), "pc");
			Device device = new Device();
			device.setType(deviceType);
			return device;
		} else if(HttpSession.class.isAssignableFrom(parameterType)) {
			return webRequest.getNativeRequest(HttpServletRequest.class).getSession();
		} 
		return null;
	}

}
