const express = require("express");
const passport = require("passport");
const profileRouter = express.Router();
const userProfileController = require("../controllers/userProfileController");
const { authenticateToken } = require("../utils");

profileRouter.use("/", passport.authenticate("jwt", {session: false}));

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

profileRouter.get("/:username", userProfileController.getProfileByUsername);


//need to log user out then delete user
profileRouter.delete("/",  async (req, res, next) => { 
    const user = await req.user;
    req.body.userId = user.id;
    req.logout((error) => {
        if (error) {
            return next(error);
        }
    }); 
    next();
}, userProfileController.deleteProfileById );
profileRouter.delete("/", userProfileController.deleteProfileById );

module.exports = profileRouter;