package kcg.team3.vo;

import java.sql.Date;

public class ScheduleTh {
   private int scheCode;
   private String scheContent;
   private Date scheStartDate;
   private Date scheEndDate;
   private String userId; // 사용자 ID (외래키)
   private String scheUserId; // 일정 생성한 사용자 ID

   public int getScheCode() {
      return scheCode;
   }

   public void setScheCode(int scheCode) {
      this.scheCode = scheCode;
   }

   public String getScheContent() {
      return scheContent;
   }

   public void setScheContent(String scheContent) {
      this.scheContent = scheContent;
   }

   public Date getScheStartDate() {
      return scheStartDate;
   }

   public void setScheStartDate(Date scheStartDate) {
      this.scheStartDate = scheStartDate;
   }

   public Date getScheEndDate() {
      return scheEndDate;
   }

   public void setScheEndDate(Date scheEndDate) {
      this.scheEndDate = scheEndDate;
   }

   public String getUserId() {
      return userId;
   }

   public void setUserId(String userId) {
      this.userId = userId;
   }
   
   public String getScheUserId() {
        return scheUserId;
    }

    public void setScheUserId(String scheUserId) {
        this.scheUserId = scheUserId;
    }
   
}