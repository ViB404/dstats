use crate::error::AppResult;
use axum::http::HeaderValue;
use reqwest::header::{ACCEPT, AUTHORIZATION, HeaderMap};
use serde::Deserialize;
use serde_json::{Value, from_value};
use std::env;

#[derive(Debug, Deserialize)]
pub struct BotInfoResponse {
    pub avatar: Option<String>,
    pub bot: bool,
    pub id: String,
    pub username: String,
}

pub async fn get_bot_info_by_client_id(client_id: i64) -> AppResult<BotInfoResponse> {
    let mut headers = HeaderMap::new();
    let bot_token = env::var("BOT_TOKEN")?;
    let authorization_header_value = format!("Bot {}", bot_token);

    headers.insert(
        AUTHORIZATION,
        HeaderValue::from_str(&authorization_header_value)?,
    );
    headers.insert(ACCEPT, HeaderValue::from_static("application/json"));

    let url = format!("https://discord.com/api/v10/users/{}", client_id);

    let client = reqwest::Client::new();
    let response = client
        .get(url)
        .headers(headers)
        .send()
        .await?
        .json::<Value>()
        .await?;

    Ok(from_value::<BotInfoResponse>(response)?)
}
