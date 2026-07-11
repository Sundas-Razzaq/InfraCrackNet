const Joi = require("joi");
const { validateRequestBody } = require("../middleware/authMiddleware");

/* UPDATE PROFILE */

const updateProfileSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .required()
        .messages({
            "string.base": "Name must be a string.",
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 3 characters long.",
            "any.required": "Name is required.",
        }),

    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.base": "Email must be a string.",
            "string.empty": "Email is required.",
            "string.email": "Please provide a valid email address.",
            "any.required": "Email is required.",
        }),

    phone: Joi.string()
        .trim()
        .allow("")
        .max(20)
        .messages({
            "string.max":
                "Phone number cannot exceed 20 characters.",
        }),

    organization: Joi.string()
        .trim()
        .allow("")
        .max(100)
        .messages({
            "string.max":
                "Organization cannot exceed 100 characters.",
        }),

    position: Joi.string()
        .trim()
        .allow("")
        .max(100)
        .messages({
            "string.max":
                "Position cannot exceed 100 characters.",
        }),

    bio: Joi.string()
        .trim()
        .allow("")
        .max(500)
        .messages({
            "string.max":
                "Bio cannot exceed 500 characters.",
        }),
});

/* CHANGE PASSWORD */

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            "string.empty": "Current password is required.",
            "any.required": "Current password is required.",
        }),

    newPassword: Joi.string()
        .min(6)
        .pattern(/\d/)
        .required()
        .messages({
            "string.min":
                "Password must be at least 6 characters long.",
            "string.pattern.base":
                "Password must contain at least one number.",
            "any.required":
                "New password is required.",
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only":
                "Confirm password must match the new password.",
            "any.required":
                "Confirm password is required.",
        }),
});

/* VALIDATION MIDDLEWARE */

const updateProfileValidation =
    validateRequestBody(updateProfileSchema);

const changePasswordValidation =
    validateRequestBody(changePasswordSchema);

module.exports = {
    updateProfileSchema,
    updateProfileValidation,
    changePasswordSchema,
    changePasswordValidation,
};