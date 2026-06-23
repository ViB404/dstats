-- Add migration script here
CREATE TABLE events (
    id UUID PRIMARY KEY,

    bot_id UUID NOT NULL REFERENCES bots(id) ON DELETE CASCADE,

    guild_id UUID REFERENCES guilds(id) ON DELETE SET NULL,

    event_type TEXT NOT NULL,

    payload JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_bot_id
ON events(bot_id);

CREATE INDEX idx_events_guild_id
ON events(guild_id);

CREATE INDEX idx_events_event_type
ON events(event_type);

CREATE INDEX idx_events_created_at
ON events(created_at);