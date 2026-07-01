use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;
use crate::error::{AppError, AppResult};
use crate::models::bot_model::Bot;

pub struct BotRepository;

pub struct CreateBot {
    pub api_key: String,
    pub bot_id: i64,
    pub bot_name: String,
    pub bot_avatar: Option<String>,
    pub owner_id: Option<i64>,
}

impl BotRepository {
    pub async fn create(pool: &PgPool, data: CreateBot) -> AppResult<Bot> {
        sqlx::query_as::<_, Bot>(
            r#"INSERT INTO bots (api_key, bot_id, bot_name, bot_avatar, owner_id)
               VALUES ($1, $2, $3, $4, $5)
               RETURNING *"#
        )
            .bind(data.api_key)
            .bind(data.bot_id)
            .bind(data.bot_name)
            .bind(data.bot_avatar)
            .bind(data.owner_id)
            .fetch_one(pool)
            .await
            .map_err(AppError::from)
    }

    pub async fn find_by_id(
        pool: &PgPool,
        id: Uuid,
    ) -> AppResult<Option<Bot>> {
        sqlx::query_as::<_, Bot>(
            r#"
            SELECT *
            FROM bots
            WHERE id = $1
            "#,
        )
            .bind(id)
            .fetch_optional(pool)
            .await
            .map_err(AppError::from)
    }

    pub async fn find_by_bot_id(
        pool: &PgPool,
        bot_id: i64,
    ) -> Result<Option<Bot>, sqlx::Error> {
        sqlx::query_as::<_, Bot>(
            r#"
            SELECT *
            FROM bots
            WHERE bot_id = $1
            "#,
        )
            .bind(bot_id)
            .fetch_optional(pool)
            .await
    }

    pub async fn find_by_api_key(
        pool: &PgPool,
        api_key: &str,
    ) -> Result<Option<Bot>, sqlx::Error> {
        sqlx::query_as::<_, Bot>(
            r#"
            SELECT *
            FROM bots
            WHERE api_key = $1
            "#,
        )
            .bind(api_key)
            .fetch_optional(pool)
            .await
    }

    pub async fn update_last_seen(
        pool: &PgPool,
        id: Uuid,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE bots
            SET
                last_seen_at = $1,
                updated_at = $2
            WHERE id = $3
            "#,
        )
            .bind(Utc::now())
            .bind(Utc::now())
            .bind(id)
            .execute(pool)
            .await?;

        Ok(())
    }
}
