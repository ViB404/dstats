-- Add migration script here
CREATE TABLE bots (
    id UUID PRIMARY KEY,

    api_key TEXT UNIQUE NOT NULL,

    bot_id BIGINT UNIQUE NOT NULL,

    bot_name TEXT NOT NULL,

    bot_avatar TEXT,

    owner_id BIGINT,

    guild_count INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    last_seen_at TIMESTAMPTZ
);