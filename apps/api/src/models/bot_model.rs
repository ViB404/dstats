use chrono::{DateTime, Utc};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct Bot {
    pub id: Uuid,
    pub api_key: String,
    pub bot_id: i64,
    pub bot_name: String,
    pub bot_avatar: Option<String>,
    pub owner_id: Option<i64>,
    pub guild_count: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_seen_at: Option<DateTime<Utc>>,
}