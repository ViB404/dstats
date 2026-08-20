use crate::AppState;
use crate::error::AppError;
use crate::http::response;
use crate::models::bot_model::Bot;
use crate::services::bot_service::{BotService, RegisterBot};
use crate::utils::verify_hcaptcha::verify_token;
use axum::extract::State;
use axum::response::IntoResponse;
use axum::{Extension, Json};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(serde::Serialize)]
struct RegisterBotResponse {
    api_key: String,
}

#[derive(Deserialize)]
pub struct CreateBotAPIRequest {
    pub hcaptcha_token: String,
    pub client_id: String,
    pub owner_id: Option<String>,
}

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<CreateBotAPIRequest>,
) -> Result<impl IntoResponse, AppError> {
    verify_token(&payload.hcaptcha_token).await?;

    let bot = RegisterBot {
        client_id: payload.client_id,
        owner_id: payload.owner_id,
    };

    let bot_register_response = BotService::register_bot(&state.pool, bot).await?;

    Ok(response::created(RegisterBotResponse {
        api_key: bot_register_response.to_string(),
    }))
}

#[derive(Serialize)]
struct BotInfoResponse {
    pub bot_id: i64,
    pub bot_name: String,
    pub bot_avatar: Option<String>,
    pub owner_id: Option<i64>,
    pub guild_count: i32,
    pub created_at: DateTime<Utc>,
}

impl From<Bot> for BotInfoResponse {
    fn from(bot: Bot) -> Self {
        Self {
            bot_id: bot.bot_id,
            bot_name: bot.bot_name,
            bot_avatar: bot.bot_avatar,
            owner_id: bot.owner_id,
            guild_count: bot.guild_count,
            created_at: bot.created_at,
        }
    }
}

pub async fn get_bot_info(Extension(bot): Extension<Bot>) -> Result<impl IntoResponse, AppError> {
    Ok(response::ok(BotInfoResponse::from(bot)))
}
