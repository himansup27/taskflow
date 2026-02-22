const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

const User = {
  // Find user by email — password excluded by default
  findByEmail: async (email, includePassword = false) => {
    const fields = includePassword
      ? "id, name, email, password, created_at, updated_at"
      : "id, name, email, created_at, updated_at";

    const { rows } = await pool.query(
      `SELECT ${fields} FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    return rows[0] || null;
  },

  // Find user by ID — password never returned
  findById: async (id) => {
    const { rows } = await pool.query(
      "SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  // Create a new user — hashes password before insert
  create: async ({ name, email, password }) => {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at, updated_at`,
      [name.trim(), email.toLowerCase().trim(), hashedPassword]
    );
    return rows[0];
  },

  // Compare plain password with stored hash
  matchPassword: async (enteredPassword, storedHash) => {
    return await bcrypt.compare(enteredPassword, storedHash);
  },
};

module.exports = User;