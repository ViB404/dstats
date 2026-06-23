-- Add migration script here
CREATE TYPE event_type AS ENUM (
    'GUILD_JOIN',
    'GUILD_LEAVE',
    'READY',
    'HEARTBEAT'
);

ALTER TABLE events
ALTER COLUMN event_type
TYPE event_type
USING event_type::event_type;