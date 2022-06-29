const pool = require("./database");

//Users
const getUserByUsername = async (username) => {
  const result = await (
    await pool.query("SELECT * FROM user_profile WHERE username = $1", [
      username,
    ])
  ).rows[0];
  return result;
};

const getUserById = async (id) => {
  const result = await (
    await pool.query("SELECT * FROM user_profile WHERE id = $1", [id])
  ).rows[0];
  return result;
};

const insertNewUser = async (
  firstName,
  lastName,
  username,
  hashedPassword,
  birthDate
) => {
  await pool.query(
    "INSERT INTO user_profile (first_name, last_name, username, password_hashed, birth_date) VALUES ($1, $2, $3, $4, $5)",
    [firstName, lastName, username, hashedPassword, birthDate]
  );
};

const updateUserById = async (
  firstName,
  lastName,
  username,
  email,
  password,
  bio,
  profilePic,
  major,
  minor,
  graduationDate
) => {};

const updateUserSettingsByUserId = async (
  showAge,
  showGradYear,
  showLastName
) => {};

const deleteUserById = async (userId) => {
  await pool.query("DELETE FROM user_profile WHERE id = $1", [userId]);
};

const sendFeedback = async (userId, feedback) => {
  await pool.query("INSERT INTO feedback (user_id, feedback) VALUES ($1, $2)", [
    userId,
    feedback,
  ]);
};

//Posts
const getPosts = async () => {
  const results = await (
    await pool.query(
      "SELECT posts.*, profile.first_name, profile.last_name, profile.username, profile.profile_pic, COUNT(likes.id) AS likes_cnt, likes.user_id AS like_user_id, COUNT(post_comment.id) AS comments_cnt FROM user_post AS posts LEFT JOIN user_profile AS profile ON posts.user_id = profile.id LEFT JOIN post_like AS likes ON posts.id = likes.post_id LEFT JOIN post_comment ON posts.id = post_comment.parent_post_id GROUP BY posts.id, profile.first_name, profile.last_name, profile.username, profile.profile_pic, likes.user_id ORDER BY posts.created_at DESC"
    )
  ).rows;
  return results;
};

const getPostsById = async (postId) => {
  const result = await (
    await pool.query("SELECT * FROM user_post WHERE id = $1", [postId])
  ).rows[0];
  return result;
};

const getPostByUserId = async (userId) => {
  const results = await (
    await pool.query("SELECT * FROM user_post WHERE user_id = $1", [userId])
  ).rows;
  return results;
};

const insertNewPost = async (
  userId,
  text,
  isPinned,
  isPromoted,
  isAdvertisement
) => {
  await pool.query(
    "INSERT INTO user_post (user_id, content, is_pinned, is_promoted, is_advertisement) VALUES ($1, $2, $3, $4, $5)",
    [userId, text, isPinned, isPromoted, isAdvertisement]
  );
};

const deletePostById = async (postId) => {
  await pool.query("DELETE FROM user_post WHERE id = $1", [postId]);
};

//Likes
const likePost = async (userId, postId) => {
  await pool.query("INSERT INTO post_like (user_id, post_id) VALUES ($1, $2)", [
    userId,
    postId,
  ]);
};

const unlikePost = async (userId, postId) => {
  await pool.query(
    "DELETE FROM post_like WHERE user_id = $1 AND post_id = $2",
    [userId, postId]
  );
};

const getLikesByPostId = async (postId) => {
  const results = await (
    await pool.query("SELECT * FROM post_like WHERE post_id = $1", [postId])
  ).rows;
  return results;
};

const getLikesByUserId = async (userId) => {
  const results = await (
    await pool.query("SELECT * FROM post_like WHERE user_id = $1", [userId])
  ).rows;
  return results;
};

//Comments
const insertNewComment = async (
  userId,
  parentPostId,
  parentCommentId,
  text
) => {
  await pool.query(
    "INSERT INTO post_comment (user_id, parent_post_id, parent_comment_id, comment_text) VALUES ($1, $2, $3, $4)",
    [userId, parentPostId, parentCommentId, text]
  );
};

const deleteCommentById = async (commentId) => {
  await pool.query("DELETE FROM post_comment WHERE id = $1", [commentId]);
};

const getCommentsByPostId = async (postId, onlyImmediateChild) => {
  let query;
  if (onlyImmediateChild) {
    query =
      "SELECT * FROM post_comment WHERE parent_post_id = $1 AND parent_comment_id IS NULL";
  } else {
    query = "SELECT * FROM post_comment WHERE parent_post_id = $1";
  }
  const results = await (await pool.query(query, [postId])).rows;
  return results;
};

const getCommentsByCommentId = async (commentId) => {
  const results = await (
    await pool.query(
      "SELECT * FROM post_comment WHERE parent_comment_id = $1",
      [commentId]
    )
  ).rows;
  return results;
};

const getTags = async () => {
  const results = await (
    await pool.query("SELECT * FROM post_tag ORDER BY name ASC")
  ).rows;
  return results;
};

module.exports = {
  users: {
    getUserByUsername,
    getUserById,
    insertNewUser,
    updateUserById,
    deleteUserById,
    updateUserSettingsByUserId,
    sendFeedback,
  },
  posts: {
    getPosts,
    getPostsById,
    getPostByUserId,
    insertNewPost,
    deletePostById,
    getTags,
    likes: {
      likePost,
      unlikePost,
      getLikesByPostId,
      getLikesByUserId,
    },
    comments: {
      insertNewComment,
      deleteCommentById,
      getCommentsByPostId,
      getCommentsByCommentId,
    },
  },
  logIn: {},
};
