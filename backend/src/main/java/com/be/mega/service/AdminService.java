package com.be.mega.service;

import com.be.mega.common.apiResponse.ErrorCode;
import com.be.mega.common.exception.MegaException;
import com.be.mega.dto.request.EmailVerifyRequest;
import com.be.mega.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final OrderRepository orderRepository;

    @Value("${admin.email}")
    private String adminEmail;

    @Transactional
    public void verifyAdmin(EmailVerifyRequest request) {
        if (!adminEmail.equals(request.email())) {
            throw new MegaException(ErrorCode.FORBIDDEN);
        }
    }
}
