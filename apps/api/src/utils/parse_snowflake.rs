use crate::error::AppError;

pub fn parse_snowflake(value: String) -> Result<i64, AppError> {
    value.parse::<i64>().map_err(|_| AppError::InvalidPayload)
}
