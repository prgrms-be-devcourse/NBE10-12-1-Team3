package com.be.mega.controller;

import com.be.mega.service.ShowProductService;
import com.be.mega.common.apiResponse.CustomApiResponse;
import com.be.mega.dto.response.ShowProductResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v1/products")
@RequiredArgsConstructor
@Tag(name = "ShowProductController", description = "상품 조회 API")
public class ShowProductController {
    private final ShowProductService showProductService;

    @Operation(summary = "상품 목록 조회")
    @GetMapping
    @Transactional(readOnly = true)
    public CustomApiResponse<ShowProductResponse> getProducts() {
        ShowProductResponse response = showProductService.getProducts();
        return CustomApiResponse.success(response, 200, "상품 조회 완료");
    }
}