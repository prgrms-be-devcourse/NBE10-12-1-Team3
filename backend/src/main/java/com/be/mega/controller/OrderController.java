package com.be.mega.controller;

import com.be.mega.common.apiResponse.CustomApiResponse;
import com.be.mega.dto.request.OrderSearchRequest;
import com.be.mega.dto.response.OrderSearchResponse;
import com.be.mega.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
