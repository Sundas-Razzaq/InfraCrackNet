const Joi = require("joi");
const {
    validateRequestBody,
    validateRequestParams,
    validateRequestQuery,
} = require("../middleware/authMiddleware");

const objectId = Joi.string().hex().length(24);

const createTeamSchema = Joi.object({
    name: Joi.string().trim().min(2).max(80).required().messages({
        "string.min": "Team name must be at least 2 characters.",
        "string.max": "Team name cannot exceed 80 characters.",
        "string.empty": "Team name is required.",
        "any.required": "Team name is required.",
    }),
    description: Joi.string().trim().max(500).allow(""),
});

const updateTeamSchema = Joi.object({
    name: Joi.string().trim().min(2).max(80),
    description: Joi.string().trim().max(500).allow(""),
})
    .min(1)
    .messages({ "object.min": "Provide a name or a description to update." });

const listTeamsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(100),
    status: Joi.string().valid("Active", "Inactive"),
    hasLead: Joi.boolean(),
    sort: Joi.string().valid("newest", "oldest", "name").default("newest"),
});

const availableMembersSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    role: Joi.string().valid("Inspector", "Engineer").default("Inspector"),
    search: Joi.string().trim().max(100),
});

const teamIdParamSchema = Joi.object({
    id: objectId.required(),
});

const teamMemberParamSchema = Joi.object({
    id: objectId.required(),
    userId: objectId.required(),
});

const setLeadSchema = Joi.object({
    engineerId: objectId.required().messages({
        "any.required": "engineerId is required.",
        "string.hex": "Invalid engineerId.",
        "string.length": "Invalid engineerId.",
    }),
});

const addMemberSchema = Joi.object({
    userId: objectId.required().messages({
        "any.required": "userId is required.",
        "string.hex": "Invalid userId.",
        "string.length": "Invalid userId.",
    }),
});

const teamStatusSchema = Joi.object({
    status: Joi.string().valid("Active", "Inactive").required().messages({
        "any.only": "Status must be Active or Inactive.",
        "any.required": "Status is required.",
    }),
});

module.exports = {
    createTeamValidation: validateRequestBody(createTeamSchema),
    updateTeamValidation: validateRequestBody(updateTeamSchema),
    listTeamsValidation: validateRequestQuery(listTeamsSchema),
    availableMembersValidation: validateRequestQuery(availableMembersSchema),
    teamIdParamValidation: validateRequestParams(teamIdParamSchema),
    teamMemberParamValidation: validateRequestParams(teamMemberParamSchema),
    setLeadValidation: validateRequestBody(setLeadSchema),
    addMemberValidation: validateRequestBody(addMemberSchema),
    teamStatusValidation: validateRequestBody(teamStatusSchema),
};