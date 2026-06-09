package com.be.mega.controller;

import com.be.mega.common.apiResponse.CustomApiResponse;
import com.be.mega.dto.request.OrderItemUpdateRequest;
import com.be.mega.dto.request.OrderSearchRequest;
import com.be.mega.dto.response.OrderItemUpdateResponse;
import com.be.mega.dto.response.OrderSearchResponse;
import com.be.mega.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/search")
    public CustomApiResponse<OrderSearchResponse> getOrders(
            @Valid @RequestBody OrderSearchRequest request) {
        OrderSearchResponse response = orderService.getOrdersByEmail(request.email());

        return CustomApiResponse.success(response, 200 , "사용자 주문 전체 조회 성공");

    }

    @PatchMapping("/items")
    public CustomApiResponse<OrderItemUpdateResponse> updateOrders(
            @RequestBody OrderItemUpdateRequest request) {
        OrderItemUpdateResponse response = orderService.updateOrders(request);
        return CustomApiResponse.success(response, 200, "주문 수량이 변경되었습니다.");
    }
}
