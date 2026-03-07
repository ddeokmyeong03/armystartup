package com.armystartup.domain.profile.service;

import com.armystartup.domain.profile.dto.request.UserProfileRequest;
import com.armystartup.domain.profile.dto.response.UserProfileResponse;
import com.armystartup.domain.profile.entity.UserProfile;
import com.armystartup.domain.profile.repository.UserProfileRepository;
import com.armystartup.domain.user.entity.User;
import com.armystartup.domain.user.repository.UserRepository;
import com.armystartup.global.exception.BusinessException;
import com.armystartup.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public UserProfileResponse saveProfile(Long userId, UserProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 이미 프로필이 존재하면 수정, 없으면 생성
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .map(existing -> {
                    existing.update(
                            request.getWakeUpTime(),
                            request.getSleepTime(),
                            request.getWeekdayPattern(),
                            request.getWeekendPattern(),
                            request.getAvailableStudyMinutes(),
                            request.getPreferredPlanIntensity(),
                            request.getMemo()
                    );
                    return existing;
                })
                .orElseGet(() -> userProfileRepository.save(
                        UserProfile.builder()
                                .user(user)
                                .wakeUpTime(request.getWakeUpTime())
                                .sleepTime(request.getSleepTime())
                                .weekdayPattern(request.getWeekdayPattern())
                                .weekendPattern(request.getWeekendPattern())
                                .availableStudyMinutes(request.getAvailableStudyMinutes())
                                .preferredPlanIntensity(request.getPreferredPlanIntensity())
                                .memo(request.getMemo())
                                .build()
                ));

        return UserProfileResponse.from(profile);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return UserProfileResponse.from(profile);
    }
}
