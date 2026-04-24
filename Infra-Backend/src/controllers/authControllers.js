const User = require("../models/user");
const { signupSchema } = require("../validations/authValidation");
const { hashPassword } = require("../services/authService");

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

        return res.status(201).json({
            message: "User registered successfully",
            user: userData,
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
};
