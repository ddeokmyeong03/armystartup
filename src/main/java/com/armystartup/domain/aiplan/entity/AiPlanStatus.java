package com.armystartup.domain.aiplan.entity;

public enum AiPlanStatus {
    RECOMMENDED, // AI가 추천한 상태 (미적용)
    APPLIED,     // 사용자가 일정에 적용한 상태
    COMPLETED,   // 수행 완료
    MISSED       // 미완료
}
