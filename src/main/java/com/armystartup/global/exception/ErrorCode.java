package com.armystartup.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Common
    INVALID_INPUT_VALUE(400, "C001", "잘못된 입력값입니다."),
    METHOD_NOT_ALLOWED(405, "C002", "허용되지 않는 HTTP 메서드입니다."),
    INTERNAL_SERVER_ERROR(500, "C003", "서버 내부 오류가 발생했습니다."),
    INVALID_TYPE_VALUE(400, "C004", "잘못된 타입입니다."),
    ACCESS_DENIED(403, "C005", "접근 권한이 없습니다."),

    // Auth
    UNAUTHORIZED(401, "A001", "인증이 필요합니다."),
    INVALID_TOKEN(401, "A002", "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(401, "A003", "만료된 토큰입니다."),
    INVALID_CREDENTIALS(401, "A004", "이메일 또는 비밀번호가 올바르지 않습니다."),

    // User
    USER_NOT_FOUND(404, "U001", "존재하지 않는 사용자입니다."),
    DUPLICATE_EMAIL(409, "U002", "이미 사용 중인 이메일입니다."),

    // Schedule
    SCHEDULE_NOT_FOUND(404, "S001", "존재하지 않는 일정입니다."),
    SCHEDULE_ACCESS_DENIED(403, "S002", "해당 일정에 대한 권한이 없습니다."),

    // Goal
    GOAL_NOT_FOUND(404, "G001", "존재하지 않는 목표입니다."),
    GOAL_ACCESS_DENIED(403, "G002", "해당 목표에 대한 권한이 없습니다."),

    // AiPlan
    AI_PLAN_NOT_FOUND(404, "P001", "존재하지 않는 AI 계획입니다."),
    AI_PLAN_ACCESS_DENIED(403, "P002", "해당 AI 계획에 대한 권한이 없습니다.");

    private final int status;
    private final String code;
    private final String message;
}
