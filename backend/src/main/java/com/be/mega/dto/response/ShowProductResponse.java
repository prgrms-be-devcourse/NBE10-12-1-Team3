package com.be.mega.dto.response;

import java.util.List;

public record ShowProductResponse(
        List<ShowProductItem> items
) {
    public record ShowProductItem(
            Long productId,
            String productName,
            int productPrice,
            String productImage) {
    }
}