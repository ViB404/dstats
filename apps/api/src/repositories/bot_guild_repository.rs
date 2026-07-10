use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::bot_guilds_model::BotGuild;

pub struct BotGuildRepository;

impl BotGuildRepository {
    pub async fn create_or_rejoin(
        pool: &PgPool,
        bot_id: Uuid,
        guild_id: Uuid,
    ) -> Result<BotGuild, sqlx::Error> {
        sqlx::query_as::<_, BotGuild>(
            r#"
        INSERT INTO bot_guilds (
            bot_id,
            guild_id,
            joined_at,
            left_at
        )
        VALUES ($1, $2, $3, NULL)
        ON CONFLICT (bot_id, guild_id)
        DO UPDATE
        SET
            joined_at = EXCLUDED.joined_at,
            left_at = NULL
        RETURNING *
        "#,
        )
        .bind(bot_id)
        .bind(guild_id)
        .bind(Utc::now())
        .fetch_one(pool)
        .await
    }

    pub async fn find_by_bot_id(pool: &PgPool, bot_id: Uuid) -> Result<Vec<BotGuild>, sqlx::Error> {
        sqlx::query_as::<_, BotGuild>(
            r#"
            SELECT *
            FROM bot_guilds
            WHERE bot_id = $1
            "#,
        )
        .bind(bot_id)
        .fetch_all(pool)
        .await
    }

    pub async fn get_id_by_bot_id(pool: &PgPool, bot_id: i64) -> Result<Option<Uuid>, sqlx::Error> {
        sqlx::query_scalar(
            r#"
        SELECT id
        FROM bots
        WHERE bot_id = $1
        "#,
        )
        .bind(bot_id)
        .fetch_optional(pool)
        .await
    }

    pub async fn get_id_by_discord_guild_id(
        pool: &PgPool,
        discord_guild_id: i64,
    ) -> Result<Option<Uuid>, sqlx::Error> {
        sqlx::query_scalar(
            r#"
        SELECT id
        FROM guilds
        WHERE discord_guild_id = $1
        "#,
        )
        .bind(discord_guild_id)
        .fetch_optional(pool)
        .await
    }

    pub async fn find_link(
        pool: &PgPool,
        bot_id: Uuid,
        guild_id: Uuid,
    ) -> Result<Option<BotGuild>, sqlx::Error> {
        sqlx::query_as::<_, BotGuild>(
            r#"
            SELECT *
            FROM bot_guilds
            WHERE bot_id = $1
              AND guild_id = $2
            "#,
        )
        .bind(bot_id)
        .bind(guild_id)
        .fetch_optional(pool)
        .await
    }

    pub async fn mark_left(pool: &PgPool, bot_id: Uuid, guild_id: Uuid) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE bot_guilds
            SET left_at = $1
            WHERE bot_id = $2
              AND guild_id = $3
            "#,
        )
        .bind(Utc::now())
        .bind(bot_id)
        .bind(guild_id)
        .execute(pool)
        .await?;

        Ok(())
    }
}
