const express = require("express");
const passport = require("passport");
const postsRouter = express.Router();
const postController = require("../controllers/postsController");

postsRouter.use(passport.authenticate("jwt", { session: false }));

postsRouter.get("/", postController.getPosts);

postsRouter.post("/", postController.insertNewPost);

postsRouter.get("/tags", postController.getTags);

postsRouter.get("/myPosts", postController.getPostByUserId);

postsRouter.get("/:postId", postController.getPostsById);

postsRouter.delete("/:postId", postController.deletePostById);

postsRouter.post("/:postId/like", postController.likePost);

postsRouter.post("/:postId/unlike", postController.unlikePost);

postsRouter.get("/:postId/likes", postController.getLikesByPostId);

postsRouter.get("/:postId/comments", postController.getCommentsByPostId);

postsRouter.get("/:postId/refresh", postController.refreshPostLikesAndCommentsCnt);

postsRouter.post("/:postId/comment", postController.addComment);

postsRouter.get("/comments/:commentId", postController.getCommentByCommentId);

postsRouter.delete("/comments/:commentId", postController.deleteCommentById);

postsRouter.post("/comments/:commentId/like", postController.likeComment);

postsRouter.delete("/comments/:commentId/unlike", postController.unlikeComment);

module.exports = postsRouter;