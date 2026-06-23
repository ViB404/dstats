-- Add migration script here
CREATE TABLE bot_guilds (
    id UUID PRIMARY KEY,

    bot_id UUID NOT NULL REFERENCES bots(id) ON DELETE CASCADE,

    guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,

    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    left_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(bot_id, guild_id)
);

CREATE INDEX idx_bot_guilds_bot_id
ON bot_guilds(bot_id);

CREATE INDEX idx_bot_guilds_guild_id
ON bot_guilds(guild_id);