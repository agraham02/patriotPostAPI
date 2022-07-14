const pool = require("./database");

const selectStatement = () => {};

const insertStatement = () => {};

const updateStatement = () => {};

const deleteStatement = () => {};

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
        [
            userId,
            text,
            tag1,
            tag2,
            tag3,
            isPinned,
            isAdvertised,
            isSensative,
            isAnonymous,
            expiresIn,
        ]
    );
};

const getPosts = async (userId) => {
    const results = await (
        await pool.query(
            "SELECT posts.id, posts.written_text, posts.tag_1, posts.tag_2, posts.tag_3, posts.is_pinned, posts.is_advertised, posts.is_sensative, posts.is_anonymous, posts.created_at, posts.expires_in, profile.id AS user_id, profile.first_name, profile.last_name, profile.username, profile.profile_pic FROM text_post AS posts LEFT JOIN user_profile AS profile ON posts.user_id = profile.id ORDER BY posts.created_at DESC"
        )
    ).rows;

    for (const result of results) {
        console.log(result);
        const postId = result.id;
        const likeCnt = await getPostsLikesCnt(postId);
        const commentCnt = await getPostsCommentCnt(postId);
        const isLiked = await postIsLiked(postId, userId);
        result.like_cnt = likeCnt;
        result.comment_cnt = commentCnt;
        result.is_liked = isLiked;
    }
    console.log(results);
    return results;
};

const getPostsLikesCnt = async (postId) => {
    const results = await (
        await pool.query(
            "SELECT COUNT(post_like.id) AS like_cnt FROM post_like WHERE post_id = $1",
            [postId]
        )
    ).rows[0];
    return results.like_cnt;
};

const getPostsCommentCnt = async (postId) => {
    const results = await (
        await pool.query(
            "SELECT COUNT(text_comment.id) AS comment_cnt FROM text_comment WHERE post_id = $1",
            [postId]
        )
    ).rows[0];
    return results.comment_cnt;
};

const postIsLiked = async (postId, userId) => {
    const results = await (await pool.query("SELECT * FROM post_like WHERE user_id = $1 AND post_id = $2", [userId, postId])).rows[0];
    console.log(results);
    if (results) {
        return true;
    } else {
        return false;
    }
}

const getPostsById = async (postId) => {
    const post = await (
        await pool.query(
            "SELECT posts.*, profile.first_name, profile.last_name, profile.username, profile.profile_pic, COUNT(likes.id) AS likes_cnt, COUNT(text_comment.id) AS comments_cnt FROM text_post AS posts LEFT JOIN user_profile AS profile ON posts.user_id = profile.id LEFT JOIN post_like AS likes ON posts.id = likes.post_id LEFT JOIN text_comment ON posts.id = text_comment.post_id WHERE posts.id = $1 GROUP BY posts.id, profile.first_name, profile.last_name, profile.username, profile.profile_pic ORDER BY posts.created_at DESC",
            [postId]
        )
    ).rows[0];
    const comments = await getCommentsByPostId(postId, true);
    return { post, comments };
};

const getPostByUserId = async (userId) => {
    const results = await (
        await pool.query(
            "SELECT posts.id, posts.written_text, posts.tag_1, posts.tag_2, posts.tag_3, posts.is_pinned, posts.is_advertised, posts.is_sensative, posts.is_anonymous, posts.created_at, posts.expires_in, profile.id AS user_id, profile.first_name, profile.last_name, profile.username, profile.profile_pic FROM text_post AS posts LEFT JOIN user_profile AS profile ON posts.user_id = profile.id WHERE posts.user_id = $1 ORDER BY posts.created_at DESC",
            [userId]
        )
    ).rows;
    return results;
};

const deletePostById = async (postId) => {
    await pool.query("DELETE FROM text_post WHERE id = $1", [postId]);
};

//Likes
const likePost = async (userId, postId) => {
    await pool.query(
        "INSERT INTO post_like (user_id, post_id) VALUES ($1, $2)",
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
    console.log(results);
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
    isAnonymous,
    parentCommentId
) => {
    await pool.query(
        "INSERT INTO text_comment (user_id, post_id, written_text, is_pinned, is_sensative, is_anonymous, parent_comment_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
            userId,
            postId,
            text,
            isPinned,
            isSensative,
            isAnonymous,
            parentCommentId,
        ]
    );
};

const deleteCommentById = async (commentId) => {
    await pool.query("DELETE FROM text_comment WHERE id = $1", [commentId]);
};

