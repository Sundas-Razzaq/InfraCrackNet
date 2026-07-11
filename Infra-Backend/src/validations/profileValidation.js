const Joi = require("joi");
const { validateRequestBody } = require("../middleware/authMiddleware");

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

const updateProfileValidation =
    validateRequestBody(updateProfileSchema);

module.exports = {
    updateProfileSchema,
    updateProfileValidation,
};