interface ApiSuccessResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    success: true;
}

interface ApiErrorResponse {
    statusCode: number;
    message: string;
    success: false;
}

export type ApiResult<T> = Promise<ApiSuccessResponse<T>>;

export function successMessage<T>(
    data: T,
    statusCode = 200,
    message = 'Success',
): ApiSuccessResponse<T> {
    return {
        statusCode,
        message,
        data,
        success: true,
    };
}

export function errorMessage(
    statusCode: number,
    message: string,
): ApiErrorResponse {
    return {
        statusCode,
        message,
        success: false,
    };
}
