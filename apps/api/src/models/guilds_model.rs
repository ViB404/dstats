use chrono::{DateTime, Utc};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct Guild {
    pub id: Uuid,
    pub discord_guild_id: i64,
    pub name: String,
    pub icon: Option<String>,
    pub owner_id: Option<i64>,
    pub last_member_count: Option<i32>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>
}