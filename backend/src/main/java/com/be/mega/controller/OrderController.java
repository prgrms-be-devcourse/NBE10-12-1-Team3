package com.be.mega.controller;

import com.be.mega.common.apiResponse.CustomApiResponse;
import com.be.mega.dto.request.OrderListRequest;
import com.be.mega.dto.response.OrderListResponse;
import com.be.mega.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<CustomApiResponse<OrderListResponse>> getOrders(
            @RequestBody OrderListRequest request) {
        OrderListResponse response = orderService.getOrdersByEmail(request.email());

        return ResponseEntity.ok(
                CustomApiResponse.success(response, 200 , "사용자 주문 전체 조회 성공")
        );
    }
}
