package com.be.mega.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

public record OrderCreateRequest(
        @Valid
        @NotNull
        OrderInfo info,

        @Valid
        @NotEmpty(message = "반드시 1개 이상의 주문이 있어야합니다.")
        List<OrderItemRequest> orders,

        @Positive(message = "총 금액은 반드시 0보다 커야합니다.")
        int totalPrice
) {
    public record OrderInfo(
            @Email(message = "올바른 이메일 형식이 아닙니다.")
            @NotBlank(message = "이메일을 반드시 입력해주세요.")
            String email,

            @NotBlank(message = "주소를 반드시 입력해주세요.")
            String address,

            @NotBlank(message = "우편번호를 반드시 입력해주세요.")
            @Pattern(regexp = "\\d{5}", message = "우편번호는 5자리 숫자여야 합니다.")
            String postalCode
    ) {
    }

    public record OrderItemRequest(
            @NotNull(message = "주문 상품을 반드시 1개 이상 골라주세요.")
            Long productId,
            @Positive(message = "수량을 반드시 1개 이상 골라주세요.")
            int quantity
    ) {
    }
}
