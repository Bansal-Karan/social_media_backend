const commentModel = require("../models/comment");
const logger = require("../utils/logger");

const createComment = async (req, res) => {
	try {
		const userId = req.user.id;
		const postId = parseInt(req.params.postId);
		const { content } = req.body;

		if (!content) return res.status(400).json({ error: "Content is required" });

		const comment = await commentModel.createComment(userId, postId, content);
		res.status(201).json(comment);
	} catch (err) {
		logger.error("Failed to create comment", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const updateComment = async (req, res) => {
	try {
		const userId = req.user.id;
		const commentId = parseInt(req.params.commentId);
		const { content } = req.body;

		const existing = await commentModel.getCommentById(commentId);
		if (!existing) return res.status(404).json({ error: "Comment not found" });
		if (existing.user_id !== userId) return res.status(403).json({ error: "Unauthorized" });

		const updated = await commentModel.updateComment(commentId, content);
		res.json(updated);
	} catch (err) {
		logger.error("Failed to update comment", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const deleteComment = async (req, res) => {
	try {
		const userId = req.user.id;
		const commentId = parseInt(req.params.commentId);

		const existing = await commentModel.getCommentById(commentId);
		if (!existing) return res.status(404).json({ error: "Comment not found" });
		if (existing.user_id !== userId) return res.status(403).json({ error: "Unauthorized" });

		await commentModel.deleteComment(commentId);
		res.json({ success: true });
	} catch (err) {
		logger.error("Failed to delete comment", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getPostComments = async (req, res) => {
	try {
		const postId = parseInt(req.params.postId);
		const limit = parseInt(req.query.limit) || 10;
		const offset = parseInt(req.query.offset) || 0;

		const comments = await commentModel.getPostComments(postId, limit, offset);
		res.json(comments);
	} catch (err) {
		logger.error("Failed to get post comments", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
	createComment,
	updateComment,
	deleteComment,
	getPostComments,
};