use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::guilds_model::Guild;

pub struct GuildRepository;

impl GuildRepository {
    pub async fn create(
        pool: &PgPool,
        discord_guild_id: i64,
        name: String,
        icon: Option<String>,
        owner_id: i64,
        member_count: i32,
    ) -> Result<Guild, sqlx::Error> {
        let guild = sqlx::query_as::<_, Guild>(
            r#"
            INSERT INTO guilds (
                discord_guild_id,
                name,
                icon,
                owner_id,
                last_member_count
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            "#,
        )
            .bind(discord_guild_id)
            .bind(name)
            .bind(icon)
            .bind(owner_id)
            .bind(member_count)
            .fetch_one(pool)
            .await?;

        Ok(guild)
    }

    pub async fn find_by_id(
        pool: &PgPool,
        id: Uuid,
    ) -> Result<Option<Guild>, sqlx::Error> {
        sqlx::query_as::<_, Guild>(
            r#"
            SELECT *
            FROM guilds
            WHERE id = $1
            "#,
        )
            .bind(id)
            .fetch_optional(pool)
            .await
    }

    pub async fn find_by_discord_guild_id(
        pool: &PgPool,
        discord_guild_id: i64,
    ) -> Result<Option<Guild>, sqlx::Error> {
        sqlx::query_as::<_, Guild>(
            r#"
            SELECT *
            FROM guilds
            WHERE discord_guild_id = $1
            "#,
        )
            .bind(discord_guild_id)
            .fetch_optional(pool)
            .await
    }

    pub async fn update_member_count(
        pool: &PgPool,
        guild_id: Uuid,
        member_count: i32,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE guilds
            SET
                last_member_count = $1,
                updated_at = $2
            WHERE id = $3
            "#,
        )
            .bind(member_count)
            .bind(Utc::now())
            .bind(guild_id)
            .execute(pool)
            .await?;

        Ok(())
    }
}