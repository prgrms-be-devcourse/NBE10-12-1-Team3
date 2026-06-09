package com.be.mega.dto.request;

import java.util.List;

public record OrderItemUpdateRequest(List<OrderRequest> orders) {
    public record OrderRequest(
            Long orderId,
            List<OrderItemRequest> orderItems
    ) {}
    public record OrderItemRequest(
            Long orderItemId,
            Long itemId,
            int quantity
    ) {}
}
