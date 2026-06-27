use thiserror::Error;

use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("Bot not found")]
    BotNotFound,

    #[error("Guild not found")]
    GuildNotFound,

    #[error("Event not found")]
    EventNotFound,

    #[error("Bot guild link not found")]
    BotGuildLinkNotFound,

    #[error("Invalid API key")]
    InvalidApiKey,

    #[error("Bot already exists")]
    BotAlreadyExists,

    #[error("Guild already exists")]
    GuildAlreadyExists,

    #[error("Bot is already in this guild")]
    GuildAlreadyJoined,

    #[error("Bot has already left this guild")]
    GuildAlreadyLeft,

    #[error("Invalid event type")]
    InvalidEventType,

    #[error("Invalid payload")]
    InvalidPayload,
}

pub type AppResult<T> = Result<T, AppError>;

#[derive(Serialize)]
struct ErrorResponse {
    success: bool,
    message: String,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let status = match self {
            AppError::InvalidApiKey => StatusCode::UNAUTHORIZED,
            AppError::BotNotFound => StatusCode::NOT_FOUND,
            AppError::GuildNotFound => StatusCode::NOT_FOUND,
            AppError::EventNotFound => StatusCode::NOT_FOUND,
            AppError::BotAlreadyExists => StatusCode::CONFLICT,
            AppError::GuildAlreadyExists => StatusCode::CONFLICT,
            AppError::GuildAlreadyJoined => StatusCode::CONFLICT,
            AppError::GuildAlreadyLeft => StatusCode::CONFLICT,
            AppError::InvalidEventType => StatusCode::BAD_REQUEST,
            AppError::InvalidPayload => StatusCode::BAD_REQUEST,
            AppError::BotGuildLinkNotFound => StatusCode::NOT_FOUND,
            AppError::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,
        };

        (
            status,
            Json(ErrorResponse {
                success: false,
                message: self.to_string(),
            }),
        )
            .into_response()
    }
}