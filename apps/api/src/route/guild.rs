use crate::AppState;
use crate::error::AppError;
use crate::http::response;
use crate::models::bot_model::Bot;
use crate::services::guild_service::{CreateGuildJoin, GuildService};
use crate::utils::parse_snowflake::parse_snowflake;
use axum::extract::{Query, State};
use axum::response::IntoResponse;
use axum::{Extension, Json};
use serde::{Deserialize, Serialize};

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

#[derive(Deserialize, Serialize)]
pub struct Pagination {
    page: i64,
    per_page: i64,
}

pub async fn guild_info(
    State(state): State<AppState>,
    Extension(bot): Extension<Bot>,
    Query(pagination): Query<Pagination>,
) -> Result<impl IntoResponse, AppError> {
    let page = pagination.page.max(1);
    let per_page = pagination.per_page.clamp(1, 100);

    let data = GuildService::guild_info(&state.pool, bot.id, page, per_page).await?;

    println!("{}", bot.id);

    Ok(response::ok(data))
}
