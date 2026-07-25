const Joi = require("joi");

const {
    validateRequestParams,
} = require("../middleware/authMiddleware");

// PARAM VALIDATIONS

const analysisIdSchema = Joi.object({
    analysisId: Joi.string()
        .trim()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.base": "Analysis ID must be a string.",
            "string.empty": "Analysis ID is required.",
            "string.hex": "Invalid Analysis ID.",
            "string.length": "Invalid Analysis ID.",
            "any.required": "Analysis ID is required.",
        }),
});

const reportIdSchema = Joi.object({
    reportId: Joi.string()
        .trim()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.base": "Report ID must be a string.",
            "string.empty": "Report ID is required.",
            "string.hex": "Invalid Report ID.",
            "string.length": "Invalid Report ID.",
            "any.required": "Report ID is required.",
        }),
});

// MIDDLEWARE

const analysisIdValidation =
    validateRequestParams(analysisIdSchema);

const reportIdValidation =
    validateRequestParams(reportIdSchema);

module.exports = {
    analysisIdValidation,
    reportIdValidation,
};