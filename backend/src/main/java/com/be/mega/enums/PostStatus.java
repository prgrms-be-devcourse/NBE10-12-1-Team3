package com.be.mega.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PostStatus {
    READY("발송 전"),
    DELIVERED("발송 완료"),
    CANCELLED("발송 취소");

    private final String description;

}
