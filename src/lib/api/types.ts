import ErrorCode from "./errorCodes";

export interface ApiResponse {
    code: ErrorCode,
    data?: any,
    message?: string,
}