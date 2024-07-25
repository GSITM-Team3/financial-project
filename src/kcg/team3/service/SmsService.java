package kcg.team3.service;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.exception.NurigoMessageNotReceivedException;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import common.utils.common.CmmnMap;

@Service
public class SmsService {
   private static final Logger logger = LoggerFactory.getLogger(SmsService.class);
    private final DefaultMessageService messageService;

    public SmsService() {
        // 실제 API 키와 시크릿 키, API 엔드포인트 URL로 변경 필요
        this.messageService = NurigoApp.INSTANCE.initialize("NCSDDQMDXFUF0OX7", "ZCAOD5Q8IDTWJTET8PG0TK3WNKPAHHML", "https://api.coolsms.co.kr");
        logger.info("SmsService initialized");
    }
    
    public SingleMessageSentResponse sendSms(CmmnMap cmmnMap) throws NurigoMessageNotReceivedException {
        String from = cmmnMap.getString("from");
        String to = cmmnMap.getString("to");
        String text = cmmnMap.getString("text");

        logger.info("SMS 전송 요청 - 발신자: {}, 수신자: {}, 메시지: {}", from, to, text);

        Message message = new Message();
        message.setFrom(from);
        message.setTo(to);
        message.setText(text);

        SingleMessageSendingRequest request = new SingleMessageSendingRequest(message);
        SingleMessageSentResponse response = this.messageService.sendOne(request);

        logger.info("SMS 전송 결과 - 성공: {}, 메시지 ID: {}", response.getMessageId());

        return response;
    }
}
