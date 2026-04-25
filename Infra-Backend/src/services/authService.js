const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

    if (!secret) {
        throw new Error("JWT secret is not configured");
    }

    return secret;
};

const hashPassword = async (password) => {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
    return bcrypt.hash(password, saltRounds);
};

const comparePassword = async (plainPassword, hashedPassword) =>
    bcrypt.compare(plainPassword, hashedPassword);

const generateAccessToken = (user) => {
    const payload = {
        userId: user._id || user.id,
        role: user.role,
    };

    return jwt.sign(payload, getJwtSecret(), { expiresIn: "1d" });
};

const verifyToken = (token) => jwt.verify(token, getJwtSecret());

// Backward-compatible alias for existing usages.
const generateToken = generateAccessToken;

module.exports = {
    hashPassword,
    comparePassword,
    generateAccessToken,
    verifyToken,
    generateToken,
};
