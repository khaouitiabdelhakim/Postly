-- Initialize the database for Postly application
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add any initial database setup here
-- For example, creating additional users, setting up schemas, etc.

-- Note: Your SQLAlchemy models will handle table creation
-- This file is just for any additional database initialization
