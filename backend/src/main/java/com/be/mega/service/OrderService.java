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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Transactional(readOnly = true)
    public OrderSearchResponse getOrdersByEmail(String email) {
        List<Order> orders = orderRepository.findByEmail(email);

        if(orders.isEmpty()) {
            throw new MegaException(ErrorCode.ENTITY_NOT_FOUND);
        }

        List<Long> orderIds = orders.stream()
                .map(Order::getId)
                .toList();

        List<OrderItem> allItems = orderItemRepository.findByOrderIdIn(orderIds);


        Map<Long, List<OrderItem>> itemMap = allItems.stream()
                .collect(Collectors.groupingBy(orderitem -> orderitem.getOrder().getId()));


        return OrderSearchResponse.from(orders, itemMap);
    }

    @Transactional
    public OrderItemUpdateResponse updateOrders(OrderItemUpdateRequest request) {

        List<Order> updatedOrders = request.orders().stream()
                .map(orderRequest -> {
                    Order order = orderRepository.findById(orderRequest.orderId())
                            .orElseThrow(() -> new MegaException(ErrorCode.ENTITY_NOT_FOUND));

                    List<OrderItem> items = orderItemRepository.findByOrderIdIn(List.of(orderRequest.orderId()));

                    updateOrderItems(items, orderRequest.orderItems());
                    recalculateTotalPrice(order, items);

                    return order;
                })
                .toList();

        List<Long> orderIds = updatedOrders.stream()
                .map(Order::getId)
                .toList();

        List<OrderItem> allItems = orderItemRepository.findByOrderIdIn(orderIds);
        return OrderItemUpdateResponse.of(updatedOrders, allItems);
    }


    private void updateOrderItems(List<OrderItem> items, List<OrderItemUpdateRequest.OrderItemRequest> itemRequests) {
        itemRequests.forEach(itemRequest ->
                items.stream()
                        .filter(item -> item.getId().equals(itemRequest.orderItemId()))
                        .findFirst()
                        .orElseThrow(() -> new MegaException(ErrorCode.ENTITY_NOT_FOUND))
                        .updateQuantity(itemRequest.quantity())
        );
    }


    private void recalculateTotalPrice(Order order, List<OrderItem> items) {
        int totalPrice = items.stream()
                .mapToInt(item -> item.getItemPrice() * item.getItemQuantity())
                .sum();
        order.updateTotalPrice(totalPrice);
    }
}

