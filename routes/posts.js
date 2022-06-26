const express = require("express");
const postsRouter = express.Router();
const postController = require("../controllers/postsController");

postsRouter.get("/", postController.getPosts);

postsRouter.get("/comments", postController.getComments);

postsRouter.get("/:postId", postController.getPostsById);

postsRouter.post("/", postController.insertNewPost);

postsRouter.delete("/comments", postController.deleteCommentById);

postsRouter.delete("/:postId", postController.deletePostById);

postsRouter.post("/:postId/like", postController.likePost);

postsRouter.post("/:postId/unlike", postController.unlikePost);

postsRouter.get("/:postId/likes", postController.getLikesByPostId);

postsRouter.post("/:postId/comments/addComment", postController.addComment);


postsRouter.get("/tags", postController.getTags);

module.exports = postsRouter;

/*-getPosts,
        -getPostsById,
        getPostByUserId,
        -insertNewPost,
        -deletePostById,
        -getTags,
        likePost,
        unlikePost,
        getLikesByPostId,
        getLikesByUserId */