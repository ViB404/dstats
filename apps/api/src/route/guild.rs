use crate::AppState;
use crate::error::AppError;
use crate::models::bot_model::Bot;
use crate::services::guild_service::{CreateGuildJoin, GuildService};
use axum::extract::State;
use axum::response::IntoResponse;
use axum::{Extension, Json};
use serde::Deserialize;
use crate::utils::parse_snowflake::parse_snowflake;

#[derive(Deserialize)]
pub struct GuildJoinRequest {
    discord_guild_id: String,
    name: String,
    icon: Option<String>,
    owner_id: String,
    member_count: i32,
}

pub async fn guild_join(
    State(state): State<AppState>,
    Extension(bot): Extension<Bot>,
    Json(payload): Json<GuildJoinRequest>,
) -> Result<impl IntoResponse, AppError> {
    let GuildJoinRequest {
        discord_guild_id,
        name,
        icon,
        owner_id,
        member_count,
    } = payload;

    let data = CreateGuildJoin {
        bot_id: bot.bot_id,
        discord_guild_id: parse_snowflake(discord_guild_id)?,
        name,
        icon,
        owner_id: parse_snowflake(owner_id)?,
        member_count,
    };

    GuildService::guild_join(&state.pool, data).await
}

#[derive(Deserialize)]
pub struct GuildLeaveRequest {
    guild_id: String,
}

pub async fn guild_leave(
    State(state): State<AppState>,
    Extension(bot): Extension<Bot>,
    Json(payload): Json<GuildLeaveRequest>,
) -> Result<impl IntoResponse, AppError> {
    GuildService::guild_leave(&state.pool, bot.id, parse_snowflake(payload.guild_id)?).await
}
