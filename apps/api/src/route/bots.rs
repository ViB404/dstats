use crate::AppState;
use crate::error::AppError;
use crate::http::response;
use crate::models::bot_model::Bot;
use crate::repositories::bot_repository::CreateBot;
use crate::services::bot_service::BotService;
use crate::utils::parse_snowflake::parse_snowflake;
use crate::utils::verify_hcaptcha::verify_token;
use axum::extract::State;
use axum::response::IntoResponse;
use axum::{Extension, Json};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(serde::Serialize)]
struct RegisterBotResponse {
    api_key: String,
}

#[derive(Deserialize)]
pub struct CreateBotAPIRequest {
    pub hcaptcha_token: String,
    pub bot_id: String,
    pub bot_name: String,
    pub bot_avatar: Option<String>,
    pub owner_id: Option<String>,
}

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<CreateBotAPIRequest>,
) -> Result<impl IntoResponse, AppError> {
    let api_key = Uuid::new_v4().to_string();

    println!("{}", payload.hcaptcha_token);

    verify_token(&payload.hcaptcha_token).await?;

    let bot = CreateBot {
        api_key: api_key.clone(),
        bot_id: parse_snowflake(payload.bot_id)?,
        bot_name: payload.bot_name,
        bot_avatar: payload.bot_avatar,
        owner_id: payload.owner_id.map(|id| parse_snowflake(id)).transpose()?,
    };

    BotService::register_bot(&state.pool, bot).await?;

    Ok(response::created(RegisterBotResponse { api_key }))
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
