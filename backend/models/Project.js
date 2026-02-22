const { pool } = require("../config/db");

const Project = {
  // Get all projects for a user + task counts via LEFT JOIN
  findAllByOwner: async (ownerId) => {
    const { rows } = await pool.query(
      `SELECT
         p.*,
         COUNT(t.id)                                          AS total_tasks,
         COUNT(t.id) FILTER (WHERE t.status = 'done')        AS done_tasks
       FROM projects p
       LEFT JOIN tasks t ON t.project_id = p.id
       WHERE p.owner_id = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [ownerId]
    );
    return rows;
  },

  // Get a single project — only if it belongs to the given owner
  findByIdAndOwner: async (id, ownerId) => {
    const { rows } = await pool.query(
      "SELECT * FROM projects WHERE id = $1 AND owner_id = $2",
      [id, ownerId]
    );
    return rows[0] || null;
  },

  // Create a new project
  create: async ({ title, description = "", status = "active", ownerId }) => {
    const { rows } = await pool.query(
      `INSERT INTO projects (title, description, status, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title.trim(), description.trim(), status, ownerId]
    );
    return rows[0];
  },

  // Update — only fields provided are changed (COALESCE keeps old value if null passed)
  update: async (id, ownerId, { title, description, status }) => {
    const { rows } = await pool.query(
      `UPDATE projects
       SET
         title       = COALESCE($1, title),
         description = COALESCE($2, description),
         status      = COALESCE($3, status),
         updated_at  = NOW()
       WHERE id = $4 AND owner_id = $5
       RETURNING *`,
      [title ?? null, description ?? null, status ?? null, id, ownerId]
    );
    return rows[0] || null;  // null means not found / not owner
  },

  // Delete project — cascades to tasks via FK constraint in DB
  delete: async (id, ownerId) => {
    const { rowCount } = await pool.query(
      "DELETE FROM projects WHERE id = $1 AND owner_id = $2",
      [id, ownerId]
    );
    return rowCount > 0;  // false means not found / not owner
  },
};

module.exports = Project;