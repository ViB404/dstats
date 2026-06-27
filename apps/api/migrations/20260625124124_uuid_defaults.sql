-- Add migration script here
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE bots
    ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE guilds
    ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE bot_guilds
    ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE events
    ALTER COLUMN id SET DEFAULT gen_random_uuid();