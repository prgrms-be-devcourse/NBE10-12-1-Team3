package com.be.mega.entity;

import com.be.mega.enums.PostStatus;
import com.be.mega.common.domain.BaseEntity;
import com.be.mega.entity.OrderItem;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "orders") // order는 SQL 예약어라 orders로
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
    private int postalCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "post_status", nullable = false)
    private PostStatus postStatus;

    @Column(name = "total_price", nullable = false)
    private int totalPrice;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @Column(name = "order_deletedAt")
    private LocalDateTime orderDeletedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL , orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    // === 연관관계 편의 메서드 ===
    public void addOrderItem(OrderItem orderItem) {
        this.orderItems.add(orderItem); // Order -> OrderItem 등록 (상품목록)
        orderItem.assignOrder(this); // OrderItem -> Order 등록 (상품목록의 주문번호)
    }

    // === Soft Delete ===
    public void delete() {
        this.orderDeletedAt = LocalDateTime.now(); // deletedAt 업데이트
    }

    public boolean isDeleted() {
        return this.orderDeletedAt != null; // 삭제된 레코드인지
    }



}