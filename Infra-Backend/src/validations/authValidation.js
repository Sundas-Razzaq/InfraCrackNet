const Joi = require("joi");
const { validateRequestBody } = require("../middleware/authMiddleware");

const signupSchema = Joi.object({
    name: Joi.string().trim().min(3).required().messages({
        "string.base": "Name must be a string.",
        "string.empty": "Name is required.",
        "string.min": "Name must be at least 3 characters long.",
        "any.required": "Name is required.",
    }),
    email: Joi.string().trim().email().required().messages({
        "string.base": "Email must be a string.",
        "string.empty": "Email is required.",
        "string.email": "Please provide a valid email address.",
        "any.required": "Email is required.",
    }),
    password: Joi.string().min(6).pattern(/\d/).required().messages({
        "string.base": "Password must be a string.",
        "string.empty": "Password is required.",
        "string.min": "Password must be at least 6 characters long.",
        "string.pattern.base": "Password must contain at least one number.",
        "any.required": "Password is required.",
    }),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        "string.base": "Email must be a string.",
        "string.empty": "Email is required.",
        "string.email": "Please provide a valid email address.",
        "any.required": "Email is required.",
    }),
});

const resetPasswordSchema = Joi.object({
    password: Joi.string().min(6).pattern(/\d/).required().messages({
        "string.base": "Password must be a string.",
        "string.empty": "Password is required.",
        "string.min": "Password must be at least 6 characters long.",
        "string.pattern.base": "Password must contain at least one number.",
        "any.required": "Password is required.",
    }),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
        "any.only": "Confirm password must match password.",
        "string.empty": "Confirm password is required.",
        "any.required": "Confirm password is required.",
    }),
});

const signupValidation = validateRequestBody(signupSchema);
const forgotPasswordValidation = validateRequestBody(forgotPasswordSchema);
const resetPasswordValidation = validateRequestBody(resetPasswordSchema);

module.exports = {
    signupSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    validateRequestBody,
    signupValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
};
