use serde_json::Value;
use sqlx::PgPool;
use uuid::Uuid;

use crate::repositories::command_usage_repository::{
    CommandUsageRepository, CommandUsePayload, CreateCommandUsage,
};
use crate::repositories::guild_repository::GuildRepository;
use crate::utils::parse_snowflake::parse_snowflake;
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
        event_type: EventType,
        payload: Value,
    ) -> AppResult<Event> {
        EventRepository::create(pool, bot_id, event_type, payload)
            .await
            .map_err(AppError::from)
    }

    pub async fn create_events(
        pool: &PgPool,
        bot_id: Uuid,
        events: Vec<(Uuid, EventType, Value)>,
    ) -> AppResult<()> {
        for (_event_id, event_type, payload) in events {
            match event_type {
                EventType::CommandUse => {
                    let command_use: CommandUsePayload =
                        serde_json::from_value(payload).map_err(|_| AppError::InvalidPayload)?;

                    let discord_guild_id = parse_snowflake(command_use.guild_id)?;

                    let guild = GuildRepository::find_by_discord_guild_id(pool, discord_guild_id)
                        .await?
                        .ok_or(AppError::GuildNotFound)?;

                    let usage = command_use
                        .commands
                        .into_iter()
                        .map(|(command_name, usage_count)| CreateCommandUsage {
                            bot_id,
                            guild_id: guild.id,
                            command_name,
                            usage_count,
                        })
                        .collect();

                    CommandUsageRepository::upsert_bulk(pool, usage)
                        .await
                        .map_err(AppError::from)?;
                }
            }
        }

        Ok(())
    }

    pub async fn get_bot_events(pool: &PgPool, bot_id: Uuid) -> AppResult<Vec<Event>> {
        EventRepository::find_by_bot_id(pool, bot_id)
            .await
            .map_err(AppError::from)
    }

    pub async fn get_recent_events(
        pool: &PgPool,
        bot_id: Uuid,
        limit: i64,
        offset: i64,
    ) -> AppResult<Vec<Event>> {
        EventRepository::find_recent_by_bot_id(pool, bot_id, limit, offset)
            .await
            .map_err(AppError::from)
    }

    pub async fn get_event_count(pool: &PgPool, bot_id: Uuid) -> AppResult<i64> {
        EventRepository::count_by_bot(pool, bot_id)
            .await
            .map_err(AppError::from)
    }

    pub async fn get_event_type_count(pool: &PgPool, event_type: EventType) -> AppResult<i64> {
        EventRepository::count_by_type(pool, event_type)
            .await
            .map_err(AppError::from)
    }
}
