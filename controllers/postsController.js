const queries = require("../models/queries");

const getPosts = async (req, res, next) => {
  try {
    const results = await queries.posts.getPosts();
    res.json(results);
  } catch (error) {
    const e = new Error(error.message);
    return next(e);
  }
};

const getPostsById = async (req, res, next) => {
  const { postId } = req.params;
  const results = await queries.posts.getPostsById(postId);
  res.json(results);
};

const getPostByUserId = async (req, res, next) => {
  const user = await req.user;
  const results = await queries.posts.getPostByUserId(user.id);
  res.json(results);
};

const insertNewPost = async (req, res, next) => {
  const user = await req.user;
  const {
    text,
    tag1,
    tag2,
    tag3,
    isPinned,
    isAdvertised,
    isSensative,
    isAnonymous,
    expiresIn,
  } = req.body;
  //   console.log(user);
  //   console.log(text);
  await queries.posts.insertNewPost(
    user.id,
    text,
    tag1,
    tag2,
    tag3,
    isPinned,
    isAdvertised,
    isSensative,
    isAnonymous,
    expiresIn
  );
  res.json({ message: "Your post was successfully posted" });
};

const deletePostById = async (req, res, next) => {
  const { postId } = req.params;
  console.log(postId);
  await queries.posts.deletePostById(postId);
  res.json({ message: "Your post was successfully deleted" });
};

const likePost = async (req, res, next) => {
  const user = await req.user;
  const { postId } = req.params;
  await queries.posts.likes.likePost(user.id, postId);
  res.json("Liked post");
};

const unlikePost = async (req, res, next) => {
  const user = await req.user;
  const { postId } = req.params;
  await queries.posts.likes.unlikePost(user.id, postId);
  res.json("Unliked post");
};

const getLikesByPostId = async (req, res, next) => {
  const { postId } = req.params;
  const results = await queries.posts.likes.getLikesByPostId(postId);
  res.json(results);
};

const addComment = async (req, res, next) => {
  const user = await req.user;
  const { postId } = req.params;
  const { text, isPinned, isSensative, isAnonymous } = req.body;

  await queries.posts.comments.insertNewComment(
    user.id,
    postId,
    text,
    isPinned,
    isSensative,
    isAnonymous
  );
  res.json({ message: "Your comment was successfully posted" });
};

const deleteCommentById = async (req, res, next) => {
  const { commentId } = req.params;
  await queries.posts.comments.deleteCommentById(commentId);
  res.json({ message: "Your comment was successfully deleted" });
};

const getCommentsByPostId = async (req, res, next) => {
  const { postId } = req.params;
  const results = await queries.posts.comments.getCommentsByPostId(postId);
  res.json(results);
};

const getCommentByCommentId = async (req, res, next) => {
  const { commentId } = req.params;
  const isParentCommentId = req.query.isParentCommentId;
  let results;
  if (isParentCommentId) {
    console.log("Here");
    results = await queries.posts.comments.getCommentsByParentCommentId(
      commentId
    );
  } else {
    console.log("THere");
    results = await queries.posts.comments.getCommentByCommentId(commentId);
  }
  res.json(results);

}



const getTags = async (req, res, next) => {
  const results = await queries.posts.getTags();
  res.json(results);
};

module.exports = {
  getPosts,
  getPostsById,
  getPostByUserId,
  insertNewPost,
  deletePostById,
  likePost,
  unlikePost,
  getLikesByPostId,
  addComment,
  deleteCommentById,
  getCommentsByPostId,
  getCommentByCommentId,
  getTags,
};

/*-getPosts,
        -getPostsById,
        -getPostByUserId,
        -insertNewPost,
        -deletePostById,
        -getTags,
        -likePost,
        -unlikePost,
        -getLikesByPostId,
        getLikesByUserId */
