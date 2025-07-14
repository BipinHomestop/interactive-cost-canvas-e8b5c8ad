-- Try to update pg_graphql extension step by step
-- First, let's check available versions and update paths
SELECT name, default_version, installed_version FROM pg_available_extensions WHERE name = 'pg_graphql';

-- Try updating to the next available version
ALTER EXTENSION pg_graphql UPDATE;