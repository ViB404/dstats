use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    error::{AppError, AppResult},
    repositories::{
        bot_guild_repository::BotGuildRepository,
        guild_repository::GuildRepository,
    },
};

pub struct GuildService;

#[derive(Deserialize)]
pub struct CreateGuildJoin {
    pub bot_id: i64,
    pub discord_guild_id: i64,
    pub name: String,
    pub icon: Option<String>,
    pub owner_id: i64,
    pub member_count: i32,
}

impl GuildService {
    pub async fn guild_join(
        pool: &PgPool,
        data: CreateGuildJoin
    ) -> AppResult<()> {
        let guild = match GuildRepository::find_by_discord_guild_id(
            pool,
            data.discord_guild_id,
        )
            .await?
        {
            Some(guild) => guild,
            None => {
                GuildRepository::create(
                    pool,
                    data.discord_guild_id,
                    data.name,
                    data.icon,
                    data.owner_id,
                    data.member_count,
                )
                    .await?
            }
        };

        let bot_uuid = BotGuildRepository::get_id_by_bot_id(pool, data.bot_id)
            .await?
            .ok_or(AppError::BotNotFound)?;

        let guild_uuid = BotGuildRepository::get_id_by_discord_guild_id(pool, data.discord_guild_id)
            .await?
            .ok_or(AppError::GuildNotFound)?;

        BotGuildRepository::create_or_rejoin(
            pool,
            bot_uuid,
            guild_uuid,
        ).await?;

        let existing = BotGuildRepository::find_link(
            pool,
            bot_uuid,
            guild.id,
        )
            .await?;

        if existing.is_some() {
            return Err(AppError::GuildAlreadyJoined);
        }

        BotGuildRepository::create_or_rejoin(
            pool,
            bot_uuid,
            guild.id,
        )
            .await?;

        Ok(())
    }

    pub async fn guild_leave(
        pool: &PgPool,
        bot_id: Uuid,
        discord_guild_id: i64,
    ) -> AppResult<()> {
        let guild = GuildRepository::find_by_discord_guild_id(
            pool,
            discord_guild_id,
        )
            .await?
            .ok_or(AppError::GuildNotFound)?;

        let link = BotGuildRepository::find_link(
            pool,
            bot_id,
            guild.id,
        )
            .await?;

        if link.is_none() {
            return Err(AppError::BotGuildLinkNotFound);
        }

        BotGuildRepository::mark_left(
            pool,
            bot_id,
            guild.id,
        )
            .await?;

        Ok(())
    }
}