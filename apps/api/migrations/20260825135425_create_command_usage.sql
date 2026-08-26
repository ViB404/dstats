-- Add migration script here
CREATE TABLE command_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    bot_id UUID NOT NULL REFERENCES bots(id) ON DELETE CASCADE,

    guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,

    command_name TEXT NOT NULL,

    usage_count BIGINT NOT NULL DEFAULT 0,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (bot_id, guild_id, command_name)
);

CREATE INDEX idx_command_usage_bot
ON command_usage(bot_id);

CREATE INDEX idx_command_usage_guild
ON command_usage(guild_id);

CREATE INDEX idx_command_usage_bot_guild
ON command_usage(bot_id, guild_id);