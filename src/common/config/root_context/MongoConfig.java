package common.config.root_context;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions.Builder;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;

@Configuration
public class MongoConfig 
	//extends AbstractMongoConfiguration 
	{
	
//	@Autowired
//	Environment environment;
//	
//	// 커넥션 풀을 만들기 위한 기본 설정값을 저장하는 객체
//    static Builder options = new Builder();
//    
//    // 옵션 설정을 위한 메서드 설정
//    static Builder options() {
//         options.connectionsPerHost(30); // 시작 시 30개의 풀을 만들고 시작
//         options.minConnectionsPerHost(10); // 최소 10개를 유지
//         return options;
//    }
//
//	@Override
//	public MongoClient mongoClient() {
//		MongoCredential credential = MongoCredential.createCredential(
//				environment.getProperty("mongodb.username"), 
//				getDatabaseName(),
//				environment.getProperty("mongodb.password").toCharArray());
//		return new MongoClient(
//				new ServerAddress(
//						environment.getProperty("mongodb.host"), 
//						Integer.parseInt(environment.getProperty("mongodb.port"))), 
//				credential, 
//				options().build());
//	}
//
//	@Override
//	protected String getDatabaseName() {
//		return environment.getProperty("mongodb.database");
//	}
	
}
