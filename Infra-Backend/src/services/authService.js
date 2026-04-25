const bcrypt = require("bcryptjs");
const crypto = require("crypto");
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

const generatePasswordResetToken = async (user, expiryMinutes = 15) => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + expiryMinutes * 60 * 1000;

    await user.save();

    return resetToken;
};

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
    generatePasswordResetToken,
    generateAccessToken,
    verifyToken,
    generateToken,
};
