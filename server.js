const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const passport = require("passport");
const initializePassport = require("./passportConfig");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./models/database");

const postsRouter = require("./routes/posts");
const logInRouter = require("./routes/logIn");
const profileRouter = require("./routes/profile");

const path = require("path");

const app = express();

initializePassport(passport);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        // secure: true,
        // sameSite: true
    },
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
        pool: pool,
        tableName: "user_session",
        createTableIfMissing: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

app.use("/posts", postsRouter);
app.use("/profile", profileRouter);
app.use("/", logInRouter);

// if (process.env.NODE_ENV === "production") { //Might not need cuz Im just doing backend
//     //server static content
//     //npm run build
//     app.use(express.static(path.join(__dirname, "client/build")));
// }
// console.log(__dirname);

app.get("/", (req, res) => {
    res.send("Patriot Posts!");
});

app.get("*", (req, res) => {
    res.send("That path does not exists");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})