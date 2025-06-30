const { query } = require("../utils/database");

// Existing functions (createPost, getPostById, getPostsByUserId, deletePost) stay as is...

const createPost = async ({ user_id, content, media_url, comments_enabled }) => {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, comments_enabled)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, content, media_url, comments_enabled]
  );

  return result.rows[0];
};

const getPostById = async (postId) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1 AND p.is_deleted = FALSE`,
    [postId]
  );
  return result.rows[0] || null;
};

const getPostsByUserId = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1 AND p.is_deleted = FALSE
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};

const deletePost = async (postId, userId) => {
  const result = await query(
    `UPDATE posts
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [postId, userId]
  );
  return result.rows[0] || null;
};

/**
 * Get feed posts for a user (posts by followed users + own posts)
 */
const getFeedPosts = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.is_deleted = false
       AND (p.user_id = $1 OR p.user_id IN (
         SELECT followee_id FROM follows WHERE follower_id = $1
       ))
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows;
};

/**
 * Update a post (only content and media URL)
 */
const updatePost = async (postId, userId, content, media_url, comments_enabled) => {
  const result = await query(
    `UPDATE posts
     SET content = $1,
         media_url = $2,
         comments_enabled = $3,
         updated_at = NOW()
     WHERE id = $4 AND user_id = $5
     RETURNING *`,
    [content, media_url, comments_enabled, postId, userId]
  );

  return result.rows[0] || null;
};

/**
 * Search posts by keyword (in content)
 */
const searchPosts = async (keyword, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.content ILIKE '%' || $1 || '%' AND p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [keyword, limit, offset]
  );

  return result.rows;
};

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePost,
  searchPosts,
};