package common.utils.mybatis_paginator.springmvc;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import common.utils.mybatis_paginator.domain.PageList;

/**
 * ServletRequest 및 ModelAndView에서 PageList가 포함 된 Paginator를 꺼내고 원래 속성 이름 + Paginator 접미사라는 이름의 속성을 만듭니다.
 */
public class PageListAttrHandlerInterceptor extends HandlerInterceptorAdapter {

    public boolean preHandle(HttpServletRequest request, HttpServletResponse httpServletResponse, Object o) throws Exception {
        return true;
    }

    public void postHandle(HttpServletRequest request, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
        Enumeration<?> enumeration = request.getAttributeNames();
        while (enumeration.hasMoreElements()){
            Object element = enumeration.nextElement();
            if(element instanceof String){
                String name = (String)element;
                Object attr = request.getAttribute(name);
                if(attr instanceof PageList){
                    PageList<?> pageList = (PageList<?>)attr;
                    //원본 속성과 접미사
                    request.setAttribute(name+"Paginator", pageList.getPaginator());
                }
            }
        }
        if(modelAndView != null){
            Map<String,Object> model = modelAndView.getModel();
            Map<String,Object> newModel = new HashMap<String, Object>();
            for(Map.Entry<String, Object> item : model.entrySet()){
                Object attr = item.getValue();
                if(attr instanceof PageList){
                    PageList<?> pageList = (PageList<?>)attr;
                    //원본 속성과 접미사
                    newModel.put(item.getKey()+"Paginator", pageList.getPaginator());
                }
            }
            modelAndView.addAllObjects(newModel);
        }
    }
}
