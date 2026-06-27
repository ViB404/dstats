use sqlx::postgres::PgPoolOptions;
use anyhow::Result;
use sqlx::PgPool;

pub async fn connect_db() -> Result<PgPool> {
    dotenv::dotenv().ok();
    let database_url = dotenv::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = PgPoolOptions::new().connect(&database_url).await?;

    Ok(pool)
}