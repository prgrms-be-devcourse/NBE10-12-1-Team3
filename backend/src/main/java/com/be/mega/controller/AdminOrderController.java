package com.be.mega.controller;

import com.be.mega.common.apiResponse.CustomApiResponse;
import com.be.mega.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/admin/orders")
public class AdminOrderController {
    private final OrderService orderService;

    @PatchMapping("/status")
    public CustomApiResponse<Void> markAsShipped() {
        orderService.markOrderAsDelivered();
        return CustomApiResponse.success(null,200,"발송 처리 완료");
    }

}
