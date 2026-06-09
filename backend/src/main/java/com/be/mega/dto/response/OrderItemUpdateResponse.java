package com.be.mega.dto.response;

import com.be.mega.entity.Order;
import com.be.mega.entity.OrderItem;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public record OrderItemUpdateResponse(List<OrderResponse> orders) {

    public static OrderItemUpdateResponse of(List<Order> orders, List<OrderItem> allItems) {
        Map<Long, List<OrderItem>> itemMap = allItems.stream()
                .collect(Collectors.groupingBy(oi -> oi.getOrder().getId()));

        List<OrderResponse> orderResponses = orders.stream()
                .map(order -> OrderResponse.from(
                        order,
                        itemMap.getOrDefault(order.getId(), List.of())
                ))
                .toList();

        return new OrderItemUpdateResponse(orderResponses);
    }

    public record OrderResponse(
        Long orderId,
        String postStatus,
        String orderNumber,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<OrderItemResponse> orderItems,
        int totalPrice
    ) {
        public static OrderResponse from(Order order, List<OrderItem> items) {
            return new OrderResponse(
                    order.getId(),
                    order.getPostStatus().getDescription(),
                    order.getOrderNumber(),
                    order.getCreatedAt(),
                    order.getUpdatedAt(),
                    items.stream()
                            .map(OrderItemResponse::from)
                            .toList(),
                    order.getTotalPrice()
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