const getCommentsByPostId = async (postId, userId) => {
    const results = await (
        await pool.query(
            "SELECT text_comment.id, text_comment.post_id, text_comment.parent_comment_id, text_comment.written_text, text_comment.is_pinned, text_comment.is_sensative, text_comment.is_anonymous, text_comment.created_at, profile.id AS user_id, profile.first_name, profile.last_name, profile.username, profile.profile_pic FROM text_comment LEFT JOIN user_profile AS profile ON text_comment.user_id = profile.id WHERE text_comment.post_id = $1 AND text_comment.parent_comment_id IS NULL ORDER BY text_comment.created_at DESC",
            [postId]
        )
    ).rows;
    // console.log(results);
    for (const result of results) {
        console.log(result);
        const commentId = result.id;
        const likeCnt = await getCommentLikeCnt(commentId);
        const commentCnt = await getCommentCommentCnt(commentId);
        const isLiked = await commentIsLiked(commentId, userId);
        result.like_cnt = likeCnt;
        result.comment_cnt = commentCnt;
        result.is_liked = isLiked;
    }
    console.log(results);

    return results;
};

const getCommentByCommentId = async (commentId) => {
    const result = await (
        await pool.query(
            "SELECT text_comment.id, text_comment.post_id, text_comment.parent_comment_id, text_comment.written_text, text_comment.is_pinned, text_comment.is_sensative, text_comment.is_anonymous, text_comment.created_at, profile.id AS user_id, profile.first_name, profile.last_name, profile.username, profile.profile_pic FROM text_comment LEFT JOIN user_profile AS profile ON text_comment.user_id = profile.id WHERE text_comment.id = $1 ORDER BY text_comment.created_at DESC",
            [commentId]
        )
    ).rows[0];
    return result;
};

const getCommentsByParentCommentId = async (commentId, userId) => {
    const results = await (
        await pool.query(
            "SELECT text_comment.id, text_comment.post_id, text_comment.parent_comment_id, text_comment.written_text, text_comment.is_pinned, text_comment.is_sensative, text_comment.is_anonymous, text_comment.created_at, profile.id AS user_id, profile.first_name, profile.last_name, profile.username, profile.profile_pic FROM text_comment LEFT JOIN user_profile AS profile ON text_comment.user_id = profile.id WHERE text_comment.parent_comment_id = $1 ORDER BY text_comment.created_at DESC",
            [commentId]
        )
    ).rows;
    for (const result of results) {
        console.log(result);
        const commentId = result.id;
        const likeCnt = await getCommentLikeCnt(commentId);
        const commentCnt = await getCommentCommentCnt(commentId);
        const isLiked = await commentIsLiked(commentId, userId);
        result.like_cnt = likeCnt;
        result.comment_cnt = commentCnt;
        result.is_liked = isLiked;
    }
    console.log(results);

    return results;
};

const getCommentLikeCnt = async (commentId) => {
    const result = await (
        await pool.query(
            "SELECT COUNT(id) AS like_cnt FROM comment_like WHERE comment_id = $1",
            [commentId]
        )
    ).rows[0];
    return result.like_cnt;
};

const getCommentCommentCnt = async (commentId) => {
    const result = await (
        await pool.query(
            "SELECT COUNT(id) AS comment_cnt FROM text_comment WHERE parent_comment_id = $1",
            [commentId]
        )
    ).rows[0];
    return result.comment_cnt;
}

const commentIsLiked = async (commentId, userId) => {
    const results = await (
        await pool.query(
            "SELECT * FROM comment_like WHERE user_id = $1 AND comment_id = $2",
            [userId, commentId]
        )
    ).rows[0];
    console.log(results);
    if (results) {
        return true;
    } else {
        return false;
    }
};

const likeComment = async (userId, commentId) => {
    await pool.query(
        "INSERT INTO comment_like (user_id, comment_id) VALUES ($1, $2)",
        [userId, commentId]
    );
};

const unlikeComment = async (userId, commentId) => {
    await pool.query(
        "DELETE FROM comment_like WHERE user_id = $1 AND comment_id = $2",
        [userId, commentId]
    );
};

const getCommentLikesByUserId = async (userId) => {
  const results = await (
        await pool.query("SELECT * FROM comment_like WHERE user_id = $1", [userId])
    ).rows;
    console.log(results);
    return results;
}

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
            getPostsLikesCnt,
        },
        comments: {
            insertNewComment,
            deleteCommentById,
            getCommentsByPostId,
            getCommentByCommentId,
            getCommentsByParentCommentId,
            getPostsCommentCnt,
            getCommentLikeCnt,
            likeComment,
            unlikeComment,
            getCommentLikesByUserId
        },
    },
    logIn: {},
};
