package com.be.mega.dto.response;

import com.be.mega.entity.Order;
import com.be.mega.entity.OrderItem;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public record OrderListResponse(
        List<OrdersResponse> orders,
        int totalPages,
        long totalElements
) {

    public static OrderListResponse of(
            Page<Order> orderPage,
            List<OrderItem> orderItems
    ) {
        Map<Long, List<ItemsResponse>> orderItemMap = orderItems.stream()
                .collect(Collectors.groupingBy(
                        orderItem -> orderItem.getOrder().getId(),
                        Collectors.mapping(
                                ItemsResponse::of,
                                Collectors.toList()
                        )
                ));

        List<OrdersResponse> orderResponses = orderPage.getContent().stream()
                .map(order -> OrdersResponse.of(
                        order,
                        orderItemMap.getOrDefault(order.getId(), List.of())
                ))
                .toList();

        return new OrderListResponse(
                orderResponses,
                orderPage.getTotalPages(),
                orderPage.getTotalElements());
    }

    public record OrdersResponse(
            Long orderId,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            LocalDateTime deletedAt,
            String postStatus,
            String orderNumber,
            String email,
            List<ItemsResponse> orderItems,
            int totalPrice
    ) {
        public static OrdersResponse of(
                Order order,
                List<ItemsResponse> orderItems
        ) {
            return new OrdersResponse(
                    order.getId(),
                    order.getCreatedAt(),
                    order.getUpdatedAt(),
                    order.getDeletedAt(),
                    order.getPostStatus().name(),
                    order.getOrderNumber(),
                    order.getEmail(),
                    orderItems,
                    order.getTotalPrice()
            );
        }
    }

    public record ItemsResponse(
            Long orderItemId,
            Long itemId,
            int quantity
    ) {
        public static ItemsResponse of(OrderItem orderItem) {
            return new ItemsResponse(
                    orderItem.getId(),
                    orderItem.getItemId(),
                    orderItem.getItemQuantity()
            );
        }
    }
}