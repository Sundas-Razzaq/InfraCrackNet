const Joi = require("joi");
const { validateRequestBody } = require("../middleware/authMiddleware");

/* UPLOAD INSPECTION IMAGES */

const uploadInspectionImagesSchema = Joi.object({
    inspection: Joi.string()
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
const requestAnalysisSchema = Joi.object({});

/* VALIDATION MIDDLEWARE */

const uploadInspectionImagesValidation =
    validateRequestBody(uploadInspectionImagesSchema);

const requestAnalysisValidation =
    validateRequestBody(requestAnalysisSchema);

module.exports = {
    uploadInspectionImagesSchema,
    uploadInspectionImagesValidation,
    requestAnalysisSchema,
    requestAnalysisValidation,
};