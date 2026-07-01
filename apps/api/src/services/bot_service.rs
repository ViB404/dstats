use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    error::{AppError, AppResult},
    repositories::bot_repository::BotRepository,
    models::bot_model::Bot,
};
use crate::repositories::bot_repository::CreateBot;

pub struct BotService;

impl BotService {
    pub async fn authenticate_bot(
        pool: &PgPool,
        api_key: &str,
    ) -> AppResult<Bot> {
        let bot = BotRepository::find_by_api_key(pool, api_key)
            .await?
            .ok_or(AppError::InvalidApiKey)?;

        Ok(bot)
    }

    pub async fn heartbeat(
        pool: &sqlx::PgPool,
        id: Uuid,
    ) -> AppResult<()> {
        BotRepository::update_last_seen(pool, id).await?;

        Ok(())
    }

    pub async fn register_bot(pool: &PgPool, data: CreateBot) -> AppResult<Bot> {
        if BotRepository::find_by_bot_id(pool, data.bot_id).await?.is_some() {
            return Err(AppError::BotAlreadyExists);
        }

        BotRepository::create(pool, data).await
    }
}