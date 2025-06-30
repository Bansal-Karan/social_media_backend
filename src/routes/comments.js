const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const commentsController = require("../controllers/comments");

const router = express.Router();

/**
 * Comments routes
 */

// Create a comment on a post
router.post("/post/:postId", authenticateToken, commentsController.createComment);

// Update a user's own comment
router.put("/:commentId", authenticateToken, commentsController.updateComment);

// Delete a user's own comment
router.delete("/:commentId", authenticateToken, commentsController.deleteComment);

// Get all comments for a post
router.get("/post/:postId", commentsController.getPostComments);

module.exports = router;