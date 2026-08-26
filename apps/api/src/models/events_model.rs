use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::{FromRow, Type};
use uuid::Uuid;

#[derive(Debug, Clone, Copy, Type, Serialize, Deserialize)]
#[sqlx(type_name = "event_type")]
pub enum EventType {
    #[sqlx(rename = "COMMAND_USE")]
    #[serde(rename = "command_use")]
    CommandUse,
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Event {
    pub id: Uuid,
    pub bot_id: Uuid,
    pub event_type: EventType,
    pub payload: Value,
    pub created_at: DateTime<Utc>,
}
