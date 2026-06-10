package com.be.mega.dto.response;

import com.be.mega.entity.Order;

public record OrderCreateResponse(
        String orderNumber
) {

    public static OrderCreateResponse from(Order order) {
        return new OrderCreateResponse(order.getOrderNumber());
    }
}
