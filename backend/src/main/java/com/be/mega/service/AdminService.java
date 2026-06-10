package com.be.mega.service;

import com.be.mega.common.apiResponse.ErrorCode;
import com.be.mega.common.exception.MegaException;
import com.be.mega.dto.request.EmailVerifyRequest;
import com.be.mega.entity.enums.PostStatus;
import com.be.mega.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

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

    @Transactional
    public int markOrderAsDelivered() {
        LocalDateTime start = LocalDateTime.now().minusDays(1).withHour(14).truncatedTo(ChronoUnit.HOURS);
        LocalDateTime end = LocalDateTime.now().withHour(14).truncatedTo(ChronoUnit.HOURS);
        return orderRepository.bulkUpdateStatusInRange(start, end, PostStatus.READY, PostStatus.DELIVERED);
    }
}
