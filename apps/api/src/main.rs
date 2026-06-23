use crate::database::connection::connect_db;

pub mod models;
pub mod services;
pub mod database;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let pool = connect_db().await?;

    Ok(())
}
