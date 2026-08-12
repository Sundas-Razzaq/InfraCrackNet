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
const rejectAnalysisValidation = (req, res, next) => {
    const schema = Joi.object({
        rejectionReason: Joi.string()
            .trim()
            .min(1)
            .max(1000)
            .required()
            .messages({
                "any.required":
                    "Rejection reason is required.",
                "string.empty":
                    "Rejection reason is required.",
                "string.min":
                    "Rejection reason is required.",
                "string.max":
                    "Rejection reason cannot exceed 1000 characters.",
            }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};
/* VALIDATION */

const startAnalysisValidation =
    validateRequestParams(startAnalysisSchema);

module.exports = {
    startAnalysisSchema,
    startAnalysisValidation,
    rejectAnalysisValidation,
};