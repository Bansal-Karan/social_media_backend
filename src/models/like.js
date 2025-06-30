const { query } = require("../utils/database");

async function likePost(userId, postId) {
	try {
		const result = await query(
			`INSERT INTO likes (user_id, post_id)
			 VALUES ($1, $2)
			 ON CONFLICT (user_id, post_id) DO NOTHING
			 RETURNING *`,
			[userId, postId]
		);
		return result.rows[0] || null;
	} catch (err) {
		throw err;
	}
}

async function unlikePost(userId, postId) {
	try {
		await query(
			`DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
			[userId, postId]
		);
		return { success: true };
	} catch (err) {
		throw err;
	}
}

async function getPostLikes(postId) {
	try {
		const result = await query(
			`SELECT users.id, users.username
			 FROM likes
			 JOIN users ON likes.user_id = users.id
			 WHERE likes.post_id = $1`,
			[postId]
		);
		return result.rows;
	} catch (err) {
		throw err;
	}
}

async function getUserLikes(userId) {
	try {
		const result = await query(
			`SELECT posts.id, posts.content
			 FROM likes
			 JOIN posts ON likes.post_id = posts.id
			 WHERE likes.user_id = $1`,
			[userId]
		);
		return result.rows;
	} catch (err) {
		throw err;
	}
}

async function hasUserLikedPost(userId, postId) {
	try {
		const result = await query(
			`SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2`,
			[userId, postId]
		);
		return result.rowCount > 0;
	} catch (err) {
		throw err;
	}
}

module.exports = {
	likePost,
	unlikePost,
	getPostLikes,
	getUserLikes,
	hasUserLikedPost,
};