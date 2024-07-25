package common.config.root_context;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.CronTriggerFactoryBean;
import org.springframework.scheduling.quartz.MethodInvokingJobDetailFactoryBean;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;

import kcg.common.svc.BatchSvc;

@Configuration
public class SchedulerConfig {
	
	@Autowired
	BatchSvc batchSvc;
	
//	@Bean
//	public MethodInvokingJobDetailFactoryBean migrateImgVideoMetaInfo() {
//		MethodInvokingJobDetailFactoryBean mf = new MethodInvokingJobDetailFactoryBean();
//		
//		mf.setTargetObject(batchSvc);
//		mf.setTargetMethod("migrateImgVideoMetaInfo");
//		mf.setConcurrent(false);
//		
//		return mf;
//	}
//	
//	@Bean
//	public CronTriggerFactoryBean migrateImgVideoMetaInfoTrigger() {
//		CronTriggerFactoryBean cb = new CronTriggerFactoryBean();
//
//		
//		cb.setJobDetail(migrateImgVideoMetaInfo().getObject());
//		String serverNo = System.getProperty("server.no","");
//		if("1".equals(serverNo)) {
//			cb.setCronExpression("0 0 23 * * ?"); // 매일 23시에 실행
//		} else if("2".equals(serverNo)) {
//			cb.setCronExpression("0 0 2 * * ?"); // 매일 2시에 실행
//		}
//		
//		return cb;
//	}
//	
//	@Bean
//	public SchedulerFactoryBean migrateImgVideoMetaInfoFactoryBean() {
//		SchedulerFactoryBean sb = new SchedulerFactoryBean();
//		
//		sb.setTriggers(migrateImgVideoMetaInfoTrigger().getObject());
//		
//		return sb;
//	}

}
