const queries = require("../models/queries");

const getProfileByUsername = async (req, res, next) => {
  const { username } = req.params;
  const results = await queries.users.getUserByUsername(username);
  res.json(results);
};

const getProfileDataById = async (req, res, next) => {
  const { userId } = req.body;
  const results = await queries.users.getUserById(userId);
  if (results) {
      const filteredResults = {
        bio: results.bio,
        birth_date: results.birth_date,
        email: results.email,
        firstName: results.first_name,
        graduation_date: null,
        // last_login: null,
        last_name: "Dummy",
        major_id: null,
        minor_id: null,
        profile_pic: null,
        registered_at: "2022-06-24T22:11:59.883Z",
        social_medias: null,
        username: "TD01",
      };
      res.json(filteredResults);
  }
};

const deleteProfileById = async (req, res, next) => {
  const userId = req.body.userId;
  await queries.users.deleteUserById(userId);
  // req.body.temp = { message: "Hello"};
  // console.log(req.body);
  res.send("deleted user");
};

module.exports = {
  getProfileByUsername,
  getProfileDataById,
  deleteProfileById,
};
