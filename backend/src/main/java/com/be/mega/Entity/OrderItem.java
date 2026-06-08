package com.be.mega.Entity;

import com.be.mega.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_item")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class OrderItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderitem_id")
    private Long id;

    // OrderItem(N) : Order(1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "item_price", nullable = false)
    private int itemPrice;

    @Column(name = "item_quantity", nullable = false)
    private int itemQuantity;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "item_id", nullable = false)
    private int itemId;  // Product와 연관관계 없이 ID만 저장 (ERD 기준)

    // === 연관관계 편의 메서드 (Order에서 호출) ===
    public void assignOrder(Order order) {
        this.order = order; // OrderId에 order의 주문번호 등록
    }
}
