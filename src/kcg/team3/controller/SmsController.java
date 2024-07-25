package kcg.team3.controller;

import net.nurigo.sdk.message.exception.NurigoMessageNotReceivedException;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import common.utils.common.CmmnMap;
import kcg.team3.service.SmsService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
public class SmsController {
   
   private static final Logger logger = LoggerFactory.getLogger(SmsController.class);
    private final SmsService smsService;
    
    public SmsController(SmsService smsService) {
        this.smsService = smsService;
        logger.info("SmsController initialized");
    }

    @PostMapping("/send-sms")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> sendSms(CmmnMap smsData, HttpServletRequest request) {
       
        logger.info("SMS 전송 요청 받음 - 요청 매개변수: {}", smsData);
        logger.info("SMS 전송 요청 받음 - 요청 매개변수: {}", request.getParameter("from"));
        
        Map<String, Object> response = new HashMap<>();
        try {
            // SmsService를 통해 SMS 보내기 메서드 호출
            SingleMessageSentResponse sendResponse = smsService.sendSms(smsData);

            logger.info("SMS 전송 성공 - 발신자: {}, 수신자: {}, 메시지: {}", smsData.getString("from"), smsData.getString("to"), smsData.getString("text"));

            response.put("success", true);
            response.put("message", "SMS 전송 성공");
            return ResponseEntity.ok(response);
        } catch (NurigoMessageNotReceivedException e) {
            logger.error("SMS 전송 실패 - 발신자: {}, 수신자: {}, 메시지: {}", smsData.getString("from"), smsData.getString("to"), smsData.getString("text"), e);

            response.put("success", false);
            response.put("message", "SMS 전송 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
