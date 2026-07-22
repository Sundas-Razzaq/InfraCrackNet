const Joi = require("joi");
const { validateRequestParams } = require("../middleware/authMiddleware");

/* START AI ANALYSIS */

const startAnalysisSchema = Joi.object({
    inspectionId: Joi.string()
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

/* VALIDATION */

const startAnalysisValidation =
    validateRequestParams(startAnalysisSchema);

module.exports = {
    startAnalysisSchema,
    startAnalysisValidation,
};