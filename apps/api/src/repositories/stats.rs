use chrono::NaiveDate;
use serde::Serialize;
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct BotStats {
    pub active_guilds: i64,
    pub guilds_joined: i64,
    pub guilds_left: i64,
}

pub async fn get_stats(pool: &PgPool, bot_id: Uuid) -> Result<BotStats, sqlx::Error> {
    sqlx::query_as::<_, BotStats>(
        r#"
        SELECT
            COUNT(*) FILTER (WHERE left_at IS NULL)::BIGINT AS active_guilds,
            COUNT(*)::BIGINT AS guilds_joined,
            COUNT(*) FILTER (WHERE left_at IS NOT NULL)::BIGINT AS guilds_left
        FROM bot_guilds
        WHERE bot_id = $1
        "#,
    )
    .bind(bot_id)
    .fetch_one(pool)
    .await
}

#[derive(Debug, FromRow, Serialize)]
pub struct TimeSeriesPoint {
    pub date: NaiveDate,
    pub value: i64,
}

#[derive(Debug, FromRow, Serialize)]
pub struct NetGrowthPoint {
    pub date: NaiveDate,
    pub joined: i64,
    pub left: i64,
    pub net: i64,
}

pub async fn get_daily_joins(
    pool: &PgPool,
    bot_id: Uuid,
) -> Result<Vec<TimeSeriesPoint>, sqlx::Error> {
    sqlx::query_as::<_, TimeSeriesPoint>(
        r#"
        WITH days AS (
            SELECT generate_series(
                CURRENT_DATE - INTERVAL '29 days',
                CURRENT_DATE,
                INTERVAL '1 day'
            )::date AS date
        )
        SELECT
            days.date,
            COALESCE(COUNT(bg.*), 0)::BIGINT AS value
        FROM days
        LEFT JOIN bot_guilds bg
            ON DATE(bg.joined_at) = days.date
            AND bg.bot_id = $1
        GROUP BY days.date
        ORDER BY days.date;
        "#,
    )
    .bind(bot_id)
    .fetch_all(pool)
    .await
}

pub async fn get_daily_leaves(
    pool: &PgPool,
    bot_id: Uuid,
) -> Result<Vec<TimeSeriesPoint>, sqlx::Error> {
    sqlx::query_as::<_, TimeSeriesPoint>(
        r#"
        WITH days AS (
            SELECT generate_series(
                CURRENT_DATE - INTERVAL '29 days',
                CURRENT_DATE,
                INTERVAL '1 day'
            )::date AS date
        )
        SELECT
            days.date,
            COALESCE(COUNT(bg.*), 0)::BIGINT AS value
        FROM days
        LEFT JOIN bot_guilds bg
            ON bg.left_at IS NOT NULL
            AND DATE(bg.left_at) = days.date
            AND bg.bot_id = $1
        GROUP BY days.date
        ORDER BY days.date;
        "#,
    )
    .bind(bot_id)
    .fetch_all(pool)
    .await
}

pub async fn get_net_growth(
    pool: &PgPool,
    bot_id: Uuid,
) -> Result<Vec<NetGrowthPoint>, sqlx::Error> {
    sqlx::query_as::<_, NetGrowthPoint>(
        r#"
        WITH days AS (
            SELECT generate_series(
                CURRENT_DATE - INTERVAL '29 days',
                CURRENT_DATE,
                INTERVAL '1 day'
            )::date AS date
        ),
        joins AS (
            SELECT
                DATE(joined_at) AS date,
                COUNT(*)::BIGINT AS joined
            FROM bot_guilds
            WHERE bot_id = $1
            GROUP BY DATE(joined_at)
        ),
        leaves AS (
            SELECT
                DATE(left_at) AS date,
                COUNT(*)::BIGINT AS left
            FROM bot_guilds
            WHERE bot_id = $1
              AND left_at IS NOT NULL
            GROUP BY DATE(left_at)
        )
        SELECT
            days.date,
            COALESCE(joins.joined, 0) AS joined,
            COALESCE(leaves.left, 0) AS left,
            COALESCE(joins.joined, 0) - COALESCE(leaves.left, 0) AS net
        FROM days
        LEFT JOIN joins ON joins.date = days.date
        LEFT JOIN leaves ON leaves.date = days.date
        ORDER BY days.date;
        "#,
    )
    .bind(bot_id)
    .fetch_all(pool)
    .await
}

pub async fn get_guild_growth(
    pool: &PgPool,
    bot_id: Uuid,
) -> Result<Vec<TimeSeriesPoint>, sqlx::Error> {
    sqlx::query_as::<_, TimeSeriesPoint>(
        r#"
        WITH days AS (
            SELECT generate_series(
                CURRENT_DATE - INTERVAL '29 days',
                CURRENT_DATE,
                INTERVAL '1 day'
            )::date AS date
        )
        SELECT
            days.date,
            COUNT(bg.*)::BIGINT AS value
        FROM days
        LEFT JOIN bot_guilds bg
            ON bg.bot_id = $1
            AND bg.joined_at::date <= days.date
            AND (
                bg.left_at IS NULL
                OR bg.left_at::date > days.date
            )
        GROUP BY days.date
        ORDER BY days.date;
        "#,
    )
    .bind(bot_id)
    .fetch_all(pool)
    .await
}
