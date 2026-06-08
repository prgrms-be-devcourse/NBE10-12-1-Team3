package com.be.mega.Entity;

import com.be.mega.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Product extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_price", nullable = false)
    private int productPrice;

    @Column(name = "product_image") //url
    private String productImage;

    @Column(name = "product_detail", columnDefinition = "TEXT")
    private String productDetail;
}