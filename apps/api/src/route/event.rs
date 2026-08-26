use axum::{Extension, Json, extract::State, response::IntoResponse};
use serde::Deserialize;
use serde_json::Value;
use uuid::Uuid;

use crate::{
    AppState,
    error::AppError,
    http::response,
    models::{bot_model::Bot, events_model::EventType},
    services::event_service::EventService,
};

#[derive(Debug, Deserialize)]
pub struct CreateEventRequest {
    pub id: Uuid,
    pub event_type: EventType,
    pub payload: Value,
}

pub async fn create_events(
    State(state): State<AppState>,
    Extension(bot): Extension<Bot>,
    Json(payload): Json<Vec<CreateEventRequest>>,
) -> Result<impl IntoResponse, AppError> {
    let events = payload
        .into_iter()
        .map(|event| (event.id, event.event_type, event.payload))
        .collect();

    EventService::create_events(&state.pool, bot.id, events).await?;

    Ok(response::created(()))
}
