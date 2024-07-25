package kcg.team3.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import common.utils.common.CmmnMap;
import kcg.login.vo.UserInfoVO;
import kcg.team3.vo.ScheduleTh;
import kcg.team3.service.ActiveThService;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.AuthenticationException;

@RequestMapping("/active_th")
@Controller
public class ActiveThController {

   private final Logger log = LoggerFactory.getLogger(getClass());
   private final ActiveThService activeThService;

   @Autowired
   public ActiveThController(ActiveThService activeThService) {
      this.activeThService = activeThService;
   }

   // 일정 조회 (초기 화면)
   @GetMapping("/schedule_th")
   public String scheduleTh(HttpServletRequest request, HttpSession session, Model model) {
      List<ScheduleTh> schedules = activeThService.getAllSchedules();
      model.addAttribute("schedules", schedules);

      // 사용자 정보 가져오기
      UserInfoVO userInfoVO = (UserInfoVO) request.getSession().getAttribute("userInfoVO");
      String userId = userInfoVO.getUserId();
      model.addAttribute("userId", userId);

      // 이번달 날짜를 포함한 데이터 구성
      List<String> calendarEvents = new ArrayList<>();
      model.addAttribute("calendarEvents", calendarEvents);
      return "kcg/team3/Schedule_th";
   }

   // 일정 추가 (GET 메서드 사용 + 쿼리 파라미터)
   @RequestMapping("/add_schedule")
   @ResponseBody
   public ResponseEntity<String> addSchedule(CmmnMap request) {
      String userId = request.getString("userId");
      String scheContent = request.getString("scheContent");
      String scheStartDateStr = request.getString("scheStartDate");
      String scheEndDateStr = request.getString("scheEndDate");

      log.info("ActiveThController.addSchedule >>> UserId: {}, Content: {}, StartDate: {}, EndDate: {}", userId, scheContent,
            scheStartDateStr, scheEndDateStr);

      if (Objects.isNull(scheContent) || scheContent.isEmpty()) {
         return ResponseEntity.badRequest().body("일정 내용을 입력하세요.");
      }
      if (Objects.isNull(scheStartDateStr) || Objects.isNull(scheEndDateStr)) {
         return ResponseEntity.badRequest().body("시작 날짜와 종료 날짜를 모두 입력하세요.");
      }

      try {
         boolean isAdded = activeThService.addSchedule(request);
         if (isAdded) {
            return ResponseEntity.ok("일정이 성공적으로 추가되었습니다.");
         } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("일정 추가에 실패했습니다.");
         }
      } catch (Exception e) {
         log.error("일정 추가 중 오류 발생", e);
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("일정 추가 중 오류가 발생했습니다.");
      }
   }
   
   // 일정 삭제
   @RequestMapping("/delete_schedule")
    @ResponseBody
    public ResponseEntity<String> deleteSchedule(CmmnMap request) {
      int scheCode = request.getInt("scheCode");
        log.info("Delete 호출: {}", scheCode);
        try {
            activeThService.deleteSchedule(request); // 서비스에서 삭제 메서드 실행
            log.info("Delete 성공: {}", scheCode);
            return ResponseEntity.ok("일정이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            log.error("Delete 에러: {}", scheCode, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("일정 삭제 중 오류가 발생했습니다.");
        }
    }
   
   // 일정 수정
   @RequestMapping("/update_schedule")
    @ResponseBody
    public ResponseEntity<String> updateSchedule(CmmnMap request) {
        int scheCode = request.getInt("scheCode");
        String userId = request.getString("userId");
        String scheContent = request.getString("scheContent");
        String scheStartDateStr = request.getString("scheStartDate");
        String scheEndDateStr = request.getString("scheEndDate");

        log.info("ActiveThController.updateSchedule >>> ScheduleCode: {}, UserId: {}, Content: {}, StartDate: {}, EndDate: {}", 
                 scheCode, userId, scheContent, scheStartDateStr, scheEndDateStr);

        if (Objects.isNull(scheContent) || scheContent.isEmpty()) {
            return ResponseEntity.badRequest().body("일정 내용을 입력하세요.");
        }
        if (Objects.isNull(scheStartDateStr) || Objects.isNull(scheEndDateStr)) {
            return ResponseEntity.badRequest().body("시작 날짜와 종료 날짜를 모두 입력하세요.");
        }

        try {
            boolean isModified = activeThService.updateSchedule(request);
            if (isModified) {
                return ResponseEntity.ok("일정이 성공적으로 수정되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("일정 수정에 실패했습니다.");
            }
        } catch (Exception e) {
            log.error("일정 수정 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("일정 수정 중 오류가 발생했습니다.");
        }
    }
}