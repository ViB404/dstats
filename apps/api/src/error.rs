use thiserror::Error;

use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
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

    #[error("Missing environment variable: {0}")]
    EnvVarMissing(#[from] std::env::VarError),

    #[error("Network request failed: {0}")]
    RequestFailed(#[from] reqwest::Error),

    #[error("JSON serialization error: {0}")]
    Json(#[from] serde_json::Error),

    #[error("Bot not found on Discord")]
    BotNotFoundOnDiscord,

    #[error("Invalid header value: {0}")]
    InvalidHeader(#[from] reqwest::header::InvalidHeaderValue),
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

            AppError::BotNotFound
            | AppError::GuildNotFound
            | AppError::EventNotFound
            | AppError::BotGuildLinkNotFound => StatusCode::NOT_FOUND,

            AppError::BotAlreadyExists
            | AppError::GuildAlreadyExists
            | AppError::GuildAlreadyJoined
            | AppError::GuildAlreadyLeft => StatusCode::CONFLICT,

            AppError::InvalidEventType
            | AppError::InvalidPayload
            | AppError::BotNotFoundOnDiscord
            | AppError::InvalidHeader(_) => StatusCode::BAD_REQUEST,

            AppError::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,

            AppError::EnvVarMissing(_) => StatusCode::BAD_REQUEST,

            AppError::RequestFailed(_) => StatusCode::INTERNAL_SERVER_ERROR,

            AppError::Json(_) => StatusCode::INTERNAL_SERVER_ERROR,
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
