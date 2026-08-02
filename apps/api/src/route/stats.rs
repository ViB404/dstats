use axum::{Extension, extract::State, response::IntoResponse};

use crate::{
    error::AppError, http::response, models::bot_model::Bot, services::stats_service::StatsService,
};

pub async fn stats(
    Extension(bot): Extension<Bot>,
    State(state): State<crate::AppState>,
) -> Result<impl IntoResponse, AppError> {
    let analytics = StatsService::get_analytics(&state.pool, bot.id).await?;

    Ok(response::ok(analytics))
}
