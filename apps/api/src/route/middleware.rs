use crate::AppState;
use crate::error::AppError;
use crate::http::response;
use crate::services::bot_service::BotService;
use axum::extract::{Request, State};
use axum::http::StatusCode;
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};

pub async fn middleware(State(state): State<AppState>, mut req: Request, next: Next) -> Response {
    let api_key = match req.headers().get("x-api-key").and_then(|h| h.to_str().ok()) {
        Some(key) => key,
        None => {
            return response::message(false, StatusCode::UNAUTHORIZED, "Need API Key")
                .into_response();
        }
    };

    match BotService::authenticate_bot(&state.pool, api_key).await {
        Ok(bot) => {
            req.extensions_mut().insert(bot);

            // Continue to handler
            next.run(req).await
        }

        Err(AppError::InvalidApiKey) => response::message(
            false,
            StatusCode::UNAUTHORIZED,
            AppError::InvalidApiKey.to_string(),
        )
        .into_response(),

        Err(err) => {
            eprintln!("{err:?}");

            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}
