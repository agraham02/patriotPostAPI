const bcrypt = require("bcrypt");
const pool = require("./models/database");
const queries = require("./models/queries");
const LocalStrategy = require("passport-local").Strategy;

const comparePasswords = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch(error) {
        throw error;
    }
};

function initializePassport(passport) {
    const authenticateUser = async (username, password, done) => {
        try {
            const user = await queries.users.getUserByUsername(username);
            if (!user) {
                console.log("User not found");
                return done(null, false, { message: "User not found" });
            }
            if (await comparePasswords(password, user.password_hashed)) {
                //update last login in database
                console.log("Authentication successful");
                return done(null, user);
            }
            else {
                console.log("Password is incorrect");
                return done(null, false, { message: "Password is incorrect" });
            }
        } catch (error) {
            return done(error);
        }
    }
    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await queries.users.getUserById(id);
            done(null, user);
        } catch (error) {
            
        }
    });
}

module.exports = initializePassport;