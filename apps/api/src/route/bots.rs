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
use crate::utils::parse_snowflake::parse_snowflake;
use crate::utils::verify_hcaptcha::verify_token;

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

    Ok(response::created(RegisterBotResponse {
        api_key,
    }))
}