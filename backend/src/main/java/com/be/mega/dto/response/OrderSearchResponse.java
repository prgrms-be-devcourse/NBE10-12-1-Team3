package com.be.mega.dto.response;

import com.be.mega.entity.Order;
import com.be.mega.entity.OrderItem;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record OrderSearchResponse(List<OrderResponse> orders) {
    public static OrderSearchResponse from(List<Order> orders, Map<Long, List<OrderItem>> itemMap) {
        List<OrderResponse> orderResponses = orders.stream()
                .map(order -> OrderResponse.from(
                        order,
                        itemMap.getOrDefault(order.getId(), List.of())
                ))
                .toList();
        return new OrderSearchResponse(orderResponses);
    }
    public record OrderResponse(
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

    public record OrderItemResponse(
            Long orderItemId,
            Long itemId,
            int quantity
    ) {
        public static OrderItemResponse from(OrderItem orderItem) {
            return new OrderItemResponse(
                    orderItem.getId(),
                    orderItem.getItemId(),
                    orderItem.getItemQuantity()
            );
        }
    }
}