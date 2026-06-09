package com.be.mega.service;

import com.be.mega.dto.response.OrderSearchResponse;
import com.be.mega.entity.Order;
import com.be.mega.entity.OrderItem;
import com.be.mega.repository.OrderItemRepository;
import com.be.mega.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderSearchResponse.OrderCoverResponse getOrdersByEmail(String email) {
        List<Order> orders = orderRepository.findByEmail(email);
        List<OrderSearchResponse.OrderResponse> orderResponses = orders.stream()
                .map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrder(order);
                    return OrderSearchResponse.OrderResponse.from(order, items);
                })
                .toList();

        return new OrderSearchResponse.OrderCoverResponse(orderResponses);
    }
}
