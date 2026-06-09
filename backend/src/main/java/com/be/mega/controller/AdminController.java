package com.be.mega.controller;

import com.be.mega.common.apiResponse.CustomApiResponse;
import com.be.mega.dto.request.EmailVerifyRequest;
import com.be.mega.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
