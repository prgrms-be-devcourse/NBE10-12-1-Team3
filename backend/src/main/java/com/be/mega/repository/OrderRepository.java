package com.be.mega.repository;

import com.be.mega.entity.Order;
import com.be.mega.entity.enums.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Order ord SET ord.postStatus = :newStatus WHERE ord.createdAt >= :start AND ord.createdAt < :end AND ord.postStatus = :currentStatus")
    int bulkUpdateStatusInRange(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("currentStatus") PostStatus currentStatus,
            @Param("newStatus") PostStatus newStatus
    );

}
