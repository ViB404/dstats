use crate::database::connection::connect_db;
use crate::route::bots::register;
use crate::route::guild::{guild_join, guild_leave};
use crate::route::middleware::middleware;
use crate::route::status::status;
use axum::Router;
use axum::middleware::from_fn_with_state;
use axum::routing::{get, post};
use log::info;
use sqlx::PgPool;
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

pub mod database;
mod error;
pub mod http;
pub mod models;
pub mod repositories;
pub mod route;
pub mod services;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .or_else(|_| EnvFilter::try_new("axum_tracing_example=info,tower_http=debug"))?,
        )
        .init();

    let pool = connect_db().await?;
    let app_state = AppState { pool };

    let private_route = Router::new()
        .route("/v1/guild/join", post(guild_join))
        .route("/v1/guild/leave", post(guild_leave))
        .route_layer(from_fn_with_state(app_state.clone(), middleware));

    let public_route = Router::new()
        .route("/", get(status))
        .route("/v1/register", post(register));

    let app = Router::new()
        .merge(public_route)
        .merge(private_route)
        .layer(TraceLayer::new_for_http())
        .with_state(app_state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 7878));

    info!("Starting server on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;

    axum::serve(listener, app).await?;

    Ok(())
}
