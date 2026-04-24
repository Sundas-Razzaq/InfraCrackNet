const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => bcrypt.hash(password, 10);

const comparePassword = async (plainPassword, hashedPassword) =>
    bcrypt.compare(plainPassword, hashedPassword);

const generateToken = (payload, options = {}) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    const tokenOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        ...options,
    };

    return jwt.sign(payload, secret, tokenOptions);
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
};
