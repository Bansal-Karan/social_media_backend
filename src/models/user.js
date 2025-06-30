const { query } = require("../utils/database");
const bcrypt = require("bcryptjs");

/**
 * User model for database operations
 */

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async ({ username, email, password, full_name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (username, email, password_hash, full_name, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, username, email, full_name, created_at`,
    [username, email, hashedPassword, full_name]
  );

  return result.rows[0];
};


/**
 * Find user by username
 * @param {string} username - Username to search for
 * @returns {Promise<Object|null>} User object or null
 */
const getUserByUsername = async (username) => {
  const result = await query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  return result.rows[0] || null;
};

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} User object or null
 */
const getUserById = async (id) => {
  const result = await query(
    "SELECT id, username, email, full_name, created_at FROM users WHERE id = $1",
    [id],
  );

  return result.rows[0] || null;
};

/**
 * Verify user password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} Password match result
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// TODO: Implement findUsersByName function for search functionality
// This should support partial name matching and pagination

// TODO: Implement getUserProfile function that includes follower/following counts

// TODO: Implement updateUserProfile function for profile updates

/**
 * Find users by name (partial match, supports pagination)
 */
const findUsersByName = async (nameQuery, limit = 10, offset = 0) => {
  const result = await query(
    `SELECT id, username, full_name
     FROM users
     WHERE full_name ILIKE '%' || $1 || '%' AND is_deleted = FALSE
     ORDER BY full_name ASC
     LIMIT $2 OFFSET $3`,
    [nameQuery, limit, offset]
  );
  return result.rows;
};

/**
 * Get full user profile with follower/following counts
 */
const getUserProfile = async (userId) => {
  const userResult = await query(
    `SELECT id, username, email, full_name, created_at
     FROM users
     WHERE id = $1 AND is_deleted = FALSE`,
    [userId]
  );

  const user = userResult.rows[0];
  if (!user) return null;

  const followersResult = await query(
    `SELECT COUNT(*) FROM follows WHERE followee_id = $1`,
    [userId]
  );
  const followingResult = await query(
    `SELECT COUNT(*) FROM follows WHERE follower_id = $1`,
    [userId]
  );

  return {
    ...user,
    followers: parseInt(followersResult.rows[0].count),
    following: parseInt(followingResult.rows[0].count),
  };
};

/**
 * Update user profile (name, email, password)
 */
const updateUserProfile = async (userId, { full_name, email, password }) => {
  let updateQuery = `UPDATE users SET`;
  const fields = [];
  const values = [];
  let counter = 1;

  if (full_name) {
    fields.push(` full_name = $${counter++} `);
    values.push(full_name);
  }
  if (email) {
    fields.push(` email = $${counter++} `);
    values.push(email);
  }
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    fields.push(` password_hash = $${counter++} `);
    values.push(hashed);
  }

  if (fields.length === 0) return null;

  updateQuery += fields.join(", ") + `, updated_at = NOW() WHERE id = $${counter} RETURNING *`;
  values.push(userId);

  const result = await query(updateQuery, values);
  return result.rows[0] || null;
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
  findUsersByName,
  getUserProfile,
  updateUserProfile,
};