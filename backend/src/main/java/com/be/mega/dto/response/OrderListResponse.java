package com.be.mega.dto.response;

import java.util.List;

public record OrderListResponse(
        List<OrderResponse> orders
) {}
