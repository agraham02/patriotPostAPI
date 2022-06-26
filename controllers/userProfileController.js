const queries = require("../models/queries");

const getProfileByUsername = async (req, res, next) => {
    const { username } = req.params;
    const results = await queries.users.getUserByUsername(username);
    res.send(results);
}

const deleteProfileById = async (req, res, next) => {
    const userId = req.body.userId;
    await queries.users.deleteUserById(userId);
    // req.body.temp = { message: "Hello"};
    // console.log(req.body);
    res.send("deleted user");
}

module.exports = {
    getProfileByUsername,
    deleteProfileById
}