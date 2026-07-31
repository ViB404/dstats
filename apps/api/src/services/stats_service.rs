use serde::Serialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::error::AppResult;
use crate::repositories::stats::get_stats;

pub struct StatsService;

#[derive(Debug, Serialize)]
pub struct StatsResponse {
    pub guilds_joined: i64,
    pub guilds_left: i64,
    pub active_guilds: i64,
}

impl StatsService {
    pub async fn get_stats(pool: &PgPool, bot_id: Uuid) -> AppResult<StatsResponse> {
        let stats = get_stats(pool, bot_id).await?;

        Ok(StatsResponse {
            active_guilds: stats.active_guilds,
            guilds_joined: stats.guilds_joined,
            guilds_left: stats.guilds_left,
        })
    }
}
