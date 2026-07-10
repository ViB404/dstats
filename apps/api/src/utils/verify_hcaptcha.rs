use reqwest::Client;
use serde::Deserialize;

use crate::error::AppResult;

#[derive(Deserialize)]
struct CaptchaResponse {
    success: bool,
    #[serde(rename = "error-codes")]
    error_codes: Option<Vec<String>>,
}

pub async fn verify_token(token: &str) -> AppResult<(bool, Vec<String>)> {
    let form = [
        ("secret", std::env::var("HCAPTCHA_SECRET")?),
        ("response", token.to_string()),
        ("sitekey", std::env::var("HCAPTCHA_SITE_KEY")?),
    ];

    let client = Client::new();

    let response: CaptchaResponse = client
        .post("https://api.hcaptcha.com/siteverify")
        .form(&form)
        .send()
        .await?
        .json()
        .await?;

    Ok((response.success, response.error_codes.unwrap_or_default()))
}
