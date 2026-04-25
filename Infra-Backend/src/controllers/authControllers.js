const User = require("../models/user");
const { signupSchema } = require("../validations/authValidation");
const crypto = require("crypto");
const {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generatePasswordResetToken,
} = require("../services/authService");
const { sendPasswordResetEmail } = require("../services/emailService");

const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });
};

const clearAuthCookie = (res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
};

const signup = async (req, res) => {
    try {
        const { error, value } = signupSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.details.map((detail) => detail.message),
            });
        }

        const normalizedEmail = value.email.toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await hashPassword(value.password);

        const user = await User.create({
            name: value.name,
            email: normalizedEmail,
            password: hashedPassword,
        });

        const userData = user.toObject();
        delete userData.password;

        const token = generateAccessToken(user);
        setAuthCookie(res, token);

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: userData,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const email = req.body?.email?.toLowerCase?.().trim();
        const password = req.body?.password;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = generateAccessToken(user);
        setAuthCookie(res, token);

        const userData = user.toObject();
        delete userData.password;

        return res.status(200).json({
            message: "Login successful",
            token,
            user: userData,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const logout = async (req, res) => {
    try {
        clearAuthCookie(res);

        return res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const email = String(req.body?.email || "").trim().toLowerCase();

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            const resetToken = await generatePasswordResetToken(user);

            try {
                await sendPasswordResetEmail({
                    to: user.email,
                    name: user.name,
                    token: resetToken,
                });
            } catch (mailError) {
                console.error("Password reset email failed:", mailError);
            }
        }

        return res.status(200).json({
            message:
                "If an account exists for that email, a password reset link has been sent.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const token = req.params?.token;

        if (!token) {
            return res.status(400).json({
                message: "Reset token is required",
            });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Password reset token is invalid or has expired",
            });
        }

        const newPassword = req.body?.password;

        user.password = await hashPassword(newPassword);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password has been reset successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
    signup,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
};
