use axum::extract::State;
use axum::{Extension, response::IntoResponse};
use serde::Serialize;

use crate::{
    error::AppError, http::response, models::bot_model::Bot, services::stats_service::StatsService,
};

#[derive(Serialize)]
pub struct StatsResponse {
    pub guilds_joined: i64,
    pub guilds_left: i64,
    pub active_guilds: i64,
}

pub async fn stats(
    Extension(bot): Extension<Bot>,
    State(state): State<crate::AppState>,
) -> Result<impl IntoResponse, AppError> {
    let stats = StatsService::get_stats(&state.pool, bot.id).await?;

    Ok(response::ok(StatsResponse {
        active_guilds: stats.active_guilds,
        guilds_joined: stats.guilds_joined,
        guilds_left: stats.guilds_left,
    }))
}
