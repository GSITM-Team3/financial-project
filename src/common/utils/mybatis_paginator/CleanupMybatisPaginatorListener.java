package common.utils.mybatis_paginator;

import javax.servlet.ServletContextEvent;

public class CleanupMybatisPaginatorListener {
   

    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        OffsetLimitInterceptor.Pool.shutdownNow();
    }
}
