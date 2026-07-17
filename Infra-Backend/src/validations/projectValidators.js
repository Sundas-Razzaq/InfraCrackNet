const Joi = require("joi");
const { validateRequestBody } = require("../middleware/authMiddleware");

/* CREATE PROJECT */

const createProjectSchema = Joi.object({
    name: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            "string.base": "Project name must be a string.",
            "string.empty": "Project name is required.",
            "string.max": "Project name cannot exceed 100 characters.",
            "any.required": "Project name is required.",
        }),

    description: Joi.string()
        .trim()
        .max(1000)
        .required()
        .messages({
            "string.base": "Project description must be a string.",
            "string.empty": "Project description is required.",
            "string.max": "Project description cannot exceed 1000 characters.",
            "any.required": "Project description is required.",
        }),

    structureType: Joi.string()
        .valid("Bridge", "Building", "Road")
        .required()
        .messages({
            "any.only": "Structure type must be Bridge, Building, or Road.",
            "any.required": "Structure type is required.",
        }),

    location: Joi.string()
        .trim()
        .max(200)
        .required()
        .messages({
            "string.base": "Project location must be a string.",
            "string.empty": "Project location is required.",
            "string.max": "Project location cannot exceed 200 characters.",
            "any.required": "Project location is required.",
        }),

    priority: Joi.string()
        .valid("Low", "Medium", "High", "Critical")
        .required()
        .messages({
            "any.only": "Priority must be Low, Medium, High, or Critical.",
            "any.required": "Project priority is required.",
        }),

    status: Joi.string()
        .valid("Active", "On Hold", "Completed")
        .optional()
        .messages({
            "any.only": "Status must be Active, On Hold, or Completed.",
        }),
});

/* UPDATE PROJECT */

const updateProjectSchema = Joi.object({
    name: Joi.string()
        .trim()
        .max(100)
        .messages({
            "string.base": "Project name must be a string.",
            "string.max": "Project name cannot exceed 100 characters.",
        }),

    description: Joi.string()
        .trim()
        .max(1000)
        .messages({
            "string.base": "Project description must be a string.",
            "string.max": "Project description cannot exceed 1000 characters.",
        }),

    structureType: Joi.string()
        .valid("Bridge", "Building", "Road")
        .messages({
            "any.only": "Structure type must be Bridge, Building, or Road.",
        }),

    location: Joi.string()
        .trim()
        .max(200)
        .messages({
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

/* VALIDATION MIDDLEWARE */

const createProjectValidation =
    validateRequestBody(createProjectSchema);

const updateProjectValidation =
    validateRequestBody(updateProjectSchema);

module.exports = {
    createProjectSchema,
    createProjectValidation,
    updateProjectSchema,
    updateProjectValidation,
};