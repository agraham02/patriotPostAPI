const express = require("express");
const passport = require("passport");
const postsRouter = express.Router();
const postController = require("../controllers/postsController");

postsRouter.use(passport.authenticate("jwt", { session: false }));

postsRouter.get("/", postController.getPosts);


postsRouter.get("/tags", postController.getTags);

postsRouter.post("/", postController.insertNewPost);

postsRouter.get("/:postId", postController.getPostsById);

postsRouter.delete("/:postId", postController.deletePostById);

postsRouter.post("/:postId/like", postController.likePost);

postsRouter.post("/:postId/unlike", postController.unlikePost);

postsRouter.get("/:postId/likes", postController.getLikesByPostId);

postsRouter.get("/:postId/comments", postController.getCommentsByPostId);

postsRouter.post("/:postId/comment", postController.addComment);

postsRouter.delete("/comment/:commentId", postController.deleteCommentById);


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