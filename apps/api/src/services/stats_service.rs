use serde::Serialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::error::AppResult;
use crate::repositories::stats::{
    NetGrowthPoint, TimeSeriesPoint, get_daily_joins, get_daily_leaves, get_guild_growth,
    get_net_growth, get_stats,
};

pub struct StatsService;

#[derive(Debug, Serialize)]
pub struct StatsResponse {
    pub guilds_joined: i64,
    pub guilds_left: i64,
    pub active_guilds: i64,
}

#[derive(Debug, Serialize)]
pub struct AnalyticsResponse {
    pub overview: StatsResponse,
    pub guild_growth: Vec<TimeSeriesPoint>,
    pub daily_joins: Vec<TimeSeriesPoint>,
    pub daily_leaves: Vec<TimeSeriesPoint>,
    pub net_growth: Vec<NetGrowthPoint>,
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

    pub async fn get_guild_growth(pool: &PgPool, bot_id: Uuid) -> AppResult<Vec<TimeSeriesPoint>> {
        Ok(get_guild_growth(pool, bot_id).await?)
    }

    pub async fn get_daily_joins(pool: &PgPool, bot_id: Uuid) -> AppResult<Vec<TimeSeriesPoint>> {
        Ok(get_daily_joins(pool, bot_id).await?)
    }

    pub async fn get_daily_leaves(pool: &PgPool, bot_id: Uuid) -> AppResult<Vec<TimeSeriesPoint>> {
        Ok(get_daily_leaves(pool, bot_id).await?)
    }

    pub async fn get_net_growth(pool: &PgPool, bot_id: Uuid) -> AppResult<Vec<NetGrowthPoint>> {
        Ok(get_net_growth(pool, bot_id).await?)
    }

    pub async fn get_analytics(pool: &PgPool, bot_id: Uuid) -> AppResult<AnalyticsResponse> {
        let overview = Self::get_stats(pool, bot_id).await?;
        let guild_growth = Self::get_guild_growth(pool, bot_id).await?;
        let daily_joins = Self::get_daily_joins(pool, bot_id).await?;
        let daily_leaves = Self::get_daily_leaves(pool, bot_id).await?;
        let net_growth = Self::get_net_growth(pool, bot_id).await?;

        Ok(AnalyticsResponse {
            overview,
            guild_growth,
            daily_joins,
            daily_leaves,
            net_growth,
        })
    }
}
