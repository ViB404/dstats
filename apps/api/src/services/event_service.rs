use serde_json::Value;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    error::{AppError, AppResult},
    models::events_model::{Event, EventType},
    repositories::event_repository::EventRepository,
};

pub struct EventService;

impl EventService {
    pub async fn create_event(
        pool: &PgPool,
        bot_id: Uuid,
        guild_id: Option<Uuid>,
        event_type: EventType,
        payload: Option<Value>,
    ) -> AppResult<Event> {
        let event = EventRepository::create(
            pool,
            bot_id,
            guild_id,
            event_type,
            payload,
        )
            .await?;

        Ok(event)
    }

    pub async fn get_bot_events(
        pool: &PgPool,
        bot_id: Uuid,
    ) -> AppResult<Vec<Event>> {
        let events = EventRepository::find_by_bot_id(
            pool,
            bot_id,
        )
            .await?;

        Ok(events)
    }

    pub async fn get_guild_events(
        pool: &PgPool,
        guild_id: Uuid,
    ) -> AppResult<Vec<Event>> {
        let events = EventRepository::find_by_guild_id(
            pool,
            guild_id,
        )
            .await?;

        Ok(events)
    }

    pub async fn get_recent_events(
        pool: &PgPool,
        bot_id: Uuid,
        limit: i64,
        offset: i64,
    ) -> AppResult<Vec<Event>> {
        let events = EventRepository::find_recent_by_bot_id(
            pool,
            bot_id,
            limit,
            offset,
        )
            .await?;

        Ok(events)
    }

    pub async fn get_event_count(
        pool: &PgPool,
        bot_id: Uuid,
    ) -> AppResult<i64> {
        EventRepository::count_by_bot(
            pool,
            bot_id,
        )
            .await
            .map_err(AppError::from)
    }

    pub async fn get_event_type_count(
        pool: &PgPool,
        event_type: EventType,
    ) -> AppResult<i64> {
        EventRepository::count_by_type(
            pool,
            event_type,
        )
            .await
            .map_err(AppError::from)
    }
}