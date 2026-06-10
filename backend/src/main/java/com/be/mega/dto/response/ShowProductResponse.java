package com.be.mega.dto.response;

import com.be.mega.entity.Product;

import java.util.List;

public record ShowProductResponse(
        List<ProductItem> items
) {
    public static ShowProductResponse from(List<Product> products) {
        List<ProductItem> items = products.stream()
                .map(ProductItem::from)
                .toList();

        return new ShowProductResponse(items);
    }

    public record ProductItem(
            Long productId,
            String productName,
            int productPrice,
            String productImage
    ) {
        public static ProductItem from(Product product) {
            return new ProductItem(
                    product.getId(),
                    product.getProductName(),
                    product.getProductPrice(),
                    product.getProductImage()
            );
        }
    }
}