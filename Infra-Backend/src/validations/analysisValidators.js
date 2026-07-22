const Joi = require('joi');
const { validateRequestBody } = require('../middleware/authMiddleware');

// start analysis
const startAnalysisSchema = joi.object({
    inspection: joi.string()
        .trim()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.base": "Inspection ID must be a string.",
            "string.empty": "Inspection ID is required.",
            "string.hex": "Invalid Inspection ID.",
            "string.length": "Invalid Inspection ID.",
            "any.required": "Inspection ID is required.",
        }),
});

// validationn
const startAnalysisValidation =
    validateRequestBody(startAnalysisSchema);

module.exports = {
    startAnalysisSchema,
    startAnalysisValidation,
};