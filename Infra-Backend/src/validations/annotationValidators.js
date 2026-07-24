const Joi = require("joi");

const {
    validateRequestBody,
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

const crackIdSchema = Joi.object({
    crackId: Joi.string()
        .trim()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.base": "Crack ID must be a string.",
            "string.empty": "Crack ID is required.",
            "string.hex": "Invalid Crack ID.",
            "string.length": "Invalid Crack ID.",
            "any.required": "Crack ID is required.",
        }),
});

// UPDATE CRACK

const updateCrackSchema = Joi.object({
    crackClass: Joi.string()
        .valid(
            "Longitudinal",
            "Transverse",
            "Diagonal",
            "Alligator",
            "Pothole",
            "Surface",
            "Other"
        ),

    severity: Joi.string()
        .valid(
            "Low",
            "Medium",
            "High",
            "Critical"
        ),

    reviewedSeverity: Joi.string()
        .valid(
            "Low",
            "Medium",
            "High",
            "Critical"
        ),

    width: Joi.number().min(0),

    length: Joi.number().min(0),

    area: Joi.number().min(0),

    reviewComments: Joi.string()
        .trim()
        .max(1000),

    boundingBox: Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required(),
        width: Joi.number().positive().required(),
        height: Joi.number().positive().required(),
    }),
}).min(1);

// ADD MANUAL CRACK

const addManualCrackSchema = Joi.object({
    analysis: Joi.string()
        .trim()
        .hex()
        .length(24)
        .required(),

    inspectionImage: Joi.string()
        .trim()
        .hex()
        .length(24)
        .required(),

    crackClass: Joi.string()
        .valid(
            "Longitudinal",
            "Transverse",
            "Diagonal",
            "Alligator",
            "Pothole",
            "Surface",
            "Other"
        )
        .required(),

    severity: Joi.string()
        .valid(
            "Low",
            "Medium",
            "High",
            "Critical"
        )
        .required(),

    width: Joi.number()
        .min(0)
        .required(),

    length: Joi.number()
        .min(0)
        .required(),

    area: Joi.number()
        .min(0)
        .required(),

    boundingBox: Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required(),
        width: Joi.number().positive().required(),
        height: Joi.number().positive().required(),
    }).required(),

    reviewComments: Joi.string()
        .trim()
        .max(1000)
        .allow("")
});

//MIDDLEWARE

const analysisIdValidation =
    validateRequestParams(analysisIdSchema);

const crackIdValidation =
    validateRequestParams(crackIdSchema);

const updateCrackValidation =
    validateRequestBody(updateCrackSchema);

const addManualCrackValidation =
    validateRequestBody(addManualCrackSchema);

module.exports = {
    analysisIdValidation,
    crackIdValidation,
    updateCrackValidation,
    addManualCrackValidation,
};