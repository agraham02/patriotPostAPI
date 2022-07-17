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
    const { onlyUnderPost, commentId } = req.query;

    if (onlyUnderPost) {
        results = results.filter((commentLike) => {
            return commentLike.comment_id === Number.parseInt(commentId);
        });
    }
    res.json(results);
};

const updateBio = async (req, res, next) => {
    try {
        const user = await req.user;
        const { text } = req.body;
        await queries.users.updateUserBio(text, user.id);
        res.json("Successfully updated your bio");
    } catch (error) {
        res.status(500);
        return next(error);
    }
};

const updateName = async (req, res, next) => {
    try {
        const user = await req.user;
        const { firstName, lastName } = req.body;
        await queries.users.updateName(firstName, lastName, user.id);
        res.json("Successfully updated your name");
    } catch (error) {
        res.status(500);
        return next(error);
    }
};

const updateUsername = async (req, res, next) => {
    try {
        const user = await req.user;
        const { username } = req.body;
        const userWithThatName = await queries.users.getUserByUsername(
            username
        );
        if (userWithThatName) {
            return res.json("A user with that username already exists.");
        }
        await queries.users.updateUsername(username, user.id);
        res.json("Successfully updated your username");
    } catch (error) {
        res.status(500);
        return next(error);
    }
};

const updateSocialMedias = async (req, res, next) => {
    try {
        const user = await req.user;
        const {
            instagram,
            snapchat,
            facebook,
            linkedin,
            twitter,
            discord,
            email,
            website,
        } = req.body;
        const socialMedias = {
            instagram: instagram.trim() || null,
            snapchat: snapchat.trim() || null,
            facebook: facebook.trim() || null,
            linkedin: linkedin.trim() || null,
            twitter: twitter.trim() || null,
            discord: discord.trim() || null,
            email: email.trim() || null,
            website: website.trim() || null,
        };
        await queries.users.updateSocialMedias(socialMedias, user.id);
        res.json("Successfully updated your social medias");
    } catch (error) {
        res.status(500);
        return next(error);
    }
};

module.exports = {
    getProfileByUsername,
    getProfileDataById,
    deleteProfileById,
    getLikesByUserId,
    getCommentLikesByUserId,
    updateBio,
    updateName,
    updateUsername,
    updateSocialMedias
};
