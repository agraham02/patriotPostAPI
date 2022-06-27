const express = require("express");
const passport = require("passport");
const logInRouter = express.Router();
const logInController = require("../controllers/logInController");

logInRouter.get("/login", (req, res) => {
  res.send("Login Page");
});

logInRouter.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Getting profile...");
  res.redirect("/profile");
});

logInRouter.post("/register", logInController.register);

logInRouter.post("/logout", (req, res, next) => {
  req.logOut((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
});

module.exports = logInRouter;
