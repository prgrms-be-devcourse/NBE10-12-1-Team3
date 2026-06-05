package com.be.mega.common.exception;

import com.be.mega.common.apiResponse.CustomApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class MegaExceptionControllerAdivce {
    @ExceptionHandler(MegaException.class)
    public ResponseEntity<CustomApiResponse<?>> handleMegaException(MegaException e) {
        log.warn("MegaException", e);
        return ResponseEntity.status(e.getHttpStatusCode())
                .body(CustomApiResponse.fail(e.getErrorCode()));
    }

}
