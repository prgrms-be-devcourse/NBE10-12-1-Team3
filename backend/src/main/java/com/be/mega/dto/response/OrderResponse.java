package com.be.mega.dto.response;

import com.be.mega.entity.Order;
import com.be.mega.entity.OrderItem;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse (
    Long orderId,
    String orderNumber,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    String email,
    String postStatus,
    int totalPrice,
    List<OrderItemResponse> orderItems
) {
    public static OrderResponse from(Order order, List<OrderItem> items) {
        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                order.getEmail(),
                order.getPostStatus().getDescription(),
                order.getTotalPrice(),
                items.stream()
                        .map(OrderItemResponse::from)
                        .toList()
        );
    }
}
