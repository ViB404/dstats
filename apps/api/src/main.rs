use crate::database::connection::connect_db;
use crate::route::bots::{get_bot_info, register};
use crate::route::guild::{guild_info, guild_join, guild_leave};
use crate::route::middleware::middleware;
use crate::route::status::status;
use axum::Router;
use axum::http::header::CONTENT_TYPE;
use axum::http::{HeaderName, HeaderValue, Method};
use axum::middleware::from_fn_with_state;
use axum::routing::{get, post};
use log::info;
use sqlx::PgPool;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

pub mod database;
mod error;
pub mod http;
pub mod models;
pub mod repositories;
pub mod route;
pub mod services;
pub mod utils;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .or_else(|_| EnvFilter::try_new("axum_tracing_example=info,tower_http=info"))?,
        )
        .init();

    let pool = connect_db().await?;
    let app_state = AppState { pool };

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>()?)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([CONTENT_TYPE, HeaderName::from_static("x-api-key")]);

    let private_route = Router::new()
        .route("/v1/guild/join", post(guild_join))
        .route("/v1/guild/leave", post(guild_leave))
        .route("/v1/bot", get(get_bot_info))
        .route("/v1/guilds", get(guild_info))
        .route_layer(from_fn_with_state(app_state.clone(), middleware));

    let public_route = Router::new()
        .route("/", get(status))
        .route("/v1/register", post(register));

    let app = Router::new()
        .merge(public_route)
        .merge(private_route)
        .layer(TraceLayer::new_for_http())
        .with_state(app_state)
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 7878));

    info!("Starting server on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;

    axum::serve(listener, app).await?;

    Ok(())
}
