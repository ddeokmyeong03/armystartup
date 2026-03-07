package com.armystartup.domain.user.service;

import com.armystartup.domain.user.dto.request.UserUpdateRequest;
import com.armystartup.domain.user.dto.response.UserResponse;
import com.armystartup.domain.user.entity.User;
import com.armystartup.domain.user.repository.UserRepository;
import com.armystartup.global.exception.BusinessException;
import com.armystartup.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateUser(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (request.getNickname() != null) {
            user.updateNickname(request.getNickname());
        }
        if (request.getPhoneNumber() != null) {
            user.updatePhoneNumber(request.getPhoneNumber());
        }
        return UserResponse.from(user);
    }
}
