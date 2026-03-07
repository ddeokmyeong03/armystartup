package com.armystartup.global.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class DateTimeUtils {

    private DateTimeUtils() {}

    public static boolean isOverlapping(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        return start1.isBefore(end2) && start2.isBefore(end1);
    }

    public static long toMinutes(LocalTime start, LocalTime end) {
        return java.time.Duration.between(start, end).toMinutes();
    }

    public static LocalDateTime toStartOfDay(LocalDate date) {
        return date.atStartOfDay();
    }

    public static LocalDateTime toEndOfDay(LocalDate date) {
        return date.atTime(LocalTime.MAX);
    }
}
