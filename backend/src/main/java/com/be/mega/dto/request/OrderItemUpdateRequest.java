package com.be.mega.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;

import java.util.List;

public record OrderItemUpdateRequest(
        @Valid  // 추가
        List<OrderRequest> orders
) {
    public record OrderRequest(
            Long orderId,
            @Valid
            List<OrderItemRequest> orderItems
    ) {
        @JsonIgnore
        @AssertTrue(message = "모든 주문 항목의 수량이 0입니다.")
        public boolean isValidQuantities() {
            if (orderItems == null) return true;
            return orderItems.stream()
                    .mapToInt(OrderItemRequest::quantity)
                    .sum() > 0;
        }
    }

    public record OrderItemRequest(
            Long orderItemId,
            Long itemId,
            @Min(value = 0, message = "수량은 0 이상이어야 합니다.")
            int quantity
    ) {}
}