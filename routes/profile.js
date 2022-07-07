const express = require("express");
const passport = require("passport");
const profileRouter = express.Router();
const userProfileController = require("../controllers/userProfileController");
const { authenticateToken } = require("../utils");
const postController = require("../controllers/postsController"); 

profileRouter.use(passport.authenticate("jwt", { session: false }));

profileRouter.get(
  "/",
  async (req, res) => {
    const user = await req.user;
    res.json(user);
  }
);

profileRouter.get(
  "/publicData",
  userProfileController.getProfileDataById
);

profileRouter.get("/myLikes", userProfileController.getLikesByUserId);

profileRouter.get("/comments/myLikes", userProfileController.getCommentLikesByUserId);

profileRouter.get("/:username", userProfileController.getProfileByUsername);


//need to log user out then delete user
profileRouter.delete("/", userProfileController.deleteProfileById);

module.exports = profileRouter;