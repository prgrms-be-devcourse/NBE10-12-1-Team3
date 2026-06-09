package com.be.mega.dto.response;

import com.be.mega.entity.Product;

public record ShowDetailProductResponse(
        String productImage,
        String detail
) {
    public static ShowDetailProductResponse from(Product product) {
        return new ShowDetailProductResponse(
                product.getProductImage(),
                product.getProductDetail()
        );
    }
}
