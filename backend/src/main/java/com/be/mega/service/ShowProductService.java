package com.be.mega.service;

import com.be.mega.entity.Product;
import com.be.mega.repository.ProductRepository;
import com.be.mega.dto.response.ShowProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowProductService {
    private final ProductRepository productRepository;

    public ShowProductResponse getProducts() {
        List<Product> products = productRepository.findAll();
        List<ShowProductResponse.ShowProductItem> items = products.stream()
                .map(product -> new ShowProductResponse.ShowProductItem(
                        product.getId(),
                        product.getProductName(),
                        product.getProductPrice(),
                        product.getProductImage()
                ))
                .toList();

        return new ShowProductResponse(items);
    }
}
