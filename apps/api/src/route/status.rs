use crate::http::response;
use axum::http::StatusCode;

pub async fn status() -> impl axum::response::IntoResponse {
    response::message(true, StatusCode::OK, "OK")
}
