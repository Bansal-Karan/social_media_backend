const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const usersController = require("../controllers/users");

const router = express.Router();

/**
 * User-related routes (follows, search, stats)
 */

// Follow a user
router.post("/:id/follow", authenticateToken, usersController.follow);

// Unfollow a user
router.delete("/:id/unfollow", authenticateToken, usersController.unfollow);

// Get users that current user follows
router.get("/me/following", authenticateToken, usersController.getMyFollowing);

// Get users that follow the current user
router.get("/me/followers", authenticateToken, usersController.getMyFollowers);

// Get follow stats for any user
router.get("/:id/stats", usersController.getFollowStats);

// Search users by name
router.post("/search", authenticateToken, async (req, res) => {
	try {
		const { name, limit = 10, offset = 0 } = req.body;
		if (!name) return res.status(400).json({ error: "Name is required" });

		const result = await require("../models/userModel").findUsersByName(name, limit, offset);
		res.json(result);
	} catch (err) {
		console.error("Search error", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;