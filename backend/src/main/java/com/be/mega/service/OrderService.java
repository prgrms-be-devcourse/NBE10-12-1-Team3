package com.be.mega.service;

import com.be.mega.common.apiResponse.ErrorCode;
import com.be.mega.common.exception.MegaException;
import com.be.mega.dto.request.OrderItemUpdateRequest;
import com.be.mega.dto.response.OrderItemUpdateResponse;
import com.be.mega.dto.response.OrderSearchResponse;
import com.be.mega.entity.Order;
import com.be.mega.entity.OrderItem;
import com.be.mega.repository.OrderItemRepository;
import com.be.mega.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Transactional(readOnly = true)
    public OrderSearchResponse getOrdersByEmail(String email) {
        List<Order> orders = orderRepository.findByEmailAndDeletedAtIsNull(email);

        if(orders.isEmpty()) {
            throw new MegaException(ErrorCode.ENTITY_NOT_FOUND);
        }

        List<Long> orderIds = orders.stream()
                .map(Order::getId)
                .toList();

        List<OrderItem> allItems = orderItemRepository.findByOrder_IdIn(orderIds);

        Map<Long, List<OrderItem>> itemMap = allItems.stream()
                .collect(Collectors.groupingBy(orderitem -> orderitem.getOrder().getId()));

        return OrderSearchResponse.from(orders, itemMap);
    }

    @Transactional
    public OrderItemUpdateResponse updateOrders(OrderItemUpdateRequest request) {
        List<Long> orderIds = request.orders().stream()
                .map(OrderItemUpdateRequest.OrderRequest::orderId)
                .toList();

        Map<Long, Order> orderMap = orderRepository.findAllById(orderIds).stream()
                .collect(Collectors.toMap(Order::getId, order -> order));

        Map<Long, List<OrderItem>> itemMap = orderItemRepository.findByOrder_IdIn(orderIds).stream()
                .collect(Collectors.groupingBy(OrderItem::getOrderId));

        request.orders().forEach(orderRequest -> {
            Order order =
                    Optional.ofNullable(orderMap.get(orderRequest.orderId()))
                    .orElseThrow(() -> new MegaException(ErrorCode.ENTITY_NOT_FOUND));

            List<OrderItem> items = itemMap.getOrDefault(orderRequest.orderId(), List.of());

            updateOrderItems(items, orderRequest.orderItems());
            order.recalculateTotalPrice(items);
        });

        List<OrderItem> finalItems = itemMap.values().stream()
                .flatMap(List::stream)
                .toList();

        return OrderItemUpdateResponse.of(orderMap.values().stream().toList(), finalItems);
    }

    private void updateOrderItems(List<OrderItem> items, List<OrderItemUpdateRequest.OrderItemRequest> itemRequests) {
        itemRequests.stream()
                .forEach(itemRequest ->
                        items.stream()
                                .filter(item -> item.getId().equals(itemRequest.orderItemId()))
                                .findFirst()
                                .orElseThrow(() -> new MegaException(ErrorCode.ENTITY_NOT_FOUND))
                                .updateQuantity(itemRequest.quantity())
                );
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new MegaException(ErrorCode.ENTITY_NOT_FOUND));

        if (order.isDeleted()) {
            throw new MegaException(ErrorCode.BAD_REQUEST);
        }

        order.orderDelete();
    }

}

