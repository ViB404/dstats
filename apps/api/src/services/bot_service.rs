use sqlx::PgPool;
use uuid::Uuid;

use crate::repositories::bot_repository::CreateBot;
use crate::utils::bot::get_bot_info_by_client_id;
use crate::utils::parse_snowflake::parse_snowflake;
use crate::{
    error::{AppError, AppResult},
    models::bot_model::Bot,
    repositories::bot_repository::BotRepository,
};

pub struct BotService;

pub struct RegisterBot {
    pub client_id: String,
    pub owner_id: Option<String>,
}

impl BotService {
    pub async fn authenticate_bot(pool: &PgPool, api_key: &str) -> AppResult<Bot> {
        let bot = BotRepository::find_by_api_key(pool, api_key)
            .await?
            .ok_or(AppError::InvalidApiKey)?;

        Ok(bot)
    }

    pub async fn heartbeat(pool: &sqlx::PgPool, id: Uuid) -> AppResult<()> {
        BotRepository::update_last_seen(pool, id).await?;

        Ok(())
    }

    pub async fn register_bot(pool: &PgPool, data: RegisterBot) -> AppResult<Uuid> {
        let bot_info = get_bot_info_by_client_id(data.client_id.parse().unwrap()).await?;

        if BotRepository::find_by_bot_id(pool, bot_info.id.parse().unwrap())
            .await?
            .is_some()
        {
            return Err(AppError::BotAlreadyExists);
        }

        let bot_avatar: Option<String> = bot_info.avatar.as_ref().map(|hash| {
            let ext = if hash.starts_with("a_") { "gif" } else { "png" };
            format!(
                "https://cdn.discordapp.com/avatars/{}/{}.{}",
                bot_info.id, hash, ext
            )
        });

        let api_key = Uuid::new_v4();
        let owner_id: i64 = match data.owner_id {
            Some(id) => parse_snowflake(id)?,
            None => 0,
        };
        let create_bot_info = CreateBot {
            api_key: api_key.to_string(),
            bot_id: bot_info.id.parse().unwrap(),
            bot_name: bot_info.username,
            owner_id: Some(owner_id),
            bot_avatar,
        };

        BotRepository::create(pool, create_bot_info)
            .await
            .expect("Can't Create the Bot");

        Ok(api_key)
    }
}
