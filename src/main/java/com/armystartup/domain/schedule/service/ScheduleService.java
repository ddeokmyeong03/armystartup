package com.armystartup.domain.schedule.service;

import com.armystartup.domain.schedule.dto.request.ScheduleCreateRequest;
import com.armystartup.domain.schedule.dto.request.ScheduleUpdateRequest;
import com.armystartup.domain.schedule.dto.response.ScheduleResponse;
import com.armystartup.domain.schedule.entity.Schedule;
import com.armystartup.domain.schedule.repository.ScheduleRepository;
import com.armystartup.domain.user.entity.User;
import com.armystartup.domain.user.repository.UserRepository;
import com.armystartup.global.exception.BusinessException;
import com.armystartup.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    @Transactional
    public ScheduleResponse create(Long userId, ScheduleCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Schedule schedule = Schedule.builder()
                .user(user)
                .title(request.getTitle())
                .scheduleDate(request.getScheduleDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .repeatType(request.getRepeatType())
                .category(request.getCategory())
                .memo(request.getMemo())
                .build();

        return ScheduleResponse.from(scheduleRepository.save(schedule));
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> getAll(Long userId) {
        return scheduleRepository
                .findByUserIdOrderByScheduleDateAscStartTimeAsc(userId)
                .stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> getByDate(Long userId, LocalDate date) {
        return scheduleRepository
                .findByUserIdAndScheduleDateOrderByStartTimeAsc(userId, date)
                .stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> getByDateRange(Long userId, LocalDate from, LocalDate to) {
        return scheduleRepository
                .findByUserIdAndScheduleDateBetweenOrderByScheduleDateAscStartTimeAsc(userId, from, to)
                .stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ScheduleResponse getOne(Long userId, Long scheduleId) {
        Schedule schedule = findAndVerifyOwner(userId, scheduleId);
        return ScheduleResponse.from(schedule);
    }

    @Transactional
    public ScheduleResponse update(Long userId, Long scheduleId, ScheduleUpdateRequest request) {
        Schedule schedule = findAndVerifyOwner(userId, scheduleId);
        schedule.update(
                request.getTitle(),
                request.getScheduleDate(),
                request.getStartTime(),
                request.getEndTime(),
                request.getRepeatType(),
                request.getCategory(),
                request.getMemo()
        );
        return ScheduleResponse.from(schedule);
    }

    @Transactional
    public void delete(Long userId, Long scheduleId) {
        Schedule schedule = findAndVerifyOwner(userId, scheduleId);
        scheduleRepository.delete(schedule);
    }

    private Schedule findAndVerifyOwner(Long userId, Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));
        if (!schedule.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.SCHEDULE_ACCESS_DENIED);
        }
        return schedule;
    }
}
