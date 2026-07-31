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
