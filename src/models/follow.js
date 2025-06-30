const { query } = require("../utils/database");

async function followUser(followerId, followeeId) {
	try {
		const result = await query(
			`INSERT INTO follows (follower_id, followee_id)
			 VALUES ($1, $2)
			 ON CONFLICT (follower_id, followee_id) DO NOTHING
			 RETURNING *`,
			[followerId, followeeId]
		);
		return result.rows[0] || null;
	} catch (err) {
		throw err;
	}
}

async function unfollowUser(followerId, followeeId) {
	try {
		await query(
			`DELETE FROM follows WHERE follower_id = $1 AND followee_id = $2`,
			[followerId, followeeId]
		);
		return { success: true };
	} catch (err) {
		throw err;
	}
}

async function getFollowing(userId) {
	try {
		const result = await query(
			`SELECT users.*
			 FROM follows
			 JOIN users ON follows.followee_id = users.id
			 WHERE follows.follower_id = $1`,
			[userId]
		);
		return result.rows;
	} catch (err) {
		throw err;
	}
}

async function getFollowers(userId) {
	try {
		const result = await query(
			`SELECT users.*
			 FROM follows
			 JOIN users ON follows.follower_id = users.id
			 WHERE follows.followee_id = $1`,
			[userId]
		);
		return result.rows;
	} catch (err) {
		throw err;
	}
}

async function getFollowCounts(userId) {
	try {
		const followers = await query(
			`SELECT COUNT(*) FROM follows WHERE followee_id = $1`,
			[userId]
		);
		const following = await query(
			`SELECT COUNT(*) FROM follows WHERE follower_id = $1`,
			[userId]
		);
		return {
			followers: parseInt(followers.rows[0].count),
			following: parseInt(following.rows[0].count),
		};
	} catch (err) {
		throw err;
	}
}

module.exports = {
	followUser,
	unfollowUser,
	getFollowing,
	getFollowers,
	getFollowCounts,
};