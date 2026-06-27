use axum::http::StatusCode;
use crate::http::response;

pub async fn status() -> impl axum::response::IntoResponse {
    response::message(true, StatusCode::OK, "OK")
}