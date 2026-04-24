const Joi = require("joi");

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

const validateRequestBody = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        return res.status(400).json({
            message: "Validation failed",
            errors: error.details.map((detail) => detail.message),
        });
    }

    return next();
};

const signupValidation = validateRequestBody(signupSchema);

module.exports = {
    signupSchema,
    validateRequestBody,
    signupValidation,
};
