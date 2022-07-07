const queries = require("../models/queries");

const getProfileByUsername = async (req, res, next) => {
  const { username } = req.params;
  const results = await queries.users.getUserByUsername(username);
  res.json(results);
};

const getProfileDataById = async (req, res, next) => {
  const { userId } = req.query;
  const results = await queries.users.getUserById(userId);
  res.json(results);
  // if (results) {
  //     const filteredResults = {
  //       bio: results.bio,
  //       birth_date: results.birth_date,
  //       email: results.email,
  //       first_name: results.first_name,
  //       graduation_date: null,
  //       // last_login: null,
  //       last_name: "Dummy",
  //       major_id: null,
  //       minor_id: null,
  //       profile_pic: null,
  //       registered_at: "2022-06-24T22:11:59.883Z",
  //       social_medias: null,
  //       username: "TD01",
  //     };
  //     res.json(filteredResults);
  // }
};

const deleteProfileById = async (req, res, next) => {
  const userId = req.body.userId;
  await queries.users.deleteUserById(userId);
  // req.body.temp = { message: "Hello"};
  // console.log(req.body);
  res.json("deleted user");
};

const getLikesByUserId = async (req, res, next) => {
    const user = await req.user;
    const results = await queries.posts.likes.getLikesByUserId(user.id);
    res.json(results);
};

const getCommentLikesByUserId = async (req, res, next) => {
  const user = await req.user;
  let results = await queries.posts.comments.getCommentLikesByUserId(user.id);
  const {onlyUnderPost, commentId} = req.query;
  
  if (onlyUnderPost) {
    results = results.filter((commentLike) => {
      return commentLike.comment_id === Number.parseInt(commentId);
    });
  }
  res.json(results);
}

module.exports = {
  getProfileByUsername,
  getProfileDataById,
  deleteProfileById,
  getLikesByUserId,
  getCommentLikesByUserId
};
