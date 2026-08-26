use crate::models::command_usage_model::CommandUsage;
use serde::Deserialize;
use sqlx::PgPool;
use std::collections::HashMap;
use uuid::Uuid;

pub struct CommandUsageRepository;

pub struct CreateCommandUsage {
    pub bot_id: Uuid,
    pub guild_id: Uuid,
    pub command_name: String,
    pub usage_count: i64,
}

#[derive(Debug, Deserialize)]
pub struct CommandUsePayload {
    pub guild_id: String,
    pub commands: HashMap<String, i64>,
}

impl CommandUsageRepository {
    pub async fn upsert(
        pool: &PgPool,
        data: CreateCommandUsage,
    ) -> Result<CommandUsage, sqlx::Error> {
        sqlx::query_as::<_, CommandUsage>(
            r#"
            INSERT INTO command_usage (
                bot_id,
                guild_id,
                command_name,
                usage_count
            )
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (bot_id, guild_id, command_name)
            DO UPDATE SET
                usage_count = command_usage.usage_count + EXCLUDED.usage_count,
                updated_at = NOW()
            RETURNING *
            "#,
        )
        .bind(data.bot_id)
        .bind(data.guild_id)
        .bind(data.command_name)
        .bind(data.usage_count)
        .fetch_one(pool)
        .await
    }

    pub async fn upsert_bulk(
        pool: &PgPool,
        data: Vec<CreateCommandUsage>,
    ) -> Result<Vec<CommandUsage>, sqlx::Error> {
        if data.is_empty() {
            return Ok(Vec::new());
        }

        let mut tx = pool.begin().await?;
        let mut results = Vec::with_capacity(data.len());

        for item in data {
            let usage = sqlx::query_as::<_, CommandUsage>(
                r#"
                INSERT INTO command_usage (
                    bot_id,
                    guild_id,
                    command_name,
                    usage_count
                )
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (bot_id, guild_id, command_name)
                DO UPDATE SET
                    usage_count = command_usage.usage_count + EXCLUDED.usage_count,
                    updated_at = NOW()
                RETURNING *
                "#,
            )
            .bind(item.bot_id)
            .bind(item.guild_id)
            .bind(item.command_name)
            .bind(item.usage_count)
            .fetch_one(&mut *tx)
            .await?;

            results.push(usage);
        }

        tx.commit().await?;

        Ok(results)
    }

    pub async fn find_by_bot_id(
        pool: &PgPool,
        bot_id: i64,
    ) -> Result<Vec<CommandUsage>, sqlx::Error> {
        sqlx::query_as::<_, CommandUsage>(
            r#"
            SELECT *
            FROM command_usage
            WHERE bot_id = $1
            ORDER BY usage_count DESC
            "#,
        )
        .bind(bot_id)
        .fetch_all(pool)
        .await
    }

    pub async fn find_by_guild_id(
        pool: &PgPool,
        guild_id: i64,
    ) -> Result<Vec<CommandUsage>, sqlx::Error> {
        sqlx::query_as::<_, CommandUsage>(
            r#"
            SELECT *
            FROM command_usage
            WHERE guild_id = $1
            ORDER BY usage_count DESC
            "#,
        )
        .bind(guild_id)
        .fetch_all(pool)
        .await
    }

    pub async fn find_by_command(
        pool: &PgPool,
        bot_id: i64,
        guild_id: i64,
        command_name: &str,
    ) -> Result<Option<CommandUsage>, sqlx::Error> {
        sqlx::query_as::<_, CommandUsage>(
            r#"
            SELECT *
            FROM command_usage
            WHERE bot_id = $1
              AND guild_id = $2
              AND command_name = $3
            "#,
        )
        .bind(bot_id)
        .bind(guild_id)
        .bind(command_name)
        .fetch_optional(pool)
        .await
    }
}
