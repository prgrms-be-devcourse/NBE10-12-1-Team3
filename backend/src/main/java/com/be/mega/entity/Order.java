package com.be.mega.entity;

import com.be.mega.entity.enums.PostStatus;
import com.be.mega.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "orders", indexes = { @Index(name = "idx_orders_created_at", columnList = "created_at DESC")})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Order extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String address;

    @Column(name = "postal_code", nullable = false)
    private String postalCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "post_status", nullable = false)
    private PostStatus postStatus;

    @Column(name = "total_price", nullable = false)
    private int totalPrice;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public void orderDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    public boolean isDeleted() {
        return this.deletedAt != null;
    }

    public void updateTotalPrice(int totalPrice) { this.totalPrice = totalPrice; }

    public void recalculateTotalPrice(List<OrderItem> items) {
        this.totalPrice = items.stream()
                .filter(item -> item.getItemQuantity() > 0)
                .mapToInt(item -> item.getItemPrice() * item.getItemQuantity())
                .sum();
    }

    public static Order create(
            String email,
            String address,
            String postalCode,
            int totalPrice,
            String orderNumber
    ){
        return new Order(
                null,
                email,
                address,
                postalCode,
                PostStatus.READY,
                totalPrice,
                orderNumber,
                null
        );
    }

}