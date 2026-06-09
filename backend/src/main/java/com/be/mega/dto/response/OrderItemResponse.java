package com.be.mega.dto.response;

import com.be.mega.entity.OrderItem;

public record OrderItemResponse (
    Long orderItemId,
    Long itemId,
    int qunatity
) {
    public static OrderItemResponse from(OrderItem orderItem) {
        return new OrderItemResponse(
                orderItem.getId(),
                orderItem.getItemId(),
                orderItem.getItemQuantity()
        );
    }
}

