package com.be.mega.controller;

import com.be.mega.common.apiResponse.CustomApiResponse;
import com.be.mega.dto.request.OrderItemUpdateRequest;
import com.be.mega.dto.request.OrderSearchRequest;
import com.be.mega.dto.response.OrderItemUpdateResponse;
import com.be.mega.dto.response.OrderSearchResponse;
import com.be.mega.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @Operation(summary = "사용자 주문 전체 조회", description = "이메일 기준으로 사용자의 모든 주문 목록을 조회합니다.")
    @PostMapping("/search")
    public CustomApiResponse<OrderSearchResponse> getOrders(
            @Valid @RequestBody OrderSearchRequest request) {
        OrderSearchResponse response = orderService.getOrdersByEmail(request.email());

        return CustomApiResponse.success(response, 200 , "사용자 주문 전체 조회 성공");

    }

    @Operation(summary = "주문 수량 수정", description = "주문 항목의 수량을 수정합니다. 수량은 0 이상이어야 하며 모든 항목이 0이 될 수 없습니다.")
    @PatchMapping("/items")
    public CustomApiResponse<OrderItemUpdateResponse> updateOrders(
            @Valid @RequestBody OrderItemUpdateRequest request) {
        OrderItemUpdateResponse response = orderService.updateOrders(request);
        return CustomApiResponse.success(response, 200, "주문 수량이 변경되었습니다.");
    }

    @Operation(summary = "주문 삭제", description = "주문을 soft delete 처리합니다.")
    @DeleteMapping("/{orderId}")
    public CustomApiResponse<Void> deleteOrder(
            @PathVariable("orderId") Long orderId) {
        orderService.deleteOrder(orderId);
        return CustomApiResponse.success(null, 200, "주문이 삭제되었습니다.");
    }
}
