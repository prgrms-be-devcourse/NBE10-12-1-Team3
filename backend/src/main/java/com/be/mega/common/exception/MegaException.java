package com.be.mega.common.exception;

import com.be.mega.common.apiResponse.ErrorCode;
import lombok.Getter;

@Getter
public class MegaException extends RuntimeException{

    private final ErrorCode errorCode;

    public MegaException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public int getHttpStatusCode() {
        return this.errorCode.getStatusCode();
    }
}
