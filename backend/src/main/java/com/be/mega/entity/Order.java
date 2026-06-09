package com.be.mega.entity;

import com.be.mega.entity.enums.PostStatus;
import com.be.mega.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;


@Entity
@Table(name = "orders")
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

    @Column(name = "deleted_at")
    @ColumnDefault("null")
    private LocalDateTime deletedAt;

    public void orderDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    public boolean isDeleted() {
        return this.deletedAt != null;
    }

}