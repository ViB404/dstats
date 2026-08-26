use serde_json::Value;
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::events_model::{Event, EventType};

pub struct EventRepository;

impl EventRepository {
    pub async fn create(
        pool: &PgPool,
        bot_id: Uuid,
        event_type: EventType,
        payload: Value,
    ) -> Result<Event, sqlx::Error> {
        sqlx::query_as::<_, Event>(
            r#"
            INSERT INTO events (
                bot_id,
                event_type,
                payload
            )
            VALUES ($1, $2, $3)
            RETURNING *
            "#,
        )
        .bind(bot_id)
        .bind(event_type)
        .bind(payload)
        .fetch_one(pool)
        .await
    }

    pub async fn create_bulk(
        pool: &PgPool,
        bot_id: i64,
        events: Vec<(Uuid, EventType, Value)>,
    ) -> Result<Vec<Event>, sqlx::Error> {
        if events.is_empty() {
            return Ok(Vec::new());
        }

        let mut tx = pool.begin().await?;
        let mut created_events = Vec::with_capacity(events.len());

        for (id, event_type, payload) in events {
            let event = sqlx::query_as::<_, Event>(
                r#"
            INSERT INTO events (
                id,
                bot_id,
                event_type,
                payload
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            "#,
            )
            .bind(id)
            .bind(bot_id)
            .bind(event_type)
            .bind(payload)
            .fetch_one(&mut *tx)
            .await?;

            created_events.push(event);
        }

        tx.commit().await?;

        Ok(created_events)
    }

    pub async fn find_by_bot_id(pool: &PgPool, bot_id: Uuid) -> Result<Vec<Event>, sqlx::Error> {
        sqlx::query_as::<_, Event>(
            r#"
            SELECT *
            FROM events
            WHERE bot_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(bot_id)
        .fetch_all(pool)
        .await
    }

    pub async fn find_recent_by_bot_id(
        pool: &PgPool,
        bot_id: Uuid,
        limit: i64,
        offset: i64,
    ) -> Result<Vec<Event>, sqlx::Error> {
        sqlx::query_as::<_, Event>(
            r#"
            SELECT *
            FROM events
            WHERE bot_id = $1
            ORDER BY created_at DESC
            LIMIT $2
            OFFSET $3
            "#,
        )
        .bind(bot_id)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await
    }

    pub async fn count_by_bot(pool: &PgPool, bot_id: Uuid) -> Result<i64, sqlx::Error> {
        sqlx::query_scalar(
            r#"
            SELECT COUNT(*)
            FROM events
            WHERE bot_id = $1
            "#,
        )
        .bind(bot_id)
        .fetch_one(pool)
        .await
    }

    pub async fn count_by_type(pool: &PgPool, event_type: EventType) -> Result<i64, sqlx::Error> {
        sqlx::query_scalar(
            r#"
            SELECT COUNT(*)
            FROM events
            WHERE event_type = $1
            "#,
        )
        .bind(event_type)
        .fetch_one(pool)
        .await
    }
}
