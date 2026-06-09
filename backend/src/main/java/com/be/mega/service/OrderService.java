package com.be.mega.service;

import com.be.mega.common.apiResponse.ErrorCode;
import com.be.mega.common.exception.MegaException;
import com.be.mega.dto.response.OrderSearchResponse;
import com.be.mega.entity.Order;
import com.be.mega.entity.OrderItem;
import com.be.mega.repository.OrderItemRepository;
import com.be.mega.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Transactional(readOnly = true)
    public OrderSearchResponse getOrdersByEmail(String email) {
        List<Order> orders = orderRepository.findByEmail(email);

        if(orders.isEmpty()) {
            throw new MegaException(ErrorCode.ENTITY_NOT_FOUND);
        }

        List<Long> orderIds = orders.stream()
                .map(Order::getId)
                .toList();

        List<OrderItem> allItems = orderItemRepository.findByOrderIdIn(orderIds);


        Map<Long, List<OrderItem>> itemMap = allItems.stream()
                .collect(Collectors.groupingBy(orderitem -> orderitem.getOrder().getId()));


        return OrderSearchResponse.from(orders, itemMap);
    }
}
