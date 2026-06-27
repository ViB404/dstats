use axum::{
    http::StatusCode,
    Json,
};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: T,
}

#[derive(Debug, Serialize)]
pub struct ApiMessage {
    pub success: bool,
    pub message: String,
}

pub fn ok<T: Serialize>(
    data: T,
) -> (StatusCode, Json<ApiResponse<T>>) {
    (
        StatusCode::OK,
        Json(ApiResponse {
            success: true,
            data,
        }),
    )
}

pub fn created<T: Serialize>(
    data: T,
) -> (StatusCode, Json<ApiResponse<T>>) {
    (
        StatusCode::CREATED,
        Json(ApiResponse {
            success: true,
            data,
        }),
    )
}

pub fn message(
    success: bool,
    status: StatusCode,
    message: impl Into<String>,
) -> (StatusCode, Json<ApiMessage>) {
    (
        status,
        Json(ApiMessage {
            success,
            message: message.into(),
        }),
    )
}