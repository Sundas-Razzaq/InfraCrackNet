const Joi = require("joi");
const {
    validateRequestBody,
    validateRequestParams,
    validateRequestQuery,
} = require("../middleware/authMiddleware");

const objectId = Joi.string().hex().length(24);

const STRUCTURE_TYPES = ["Bridge", "Building", "Road"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const STATUSES = ["Active", "On Hold", "Completed"];

const createProjectSchema = Joi.object({
    name: Joi.string().trim().max(100).required().messages({
        "string.empty": "Project name is required.",
        "string.max": "Project name cannot exceed 100 characters.",
        "any.required": "Project name is required.",
    }),
    description: Joi.string().trim().max(1000).required().messages({
        "string.empty": "Project description is required.",
        "string.max": "Project description cannot exceed 1000 characters.",
        "any.required": "Project description is required.",
    }),
    structureType: Joi.string()
        .valid(...STRUCTURE_TYPES)
        .required()
        .messages({
            "any.only": "Structure type must be Bridge, Building, or Road.",
            "any.required": "Structure type is required.",
        }),
    location: Joi.string().trim().max(200).required().messages({
        "string.empty": "Project location is required.",
        "string.max": "Project location cannot exceed 200 characters.",
        "any.required": "Project location is required.",
    }),
    priority: Joi.string()
        .valid(...PRIORITIES)
        .required()
        .messages({
            "any.only": "Priority must be Low, Medium, High, or Critical.",
            "any.required": "Project priority is required.",
        }),
    status: Joi.string().valid(...STATUSES),
    teamId: objectId.messages({
        "string.hex": "Invalid teamId.",
        "string.length": "Invalid teamId.",
    }),
});

const updateProjectSchema = Joi.object({
    name: Joi.string().trim().max(100),
    description: Joi.string().trim().max(1000),
    structureType: Joi.string().valid(...STRUCTURE_TYPES),
    location: Joi.string().trim().max(200),
    priority: Joi.string().valid(...PRIORITIES),
    status: Joi.string().valid(...STATUSES),
})
    .min(1)
    .messages({ "object.min": "Provide at least one field to update." });

const listProjectsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(100),
    status: Joi.string().valid(...STATUSES),
    structureType: Joi.string().valid(...STRUCTURE_TYPES),
    priority: Joi.string().valid(...PRIORITIES),
    teamId: objectId,
    assignment: Joi.string().valid("assigned", "unassigned"),
    sort: Joi.string().valid("newest", "oldest", "name").default("newest"),
});

const projectIdParamSchema = Joi.object({
    id: objectId.required(),
});

const assignTeamSchema = Joi.object({
    teamId: objectId.required().messages({
        "any.required": "teamId is required.",
        "string.hex": "Invalid teamId.",
        "string.length": "Invalid teamId.",
    }),
});

const deleteProjectQuerySchema = Joi.object({
    confirm: Joi.string().trim().required().messages({
        "any.required":
            "Add ?confirm=<projectCode> to confirm the deletion.",
        "string.empty":
            "Add ?confirm=<projectCode> to confirm the deletion.",
    }),
});

module.exports = {
    createAdminProjectValidation: validateRequestBody(createProjectSchema),
    updateAdminProjectValidation: validateRequestBody(updateProjectSchema),
    listAdminProjectsValidation: validateRequestQuery(listProjectsSchema),
    projectIdParamValidation: validateRequestParams(projectIdParamSchema),
    assignTeamValidation: validateRequestBody(assignTeamSchema),
    deleteProjectQueryValidation: validateRequestQuery(deleteProjectQuerySchema),
};