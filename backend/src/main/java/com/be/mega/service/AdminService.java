package com.be.mega.service;

import com.be.mega.common.apiResponse.ErrorCode;
import com.be.mega.common.exception.MegaException;
import com.be.mega.dto.request.EmailVerifyRequest;
import com.be.mega.dto.response.OrderListResponse;
import com.be.mega.entity.Order;
import com.be.mega.entity.OrderItem;
import com.be.mega.entity.enums.PostStatus;
import com.be.mega.repository.OrderItemRepository;
import com.be.mega.repository.OrderRepository;
import com.be.mega.spec.OrderSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderSpecification orderSpecification;

    @Value("${admin.email}")
    private String adminEmail;

    @Transactional
    public void verifyAdmin(EmailVerifyRequest request) {
        if (!adminEmail.equals(request.email())) {
            throw new MegaException(ErrorCode.FORBIDDEN);
        }
    }

    @Transactional(readOnly = true)
    public OrderListResponse showOrders(
            int page,
            int size,
            String email,
            String orderNumber,
            PostStatus postStatus,
            String sort
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(orderSpecification.getSort(sort), "createdAt"));
        Specification<Order> spec = orderSpecification.buildOrderFilterSpec(email, orderNumber, postStatus);

        Page<Order> orderPage = orderRepository.findAll(spec, pageable);

        List<Long> orderIds = orderPage.getContent().stream()
                .map(Order::getId)
                .toList();

        List<OrderItem> orderItems = orderIds.isEmpty()
                ? List.of()
                : orderItemRepository.findByOrder_IdIn(orderIds);

        return OrderListResponse.of(orderPage, orderItems);
    }

}
