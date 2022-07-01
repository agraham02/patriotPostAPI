const queries = require("../models/queries");

const getPosts = async (req, res, next) => {
    try {
        const results = await queries.posts.getPosts();
        res.json(results);        
    } catch (error) {
        const e = new Error(error.message);
        return next(e);
    }
}

const getPostsById = async (req, res, next) => {
    const { postId } = req.params;
    const results = await queries.posts.getPostsById(postId);
    res.json(results);
}

const getPostByUserId = async (req, res, next) => {
    const user = await req.user;
    const results = await queries.posts.getPostByUserId(user.id);
    res.json(results);
}

const insertNewPost = async (req, res, next) => {
    const user = await req.user;
    const { text, isPinned, isPromoted, isAdvertisement } = req.body;
    console.log(user);
    console.log(text);
    await queries.posts.insertNewPost(user.id, text, false, false, false);
    res.json("Added new post");
}

const deletePostById = async (req, res, next) => {
    const { postId } = req.params;
    console.log(postId);
    await queries.posts.deletePostById(postId);
    res.json("removed post");
}

const likePost = async (req, res, next) => {
    const user = await req.user;
    const { postId } = req.params;
    await queries.posts.likes.likePost(user.id, postId);
    res.json("Liked post");
}

const unlikePost = async (req, res, next) => {
    const user = await req.user;
    const { postId } = req.params;
    await queries.posts.likes.unlikePost(user.id, postId);
    res.json("Unliked post");    
}

const getLikesByPostId = async (req, res, next) => {
    const { postId } = req.params;
    const results = await queries.posts.likes.getLikesByPostId(postId);
    res.json(results);
}

const addComment = async (req, res, next) => {
    const user = await req.user;
    const { postId } = req.params;
    const { parentCommentId, text } = req.body;
    
    await queries.posts.comments.insertNewComment(user.id, postId, parentCommentId ? parentCommentId : null, text);
    res.json("Added comment");
}

const deleteCommentById = async (req, res, next) => {
    const { commentId } = req.body;
    await queries.posts.comments.deleteCommentById(commentId);
    res.json("Deleted comment");
}

const getComments = async (req, res, next) => {
    let results;
    const { isGetByCommentId } = req.body;
    if (isGetByCommentId) {
        const { commentId } = req.body;
        results = await queries.posts.comments.getCommentsByCommentId(commentId);
    } else {
        const { postId, onlyImmediate } = req.body;
        results = await queries.posts.comments.getCommentsByPostId(postId, onlyImmediate);
    }
    res.json(results);
}

const getTags = async (req, res, next) => {
    const results = await queries.posts.getTags();
    res.json(results);
}


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
    getComments,
    getTags,
}

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