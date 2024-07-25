package common.config.handler;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor;

import common.exception.NeedAuthrizationException;
import common.utils.common.CmmnMap;
import common.utils.common.CmmnUtil;
import common.utils.json.JsonUtil;
import common.utils.mybatis_paginator.domain.PageList;
import common.utils.mybatis_paginator.domain.Paginator;
import kcg.common.svc.CommonSvc;

@Component
public class CustomReturnValueHandler implements HandlerMethodReturnValueHandler {
	
	@Autowired
	CommonSvc commonSvc;
	
	@Override
	public boolean supportsReturnType(MethodParameter returnType) {
		Class<?> parameterType = returnType.getParameterType();
		if(PageList.class.isAssignableFrom(parameterType) 
				|| List.class.isAssignableFrom(parameterType)
				|| CmmnMap.class.isAssignableFrom(parameterType)
				|| String.class.isAssignableFrom(parameterType)
				|| ResponseEntity.class.isAssignableFrom(parameterType)
				|| "void".equals(parameterType.getName())
				) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public void handleReturnValue(Object returnValue, MethodParameter returnType, ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest) throws Exception {
		
		Class<?> parameterType = returnType.getParameterType();
		HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
		
		if(returnType.hasMethodAnnotation(ResponseBody.class)) {
			StringHttpMessageConverter converter = new StringHttpMessageConverter();
			converter.setDefaultCharset(Charset.forName("utf-8"));
			
			mavContainer.setRequestHandled(false);
			
	    	List<HttpMessageConverter<?>> converters = new ArrayList<HttpMessageConverter<?>>();
	    	converters.add(converter);
	    	
	    	RequestResponseBodyMethodProcessor handler = new RequestResponseBodyMethodProcessor(converters);
	    	
	    	if(String.class.isAssignableFrom(parameterType)) {
		    	handler.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
	    	} else {
		    	handler.handleReturnValue(JsonUtil.toJsonStr(returnValue).replaceAll("&#x27;", "'"), returnType, mavContainer, webRequest);
	    	}
	    	
		} else if(PageList.class.isAssignableFrom(parameterType)) {
			
			PageList pageList = (PageList) returnValue;
			Paginator pageInfo = pageList.getPaginator();
			
			CmmnMap rslt = new CmmnMap();
			rslt.put("list", pageList);
			rslt.put("pageInfo", pageInfo);
	
			returnValue = JsonUtil.toJsonStr(rslt).replaceAll("&#x27;", "'");
			
			StringHttpMessageConverter converter = new StringHttpMessageConverter();
			converter.setDefaultCharset(Charset.forName("utf-8"));
			
			mavContainer.setRequestHandled(false);
			
	    	List<HttpMessageConverter<?>> converters = new ArrayList<HttpMessageConverter<?>>();
	    	converters.add(converter);
	    	
	    	RequestResponseBodyMethodProcessor handler = new RequestResponseBodyMethodProcessor(converters);
	    	handler.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
		} else if(List.class.isAssignableFrom(parameterType)) {
			List rslt = (List) returnValue;
			returnValue = JsonUtil.toJsonStr(rslt).replaceAll("&#x27;", "'");
			
			StringHttpMessageConverter converter = new StringHttpMessageConverter();
			converter.setDefaultCharset(Charset.forName("utf-8"));
			
			mavContainer.setRequestHandled(false);
			
	    	List<HttpMessageConverter<?>> converters = new ArrayList<HttpMessageConverter<?>>();
	    	converters.add(converter);
	    	
	    	RequestResponseBodyMethodProcessor handler = new RequestResponseBodyMethodProcessor(converters);
	    	handler.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
		} else if(CmmnMap.class.isAssignableFrom(parameterType)) {
			
			returnValue = JsonUtil.toJsonStr(returnValue).replaceAll("&#x27;", "'");
			
			StringHttpMessageConverter converter = new StringHttpMessageConverter();
			converter.setDefaultCharset(Charset.forName("utf-8"));
			
			mavContainer.setRequestHandled(false);
			
	    	List<HttpMessageConverter<?>> converters = new ArrayList<HttpMessageConverter<?>>();
	    	converters.add(converter);
	    	
	    	RequestResponseBodyMethodProcessor handler = new RequestResponseBodyMethodProcessor(converters);
	    	handler.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
	    	
		} else if(String.class.isAssignableFrom(parameterType)) {			
			mavContainer.setView(returnValue);			
		}  else if("void".equals(parameterType.getName())) {
			
			StringHttpMessageConverter converter = new StringHttpMessageConverter();
			converter.setDefaultCharset(Charset.forName("utf-8"));
			
			mavContainer.setRequestHandled(false);
			
	    	List<HttpMessageConverter<?>> converters = new ArrayList<HttpMessageConverter<?>>();
	    	converters.add(converter);
	    	
	    	RequestResponseBodyMethodProcessor handler = new RequestResponseBodyMethodProcessor(converters);
	    	handler.handleReturnValue("", returnType, mavContainer, webRequest);
		}
		
		
	}

}
