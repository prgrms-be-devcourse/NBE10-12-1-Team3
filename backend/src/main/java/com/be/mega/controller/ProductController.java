package com.be.mega.controller;

import com.be.mega.service.ProductService;
import com.be.mega.common.apiResponse.CustomApiResponse;
import com.be.mega.dto.response.ShowProductResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v1/products")
@RequiredArgsConstructor
@Tag(name = "ProductController", description = "상품 조회 API")
public class ProductController {
    private final ProductService productService;

    @Operation(summary = "상품 목록 조회")
    @GetMapping
    public CustomApiResponse<ShowProductResponse> getProducts() {
        ShowProductResponse response = productService.getProducts();
        return CustomApiResponse.success(response, 200, "상품 조회 완료");
    }
}