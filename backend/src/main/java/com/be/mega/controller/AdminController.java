package com.be.mega.controller;

import com.be.mega.common.apiResponse.CustomApiResponse;
import com.be.mega.dto.request.EmailVerifyRequest;
import com.be.mega.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/admin")
public class AdminController {
    private final AdminService adminService;

    @PostMapping("/verify-email")
    public CustomApiResponse<Void> verifyAdmin(@Valid @RequestBody EmailVerifyRequest request) {
        adminService.verifyAdmin(request);
        return CustomApiResponse.success(null,200,"인증 및 조회 성공");
    }

    @PatchMapping("orders/status")
    public CustomApiResponse<Integer> markAsShipped() {
        int updated = adminService.markOrderAsDelivered();
        if (updated == 0) {
            return CustomApiResponse.success(0, 200, "발송처리할 주문이 없습니다.");
        }
        return CustomApiResponse.success(updated, 200, updated + "건 발송 처리 완료");
    }
}
