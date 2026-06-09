package com.be.mega.service;

import com.be.mega.entity.Product;
import com.be.mega.repository.ProductRepository;
import com.be.mega.dto.response.ShowProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {
    private final ProductRepository productRepository;

    public ShowProductResponse getProducts() {
        List<Product> products = productRepository.findAll();

        return ShowProductResponse.from(products);
    }
}
