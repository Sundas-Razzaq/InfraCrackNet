const Joi = require("joi");
const { validateRequestBody } = require("../middleware/authMiddleware");

/* UPDATE PROJECT (Engineer: apni team ke project ki details) */
const updateProjectSchema = Joi.object({
    name: Joi.string().trim().max(100).messages({
        "string.base": "Project name must be a string.",
        "string.max": "Project name cannot exceed 100 characters.",
    }),

    description: Joi.string().trim().max(1000).messages({
        "string.base": "Project description must be a string.",
        "string.max": "Project description cannot exceed 1000 characters.",
    }),

    structureType: Joi.string()
        .valid("Bridge", "Building", "Road")
        .messages({
            "any.only": "Structure type must be Bridge, Building, or Road.",
        }),

    location: Joi.string().trim().max(200).messages({
        "string.base": "Project location must be a string.",
        "string.max": "Project location cannot exceed 200 characters.",
    }),

    priority: Joi.string()
        .valid("Low", "Medium", "High", "Critical")
        .messages({
            "any.only": "Priority must be Low, Medium, High, or Critical.",
        }),

    status: Joi.string()
        .valid("Active", "On Hold", "Completed")
        .messages({
            "any.only": "Status must be Active, On Hold, or Completed.",
        }),
});

const updateProjectValidation = validateRequestBody(updateProjectSchema);

module.exports = {
    updateProjectSchema,
    updateProjectValidation,
};