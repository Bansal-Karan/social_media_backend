const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const likesController = require("../controllers/likes");

const router = express.Router();

/**
 * Likes routes
 */

// Like a post
router.post("/:post_id", authenticateToken, likesController.likePost);

// Unlike a post
router.delete("/:post_id", authenticateToken, likesController.unlikePost);

// Get likes for a specific post
router.get("/post/:post_id", likesController.getPostLikes);

// Get posts liked by a specific user
router.get("/user/:user_id", likesController.getUserLikes);

module.exports = router;