const { likePost } = require("../models/like");
const logger = require("../utils/logger");
const {
	getPostLikes: getPostLikesModel,
	getUserLikes: getUserLikesModel,
	unlikePost: unlikePostModel,
} = require("../models/like");


const likePostController = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = parseInt(req.params.post_id);

    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const result = await likePost(userId, postId);

    if (!result) {
      return res.status(409).json({ message: "Already liked" });
    }

    res.status(201).json({ message: "Post liked", like: result });
  } catch (error) {
    logger.critical("Like post error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const unlikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = parseInt(req.params.post_id);

    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const success = await unlikePostModel(userId, postId);

    if (!success) {
      return res.status(404).json({ error: "Like not found" });
    }

    res.json({ message: "Post unliked" });
  } catch (error) {
    logger.critical("Unlike post error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users who liked a post
const getPostLikes = async (req, res) => {
  try {
    const postId = parseInt(req.params.post_id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const likes = await getPostLikesModel(postId);
    res.json({ likes });
  } catch (error) {
    logger.critical("Get post likes error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all posts liked by a user
const getUserLikes = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const likedPosts = await getUserLikesModel(userId);
    res.json({ likedPosts });
  } catch (error) {
    logger.critical("Get user likes error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  likePost: likePostController,
  unlikePost,
  getPostLikes,
  getUserLikes,
};