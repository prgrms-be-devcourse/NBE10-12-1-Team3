package com.be.mega.controller;

import com.be.mega.common.apiResponse.CustomApiResponse;
import com.be.mega.dto.request.EmailVerifyRequest;
import com.be.mega.dto.response.OrderListResponse;
import com.be.mega.entity.enums.PostStatus;
import com.be.mega.service.AdminService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/v1/admin")
public class AdminController {
    private final AdminService adminService;

    @PostMapping("/verify-email")
    public CustomApiResponse<Void> verifyAdmin(@Valid @RequestBody EmailVerifyRequest request) {
        adminService.verifyAdmin(request);
        return CustomApiResponse.success(null, 200, "인증 및 조회 성공");
    }

    @GetMapping("/orders")
    public CustomApiResponse<OrderListResponse> showOrders(
            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "page는 0 이상이어야 합니다.")
            int page,
            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "size는 1 이상이어야 합니다.")
            @Max(value = 100, message = "size는 100 이하여야 합니다.")
            int size,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String orderNumber,
            @RequestParam(required = false) PostStatus postStatus,
            @RequestParam(defaultValue = "desc")
            @Pattern(
                    regexp = "asc|desc",
                    flags = Pattern.Flag.CASE_INSENSITIVE,
                    message = "sort는 asc 또는 desc만 가능합니다."
            )
            String sort
    ) {
        OrderListResponse response = adminService.showOrders(
                page,
                size,
                email,
                orderNumber,
                postStatus,
                sort
        );
        return CustomApiResponse.success(response, 200, "주문 조회 성공");
    }
}
