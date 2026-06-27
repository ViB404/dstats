use sqlx::PgPool;
use uuid::Uuid;
use serde_json::Value;

use crate::models::events_model::{Event, EventType};

pub struct EventRepository;

impl EventRepository {
    pub async fn create(
        pool: &PgPool,
        bot_id: Uuid,
        guild_id: Option<Uuid>,
        event_type: EventType,
        payload: Option<Value>,
    ) -> Result<Event, sqlx::Error> {
        sqlx::query_as::<_, Event>(
            r#"
            INSERT INTO events (
                bot_id,
                guild_id,
                event_type,
                payload
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            "#,
        )
            .bind(bot_id)
            .bind(guild_id)
            .bind(event_type)
            .bind(payload)
            .fetch_one(pool)
            .await
    }

    pub async fn find_by_bot_id(
        pool: &PgPool,
        bot_id: Uuid,
    ) -> Result<Vec<Event>, sqlx::Error> {
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

    pub async fn find_by_guild_id(
        pool: &PgPool,
        guild_id: Uuid,
    ) -> Result<Vec<Event>, sqlx::Error> {
        sqlx::query_as::<_, Event>(
            r#"
            SELECT *
            FROM events
            WHERE guild_id = $1
            ORDER BY created_at DESC
            "#,
        )
            .bind(guild_id)
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

    pub async fn count_by_bot(
        pool: &PgPool,
        bot_id: Uuid,
    ) -> Result<i64, sqlx::Error> {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*)
            FROM events
            WHERE bot_id = $1
            "#,
        )
            .bind(bot_id)
            .fetch_one(pool)
            .await?;

        Ok(count)
    }

    pub async fn count_by_type(
        pool: &PgPool,
        event_type: EventType,
    ) -> Result<i64, sqlx::Error> {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*)
            FROM events
            WHERE event_type = $1
            "#,
        )
            .bind(event_type)
            .fetch_one(pool)
            .await?;

        Ok(count)
    }
}