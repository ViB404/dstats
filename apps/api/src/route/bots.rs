use axum::extract::State;
use axum::Json;
use axum::response::IntoResponse;
use serde::Deserialize;
use uuid::Uuid;
use crate::AppState;
use crate::error::AppError;
use crate::http::response;
use crate::repositories::bot_repository::CreateBot;
use crate::services::bot_service::BotService;

#[derive(serde::Serialize)]
struct RegisterBotResponse {
    api_key: String,
}

#[derive(Deserialize)]
pub struct CreateBotAPIRequest {
    pub bot_id: i64,
    pub bot_name: String,
    pub bot_avatar: Option<String>,
    pub owner_id: Option<i64>,
}

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<CreateBotAPIRequest>,
) -> Result<impl IntoResponse, AppError> {
    let api_key = Uuid::new_v4().to_string();

    let bot = CreateBot {
        api_key: api_key.clone(),
        bot_id: payload.bot_id,
        bot_name: payload.bot_name,
        bot_avatar: payload.bot_avatar,
        owner_id: payload.owner_id,
    };

    BotService::register(&state.pool, bot).await?;

    Ok(response::created(RegisterBotResponse {
        api_key,
    }))
}