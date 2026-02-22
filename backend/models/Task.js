const { pool } = require("../config/db");

const Task = {
  // Get tasks for a project with optional filters (status, priority, search)
  findByProject: async (projectId, filters = {}) => {
    const conditions = ["t.project_id = $1"];
    const values = [projectId];
    let idx = 2;

    if (filters.status) {
      conditions.push(`t.status = $${idx++}`);
      values.push(filters.status);
    }

    if (filters.priority) {
      conditions.push(`t.priority = $${idx++}`);
      values.push(filters.priority);
    }

    if (filters.search) {
      conditions.push(`t.title ILIKE $${idx++}`);
      values.push(`%${filters.search}%`);
    }

    const whereClause = conditions.join(" AND ");

    const { rows } = await pool.query(
      `SELECT
         t.*,
         u_created.name  AS created_by_name,
         u_created.email AS created_by_email,
         u_assigned.name  AS assigned_to_name,
         u_assigned.email AS assigned_to_email
       FROM tasks t
       LEFT JOIN users u_created  ON u_created.id  = t.created_by
       LEFT JOIN users u_assigned ON u_assigned.id = t.assigned_to
       WHERE ${whereClause}
       ORDER BY t.created_at DESC`,
      values
    );
    return rows;
  },

  // Get a single task with related user info
  findById: async (id) => {
    const { rows } = await pool.query(
      `SELECT
         t.*,
         p.title          AS project_title,
         p.status         AS project_status,
         p.owner_id       AS project_owner_id,
         u_created.name   AS created_by_name,
         u_created.email  AS created_by_email,
         u_assigned.name  AS assigned_to_name,
         u_assigned.email AS assigned_to_email
       FROM tasks t
       LEFT JOIN projects p       ON p.id = t.project_id
       LEFT JOIN users u_created  ON u_created.id  = t.created_by
       LEFT JOIN users u_assigned ON u_assigned.id = t.assigned_to
       WHERE t.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  // Create a new task
  create: async ({ title, description = "", status = "todo", priority = "medium", dueDate = null, projectId, createdBy }) => {
    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date, project_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title.trim(), description.trim(), status, priority, dueDate, projectId, createdBy]
    );

    // Return with creator info
    return await Task.findById(rows[0].id);
  },

  // Update — only provided fields change
  update: async (id, { title, description, status, priority, dueDate }) => {
    const { rows } = await pool.query(
      `UPDATE tasks
       SET
         title       = COALESCE($1, title),
         description = COALESCE($2, description),
         status      = COALESCE($3, status),
         priority    = COALESCE($4, priority),
         due_date    = CASE WHEN $5::text IS NOT NULL THEN $5::date ELSE due_date END,
         updated_at  = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        title ?? null,
        description ?? null,
        status ?? null,
        priority ?? null,
        dueDate !== undefined ? dueDate : null,
        id,
      ]
    );

    if (!rows[0]) return null;
    return await Task.findById(rows[0].id);
  },

  // Delete a task by ID
  delete: async (id) => {
    const { rowCount } = await pool.query(
      "DELETE FROM tasks WHERE id = $1",
      [id]
    );
    return rowCount > 0;
  },

  // Get the project_id of a task — used for ownership check in controllers
  getProjectId: async (taskId) => {
    const { rows } = await pool.query(
      "SELECT project_id FROM tasks WHERE id = $1",
      [taskId]
    );
    return rows[0]?.project_id || null;
  },
};

module.exports = Task;