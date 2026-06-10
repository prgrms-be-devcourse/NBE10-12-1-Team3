package com.be.mega.dto.request;

import java.util.List;

public record OrderCreateRequest(
        OrderInfo info,
        List<OrderItemRequest> orders,
        int totalPrice
) {
    public record OrderInfo(
            String email,
            String address,
            String postalAddress
    ) {
    }

    public record OrderItemRequest(
            Long productId,
            int quantity
    ) {
    }
}
