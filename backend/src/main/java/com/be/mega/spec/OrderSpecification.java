package com.be.mega.spec;

import com.be.mega.entity.Order;
import com.be.mega.entity.enums.PostStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class OrderSpecification {

    public Sort.Direction getSort(String sort) {
        if ("asc".equalsIgnoreCase(sort)) {
            return Sort.Direction.ASC;
        }
        return Sort.Direction.DESC;
    }

    public Specification<Order> buildOrderFilterSpec(
            String email,
            String orderNumber,
            PostStatus postStatus
    ) {
        Specification<Order> spec = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();

        if (email != null && !email.isBlank()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("email"), "%" + email + "%")
            );
        }

        if (orderNumber != null && !orderNumber.isBlank()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("orderNumber"), "%" + orderNumber + "%")
            );
        }

        if (postStatus != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("postStatus"), postStatus)
            );
        }

        return spec;
    }
}
