package com.be.mega.service;

import com.be.mega.common.apiResponse.ErrorCode;
import com.be.mega.common.exception.MegaException;
import com.be.mega.dto.request.OrderCreateRequest;
import com.be.mega.dto.request.OrderItemUpdateRequest;
import com.be.mega.dto.response.OrderCreateResponse;
import com.be.mega.dto.response.OrderItemUpdateResponse;
import com.be.mega.dto.response.OrderSearchResponse;
import com.be.mega.entity.Order;
import com.be.mega.entity.OrderItem;
import com.be.mega.entity.Product;
import com.be.mega.repository.OrderItemRepository;
import com.be.mega.repository.OrderRepository;
import com.be.mega.repository.ProductRepository;
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
    private final ProductRepository productRepository;

    private String createOrderNumber() {
        return String.valueOf(System.currentTimeMillis());
    }


    @Transactional(readOnly = true)
    public OrderSearchResponse getOrdersByEmail(String email) {
        List<Order> orders = orderRepository.findByEmailAndDeletedAtIsNull(email);

        if (orders.isEmpty()) {
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

    @Transactional
    public OrderCreateResponse createOrder(OrderCreateRequest request) {
        List<Long> productIds = request.orders().stream()
                .map(OrderCreateRequest.OrderItemRequest::productId)
                .toList();

        List<Product> products = productRepository.findAllById(productIds);

        Map<Long, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, product -> product));

        int calculatedTotalPrice = calculateTotalPrice(request.orders(), productMap);


        if (calculatedTotalPrice != request.totalPrice()) {
            throw new MegaException(ErrorCode.BAD_REQUEST);
        }

        String orderNumber = createOrderNumber();

        Order order = Order.create(
                request.info().email(),
                request.info().address(),
                request.info().postalCode(),
                calculatedTotalPrice,
                orderNumber
        );

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = request.orders().stream()
                .map(orderItemRequest -> {
                    Product product = getProduct(productMap, orderItemRequest.productId());

                    return OrderItem.create(savedOrder, product, orderItemRequest.quantity());
                })
                .toList();

        orderItemRepository.saveAll(orderItems);

        return OrderCreateResponse.from(savedOrder);
    }

    private int calculateTotalPrice(
            List<OrderCreateRequest.OrderItemRequest> orderItems,
            Map<Long, Product> productMap
    ) {
        return orderItems.stream()
                .mapToInt(orderItemRequest -> {
                    Product product = getProduct(productMap, orderItemRequest.productId());
                    return product.getProductPrice() * orderItemRequest.quantity();
                })
                .sum();

    }

    private Product getProduct(Map<Long, Product> productMap, Long productId) {
        Product product = productMap.get(productId);
        if (product == null) {
            throw new MegaException(ErrorCode.ENTITY_NOT_FOUND);
        }
        return product;
    }
}

