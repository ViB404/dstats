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

    pub async fn register(
        pool: &PgPool,
        data: CreateBot,
    ) -> AppResult<Bot> {
        Ok(
            BotRepository::create(pool, data)
                .await?
        )
    }
}