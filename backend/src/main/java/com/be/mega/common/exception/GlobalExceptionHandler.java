package com.be.mega.common.exception;

import com.be.mega.common.apiResponse.CustomApiResponse;
import com.be.mega.common.apiResponse.ErrorCode;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;
import java.util.Objects;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<CustomApiResponse<?>> handleTypeMismatch(
            MethodArgumentTypeMismatchException e
    ) {

        String fieldName = e.getName();
        String value = e.getValue() == null ? "null" : e.getValue().toString();
        String expectedType =
                Objects.requireNonNull(e.getRequiredType()).getSimpleName();

        List<String> errorMessages = List.of(
                String.format(
                        "%s 필드의 값이 잘못되었습니다. 값: %s, 기대 타입: %s",
                        fieldName,
                        value,
                        expectedType
                )
        );

        log.error(">>> MethodArgumentTypeMismatchException", e);

        return ResponseEntity.badRequest()
                .body(
                        CustomApiResponse.fail(
                                ErrorCode.PARAMETER_INVALID,
                                errorMessages
                        )
                );
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<CustomApiResponse<?>> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException e
    ) {

        log.error(">>> HttpRequestMethodNotSupportedException", e);

        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(
                        CustomApiResponse.fail(
                                ErrorCode.METHOD_INVALID,
                                List.of("지원하지 않는 HTTP 메서드입니다.")
                        )
                );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<CustomApiResponse<?>> handleNotReadable(
            HttpMessageNotReadableException e
    ) {

        log.error(">>> HttpMessageNotReadableException", e);

        if (e.getCause() instanceof MismatchedInputException mismatch) {

            String fieldName = mismatch.getPath().isEmpty()
                    ? "알 수 없는 필드"
                    : mismatch.getPath().get(0).getFieldName();

            return ResponseEntity.badRequest()
                    .body(
                            CustomApiResponse.fail(
                                    ErrorCode.PARAMETER_INVALID,
                                    List.of(fieldName + " 필드의 값이 잘못되었습니다.")
                            )
                    );
        }

        return ResponseEntity.badRequest()
                .body(
                        CustomApiResponse.fail(
                                ErrorCode.PARAMETER_INVALID,
                                List.of("잘못된 요청 데이터입니다.")
                        )
                );
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<CustomApiResponse<?>> handleEntityNotFound(
            EntityNotFoundException e
    ) {

        log.error(">>> EntityNotFoundException", e);

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(
                        CustomApiResponse.fail(
                                ErrorCode.ENTITY_NOT_FOUND,
                                List.of("객체를 찾을 수 없습니다.")
                        )
                );
    }

    @ExceptionHandler(MegaException.class)
    public ResponseEntity<CustomApiResponse<?>> handleMegaException(
            MegaException e
    ) {

        log.error(">>> MegaException", e);

        ErrorCode errorCode = e.getErrorCode();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(
                        CustomApiResponse.fail(
                                errorCode,
                                List.of(errorCode.getMessage())
                        )
                );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomApiResponse<?>> handleException(
            Exception e
    ) {

        log.error(">>> Exception", e);

        return ResponseEntity.internalServerError()
                .body(
                        CustomApiResponse.fail(
                                ErrorCode.INTERNAL_SERVER_ERROR,
                                List.of("서버 내부 오류가 발생했습니다.")
                        )
                );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CustomApiResponse<?>> handleValidation(
            MethodArgumentNotValidException e
    ) {
        log.warn("MethodArgumentNotValidException", e);

        List<String> errorMessages = e.getBindingResult()
                .getAllErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .toList();

        return ResponseEntity.badRequest()
                .body(CustomApiResponse.fail(ErrorCode.PARAMETER_INVALID, errorMessages));
    }

}