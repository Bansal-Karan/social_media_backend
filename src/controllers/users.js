const followModel = require("../models/follow");
const userModel = require("../models/user");
const logger = require("../utils/logger");

/**
 * Follow a user
 */
const follow = async (req, res) => {
	try {
		const followerId = req.user.id;
		const followeeId = parseInt(req.params.id);

		if (followerId === followeeId) {
			return res.status(400).json({ error: "You cannot follow yourself" });
		}

		const followed = await followModel.followUser(followerId, followeeId);
		res.status(201).json({ message: "Followed", followed });
	} catch (err) {
		logger.error("Failed to follow user", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Unfollow a user
 */
const unfollow = async (req, res) => {
	try {
		const followerId = req.user.id;
		const followeeId = parseInt(req.params.id);

		await followModel.unfollowUser(followerId, followeeId);
		res.json({ message: "Unfollowed" });
	} catch (err) {
		logger.error("Failed to unfollow user", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Get users the current user is following
 */
const getMyFollowing = async (req, res) => {
	try {
		const userId = req.user.id;
		const following = await followModel.getFollowing(userId);
		res.json(following);
	} catch (err) {
		logger.error("Failed to get following", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Get users who follow the current user
 */
const getMyFollowers = async (req, res) => {
	try {
		const userId = req.user.id;
		const followers = await followModel.getFollowers(userId);
		res.json(followers);
	} catch (err) {
		logger.error("Failed to get followers", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Get follower/following counts for a user
 */
const getFollowStats = async (req, res) => {
	try {
		const userId = parseInt(req.params.id);
		const stats = await followModel.getFollowCounts(userId);
		res.json(stats);
	} catch (err) {
		logger.critical("Failed to follow user", err.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
	follow,
	unfollow,
	getMyFollowing,
	getMyFollowers,
	getFollowStats,
};