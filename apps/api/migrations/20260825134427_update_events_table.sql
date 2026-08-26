-- Add migration script here
DROP TABLE events;

DROP TYPE event_type;

CREATE TYPE event_type AS ENUM (
    'COMMAND_USE'
);

CREATE TABLE events (
    id UUID PRIMARY KEY,

    bot_id UUID NOT NULL REFERENCES bots(id) ON DELETE CASCADE,

    event_type event_type NOT NULL,

    payload JSONB NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_bot_created_at
ON events(bot_id, created_at DESC);

CREATE INDEX idx_events_event_type
ON events(event_type);

CREATE INDEX idx_events_created_at
ON events(created_at);