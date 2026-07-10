use chrono::{DateTime, Utc};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct BotGuild {
    pub id: Uuid,
    pub bot_id: Uuid,
    pub guild_id: Uuid,
    pub joined_at: DateTime<Utc>,
    pub left_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}
