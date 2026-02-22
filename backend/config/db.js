const { Pool } = require("pg");

// Connection pool — reuses connections instead of opening a new one per query
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "task_manager",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  max: 20,                  // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection + create tables on startup
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log(`✅ PostgreSQL Connected: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

    // Create tables if they don't exist (schema init)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name        VARCHAR(50)  NOT NULL,
        email       VARCHAR(255) NOT NULL UNIQUE,
        password    VARCHAR(255) NOT NULL,
        created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS projects (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title       VARCHAR(100) NOT NULL,
        description VARCHAR(500) DEFAULT '',
        status      VARCHAR(20)  NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'completed', 'archived')),
        owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title        VARCHAR(150) NOT NULL,
        description  VARCHAR(1000) DEFAULT '',
        status       VARCHAR(20)  NOT NULL DEFAULT 'todo'
                       CHECK (status IN ('todo', 'in-progress', 'review', 'done')),
        priority     VARCHAR(20)  NOT NULL DEFAULT 'medium'
                       CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        due_date     DATE,
        project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        assigned_to  UUID REFERENCES users(id) ON DELETE SET NULL,
        created_by   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_projects_owner    ON projects(owner_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_project     ON tasks(project_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_status      ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_priority    ON tasks(priority);
    `);

    console.log("✅ Database tables ready");
    client.release();
  } catch (error) {
    console.error(`❌ PostgreSQL Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Export pool for use in models (query helper)
module.exports = { pool, connectDB };