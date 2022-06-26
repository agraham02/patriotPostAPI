const pool = require("../models/database");
const passport = require("passport");
const bcrypt = require("bcrypt");
const queries = require("../models/queries");

const passwordHash = async (password, saltRounds) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw error;
    }
}

const logIn = async (req, res, next) => {
    
}

const register = async (req, res, next) => {
    console.log("Hello");
    const { firstName, lastName, username, password } = req.body;
    const birthDate = new Date("May 11, 2002");
    try {
        //check if user with given username already exists
        const existingUser = await queries.users.getUserByUsername(username);
        if (existingUser) {
            throw new Error("User with that username already exists");
        }
        const hashedPassword = await passwordHash(password, 10);
        await queries.users.insertNewUser(firstName, lastName, username, hashedPassword, birthDate);
        res.send("New user added");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    logIn,
    register,
}