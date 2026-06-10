package com.be.mega.entity;

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
    private Long itemId;

    public void assignOrder(Order order) {
        this.order = order;
    }

    public void updateQuantity(int quantity) { this.itemQuantity = quantity; }

    public Long getOrderId() { return this.order.getId(); }
}
