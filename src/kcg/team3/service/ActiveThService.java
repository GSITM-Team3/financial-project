package kcg.team3.service;

import java.sql.Date;
import java.util.List;

import org.springframework.security.core.AuthenticationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import common.dao.CmmnDao;
import common.utils.common.CmmnMap;
import kcg.team3.vo.ScheduleTh;

@Service
public class ActiveThService {

   @Autowired
   CmmnDao cmmnDao;

   private final Logger log = LoggerFactory.getLogger(getClass());

   // DAO를 통해 DB에서 모든 일정 정보를 가져오는 로직
   public List<ScheduleTh> getAllSchedules() {
      List<ScheduleTh> schedules = cmmnDao.selectList("getAllSchedules");
      return schedules;
   }

   // 일정 추가
   public boolean addSchedule(CmmnMap request) {
      String userId = request.getString("userId");
      String scheContent = request.getString("scheContent");
      String scheStartDateStr = request.getString("scheStartDate");
      String scheEndDateStr = request.getString("scheEndDate");

      log.info("ActiveThService.addSchedule >>> UserId: {}, Content: {}, StartDate: {}, EndDate: {}", userId,
            scheContent, scheStartDateStr, scheEndDateStr);

      if (StringUtils.isEmpty(scheContent)) {
         log.error("일정 내용을 입력하세요.");
         return false;
      }
      if (StringUtils.isEmpty(scheStartDateStr) || StringUtils.isEmpty(scheEndDateStr)) {
         log.error("시작 날짜와 종료 날짜를 모두 입력하세요.");
         return false;
      }

      try {
         Date scheStartDate = Date.valueOf(scheStartDateStr);
         Date scheEndDate = Date.valueOf(scheEndDateStr);

         ScheduleTh scheduleTh = new ScheduleTh();
         scheduleTh.setScheContent(scheContent);
         scheduleTh.setScheStartDate(scheStartDate);
         scheduleTh.setScheEndDate(scheEndDate);

         scheduleTh.setUserId(userId);

         // 공통 DAO를 활용하여 DB에 삽입
         int insertedRecords = cmmnDao.insert("insertSchedule", scheduleTh);
         log.debug("인서트: {}", insertedRecords);
         if (insertedRecords > 0) {
            log.info("일정이 추가되었습니다: {}", scheContent);
            return true; // 일정 추가 성공을 반환
         } else {
            log.error("일정 추가에 실패했습니다.");
            return false; // 일정 추가 실패를 반환
         }
      } catch (Exception e) {
         log.error("일정 추가 중 오류 발생", e);
         return false;
      }
   }
   
   // 일정 삭제
    public boolean deleteSchedule(CmmnMap request) {
       int scheCode = request.getInt("scheCode");
        log.info("ActiveThService.deleteSchedule >>> 일정 삭제를 시작합니다. 일정 코드: {}", scheCode);

        try {
            int deletedRows = cmmnDao.delete("deleteSchedule", scheCode);
            log.debug("삭제된 행 수: {}", deletedRows);
            if (deletedRows > 0) {
                log.info("일정 삭제 완료. 삭제된 일정 코드: {}", scheCode);
                return true; // 일정 삭제 성공을 반환
            } else {
                log.warn("삭제된 행이 없습니다. 일정 코드: {}", scheCode);
                return false; // 삭제된 행이 없는 경우 반환
            }
        } catch (Exception e) {
            log.error("일정 삭제 중 오류 발생. 일정 코드: {}", scheCode, e);
            throw new RuntimeException("일정 삭제 중 오류가 발생했습니다.", e);
        }
    }
    
    // 일정 수정
    public boolean updateSchedule(CmmnMap request) {
        int scheCode = request.getInt("scheCode");
        String userId = request.getString("userId");
        String scheContent = request.getString("scheContent");
        String scheStartDateStr = request.getString("scheStartDate");
        String scheEndDateStr = request.getString("scheEndDate");

        log.info("ActiveThService.updateSchedule >>> 일정 수정 시작. 일정 코드: {}, UserId: {}, Content: {}, StartDate: {}, EndDate: {}", 
                 scheCode, userId, scheContent, scheStartDateStr, scheEndDateStr);

        if (StringUtils.isEmpty(scheContent)) {
            log.error("일정 내용을 입력하세요.");
            return false;
        }
        if (StringUtils.isEmpty(scheStartDateStr) || StringUtils.isEmpty(scheEndDateStr)) {
            log.error("시작 날짜와 종료 날짜를 모두 입력하세요.");
            return false;
        }

        try {
            Date scheStartDate = Date.valueOf(scheStartDateStr);
            Date scheEndDate = Date.valueOf(scheEndDateStr);

            ScheduleTh scheduleTh = new ScheduleTh();
            scheduleTh.setScheCode(scheCode);
            scheduleTh.setScheContent(scheContent);
            scheduleTh.setScheStartDate(scheStartDate);
            scheduleTh.setScheEndDate(scheEndDate);
            scheduleTh.setUserId(userId);

            int updatedRows = cmmnDao.update("updateSchedule", scheduleTh);
            log.debug("업데이트된 행 수: {}", updatedRows);
            if (updatedRows > 0) {
                log.info("일정 수정 완료. 수정된 일정 코드: {}", scheCode);
                return true;
            } else {
                log.warn("수정된 행이 없습니다. 일정 코드: {}", scheCode);
                return false;
            }
        } catch (Exception e) {
            log.error("일정 수정 중 오류 발생. 일정 코드: {}", scheCode, e);
            return false;
        }
    }
    
}