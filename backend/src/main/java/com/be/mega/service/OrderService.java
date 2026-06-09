package com.be.mega.service;

import com.be.mega.entity.enums.PostStatus;
import com.be.mega.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    @Transactional
    public void markOrderAsDelivered() {
        LocalDateTime start = LocalDateTime.now().minusDays(1).withHour(14).truncatedTo(ChronoUnit.HOURS);
        LocalDateTime end = LocalDateTime.now().withHour(14).truncatedTo(ChronoUnit.HOURS);
        orderRepository.bulkUpdateStatusInRange(start, end, PostStatus.READY, PostStatus.DELIVERED);
    }
}
