-- Add migration script here
CREATE TABLE guilds (
    id UUID PRIMARY KEY,

    discord_guild_id BIGINT UNIQUE NOT NULL,

    name TEXT NOT NULL,

    icon TEXT,

    owner_id BIGINT,

    last_member_count INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);