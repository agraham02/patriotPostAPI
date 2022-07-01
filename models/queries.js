const pool = require("./database");



const selectStatement = () => {
  
}

const insertStatement = () => {

}

const updateStatement = () => {

}

const deleteStatement = () => {

}

//Users
const insertNewUser = async (
  firstName,
  lastName,
  username,
  email,
  hashedPassword,
  birthDate
) => {
  await pool.query(
    "INSERT INTO user_profile (first_name, last_name, username, email, password, birth_date) VALUES ($1, $2, $3, $4, $5, $6)",
    [firstName, lastName, username, email, hashedPassword, birthDate]
  );
};

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

//Posts
const insertNewPost = async (
  userId,
  text,
  tag1,
  tag2,
  tag3,
  isPinned,
  isAdvertised,
  isSensative,
  isAnonymous,
  expiresIn
) => {
  await pool.query(
    "INSERT INTO text_post (user_id, written_text, tag_1, tag_2, tag_3, is_pinned, is_advertised, is_sensative, is_anonymous, expires_in) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    [userId, text, tag1, tag2, tag3, isPinned, isAdvertised, isSensative, isAnonymous, expiresIn]
  );
};

const getPosts = async () => {
  const results = await (
    await pool.query(
      "SELECT posts.*, profile.first_name, profile.last_name, profile.username, profile.profile_pic, COUNT(likes.id) AS likes_cnt, COUNT(text_comment.id) AS comments_cnt FROM text_post AS posts LEFT JOIN user_profile AS profile ON posts.user_id = profile.id LEFT JOIN post_like AS likes ON posts.id = likes.post_id LEFT JOIN text_comment ON posts.id = text_comment.post_id GROUP BY posts.id, profile.first_name, profile.last_name, profile.username, profile.profile_pic, likes.user_id ORDER BY posts.created_at DESC"
    )
  ).rows;
  return results;
};

const getPostsById = async (postId) => {
  const post = await (
    await pool.query(
      "SELECT posts.*, profile.first_name, profile.last_name, profile.username, profile.profile_pic, COUNT(likes.id) AS likes_cnt, likes.user_id AS like_user_id, COUNT(text_comment.id) AS comments_cnt FROM text_post AS posts LEFT JOIN user_profile AS profile ON posts.user_id = profile.id LEFT JOIN post_like AS likes ON posts.id = likes.post_id LEFT JOIN text_comment ON posts.id = text_comment.post_id WHERE posts.id = $1 GROUP BY posts.id, profile.first_name, profile.last_name, profile.username, profile.profile_pic, likes.user_id ORDER BY posts.created_at DESC",
      [postId]
    )
  ).rows[0];
  const comments = await getCommentsByPostId(postId, true);
  return { post, comments };
};

const getPostByUserId = async (userId) => {
  const results = await (
    await pool.query("SELECT * FROM text_post WHERE user_id = $1", [userId])
  ).rows;
  return results;
};

const deletePostById = async (postId) => {
  await pool.query("DELETE FROM text_post WHERE id = $1", [postId]);
};

//Likes
const likePost = async (userId, postId) => {
  await pool.query("INSERT INTO post_like (user_id, post_id) VALUES ($1, $2)", [
    userId,
    postId,
  ]);
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

const unlikePost = async (userId, postId) => {
  await pool.query(
    "DELETE FROM post_like WHERE user_id = $1 AND post_id = $2",
    [userId, postId]
  );
};

//Comments
const insertNewComment = async (
  userId,
  postId,
  text,
  isPinned,
  isSensative,
  isAnonymous
) => {
  await pool.query(
    "INSERT INTO text_comment (user_id, post_id, written_text, is_pinned, is_sensative, is_anonymous) VALUES ($1, $2, $3, $4, $5, $6)",
    [userId, postId, text, isPinned, isSensative, isAnonymous]
  );
};

const deleteCommentById = async (commentId) => {
  await pool.query("DELETE FROM text_comment WHERE id = $1", [commentId]);
};

const getCommentsByPostId = async (postId) => {
  let query;
  const results = await (await pool.query("SELECT * FROM text_comment WHERE post_id = $1", [postId])).rows;
  return results;
};

const getCommentsByCommentId = async (commentId) => {
  const results = await (
    await pool.query(
      "SELECT * FROM text_comment WHERE parent_comment_id = $1",
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
