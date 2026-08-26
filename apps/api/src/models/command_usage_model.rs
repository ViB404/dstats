use chrono::{DateTime, Utc};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow, Clone)]
pub struct CommandUsage {
    pub id: Uuid,
    pub bot_id: Uuid,
    pub guild_id: Uuid,
    pub command_name: String,
    pub usage_count: i64,
    pub updated_at: DateTime<Utc>,
}
