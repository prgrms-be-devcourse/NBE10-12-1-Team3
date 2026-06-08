package com.be.mega.EnumClass;

public enum PostStatus {
    READY("발송 전"),
    DELIVERED("발송 완료"),
    CANCELLED("발송 취소");

    private final String description;

    PostStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}