use chrono::{DateTime, Utc};
use serde_json::Value;
use sqlx::FromRow;
use uuid::Uuid;

use sqlx::Type;

#[derive(Debug, Clone, Copy, Type)]
#[sqlx(type_name = "event_type")]
pub enum EventType {
    #[sqlx(rename = "GUILD_JOIN")]
    GuildJoin,

    #[sqlx(rename = "GUILD_LEAVE")]
    GuildLeave,

    #[sqlx(rename = "READY")]
    Ready,

    #[sqlx(rename = "HEARTBEAT")]
    Heartbeat,
}

#[derive(Debug, FromRow)]
pub struct Event {
    pub id: Uuid,
    pub bot_id: Uuid,
    pub guild_id: Option<Uuid>,
    pub event_type: EventType,
    pub payload: Option<Value>,
    pub created_at: DateTime<Utc>,
}
