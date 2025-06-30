/**
 * Comment model for managing post comments
 * TODO: Implement this model for the comment functionality
 */

// TODO: Implement createComment function
// TODO: Implement updateComment function
// TODO: Implement deleteComment function
// TODO: Implement getPostComments function
// TODO: Implement getCommentById function

const { query } = require("../utils/database");

async function createComment(userId, postId, content) {
	try {
		const result = await query(
			`INSERT INTO comments (user_id, post_id, content)
			 VALUES ($1, $2, $3)
			 RETURNING *`,
			[userId, postId, content]
		);
		return result.rows[0];
	} catch (err) {
		throw err;
	}
}

async function updateComment(commentId, newContent) {
	try {
		const result = await query(
			`UPDATE comments
			 SET content = $1, updated_at = CURRENT_TIMESTAMP
			 WHERE id = $2
			 RETURNING *`,
			[newContent, commentId]
		);
		return result.rows[0];
	} catch (err) {
		throw err;
	}
}

async function deleteComment(commentId) {
	try {
		await query(`DELETE FROM comments WHERE id = $1`, [commentId]);
		return { success: true };
	} catch (err) {
		throw err;
	}
}

async function getPostComments(postId) {
	try {
		const result = await query(
			`SELECT comments.*, users.username
			 FROM comments
			 JOIN users ON comments.user_id = users.id
			 WHERE post_id = $1
			 ORDER BY created_at ASC`,
			[postId]
		);
		return result.rows;
	} catch (err) {
		throw err;
	}
}

async function getCommentById(commentId) {
	try {
		const result = await query(
			`SELECT * FROM comments WHERE id = $1`,
			[commentId]
		);
		return result.rows[0];
	} catch (err) {
		throw err;
	}
}

module.exports = {
	createComment,
	updateComment,
	deleteComment,
	getPostComments,
	getCommentById,
};

